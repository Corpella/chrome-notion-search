import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import './chrome';

Object.defineProperty(window, 'matchMedia', {
  value: () => ({
    matches: false,
  }),
});

beforeAll(() => {
  jest.spyOn(console, 'info').mockImplementation(() => {});
});

afterAll(() => {
  jest.resetAllMocks();
});
