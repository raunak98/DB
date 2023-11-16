import { reviewMetaData, reviewItems, reviewItemsFilters, reviewItemsGroups } from './reviewData'

export const fetchReviewMetaData = async () => {
  // const response = await fetchAPI('', requestMethods.GET)
  const response = reviewMetaData

  if (response) {
    return response
  }

  console.log('Unable to fetch review meta data')
  return []
}

export const fetchReviewItems = async (/* reviewId */) => {
  // const response = await fetchAPI('', requestMethods.GET)
  const response = reviewItems

  if (response) {
    return response
  }

  console.log('Unable to fetch review items')
  return []
}

export const getReviewItemsFilters = () => reviewItemsFilters

export const getReviewItemsGroups = () => reviewItemsGroups
