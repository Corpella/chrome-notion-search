let store = {};
type Key = keyof typeof store;

// spy is very hard because there are so many argument types

export const storage = {
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
