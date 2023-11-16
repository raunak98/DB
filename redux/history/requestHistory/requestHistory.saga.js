import { all, call, put, takeLatest, select } from 'redux-saga/effects'
import {
  fetchRequestHistoryItemsFailure,
  fetchRequestHistoryItemsSuccess,
  fetchRequestHistoryMetadataFailure,
  fetchRequestHistoryMetadataSuccess,
  updateShowBigLoader
} from './requestHistory.action'

import {
  selectRequestHistoryPageSize,
  selectRequestHistoryPageNumber
  // selectIsGoingForwardFlag,
  // selectRequestHistoryItems,
  // selectRequestHistoryPaginationKeys
} from './requestHistory.selector'
import RequestHistoryActionTypes from './requestHistory.type'
import * as requestHistoryApi from '../../../api/history'

// Workers
export function* fetchCollectionsAsync({ payload }) {
  // const iff = (condition, then, other) => (condition ? then : other)
  try {
    // const requestHistory = yield select(selectRequestHistoryItems)
    const pageSize = yield select(selectRequestHistoryPageSize)
    const pageNumber = yield select(selectRequestHistoryPageNumber)
    console.log(payload)
    // const isGoingForward = yield select(selectIsGoingForwardFlag)
    // const paginationKeysArray = yield select(selectRequestHistoryPaginationKeys)
    // const saKeyWord = isGoingForward
    //   ? iff(
    //       requestHistory?.historyData.slice(-1)[0]?.sortKeyword,
    //       requestHistory?.historyData.slice(-1)[0]?.sortKeyword,
    //       null
    //     )
    //   : null
    // const paginationKey = isGoingForward
    //   ? iff(paginationKeysArray.slice(-1)[0], paginationKeysArray.slice(-1)[0], null)
    //   : null
    const data = yield call(requestHistoryApi.getRequestHistory, pageSize, pageNumber)
    yield put(fetchRequestHistoryItemsSuccess(data))
    yield put(updateShowBigLoader(false))
  } catch (error) {
    yield put(fetchRequestHistoryItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
  }
}

export function* fetchCollectionsAsyncByUser({ payload }) {
  try {
    const data = yield call(requestHistoryApi.getRequestHistoryByUser, payload)
    yield put(fetchRequestHistoryItemsSuccess(data))
    yield put(updateShowBigLoader(false))
  } catch (error) {
    yield put(fetchRequestHistoryItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
  }
}

export function* fetchMetadataAsync() {
  try {
    const data = yield call(requestHistoryApi.getRequestHistoryMeta)
    yield put(fetchRequestHistoryMetadataSuccess(data))
  } catch (error) {
    yield put(fetchRequestHistoryMetadataFailure(error.message))
  }
}

export function* fetchSearchCollectionAsync({ payload }) {
  try {
    const data = yield call(requestHistoryApi.searchRequestHistory, payload)
    yield put(fetchRequestHistoryItemsSuccess(data))
    yield put(updateShowBigLoader(false))
  } catch (error) {
    yield put(fetchRequestHistoryItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
  }
}

export function* fetchSortCollectionsAsync({ payload }) {
  try {
    const data = yield call(requestHistoryApi.sortRequestHistory, payload)
    yield put(fetchRequestHistoryItemsSuccess(data))
    yield put(updateShowBigLoader(false))
  } catch (error) {
    yield put(fetchRequestHistoryItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
  }
}

export function* fetchSortCollectionsAsyncByUser({ payload }) {
  try {
    const data = yield call(requestHistoryApi.sortRequestHistoryByReportee, payload)
    yield put(fetchRequestHistoryItemsSuccess(data))
    yield put(updateShowBigLoader(false))
  } catch (error) {
    yield put(fetchRequestHistoryItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
  }
}

export function* fetchSearchCollectionsAsyncByUser({ payload }) {
  try {
    const data = yield call(requestHistoryApi.searchRequestHistoryByReportee, payload)
    yield put(fetchRequestHistoryItemsSuccess(data))
    yield put(updateShowBigLoader(false))
  } catch (error) {
    yield put(fetchRequestHistoryItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
  }
}

// Watchers

export function* fetchRequestHistoryItemsStart() {
  yield takeLatest(
    RequestHistoryActionTypes.FETCH_REQUESTHISTORY_ITEMS_START,
    fetchCollectionsAsync
  )
}

export function* fetchRequestHistoryMetadataStart() {
  yield takeLatest(
    RequestHistoryActionTypes.FETCH_REQUESTHISTORY_METADATA_START,
    fetchMetadataAsync
  )
}

export function* fetchRequestHistorySearchStart() {
  yield takeLatest(
    RequestHistoryActionTypes.FETCH_REQUESTHISTORY_SEARCH_START,
    fetchSearchCollectionAsync
  )
}

export function* fetchRequestHistorySortStart() {
  yield takeLatest(
    RequestHistoryActionTypes.FETCH_REQUEST_HISTORY_SORT_START,
    fetchSortCollectionsAsync
  )
}

export function* fetchRequestHistoryItemsByUserStart() {
  yield takeLatest(
    RequestHistoryActionTypes.FETCH_REQUESTHISTORY_ITEMS_BY_USER_START,
    fetchCollectionsAsyncByUser
  )
}

export function* fetchRequestHistorySortByUserStart() {
  yield takeLatest(
    RequestHistoryActionTypes.FETCH_REQUESTHISTORY_SORT_BY_USER_START,
    fetchSortCollectionsAsyncByUser
  )
}

export function* fetchRequestHistorySearchByUserStart() {
  yield takeLatest(
    RequestHistoryActionTypes.FETCH_REQUESTHISTORY_SEARCH_BY_USER_START,
    fetchSearchCollectionsAsyncByUser
  )
}

// Run Watchers
export default function* requestHistorySagas() {
  yield all([
    call(fetchRequestHistoryMetadataStart),
    call(fetchRequestHistoryItemsStart),
    call(fetchRequestHistorySearchStart),
    call(fetchRequestHistorySortStart),
    call(fetchRequestHistoryItemsByUserStart),
    call(fetchRequestHistorySortByUserStart),
    call(fetchRequestHistorySearchByUserStart)
  ])
}
