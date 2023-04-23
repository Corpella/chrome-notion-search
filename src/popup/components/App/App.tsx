import React, { useEffect, useState } from 'react';
import { useWorkspace } from '../../../hooks';
import { storage } from '../../../storage';
import { handleError, isPopup } from '../../../utils';
import { STORAGE_KEY } from '../../constants';
import { QueryParamProvider } from '../QueryParamProvider/QueryParamProvider';
import { SearchContainer } from '../SearchContainer/SearchContainer';

import '../../../common.css';
import './customProperties.css';
import './styles.pcss';

export const App = () => {
  const { workspace, isLoading, error, selectAndLinkWorkspace } =
    useWorkspace();

  const [lastSearchResult, setLastSearchResult] = useState<
    LastSearchResult | undefined
  >(undefined);

  // FIXME: これどうにかならんの
  useEffect(() => {
    if (error) {
      handleError(error.message, error.cause);
      throw error.cause;
    }
  }, [error]);

  useEffect(() => {
    (async () => {
      // FIXME: hasGot いらなくね？
      // つか、やるにしても isLoading とかじゃねぇの...
      // 時間差リトライが前提の data fetching 、どういう API が適切なのだろうか .......
      if (isLoading) return;

      if (!workspace) {
        console.info('link a workspace automatically');
        await selectAndLinkWorkspace();
      }

      if (workspace && isPopup()) {
        // ⭐
        const lastSearchResult = (await storage.get(
          `${workspace.id}-${STORAGE_KEY.LAST_SEARCHED}`,
        )) as LastSearchResult | undefined; // TODO: type guard

        if (lastSearchResult) setLastSearchResult(lastSearchResult);
      }
    })();
  }, [isLoading]);

  // ⭐が終わるまで、そもそも描画しなければ良いんじゃない？
  // そうすれば if(isFirst) return; みたいなややこしいことしなくて済む。
  if (workspace)
    return (
      <QueryParamProvider>
        <SearchContainer
          key={JSON.stringify(lastSearchResult)}
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
