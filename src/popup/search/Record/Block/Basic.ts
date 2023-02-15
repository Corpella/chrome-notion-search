import { BLOCK_TYPE, BLOCK_TYPE_MAP } from '../constants';
import { Block } from './';
import { isCollectionView } from './CollectionView';

export class BasicBlock extends Block {
  public type: SearchApi.BlockBasic['type'];

  constructor({ block }: { block: SearchApi.Block }) {
    super({ block });

    if (isCollectionView(block)) {
      throw new Error(
        `Collection view. type: ${block.type}. block: ${JSON.stringify(block)}`,
      );
    } else if (!BLOCK_TYPE_MAP[block.type]) {
      throw new Error(
        `Unknown block type: ${block.type}. block: ${JSON.stringify(block)}`,
      );
    }
    this.type = block.type;
  }
  public canBeDir() {
    return this.type === BLOCK_TYPE.PAGE;
  }
}
