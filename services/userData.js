import { fetchAPI, requestMethods } from './helpers'

const fetchUserData = async (headers, userEmail) => {
  const response = await fetchAPI(
    `http://api1.portaldev.projectroots-acn.com:8080/openidm/managed/user?_queryFilter=mail+eq+"${userEmail}"`,
    requestMethods.GET,
    headers
  )

  if (response) {
    return response
  }

  console.log('Unable to fetch the User Data')
  return {}
}

export default fetchUserData
