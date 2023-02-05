import '@testing-library/jest-dom';
import { chrome } from 'jest-chrome';
import './chrome/runtime';
import './chrome/storage';

Object.assign(global, { chrome });

beforeAll(() => {
  jest.spyOn(console, 'info').mockImplementation(() => {});
});

afterAll(() => {
  jest.resetAllMocks();
});
