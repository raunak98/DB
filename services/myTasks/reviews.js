import { reviewsMetaData, reviews } from './reviewsData'

export const fetchReviewsMetaData = async () => {
  // const response = await fetchAPI('', requestMethods.GET)
  const response = reviewsMetaData

  if (response) {
    return response
  }

  console.log('Unable to fetch reviews meta data')
  return []
}

export const fetchReviews = async () => {
  // const response = await fetchAPI('', requestMethods.GET)
  const response = reviews

  if (response) {
    return response
  }

  console.log('Unable to fetch reviews')
  return []
}
