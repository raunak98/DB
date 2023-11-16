import MyTeamActionTypes from './myTeam.type'

const INITIAL_STATE = {
  myTeamItems: null,
  myTeamsSearchItem: null,
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

const myTeamReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // My Team page actions
    case MyTeamActionTypes.FETCH_MYTEAM_ITEMS_START:
      return {
        ...state,
        isFetching: true
      }
    case MyTeamActionTypes.FETCH_MYTEAM_ITEMS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        myTeamItems: action.payload
      }
    case MyTeamActionTypes.FETCH_MYTEAM_ITEMS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }

    // requestHistory Search
    case MyTeamActionTypes.FETCH_MYTEAM_SEARCH_START:
      return {
        ...state,
        isFetching: true
      }
    case MyTeamActionTypes.FETCH_MYTEAM_SEARCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        myTeamsSearchItem: action.payload
      }
    case MyTeamActionTypes.FETCH_MYTEAM_SEARCH_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }

    // requestHistory metadata
    case MyTeamActionTypes.FETCH_MYTEAM_METADATA_START:
      return {
        ...state,
        isFetching: true
      }
    case MyTeamActionTypes.FETCH_MYTEAM_METADATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        metadata: action.payload
      }
    case MyTeamActionTypes.FETCH_MYTEAM_METADATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }
    case MyTeamActionTypes.MYTEAM_PAGESIZE:
      return {
        ...state,
        pageSize: action.payload
      }
    case MyTeamActionTypes.MYTEAM_PAGE_NUMBER:
      return {
        ...state,
        pageNumber: action.payload
      }
    case MyTeamActionTypes.SHOW_BIG_LOADER:
      return {
        ...state,
        showBigLoader: action.payload,
        isFetching: action.payload
      }
    case MyTeamActionTypes.UPDATE_IS_GOING_FORWARD_FLAG:
      return {
        ...state,
        isGoingForward: action.payload
      }
    case MyTeamActionTypes.UPDATE_PAGINATION_KEYS:
      return {
        ...state,
        paginationKeys: action.payload
      }
    case MyTeamActionTypes.FETCH_MYTEAM_SORT_START:
      return {
        ...state,
        isFetching: true
      }

    case MyTeamActionTypes.UPDATE_MYTEAM_SORT_INFO:
      return {
        ...state,
        sortInfo: action.payload
      }
    default:
      return state
  }
}

export default myTeamReducer
