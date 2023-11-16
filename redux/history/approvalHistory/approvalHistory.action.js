import ApprovalHistoryActionTypes from './approvalHistory.type'

export const fetchApprovalHistoryItemsStart = (payload) => ({
  type: ApprovalHistoryActionTypes.FETCH_APPROVALHISTORY_ITEMS_START,
  payload
})

export const fetchApprovalHistoryItemsSuccess = (payload) => ({
  type: ApprovalHistoryActionTypes.FETCH_APPROVALHISTORY_ITEMS_SUCCESS,
  payload
})

export const fetchApprovalHistoryItemsFailure = (payload) => ({
  type: ApprovalHistoryActionTypes.FETCH_APPROVALHISTORY_ITEMS_FAILURE,
  payload
})

export const fetchApprovalHistorySearchStart = (payload) => ({
  type: ApprovalHistoryActionTypes.FETCH_APPROVALHISTORY_SEARCH_START,
  payload
})

export const fetchApprovalHistorySearchSuccess = (payload) => ({
  type: ApprovalHistoryActionTypes.FETCH_APPROVALHISTORY_SEARCH_SUCCESS,
  payload
})

export const fetchApprovalHistorySearchFailure = (payload) => ({
  type: ApprovalHistoryActionTypes.FETCH_APPROVALHISTORY_SEARCH_FAILURE,
  payload
})
export const fetchApprovalHistoryMetadataStart = () => ({
  type: ApprovalHistoryActionTypes.FETCH_APPROVALHISTORY_METADATA_START
})

export const fetchApprovalHistoryMetadataSuccess = (payload) => ({
  type: ApprovalHistoryActionTypes.FETCH_APPROVALHISTORY_METADATA_SUCCESS,
  payload
})

export const fetchApprovalHistoryMetadataFailure = (payload) => ({
  type: ApprovalHistoryActionTypes.FETCH_APPROVALHISTORY_METADATA_FAILURE,
  payload
})

export const updatePageSizeApprovalHistory = (payload) => ({
  type: ApprovalHistoryActionTypes.APPROVALHISTORY_PAGESIZE,
  payload
})

export const updatePageNumberApprovalHistory = (payload) => ({
  type: ApprovalHistoryActionTypes.APPROVALHISTORY_PAGE_NUMBER,
  payload
})

export const updateShowBigLoader = (payload) => ({
  type: ApprovalHistoryActionTypes.SHOW_BIG_LOADER,
  payload
})

export const fetchPaginationKeys = (payload) => ({
  type: ApprovalHistoryActionTypes.FETCH_PAGINARION_KEYS,
  payload
})

export const updateAhistoryPaginationKeys = (payload) => ({
  type: ApprovalHistoryActionTypes.UPDATE_PAGINATION_KEYS,
  payload
})

export const fetchIsGoingForwardFlag = (payload) => ({
  type: ApprovalHistoryActionTypes.FETCH_IS_GOING_FORWARD_FLAG,
  payload
})

export const updateIsAhistoryGoingForwardFlag = (payload) => ({
  type: ApprovalHistoryActionTypes.UPDATE_IS_GOING_FORWARD_FLAG,
  payload
})

export const fetchApprovalHistorySortStart = (payload) => ({
  type: ApprovalHistoryActionTypes.FETCH_APPROVAL_HISTORY_SORT_START,
  payload
})

export const updateApprovalHistorySortInfoData = (payload) => ({
  type: ApprovalHistoryActionTypes.UPDATE_APPROVAL_HISTORY_SORT_INFO,
  payload
})

export const updateAhistorySearchAfterKeys = (payload) => ({
  type: ApprovalHistoryActionTypes.UPDATE_SEARCH_AFTER_KEYS,
  payload
})
