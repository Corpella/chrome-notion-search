let store = {};
type Key = keyof typeof store;

const storage = {
  clear: async () => {
    store = {};
  },
  // get-multi is not implemented yet
  get: async (key?: string) => {
    return key === undefined
      ? store
      : {
          [key]: store[key as Key] ?? {},
        };
  },
  remove: async (key: string) => {
    delete store[key as Key];
  },
  set: async (value: object) => {
    store = { ...store, ...value };
  },
};

let OrigLocalStorage: chrome.storage.LocalStorageArea;

beforeAll(() => {
  // spy is very hard because there are so many argument types
  OrigLocalStorage = global.chrome.storage.local;
  global.chrome.storage.local = storage as chrome.storage.LocalStorageArea;
});

beforeEach(() => {
  storage.clear();
});

afterAll(() => {
  global.chrome.storage.local = OrigLocalStorage;
});
