import { act, cleanup, render } from '@testing-library/react';
import React from 'react';
import { $, userEventSetup } from '../../../../test/helpers';
import { axios } from '../../../axios';
import { SORT_BY } from '../../constants';
import * as emptySearchResultsCallout from '../Callout/EmptySearchResults/EmptySearchResults';
import { QueryParamProvider } from '../QueryParamProvider/QueryParamProvider';
import { SearchContainer } from '../SearchContainer/SearchContainer';

beforeEach(() => {
  jest
    .spyOn(emptySearchResultsCallout, 'EmptySearchResultsCallout')
    .mockReturnValue(<></>);
});

afterEach(() => {
  cleanup();
});

beforeAll(() => {
  jest.useFakeTimers(); // debounce 対策
  // Object のインスタンスは spy できないので
});
afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

const renderAndWaitEffect = async (component: JSX.Element) => {
  const result = await act(() => render(component));
  // debounce 対策。await act が待てるのは setState と非同期処理だけで、タイマーまでは進めない
  await act(() => jest.runOnlyPendingTimers());
  return result;
};

test('filter options', async () => {
  const user = userEventSetup({
    advanceTimers: jest.runOnlyPendingTimers,
  });
  const spy = jest
    .spyOn(axios, 'post')
    .mockResolvedValue({ data: { results: [], total: 0 } });

  await renderAndWaitEffect(
    <QueryParamProvider>
      <SearchContainer
        workspace={{ id: 'space-id', name: 'space-name' }}
        lastSearchResult={undefined}
      />
    </QueryParamProvider>,
  );

  const elem = $('.test-filter-only-title');
  expect(elem).not.toHaveClass('selected');

  // Somewhat redundant, but the output in case of failure is more helpful than comparing `spy.mock.lastCall`
  // (This tells us how many times it was called).
  expect(spy).toHaveBeenLastCalledWith(
    expect.any(String),
    expect.not.objectContaining({
      filters: expect.objectContaining({ navigableBlockContentOnly: true }),
    }),
  );

  await user.click(elem);
  expect(elem).toHaveClass('selected');

  expect(spy).toHaveBeenLastCalledWith(
    expect.any(String),
    expect.objectContaining({
      filters: expect.objectContaining({ navigableBlockContentOnly: true }),
    }),
  );
});

test('sort options', async () => {
  const user = userEventSetup({
    advanceTimers: jest.runOnlyPendingTimers,
  });
  const spy = jest
    .spyOn(axios, 'post')
    .mockResolvedValue({ data: { results: [], total: 0 } });

  await renderAndWaitEffect(
    <QueryParamProvider>
      <SearchContainer
        workspace={{ id: 'space-id', name: 'space-name' }}
        lastSearchResult={undefined}
      />
    </QueryParamProvider>,
  );

  const input = $<HTMLInputElement>('.query');
  const select = $<HTMLSelectElement>('.sorts');
  expect(select.value).toBe(SORT_BY.RELEVANCE);

  for (const {
    input: { query, selection },
    expected,
  } of [
    {
      input: {
        query: 'test',
        selection: SORT_BY.LAST_EDITED,
      },
      expected: { field: 'lastEdited', direction: 'desc' },
    },
    {
      input: {
        query: 'test',
        selection: SORT_BY.CREATED,
      },
      expected: { field: 'created', direction: 'desc' },
    },
    {
      input: {
        query: 'test',
        selection: SORT_BY.RELEVANCE,
      },
      expected: { field: 'relevance' },
    },
    {
      input: {
        query: '',
        selection: SORT_BY.RELEVANCE,
      },
      expected: { field: 'created', direction: 'desc' },
    },
  ]) {
    if (query === '') {
      await user.clear(input);
    } else {
      await user.type(input, query);
    }
    await user.selectOptions(select, selection);
    expect(select).toHaveValue(selection);
    expect(spy).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({
        sort: expect.objectContaining(expected),
      }),
    );
  }
});
