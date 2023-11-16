import ReviewActionTypes from './review.type'

const INITIAL_STATE = {
  reviewItems: [],
  reviewInfo: null,
  isFetching: false,
  errorMessage: undefined,
  campaignInfo: null,
  notification: {
    type: 'info',
    message: null
  },
  metadata: null,
  reviewerData: [],
  monitorData: [],
  applyFilter: [],
  reviewStatus: 'in-progress',
  pageNumber: 0,
  pageSize: 10,
  showSmallLoader: false,
  showBigLoader: false,
  elasticSearchItem: [],
  reviewItemTotalCount: 0,
  pageGroupbyNumber: 0,
  pageGroupbySize: 10,
  filterData: {
    currentFilter: 'All',
    data: [],
    default: true,
    groupByValue: ''
  },
  sortInfo: {
    sortKey: '',
    isAscending: 'asc',
    payload: {}
  },
  paginationKeys: [],
  isGoingForward: true,
  expandIndex: -1,
  search: '',
  groupBykey: null,
  searchAfterKeyword: [],
  isMonitor: false,
  isReviewerTabActiveSelector: true,
  certification: '',
  selectedReviewItems: [],
  groupedItemsSearchFlag: false,
  multiSelectLimit: 100,
  reviewerDataLoaded: false,
  monitorDataLoaded: false,
  pageCount: 0,
  normalizedMonitorData: [],
  isSemiAnnualCampaign: false,
  monitorGroupPagesizeRowsChangeValue: ''
}

const reviewReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ReviewActionTypes.FETCH_REVIEW_ITEMS_START:
      return {
        ...state,
        isFetching: true,
        showBigLoader: true
      }
    case ReviewActionTypes.FETCH_REVIEW_ITEMS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        showBigLoader: false,
        reviewItems: action.payload.reviewItems,
        reviewInfo: action.payload.reviewItems,
        campaignInfo: action.payload.reviewInfo,
        showSmallLoader: false,
        elasticSearchItem:
          // eslint-disable-next-line no-nested-ternary
          action.payload.elasticSearchItem === undefined
            ? []
            : action.payload.elasticSearchItem.length === 0
            ? state.elasticSearchItem
            : [...state.elasticSearchItem, action.payload.elasticSearchItem]
      }
    case ReviewActionTypes.FETCH_REVIEW_ITEMS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload,
        showBigLoader: false,
        showSmallLoader: false
      }

    case ReviewActionTypes.FETCH_REVIEW_FILTER_START:
      return {
        ...state,
        showBigLoader: true,
        isFetching: true
      }
    case ReviewActionTypes.FETCH_REVIEW_FILTER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        showBigLoader: false,
        reviewItems: action.payload.reviewItems,
        reviewInfo: action.payload.reviewItems
      }
    case ReviewActionTypes.FETCH_REVIEW_FILTER_FAILURE:
      return {
        ...state,
        isFetching: false,
        showBigLoader: false,
        errorMessage: action.payload
      }

    case ReviewActionTypes.FETCH_REVIEW_SEARCH_START:
      return {
        ...state,
        isFetching: true
      }
    case ReviewActionTypes.FETCH_REVIEW_SEARCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        showBigLoader: false,
        reviewItems: action.payload
      }
    case ReviewActionTypes.FETCH_REVIEW_SEARCH_FAILURE:
      return {
        ...state,
        isFetching: false,
        showBigLoader: false,
        errorMessage: action.payload
      }

    case ReviewActionTypes.UPDATE_REVIEW_ITEMS:
      return {
        ...state,
        reviewItems: action.payload,
        showBigLoader: false
      }

    case ReviewActionTypes.UPDATE_REVIEW_NOTIFICATION_MESSAGE:
      return {
        ...state,
        notification: { ...action.payload }
      }

    // Reviews metadata
    case ReviewActionTypes.FETCH_REVIEW_METADATA_START:
      return {
        ...state,
        isFetching: true
      }
    case ReviewActionTypes.FETCH_REVIEW_METADATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        metadata: action.payload.metadata,
        campaignInfo: action.payload.reviewInfo
      }
    case ReviewActionTypes.FETCH_REVIEW_METADATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }
    //  Reviewer data
    case ReviewActionTypes.FETCH_REVIEWER_DATA_START:
      return {
        ...state,
        isFetching: true
      }
    case ReviewActionTypes.FETCH_REVIEWER_DATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        showSmallLoader: false,
        showBigLoader: false,
        reviewerData: action.payload.reviewerData,
        reviewerDataLoaded: true
      }
    case ReviewActionTypes.FETCH_REVIEWER_DATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        showSmallLoader: false,
        showBigLoader: false,
        errorMessage: action.payload
      }

    // Monitor Data

    case ReviewActionTypes.FETCH_MONITOR_DATA_START:
      return {
        ...state,
        isFetching: true
      }
    case ReviewActionTypes.FETCH_MONITOR_DATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        showBigLoader: false,
        showSmallLoader: false,
        monitorData: action.payload.monitorData,
        monitorDataLoaded: true
      }
    case ReviewActionTypes.FETCH_MONITOR_DATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        showSmallLoader: false,
        showBigLoader: false,
        errorMessage: action.payload
      }

    case ReviewActionTypes.SIGN_OFF_ITEMS:
      return state

    case ReviewActionTypes.APPLY_FILTER:
      return {
        ...state,
        applyFilter: action.payload
      }
    case ReviewActionTypes.REVIEW_TYPE:
      return {
        ...state,
        reviewStatus: action.payload
      }

    case ReviewActionTypes.REVIEW_PAGESIZE:
      return {
        ...state,
        pageSize: action.payload
      }
    case ReviewActionTypes.REVIEW_PAGE_NUMBER:
      return {
        ...state,
        pageNumber: action.payload
      }
    case ReviewActionTypes.SHOW_SMALL_LOADER:
      return {
        ...state,
        showSmallLoader: action.payload
      }
    case ReviewActionTypes.SHOW_BIG_LOADER:
      return {
        ...state,
        showBigLoader: action.payload,
        isFetching: action.payload
      }

    case ReviewActionTypes.REVIEW_TOTAL_ITEM_COUNT:
      return {
        ...state,
        reviewItemTotalCount: action.payload
      }
    case ReviewActionTypes.REVIEW_GROUP_PAGESIZE:
      return {
        ...state,
        pageGroupbySize: action.payload
      }
    case ReviewActionTypes.REVIEW_GROUP_PAGE_NUMBER:
      return {
        ...state,
        pageGroupbyNumber: action.payload
      }
    case ReviewActionTypes.REVIEW_FILTER_DATA:
      return {
        ...state,
        filterData: action.payload
      }
    case ReviewActionTypes.FETCH_REVIEW_SORT_START:
      return {
        ...state,
        showBigLoader: true,
        campaignInfo: action.payload.reviewInfo,
        isFetching: true
      }
    case ReviewActionTypes.UPDATE_SORT_INFO:
      return {
        ...state,
        sortInfo: action.payload
      }
    case ReviewActionTypes.UPDATE_IS_GOING_FORWARD_FLAG:
      return {
        ...state,
        isGoingForward: action.payload
      }
    case ReviewActionTypes.UPDATE_PAGINATION_KEYS:
      return {
        ...state,
        paginationKeys: action.payload
      }
    case ReviewActionTypes.UPDATE_EXPAND_INDEX:
      return {
        ...state,
        expandIndex: action.payload
      }
    case ReviewActionTypes.UPDATE_SEARCH_KEY:
      return {
        ...state,
        search: action.payload
      }
    case ReviewActionTypes.UPDATE_GROUPBY_KEY:
      return {
        ...state,
        groupBykey: action.payload
      }
    case ReviewActionTypes.UPDATE_SEARCH_AFTER_KEY:
      return {
        ...state,
        searchAfterKeyword: action.payload
      }
    case ReviewActionTypes.UPDATE_IS_MONITOR:
      return {
        ...state,
        isMonitor: action.payload
      }
    // Reviewer Tab Active
    case ReviewActionTypes.UPDATE_IS_REVIEWER_TAB_ACTIVE:
      return {
        ...state,
        isReviewerTabActiveSelector: action.payload
      }
    case ReviewActionTypes.UPDATE_CERTIFICATION:
      return {
        ...state,
        certification: action.payload
      }
    case ReviewActionTypes.UPDATE_SELECTED_REVIEW_ITEMS:
      return {
        ...state,
        selectedReviewItems: action.payload
      }
    case ReviewActionTypes.SET_GROUPED_ITEMS_SEARCH_FLAG:
      return {
        ...state,
        groupedItemsSearchFlag: action.payload
      }
    case ReviewActionTypes.UPDATE_REVIEWER_DATA_LOADED:
      return {
        ...state,
        reviewerDataLoaded: action.payload
      }

    // Monitor Data Loaded

    case ReviewActionTypes.UPDATE_MONITOR_DATA_LOADED:
      return {
        ...state,
        monitorDataLoaded: action.payload
      }
    case ReviewActionTypes.SET_PAGE_COUNT:
      return {
        ...state,
        pageCount: action.payload
      }
    case ReviewActionTypes.SET_NORMALIZED_MONITOR_DATA:
      return {
        ...state,
        normalizedMonitorData: action.payload
      }
    case ReviewActionTypes.UPDATE_IS_SEMIANNUAL_CAMPAIGN:
      return {
        ...state,
        isSemiAnnualCampaign: action.payload
      }
    case ReviewActionTypes.UPDATE_MONITOR_GROUP_PAGE_SIZE_ROWS_CHANGE_HANDLER:
      return {
        ...state,
        monitorGroupPagesizeRowsChangeValue: action.payload
      }
    default:
      return state
  }
}

export default reviewReducer
