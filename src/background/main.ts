chrome.commands.onCommand.addListener(async (command) => {
  switch (command) {
    case 'open-search-page': {
      const popupFile = chrome.runtime.getManifest().action?.default_popup;
      if (!popupFile)
        throw new Error('action.default_popup is not defined in manifest.json');
      await chrome.tabs.create({
        url: chrome.runtime.getURL(popupFile),
      });
      break;
    }
    default:
      throw new Error(`Unknown command: ${command}`);
  }
});
