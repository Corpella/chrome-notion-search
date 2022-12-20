import React, { useEffect } from 'react';
import { useWorkspace } from '../../hooks';
import { alertError } from '../../utils';
import SearchContainer from './SearchContainer';

export default function Container() {
  const { workspace, isInitialized, error, selectAndLinkWorkspace } =
    useWorkspace();

  if (error) {
    alertError(
      'Failed to connect Notion. Please redo the operation later.',
      error,
    );
    throw error;
  }
  const isPopup = location.search === '?popup';

  useEffect(() => {
    (async () => {
      if (isInitialized && !workspace) {
        console.info('will link automatically');
        await selectAndLinkWorkspace();
      }
    })();
  }, []);

  if (workspace)
    return <SearchContainer isPopup={isPopup} workspace={workspace} />;

  return (
    // TODO: to .css
    <main style={{ width: '400px', height: '300px', padding: '20px' }}>
      <button
        onClick={(event) => {
          selectAndLinkWorkspace();
          event.preventDefault();
        }}
      >
        Click here to connect Notion
      </button>
    </main>
  );
}
