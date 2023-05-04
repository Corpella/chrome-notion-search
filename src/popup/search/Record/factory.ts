import CustomError from '../../../CustomError';
import { BasicBlock } from './Block/Basic';
import { Block } from './Block/Block';
import { CollectionViewBlock, isCollectionView } from './Block/CollectionView';
import { Collection } from './Collection';
import { TABLE_TYPE } from './constants';
import { Record } from './Record';
import { Team } from './Team';

class RecordError extends CustomError {
  static {
    this.prototype.name = 'RecordError';
  }
}
class RecordNotFoundError extends RecordError {
  static {
    this.prototype.name = 'RecordNotFoundError';
  }
}
class RecordTypeError extends RecordError {
  static {
    this.prototype.name = 'RecordTypeError';
  }
}

// NOTE: ログ指針：
//  - id, tableType は上流で吐いてるのでここでは吐かない
//  - block は吐く
export const createRecord = (
  id: string,
  tableType: SearchApi.TableType,
  recordMap: SearchApi.RecordMap,
): Record => {
  switch (tableType) {
    case TABLE_TYPE.WORKSPACE:
      throw new RecordTypeError(`Can't handle a workspace`);

    // only parent
    case TABLE_TYPE.COLLECTION: {
      const collection = recordMap.collection?.[id]?.value;
      if (!collection) {
        throw new RecordNotFoundError(
          `Collection is not found in recordMap.collection. id: ${id}`,
        );
      }
      return new Collection({ collection });
    }
    // only parent
    case TABLE_TYPE.TEAM: {
      const team = recordMap.team?.[id]?.value;
      if (!team) {
        throw new RecordNotFoundError(
          `Team is not found in recordMap.team. id: ${id}`,
        );
      }
      return new Team({ team });
    }
    case TABLE_TYPE.BLOCK: {
      const block = recordMap.block[id]?.value;
      if (!block) {
        throw new RecordNotFoundError(
          `Block is not found in recordMap.block. id: ${id}`,
        );
      }

      if (isCollectionView(block)) {
        let collection: SearchApi.Collection | undefined = undefined;
        if (block.collection_id) {
          collection = recordMap.collection?.[block.collection_id]?.value;
          if (!collection) {
            throw new RecordNotFoundError(
              `block.collection_id exists, ` +
                `but collection is not found in recordMap.collection. ` +
                `collection_id: ${block.collection_id}, ` +
                `block: ${JSON.stringify(block)}`,
            );
          }
        }
        return new CollectionViewBlock({
          block,
          ...(collection ? { collection: new Collection({ collection }) } : {}),
        });
      }
      return new BasicBlock({ block });
    }
    default:
      throw new RecordTypeError(`Unknown table type: ${tableType}`);
  }
};

export const createBlock = (id: string, recordMap: SearchApi.RecordMap) => {
  const record = createRecord(id, TABLE_TYPE.BLOCK, recordMap);
  if (!(record instanceof Block))
    // 今の実装では起こり得ない。保険
    throw new RecordError(`Not a block: ${JSON.stringify(record)}`);

  return record as Block;
};
