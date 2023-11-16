// import { fetchAPI, requestMethods } from 'services/helpers'

export const fetchDashboardActions = async () => {
  /* const response = await fetchAPI(
    'https://hub.dummyapis.com/singlelistwithid?text=Test&noofRecords=3',
    requestMethods.GET
  ) */

  /**
   * As the API is not yet ready we overwrite the object
   */
  const response = {
    actions: [
      { id: 'reviews', count: 9, redirectTo: '/tasks/reviews' },
      { id: 'approvals', count: 35, redirectTo: '/tasks/approvals' },
      { id: 'violations', count: 6, redirectTo: '/tasks/violations' }
    ],
    notification: { show: true, title: 'title', description: 'description', variant: 'info' }
  }

  if (response) {
    return response
  }

  console.log('Unable to fetch dashboard actions')
  return {}
}
