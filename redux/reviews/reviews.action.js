import ReviewsActionTypes from './reviews.type'

export const fetchReviewsItemsStart = (payload) => ({
  type: ReviewsActionTypes.FETCH_REVIEWS_ITEMS_START,
  payload
})

export const fetchReviewsItemsSuccess = (payload) => ({
  type: ReviewsActionTypes.FETCH_REVIEWS_ITEMS_SUCCESS,
  payload
})

export const fetchReviewsItemsFailure = (payload) => ({
  type: ReviewsActionTypes.FETCH_REVIEWS_ITEMS_FAILURE,
  payload
})

export const fetchReviewsSearchStart = (payload) => ({
  type: ReviewsActionTypes.FETCH_REVIEWS_SEARCH_START,
  payload
})

export const fetchReviewsSearchSuccess = (payload) => ({
  type: ReviewsActionTypes.FETCH_REVIEWS_SEARCH_SUCCESS,
  payload
})

export const fetchReviewsSearchFailure = (payload) => ({
  type: ReviewsActionTypes.FETCH_REVIEWS_SEARCH_FAILURE,
  payload
})

export const fetchReviewsSortingStart = (payload) => ({
  type: ReviewsActionTypes.FETCH_REVIEWS_SORT_START,
  payload
})
export const updateSortData = (payload) => ({
  type: ReviewsActionTypes.UPDATE_SORT_DATA,
  payload
})

export const fetchReviewsMetadataStart = () => ({
  type: ReviewsActionTypes.FETCH_REVIEWS_METADATA_START
})

export const fetchReviewsMetadataSuccess = (payload) => ({
  type: ReviewsActionTypes.FETCH_REVIEWS_METADATA_SUCCESS,
  payload
})

export const fetchReviewsMetadataFailure = (payload) => ({
  type: ReviewsActionTypes.FETCH_REVIEWS_METADATA_FAILURE,
  payload
})

export const updatePageSizeReviews = (payload) => ({
  type: ReviewsActionTypes.REVIEWS_PAGESIZE,
  payload
})

export const updateShowSmallLoader = (payload) => ({
  type: ReviewsActionTypes.SHOW_SMALL_LOADER,
  payload
})

export const updatePageNumberReviews = (payload) => ({
  type: ReviewsActionTypes.REVIEWS_PAGE_NUMBER,
  payload
})
