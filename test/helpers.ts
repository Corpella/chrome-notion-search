import userEvent from '@testing-library/user-event';

export const userEventSetup = (
  options: Parameters<(typeof userEvent)['setup']>[0] = {},
): ReturnType<(typeof userEvent)['setup']> => {
  // https://testing-library.com/docs/user-event/options
  return userEvent.setup(options);
};

export const $ = <T extends HTMLElement>(selector: string) => {
  /* eslint testing-library/no-node-access: 0 */
  const elem = document.querySelector<T>(selector);
  if (!elem) throw new Error(`Element (${selector}) is not found`);
  return elem;
};

/* eslint testing-library/no-node-access: 0 */
export const $$ = <T extends HTMLElement>(selector: string) =>
  document.querySelectorAll<T>(selector);
