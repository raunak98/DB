import MyAccessActionTypes from './myAccess.type'

const INITIAL_STATE = {
  myAccessGroupItems: {},
  isFetching: false,
  errorMessage: undefined,
  metadata: null,
  groupMetadata: null,
  showSmallLoader: false,
  showBigLoader: false,
  paginationKeys: [],
  isGoingForward: true,
  pageNumber: 0,
  pageSize: 10,
  sortInfo: {
    sortKey: '',
    isAscending: 'asc',
    payload: {}
  }
}

const myAccessReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MyAccessActionTypes.FETCH_GROUP_ACCESS_ITEMS_START:
      return {
        ...state,
        isFetching: true
      }
    case MyAccessActionTypes.FETCH_GROUP_ACCESS_ITEMS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        myAccessGroupItems: action.payload.myAccessGroupItems
      }
    case MyAccessActionTypes.FETCH_GROUP_ACCESS_ITEMS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload
      }
    case MyAccessActionTypes.FETCH_GROUP_ACCESS_METADATA_START:
      return {
        ...state,
        isFetching: true
      }
    case MyAccessActionTypes.FETCH_GROUP_ACCESS_METADATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        metadata: action.payload
      }
    case MyAccessActionTypes.FETCH_GROUP_ACCESS_METADATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }
    case MyAccessActionTypes.SHOW_SMALL_ACCESS_LOADER:
      return {
        ...state,
        showSmallLoader: action.payload
      }
    case MyAccessActionTypes.SHOW_BIG_ACCESS_LOADER:
      return {
        ...state,
        showBigLoader: action.payload,
        isFetching: action.payload
      }
    case MyAccessActionTypes.UPDATE_ACCESS_IS_GOING_FORWARD_FLAG:
      return {
        ...state,
        isGoingForward: action.payload
      }
    case MyAccessActionTypes.UPDATE_ACCESS_PAGINATION_KEYS:
      return {
        ...state,
        paginationKeys: action.payload
      }
    case MyAccessActionTypes.ACCESS_PAGE_SIZE:
      return {
        ...state,
        pageSize: action.payload
      }
    case MyAccessActionTypes.ACCESS_PAGE_NUMBER:
      return {
        ...state,
        pageNumber: action.payload
      }
    case MyAccessActionTypes.FETCH_GROUP_ACCESS_SORT_START:
      return {
        ...state,
        isFetching: true
      }

    case MyAccessActionTypes.UPDATE_GROUP_ACCESS_SORT_INFO:
      return {
        ...state,
        sortInfo: action.payload
      }
    case MyAccessActionTypes.FETCH_GROUP_ACCESS_SEARCH_START:
      return {
        ...state,
        isFetching: true
      }
    default:
      return state
  }
}

export default myAccessReducer
