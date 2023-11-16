import { takeLatest, call, put, all, select, debounce, take } from 'redux-saga/effects'
import {
  fetchDraftsItemsFailure,
  fetchDraftsItemsSuccess,
  fetchDraftsMetadataFailure,
  fetchDraftsMetadataSuccess,
  updateDraftsShowSmallLoader,
  updateDraftsShowBigLoader
} from './drafts.action'
import DraftsActionTypes from './drafts.type'
import * as draftsApi from '../../api/drafts'
import { selectDraftsPageSize, selectDraftsPageNumber } from './drafts.selector'

// Saga Workers
export function* fetchCollectionsAsync({ payload }) {
  try {
    console.log(payload)
    const pageSize = yield select(selectDraftsPageSize)
    const pageNumber = yield select(selectDraftsPageNumber)
    const data = yield call(draftsApi.getDraftsData, pageSize, pageNumber)
    yield put(updateDraftsShowBigLoader(false))
    yield put(updateDraftsShowSmallLoader(false))
    yield put(fetchDraftsItemsSuccess({ draftsItems: data }))
  } catch (error) {
    yield put(fetchDraftsItemsFailure(error.message))
    yield put(updateDraftsShowBigLoader(false))
    yield put(updateDraftsShowSmallLoader(false))
  }
}

export function* fetchDraftsMetadataAsync() {
  try {
    const data = yield call(draftsApi.getDraftsMeta)
    yield put(fetchDraftsMetadataSuccess(data))
  } catch (error) {
    yield put(fetchDraftsMetadataFailure(error.message))
  }
}

export function* fetchSortCollectionsAsync({ payload }) {
  try {
    const data = yield call(draftsApi.sortDrafts, payload)
    yield put(fetchDraftsItemsSuccess({ draftsItems: data }))
    yield put(updateDraftsShowBigLoader(false))
  } catch (error) {
    yield put(fetchDraftsItemsFailure(error.message))
    yield put(updateDraftsShowBigLoader(false))
  }
}

export function* fetchSearchCollectionAsync({ payload }) {
  try {
    const data = yield call(draftsApi.searchdrafts, payload)
    yield put(fetchDraftsItemsSuccess({ draftsItems: data }))
    yield put(updateDraftsShowBigLoader(false))
  } catch (error) {
    yield put(fetchDraftsItemsFailure(error.message))
    yield put(updateDraftsShowBigLoader(false))
  }
}

// Saga Watchers
export function* fetchDraftsItemsStart() {
  yield takeLatest(DraftsActionTypes.FETCH_DRAFTS_ITEMS_START, fetchCollectionsAsync)
}

export function* fetchDraftsMetadataStart() {
  yield takeLatest(DraftsActionTypes.FETCH_DRAFTS_METADATA_START, fetchDraftsMetadataAsync)
}

export function* fetchDraftsSortStart() {
  yield takeLatest(DraftsActionTypes.FETCH_DRAFTS_SORT_START, fetchSortCollectionsAsync)
}

export function* fetchDraftSearchStart() {
  yield debounce(1000, DraftsActionTypes.FETCH_DRAFT_SEARCH_START, fetchSearchCollectionAsync)
}

export function* updateDraftsItemsStart(payload) {
  yield take(DraftsActionTypes.UPDATE_DRAFTS_ITEMS, payload)
}

// Running all Saga Watchers
export default function* myAssetsSagas() {
  yield all([
    call(fetchDraftsItemsStart),
    call(fetchDraftsMetadataStart),
    call(fetchDraftsSortStart),
    call(fetchDraftSearchStart),
    call(updateDraftsItemsStart)
  ])
}
