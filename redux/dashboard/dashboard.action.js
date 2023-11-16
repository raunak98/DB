import DashboardActionTypes from './dashboard.types'

export const fetchDashboardItemsStart = () => ({
  type: DashboardActionTypes.FETCH_DASHBOARD_ITEMS_START
})

export const fetchDashboardItemsSuccess = (payload) => ({
  type: DashboardActionTypes.FETCH_DASHBOARD_ITEMS_SUCCESS,
  payload
})

export const fetchDashboardItemsFailure = (payload) => ({
  type: DashboardActionTypes.FETCH_DASHBOARD_ITEMS_FAILURE,
  payload
})

export const fetchAccountTypeItemsStart = () => ({
  type: DashboardActionTypes.FETCH_ACCOUNT_TYPE_ITEMS_START
})

export const fetchAccountTypeItemsSuccess = (payload) => ({
  type: DashboardActionTypes.FETCH_ACCOUNT_TYPE_ITEMS_SUCCESS,
  payload
})

export const fetchAccountTypeItemsFailure = (payload) => ({
  type: DashboardActionTypes.FETCH_ACCOUNT_TYPE_ITEMS_FAILURE,
  payload
})
