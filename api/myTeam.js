import axios from '../axios'
import { capitalizeFirstLetter } from '../helpers/strings'

const constructResponseData = (response, total) => {
  const normalizedData = []
  response?.data?.hits?.hits.forEach((e) => {
    /* eslint no-underscore-dangle: 0 */
    normalizedData.push({
      total,
      id: e?._source?.id,
      firstName: e?._source?.givenName,
      lastName: e?._source?.sn,
      accountStatus: capitalizeFirstLetter(e?._source?.accountStatus),
      myTeamAccountStatus: capitalizeFirstLetter(e?._source?.accountStatus),
      email: e?._source?.mail,
      employeeType: '',
      personalId: e?._source?.id,
      department: e?._source?.identityUbrCode ? e?._source?.identityUbrCode : '',
      lineManager: e?._source?.identityManagerEmail ? e?._source?.identityManagerEmail : '',
      cbiso: e?._source?.identityDisoEmail ? e?._source?.identityDisoEmail : '',
      city: e._source.city,
      country: e?._source?.identityLocationCountry ? e?._source?.identityLocationCountry : '',
      username: e._source.givenName,
      costCenter: '',
      hireDate: '',
      terminationDate: e?._source?.identityHrTerminationDate
        ? e?._source?.identityHrTerminationDate
        : '',
      createAccessDate: '',
      revokeAccessDate: e?._source?.identityRevokeAccessTimestamp
        ? e?._source?.identityRevokeAccessTimestamp
        : '',
      personalNumber: e?._source?.identityHrId ? e?._source?.identityHrId : ''
    })
  })
  return normalizedData
}

// This API call required for future development and debugging
// export const getMyTeamMeta = async () => {
//   const response = await axios({
//     url: '/api/metadata/myTeamTable',
//     baseURL: 'http://localhost:8081'
//   })
//     .then((res) => res.data)
//     .catch((error) => console.error(error))
//   return response
// }
export const getMyTeamMeta = async () => {
  const response = await axios({
    url: '/v0/configuration/metaType=myTeamTable'
  }).then((res) => res.data)
  return response
}
export const getMyTeamsData = async (payload) => {
  const response = await axios({
    url: '/v0/users/myTeams',
    method: 'post',
    data: payload
  }).then((res) => {
    let normalizedData = []
    const total = res?.data?.hits?.total?.value ? res.data.hits.total.value : 0
    normalizedData = constructResponseData(res, total)

    return normalizedData
  })
  return response
}

export const searchMyTeamsData = async (payload) => {
  const response = await axios({
    url: '/v0/myTeams/search',
    method: 'post',
    data: payload
  }).then((res) => {
    let normalizedData = []
    const total = res?.data?.hits?.total?.value ? res.data.hits.total.value : 0
    normalizedData = constructResponseData(res, total)
    return normalizedData
  })
  return response
}

export const sortMyTeamsData = async (payload) => {
  const response = await axios({
    url: '/v0/myTeams/sort',
    method: 'post',
    data: payload
  }).then((res) => {
    let normalizedData = []
    const total = res?.data?.hits?.total?.value ? res.data.hits.total.value : 0
    normalizedData = constructResponseData(res, total)
    return normalizedData
  })
  return response
}

export const getDisoResponse = async (payload) => {
  const resp = await axios({
    url: `/v0/home/getUserDetails`,
    method: 'post',
    data: payload
  })
    .then((response) => {
      const normalizedData = []
      const total = response?.data?.total?.value ? response?.data?.total?.value : 0
      /* eslint no-underscore-dangle: 0 */
      normalizedData.push({
        total,
        id: response?.data?._id,
        firstName: response?.data?.givenName,
        lastName: response?.data?.sn,
        accountStatus: capitalizeFirstLetter(response?.data?.accountStatus),
        myTeamAccountStatus: capitalizeFirstLetter(response?.data?.accountStatus),
        email: response?.data?.mail,
        employeeType: '',
        personalId: response?.data?._id,
        department: response?.data?.identityUbrCode ? response?.data?.identityUbrCode : '',
        lineManager: response?.data?.identityManagerEmail
          ? response?.data?.identityManagerEmail
          : '',
        cbiso: response?.data?.identityDisoEmail ? response?.data?.identityDisoEmail : '',
        country: response?.data?.identityLocationCountry
          ? response?.data?.identityLocationCountry
          : '',
        username: response?.data?.givenName,
        costCenter: response?.data?.identityCostCenterId
          ? response?.data?.identityCostCenterId
          : '',
        terminationDate: response?.data?.identityHrTerminationDate
          ? response?.data?.identityHrTerminationDate
          : '',
        revokeAccessDate: response?.data?.identityRevokeAccessTimestamp
          ? response?.data?.identityRevokeAccessTimestamp
          : '',
        personalNumber: response?.data?.identityHrId ? response?.data?.identityHrId : ''
      })
      return normalizedData
    })
    .catch((err) => console.error(err))
  return resp
}
