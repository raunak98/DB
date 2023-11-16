// import { fetchAPI, requestMethods } from './helpers'
import permissions from './permissions.json'
import axios from '../axios'

export const fetchUITemplate = async () => {
  //  let response = await fetchAPI(
  //   // 'https://api1.portaldev.projectroots-acn.com:8443/v1/configuration/uitemplate',
  //   'http://api1.portaldev.projectroots-acn.com:8080/v1/configuration/uitemplate',
  //   requestMethods.GET
  // )

  const response = await axios({
    url: '/v0/configuration/metaType=permissions'
  }).then((res) => res.data)

  const fallBackResponse = permissions

  if (response && response?.modules) {
    return response?.modules
  }
  return fallBackResponse?.modules ? fallBackResponse?.modules : []
}
