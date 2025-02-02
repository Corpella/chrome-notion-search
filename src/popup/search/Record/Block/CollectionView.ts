import { Collection } from '../Collection';
import { BLOCK_TYPE_COLLECTION_VIEW } from '../constants';
import { Block } from './Block';

export const isCollectionView = (
  block: SearchApi.Block,
): block is SearchApi.BlockCollectionView => {
  return Object.hasOwn(BLOCK_TYPE_COLLECTION_VIEW, block.type);
};

// combines collection view page and collection view
export class CollectionViewBlock extends Block {
  collection?: Collection;
  constructor({
    block,
    collection,
  }: {
    block: SearchApi.Block;
    collection?: Collection;
  }) {
    super({ block });
    this.collection = collection;

    if (!isCollectionView(block)) {
      throw new Error(
        `Not a collection view. type: ${block.type}. block: ${JSON.stringify(
          block,
        )}`,
      );
    }
  }

  public canBeDir() {
    return true;
  }
  public get title() {
    return super.title ?? this.collection?.title;
  }
  public get icon() {
    // collection が icon を持つケースは https://www.notion.so/4897c80a8baa4c4d92617e1f627121bf とか
    // cvp 全部がそうというわけでなく、 format.page_icon があるやつもある
    return super.icon ?? this.collection?.icon;
  }
}
