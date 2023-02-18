import { render } from '@testing-library/react';
import React from 'react';
import Item from '.';
import { fakeStorage } from '../../../../test/chrome/fakeStorage';
import { $$ } from '../../../../test/helpers';
import { ICON_TYPE, MATCH_TAG } from '../../constants';
import { BLOCK_TYPE, TABLE_TYPE } from '../../search/Record/constants';
import { setHighlight } from '../Item/utils';

describe('setHighlight', () => {
  test.each([
    {
      name: 'basic',
      input: {
        text: 'foo bar baz foobar',
        query: 'bar',
      },
      expected: [
        'foo ',
        <em key="1">bar</em>,
        ' baz foo',
        <em key="3">bar</em>,
        '',
      ],
    },
    {
      name: 'empty query',
      input: {
        text: 'foo bar baz',
        query: '',
      },
      expected: [<span key="0">foo bar baz</span>],
    },
    {
      name: 'rm match tag',
      input: {
        text: `foo <${MATCH_TAG}>bar</${MATCH_TAG}> <${MATCH_TAG}>baz</${MATCH_TAG}>`,
        query: '',
      },
      expected: [<span key="0">foo bar baz</span>],
    },
    {
      name: 'multiple queries',
      input: {
        text: 'foo bar baz foobar',
        query: 'foo bar',
      },
      expected: [
        '',
        <em key="1">foo</em>,
        ' ',
        <em key="3">bar</em>,
        ' baz ',
        <em key="5">foo</em>,
        '',
        <em key="7">bar</em>,
        '',
      ],
    },
  ])('$name', ({ input, expected }) => {
    expect(setHighlight(input.text, input.query)).toEqual(expected);
  });
});

const BLOCK = (n: number) => ({
  id: 'block-id' + String(n),
  parent_id: 'parent-id' + String(n - 1),
  parent_table: TABLE_TYPE.BLOCK,
  type: BLOCK_TYPE.PAGE,
});

afterEach(() => {
  fakeStorage.clear();
  jest.clearAllMocks();
});
afterAll(() => {
  jest.restoreAllMocks();
});

describe('filters dirs', () => {
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
