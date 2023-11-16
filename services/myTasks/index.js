// import { fetchAPI, requestMethods } from 'services/helpers'

export const fetchMyTasks = async () => {
  // const response = await fetchAPI('', requestMethods.GET)

  const response = [{ id: 'approvals' }, { id: 'reviews' }]

  if (response) {
    return response
  }

  console.log('Unable to fetch my tasks')
  return []
}
