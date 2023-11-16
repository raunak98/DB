import { createSelector } from '@reduxjs/toolkit'

const selectApprovalHistory = (state) => state.approvalHistory

export const selectApprovalHistoryItems = createSelector(
  [selectApprovalHistory],
  (items) => items.approvalHistoryItems
)

export const selectApprovalHistoryMetadata = createSelector(
  [selectApprovalHistory],
  (items) => items.metadata
)

export const isApprovalHistoryFetching = createSelector(
  [selectApprovalHistory],
  (items) => items.isFetching
)

export const selectErrorMessages = createSelector(
  [selectApprovalHistory],
  (items) => items.errorMessages
)

export const selectApprovalHistoryPageNumber = createSelector(
  [selectApprovalHistory],
  (items) => items.pageNumber
)

export const selectApprovalHistoryPageSize = createSelector(
  [selectApprovalHistory],
  (items) => items.pageSize
)

export const selectShowBigLoader = createSelector(
  [selectApprovalHistory],
  (items) => items.showBigLoader
)

export const selectIsGoingForwardFlag = createSelector(
  [selectApprovalHistory],
  (items) => items.isGoingForward
)

export const selectApprovalHistoryPaginationKeys = createSelector(
  [selectApprovalHistory],
  (items) => items.paginationKeys
)

export const selectApprovalHistorySearchAfterKeys = createSelector(
  [selectApprovalHistory],
  (items) => items.searchAfterKeys
)

export const selectApprovalHistorySortInfoData = createSelector(
  [selectApprovalHistory],
  (items) => items.sortInfo
)
