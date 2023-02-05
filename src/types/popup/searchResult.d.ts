type Dir = {
  title: string;
  record: SearchApi.Record;
};

type Item = {
  title: string;
  url: string;
  text?: string;
  icon: {
    type: valueOf<typeof import('../../popup/constants').ICON_TYPE>;
    value: string;
  };
  dirs: Dir[];
  // type: BlocksInSpace と API に指定している限り workspace, collection は含まれないため
  block: SearchApi.Block;
};

type SearchResult = {
  items: Item[];
  total: number;
};

type SearchResultCache = {
  query: string;
  searchResult: SearchResult;
};
