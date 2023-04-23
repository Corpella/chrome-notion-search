import { useEffect, useState } from 'react';
import {
  LinkWorkspaceResult,
  getLinkedWorkspace,
  selectAndLinkWorkspace,
  unlinkWorkspace,
} from './workspaces';

export const useWorkspace = () => {
  const [workspace, setWorkspace] = useState<Workspace | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let workspace: Workspace | undefined;
      try {
        workspace = await getLinkedWorkspace();
        if (workspace) setWorkspace(workspace);
      } catch (error) {
        setError(
          new Error('Failed to get workspaces. Please reload this page.', {
            cause: error,
          }),
        );
      }
      setIsLoading(false);
    })();
  }, []);

  return {
    workspace,
    // useEffect(() => { if (error) ... }, [error]); のように使う。 useEffect 省略不可
    error,
    isLoading,
    selectAndLinkWorkspace: async () => {
      let result: LinkWorkspaceResult;
      try {
        result = await selectAndLinkWorkspace();
      } catch (error) {
        setError(
          new Error(
            'Failed to connect Notion. Please redo the operation later.',
            { cause: error },
          ),
        );
        return;
      }
      if (result.hasAborted) {
        return;
      }
      setWorkspace(result.workspace);
    },
    unlinkWorkspace: async () => {
      try {
        await unlinkWorkspace();
        setWorkspace(undefined);
      } catch (error) {
        setError(
          new Error(
            'Failed to disconnect Notion. Please redo the operation later.',
            { cause: error },
          ),
        );
      }
    },
  };
};
