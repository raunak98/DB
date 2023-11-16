import { all, call, put, takeLatest, select } from 'redux-saga/effects'
import {
  fetchApprovalHistoryItemsFailure,
  fetchApprovalHistoryItemsSuccess,
  fetchApprovalHistoryMetadataFailure,
  fetchApprovalHistoryMetadataSuccess,
  updateShowBigLoader
} from './approvalHistory.action'

import {
  selectApprovalHistoryPageSize,
  selectApprovalHistoryPageNumber
} from './approvalHistory.selector'
import ApprovalHistoryActionTypes from './approvalHistory.type'
import * as approvalHistoryApi from '../../../api/history'
import * as profileAPI from '../../../api/profile'

// Workers
export function* fetchCollectionsAsync({ payload }) {
  try {
    // const pageSizeNumber = yield select(selectApprovalHistoryPageSize)
    const pageNumber = yield select(selectApprovalHistoryPageNumber)
    const pageSize = yield select(selectApprovalHistoryPageSize)
    const userInfo = yield call(profileAPI.getUserInfo)
    let approvalHistoryPayload = {
      approvalStatus: 'complete',
      pageSize,
      pageNumber
    }
    if (payload) {
      approvalHistoryPayload = {
        ...approvalHistoryPayload
        // search_after_primaryKey: payload.search_after_primaryKey,
        // search_after_keyword: payload.search_after_keyWord
      }
    }
    const data = yield call(
      approvalHistoryApi.getHistoryData,
      approvalHistoryPayload,
      userInfo?.authenticationId
    )

    yield put(fetchApprovalHistoryItemsSuccess(data))
    yield put(updateShowBigLoader(false))
  } catch (error) {
    yield put(fetchApprovalHistoryItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
  }
}

export function* fetchMetadataAsync() {
  try {
    const data = yield call(approvalHistoryApi.getApprovalHistoryMeta)
    yield put(fetchApprovalHistoryMetadataSuccess(data))
  } catch (error) {
    yield put(fetchApprovalHistoryMetadataFailure(error.message))
  }
}

export function* fetchSearchCollectionAsync({ payload }) {
  try {
    const data = yield call(approvalHistoryApi.approvalsHistorysearch, payload)
    yield put(fetchApprovalHistoryItemsSuccess(data))
    yield put(updateShowBigLoader(false))
  } catch (error) {
    yield put(fetchApprovalHistoryItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
  }
}
// Watchers

export function* fetchApprovalHistoryItemsStart() {
  yield takeLatest(
    ApprovalHistoryActionTypes.FETCH_APPROVALHISTORY_ITEMS_START,
    fetchCollectionsAsync
  )
}

export function* fetchApprovalHistoryMetadataStart() {
  yield takeLatest(
    ApprovalHistoryActionTypes.FETCH_APPROVALHISTORY_METADATA_START,
    fetchMetadataAsync
  )
}

export function* fetchApprovalHistorySearchStart() {
  yield takeLatest(
    ApprovalHistoryActionTypes.FETCH_APPROVALHISTORY_SEARCH_START,
    fetchSearchCollectionAsync
  )
}

export function* fetchSortCollectionsAsync({ payload }) {
  try {
    const userInfo = yield call(profileAPI.getUserInfo)
    const data = yield call(
      approvalHistoryApi.sortApprovalHistory,
      payload,
      userInfo?.authenticationId
    )
    yield put(fetchApprovalHistoryItemsSuccess(data))
    yield put(updateShowBigLoader(false))
  } catch (error) {
    yield put(fetchApprovalHistoryItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
  }
}

export function* fetchApprovalHistorySortStart() {
  yield takeLatest(
    ApprovalHistoryActionTypes.FETCH_APPROVAL_HISTORY_SORT_START,
    fetchSortCollectionsAsync
  )
}

// Run Watchers
export default function* approvaltHistorySagas() {
  yield all([
    call(fetchApprovalHistoryMetadataStart),
    call(fetchApprovalHistoryItemsStart),
    call(fetchApprovalHistorySearchStart),
    call(fetchApprovalHistorySortStart)
  ])
}
