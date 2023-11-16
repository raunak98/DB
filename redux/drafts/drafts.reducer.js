import DraftsActionTypes from './drafts.type'

const INITIAL_STATE = {
  draftsItems: {},
  isFetching: false,
  pageNumber: 0,
  pageSize: 10,
  errorMessage: undefined,
  metadata: null,
  showSmallLoader: false,
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

const draftsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DraftsActionTypes.FETCH_DRAFTS_ITEMS_START:
      return {
        ...state,
        isFetching: true
      }
    case DraftsActionTypes.FETCH_DRAFTS_ITEMS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        draftsItems: action.payload.draftsItems
      }
    case DraftsActionTypes.FETCH_DRAFTS_ITEMS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload
      }
    case DraftsActionTypes.FETCH_DRAFTS_METADATA_START:
      return {
        ...state,
        isFetching: true
      }
    case DraftsActionTypes.FETCH_DRAFTS_METADATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        metadata: action.payload
      }
    case DraftsActionTypes.FETCH_DRAFTS_METADATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }
    case DraftsActionTypes.DRAFTS_SHOW_SMALL_LOADER:
      return {
        ...state,
        showSmallLoader: action.payload
      }
    case DraftsActionTypes.DRAFTS_SHOW_BIG_LOADER:
      return {
        ...state,
        showBigLoader: action.payload,
        isFetching: action.payload
      }
    case DraftsActionTypes.DRAFTS_PAGESIZE:
      return {
        ...state,
        pageSize: action.payload
      }
    case DraftsActionTypes.DRAFTS_PAGE_NUMBER:
      return {
        ...state,
        pageNumber: action.payload
      }
    case DraftsActionTypes.UPDATE_IS_GOING_FORWARD_FLAG:
      return {
        ...state,
        isGoingForward: action.payload
      }
    case DraftsActionTypes.UPDATE_PAGINATION_KEYS:
      return {
        ...state,
        paginationKeys: action.payload
      }
    case DraftsActionTypes.UPDATE_SEARCH_AFTER_KEYS:
      return {
        ...state,
        searchAfterKeys: action.payload
      }
    case DraftsActionTypes.FETCH_DRAFTS_SORT_START:
      return {
        ...state,
        isFetching: true
      }

    case DraftsActionTypes.UPDATE_DRAFTS_SORT_INFO:
      return {
        ...state,
        sortInfo: action.payload
      }
    case DraftsActionTypes.FETCH_REQUESTHISTORY_SEARCH_START:
      return {
        ...state,
        isFetching: true
      }

    case DraftsActionTypes.UPDATE_DRAFTS_ITEMS:
      return {
        ...state,
        draftsItems: action.payload
      }

    default:
      return state
  }
}

export default draftsReducer
