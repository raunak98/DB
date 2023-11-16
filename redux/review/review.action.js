import ReviewActionTypes from './review.type'

export const fetchReviewItemsStart = (payload) => ({
  type: ReviewActionTypes.FETCH_REVIEW_ITEMS_START,
  payload
})

export const fetchReviewItemsSuccess = (payload) => ({
  type: ReviewActionTypes.FETCH_REVIEW_ITEMS_SUCCESS,
  payload
})

export const fetchReviewItemsFailure = (payload) => ({
  type: ReviewActionTypes.FETCH_REVIEW_ITEMS_FAILURE,
  payload
})

export const fetchReviewFilterStart = (payload) => ({
  type: ReviewActionTypes.FETCH_REVIEW_FILTER_START,
  payload
})

export const fetchReviewFilterSuccess = (payload) => ({
  type: ReviewActionTypes.FETCH_REVIEW_FILTER_SUCCESS,
  payload
})

export const fetchReviewFilterFailure = (payload) => ({
  type: ReviewActionTypes.FETCH_REVIEW_FILTER_FAILURE,
  payload
})

export const fetchReviewSearchStart = (payload) => ({
  type: ReviewActionTypes.FETCH_REVIEW_SEARCH_START,
  payload
})

export const fetchReviewSearchSuccess = (payload) => ({
  type: ReviewActionTypes.FETCH_REVIEW_SEARCH_SUCCESS,
  payload
})

export const fetchReviewSearchFailure = (payload) => ({
  type: ReviewActionTypes.FETCH_REVIEW_SEARCH_FAILURE,
  payload
})

export const updateReviewItemsStart = (payload) => ({
  type: ReviewActionTypes.UPDATE_REVIEW_ITEMS,
  payload
})

export const updateReviewNotificationMessage = (payload) => ({
  type: ReviewActionTypes.UPDATE_REVIEW_NOTIFICATION_MESSAGE,
  payload
})

export const fetchReviewMetadataStart = (payload) => ({
  type: ReviewActionTypes.FETCH_REVIEW_METADATA_START,
  payload
})

export const fetchReviewMetadataSuccess = (payload) => ({
  type: ReviewActionTypes.FETCH_REVIEW_METADATA_SUCCESS,
  payload
})

export const fetchReviewMetadataFailure = (payload) => ({
  type: ReviewActionTypes.FETCH_REVIEW_METADATA_FAILURE,
  payload
})
// Reviewer Data
export const fetchReviewerdataStart = (payload) => ({
  type: ReviewActionTypes.FETCH_REVIEWER_DATA_START,
  payload
})

export const fetchReviewerdataSuccess = (payload) => ({
  type: ReviewActionTypes.FETCH_REVIEWER_DATA_SUCCESS,
  payload
})

export const fetchReviewerdataFailure = (payload) => ({
  type: ReviewActionTypes.FETCH_REVIEWER_DATA_FAILURE,
  payload
})
// Monitor Data
export const fetchMonitordataStart = (payload) => ({
  type: ReviewActionTypes.FETCH_MONITOR_DATA_START,
  payload
})

export const fetchMonitordataSuccess = (payload) => ({
  type: ReviewActionTypes.FETCH_MONITOR_DATA_SUCCESS,
  payload
})

export const fetchMonitordataFailure = (payload) => ({
  type: ReviewActionTypes.FETCH_MONITOR_DATA_FAILURE,
  payload
})

export const signOffItems = (payload) => ({
  type: ReviewActionTypes.SIGN_OFF_ITEMS,
  payload
})

export const applyFilters = (payload) => ({
  type: ReviewActionTypes.APPLY_FILTER,
  payload
})

export const setReviewTypeStatue = (payload) => ({
  type: ReviewActionTypes.REVIEW_TYPE,
  payload
})
export const updatePageSize = (payload) => ({
  type: ReviewActionTypes.REVIEW_PAGESIZE,
  payload
})

export const updatePagenUmber = (payload) => ({
  type: ReviewActionTypes.REVIEW_PAGE_NUMBER,
  payload
})

export const updateShowSmallLoader = (payload) => ({
  type: ReviewActionTypes.SHOW_SMALL_LOADER,
  payload
})

export const updateShowBigLoader = (payload) => ({
  type: ReviewActionTypes.SHOW_BIG_LOADER,
  payload
})

export const getReviewItemTotalCount = (payload) => ({
  type: ReviewActionTypes.REVIEW_TOTAL_ITEM_COUNT,
  payload
})
export const updateGroupPageSize = (payload) => ({
  type: ReviewActionTypes.REVIEW_GROUP_PAGESIZE,
  payload
})

export const updateGroupPagenUmber = (payload) => ({
  type: ReviewActionTypes.REVIEW_GROUP_PAGE_NUMBER,
  payload
})

export const setFilterData = (payload) => ({
  type: ReviewActionTypes.REVIEW_FILTER_DATA,
  payload
})

export const fetchReviewSortStart = (payload) => ({
  type: ReviewActionTypes.FETCH_REVIEW_SORT_START,
  payload
})
// Reviewer sort
export const fetchReviewerSortStart = (payload) => ({
  type: ReviewActionTypes.FETCH_REVIEWER_SORT_START,
  payload
})
// Monitor sort
export const fetchMonitorSortStart = (payload) => ({
  type: ReviewActionTypes.FETCH_MONITOR_SORT_START,
  payload
})
export const updateSortInfoData = (payload) => ({
  type: ReviewActionTypes.UPDATE_SORT_INFO,
  payload
})

export const fetchPaginationKeys = (payload) => ({
  type: ReviewActionTypes.FETCH_PAGINARION_KEYS,
  payload
})

export const updatePaginationKeys = (payload) => ({
  type: ReviewActionTypes.UPDATE_PAGINATION_KEYS,
  payload
})

export const fetchIsGoingForwardFlag = (payload) => ({
  type: ReviewActionTypes.FETCH_IS_GOING_FORWARD_FLAG,
  payload
})

export const updateIsGoingForwardFlag = (payload) => ({
  type: ReviewActionTypes.UPDATE_IS_GOING_FORWARD_FLAG,
  payload
})

export const updateExpandIndex = (payload) => ({
  type: ReviewActionTypes.UPDATE_EXPAND_INDEX,
  payload
})

export const updateSearch = (payload) => ({
  type: ReviewActionTypes.UPDATE_SEARCH_KEY,
  payload
})

export const updateGroupByKey = (payload) => ({
  type: ReviewActionTypes.UPDATE_GROUPBY_KEY,
  payload
})

export const updateSearchAfterKey = (payload) => ({
  type: ReviewActionTypes.UPDATE_SEARCH_AFTER_KEY,
  payload
})

export const updateIsMonitor = (payload) => ({
  type: ReviewActionTypes.UPDATE_IS_MONITOR,
  payload
})
// Reviewer Tab Active
export const updateisReviewerTabActive = (payload) => ({
  type: ReviewActionTypes.UPDATE_IS_REVIEWER_TAB_ACTIVE,
  payload
})

export const updateCertification = (payload) => ({
  type: ReviewActionTypes.UPDATE_CERTIFICATION,
  payload
})

export const updateSelectedReviewItems = (payload) => ({
  type: ReviewActionTypes.UPDATE_SELECTED_REVIEW_ITEMS,
  payload
})

export const updateGroupedItemsSearchFlag = (payload) => ({
  type: ReviewActionTypes.SET_GROUPED_ITEMS_SEARCH_FLAG,
  payload
})

// Reviewer Data Loaded
export const updateReviewerDataLoaded = (payload) => ({
  type: ReviewActionTypes.UPDATE_REVIEWER_DATA_LOADED,
  payload
})

// Monitor Data Loaded
export const updateMonitorDataLoaded = (payload) => ({
  type: ReviewActionTypes.UPDATE_MONITOR_DATA_LOADED,
  payload
})

export const fetchGroupByReviewerSearchStart = (payload) => ({
  type: ReviewActionTypes.FETCH_GROUP_BY_REVIEWER_SEARCH_START,
  payload
})

export const fetchReviewGroupByStart = (payload) => ({
  type: ReviewActionTypes.FETCH_REVIEW_GROUPBY_START,
  payload
})

export const fetchReviewPageCount = (payload) => ({
  type: ReviewActionTypes.SET_PAGE_COUNT,
  payload
})

export const updateNormalizedMonitorData = (payload) => ({
  type: ReviewActionTypes.SET_NORMALIZED_MONITOR_DATA,
  payload
})

export const updateIsSemiAnnualCampaign = (payload) => ({
  type: ReviewActionTypes.UPDATE_IS_SEMIANNUAL_CAMPAIGN,
  payload
})

export const updateMonitorGroupPageSizeRowsChangeHandler = (payload) => ({
  type: ReviewActionTypes.UPDATE_MONITOR_GROUP_PAGE_SIZE_ROWS_CHANGE_HANDLER,
  payload
})

// Reviewer sort
export const fetchReviewerGroupBySortStart = (payload) => ({
  type: ReviewActionTypes.FETCH_REVIEWER__GROUPBY_SORT_START,
  payload
})
