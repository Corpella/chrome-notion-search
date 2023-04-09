import CustomError from './CustomError';
jest.mock('extensible-custom-error');

class TestError extends CustomError {}

beforeEach(() => {
  jest.resetAllMocks();
});

test.each([
  {
    name: 'no message',
    input: [],
    expected: [],
  },
  {
    name: 'passes message',
    input: ['message'],
    expected: ['message'],
  },
  {
    name: "passes message and cause (message doesn't have dot)",
    input: ['message', { cause: new TypeError('type error') }],
    expected: ['message. type error'],
  },
  {
    name: 'passes message and cause (message has dot)',
    input: ['message.', { cause: new TypeError('type error') }],
    expected: ['message. type error'],
  },
  {
    name: 'passes message and cause (cause is not an error object)',
    input: ['message.', { cause: 'string' }],
    expected: ['message. "string"'],
  },
] as {
  name: string;
  input: ConstructorParameters<typeof TestError>;
  expected: string[];
}[])('$name', ({ input, expected }) => {
  new TestError(...input);
  expect(CustomError).toHaveBeenCalledWith(...expected);
});
