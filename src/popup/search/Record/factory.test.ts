import { Block } from './Block/Block';
import { CollectionViewBlock } from './Block/CollectionView';
import { Collection } from './Collection';
import { BLOCK_TYPE, TABLE_TYPE } from './constants';
import { createBlock, createRecord } from './factory';

const BLOCK_ID = 'block-id';
const BLOCK: SearchApi.Block = {
  id: BLOCK_ID,
  parent_id: 'parent-block-id',
  parent_table: TABLE_TYPE.BLOCK,
  type: BLOCK_TYPE.PAGE,
};

const COLLECTION_ID = 'yyy';
const COLLECTION: SearchApi.Collection = {
  id: COLLECTION_ID,
  parent_id: 'parent-collection-id',
  parent_table: TABLE_TYPE.BLOCK,
};

const RECORD_MAP: SearchApi.RecordMap = {
  block: {
    [BLOCK_ID]: {
      value: BLOCK,
    },
  },
  collection: {
    [COLLECTION_ID]: {
      value: COLLECTION,
    },
  },
};

afterEach(() => jest.restoreAllMocks());

describe('createRecord()', () => {
  describe('normal', () => {
    test('gets a block', () =>
      expect(
        createRecord(BLOCK_ID, TABLE_TYPE.BLOCK, RECORD_MAP),
      ).toBeInstanceOf(Block));

    for (const type of [
      BLOCK_TYPE.COLLECTION_VIEW,
      BLOCK_TYPE.COLLECTION_VIEW_PAGE,
    ]) {
      describe(`gets a block (${type})`, () => {
        test('a block has a collection', () => {
          const block = createRecord(BLOCK_ID, TABLE_TYPE.BLOCK, {
            ...RECORD_MAP,
            block: {
              [BLOCK_ID]: {
                value: {
                  ...BLOCK,
                  type,
                  collection_id: COLLECTION_ID,
                },
              },
            },
          });
          expect(block).toBeInstanceOf(CollectionViewBlock);
          expect((block as CollectionViewBlock).collection).toBeDefined();
        });
        test("a block doesn't have a collection", () => {
          const block = createRecord(BLOCK_ID, TABLE_TYPE.BLOCK, {
            ...RECORD_MAP,
            block: {
              [BLOCK_ID]: {
                value: {
                  ...BLOCK,
                  type,
                },
              },
            },
          });
          expect(block).toBeInstanceOf(CollectionViewBlock);
          expect((block as CollectionViewBlock).collection).toBeUndefined();
        });
      });
    }

    test('gets a collection', () =>
      expect(
        createRecord(COLLECTION_ID, TABLE_TYPE.COLLECTION, RECORD_MAP),
      ).toBeInstanceOf(Collection));
  });

  describe('abnormal', () => {
    test('unknown table type', () =>
      expect(() =>
        createRecord(
          BLOCK_ID,
          'unknown table type' as SearchApi.TableType,
          RECORD_MAP,
        ),
      ).toThrow(/^Unknown table type:/));

    test("can't handle a workspace", () =>
      expect(() =>
        createRecord(BLOCK_ID, TABLE_TYPE.WORKSPACE, RECORD_MAP),
      ).toThrow(/^Can't handle a workspace/));

    test("block-id doesn't exist", () =>
      expect(() =>
        createRecord("id that doesn't exist", TABLE_TYPE.BLOCK, RECORD_MAP),
      ).toThrow(/^Block .+ is not found/));

    test("collection id doesn't exist (collection)", () =>
      expect(() =>
        createRecord(
          "id that doesn't exist",
          TABLE_TYPE.COLLECTION,
          RECORD_MAP,
        ),
      ).toThrow(/^Collection .+ is not found/));

    for (const type of [
      BLOCK_TYPE.COLLECTION_VIEW,
      BLOCK_TYPE.COLLECTION_VIEW_PAGE,
    ]) {
      test(`collection id doesn't exist (${type})`, () => {
        expect(() =>
          createRecord(BLOCK_ID, TABLE_TYPE.BLOCK, {
            ...RECORD_MAP,
            block: {
              [BLOCK_ID]: {
                value: {
                  ...BLOCK,
                  type,
                  collection_id: "id that doesn't exist",
                },
              },
            },
          }),
        ).toThrow(
          /block.collection_id exists, but collection_id:.+ is not found/,
        );
      });
    }
  });
});

describe('createBlock()', () => {
  test('gets a block', () =>
    expect(createBlock(BLOCK_ID, RECORD_MAP)).toBeInstanceOf(Block));
});
