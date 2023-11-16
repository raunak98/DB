import { createSelector } from '@reduxjs/toolkit'

const selectReview = (state) => state.review

export const selectReviewItems = createSelector([selectReview], (items) => items.reviewItems)

export const selectReviewMetadata = createSelector([selectReview], (items) => items.metadata)
// Reviewer Data
export const selectReviewerdata = createSelector([selectReview], (items) => items.reviewerData)
// Monitor Data
export const selectMonitordata = createSelector([selectReview], (items) => items.monitorData)

export const isReviewFetching = createSelector([selectReview], (items) => items.isFetching)

export const selectErrorMessages = createSelector([selectReview], (items) => items.errorMessages)

export const selectNotificationMessage = createSelector(
  [selectReview],
  (items) => items.notification
)

export const isRowSelected = createSelector([selectReview], (items) =>
  items.reviewItems.some((item) => item.checked === true)
)

export const selectReviewInfo = createSelector([selectReview], (items) => items.reviewInfo)

export const selectCampaignInfo = createSelector([selectReview], (items) => items.campaignInfo)

export const selectApplyFilters = createSelector([selectReview], (items) => items.applyFilter)

export const selectReviewTypeStatus = createSelector([selectReview], (items) => items.reviewStatus)

export const selectReviewPageNumber = createSelector([selectReview], (items) => items.pageNumber)

export const selectReviewPageSize = createSelector([selectReview], (items) => items.pageSize)

export const selectShowSmallLoader = createSelector(
  [selectReview],
  (items) => items.showSmallLoader
)

export const selectShowBigLoader = createSelector([selectReview], (items) => items.showBigLoader)
export const selectReviewItemTotalCount = createSelector(
  [selectReview],
  (items) => items.reviewItemTotalCount
)
export const selectElasticSearchParameter = createSelector(
  [selectReview],
  (items) => items.elasticSearchItem
)

export const selectReviewGropupPageNumber = createSelector(
  [selectReview],
  (items) => items.pageGroupbyNumber
)

export const selectReviewGroupPageSize = createSelector(
  [selectReview],
  (items) => items.pageGroupbySize
)
export const selectFilterData = createSelector([selectReview], (items) => items.filterData)

export const selectSortInfoData = createSelector([selectReview], (items) => items.sortInfo)

export const selectIsGoingForwardFlag = createSelector(
  [selectReview],
  (items) => items.isGoingForward
)

export const selectPaginationKeys = createSelector([selectReview], (items) => items.paginationKeys)

export const selectExpandIndex = createSelector([selectReview], (items) => items.expandIndex)
export const selectSeach = createSelector([selectReview], (items) => items.search)
export const selectGroupBykey = createSelector([selectReview], (items) => items.groupBykey)
export const selectSearchAfterKeyword = createSelector(
  [selectReview],
  (items) => items.searchAfterKeyword
)
export const selectUpdateIsMonitor = createSelector([selectReview], (items) => items.isMonitor)

export const selectUpdateIsReviewerTabActive = createSelector(
  [selectReview],
  (items) => items.isReviewerTabActiveSelector
)
export const selectCertification = createSelector([selectReview], (items) => items.certification)

export const selectSelectedReviewItems = createSelector(
  [selectReview],
  (items) => items.selectedReviewItems
)

export const selectGroupedItemsSearchFlag = createSelector(
  [selectReview],
  (items) => items.groupedItemsSearchFlag
)

export const selectMultiSelectLimit = createSelector(
  [selectReview],
  (items) => items.multiSelectLimit
)

// Reviewer Data Loaded
export const selectReviewerDataLoaded = createSelector(
  [selectReview],

  (items) => items.reviewerDataLoaded
)

// Monitor Data Loaded
export const selectMonitorDataLoaded = createSelector(
  [selectReview],

  (items) => items.monitorDataLoaded
)

export const selectReviewPageCount = createSelector([selectReview], (items) => items.pageCount)

export const selectNormalizedMonitorData = createSelector(
  [selectReview],
  (items) => items.normalizedMonitorData
)

export const selectIsSemiAnnualCampaign = createSelector(
  [selectReview],
  (items) => items.isSemiAnnualCampaign
)

export const selectGroupMonitorPageSizeRowChangeValue = createSelector(
  [selectReview],
  (items) => items.monitorGroupPagesizeRowsChangeValue
)
