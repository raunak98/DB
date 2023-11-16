import RequestHistoryActionTypes from './requestHistory.type'

const INITIAL_STATE = {
  requestHistoryItems: null,
  metadata: null,
  isFetching: false,
  errorMessages: [],
  pageNumber: 0,
  pageSize: 10,
  showBigLoader: false,
  paginationKeys: [],
  isGoingForward: true,
  sortInfo: {
    sortKey: '',
    isAscending: 'asc',
    payload: {}
  }
}

const requestHistoryReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // requestHistory actions
    case RequestHistoryActionTypes.FETCH_REQUESTHISTORY_ITEMS_START:
      return {
        ...state,
        isFetching: true
      }
    case RequestHistoryActionTypes.FETCH_REQUESTHISTORY_ITEMS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        requestHistoryItems: action.payload
      }
    case RequestHistoryActionTypes.FETCH_REQUESTHISTORY_ITEMS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }

    // requestHistory Search
    case RequestHistoryActionTypes.FETCH_REQUESTHISTORY_SEARCH_START:
      return {
        ...state,
        isFetching: true
      }
    case RequestHistoryActionTypes.FETCH_REQUESTHISTORY_SEARCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        requestHistoryItems: action.payload
      }
    case RequestHistoryActionTypes.FETCH_REQUESTHISTORY_SEARCH_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }

    // requestHistory metadata
    case RequestHistoryActionTypes.FETCH_REQUESTHISTORY_METADATA_START:
      return {
        ...state,
        isFetching: true
      }
    case RequestHistoryActionTypes.FETCH_REQUESTHISTORY_METADATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        metadata: action.payload
      }
    case RequestHistoryActionTypes.FETCH_REQUESTHISTORY_METADATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }
    case RequestHistoryActionTypes.REQUESTHISTORY_PAGESIZE:
      return {
        ...state,
        pageSize: action.payload
      }
    case RequestHistoryActionTypes.REQUESTHISTORY_PAGE_NUMBER:
      return {
        ...state,
        pageNumber: action.payload
      }
    case RequestHistoryActionTypes.SHOW_BIG_LOADER:
      return {
        ...state,
        showBigLoader: action.payload,
        isFetching: action.payload
      }
    case RequestHistoryActionTypes.UPDATE_IS_GOING_FORWARD_FLAG:
      return {
        ...state,
        isGoingForward: action.payload
      }
    case RequestHistoryActionTypes.UPDATE_PAGINATION_KEYS:
      return {
        ...state,
        paginationKeys: action.payload
      }
    case RequestHistoryActionTypes.FETCH_REQUEST_HISTORY_SORT_START:
      return {
        ...state,
        isFetching: true
      }

    case RequestHistoryActionTypes.UPDATE_REQUEST_HISTORY_SORT_INFO:
      return {
        ...state,
        sortInfo: action.payload
      }
    case RequestHistoryActionTypes.FETCH_REQUESTHISTORY_ITEMS_BY_USER_START:
      return {
        ...state,
        isFetching: true
      }
    case RequestHistoryActionTypes.FETCH_REQUESTHISTORY_SORT_BY_USER_START:
      return {
        ...state,
        isFetching: true
      }
    case RequestHistoryActionTypes.FETCH_REQUESTHISTORY_SEARCH_BY_USER_START:
      return {
        ...state,
        isFetching: true
      }
    default:
      return state
  }
}

export default requestHistoryReducer
