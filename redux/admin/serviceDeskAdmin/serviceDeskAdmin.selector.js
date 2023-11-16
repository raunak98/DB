import { createSelector } from '@reduxjs/toolkit'

const selectServiceDeskAdmin = (state) => state.serviceDeskAdmin

export const selectServiceDeskAdminItems = createSelector(
  [selectServiceDeskAdmin],
  (items) => items.serviceDeskAdminItems
)

export const selectServiceDeskAdminMetadata = createSelector(
  [selectServiceDeskAdmin],
  (items) => items.metadata
)

export const isServiceDeskAdminFetching = createSelector(
  [selectServiceDeskAdmin],
  (items) => items.isFetching
)

export const selectErrorMessages = createSelector(
  [selectServiceDeskAdmin],
  (items) => items.errorMessages
)

export const selectServiceDeskAdminPageNumber = createSelector(
  [selectServiceDeskAdmin],
  (items) => items.pageNumber
)

export const selectServiceDeskAdminPageSize = createSelector(
  [selectServiceDeskAdmin],
  (items) => items.pageSize
)

export const selectShowBigLoader = createSelector(
  [selectServiceDeskAdmin],
  (items) => items.showBigLoader
)

export const selectIsGoingForwardFlag = createSelector(
  [selectServiceDeskAdmin],
  (items) => items.isGoingForward
)

export const selectServiceDeskAdminPaginationKeys = createSelector(
  [selectServiceDeskAdmin],
  (items) => items.paginationKeys
)

export const selectServiceDeskAdminSortInfoData = createSelector(
  [selectServiceDeskAdmin],
  (items) => items.sortInfo
)
