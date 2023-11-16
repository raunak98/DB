import React, { createContext, useEffect, useState } from 'react'
import { fetchReviewItems } from '../services/myTasks/review'

export const ReviewContextData = createContext(null)

// Context APi will be replaced with Redux
const reviewContext = ({ reviewId, children }) => {
  const [reviewContextState, setReviewContextState] = useState()

  const [showMessage, setShowMessage] = useState({
    show: false,
    items: null
  })

  useEffect(async () => {
    const reviewItems = await fetchReviewItems(reviewId)

    reviewItems.forEach((e) => {
      e.action = null
      e.confirmedDecision = false
    })

    setReviewContextState([...reviewItems])
  }, [])

  return (
    <ReviewContextData.Provider
      value={{
        reviewContextState,
        setReviewContextState,
        showMessage,
        setShowMessage
      }}
    >
      {children}
    </ReviewContextData.Provider>
  )
}

export default reviewContext
