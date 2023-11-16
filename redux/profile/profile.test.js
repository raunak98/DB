import reducers from './profile.reducer'

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
      profile: {
        profile: { firstName: null, lastName: null, userId: null },
        isFetching: true,
        profileDetails: null
      }
    },
    {
      type: 'FETCH_PROFILE_SUCCESS',
      payload: {
        FirstName: 'Catalin',
        LastName: 'Badinescu',
        userId: '800224aa-325f-49e6-b0cb-cb9a5d1de0be'
      }
    }
  )
  expect(state).toEqual({
    dashboard: {
      dashboardItems: [],
      errorMessage: [],
      isFetching: false
    },
    isFetching: false,
    profile: {
      firstName: 'Catalin',
      lastName: 'Badinescu',
      userId: '800224aa-325f-49e6-b0cb-cb9a5d1de0be'
    },
    // profileDetails: {},
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
