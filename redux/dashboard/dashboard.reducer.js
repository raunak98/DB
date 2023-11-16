import DashboardActionTypes from './dashboard.types'

const INITIAL_STATE = {
  dashboardItems: [],
  isFetching: false,
  errorMessage: [],
  accountTypeItems: []
}

const dashboardReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DashboardActionTypes.FETCH_DASHBOARD_ITEMS_START:
      return {
        ...state,
        isFetching: true
      }
    case DashboardActionTypes.FETCH_DASHBOARD_ITEMS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        dashboardItems: action.payload
      }
    case DashboardActionTypes.FETCH_DASHBOARD_ITEMS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }
    case DashboardActionTypes.FETCH_ACCOUNT_TYPE_ITEMS_START:
      return {
        ...state,
        isFetching: true
      }
    case DashboardActionTypes.FETCH_ACCOUNT_TYPE_ITEMS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        accountTypeItems: action.payload
      }
    case DashboardActionTypes.FETCH_ACCOUNT_TYPE_ITEMS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }
    default:
      return state
  }
}

export default dashboardReducer
