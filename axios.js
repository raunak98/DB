import axios from 'axios'
import Cookies from 'js-cookie'

require('dotenv').config()

const baseURL = process.env.REACT_APP_BASE_URL || `https://session-dev1.projectroots-acn.com/`

const instance = axios.create({
  baseURL
})

// We are using the jwt token that is found in the jwtcookie. This cookie is being created by the backend API
// instance.defaults.headers.common['session-jwt'] = Cookies.get('session-jwt')

instance.interceptors.request.use((config) => {
  const configuration = config
  if (process?.env?.REACT_APP_ENV === 'local') {
    configuration.headers.common['session-jwt'] = Cookies.get('session-jwt')
    // configuration.params = { ...configuration.params, timestamp: Date.now() }
  }
  return configuration
})

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error)
    if (error?.response?.status === 401) {
      localStorage.removeItem('requestHistoryId')
      localStorage.removeItem('approvalId')
      localStorage.removeItem('approvalHistoryId')
      localStorage.removeItem('language')
      // Enable this once the backend API is being fixed. Currently, one endpoint is sending status 401 when it fails
      window.location = '/login'
    }
    return error
  }
)

export default instance
