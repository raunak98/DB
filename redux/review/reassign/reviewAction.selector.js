import { createSelector } from '@reduxjs/toolkit'

const selectReviewAction = (state) => state.reviewAction

export const selectReassignItems = createSelector(
  [selectReviewAction],
  (items) => items.reviewActionItems
)
