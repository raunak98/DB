import ApprovalHistoryActionTypes from './approvalHistory.type'

const INITIAL_STATE = {
  approvalHistoryItems: null,
  metadata: null,
  isFetching: false,
  errorMessages: [],
  pageNumber: 0,
  pageSize: 10,
  showBigLoader: false,
  paginationKeys: [],
  searchAfterKeys: [],
  isGoingForward: true,
  sortInfo: {
    sortKey: '',
    isAscending: 'asc',
    payload: {}
  }
}

const approvalHistoryReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // requestHistory actions
    case ApprovalHistoryActionTypes.FETCH_APPROVALHISTORY_ITEMS_START:
      return {
        ...state,
        isFetching: true
      }
    case ApprovalHistoryActionTypes.FETCH_APPROVALHISTORY_ITEMS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        approvalHistoryItems: action.payload
      }
    case ApprovalHistoryActionTypes.FETCH_APPROVALHISTORY_ITEMS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }

    // approvalHistory Search
    case ApprovalHistoryActionTypes.FETCH_APPROVALHISTORY_SEARCH_START:
      return {
        ...state,
        isFetching: true
      }
    case ApprovalHistoryActionTypes.FETCH_APPROVALHISTORY_SEARCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        approvalHistoryItems: action.payload
      }
    case ApprovalHistoryActionTypes.FETCH_APPROVALHISTORY_SEARCH_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }

    // approvalHistory metadata
    case ApprovalHistoryActionTypes.FETCH_APPROVALHISTORY_METADATA_START:
      return {
        ...state,
        isFetching: true
      }
    case ApprovalHistoryActionTypes.FETCH_APPROVALHISTORY_METADATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        metadata: action.payload
      }
    case ApprovalHistoryActionTypes.FETCH_APPROVALHISTORY_METADATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }
    case ApprovalHistoryActionTypes.APPROVALHISTORY_PAGESIZE:
      return {
        ...state,
        pageSize: action.payload
      }
    case ApprovalHistoryActionTypes.APPROVALHISTORY_PAGE_NUMBER:
      return {
        ...state,
        pageNumber: action.payload
      }
    case ApprovalHistoryActionTypes.SHOW_BIG_LOADER:
      return {
        ...state,
        showBigLoader: action.payload,
        isFetching: action.payload
      }
    case ApprovalHistoryActionTypes.UPDATE_IS_GOING_FORWARD_FLAG:
      return {
        ...state,
        isGoingForward: action.payload
      }
    case ApprovalHistoryActionTypes.UPDATE_PAGINATION_KEYS:
      return {
        ...state,
        paginationKeys: action.payload
      }
    case ApprovalHistoryActionTypes.UPDATE_SEARCH_AFTER_KEYS:
      return {
        ...state,
        searchAfterKeys: action.payload
      }
    case ApprovalHistoryActionTypes.FETCH_APPROVAL_HISTORY_SORT_START:
      return {
        ...state,
        isFetching: true
      }

    case ApprovalHistoryActionTypes.UPDATE_APPROVAL_HISTORY_SORT_INFO:
      return {
        ...state,
        sortInfo: action.payload
      }

    default:
      return state
  }
}

export default approvalHistoryReducer
