import React, { useEffect, useMemo, useState } from 'react';
import { useWorkspace } from '../../../hooks';
import { storage } from '../../../storage';
import { alertError, isPopup as isPopupFn } from '../../../utils';
import { STORAGE_KEY } from '../../constants';
import { QueryParamProvider } from '../QueryParamProvider/QueryParamProvider';
import { SearchContainer } from '../SearchContainer/SearchContainer';
import './styles.pcss';

export const App = () => {
  const { workspace, hasGotWorkspace, error, selectAndLinkWorkspace } =
    useWorkspace();
  const [lastSearchResult, setLastSearchResult] = useState<
    LastSearchResult | undefined
  >(undefined);
  const isPopup = useMemo(isPopupFn, []);

  useEffect(() => {
    if (error) {
      alertError(error.message, error.cause);
      throw error.cause;
    }
  }, [error]);

  useEffect(() => {
    (async () => {
      if (hasGotWorkspace && !workspace) {
        console.info('will link automatically');
        await selectAndLinkWorkspace();
      }

      console.log(workspace, isPopup);
      if (workspace && isPopup) {
        const lastSearchResult = (await storage.get(
          `${workspace.id}-${STORAGE_KEY.LAST_SEARCHED}`,
        )) as LastSearchResult | undefined; // TODO: type guard

        if (lastSearchResult) setLastSearchResult(lastSearchResult);
      }
    })();
  }, [hasGotWorkspace]);

  if (workspace)
    return (
      <QueryParamProvider>
        <SearchContainer
          workspace={workspace}
          lastSearchResult={lastSearchResult}
        />
      </QueryParamProvider>
    );

  return (
    <div className="link-button-container">
      <button
        onClick={async (event) => {
          await selectAndLinkWorkspace();
          event.preventDefault();
        }}
      >
        Click here to connect Notion
      </button>
    </div>
  );
};
