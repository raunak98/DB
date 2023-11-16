import reducers from './reviews.reducer'

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
      reviews: {
        reviewsItems: {
          results: [
            {
              status: 'in-progress',
              campaignId: '710138ad-92fc-403d-adb6-d5e223b9d7d2',
              startDate: '2022-02-17T05:26:35+00:00',
              deadline: '2022-07-28T05:26:35+00:00',
              campaignName: 'DBTest2',
              totals: { 'in-progress': 8, total: 12 },
              progress: 0.3333333333333333
            },
            {
              status: 'in-progress',
              campaignId: '46d7b5ed-f1e5-4a2b-8ff7-b510c466cd44',
              startDate: '2022-02-16T12:09:25+00:00',
              deadline: '2022-06-29T12:09:25+00:00',
              campaignName: 'TEST1',
              totals: { 'in-progress': 11, total: 11 },
              progress: 0
            },
            {
              status: 'expiring',
              campaignId: '064c4988-2a14-4322-8484-a93c5dbadd37',
              startDate: '2022-02-16T11:22:15+00:00',
              deadline: '2022-02-18T11:22:15+00:00',
              campaignName: 'AnnualRevocationEntitlement',
              totals: { 'in-progress': 5, total: 6 },
              progress: 0.16666666666666666
            },
            {
              status: 'expiring',
              campaignId: '84e227a3-8d28-4dda-9723-010ef346534b',
              startDate: '2022-02-16T11:27:10+00:00',
              deadline: '2022-02-18T11:27:10+00:00',
              campaignName: 'RevocationEntitlement',
              totals: { 'in-progress': 3, total: 6 },
              progress: 0.5
            },
            {
              status: 'expiring',
              campaignId: 'fcb829cb-9211-4741-9fc5-4bed2ba38b81',
              startDate: '2022-02-16T11:36:00+00:00',
              deadline: '2022-02-18T11:36:00+00:00',
              campaignName: 'Entitlement ',
              totals: { 'in-progress': 4, total: 6 },
              progress: 0.3333333333333333
            }
          ]
        },
        metadata: {
          paginationSizes: [10, 25, 50, 100],
          initialSortColumnId: 'applicationName',
          columns: [
            {
              id: 'name',
              type: 'text',
              header: { type: 'text', text: 'name' },
              initialDisplay: true,
              order: 1
            },
            {
              id: 'startDate',
              type: 'text',
              header: { type: 'text', text: 'start Date' },
              initialDisplay: true,
              order: 2
            },
            {
              id: 'dueDate',
              type: 'text',
              header: { type: 'text', text: 'due Date' },
              initialDisplay: true,
              order: 3
            },
            {
              id: 'completion',
              type: 'text',
              header: { type: 'text', text: 'completion' },
              initialDisplay: true,
              order: 4
            },
            {
              id: 'redirect',
              type: 'redirectButton',
              header: { type: 'text', text: '' },
              initialDisplay: true,
              order: 100,
              properties: { text: 'open', fieldForPath: 'id', redirectProps: ['id', 'name'] }
            }
          ]
        },
        isFetching: false,
        errorMessages: []
      },
      review: {
        reviewItems: [],
        isFetching: true,
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
    { type: 'FETCH_REVIEW_ITEMS_START', payload: '710138ad-92fc-403d-adb6-d5e223b9d7d2' }
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
    reviews: {
      reviewsItems: {
        results: [
          {
            status: 'in-progress',
            campaignId: '710138ad-92fc-403d-adb6-d5e223b9d7d2',
            startDate: '2022-02-17T05:26:35+00:00',
            deadline: '2022-07-28T05:26:35+00:00',
            campaignName: 'DBTest2',
            totals: { 'in-progress': 8, total: 12 },
            progress: 0.3333333333333333
          },
          {
            status: 'in-progress',
            campaignId: '46d7b5ed-f1e5-4a2b-8ff7-b510c466cd44',
            startDate: '2022-02-16T12:09:25+00:00',
            deadline: '2022-06-29T12:09:25+00:00',
            campaignName: 'TEST1',
            totals: { 'in-progress': 11, total: 11 },
            progress: 0
          },
          {
            status: 'expiring',
            campaignId: '064c4988-2a14-4322-8484-a93c5dbadd37',
            startDate: '2022-02-16T11:22:15+00:00',
            deadline: '2022-02-18T11:22:15+00:00',
            campaignName: 'AnnualRevocationEntitlement',
            totals: { 'in-progress': 5, total: 6 },
            progress: 0.16666666666666666
          },
          {
            status: 'expiring',
            campaignId: '84e227a3-8d28-4dda-9723-010ef346534b',
            startDate: '2022-02-16T11:27:10+00:00',
            deadline: '2022-02-18T11:27:10+00:00',
            campaignName: 'RevocationEntitlement',
            totals: { 'in-progress': 3, total: 6 },
            progress: 0.5
          },
          {
            status: 'expiring',
            campaignId: 'fcb829cb-9211-4741-9fc5-4bed2ba38b81',
            startDate: '2022-02-16T11:36:00+00:00',
            deadline: '2022-02-18T11:36:00+00:00',
            campaignName: 'Entitlement ',
            totals: { 'in-progress': 4, total: 6 },
            progress: 0.3333333333333333
          }
        ]
      },
      metadata: {
        paginationSizes: [10, 25, 50, 100],
        initialSortColumnId: 'applicationName',
        columns: [
          {
            id: 'name',
            type: 'text',
            header: { type: 'text', text: 'name' },
            initialDisplay: true,
            order: 1
          },
          {
            id: 'startDate',
            type: 'text',
            header: { type: 'text', text: 'start Date' },
            initialDisplay: true,
            order: 2
          },
          {
            id: 'dueDate',
            type: 'text',
            header: { type: 'text', text: 'due Date' },
            initialDisplay: true,
            order: 3
          },
          {
            id: 'completion',
            type: 'text',
            header: { type: 'text', text: 'completion' },
            initialDisplay: true,
            order: 4
          },
          {
            id: 'redirect',
            type: 'redirectButton',
            header: { type: 'text', text: '' },
            initialDisplay: true,
            order: 100,
            properties: { text: 'open', fieldForPath: 'id', redirectProps: ['id', 'name'] }
          }
        ]
      },
      isFetching: false,
      errorMessages: []
    },
    review: {
      reviewItems: [],
      isFetching: true,
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
