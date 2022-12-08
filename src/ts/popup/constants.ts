// ========================================
// search options
// ========================================
export const SEARCH_LIMIT = 50;
export const MATCH_TAG = 'gzkNfoUU';

export const FILTERS_BY = {
  TITLE_ONLY: 'TITLE_ONLY',
} as const;

export const SORT_BY = {
  RELEVANCE: 'RELEVANCE',
  LAST_EDITED: 'LAST_EDITED',
  CREATED: 'CREATED',
} as const;

// ========================================
// API response
// ========================================

export const BLOCK_TYPE = {
  PAGE: 'page',
  COLLECTION_VIEW_PAGE: 'collection_view_page',
} as const;

export const TABLE_TYPE = {
  SPACE: 'space',
  BLOCK: 'block',
  COLLECTION: 'collection',
} as const;

// ========================================
// Others
// ========================================

export const STORAGE_KEY = {
  LAST_SEARCHED: 'LAST_SEARCHED',
} as const;

export const ICON_TYPE = {
  IMAGE: 'IMAGE',
  EMOJI: 'EMOJI',
} as const;
