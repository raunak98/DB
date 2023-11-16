import { all, call, put, takeLatest, select, debounce } from 'redux-saga/effects'
import {
  fetchMyTeamItemsFailure,
  fetchMyTeamItemsSuccess,
  fetchMyTeamMetadataFailure,
  fetchMyTeamMetadataSuccess,
  updateShowBigLoader,
  fetchMyTeamSearchSuccess
} from './myTeam.action'

import { selectMyTeamPageSize, selectMyTeamPageNumber } from './myTeam.selector'

import MyTeamActionTypes from './myTeam.type'

import * as myTeamApi from '../../api/myTeam'

// Workers
export function* fetchCollectionsAsync({ payload }) {
  try {
    const pageNumber = yield select(selectMyTeamPageNumber)
    const pageSize = yield select(selectMyTeamPageSize)
    let myTeamPayload = {
      pageSize,
      pageNumber
    }
    if (payload) {
      myTeamPayload = {
        ...myTeamPayload
        // search_after_primaryKey: payload
      }
    }
    const data = yield call(myTeamApi.getMyTeamsData, myTeamPayload)
    yield put(fetchMyTeamItemsSuccess(data))
    yield put(updateShowBigLoader(false))
  } catch (error) {
    yield put(fetchMyTeamItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
  }
}

export function* fetchMetadataAsync() {
  try {
    const data = yield call(myTeamApi.getMyTeamMeta)

    yield put(fetchMyTeamMetadataSuccess(data))
  } catch (error) {
    yield put(fetchMyTeamMetadataFailure(error.message))
  }
}

export function* fetchSearchCollectionAsync({ payload }) {
  try {
    const data = yield call(myTeamApi.searchMyTeamsData, payload)

    yield put(fetchMyTeamSearchSuccess(data))
    // yield put(updateShowBigLoader(false))
  } catch (error) {
    yield put(fetchMyTeamItemsFailure(error.message))
    // yield put(updateShowBigLoader(false))
  }
}

// Watchers

export function* fetchMyTeamItemsStart() {
  yield takeLatest(MyTeamActionTypes.FETCH_MYTEAM_ITEMS_START, fetchCollectionsAsync)
}

export function* fetchMyTeamMetadataStart() {
  yield takeLatest(MyTeamActionTypes.FETCH_MYTEAM_METADATA_START, fetchMetadataAsync)
}

export function* fetchMyTeamSearchStart() {
  yield debounce(1000, MyTeamActionTypes.FETCH_MYTEAM_SEARCH_START, fetchSearchCollectionAsync)
}

export function* fetchSortCollectionsAsync({ payload }) {
  try {
    const data = yield call(myTeamApi.sortMyTeamsData, payload)
    yield put(fetchMyTeamItemsSuccess(data))
    yield put(updateShowBigLoader(false))
  } catch (error) {
    yield put(fetchMyTeamItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
  }
}

export function* fetchMyTeamSortStart() {
  yield takeLatest(MyTeamActionTypes.FETCH_MYTEAM_SORT_START, fetchSortCollectionsAsync)
}

// Run Watchers
export default function* myTeamSagas() {
  yield all([
    call(fetchMyTeamMetadataStart),
    call(fetchMyTeamItemsStart),
    call(fetchMyTeamSearchStart),
    call(fetchMyTeamSortStart)
  ])
}
