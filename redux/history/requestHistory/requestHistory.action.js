import RequestHistoryActionTypes from './requestHistory.type'

export const fetchRequestHistoryItemsStart = (payload) => ({
  type: RequestHistoryActionTypes.FETCH_REQUESTHISTORY_ITEMS_START,
  payload
})

export const fetchRequestHistoryItemsSuccess = (payload) => ({
  type: RequestHistoryActionTypes.FETCH_REQUESTHISTORY_ITEMS_SUCCESS,
  payload
})

export const fetchRequestHistoryItemsFailure = (payload) => ({
  type: RequestHistoryActionTypes.FETCH_REQUESTHISTORY_ITEMS_FAILURE,
  payload
})

export const fetchRequestHistorySearchStart = (payload) => ({
  type: RequestHistoryActionTypes.FETCH_REQUESTHISTORY_SEARCH_START,
  payload
})

export const fetchRequestHistorySearchSuccess = (payload) => ({
  type: RequestHistoryActionTypes.FETCH_REQUESTHISTORY_SEARCH_SUCCESS,
  payload
})

export const fetchRequestHistorySearchFailure = (payload) => ({
  type: RequestHistoryActionTypes.FETCH_REQUESTHISTORY_SEARCH_FAILURE,
  payload
})
export const fetchRequestHistoryMetadataStart = () => ({
  type: RequestHistoryActionTypes.FETCH_REQUESTHISTORY_METADATA_START
})

export const fetchRequestHistoryMetadataSuccess = (payload) => ({
  type: RequestHistoryActionTypes.FETCH_REQUESTHISTORY_METADATA_SUCCESS,
  payload
})

export const fetchRequestHistoryMetadataFailure = (payload) => ({
  type: RequestHistoryActionTypes.FETCH_REQUESTHISTORY_METADATA_FAILURE,
  payload
})

export const updatePageSizeRequestHistory = (payload) => ({
  type: RequestHistoryActionTypes.REQUESTHISTORY_PAGESIZE,
  payload
})

export const updatePageNumberRequestHistory = (payload) => ({
  type: RequestHistoryActionTypes.REQUESTHISTORY_PAGE_NUMBER,
  payload
})

export const updateShowBigLoader = (payload) => ({
  type: RequestHistoryActionTypes.SHOW_BIG_LOADER,
  payload
})

export const fetchPaginationKeys = (payload) => ({
  type: RequestHistoryActionTypes.FETCH_PAGINARION_KEYS,
  payload
})

export const updateRhistoryPaginationKeys = (payload) => ({
  type: RequestHistoryActionTypes.UPDATE_PAGINATION_KEYS,
  payload
})

export const fetchIsGoingForwardFlag = (payload) => ({
  type: RequestHistoryActionTypes.FETCH_IS_GOING_FORWARD_FLAG,
  payload
})

export const updateIsRhistoryGoingForwardFlag = (payload) => ({
  type: RequestHistoryActionTypes.UPDATE_IS_GOING_FORWARD_FLAG,
  payload
})

export const fetchRequestHistorySortStart = (payload) => ({
  type: RequestHistoryActionTypes.FETCH_REQUEST_HISTORY_SORT_START,
  payload
})

export const updateRequestHistorySortInfoData = (payload) => ({
  type: RequestHistoryActionTypes.UPDATE_REQUEST_HISTORY_SORT_INFO,
  payload
})

export const fetchRequestHistoryItemsByUserStart = (payload) => ({
  type: RequestHistoryActionTypes.FETCH_REQUESTHISTORY_ITEMS_BY_USER_START,
  payload
})

export const fetchRequestHistorySortByUserStart = (payload) => ({
  type: RequestHistoryActionTypes.FETCH_REQUESTHISTORY_SORT_BY_USER_START,
  payload
})

export const fetchRequestHistorySearchByUserStart = (payload) => ({
  type: RequestHistoryActionTypes.FETCH_REQUESTHISTORY_SEARCH_BY_USER_START,
  payload
})
