import React from 'react';
import '../../../common.css';
import { LocalResourceLink } from '../../../components/LocalResourceLink';
import { LinkedStatus } from '../LinkedStatus/LinkedStatus';
import { DisplaySettings } from '../DisplaySettings/DisplaySettings';

export const App = () => (
  <div className="container">
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
              <span className="mark fw-bold">Ctrl + Shift + P</span> by default.
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
        <DisplaySettings />

      </tbody>
    </table>
    <hr className="mt-5" />
    <div className="container">
      <p>About Notion Search</p>
      <ul>
        <li>
          <a
            href="https://chrome.google.com/webstore/detail/notion-search/nelmlmaelgfcpjgknkidapfnoddpjfee/support"
            target="_blank"
            rel="noreferrer"
          >
            Support
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
