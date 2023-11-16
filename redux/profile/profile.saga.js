import { takeLatest, call, put, all } from 'redux-saga/effects'
import { fetchProfileSuccess, fetchProfileFailure } from './profile.action'
import ProfileActionTypes from './profile.types'
import * as profileApi from '../../api/profile'

export function* fetchProfileAsync() {
  try {
    const userProfile = yield call(profileApi.get)
    const userId = yield call(profileApi.getUserInfo)
    yield put(fetchProfileSuccess({ ...userProfile, userId: userId.id }))
  } catch (error) {
    yield put(fetchProfileFailure(error.message))
  }
}

export function* fetchProfileStart() {
  yield takeLatest(ProfileActionTypes.FETCH_PROFILE_START, fetchProfileAsync)
}

export default function* profileSagas() {
  yield all([call(fetchProfileStart)])
}
