import reducers from './dashboard.reducer'

test('reducers', () => {
  const state = reducers(
    {
      dashboard: { dashboardItems: [], isFetching: false, errorMessage: [] },
      reviews: { reviewsItems: null, metadata: null, isFetching: false, errorMessages: [] },
      review: {
        reviewItems: [],
        isFetching: false,
        notification: { type: 'info', message: null },
        metadata: null
      },
      reviewAction: { reviewActionItems: {}, errorMessages: [] },
      profile: { profile: { firstName: null, lastName: null, userId: null }, isFetching: true }
    },
    { type: 'FETCH_DASHBOARD_ITEMS_START' }
  )
  expect(state).toEqual({
    dashboard: {
      dashboardItems: [],
      errorMessage: [],
      isFetching: false
    },
    isFetching: true,
    profile: {
      isFetching: true,
      profile: {
        firstName: null,
        lastName: null,
        userId: null
      }
    },
    review: {
      isFetching: false,
      metadata: null,
      notification: {
        message: null,
        type: 'info'
      },
      reviewItems: []
    },
    reviewAction: {
      errorMessages: [],
      reviewActionItems: {}
    },
    reviews: {
      errorMessages: [],
      isFetching: false,
      metadata: null,
      reviewsItems: null
    }
  })
})
