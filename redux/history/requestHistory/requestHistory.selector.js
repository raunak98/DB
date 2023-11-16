import { createSelector } from '@reduxjs/toolkit'

const selectRequestHistory = (state) => state.requestHistory

export const selectRequestHistoryItems = createSelector(
  [selectRequestHistory],
  (items) => items.requestHistoryItems
)

export const selectRequestHistoryMetadata = createSelector(
  [selectRequestHistory],
  (items) => items.metadata
)

export const isRequestHistoryFetching = createSelector(
  [selectRequestHistory],
  (items) => items.isFetching
)

export const selectErrorMessages = createSelector(
  [selectRequestHistory],
  (items) => items.errorMessages
)

export const selectRequestHistoryPageNumber = createSelector(
  [selectRequestHistory],
  (items) => items.pageNumber
)

export const selectRequestHistoryPageSize = createSelector(
  [selectRequestHistory],
  (items) => items.pageSize
)

export const selectShowBigLoader = createSelector(
  [selectRequestHistory],
  (items) => items.showBigLoader
)

export const selectIsGoingForwardFlag = createSelector(
  [selectRequestHistory],
  (items) => items.isGoingForward
)

export const selectRequestHistoryPaginationKeys = createSelector(
  [selectRequestHistory],
  (items) => items.paginationKeys
)

export const selectRequestHistorySortInfoData = createSelector(
  [selectRequestHistory],
  (items) => items.sortInfo
)
