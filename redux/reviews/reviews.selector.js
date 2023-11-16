import { createSelector } from '@reduxjs/toolkit'

const selectReviews = (state) => state.reviews

export const selectReviewsItems = createSelector([selectReviews], (items) => items.reviewsItems)

export const selectReviewsMetadata = createSelector([selectReviews], (items) => items.metadata)

export const isReviewsFetching = createSelector([selectReviews], (items) => items.isFetching)

export const selectSortData = createSelector([selectReviews], (items) => items.sortData)

export const selectErrorMessages = createSelector([selectReviews], (items) => items.errorMessages)

export const selectReviewsPageNumber = createSelector([selectReviews], (items) => items.pageNumber)

export const selectReviewsPageSize = createSelector([selectReviews], (items) => items.pageSize)
