import React, { useEffect } from 'react';
import { useWorkspace } from '../../../hooks';
import { alertError } from '../../../utils';

export const LinkedStatus = () => {
  const {
    workspace,
    hasGotWorkspace,
    error,
    selectAndLinkWorkspace,
    unlinkWorkspace,
  } = useWorkspace();

  useEffect(() => {
    if (error) {
      alertError(error.message, error.cause);
      throw error.cause;
    }
  }, [error]);

  return (
    <tr>
      <th className="table-secondary">Connection Status</th>
      <td>
        {hasGotWorkspace &&
          (workspace ? (
            <>
              <p className="fs-5 text-success">✅ Connected to Notion</p>
              <p>
                Your workspace:{' '}
                <span className="mark fw-bold">{workspace.name}</span>
              </p>
              <p>
                <button
                  className="btn btn-outline-danger"
                  onClick={async () => {
                    const ok = confirm('Disconnect from Notion?');
                    if (!ok) return;
                    await unlinkWorkspace();
                  }}
                >
                  Disconnect from {workspace.name}
                </button>
              </p>
            </>
          ) : (
            <>
              <p className="fs-5 text-danger">❌ Not Connected to Notion</p>
              <p>
                <button
                  className="btn btn-outline-success"
                  onClick={selectAndLinkWorkspace}
                >
                  Connect to Notion
                </button>
              </p>
            </>
          ))}
      </td>
    </tr>
  );
};
