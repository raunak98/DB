import { takeLatest, call, put, all, debounce } from 'redux-saga/effects'
import {
  fetchJustificationsItemsFailure,
  fetchJustificationsItemsSuccess,
  fetchJustificationsMetadataFailure,
  fetchJustificationsMetadataSuccess,
  updateShowBigLoader,
  updateShowSmallLoader
} from './justifications.action'
// import { selectJustificationsPageNumber } from './justifications.selector'
import JustificationsActionTypes from './justifications.type'
import * as justificationApi from '../../api/justifications'

// Saga Workers
export function* fetchCollectionsAsync({ pageSize, pageNumber }) {
  try {
    const data = yield call(justificationApi.getPendingJustification, pageSize, pageNumber)
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
    yield put(fetchJustificationsItemsSuccess({ justificationsItems: data }))
  } catch (error) {
    yield put(fetchJustificationsItemsFailure, error.message)
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchMetadataAsync() {
  try {
    const data = yield call(justificationApi.getJustificationMetadata)
    yield put(fetchJustificationsMetadataSuccess(data))
  } catch (error) {
    yield put(fetchJustificationsMetadataFailure(error.message))
  }
}

// Saga Watchers
export function* fetchJustificationsItemsStart() {
  yield takeLatest(
    JustificationsActionTypes.FETCH_JUSTIFICATIONS_ITEMS_START,
    fetchCollectionsAsync
  )
}

export function* fetchJustificationsMetadataStart() {
  yield takeLatest(
    JustificationsActionTypes.FETCH_JUSTIFICATIONS_METADATA_START,
    fetchMetadataAsync
  )
}

export function* fetchSortCollectionsAsync({ payload }) {
  try {
    const data = yield call(justificationApi.sortJustifications, payload)
    yield put(
      fetchJustificationsItemsSuccess({
        justificationsItems: data
      })
    )
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  } catch (error) {
    yield put(fetchJustificationsItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchSearchCollectionAsync({ payload }) {
  try {
    const data = yield call(justificationApi.searchJustification, payload)
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
    yield put(fetchJustificationsItemsSuccess({ justificationsItems: data }))
  } catch (error) {
    yield put(fetchJustificationsItemsFailure, error.message)
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchJustificationsSortStart() {
  yield takeLatest(
    JustificationsActionTypes.FETCH_JUSTIFICATIONS_SORT_START,
    fetchSortCollectionsAsync
  )
}

export function* fetchJustificationsSearchStart() {
  yield debounce(
    500,
    JustificationsActionTypes.FETCH_JUSTIFICATIONS_SEARCH_START,
    fetchSearchCollectionAsync
  )
}

// Running all Saga Watchers
export default function* justificationsSagas() {
  yield all([
    call(fetchJustificationsItemsStart),
    call(fetchJustificationsMetadataStart),
    call(fetchJustificationsSortStart),
    call(fetchJustificationsSearchStart)
  ])
}
