import { all, call, put, takeLatest, debounce, select } from 'redux-saga/effects'
import {
  fetchReviewsItemsFailure,
  fetchReviewsItemsSuccess,
  fetchReviewsMetadataFailure,
  fetchReviewsMetadataSuccess,
  updateShowSmallLoader
} from './reviews.action'
import ReviewsActionTypes from './reviews.type'
import * as reviewsApi from '../../api/reviews'
import { selectReviewsPageNumber, selectReviewsPageSize } from './reviews.selector'

// Workers
export function* fetchCollectionsAsync(action) {
  try {
    const pageNumber = yield select(selectReviewsPageNumber)
    const pageSize = yield select(selectReviewsPageSize)
    const data = yield call(
      reviewsApi.get,
      action.payload ? action.payload : 'active',
      pageSize,
      pageNumber
    )

    yield put(fetchReviewsItemsSuccess(data))
  } catch (error) {
    yield put(fetchReviewsItemsFailure(error.message))
  }
}

export function* fetchSearchCollectionAsync(action) {
  try {
    const data = yield call(
      reviewsApi.search,
      action.payload.search,
      action.payload.pagesize,
      action.payload.pagenumber,
      action.payload.status
    )
    yield put(fetchReviewsItemsSuccess(data))
  } catch (error) {
    yield put(fetchReviewsItemsFailure(error.message))
  }
}

export function* fetchSortCollectionsAsync(action) {
  try {
    const data = yield call(
      reviewsApi.sortReviews,
      action.payload.status,
      action.payload.pageSize,
      action.payload.pageNumber,
      action.payload.sortBy,
      action.payload.sortDesc
    )
    yield put(
      fetchReviewsItemsSuccess({
        reviewItems: data
      })
    )
    yield put(updateShowSmallLoader(false))
    yield put(fetchReviewsItemsSuccess(data))
  } catch (error) {
    yield put(fetchReviewsItemsFailure(error.message))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchMetadataAsync() {
  try {
    const data = yield call(reviewsApi.getMetadata)
    yield put(fetchReviewsMetadataSuccess(data))
  } catch (error) {
    yield put(fetchReviewsMetadataFailure(error.message))
  }
}
// Watchers

export function* fetchReviewsItemsStart() {
  yield takeLatest(ReviewsActionTypes.FETCH_REVIEWS_ITEMS_START, fetchCollectionsAsync)
}

export function* fetchReviewsSearchStart() {
  yield debounce(1000, ReviewsActionTypes.FETCH_REVIEWS_SEARCH_START, fetchSearchCollectionAsync)
}

export function* fetchReviewsMetadataStart() {
  yield takeLatest(ReviewsActionTypes.FETCH_REVIEWS_METADATA_START, fetchMetadataAsync)
}

export function* fetchReviewsSortingStart() {
  yield takeLatest(ReviewsActionTypes.FETCH_REVIEWS_SORT_START, fetchSortCollectionsAsync)
}
// Run Watchers
export default function* reviewsSagas() {
  yield all([
    call(fetchReviewsItemsStart),
    call(fetchReviewsMetadataStart),
    call(fetchReviewsSearchStart),
    call(fetchReviewsSortingStart)
  ])
}
