import { takeLatest, call, put, all } from 'redux-saga/effects'
import {
  fetchDashboardItemsSuccess,
  fetchDashboardItemsFailure,
  fetchAccountTypeItemsSuccess,
  fetchAccountTypeItemsFailure
} from './dashboard.action'
import DashboardActionTypes from './dashboard.types'
import * as dashboardApi from '../../api/dashboard'
import * as accountApi from '../../api/accountManagement'

export function* fetchCollectionsAsync() {
  try {
    const data = yield call(dashboardApi.get)
    yield put(fetchDashboardItemsSuccess(data))
  } catch (error) {
    yield put(fetchDashboardItemsFailure(error.message))
  }
}

export function* fetchAccountTypeCollectionsAsync() {
  try {
    const data = yield call(accountApi.getAccountCategory)
    yield put(fetchAccountTypeItemsSuccess({ accountTypeItems: data }))
  } catch (error) {
    yield put(fetchAccountTypeItemsFailure(error.message))
  }
}

export function* fetchDashboardItemsStart() {
  yield takeLatest(DashboardActionTypes.FETCH_DASHBOARD_ITEMS_START, fetchCollectionsAsync)
}

export function* fetchAccountTypeItemsStart() {
  yield takeLatest(
    DashboardActionTypes.FETCH_ACCOUNT_TYPE_ITEMS_START,
    fetchAccountTypeCollectionsAsync
  )
}

export default function* dashboardSagas() {
  yield all([call(fetchDashboardItemsStart), call(fetchAccountTypeItemsStart)])
}
