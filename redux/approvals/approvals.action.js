import ApprovalsActionTypes from './approvals.type'

export const fetchApprovalsItemsStart = (payload) => ({
  type: ApprovalsActionTypes.FETCH_APPROVALS_ITEMS_START,
  payload
})

export const fetchApprovalsItemsSuccess = (payload) => ({
  type: ApprovalsActionTypes.FETCH_APPROVALS_ITEMS_SUCCESS,
  payload
})

export const fetchApprovalsItemsFailure = (payload) => ({
  type: ApprovalsActionTypes.FETCH_APPROVALS_ITEMS_FAILURE,
  payload
})

export const updateApprovalsNotificationMessage = (payload) => ({
  type: ApprovalsActionTypes.UPDATE_APPROVALS_NOTIFICATION_MESSAGE,
  payload
})

export const fetchApprovalsMetadataStart = (payload) => ({
  type: ApprovalsActionTypes.FETCH_APPROVALS_METADATA_START,
  payload
})

export const fetchApprovalsMetadataSuccess = (payload) => ({
  type: ApprovalsActionTypes.FETCH_APPROVALS_METADATA_SUCCESS,
  payload
})

export const fetchApprovalsMetadataFailure = (payload) => ({
  type: ApprovalsActionTypes.FETCH_APPROVALS_METADATA_FAILURE,
  payload
})

export const updateApprovalsItemsStart = (payload) => ({
  type: ApprovalsActionTypes.UPDATE_APPROVALS_ITEMS,
  payload
})

export const updateApprovalsPageSize = (payload) => ({
  type: ApprovalsActionTypes.APPROVALS_PAGESIZE,
  payload
})

export const updateApprovalsPageNumber = (payload) => ({
  type: ApprovalsActionTypes.APPROVALS_PAGE_NUMBER,
  payload
})

export const updateShowSmallLoader = (payload) => ({
  type: ApprovalsActionTypes.SHOW_SMALL_LOADER,
  payload
})

export const updateShowBigLoader = (payload) => ({
  type: ApprovalsActionTypes.SHOW_BIG_LOADER,
  payload
})

export const fetchApprovalsPaginationKeys = (payload) => ({
  type: ApprovalsActionTypes.FETCH_APPROVALS_PAGINARION_KEYS,
  payload
})

export const updateApprovalsPaginationKeys = (payload) => ({
  type: ApprovalsActionTypes.UPDATE_APPROVALS_PAGINATION_KEYS,
  payload
})

export const updateApprovalsSearchAfterKeys = (payload) => ({
  type: ApprovalsActionTypes.UPDATE_SEARCH_AFTER_KEYS,
  payload
})

export const fetchApprovalsIsGoingForwardFlag = (payload) => ({
  type: ApprovalsActionTypes.FETCH_APPROVALS_IS_GOING_FORWARD_FLAG,
  payload
})

export const updateApprovalsIsGoingForwardFlag = (payload) => ({
  type: ApprovalsActionTypes.UPDATE_APPROVALS_IS_GOING_FORWARD_FLAG,
  payload
})

export const fetchApprovalSearchStart = (payload) => ({
  type: ApprovalsActionTypes.FETCH_APPROVALS_SEARCH_START,
  payload
})

export const fetchApprovalSortStart = (payload) => ({
  type: ApprovalsActionTypes.FETCH_APPROVALS_SORT_START,
  payload
})

export const updateApprovalSortInfoData = (payload) => ({
  type: ApprovalsActionTypes.UPDATE_APPROVALS_SORT_INFO,
  payload
})
