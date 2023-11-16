import ReviewActionTypes from './reviewAction.types'

const INITIAL_STATE = {
  reviewActionItems: {},
  errorMessages: []
}

const reviewActionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ReviewActionTypes.STORE_REVIEW_ACTION_ITEMS:
      return {
        ...state,
        reviewActionItems: action.payload
      }
    default:
      return state
  }
}

export default reviewActionReducer
