import { takeLatest, call, put, all, select, debounce } from 'redux-saga/effects'
import {
  fetchGroupAssetsItemsFailure,
  fetchGroupAssetsItemsSuccess,
  fetchGroupAssetsMetadataSuccess,
  fetchMyAssetsItemsFailure,
  fetchMyAssetsItemsSuccess,
  fetchNarIdInfoSuccess,
  fetchNarIdInfoFailure,
  fetchPersonalAssetsMetadataFailure,
  fetchPersonalAssetsMetadataSuccess,
  updateShowBigLoader,
  updateShowSmallLoader,
  fetchOwnedGroupAssetsItemsFailure,
  fetchOwnedGroupAssetsItemsSuccess,
  fetchIndirectlyOwnedGroupAssetsMetadataSuccess,
  fetchIndirectlyOwnedGroupAssetsMetadataFailure,
  fetchGroupAssetsRequestHistoryMetadataSuccess,
  fetchGroupAssetsRequestHistoryMetadataFailure,
  fetchGropAssetsRequestHistoryItemsSuccess,
  fetchGropAssetsRequestHistoryItemsFailure
} from './myAssets.action'
import { selectOwnedGroupPageNumber, selectOwnedGroupPageSize } from './myAssets.selector'
import MyAssetsActionTypes from './myAssets.type'
import * as assetsApi from '../../api/assetsManagement'
import * as adminApi from '../../api/admin'

// Saga Workers
export function* fetchCollectionsAsync({ payload }) {
  const { isMyTeamRequest, ...payloadToPass } = payload
  try {
    const data = yield call(assetsApi.getModifyRequests, payloadToPass)
    yield put(fetchMyAssetsItemsSuccess({ myAssetsItems: data }))
    if (isMyTeamRequest) {
      // do nothing
    } else {
      yield put(updateShowBigLoader(false))
      yield put(updateShowSmallLoader(false))
    }
  } catch (error) {
    yield put(fetchMyAssetsItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchSearchCollectionAsync({ payload }) {
  try {
    const data = yield call(assetsApi.searchAssets, payload)
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
    yield put(fetchMyAssetsItemsSuccess({ myAssetsItems: data }))
  } catch (error) {
    yield put(fetchMyAssetsItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchSearchGroupCollectionAsync({ payload }) {
  const { userEmail, ...newPayload } = payload
  try {
    const data = yield call(assetsApi.searchGroupAssets, newPayload, userEmail)
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
    yield put(fetchGroupAssetsItemsSuccess({ groupAssetsItems: data }))
  } catch (error) {
    yield put(fetchGroupAssetsItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchGroupCollectionsAsync({ payload }) {
  const { userEmail, ...newPayload } = payload
  try {
    const data = yield call(assetsApi.getGroupRequests, newPayload, userEmail)
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
    yield put(fetchGroupAssetsItemsSuccess({ groupAssetsItems: data }))
  } catch (error) {
    yield put(fetchGroupAssetsItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchPersonalMetadataAsync() {
  try {
    const data = yield call(assetsApi.getPersonalModifyMetadata)
    yield put(fetchPersonalAssetsMetadataSuccess(data))
  } catch (error) {
    yield put(fetchPersonalAssetsMetadataFailure(error.message))
  }
}

export function* fetchNonPersonalMetadataAsync() {
  try {
    const data = yield call(assetsApi.getNonPersonalModifyMetadata)

    yield put(fetchPersonalAssetsMetadataSuccess(data))
  } catch (error) {
    yield put(fetchPersonalAssetsMetadataFailure(error.message))
  }
}

export function* fetchSearchGroupCollectionsAsync({ payload }) {
  const { userEmail, ...newPayload } = payload
  try {
    const data = yield call(adminApi.searchGroups, newPayload, userEmail)
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
    yield put(fetchGroupAssetsItemsSuccess({ groupAssetsItems: data }))
  } catch (error) {
    yield put(fetchGroupAssetsItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchGroupMetadataAsync() {
  try {
    const data = yield call(assetsApi.getGroupListModifyMetadata)
    yield put(fetchGroupAssetsMetadataSuccess(data))
  } catch (error) {
    yield put(fetchGroupAssetsItemsFailure(error.message))
  }
}
export function* fetchGroupAssetRequestHistoryMetadataAsync() {
  try {
    const data = yield call(assetsApi.getGroupAssetRequestHistoryMetadata)
    yield put(fetchGroupAssetsRequestHistoryMetadataSuccess(data))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  } catch (error) {
    yield put(fetchGroupAssetsRequestHistoryMetadataFailure(error.message))
  }
}

export function* fetchCollectionsGroupAssetsRequestHistoryAsync({ payload }) {
  try {
    const data = yield call(assetsApi.getGroupAssetRequestHistoryData, payload)
    yield put(fetchGropAssetsRequestHistoryItemsSuccess(data))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  } catch (error) {
    yield put(fetchGropAssetsRequestHistoryItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchGroupAssetsRequestHistorySearchCollectionAsync({ payload }) {
  try {
    const data = yield call(assetsApi.searchGroupAssetRequestHistoryData, payload)
    yield put(fetchGropAssetsRequestHistoryItemsSuccess(data))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  } catch (error) {
    yield put(fetchGropAssetsRequestHistoryItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchIndirectlyOwnedGroupMetadataAsync() {
  try {
    const data = yield call(assetsApi.getIndirectlyOwnedGroupListModifyMetadata)
    yield put(fetchIndirectlyOwnedGroupAssetsMetadataSuccess(data))
  } catch (error) {
    yield put(fetchIndirectlyOwnedGroupAssetsMetadataFailure(error.message))
  }
}

export function* fetchOwnedGroupCollectionsAsync({ payload }) {
  const pageSize = yield select(selectOwnedGroupPageSize)
  const pageNumber = yield select(selectOwnedGroupPageNumber)
  try {
    const data = yield call(
      assetsApi.getOwnedGroupRequests,
      payload.userEmail,
      pageSize,
      pageNumber
    )
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
    yield put(fetchOwnedGroupAssetsItemsSuccess({ ownedGroupAssetsItems: data }))
  } catch (error) {
    yield put(fetchOwnedGroupAssetsItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchOwnedGroupSortCollectionsAsync({ payload }) {
  try {
    const data = yield call(assetsApi.sortGroupAssets, payload)
    yield put(fetchOwnedGroupAssetsItemsSuccess({ ownedGroupAssetsItems: data }))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  } catch (error) {
    yield put(fetchOwnedGroupAssetsItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchAssetGroupReqHisSortCollectionsAsync({ payload }) {
  try {
    const data = yield call(assetsApi.sortGroupAssetRequestHistoryData, payload)
    yield put(fetchGropAssetsRequestHistoryItemsSuccess(data))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  } catch (error) {
    yield put(fetchGropAssetsRequestHistoryItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchAssetGroupReqHisSearchCollectionAsync({ payload }) {
  try {
    const data = yield call(assetsApi.searchGroupAssetRequestHistoryData, payload)
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
    yield put(fetchGropAssetsRequestHistoryItemsSuccess({ ownedGroupAssetsItems: data }))
  } catch (error) {
    yield put(fetchGropAssetsRequestHistoryItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchOwnedGroupSearchCollectionAsync({ payload }) {
  try {
    const data = yield call(assetsApi.searchAssets, payload)
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
    yield put(fetchOwnedGroupAssetsItemsSuccess({ ownedGroupAssetsItems: data }))
  } catch (error) {
    yield put(fetchOwnedGroupAssetsItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

// Saga Watchers
export function* fetchMyAssetsItemsStart() {
  yield takeLatest(MyAssetsActionTypes.FETCH_MY_ASSETS_ITEMS_START, fetchCollectionsAsync)
}

export function* fetchMyAssetsSearchStart() {
  yield takeLatest(MyAssetsActionTypes.FETCH_ASSETS_SEARCH_START, fetchSearchCollectionAsync)
}
export function* fetchGroupAssetsRequestHistorySearchStart() {
  yield takeLatest(
    MyAssetsActionTypes.FETCH_GROUP_ASSETS_REQUEST_HISTORY_SEARCH_START,
    fetchGroupAssetsRequestHistorySearchCollectionAsync
  )
}
export function* fetchPersonalAssetsMetadataStart() {
  yield takeLatest(
    MyAssetsActionTypes.FETCH_PERSONAL_ASSETS_METADATA_START,
    fetchPersonalMetadataAsync
  )
}

export function* fetchMyGroupAssetsSearchStart() {
  yield takeLatest(
    MyAssetsActionTypes.FETCH_GROUP_ASSETS_SEARCH_START,
    fetchSearchGroupCollectionAsync
  )
}

export function* fetchNonPersonalAssetsMetadataStart() {
  yield takeLatest(
    MyAssetsActionTypes.FETCH_NON_PERSONAL_ASSETS_METADATA_START,
    fetchNonPersonalMetadataAsync
  )
}

export function* fetchGroupAssetsItemsStart() {
  yield takeLatest(MyAssetsActionTypes.FETCH_GROUP_ASSETS_ITEMS_START, fetchGroupCollectionsAsync)
}

export function* fetchGroupAssetsMetadataStart() {
  yield takeLatest(MyAssetsActionTypes.FETCH_GROPUP_ASSETS_METADATA_START, fetchGroupMetadataAsync)
}

export function* fetchIndirectlyOwnedGroupAssetsMetadataStart() {
  yield takeLatest(
    MyAssetsActionTypes.FETCH_INDIRECTLY_OWNED_GROUP_ASSETS_METADATA_START,
    fetchIndirectlyOwnedGroupMetadataAsync
  )
}

export function* fetchSortCollectionsAsync({ payload }) {
  try {
    const data = yield call(assetsApi.sortAssets, payload)
    yield put(
      fetchMyAssetsItemsSuccess({
        myAssetsItems: data
      })
    )
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  } catch (error) {
    yield put(fetchMyAssetsItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchSortCollectionsAsyncAccountAdmin({ payload }) {
  try {
    const data = yield call(adminApi.sortAccounts, payload)
    yield put(
      fetchMyAssetsItemsSuccess({
        myAssetsItems: data
      })
    )
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  } catch (error) {
    yield put(fetchMyAssetsItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchSortGroupCollectionsAsync({ payload }) {
  try {
    const data = yield call(assetsApi.sortGroupAssets, payload)
    yield put(
      fetchGroupAssetsItemsSuccess({
        groupAssetsItems: data
      })
    )
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  } catch (error) {
    yield put(fetchGroupAssetsItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchGroupAdminCollectionsAsync({ payload }) {
  const { userEmail, ...newPayload } = payload
  try {
    const data = yield call(adminApi.sortGroups, newPayload, userEmail)
    yield put(
      fetchGroupAssetsItemsSuccess({
        groupAssetsItems: data
      })
    )
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  } catch (error) {
    yield put(fetchGroupAssetsItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchMyAssetsSortStart() {
  yield takeLatest(MyAssetsActionTypes.FETCH_ASSETS_SORT_START, fetchSortCollectionsAsync)
}

// Account Admin
export function* fetchAccountAdminSortStart() {
  yield takeLatest(
    MyAssetsActionTypes.FETCH_ACCOUNT_ADMIN_SORT_START,
    fetchSortCollectionsAsyncAccountAdmin
  )
}

export function* fetchMyGroupAssetsSortStart() {
  yield takeLatest(
    MyAssetsActionTypes.FETCH_GROUP_ASSETS_SORT_START,
    fetchSortGroupCollectionsAsync
  )
}

export function* fetchGroupAdminSortStart() {
  yield takeLatest(
    MyAssetsActionTypes.FETCH_GROUP_ADMIN_SORT_START,
    fetchGroupAdminCollectionsAsync
  )
}

export function* fetchMyAssetNarIdInfoCollectionsAsync({ payload }) {
  try {
    const data = yield call(assetsApi.getNarIdInfo, payload)
    yield put(fetchNarIdInfoSuccess(data))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  } catch (error) {
    yield put(fetchNarIdInfoFailure(error.message))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}
export function* fetchMyAssetsNarIdInfoStart() {
  yield takeLatest(MyAssetsActionTypes.FETCH_NAR_ID_START, fetchMyAssetNarIdInfoCollectionsAsync)
}

export function* fetchSearchGroupAssetsItemsStart() {
  yield takeLatest(
    MyAssetsActionTypes.FETCH_SEARCH_GROUP_ASSETS_ITEMS_START,
    fetchSearchGroupCollectionsAsync
  )
}

export function* fetchOwnedGroupAssetsSortStart() {
  yield takeLatest(
    MyAssetsActionTypes.FETCH_OWNED_GROUP_ASSETS_SORT_START,
    fetchOwnedGroupSortCollectionsAsync
  )
}

export function* fetchOwnedGroupAssetsItemsStart() {
  yield takeLatest(
    MyAssetsActionTypes.FETCH_OWNED_GROUP_ASSETS_ITEMS_START,
    fetchOwnedGroupCollectionsAsync
  )
}

export function* fetchOwnedGroupAssetsSearchStart() {
  yield takeLatest(
    MyAssetsActionTypes.FETCH_OWNED_GROUP_ASSETS_SEARCH_START,
    fetchOwnedGroupSearchCollectionAsync
  )
}

export function* fetchGroupAssetsRequestHistoryMetadataStart() {
  yield takeLatest(
    MyAssetsActionTypes.FETCH_GROUP_ASSETS_REQUESTHISTORY_METADATA_START,
    fetchGroupAssetRequestHistoryMetadataAsync
  )
}

export function* fetchGropAssetsRequestHistoryItemsStart() {
  yield takeLatest(
    MyAssetsActionTypes.FETCH_GROUP_ASSETS_REQUESTHISTORY_ITEMS_START,
    fetchCollectionsGroupAssetsRequestHistoryAsync
  )
}

export function* fetchAssetGroupRequestHistorySortStart() {
  yield takeLatest(
    MyAssetsActionTypes.FETCH_GROUP_ASSETS_REQUEST_HISTORY_SORT_START,
    fetchAssetGroupReqHisSortCollectionsAsync
  )
}
export function* fetchRequestHistorySearchStart() {
  yield debounce(
    1000,
    MyAssetsActionTypes.FETCH_GROUP_ASSETS_REQUEST_HISTORY_SEARCH_START,
    fetchAssetGroupReqHisSearchCollectionAsync
  )
}
// Running all Saga Watchers
export default function* myAssetsSagas() {
  yield all([
    call(fetchMyAssetsItemsStart),
    call(fetchPersonalAssetsMetadataStart),
    call(fetchNonPersonalAssetsMetadataStart),
    call(fetchGroupAssetsMetadataStart),
    call(fetchGroupAssetsRequestHistoryMetadataStart),
    call(fetchGropAssetsRequestHistoryItemsStart),
    call(fetchAssetGroupRequestHistorySortStart),
    call(fetchGroupAssetsRequestHistorySearchStart),
    call(fetchIndirectlyOwnedGroupAssetsMetadataStart),
    call(fetchGroupAssetsItemsStart),
    call(fetchMyAssetsSortStart),
    call(fetchMyAssetsSearchStart),
    call(fetchMyGroupAssetsSortStart),
    call(fetchGroupAdminSortStart),
    call(fetchMyGroupAssetsSearchStart),
    call(fetchMyAssetsNarIdInfoStart),
    call(fetchSearchGroupAssetsItemsStart),
    call(fetchOwnedGroupAssetsItemsStart),
    call(fetchOwnedGroupAssetsSortStart),
    call(fetchOwnedGroupAssetsSearchStart),
    call(fetchAccountAdminSortStart)
  ])
}
