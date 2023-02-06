document.addEventListener('DOMContentLoaded', () => {
  for (const a of document.querySelectorAll('a.js-local-resource')) {
    const url = a.href;
    a.addEventListener('click', async (event) => {
      if (a.target === '_blank') {
        chrome.tabs.create({ url });
      } else {
        const currentTab = (
          await chrome.tabs.query({ active: true, currentWindow: true })
        )[0];
        chrome.tabs.update(currentTab.id, { url });
      }
      event.preventDefault();
    });
  }
});
