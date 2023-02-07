for (const a of document.querySelectorAll<HTMLAnchorElement>(
  'a.js-local-resource',
)) {
  const url = a.href;
  a.addEventListener('click', async (event: MouseEvent) => {
    if (
      a.target === '_blank' ||
      (navigator.userAgent.match(/Macintosh/) && event.metaKey) ||
      event.ctrlKey
    ) {
      chrome.tabs.create({ url });
    } else {
      const currentTab = (
        await chrome.tabs.query({ active: true, currentWindow: true })
      )[0];
      if (!currentTab) throw new Error(`currentTab is not found`);
      if (currentTab.id === undefined)
        throw new Error(`currentTab.id is undefined`);

      chrome.tabs.update(currentTab.id, { url });
    }
    event.preventDefault();
  });
}
