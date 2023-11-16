import { call, all, take } from 'redux-saga/effects'
import ReviewActionTypes from './reviewAction.types'

export function* storeReviewAction(payload) {
  yield take(ReviewActionTypes.STORE_REVIEW_ACTION_ITEMS, payload)
}

export default function* reviewActionSagas() {
  yield all([call(storeReviewAction)])
}
