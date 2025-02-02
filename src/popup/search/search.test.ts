import { axios } from '../../axios';
import { NOTION_BASE_URL } from '../../constants';
import { ICON_TYPE, SORT_BY } from '../constants';
import { Block } from './Record/Block/Block';
import { BLOCK_TYPE, TABLE_TYPE } from './Record/constants';
import { search } from './search';

afterEach(() => jest.restoreAllMocks());

const BLOCK_ID = 'block-id';
const PARENT_ID = 'parent-id';
const GRANDPARENT_ID = 'grandparent-id';

describe('gets dirs', () => {
  test.each([
    {
      name: 'no ancestors',
      input: {
        block: {
          [BLOCK_ID]: {
            value: {
              id: BLOCK_ID,
              parent_id: PARENT_ID,
              parent_table: TABLE_TYPE.WORKSPACE,
              type: BLOCK_TYPE.PAGE,
            },
          },
        },
      },
      expected: [],
    },
    {
      name: 'single ancestor',
      input: {
        block: {
          [BLOCK_ID]: {
            value: {
              id: BLOCK_ID,
              parent_id: PARENT_ID,
              parent_table: TABLE_TYPE.BLOCK,
              type: BLOCK_TYPE.PAGE,
            },
          },
          [PARENT_ID]: {
            value: {
              id: PARENT_ID,
              parent_id: GRANDPARENT_ID,
              parent_table: TABLE_TYPE.WORKSPACE,
              type: BLOCK_TYPE.PAGE,
            },
          },
        },
      },
      expected: [`Title of ${PARENT_ID}`],
    },
    {
      name: 'multiple ancestors',
      input: {
        block: {
          [BLOCK_ID]: {
            value: {
              id: BLOCK_ID,
              parent_id: PARENT_ID,
              parent_table: TABLE_TYPE.BLOCK,
              type: BLOCK_TYPE.PAGE,
            },
          },
          [PARENT_ID]: {
            value: {
              id: PARENT_ID,
              parent_id: GRANDPARENT_ID,
              parent_table: TABLE_TYPE.BLOCK,
              type: BLOCK_TYPE.PAGE,
            },
          },
          [GRANDPARENT_ID]: {
            value: {
              id: GRANDPARENT_ID,
              parent_id: GRANDPARENT_ID,
              parent_table: TABLE_TYPE.WORKSPACE,
              type: BLOCK_TYPE.PAGE,
            },
          },
        },
      },
      expected: [`Title of ${GRANDPARENT_ID}`, `Title of ${PARENT_ID}`],
    },
    {
      name: 'skipped blocks',
      input: {
        block: {
          [BLOCK_ID]: {
            value: {
              id: BLOCK_ID,
              parent_id: PARENT_ID,
              parent_table: TABLE_TYPE.BLOCK,
              type: BLOCK_TYPE.PAGE,
            },
          },
          [PARENT_ID]: {
            value: {
              id: PARENT_ID,
              parent_id: GRANDPARENT_ID,
              parent_table: TABLE_TYPE.BLOCK,
              type: BLOCK_TYPE.COLUMN,
            },
          },
          [GRANDPARENT_ID]: {
            value: {
              id: GRANDPARENT_ID,
              parent_id: GRANDPARENT_ID,
              parent_table: TABLE_TYPE.WORKSPACE,
              type: BLOCK_TYPE.PAGE,
            },
          },
        },
      },
      expected: [`Title of ${GRANDPARENT_ID}`],
    },
  ])('$name', async ({ input, expected }) => {
    jest
      .spyOn(Block.prototype, 'title', 'get')
      .mockImplementation(function (this: Block) {
        return `Title of ${this.record.id}`;
      });

    jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        results: [{ id: BLOCK_ID }],
        recordMap: input,
        total: 0,
      },
    });
    const items = (
      await search({
        query: '',
        sortBy: SORT_BY.RELEVANCE,
        filterByOnlyTitles: false,
        savesToStorage: false,
        workspaceId: 'spaceId',
      })
    ).items[0];
    expect(items.dirs.map((dir) => dir.title)).toEqual(expected);
  });
});

const BLOCK: SearchApi.Block = {
  id: BLOCK_ID,
  parent_id: PARENT_ID,
  parent_table: TABLE_TYPE.BLOCK,
  type: BLOCK_TYPE.PAGE,
};
const PARENT_BLOCK: SearchApi.Block = {
  id: PARENT_ID,
  parent_id: GRANDPARENT_ID,
  parent_table: TABLE_TYPE.WORKSPACE,
  type: BLOCK_TYPE.PAGE,
};

describe('gets an icon', () => {
  test.each([
    {
      name: 'default',
      input: undefined,
      expected: () => ({
        type: ICON_TYPE.IMAGE,
        value: chrome.runtime.getURL('images/page.svg'),
      }),
    },
    {
      name: 'image (^http)',
      input: 'https://exmaple.com/icon.svg',
      expected: () => ({
        type: ICON_TYPE.IMAGE,
        value: `${NOTION_BASE_URL}/image/${encodeURIComponent(
          'https://exmaple.com/icon.svg',
        )}?table=block&id=${BLOCK_ID}&width=40`,
      }),
    },
    {
      name: 'image (^/)',
      input: '/icon.svg',
      expected: () => ({
        type: ICON_TYPE.IMAGE,
        value: `${NOTION_BASE_URL}/icon.svg`,
      }),
    },
    {
      name: 'emoji',
      input: '👌',
      expected: () => ({
        type: ICON_TYPE.EMOJI,
        value: '👌',
      }),
    },
  ])('$name', async ({ input, expected }) => {
    jest.spyOn(Block.prototype, 'icon', 'get').mockReturnValue(input);
    jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        results: [{ id: BLOCK_ID }],
        recordMap: {
          block: {
            [BLOCK_ID]: {
              value: BLOCK,
            },
            [PARENT_ID]: {
              value: PARENT_BLOCK,
            },
          },
        },
        total: 0,
      },
    });
    expect(
      (
        await search({
          query: '',
          sortBy: SORT_BY.RELEVANCE,
          filterByOnlyTitles: false,
          savesToStorage: false,
          workspaceId: 'spaceId',
        })
      ).items[0].icon,
    ).toEqual(expected());
  });
});
