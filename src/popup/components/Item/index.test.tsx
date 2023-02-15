import { cleanup, render } from '@testing-library/react';
import React from 'react';
import Item from '.';
import { $$ } from '../../../../test/helpers';
import { ICON_TYPE } from '../../constants';
import { BLOCK_TYPE, TABLE_TYPE } from '../../search/Record/constants';

const BLOCK = (n: number) => ({
  id: 'block-id' + String(n),
  parent_id: 'parent-id' + String(n - 1),
  parent_table: TABLE_TYPE.BLOCK,
  type: BLOCK_TYPE.PAGE,
});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});
afterAll(() => {
  jest.restoreAllMocks();
});

describe('dirs', () => {
  test.each([
    {
      name: '1 dir',
      input: [{ title: 'dir1', record: BLOCK(1) }],
      expected: { count: 1 },
    },
    {
      name: 'no dirs',
      input: [],
      expected: { count: 0 },
    },
    {
      name: 'multiple dirs',
      input: [
        { title: 'dir1', record: BLOCK(1) },
        { title: 'dir2', record: BLOCK(2) },
      ],
      expected: { count: 2 },
    },
    {
      name: 'filters 3 -> 2',
      input: [
        { title: 'dir1', record: BLOCK(1) },
        { title: 'dir2', record: undefined as unknown as SearchApi.Record },
        { title: 'dir3', record: BLOCK(2) },
      ],
      expected: { count: 2, hasConsoleCalledTimes: 1 },
    },
    {
      name: 'filters 1 -> 0',
      input: [
        { title: 'dir1', record: undefined as unknown as SearchApi.Record },
      ],
      expected: { count: 0, hasConsoleCalledTimes: 1 },
    },
  ])('$name', ({ input, expected }) => {
    render(
      <Item
        query=""
        icon={{ type: ICON_TYPE.EMOJI, value: '🫶' }}
        title="test-title"
        url="https://example.com/"
        dirs={input}
        text={undefined}
        block={BLOCK(1)}
      />,
    );
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect($$<HTMLInputElement>('.dirs > span').length).toBe(expected.count);
    if (expected.hasConsoleCalledTimes) {
      expect(spy).toHaveBeenCalledTimes(expected.hasConsoleCalledTimes);
      expect(spy).toHaveBeenCalledWith(
        expect.stringMatching(/^dir.record is undefined in Item component/),
        expect.any(Object),
      );
    }
  });
});
