import React, { useEffect, useState } from 'react';
import { useWorkspace } from '../../../hooks';
import { storage } from '../../../storage';
import { handleError, isPopup } from '../../../utils';
import { STORAGE_KEY } from '../../constants';
import { Provider } from '../Provider/Provider';
import { SearchContainer } from '../SearchContainer/SearchContainer';

import '../../../common.css';
import './customProperties.css';
import './styles.pcss';

export const App = () => {
  const { workspace, isLoading, error, selectAndLinkWorkspace } =
    useWorkspace();

  const [hasInitialized, setHasInitialized] = useState(false);
  const [lastSearchResult, setLastSearchResult] = useState<
    LastSearchResult | undefined
  >(undefined);

  useEffect(() => {
    if (error) {
      handleError(error.message, error.cause);
      throw error.cause;
    }
    if (isLoading) return;

    (async () => {
      if (!workspace) {
        console.info('link a workspace automatically');
        await selectAndLinkWorkspace();
        return;
      }

      if (isPopup()) {
        const lastSearchResult = (await storage.get(
          `${workspace.id}-${STORAGE_KEY.LAST_SEARCHED}`,
        )) as LastSearchResult | undefined; // TODO: type guard

        if (lastSearchResult) setLastSearchResult(lastSearchResult);
      }
      setHasInitialized(true);
    })();
  }, [isLoading]);

  if (workspace && hasInitialized)
    return (
      <Provider>
        <SearchContainer
          workspace={workspace}
          lastSearchResult={lastSearchResult}
        />
      </Provider>
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
