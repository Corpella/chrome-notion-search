import { handleClickLocalResource } from './utils';

for (const a of document.querySelectorAll<HTMLAnchorElement>(
  'a.js-local-resource',
)) {
  a.addEventListener('click', async (event: MouseEvent) => {
    handleClickLocalResource({
      url: a.href,
      event,
      ...(a.target ? { target: a.target } : {}),
    });
  });
}
