import { all, call, put, takeLatest } from 'redux-saga/effects'
import {
  fetchServiceDeskAdminItemsFailure,
  fetchServiceDeskAdminItemsSuccess,
  fetchServiceDeskAdminMetadataFailure,
  fetchServiceDeskAdminMetadataSuccess,
  updateShowBigLoader
  //   fetchServiceDeskAdminSearchSuccess
} from './serviceDeskAdmin.action'

/* import {
    selectServiceDeskAdminPageSize,
    selectServiceDeskAdminPageNumber
} from './serviceDeskAdmin.selector' */

import ServiceDeskAdminActionTypes from './serviceDeskAdmin.type'
import * as adminApi from '../../../api/admin'

// Workers
export function* fetchSearchResultsCollectionsAsync({ payload }) {
  // const { userEmail, ...newPayload } = payload
  try {
    const data = yield call(adminApi.serviceDeskTableResults, payload)
    yield put(updateShowBigLoader(false))
    // yield put(updateShowSmallLoader(false))
    yield put(fetchServiceDeskAdminItemsSuccess(data))
  } catch (error) {
    yield put(fetchServiceDeskAdminItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
    // yield put(updateShowSmallLoader(false))
  }
}

export function* fetchSortResultsCollectionsAsync({ payload }) {
  try {
    const data = yield call(adminApi.serviceDeskTableSortResults, payload)
    yield put(updateShowBigLoader(false))
    yield put(fetchServiceDeskAdminItemsSuccess(data))
  } catch (error) {
    yield put(fetchServiceDeskAdminItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
  }
}

export function* fetchMetadataAsync() {
  try {
    const data = yield call(adminApi.serviceDeskTableMeta)
    yield put(fetchServiceDeskAdminMetadataSuccess(data))
  } catch (error) {
    yield put(fetchServiceDeskAdminMetadataFailure(error.message))
  }
}

// Watchers
export function* fetchServiceDeskAdminMetadataStart() {
  yield takeLatest(
    ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_METADATA_START,
    fetchMetadataAsync
  )
}

export function* fetchServiceDeskAdminSearchStart() {
  yield takeLatest(
    ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_SEARCH_START,
    fetchSearchResultsCollectionsAsync
  )
}

export function* fetchServiceDeskAdminItemsStart() {
  yield takeLatest(
    ServiceDeskAdminActionTypes.FETCH_SERVICE_DESK_ADMIN_SORT_START,
    fetchSortResultsCollectionsAsync
  )
}

// Run Watchers
export default function* serviceDeskAdminSagas() {
  yield all([
    call(fetchServiceDeskAdminMetadataStart),
    call(fetchServiceDeskAdminSearchStart),
    call(fetchServiceDeskAdminItemsStart)
  ])
}
