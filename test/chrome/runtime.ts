const getURL = (str: string) => `chrome://<extension-id>/${str}`;

beforeAll(() => {
  jest.spyOn(chrome.runtime, 'getURL').mockImplementation(getURL);
});

afterAll(() => {
  jest.resetAllMocks();
});
