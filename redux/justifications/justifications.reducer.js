import JustificationsActionTypes from './justifications.type'

const INITIAL_STATE = {
  justificationsItems: {},
  isFetching: false,
  errorMessage: undefined,
  metadata: null,
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

const justificationsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case JustificationsActionTypes.FETCH_JUSTIFICATIONS_ITEMS_START:
      return {
        ...state,
        isFetching: true
      }
    case JustificationsActionTypes.FETCH_JUSTIFICATIONS_ITEMS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        justificationsItems: action.payload.justificationsItems
      }
    case JustificationsActionTypes.FETCH_JUSTIFICATIONS_ITEMS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload
      }
    case JustificationsActionTypes.FETCH_JUSTIFICATIONS_METADATA_START:
      return {
        ...state,
        isFetching: true
      }
    case JustificationsActionTypes.FETCH_JUSTIFICATIONS_METADATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        metadata: action.payload
      }
    case JustificationsActionTypes.FETCH_JUSTIFICATIONS_METADATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }
    case JustificationsActionTypes.SHOW_SMALL_LOADER:
      return {
        ...state,
        showSmallLoader: action.payload
      }
    case JustificationsActionTypes.SHOW_BIG_LOADER:
      return {
        ...state,
        showBigLoader: action.payload,
        isFetching: action.payload
      }
    case JustificationsActionTypes.UPDATE_JUSTIFICATIONS_IS_GOING_FORWARD_FLAG:
      return {
        ...state,
        isGoingForward: action.payload
      }
    case JustificationsActionTypes.UPDATE_JUSTIFICATIONS_PAGINATION_KEYS:
      return {
        ...state,
        paginationKeys: action.payload
      }
    case JustificationsActionTypes.JUSTIFICATIONS_PAGESIZE:
      return {
        ...state,
        pageSize: action.payload
      }
    case JustificationsActionTypes.JUSTIFICATIONS_PAGE_NUMBER:
      return {
        ...state,
        pageNumber: action.payload
      }
    case JustificationsActionTypes.FETCH_JUSTIFICATIONS_SORT_START:
      return {
        ...state,
        isFetching: true
      }

    case JustificationsActionTypes.UPDATE_JUSTIFICATIONS_SORT_INFO:
      return {
        ...state,
        sortInfo: action.payload
      }
    case JustificationsActionTypes.FETCH_JUSTIFICATIONS_SEARCH_START:
      return {
        ...state,
        isFetching: true
      }
    default:
      return state
  }
}

export default justificationsReducer
