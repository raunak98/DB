import ReviewActionTypes from './reviewAction.types'

export const storeReviewActionItems = (payload) => ({
  type: ReviewActionTypes.STORE_REVIEW_ACTION_ITEMS,
  payload
})
