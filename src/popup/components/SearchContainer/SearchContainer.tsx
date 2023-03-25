import { AxiosError, CanceledError as AxiosCanceledError } from 'axios';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  BooleanParam,
  StringParam,
  useQueryParam,
  withDefault,
} from 'use-query-params';
import { alertError, isPopup as isPopupFn } from '../../../utils';
import { SORT_BY } from '../../constants';
import { debouncedSearch, EmptySearchResultsError } from '../../search';
import { EmptySearchResultsCallout } from '../Callout/EmptySearchResults/EmptySearchResults';
import { SearchBox } from '../SearchBox/SearchBox';
import { Sort } from '../Sorts/Sorts';
import { Filter } from './../Filters/Filters';
import { Footer } from './../Footer/Footer';
import { Items } from './../Items/Items';
import './styles.pcss';

export const SearchContainer = memo(function SearchContainer({
  workspace,
  lastSearchResult,
}: {
  workspace: Workspace;
  lastSearchResult: LastSearchResult | undefined;
}) {
  const [query, setQuery] = useQueryParam(
    'query',
    withDefault(StringParam, lastSearchResult?.query || ''),
  );
  const [sortBy, setSortBy] = useQueryParam(
    'sort_by',
    withDefault(StringParam, SORT_BY.RELEVANCE),
  );
  const [filterByOnlyTitles, setFilterOnlyTitles] = useQueryParam(
    'only_titles',
    withDefault(BooleanParam, false),
  );

  const [usedQuery, setUsedQuery] = useState(lastSearchResult?.query || '');
  const [searchResult, setSearchResult] = useState<SearchResult | undefined>(
    lastSearchResult?.searchResult,
  );

  const [errorToDisplay, setErrorToDiplay] = useState<Error | undefined>(
    undefined,
  );
  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const isPopup = useMemo(isPopupFn, []);
  const isFirstRendering = useRef(true);

  // search
  useEffect(() => {
    (async () => {
      // FIXME: どうしようねこれ ... 。
      // if (query.trim() === '') {
      //   console.log('## clear store');
      //   await storage.remove(`${workspace.id}-${STORAGE_KEY.LAST_SEARCHED}`);
      // }

      try {
        if (isFirstRendering.current) {
          isFirstRendering.current = false;
          if (lastSearchResult) return;
        }

        const searchResult = await debouncedSearch({
          query,
          sortBy:
            !hasQuery && sortBy === SORT_BY.RELEVANCE // ad hoc: worthless condition
              ? SORT_BY.CREATED // LAST_EDITED is also fine
              : sortBy,
          filterByOnlyTitles,
          savesToStorage: isPopup && hasQuery,
          workspaceId: workspace.id,
        });
        setSearchResult(searchResult);
        setUsedQuery(query);
        if (searchResult.total > 0) setErrorToDiplay(undefined);
      } catch (error) {
        if (error instanceof EmptySearchResultsError) {
          setErrorToDiplay(error);
        } else if (!(error instanceof AxiosCanceledError)) {
          alertError(
            error instanceof AxiosError ? 'Network error' : error + '',
            error,
          );
          throw error;
        }
      }
    })();
  }, [trimmedQuery, sortBy, filterByOnlyTitles]);

  return (
    <div className={`container ${isPopup ? 'is-popup' : ''}`}>
      <main>
        <SearchBox
          query={query}
          setQuery={setQuery}
          workspaceName={workspace.name}
          hasLastSearchQuery={!!lastSearchResult}
        />
        {errorToDisplay &&
          errorToDisplay instanceof EmptySearchResultsError && (
            <EmptySearchResultsCallout workspace={workspace} />
          )}
        <Filter
          filterByOnlyTitles={filterByOnlyTitles}
          setFilterOnlyTitles={setFilterOnlyTitles}
        />
        <Sort sortBy={sortBy} setSortBy={setSortBy} />
        <Items items={searchResult?.items || []} query={usedQuery} />
        <Footer
          total={searchResult?.total || 0}
          showsSummary={!!searchResult && usedQuery.trim().length > 0}
        />
      </main>
    </div>
  );
});
