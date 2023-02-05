import '@testing-library/jest-dom';
import { chrome } from 'jest-chrome';
import { getURL } from './chrome/runtime';
import { storage } from './chrome/storage';

Object.assign(global, { chrome: chrome });

let OrigLocalStorage: chrome.storage.LocalStorageArea;

beforeAll(() => {
  // Object のインスタンスは spy できないので
  // NOTE: ライブラリ化してもいいかもしれない
  OrigLocalStorage = global.chrome.storage.local;
  global.chrome.storage.local = storage as chrome.storage.LocalStorageArea;

  jest.spyOn(chrome.runtime, 'getURL').mockImplementation(getURL);
});

beforeEach(() => {
  storage.clear();
  jest.spyOn(console, 'info').mockImplementation(() => {});
});

afterAll(() => {
  global.chrome.storage.local = OrigLocalStorage;
  jest.resetAllMocks();
});
