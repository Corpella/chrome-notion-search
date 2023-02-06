import { compareVersions } from 'compare-versions';

chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case 'open-search-page': {
      const popup = chrome.runtime.getManifest().action?.default_popup;
      if (!popup)
        throw new Error('action.default_popup is not found in manifest.json');
      chrome.tabs.create({
        url: chrome.runtime.getURL(popup.replace(/\?.+$/, '')),
      });
      break;
    }
    default:
      throw new Error(`Unknown command: ${command}`);
  }
});

const KEYBOARD_SHORTCUT_CHANGED_VERSION = '2.0.0';
const LESS_THAN = -1;

chrome.runtime.onInstalled.addListener(({ reason, previousVersion }) => {
  if (reason === chrome.runtime.OnInstalledReason.UPDATE) {
    if (!previousVersion) throw new Error('previousVersion is not defined');
    if (
      compareVersions(previousVersion, KEYBOARD_SHORTCUT_CHANGED_VERSION) ===
      LESS_THAN
    )
      chrome.tabs.create({
        url: chrome.runtime.getURL(`./notices/2_0_0.html`),
      });
  }
});
