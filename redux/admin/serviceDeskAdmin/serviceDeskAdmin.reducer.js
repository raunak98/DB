import ServiceDeskAdminActionTypes from './serviceDeskAdmin.type'

const INITIAL_STATE = {
  serviceDeskAdminItems: null,
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

const serviceDeskAdminReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // serviceDeskAdmin actions
    case ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_ITEMS_START:
      return {
        ...state,
        isFetching: true
      }
    case ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_ITEMS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        serviceDeskAdminItems: action.payload
      }
    case ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_ITEMS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }

    // serviceDeskAdmin Search
    case ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_SEARCH_START:
      return {
        ...state,
        isFetching: true
      }
    case ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_SEARCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        serviceDeskAdminItems: action.payload
      }
    case ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_SEARCH_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }

    // serviceDeskAdmin metadata
    case ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_METADATA_START:
      return {
        ...state,
        isFetching: true
      }
    case ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_METADATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        metadata: action.payload
      }
    case ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_METADATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }
    case ServiceDeskAdminActionTypes.SERVICEDESKADMIN_PAGESIZE:
      return {
        ...state,
        pageSize: action.payload
      }
    case ServiceDeskAdminActionTypes.SERVICEDESKADMIN_PAGE_NUMBER:
      return {
        ...state,
        pageNumber: action.payload
      }
    case ServiceDeskAdminActionTypes.SHOW_BIG_LOADER:
      return {
        ...state,
        showBigLoader: action.payload,
        isFetching: action.payload
      }
    case ServiceDeskAdminActionTypes.UPDATE_IS_GOING_FORWARD_FLAG:
      return {
        ...state,
        isGoingForward: action.payload
      }
    case ServiceDeskAdminActionTypes.UPDATE_PAGINATION_KEYS:
      return {
        ...state,
        paginationKeys: action.payload
      }
    case ServiceDeskAdminActionTypes.FETCH_SERVICE_DESK_ADMIN_SORT_START:
      return {
        ...state,
        isFetching: true
      }

    case ServiceDeskAdminActionTypes.UPDATE_SERVICE_DESK_ADMIN_SORT_INFO:
      return {
        ...state,
        sortInfo: action.payload
      }
    case ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_ITEMS_BY_USER_START:
      return {
        ...state,
        isFetching: true
      }
    case ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_SORT_BY_USER_START:
      return {
        ...state,
        isFetching: true
      }
    case ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_SEARCH_BY_USER_START:
      return {
        ...state,
        isFetching: true
      }
    default:
      return state
  }
}

export default serviceDeskAdminReducer
