import ApprovalsActionTypes from './approvals.type'

const INITIAL_STATE = {
  approvalsItems: {},
  isFetching: false,
  pageNumber: 0,
  pageSize: 10,
  errorMessage: undefined,
  metadata: null,
  showSmallLoader: false,
  showBigLoader: false,
  paginationKeys: [],
  searchAfterKeyword: [],
  isGoingForward: true,
  sortInfo: {
    sortKey: '',
    isAscending: 'asc',
    payload: {}
  },
  notification: {
    type: 'info',
    message: null
  }
}

const approvalsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ApprovalsActionTypes.FETCH_APPROVALS_ITEMS_START:
      return {
        ...state,
        isFetching: true
      }
    case ApprovalsActionTypes.FETCH_APPROVALS_ITEMS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        approvalsItems: action.payload.approvalsItems
      }
    case ApprovalsActionTypes.FETCH_APPROVALS_ITEMS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload
      }

    case ApprovalsActionTypes.FETCH_APPROVALS_SEARCH_START:
      return {
        ...state,
        isFetching: true
      }
    case ApprovalsActionTypes.FETCH_APPROVALS_SEARCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        approvalsItems: action.payload.approvalsItems
      }
    case ApprovalsActionTypes.FETCH_APPROVALS_SEARCH_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload
      }
    case ApprovalsActionTypes.FETCH_APPROVALS_METADATA_START:
      return {
        ...state,
        isFetching: true
      }
    case ApprovalsActionTypes.FETCH_APPROVALS_METADATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        metadata: action.payload
      }
    case ApprovalsActionTypes.FETCH_APPROVALS_METADATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }
    case ApprovalsActionTypes.SHOW_SMALL_LOADER:
      return {
        ...state,
        showSmallLoader: action.payload
      }
    case ApprovalsActionTypes.UPDATE_APPROVALS_NOTIFICATION_MESSAGE:
      return {
        ...state,
        notification: { ...action.payload }
      }
    case ApprovalsActionTypes.SHOW_BIG_LOADER:
      return {
        ...state,
        showBigLoader: action.payload,
        isFetching: action.payload
      }
    case ApprovalsActionTypes.UPDATE_APPROVALS_ITEMS:
      return {
        ...state,
        approvalsItems: action.payload
      }
    case ApprovalsActionTypes.APPROVALS_PAGESIZE:
      return {
        ...state,
        pageSize: action.payload
      }
    case ApprovalsActionTypes.APPROVALS_PAGE_NUMBER:
      return {
        ...state,
        pageNumber: action.payload
      }
    case ApprovalsActionTypes.UPDATE_APPROVALS_IS_GOING_FORWARD_FLAG:
      return {
        ...state,
        isGoingForward: action.payload
      }
    case ApprovalsActionTypes.UPDATE_APPROVALS_PAGINATION_KEYS:
      return {
        ...state,
        paginationKeys: action.payload
      }
    case ApprovalsActionTypes.UPDATE_SEARCH_AFTER_KEYS:
      return {
        ...state,
        searchAfterKeyword: action.payload
      }
    case ApprovalsActionTypes.FETCH_APPROVALS_SORT_START:
      return {
        ...state,
        isFetching: true
      }

    case ApprovalsActionTypes.UPDATE_APPROVALS_SORT_INFO:
      return {
        ...state,
        sortInfo: action.payload
      }

    default:
      return state
  }
}

export default approvalsReducer
