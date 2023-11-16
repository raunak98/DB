import { takeLatest, call, put, all, take, select, debounce } from 'redux-saga/effects'
import {
  fetchReviewItemsFailure,
  fetchReviewItemsSuccess,
  fetchReviewMetadataFailure,
  fetchReviewMetadataSuccess,
  fetchReviewerdataSuccess,
  fetchReviewerdataFailure,
  fetchMonitordataSuccess,
  fetchMonitordataFailure,
  updateShowBigLoader,
  updateShowSmallLoader,
  getReviewItemTotalCount,
  setFilterData,
  fetchReviewPageCount,
  updateNormalizedMonitorData
} from './review.action'
import ReviewActionTypes from './review.type'
import * as reviewApi from '../../api/review'
import * as profileAPI from '../../api/profile'

import {
  selectReviewItems,
  selectReviewTypeStatus,
  selectReviewPageNumber,
  selectReviewPageSize,
  selectElasticSearchParameter,
  selectCertification,
  selectFilterData,
  selectIsSemiAnnualCampaign,
  selectApplyFilters
} from './review.selector'
import { selectProfileDetailsSelector, selectProvisioningRoles } from '../profile/profile.selector'

// Saga Workers
export function* fetchCollectionsAsync({ payload }) {
  try {
    const getReviewStatus = yield select(selectReviewTypeStatus)
    const pageNumber = yield select(selectReviewPageNumber)
    const pageSize = yield select(selectReviewPageSize)
    const reviewInfo = yield call(reviewApi.getCampaignInfo, payload)
    const userInfo = yield call(profileAPI.getUserInfo)
    const data = yield call(
      reviewApi.get,
      payload,
      getReviewStatus,
      pageSize,
      pageNumber,
      reviewInfo.description,
      userInfo.id
    )
    yield put(fetchReviewItemsSuccess({ reviewItems: data, reviewInfo }))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
    yield put(
      fetchReviewItemsSuccess({ reviewItems: data, reviewInfo, elasticSearchItem: undefined })
    )
  } catch (error) {
    yield put(fetchReviewItemsFailure(error.message))
    yield put(updateShowBigLoader(false))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchFilteredCollectionsAsync({ payload }) {
  try {
    let description = ''
    let data = ''
    if (payload?.certificationName) {
      description = payload?.certificationName ? payload.certificationName : ''
      /* eslint-disable no-param-reassign */
      delete payload.certificationName
    }
    const isSemiAnnualCampaign = yield select(selectIsSemiAnnualCampaign)
    const userInfo = yield call(profileAPI.getUserInfo)
    const profileDetails = yield select(selectProfileDetailsSelector)
    const provisioningRoles = yield select(selectProvisioningRoles)
    if (isSemiAnnualCampaign) {
      const updatedPayload = {
        ...payload,
        userRole: 'reviewer',
        userEmail: profileDetails?.mail
      }
      data = yield call(
        reviewApi.filterByReviewerSa,
        updatedPayload,
        userInfo.id,
        description,
        provisioningRoles
      )
    } else {
      data = yield call(reviewApi.filterBy, payload, userInfo.id, description)
    }
    const elasticSearchItems = yield select(selectElasticSearchParameter)
    const pageNumber = yield select(selectReviewPageNumber)
    const elastingData =
      // eslint-disable-next-line no-nested-ternary
      elasticSearchItems.length >= pageNumber + 1
        ? []
        : data.length > 0
        ? data[data.length - 1].sort
        : []

    if (isSemiAnnualCampaign) {
      yield put(fetchReviewerdataSuccess({ reviewerData: data }))
    } else {
      yield put(
        fetchReviewItemsSuccess({
          reviewItems: data,
          elasticSearchItem: elastingData
        })
      )
    }
    yield put(
      getReviewItemTotalCount(data.length > 0 && data[0].total !== undefined ? data[0].total : 0)
    )
  } catch (error) {
    yield put(fetchReviewItemsFailure(error.message))
  }
}

export function* fetchCollectionsSearchAsync({ payload }) {
  try {
    const data = yield call(reviewApi.search, payload.id, payload.word)
    yield put(fetchReviewItemsSuccess(data))
  } catch (error) {
    yield put(fetchReviewItemsFailure(error.message))
  }
}

export function* fetchMetadataAsync({ payload }) {
  try {
    const reviewInfo = yield call(reviewApi.getCampaignInfo, payload)
    // const description = reviewInfo.description.split(' ').pop().slice(1)

    // TODO : 102 and 103 lines are workaround for local server

    // const data = yield call(reviewApi.getMetadata, reviewInfo.description)
    // yield put(fetchReviewMetadataSuccess({ metadata: data, reviewInfo }))
    if (
      [
        'ENDUSER_ACCS_DB',
        'SELF_ASSESSMENT',
        'AAA_WIN_UNIX_DB_DBPASSPORT_FOBO',
        'AAA_WIN_UNIX_DB_DBPASSPORT_MOV',
        'AAA_ASA_DB',
        'AAA_ASA_UNIX',
        'AAA_ASA_WIN',
        'ACCS_GROUP_DBPASSPORT',
        'GROUP_ENT_DBPASSPORT',
        'ISA_WIN_UNIX_DB',
        'DORMANT_AD_ACCS',
        'SECURITY_ADGROUP',
        'SECURITY_VDRGROUP',
        'WIN_UNIX_DB_DBPASSPORT_FOBO',
        'SECURITY_ADGROUP_MAIN',
        'SECURITY_VDRGROUP_MAIN',
        'RACF_ROL_ACC',
        'RACF_GRP_ACC',
        'RACF_ROL_GRP',
        'DB2_GRP',
        'DB2_ACC',
        'MIDRANGE_ACC',
        'CYB_ACL_MEM',
        'CYB_SAFE_CNT_ACL',
        'CYB_SAFE_CNT'
      ].includes(reviewInfo.description)
    ) {
      const data = yield call(reviewApi.getMetadataByDescription, reviewInfo.description)
      yield put(fetchReviewMetadataSuccess({ metadata: data, reviewInfo }))
    } else {
      const data = yield call(reviewApi.getMetadata)
      yield put(fetchReviewMetadataSuccess({ metadata: data, reviewInfo }))
    }
  } catch (error) {
    yield put(fetchReviewMetadataFailure(error.message))
  }
}
// Reviewer Data
export function* fetchReviewerdataAsync({ payload }) {
  try {
    const userInfo = yield call(profileAPI.getUserInfo)
    const reviewInfo = yield call(reviewApi.getCampaignInfo, payload.campaignId)
    const provisioningRoles = yield select(selectProvisioningRoles)

    const data1 = {
      campaignId: payload.campaignId,
      status: payload.status || payload?.decisionStatus,
      userEmail: payload.userEmail,
      userRole: payload.userRole,
      pageSize: payload.pageSize,
      pageNumber: payload.pageNumber
    }
    const data = yield call(
      reviewApi.postReviwerData,
      data1,
      userInfo.id,
      reviewInfo.description,
      provisioningRoles
    )
    yield put(fetchReviewerdataSuccess({ reviewerData: data }))
  } catch (error) {
    yield put(fetchReviewerdataFailure(error.message))
  }
}
// Monitor Data
export function* fetchMonitordataAsync({ payload }) {
  const filterData = yield select(selectFilterData)
  try {
    const userInfo = yield call(profileAPI.getUserInfo)
    const reviewInfo = yield call(reviewApi.getCampaignInfo, payload.campaignId)
    const provisioningRoles = yield select(selectProvisioningRoles)
    const data1 = {
      campaignId: payload.campaignId,
      status: payload.status || payload?.decisionStatus,
      userEmail: payload.userEmail,
      userRole: payload.userRole,
      pageSize: payload.pageSize,
      pageNumber: payload.pageNumber
    }
    const data = yield call(
      reviewApi.postMonitorData,
      data1,
      userInfo.id,
      reviewInfo.description,
      provisioningRoles
    )
    if (payload?.userRole === 'monitor' && data) {
      let response
      if (data?.aggregations?.g1?.buckets.length > 0) {
        yield put(fetchReviewPageCount(data?.aggregations?.totalGroups.doc_count))
        response = data.aggregations.g1.buckets
      } else {
        yield put(fetchReviewPageCount(0))
      }
      yield put(
        setFilterData({
          currentFilter: filterData.currentFilter,
          data: response !== undefined ? response : []
        })
      )
    }
    yield put(fetchMonitordataSuccess({ monitorData: data }))
    yield put(updateShowBigLoader(false))
  } catch (error) {
    yield put(fetchMonitordataFailure(error.message))
    yield put(updateShowBigLoader(false))
  }
}

export function* signOffItemsAsync({ payload }) {
  const getReviewItems = yield select(selectReviewItems)
  // const errors = []

  // Initialize payloads
  const actionsApisPayload = {}
  payload.forEach((action) => {
    actionsApisPayload[action] = { ids: [] }
  })

  // TODO: Needs rework once pagination will be added
  // Search items that need an action taken on them (e.g. revoke, action etc )
  yield getReviewItems.forEach((item) => {
    if (payload.includes(item.action)) {
      actionsApisPayload[item.action].ids.push(item.id)
    }
  })

  const apiCalls = []
  const callActionApis = async () => {
    await Object.keys(actionsApisPayload).forEach((action) => {
      if (actionsApisPayload[action].ids.length > 0) {
        apiCalls.push(reviewApi.takeAction(action, { ids: actionsApisPayload[action].ids }))
      }
    })

    Promise.all(apiCalls)
      .then((res) => console.log(res))
      .catch((e) => {
        // TODO: Send this errors when the notification pop-up component will be created
        console.error(e)
      })
  }
  yield call(callActionApis)
}
export function* fetchSortCollectionsAsync({ payload }) {
  try {
    const reviewInfo = yield call(reviewApi.getCampaignInfo, payload.campaignId)
    const userInfo = yield call(profileAPI.getUserInfo)
    const data = yield call(reviewApi.sortBy, payload, userInfo.id, reviewInfo.description)
    yield put(
      fetchReviewItemsSuccess({
        reviewItems: data,
        reviewInfo
      })
    )
    yield put(updateShowSmallLoader(false))
  } catch (error) {
    yield put(fetchReviewItemsFailure(error.message))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchReviewerGroupBySortStartCollectionAsync({ payload }) {
  try {
    const reviewInfo = yield call(reviewApi.getCampaignInfo, payload.campaignId)
    const userInfo = yield call(profileAPI.getUserInfo)
    // const appliedFilter = yield select(selectApplyFilters)
    const provisioningRoles = yield select(selectProvisioningRoles)
    const data = yield call(
      reviewApi.postSortGroupByReviewerSa,
      payload,
      userInfo.id,
      reviewInfo.description,
      provisioningRoles
    )
    yield put(
      fetchReviewItemsSuccess({
        reviewItems: data,
        reviewInfo
      })
    )
    yield put(updateShowSmallLoader(false))
  } catch (error) {
    yield put(fetchReviewerdataFailure(error.message))
    yield put(updateShowSmallLoader(false))
  }
}

// Reviewer sort
export function* fetchReviewerSortCollectionsAsync({ payload }) {
  try {
    const reviewInfo = yield call(reviewApi.getCampaignInfo, payload.campaignId)
    const userInfo = yield call(profileAPI.getUserInfo)
    const appliedFilter = yield select(selectApplyFilters)
    const provisioningRoles = yield select(selectProvisioningRoles)
    let data
    if (appliedFilter.length > 0) {
      const filterSortPayload = {
        ...payload,
        filterBy: appliedFilter[0].id.type,
        filterByValue: appliedFilter[0].id.value
      }
      data = yield call(
        reviewApi.filterSortReviewer,
        filterSortPayload,
        userInfo.id,
        reviewInfo.description,
        provisioningRoles
      )
    } else {
      data = yield call(
        reviewApi.sortReviewerBy,
        payload,
        userInfo.id,
        reviewInfo.description,
        provisioningRoles
      )
    }

    yield put(fetchReviewerdataSuccess({ reviewerData: data }))
    yield put(updateShowSmallLoader(false))
  } catch (error) {
    yield put(fetchReviewerdataFailure(error.message))
    yield put(updateShowSmallLoader(false))
  }
}

// Monitor sort

export function* fetchMonitorSortCollectionsAsync({ payload }) {
  try {
    const reviewInfo = yield call(reviewApi.getCampaignInfo, payload.campaignId)
    const userInfo = yield call(profileAPI.getUserInfo)
    const provisioningRoles = yield select(selectProvisioningRoles)
    const data = yield call(
      reviewApi.sortMonitorBy,
      payload,
      userInfo.id,
      reviewInfo.description,
      provisioningRoles
    )

    // yield put(fetchMonitordataSuccess({ monitorData: data }))
    yield put(
      fetchReviewItemsSuccess({
        reviewItems: data,
        reviewInfo
      })
    )
    yield put(updateShowSmallLoader(false))
  } catch (error) {
    yield put(fetchMonitordataFailure(error.message))
    yield put(updateShowSmallLoader(false))
  }
}

export function* fetchGroupByReviewerSearchAsync({ payload }) {
  const userInfo = yield call(profileAPI.getUserInfo)
  const certType = yield select(selectCertification)
  const provisioningRoles = yield select(selectProvisioningRoles)
  const res = yield call(
    reviewApi.reviewerSearch,
    payload,
    userInfo.id,
    certType,
    provisioningRoles
  )
  yield put(
    fetchReviewItemsSuccess({
      reviewItems: res
    })
  )
}

export function* fetchGroupByCollectionsAsync({ payload }) {
  const filterData = yield select(selectFilterData)
  const userInfo = yield call(profileAPI.getUserInfo)
  const certification = yield select(selectCertification)
  let response
  const isSemiAnnualCampaign = yield select(selectIsSemiAnnualCampaign)
  if (filterData.currentFilter === 'Reviewer') {
    const respGroup = yield call(reviewApi.groupByMonitor, payload, userInfo.id, certification)
    if (respGroup && respGroup.normalizedData[0]?.total > 0) {
      if (respGroup && respGroup?.aggregations?.g1?.buckets) {
        yield put(fetchReviewPageCount(respGroup?.aggregations?.g1?.buckets.length))
        response = respGroup.aggregations.g1.buckets
        yield put(updateNormalizedMonitorData(respGroup.normalizedData))
        yield put(updateShowBigLoader(false))
      } else {
        yield put(fetchReviewPageCount(0))
        yield put(updateShowBigLoader(false))
      }
    } else {
      yield put(updateShowBigLoader(false))
    }
  } else {
    if (isSemiAnnualCampaign) {
      const updatedPayload = {
        ...payload,
        status: payload?.status ? payload.status : payload?.decisionStatus
      }
      response = yield call(reviewApi.groupByForReviewerTabSa, updatedPayload)
    } else {
      response = yield call(reviewApi.groupBy, payload)
    }
    if (response?.length > 0) {
      const objEntries = Object.entries(response[response.length - 1])
      yield put(fetchReviewPageCount(objEntries[0][1]))
    } else {
      yield put(fetchReviewPageCount(0))
    }
    yield put(updateShowBigLoader(false))
  }

  yield put(
    setFilterData({
      currentFilter: filterData.currentFilter,
      data: response !== undefined ? response : []
    })
  )
}

// Saga Watchers
export function* fetchReviewItemsStart() {
  yield takeLatest(ReviewActionTypes.FETCH_REVIEW_ITEMS_START, fetchCollectionsAsync)
}

export function* fetchReviewFilterStart() {
  yield takeLatest(ReviewActionTypes.FETCH_REVIEW_FILTER_START, fetchFilteredCollectionsAsync)
}

export function* fetchReviewSearchStart() {
  yield debounce(1000, ReviewActionTypes.FETCH_REVIEW_SEARCH_START, fetchCollectionsSearchAsync)
}

export function* updateReviewItemsStart(payload) {
  yield take(ReviewActionTypes.UPDATE_REVIEW_ITEMS, payload)
}

export function* fetchReviewMetadataStart() {
  yield takeLatest(ReviewActionTypes.FETCH_REVIEW_METADATA_START, fetchMetadataAsync)
}
// Reviewer Data
export function* fetchReviewerDataStart() {
  yield takeLatest(ReviewActionTypes.FETCH_REVIEWER_DATA_START, fetchReviewerdataAsync)
}
// Monitor Data
export function* fetchMonitordataStart() {
  yield takeLatest(ReviewActionTypes.FETCH_MONITOR_DATA_START, fetchMonitordataAsync)
}

export function* updateReviewNotificationMessage(payload) {
  yield take(ReviewActionTypes.UPDATE_REVIEW_NOTIFICATION_MESSAGE, payload)
}

export function* signOffItems() {
  yield takeLatest(ReviewActionTypes.SIGN_OFF_ITEMS, signOffItemsAsync)
}

export function* fetchReviewSortStart() {
  yield takeLatest(ReviewActionTypes.FETCH_REVIEW_SORT_START, fetchSortCollectionsAsync)
}

// Reviewer sort
export function* fetchReviewerSortStart() {
  yield takeLatest(ReviewActionTypes.FETCH_REVIEWER_SORT_START, fetchReviewerSortCollectionsAsync)
}

// Monitor sort
export function* fetchMonitorSortStart() {
  yield takeLatest(ReviewActionTypes.FETCH_MONITOR_SORT_START, fetchMonitorSortCollectionsAsync)
}

export function* fetchGroupByReviewerSearchStart() {
  yield debounce(
    1000,
    ReviewActionTypes.FETCH_GROUP_BY_REVIEWER_SEARCH_START,
    fetchGroupByReviewerSearchAsync
  )
}
export function* fetchReviewerGroupBySortStart() {
  yield takeLatest(
    ReviewActionTypes.FETCH_REVIEWER__GROUPBY_SORT_START,
    fetchReviewerGroupBySortStartCollectionAsync
  )
}

export function* fetchReviewGroupByStart() {
  yield takeLatest(ReviewActionTypes.FETCH_REVIEW_GROUPBY_START, fetchGroupByCollectionsAsync)
}
// Running all Saga Watchers
export default function* reviewSagas() {
  yield all([
    call(signOffItems),
    call(fetchReviewItemsStart),
    call(updateReviewItemsStart),
    call(updateReviewNotificationMessage),
    call(fetchReviewMetadataStart),
    call(fetchReviewerDataStart),
    call(fetchMonitordataStart),
    call(fetchReviewSearchStart),
    call(fetchReviewFilterStart),
    call(fetchReviewSortStart),
    call(fetchReviewerSortStart),
    call(fetchMonitorSortStart),
    call(fetchGroupByReviewerSearchStart),
    call(fetchReviewGroupByStart),
    call(fetchReviewerGroupBySortStart)
  ])
}
