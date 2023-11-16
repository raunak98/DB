import { takeLatest, call, put, all, debounce } from 'redux-saga/effects'
import {
  fetchMyAccessGroupItemsFailure,
  fetchMyAccessGroupItemsSuccess,
  fetchMyAccessGroupMetadataFailure,
  fetchMyAccessGroupMetadataSuccess,
  updateShowBigAccessLoader,
  updateShowSmallAccessLoader
} from './myAccess.action'
import MyAccessActionTypes from './myAccess.type'
import * as accessApi from '../../api/accessManagement'

// Saga Workers
export function* fetchCollectionsAsync({ payload }) {
  try {
    const data = yield call(accessApi.getAccessGroupDetails, payload)
    yield put(updateShowBigAccessLoader(false))
    yield put(updateShowSmallAccessLoader(false))
    yield put(fetchMyAccessGroupItemsSuccess({ myAccessGroupItems: data }))
  } catch (error) {
    yield put(fetchMyAccessGroupItemsFailure(error.message))
    yield put(updateShowBigAccessLoader(false))
    yield put(updateShowSmallAccessLoader(false))
  }
}

export function* fetchMetadataAsync() {
  try {
    const data = yield call(accessApi.getAccessGroupMeta)
    yield put(fetchMyAccessGroupMetadataSuccess(data))
  } catch (error) {
    yield put(fetchMyAccessGroupMetadataFailure(error.message))
  }
}

export function* fetchSortCollectionsAsync({ payload }) {
  try {
    const data = yield call(accessApi.sortMyAccessGroups, payload)
    yield put(fetchMyAccessGroupItemsSuccess({ myAccessGroupItems: data }))
    yield put(updateShowBigAccessLoader(false))
    yield put(updateShowSmallAccessLoader(false))
  } catch (error) {
    yield put(fetchMyAccessGroupItemsFailure(error.message))
    yield put(updateShowBigAccessLoader(false))
    yield put(updateShowSmallAccessLoader(false))
  }
}

export function* fetchSearchCollectionAsync({ payload }) {
  try {
    const data = yield call(accessApi.searchMyAccessGroups, payload)
    yield put(updateShowBigAccessLoader(false))
    yield put(updateShowSmallAccessLoader(false))
    yield put(fetchMyAccessGroupItemsSuccess({ myAccessGroupItems: data }))
  } catch (error) {
    yield put(fetchMyAccessGroupItemsFailure(error.message))
    yield put(updateShowBigAccessLoader(false))
    yield put(updateShowSmallAccessLoader(false))
  }
}

// Saga Watchers
export function* fetchMyAccessGroupItemsStart() {
  yield takeLatest(MyAccessActionTypes.FETCH_GROUP_ACCESS_ITEMS_START, fetchCollectionsAsync)
}

export function* fetchMyAccessGroupMetadataStart() {
  yield takeLatest(MyAccessActionTypes.FETCH_GROUP_ACCESS_METADATA_START, fetchMetadataAsync)
}

export function* fetchMyAccessGroupSortStart() {
  yield takeLatest(MyAccessActionTypes.FETCH_GROUP_ACCESS_SORT_START, fetchSortCollectionsAsync)
}

export function* fetchMyAccessGroupSearchStart() {
  yield debounce(
    500,
    MyAccessActionTypes.FETCH_GROUP_ACCESS_SEARCH_START,
    fetchSearchCollectionAsync
  )
}

// Running all Saga Watchers
export default function* myAccessSagas() {
  yield all([
    call(fetchMyAccessGroupItemsStart),
    call(fetchMyAccessGroupMetadataStart),
    call(fetchMyAccessGroupSearchStart),
    call(fetchMyAccessGroupSortStart)
  ])
}
