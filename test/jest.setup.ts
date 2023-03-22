import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import './chrome';

beforeAll(() => {
  jest.spyOn(console, 'info').mockImplementation(() => {});
});

afterAll(() => {
  jest.resetAllMocks();
});
