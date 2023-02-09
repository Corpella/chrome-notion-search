import { AxiosError, CanceledError as AxiosCanceledError } from 'axios';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BooleanParam,
  StringParam,
  useQueryParam,
  withDefault,
} from 'use-query-params';
import { storage } from '../../../storage';
import { alertError, isPopup as isPopupFn } from '../../../utils';
import { SORT_BY, STORAGE_KEY } from '../../constants';
import { debouncedSearch, EmptySearchResultsError } from '../../search';
import { EmptySearchResultsCallout } from '../Callout/EmptySearchResults';
import { SearchBox } from '../SearchBox';
import { Sort } from '../Sorts';
import { Filter } from './../Filters';
import { Footer } from './../Footer';
import { Items } from './../Items';
import './styles.pcss';

export const SearchContainer = ({ workspace }: { workspace: Workspace }) => {
  const [query, setQuery] = useQueryParam(
    'query',
    withDefault(StringParam, ''),
  );
  const [sortBy, setSortBy] = useQueryParam(
    'sort_by',
    withDefault(StringParam, SORT_BY.RELEVANCE),
  );
  const [filterByOnlyTitles, setFilterOnlyTitles] = useQueryParam(
    'only_titles',
    withDefault(BooleanParam, false),
  );

  const [usedQuery, setUsedQuery] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | undefined>(
    undefined,
  );
  const [errorToDisplay, setErrorToDiplay] = useState<Error | undefined>(
    undefined,
  );

  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const isFirstRendering = useRef(true);
  const isPopup = useMemo(isPopupFn, []);

  // search
  useEffect(() => {
    (async () => {
      // get cache
      if (isPopup && isFirstRendering.current) {
        isFirstRendering.current = false;

        const store = (await storage.get(
          `${workspace.id}-${STORAGE_KEY.LAST_SEARCHED}`,
        )) as SearchResultCache | undefined; // TODO: type guard

        if (store) {
          setQuery(store.query);
          setUsedQuery(query);
          setSearchResult(store.searchResult);
          return;
        }
      }

      if (query.trim() === '')
        storage.remove(`${workspace.id}-${STORAGE_KEY.LAST_SEARCHED}`);

      try {
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
};
