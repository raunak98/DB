import JustificationsActionTypes from './justifications.type'

export const fetchJustificationsItemsStart = (pageSize, pageNumber) => ({
  type: JustificationsActionTypes.FETCH_JUSTIFICATIONS_ITEMS_START,
  pageSize,
  pageNumber
})

export const fetchJustificationsItemsSuccess = (payload) => ({
  type: JustificationsActionTypes.FETCH_JUSTIFICATIONS_ITEMS_SUCCESS,
  payload
})

export const fetchJustificationsItemsFailure = (payload) => ({
  type: JustificationsActionTypes.FETCH_JUSTIFICATIONS_ITEMS_FAILURE,
  payload
})

export const fetchJustificationsMetadataStart = (payload) => ({
  type: JustificationsActionTypes.FETCH_JUSTIFICATIONS_METADATA_START,
  payload
})

export const fetchJustificationsMetadataSuccess = (payload) => ({
  type: JustificationsActionTypes.FETCH_JUSTIFICATIONS_METADATA_SUCCESS,
  payload
})

export const fetchJustificationsMetadataFailure = (payload) => ({
  type: JustificationsActionTypes.FETCH_JUSTIFICATIONS_METADATA_FAILURE,
  payload
})

export const updateShowSmallLoader = (payload) => ({
  type: JustificationsActionTypes.SHOW_SMALL_LOADER,
  payload
})

export const updateShowBigLoader = (payload) => ({
  type: JustificationsActionTypes.SHOW_BIG_LOADER,
  payload
})

export const updateJustificationsPaginationKeys = (payload) => ({
  type: JustificationsActionTypes.UPDATE_JUSTIFICATIONS_PAGINATION_KEYS,
  payload
})

export const updateJustificationsIsGoingForwardFlag = (payload) => ({
  type: JustificationsActionTypes.UPDATE_JUSTIFICATIONS_IS_GOING_FORWARD_FLAG,
  payload
})

export const updateJustificationsPageSize = (payload) => ({
  type: JustificationsActionTypes.JUSTIFICATIONS_PAGESIZE,
  payload
})

export const updateJustificationsPageNumber = (payload) => ({
  type: JustificationsActionTypes.JUSTIFICATIONS_PAGE_NUMBER,
  payload
})

export const fetchJustificationsSortStart = (payload) => ({
  type: JustificationsActionTypes.FETCH_JUSTIFICATIONS_SORT_START,
  payload
})

export const updateJustificationsSortInfoData = (payload) => ({
  type: JustificationsActionTypes.UPDATE_JUSTIFICATIONS_SORT_INFO,
  payload
})

export const fetchJustificationsSearchStart = (payload) => ({
  type: JustificationsActionTypes.FETCH_JUSTIFICATIONS_SEARCH_START,
  payload
})
