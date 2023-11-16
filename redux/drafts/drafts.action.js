import DraftsActionTypes from './drafts.type'

export const fetchDraftsItemsStart = (payload) => ({
  type: DraftsActionTypes.FETCH_DRAFTS_ITEMS_START,
  payload
})

export const fetchDraftsItemsSuccess = (payload) => ({
  type: DraftsActionTypes.FETCH_DRAFTS_ITEMS_SUCCESS,
  payload
})

export const fetchDraftsItemsFailure = (payload) => ({
  type: DraftsActionTypes.FETCH_DRAFTS_ITEMS_FAILURE,
  payload
})

export const fetchDraftsMetadataStart = (payload) => ({
  type: DraftsActionTypes.FETCH_DRAFTS_METADATA_START,
  payload
})

export const fetchDraftsMetadataSuccess = (payload) => ({
  type: DraftsActionTypes.FETCH_DRAFTS_METADATA_SUCCESS,
  payload
})

export const fetchDraftsMetadataFailure = (payload) => ({
  type: DraftsActionTypes.FETCH_DRAFTS_METADATA_FAILURE,
  payload
})

export const updateDraftsPageSize = (payload) => ({
  type: DraftsActionTypes.DRAFTS_PAGESIZE,
  payload
})

export const updateDraftsPageNumber = (payload) => ({
  type: DraftsActionTypes.DRAFTS_PAGE_NUMBER,
  payload
})

export const updateDraftsShowSmallLoader = (payload) => ({
  type: DraftsActionTypes.DRAFTS_SHOW_SMALL_LOADER,
  payload
})

export const updateDraftsShowBigLoader = (payload) => ({
  type: DraftsActionTypes.DRAFTS_SHOW_BIG_LOADER,
  payload
})

export const fetchPaginationKeys = (payload) => ({
  type: DraftsActionTypes.FETCH_PAGINARION_KEYS,
  payload
})

export const updatePaginationKeys = (payload) => ({
  type: DraftsActionTypes.UPDATE_PAGINATION_KEYS,
  payload
})

export const fetchIsGoingForwardFlag = (payload) => ({
  type: DraftsActionTypes.FETCH_IS_GOING_FORWARD_FLAG,
  payload
})

export const updateIsGoingForwardFlag = (payload) => ({
  type: DraftsActionTypes.UPDATE_IS_GOING_FORWARD_FLAG,
  payload
})

export const fetchDraftsSortStart = (payload) => ({
  type: DraftsActionTypes.FETCH_DRAFTS_SORT_START,
  payload
})

export const updateDraftsSortInfoData = (payload) => ({
  type: DraftsActionTypes.UPDATE_DRAFTS_SORT_INFO,
  payload
})

export const updateDraftsSearchAfterKeys = (payload) => ({
  type: DraftsActionTypes.UPDATE_SEARCH_AFTER_KEYS,
  payload
})

export const fetchDraftSearchStart = (payload) => ({
  type: DraftsActionTypes.FETCH_DRAFT_SEARCH_START,
  payload
})

export const updateDraftsItemsStart = (payload) => ({
  type: DraftsActionTypes.UPDATE_DRAFTS_ITEMS,
  payload
})
