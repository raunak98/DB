import { takeLatest, take, call, put, all, select } from 'redux-saga/effects'
import {
  fetchApprovalsItemsFailure,
  fetchApprovalsItemsSuccess,
  fetchApprovalsMetadataFailure,
  fetchApprovalsMetadataSuccess,
  updateShowBigLoader,
  updateShowSmallLoader
} from './approvals.action'
import ApprovalsActionTypes from './approvals.type'
import * as approvalsApi from '../../api/approvals'
import { selectApprovalsPageSize, selectApprovalsPageNumber } from './approvals.selector'

// Saga Workers
export function* fetchCollectionsAsync({ payload }) {
  try {
    const pageSizeNumber = yield select(selectApprovalsPageSize)
    const pageNumber = yield select(selectApprovalsPageNumber)
    let approvalPayload = {
      approvalStatus: 'in-progress',
      pageSize: pageSizeNumber,
      pageNumber
    }
    // if (payload) {
    //   approvalPayload = {
    //     ...approvalPayload,
    //     search_after_primaryKey: payload
    //   }
    // }
    approvalPayload = { ...approvalPayload, ...payload }
    const data = yield call(approvalsApi.getApprvals, approvalPayload)
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
    yield put(fetchApprovalsItemsSuccess({ approvalsItems: data }))
  } catch (error) {
    yield put(fetchApprovalsItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchApprovalsMetadataAsync() {
  try {
    const data = yield call(approvalsApi.getApprovalsMeta)
    yield put(fetchApprovalsMetadataSuccess(data))
  } catch (error) {
    yield put(fetchApprovalsMetadataFailure(error.message))
  }
}

export function* fetchSearchCollectionAsync(action) {
  try {
    const data = yield call(approvalsApi.searchApprovals, action.payload)
    yield put(fetchApprovalsItemsSuccess({ approvalsItems: data }))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  } catch (error) {
    yield put(fetchApprovalsItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

// Saga Watchers
export function* fetchApprovalsItemsStart() {
  yield takeLatest(ApprovalsActionTypes.FETCH_APPROVALS_ITEMS_START, fetchCollectionsAsync)
}

export function* fetchApprovalsMetadataStart() {
  yield takeLatest(ApprovalsActionTypes.FETCH_APPROVALS_METADATA_START, fetchApprovalsMetadataAsync)
}

export function* fetchApprovalsSearchStart() {
  yield takeLatest(ApprovalsActionTypes.FETCH_APPROVALS_SEARCH_START, fetchSearchCollectionAsync)
}

export function* updateApprovalsItemsStart(payload) {
  yield take(ApprovalsActionTypes.UPDATE_APPROVALS_ITEMS, payload)
}

export function* updateApprovalsNotificationMessage(payload) {
  yield take(ApprovalsActionTypes.UPDATE_APPROVALS_NOTIFICATION_MESSAGE, payload)
}

export function* fetchSortCollectionsAsync({ payload }) {
  try {
    const data = yield call(approvalsApi.sortApprovals, payload)
    yield put(
      fetchApprovalsItemsSuccess({
        approvalsItems: data
      })
    )
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  } catch (error) {
    yield put(fetchApprovalsItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchApprovalsSortStart() {
  yield takeLatest(ApprovalsActionTypes.FETCH_APPROVALS_SORT_START, fetchSortCollectionsAsync)
}

// Running all Saga Watchers
export default function* myAssetsSagas() {
  yield all([
    call(fetchApprovalsItemsStart),
    call(fetchApprovalsMetadataStart),
    call(updateApprovalsNotificationMessage),
    call(fetchApprovalsSearchStart),
    call(fetchApprovalsSortStart),
    call(updateApprovalsItemsStart)
  ])
}
