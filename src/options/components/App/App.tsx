import React from 'react';
import '../../../common.css';
import { LocalResourceLink } from '../../../components/LocalResourceLink';
import { LinkedStatus } from '../LinkedStatus/LinkedStatus';

export const App = () => (
  <div className="container-md">
    <h1 className="py-2">Options</h1>
    <table className="table">
      <tbody>
        <LinkedStatus />
        <tr>
          <th className="table-secondary">Keyboard Shortcuts</th>
          <td>
            <p>
              The shortcut key to{' '}
              <span className="mark fw-bold">open the popup</span> is set to{' '}
              <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> by default.
            </p>
            <p>
              <LocalResourceLink href="chrome://extensions/shortcuts">
                <button className="btn btn-outline-secondary">
                  Customize shortcut keys
                </button>
              </LocalResourceLink>
            </p>
          </td>
        </tr>
      </tbody>
    </table>
    <hr className="mt-5" />
    <div>
      <h2 className="fs-5">About Notion Search</h2>
      <ul>
        <li>
          <a
            href="https://chrome.google.com/webstore/detail/notion-search/nelmlmaelgfcpjgknkidapfnoddpjfee/support"
            target="_blank"
            rel="noreferrer"
          >
            Contact the publisher
          </a>
        </li>
        <li>
          Enjoying Notion Search?{' '}
          <a
            href="https://chrome.google.com/webstore/detail/notion-search/nelmlmaelgfcpjgknkidapfnoddpjfee/reviews"
            target="_blank"
            rel="noreferrer"
          >
            Rate this extension.
          </a>
        </li>
        <li>
          <a
            href="https://github.com/Cside/chrome-notion-search/"
            target="_blank"
            rel="noreferrer"
          >
            Source code
          </a>
        </li>
      </ul>
    </div>
  </div>
);
