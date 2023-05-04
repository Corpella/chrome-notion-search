import { AxiosError } from 'axios';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  BooleanParam,
  StringParam,
  useQueryParam,
  withDefault,
} from 'use-query-params';
import { storage } from '../../../storage';
import { handleError, isPopup } from '../../../utils';
import { SORT_BY, STORAGE_KEY } from '../../constants';
import { EmptySearchResultsError, debouncedSearch } from '../../search/search';
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

  const [errorToDisplay, setErrorToDisplay] = useState<Error | undefined>(
    undefined,
  );

  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const isFirstRendering = useRef(true);

  const currentUrl = useMemo(
    () => location.href,
    [query, sortBy, filterByOnlyTitles],
  );

  useEffect(() => {
    let ignore = false;

    (async () => {
      if (isFirstRendering.current) {
        isFirstRendering.current = false;
        if (lastSearchResult) return;
      } else {
        if (query.trim() === '')
          await storage.remove(`${workspace.id}-${STORAGE_KEY.LAST_SEARCHED}`);
      }

      let searchResult;
      try {
        searchResult = await debouncedSearch({
          query,
          sortBy:
            !hasQuery && sortBy === SORT_BY.RELEVANCE // ad hoc: worthless condition
              ? SORT_BY.CREATED // LAST_EDITED is also fine
              : sortBy,
          filterByOnlyTitles,
          savesToStorage: isPopup() && hasQuery,
          workspaceId: workspace.id,
        });
      } catch (error) {
        if (error instanceof EmptySearchResultsError) {
          setErrorToDisplay(error);
          return;
        } else {
          handleError(
            error instanceof AxiosError ? 'Network error' : error + '',
            error,
          );
          throw error; // TODO
        }
      }
      if (ignore) return;

      setSearchResult(searchResult);
      setUsedQuery(query);
      if (searchResult.total > 0) setErrorToDisplay(undefined);
    })();
    return () => {
      ignore = true;
    };
  }, [trimmedQuery, sortBy, filterByOnlyTitles]);

  return (
    <main>
      <SearchBox
        query={query}
        setQuery={setQuery}
        workspaceName={workspace.name}
        hasLastSearchQuery={!!lastSearchResult}
      />
      {errorToDisplay && errorToDisplay instanceof EmptySearchResultsError && (
        <EmptySearchResultsCallout workspace={workspace} />
      )}
      <Filter
        filterByOnlyTitles={filterByOnlyTitles}
        setFilterOnlyTitles={setFilterOnlyTitles}
      />
      <Sort sortBy={sortBy} setSortBy={setSortBy} />
      <Items items={searchResult?.items || []} query={usedQuery} />
      <Footer
        total={searchResult?.total ?? 0}
        countPerPage={searchResult?.items?.length ?? 0}
        showsSummary={!!searchResult && usedQuery.trim().length > 0}
        currentUrl={currentUrl}
      />
    </main>
  );
});
