import { createSelector } from '@reduxjs/toolkit'

const selectApprovals = (state) => state.approvals

export const selectApprovalsItems = createSelector(
  [selectApprovals],
  (items) => items.approvalsItems
)

export const selectApprovalsMetadata = createSelector([selectApprovals], (items) => items.metadata)

export const isApprovalsFetching = createSelector([selectApprovals], (items) => items.isFetching)

export const selectErrorMessages = createSelector([selectApprovals], (items) => items.errorMessages)

export const selectShowSmallLoader = createSelector(
  [selectApprovals],
  (items) => items.showSmallLoader
)

export const selectNotificationMessage = createSelector(
  [selectApprovals],
  (items) => items.notification
)

export const selectShowBigLoader = createSelector([selectApprovals], (items) => items.showBigLoader)

export const selectApprovalsPageNumber = createSelector(
  [selectApprovals],
  (items) => items.pageNumber
)

export const selectApprovalsPageSize = createSelector([selectApprovals], (items) => items.pageSize)

export const selectApprovalsIsGoingForwardFlag = createSelector(
  [selectApprovals],
  (items) => items.isGoingForward
)

export const selectApprovalsPaginationKeys = createSelector(
  [selectApprovals],
  (items) => items.paginationKeys
)

export const selectApprovalsSearchAfterKeyword = createSelector(
  [selectApprovals],
  (items) => items.searchAfterKeyword
)

export const selectApprovalsSortInfoData = createSelector(
  [selectApprovals],
  (items) => items.sortInfo
)
