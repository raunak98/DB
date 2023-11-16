import reducers from './review.reducer'

test('reducers', () => {
  const state = reducers(
    {
      dashboard: {
        dashboardItems: [
          { id: 'violations', count: '3', redirectTo: '/tasks/violations' },
          { id: 'approvals', count: '2', redirectTo: '/tasks/approvals' },
          { id: 'reviews', count: '5', redirectTo: '/tasks/reviews' },
          { id: 'totalCompletedItems', count: '31' }
        ],
        isFetching: false,
        errorMessage: []
      },
      reviews: { reviewsItems: null, metadata: null, isFetching: true, errorMessages: [] },
      review: {
        reviewItems: [],
        isFetching: false,
        notification: { type: 'info', message: null },
        metadata: null
      },
      reviewAction: { reviewActionItems: {}, errorMessages: [] },
      profile: {
        profile: {
          firstName: 'Catalin',
          lastName: 'Badinescu',
          userId: '800224aa-325f-49e6-b0cb-cb9a5d1de0be'
        },
        isFetching: false
      }
    },
    { type: 'FETCH_REVIEWS_ITEMS_START' }
  )
  expect(state).toEqual({
    dashboard: {
      dashboardItems: [
        { id: 'violations', count: '3', redirectTo: '/tasks/violations' },
        { id: 'approvals', count: '2', redirectTo: '/tasks/approvals' },
        { id: 'reviews', count: '5', redirectTo: '/tasks/reviews' },
        { id: 'totalCompletedItems', count: '31' }
      ],
      isFetching: false,
      errorMessage: []
    },
    reviews: { reviewsItems: null, metadata: null, isFetching: true, errorMessages: [] },
    review: {
      reviewItems: [],
      isFetching: false,
      notification: { type: 'info', message: null },
      metadata: null
    },
    reviewAction: { reviewActionItems: {}, errorMessages: [] },
    profile: {
      profile: {
        firstName: 'Catalin',
        lastName: 'Badinescu',
        userId: '800224aa-325f-49e6-b0cb-cb9a5d1de0be'
      },
      isFetching: false
    }
  })
})
