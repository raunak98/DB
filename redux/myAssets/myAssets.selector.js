import { createSelector } from '@reduxjs/toolkit'

const selectMyAssets = (state) => state.myAssets

export const selectMyAssetsItems = createSelector([selectMyAssets], (items) => items.myAssetsItems)

export const selectPerosnalAssetsMetadata = createSelector(
  [selectMyAssets],
  (items) => items.metadata
)

export const selectNonPersonalAssetsMetadata = createSelector(
  [selectMyAssets],
  (items) => items.metadata
)

export const isMyAssetsFetching = createSelector([selectMyAssets], (items) => items.isFetching)

export const selectErrorMessages = createSelector([selectMyAssets], (items) => items.errorMessages)

export const selectShowSmallLoader = createSelector(
  [selectMyAssets],
  (items) => items.showSmallLoader
)

export const selectShowBigLoader = createSelector([selectMyAssets], (items) => items.showBigLoader)

export const selectAssetsIsGoingForwardFlag = createSelector(
  [selectMyAssets],
  (items) => items.isGoingForward
)

export const selectAssetsPaginationKeys = createSelector(
  [selectMyAssets],
  (items) => items.paginationKeys
)

export const selectAssetsPageNumber = createSelector([selectMyAssets], (items) => items.pageNumber)

export const selectAssetsGroupIsGoingForwardFlag = createSelector(
  [selectMyAssets],
  (items) => items.isGoingForwardGroup
)

export const selectAssetsGroupPaginationKeys = createSelector(
  [selectMyAssets],
  (items) => items.paginationKeysGroup
)

export const selectAssetsGroupPageNumber = createSelector(
  [selectMyAssets],
  (items) => items.pageNumberGroup
)

export const selectAssetsGroupPageSize = createSelector(
  [selectMyAssets],
  (items) => items.pageSizeGroup
)

export const selectAssetsPageSize = createSelector([selectMyAssets], (items) => items.pageSize)

export const selectGroupAssetsMetadata = createSelector(
  [selectMyAssets],
  (items) => items.groupMetadata
)
export const selectIndirectlyOwnedGroupAssetsMetadata = createSelector(
  [selectMyAssets],
  (items) => items.indirectlyOwnedGroupMetadata
)
export const selectGroupAssetsItems = createSelector(
  [selectMyAssets],
  (items) => items.groupAssetsItems
)
export const selectMyAssetsSortInfoData = createSelector(
  [selectMyAssets],
  (items) => items.sortInfo
)
export const selectMyGroupAssetsSortInfoData = createSelector(
  [selectMyAssets],
  (items) => items.sortInfoGroup
)
export const selectAssetsNarIdInfo = createSelector([selectMyAssets], (items) => items.narIdInfo)

export const selectAssetsNarId = createSelector([selectMyAssets], (items) => items.narId)

export const selectOwnedGroupAssetsItems = createSelector(
  [selectMyAssets],
  (items) => items.ownedGroupAssetsItems
)

export const selectOwnedGroupSortInfoData = createSelector(
  [selectMyAssets],
  (items) => items.sortInfoOwnedGroup
)

export const selectOwnedGroupPageNumber = createSelector(
  [selectMyAssets],
  (items) => items.pageNumberOwnedGroup
)

export const selectOwnedGroupPageSize = createSelector(
  [selectMyAssets],
  (items) => items.pageSizeOwnedGroup
)

export const selectHistoricalRequestHistoryMetadata = createSelector(
  [selectMyAssets],
  (items) => items.groupRequestHistorymetadata
)

export const selectGroupAssetRequestHistoryItems = createSelector(
  [selectMyAssets],
  (items) => items.grouprequestHistoryItems
)

export const selectAssetGroupRequestHistoryPageNumber = createSelector(
  [selectMyAssets],
  (items) => items.assetGroupReqHispageNumber
)
export const selectAssetGroupRequestHistoryPageSize = createSelector(
  [selectMyAssets],
  (items) => items.assetGroupReqHispageSize
)
export const selectAssetGrpRequestHistorySortInfoData = createSelector(
  [selectMyAssets],
  (items) => items.sortInfoAssetGrpReqHis
)

export const selectAssetsSelectedGroupName = createSelector(
  [selectMyAssets],
  (items) => items.selectedAssetsGroupName
)
