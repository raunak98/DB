import { createSelector } from '@reduxjs/toolkit'

const selectDashboard = (state) => state.dashboard

export const selectDashboardCards = createSelector(
  [selectDashboard],
  (items) => items.dashboardItems
)

export const isDashboardFetching = createSelector([selectDashboard], (items) => items.isFetching)

export const selectErrorMessages = createSelector([selectDashboard], (items) => items.errorMessages)

export const selectAccountTypeItems = createSelector(
  [selectDashboard],
  (items) => items.accountTypeItems
)
