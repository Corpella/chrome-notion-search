import CustomError from './CustomError';

export class ChromeStorageError extends CustomError {
  static {
    this.prototype.name = 'ChromeStorageError';
  }
}

export const storage = {
  get: async (key: string) => {
    try {
      return (await chrome.storage.local.get(key))[key];
    } catch (error) {
      throw new ChromeStorageError(`chrome.storage.local.get(${key}) failed`, {
        cause: error,
      });
    }
  },
  /* eslint @typescript-eslint/no-explicit-any: 0 */
  set: async (obj: any) => {
    try {
      await chrome.storage.local.set(obj);
    } catch (error) {
      throw new ChromeStorageError(
        `chrome.storage.local.set(${Object.keys(obj).join(',')}) failed`,
        { cause: error },
      );
    }
  },
  remove: async (key: string) => {
    try {
      return await chrome.storage.local.remove(key);
    } catch (error) {
      throw new ChromeStorageError(
        `chrome.storage.local.remove(${key}) failed`,
        { cause: error },
      );
    }
  },
};
