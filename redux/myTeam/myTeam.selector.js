import { createSelector } from '@reduxjs/toolkit'

const selectMyTeam = (state) => state.myTeam

export const selectMyTeamItems = createSelector([selectMyTeam], (items) => items.myTeamItems)

export const selectMyTeamSearchItem = createSelector(
  [selectMyTeam],
  (items) => items.myTeamsSearchItem
)

export const selectMyTeamMetadata = createSelector([selectMyTeam], (items) => items.metadata)

export const isMyTeamFetching = createSelector([selectMyTeam], (items) => items.isFetching)

export const selectErrorMessages = createSelector([selectMyTeam], (items) => items.errorMessages)

export const selectMyTeamPageNumber = createSelector([selectMyTeam], (items) => items.pageNumber)

export const selectMyTeamPageSize = createSelector([selectMyTeam], (items) => items.pageSize)

export const selectShowBigLoader = createSelector([selectMyTeam], (items) => items.showBigLoader)

export const selectIsGoingForwardFlag = createSelector(
  [selectMyTeam],
  (items) => items.isGoingForward
)

export const selectMyTeamPaginationKeys = createSelector(
  [selectMyTeam],
  (items) => items.paginationKeys
)

export const selectMyTeamSortInfoData = createSelector([selectMyTeam], (items) => items.sortInfo)
