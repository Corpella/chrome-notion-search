import { AxiosError } from 'axios';
import { NOTION_BASE_URL } from './constants';

export const alertError = (message: string, error: unknown) => {
  if (error instanceof AxiosError && error.response?.status === 401) {
    if (confirm('You must log in to Notion.\nGo to Notion and log in?'))
      window.open(`${NOTION_BASE_URL}/login`);
    return;
  }
  alert(message);
};

export const isPopup = () => new URL(location.href).searchParams.has('popup');

export const handleClickLocalResource = async ({
  event,
  url,
  target,
}: {
  event: MouseEvent | React.MouseEvent;
  url: string;
  target?: string;
}) => {
  event.preventDefault();

  // chrome.tabs.getCurrent() returns undefined if popup
  const currentTab = (
    await chrome.tabs.query({ active: true, currentWindow: true })
  )[0];
  if (!currentTab) throw new Error(`currentTab is not found`);
  if (currentTab.id === undefined)
    throw new Error(`currentTab.id is undefined`);

  if (
    target === '_blank' ||
    (navigator.userAgent.match(/Macintosh/) && event.metaKey) ||
    event.ctrlKey
  ) {
    await chrome.tabs.create({ url, index: currentTab.index + 1 });
  } else {
    await chrome.tabs.update(currentTab.id, { url });
  }
};

export const replaceCssUrls = (css: string) =>
  css.replace(
    /url\(["']?(.+?)["']?\)/g,
    `url('${chrome.runtime.getURL('$1')}')`,
  );
