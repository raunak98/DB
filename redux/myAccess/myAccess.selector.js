import { createSelector } from '@reduxjs/toolkit'

const selectMyAccess = (state) => state.myAccess

export const selectMyAccessGroupItems = createSelector(
  [selectMyAccess],
  (items) => items.myAccessGroupItems
)

export const selectGroupAccessMetadata = createSelector([selectMyAccess], (items) => items.metadata)

export const isMyAccessFetching = createSelector([selectMyAccess], (items) => items.isFetching)

export const selectErrorMessages = createSelector([selectMyAccess], (items) => items.errorMessages)

export const selectShowSmallAccessLoader = createSelector(
  [selectMyAccess],
  (items) => items.showSmallLoader
)

export const selectShowBigAccessLoader = createSelector(
  [selectMyAccess],
  (items) => items.showBigLoader
)

export const selectAccessIsGoingForwardFlag = createSelector(
  [selectMyAccess],
  (items) => items.isGoingForward
)

export const selectAccessPaginationKeys = createSelector(
  [selectMyAccess],
  (items) => items.paginationKeys
)

export const selectAccessPageNumber = createSelector([selectMyAccess], (items) => items.pageNumber)

export const selectAccessPageSize = createSelector([selectMyAccess], (items) => items.pageSize)

export const selectGroupAccessSortInfoData = createSelector(
  [selectMyAccess],
  (items) => items.sortInfo
)
