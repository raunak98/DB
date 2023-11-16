import { createSelector } from '@reduxjs/toolkit'

const selectJustifications = (state) => state.justifications

export const selectJustificationsItems = createSelector(
  [selectJustifications],
  (items) => items?.justificationsItems
)

export const selectJustificationsMetadata = createSelector(
  [selectJustifications],
  (items) => items?.metadata
)

export const isJustificationsFetching = createSelector(
  [selectJustifications],
  (items) => items?.isFetching
)

export const selectErrorMessages = createSelector(
  [selectJustifications],
  (items) => items?.errorMessagess
)

export const selectShowSmallLoader = createSelector(
  [selectJustifications],
  (items) => items?.showSmallLoader
)

export const selectShowBigLoader = createSelector(
  [selectJustifications],
  (items) => items?.showBigLoader
)

export const selectJustificationsIsGoingForwardFlag = createSelector(
  [selectJustifications],
  (items) => items?.isGoingForward
)

export const selectJustificationsPaginationKeys = createSelector(
  [selectJustifications],
  (items) => items?.paginationKeys
)

export const selectJustificationsPageNumber = createSelector(
  [selectJustifications],
  (items) => items?.pageNumber
)

export const selectJustificationsPageSize = createSelector(
  [selectJustifications],
  (items) => items?.pageSize
)

export const selectJustificationsSortInfoData = createSelector(
  [selectJustifications],
  (items) => items.sortInfo
)
