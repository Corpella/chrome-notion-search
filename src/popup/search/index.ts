import { debounce } from 'throttle-debounce';
import { axios } from '../../axios';
import { NOTION_BASE_URL } from '../../constants';
import { storage } from '../../storage';

import { ICON_TYPE, SEARCH_LIMIT, SORT_BY, STORAGE_KEY } from '../constants';
import { AbortControllers } from './AbortsController';
import { Record } from './Record';
import { Block } from './Record/Block';
import { createBlock, createRecord } from './Record/factory';

const PATH = '/search';
const DEBOUNCE_TIME = 150;
const ICON_WIDTH = 40;
const TEXT_NO_TITLE = 'Untitled';

export class EmptySearchResultsError extends Error {}

const AbortsController = new AbortControllers();

const getDir = (
  paths: Dir[],
  id: string,
  tableType: SearchApi.TableType,
  recordMap: SearchApi.RecordMap,
): Dir[] => {
  let record: Record | undefined;
  try {
    record = createRecord(id, tableType, recordMap);
    if (record.canBeDir())
      paths.push({
        title: record.title || TEXT_NO_TITLE,
        record: record.record,
      });

    const parent = record.parent;
    if (parent.isWorkspace) return paths;

    return getDir(paths, parent.id, parent.tableType, recordMap);
  } catch (error) {
    // Mostly parent_id are undefined, so don't look up any more parents
    console.error(error, {
      id,
      tableType,
      record: JSON.stringify(record),
    });
    console.info({ record, recordMap });
    return paths;
  }
};

const buildIcon = (icon: string | undefined, id: string) => {
  if (!icon)
    return {
      type: ICON_TYPE.IMAGE,
      value: chrome.runtime.getURL('./images/page.svg'),
    };

  if (icon.startsWith('http')) {
    // uploaded by user
    return {
      type: ICON_TYPE.IMAGE,
      value:
        `${NOTION_BASE_URL}/image/${encodeURIComponent(icon)}?` +
        new URLSearchParams({
          table: 'block',
          id,
          width: String(ICON_WIDTH),
        }),
    };
  } else if (icon.startsWith('/')) {
    // custom svg
    return {
      type: ICON_TYPE.IMAGE,
      value: `${NOTION_BASE_URL}${icon}`,
    };
  } else {
    // emoji or others. TODO: detect others
    return {
      type: ICON_TYPE.EMOJI,
      value: icon,
    };
  }
};

// NOTE: Log guideline:
//   Most of the blocks/records recorded directly under search() are undefined,
//   so record/block must be logged inside each Record module
export const search = async ({
  query,
  sortBy,
  filterByOnlyTitles,
  savesToStorage,
  workspaceId,
}: {
  query: string;
  sortBy: string;
  filterByOnlyTitles: boolean;
  savesToStorage: boolean;
  workspaceId: string;
}) => {
  if (!workspaceId) throw new Error('spaceId is empty');
  const trimmedQuery = query.trim();

  let sortOptions = {};
  switch (sortBy) {
    case SORT_BY.RELEVANCE:
      sortOptions = { field: 'relevance' };
      break;
    case SORT_BY.LAST_EDITED:
      sortOptions = { field: 'lastEdited', direction: 'desc' };
      break;
    case SORT_BY.CREATED:
      sortOptions = { field: 'created', direction: 'desc' };
      break;
    default:
      throw new Error(`Unknown sort option: ${sortBy}`);
  }

  const [abortController, current] = AbortsController.create(trimmedQuery);

  const res = (
    await axios.post<SearchApiResponse>(
      PATH,
      {
        type: 'BlocksInSpace',
        query: trimmedQuery,
        spaceId: workspaceId,
        limit: SEARCH_LIMIT,
        filters: {
          isDeletedOnly: false,
          excludeTemplates: false,
          isNavigableOnly: false,
          requireEditPermissions: false,
          ancestors: [],
          createdBy: [],
          editedBy: [],
          lastEditedTime: {},
          createdTime: {},
          ...(filterByOnlyTitles ? { navigableBlockContentOnly: true } : {}),
        },
        sort: sortOptions,
        source: 'quick_find_input_change',
      },
      {
        signal: abortController.signal,
      },
    )
  ).data;

  AbortsController.abortPast(current);

  // Known issue:
  //   In tab mode, the axios cache remains
  //   even if the cookie is set in another tab
  if (query === '' && res.results.length === 0)
    throw new EmptySearchResultsError();

  const recordMap = res.recordMap;
  const items: Item[] = [];
  for (const item of res.results) {
    let block: Block | undefined = undefined;

    const id = item.id;

    try {
      block = createBlock(id, recordMap);

      const result: Item = {
        title: block.title ?? TEXT_NO_TITLE,
        text: item.highlight?.text,
        block: block.record,
        dirs: block.parent.isWorkspace
          ? []
          : getDir(
              [],
              block.parent.id,
              block.parent.tableType,
              recordMap,
            ).reverse(),
        url:
          `${NOTION_BASE_URL}/${id.replaceAll('-', '')}` +
          (item.highlightBlockId
            ? `#${item.highlightBlockId.replaceAll('-', '')}`
            : ''),
        icon: buildIcon(block.icon, id),
      };

      // https://github.com/Cside/notion-search/issues/36
      if (result.block === undefined)
        throw new TypeError(`item.block is undefined`);

      items.push(result);
    } catch (error) {
      console.error(error, {
        id,
        item: JSON.stringify(item),
        block: JSON.stringify(block),
      });
      console.info({ item, block, recordMap });
    }
  }

  const searchResult: SearchResult = {
    items,
    total: res.total,
  };

  if (savesToStorage) {
    const data: SearchResultCache = { query, searchResult };
    // Failing to set is not fatal, so no error handling
    storage.set({
      [`${workspaceId}-${STORAGE_KEY.LAST_SEARCHED}`]: data,
    });
  }

  return searchResult;
};

export const debouncedSearch = debounce(search, DEBOUNCE_TIME);
