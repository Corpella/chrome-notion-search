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
    error,
    isLoading,
    selectAndLinkWorkspace: async () => {
      let result: LinkWorkspaceResult;
      try {
        setIsLoading(true);
        result = await selectAndLinkWorkspace();
      } catch (error) {
        setError(
          new Error(
            'Failed to connect Notion. Please redo the operation later.',
            { cause: error },
          ),
        );
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
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
