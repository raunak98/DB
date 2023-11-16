import { createSelector } from '@reduxjs/toolkit'

const selectDrafts = (state) => state.drafts

export const selectDraftsItems = createSelector([selectDrafts], (items) => items.draftsItems)

export const selectDraftsMetadata = createSelector([selectDrafts], (items) => items.metadata)

export const isDraftsFetching = createSelector([selectDrafts], (items) => items.isFetching)

export const selectErrorMessages = createSelector([selectDrafts], (items) => items.errorMessages)

export const selectDraftsShowSmallLoader = createSelector(
  [selectDrafts],
  (items) => items.showSmallLoader
)

export const selectDraftsShowBigLoader = createSelector(
  [selectDrafts],
  (items) => items.showBigLoader
)

export const selectDraftsPageNumber = createSelector([selectDrafts], (items) => items.pageNumber)

export const selectDraftsPageSize = createSelector([selectDrafts], (items) => items.pageSize)

export const selectIsGoingForwardFlag = createSelector(
  [selectDrafts],
  (items) => items.isGoingForward
)

export const selectPaginationKeys = createSelector([selectDrafts], (items) => items.paginationKeys)
export const selectDraftsSortInfoData = createSelector([selectDrafts], (items) => items.sortInfo)

export const selectDraftsSearchAfterKeys = createSelector(
  [selectDrafts],
  (items) => items.searchAfterKeys
)
