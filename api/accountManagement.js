import axios from '../axios'

export const getMeta = async () => {
  const response = await axios({
    url: '/api/metadata/accountManagement',
    baseURL: 'http://localhost:8081'
  }).then((res) => res.data)
  return response
}
// API UPDATE : v0/config/getMetadata?metaType=Account_Management
// export const getMeta = async () => {
//   const response = await axios(`/v0/configuration/metaType=accountManagement`).then(
//     (res) => res.data
//   )

//   return response
// }

export const getCreateAdGroupMeta = async () => {
  // TODO : This metadata is FROM Table : Arvind
  const response = await axios(`/v0/config/getMetadata?metaType=Create_Ad_Group`).then(
    (res) => res.data
  )
  return response
}

// export const getCreateADAccount = async () => {
//   const response = await axios(`/v0/config/getMetadata?metaType=Create_Ad_Account`).then(
//     (res) => res.data
//   )
//   return response
// }
export const getCreateADAccount = async () => {
  const response = await axios({
    url: '/api/metadata/createADAccount',

    baseURL: 'http://localhost:8081'
  }).then((res) => res.data)

  return response
}

export const getModifyADAccount = async () => {
  // TODO : This metadata is FROM Table : Arvind
  const response = await axios(`/v0/config/getMetadata?metaType=Modify_Ad_Account`).then(
    (res) => res.data
  )
  return response
}

// export const getAccountCategories = async () => {
//   const response = await axios(`/v0/config/getMetadata?metaType=Create_Ad_Options`).then(
//     (res) => res.data
//   )
//   return response.accountCategory
// }
export const getAccountCategories = async () => {
  const response = await axios({
    url: '/api/metadata/accountCategory/',

    baseURL: 'http://localhost:8081'
  }).then((res) => res.data)

  // return response.accountCategory

  return response
}

export const validateSAMAccount = async (url, payload) => {
  const response = await axios({
    url,
    method: 'post',
    data: payload
  }).then((res) => res.data)

  return response
}

export const getPrimaryAccountDetails = async (url, payload) => {
  const response = await axios({
    url,
    method: 'post',
    data: payload
  }).then((res) => res.data)

  return response
}

export const getOptionsById = async (url, payload) => {
  const response = await axios({
    url,
    method: 'get',
    params: payload
  }).then((res) => res.data)
  return response
}

export const submitAdAccount = async (payload) => {
  const response = await axios({
    url: '/v0/governance/createAccount',
    data: payload,
    method: 'post'
  })
    .then((res) => res)
    .catch((error) => error)

  return response
}

export const getDN = async (adGroupUrl) => {
  const response = await axios({
    url: adGroupUrl,
    method: 'get'
  })
    .then((res) => res.data)
    .catch((err) => console.error(err))

  return response
}

// validate Bulk Create Account Request
export const validateBulkRequest = async (payload) => {
  const response = await axios({
    url: '/v0/account/create/bulkValidation',
    data: payload,
    method: 'post'
  })
    .then((res) => res)
    .catch((error) => error)

  return response
}

export const getAccountCategory = async (payload) => {
  const response = await axios({
    url: '/v0/accounts/getAccountType',
    data: payload,
    method: 'get'
  }).then((res) => res.data)

  return response
}

export const deleteAdAccount = async (payload) => {
  const response = await axios({
    url: '/v0/governance/deleteAccount',
    data: payload,
    method: 'post'
  }).then((res) => res)
  return response
}

export const modifyAdAccount = async (payload) => {
  const response = await axios({
    url: '/v0/governance/modifyAccount',
    data: payload,
    method: 'post'
  })
    .then((res) => res)
    .catch((error) => error)

  return response
}

export const getApproverInformation = async (appName, category, operation) => {
  const encodedCategory = encodeURIComponent(category)
  const url = `/v0/governance/getApprovalDetails?appName=${appName}&category=${encodedCategory}&operation=${operation}`
  const response = await axios({
    url,
    method: 'get'
  }).then((res) => res.data)

  return response
}

export const getApproverInformationForAmend = async (
  appName,
  operation,
  samAccountName,
  employeeType
) => {
  const url = `/v0/governance/getApprovalDetails?appName=${appName}&operation=${operation}&samAccountName=${samAccountName}&employeeType=${employeeType}`
  const response = await axios({
    url,
    method: 'get'
  }).then((res) => res.data)

  return response
}

export const validateUniqueRequest = async (payload) => {
  const response = await axios({
    url: '/v0/governance/checkRequest',
    method: 'post',
    data: payload
  })
    .then((res) => res.data)
    .catch((err) => console.error(err))

  return response
}

export const getITAOandITAODelegate = async (narId) => {
  const response = await axios({
    url: `/v0/application/getITAODelegate?narId=${narId}&exactMatch=false`,
    method: 'get'
  })
    .then((res) => res.data)
    .catch((err) => console.error(err))

  return response
}
export const getDisoResponse = async (email) => {
  const response = await axios({
    url: `/v0/home/getUserDetails?mail=${email}`,
    method: 'get'
  })
    .then((res) => res.data)
    .catch((err) => console.error(err))
  return response
}

// ADD OR REMOVE GROUPS - Group Membership

// export const getserverMembershipMeta = async () => {
//   const response = await axios({
//     url: '/api/membership/serverMembershipMeta',
//     baseURL: 'http://localhost:8081'
//   }).then((res) => res.data)
//   console.log('response meta', response)
//   return response
// }
export const getserverMembershipMeta = async () => {
  // TODO : This metadata is FROM Table : Arvind
  const response = await axios(`/v0/config/getMetadata?metaType=server_Membership`).then(
    (res) => res.data
  )

  return response
}

export const getGroupMembershipMeta = async () => {
  // TODO : This metadata is FROM Table : Arvind
  const response = await axios(`/v0/config/getMetadata?metaType=Group_Membership`).then(
    (res) => res.data
  )

  return response
}

export const getAddOrRemoveGroup = async () => {
  const response = await axios({
    url: '/api/metadata/addOrRemoveMeta',
    baseURL: 'http://localhost:8081'
  }).then((res) => res.data)
  return response
}

export const getAddOrRemoveGroupResult = async () =>
  axios({
    url: '/api/addOrRemoveRes',
    baseURL: 'http://localhost:8081'
  }).then((res) => {
    const response = []
    res.data.hits.hits.forEach((item) => {
      /* eslint no-underscore-dangle: 0 */
      response.push({
        id: item?._source?.id ? item?._source?.id : '',
        groupName: item?._source?.igaContent?.displayName
          ? item?._source?.igaContent?.displayName
          : '',
        approvers: item?._source?.igaContent?.dbagIMSApprovers
          ? item?._source?.igaContent?.dbagIMSApprovers
          : '',
        groupCategory: item?._source?.igaContent?.object?.objectCategory
          ? item?._source?.igaContent?.object?.objectCategory
          : '',
        expirationDate: '',
        dbagComplianceStatus: item?._source?.igaContent?.dbagComplianceStatus
          ? item?._source?.igaContent?.dbagComplianceStatus
          : '',
        accessioAppRequest: item?._source?.objGlossary?.accessioAppRequest
          ? item?._source?.objGlossary?.accessioAppRequest
          : '',
        checked: false
      })
    })

    return response
  })

export const setGroupMembershipRecord = async (payload) => {
  const result = payload

  return result
    ? [
        {
          id: 'requestType',
          value: result?.requestMembershipType ? result?.requestMembershipType?.split(' ')[0] : ''
        },
        {
          id: 'accountType',
          value: result?.accountDN ? result?.accountDN : ''
        },
        {
          id: 'accountTable',
          value: []
        },
        {
          id: 'groupType',
          value: result?.groupDN ? result?.groupDN : ''
        },
        {
          id: 'groupTable',
          value: []
        },
        {
          id: 'businessJustification',
          value: result?.detailedInfo !== '' ? result?.detailedInfo : ''
        },
        {
          id: 'memberServerDN',
          value: result?.memberServerDN !== '' ? result?.memberServerDN : ''
        }
      ]
    : []
}

// TODO : This API is for searchAccounts & searchGroups in AddOrRmove membership
export const getOptions = async (url, payload) => {
  const response = await axios({
    url,
    method: 'post',
    data: payload
  }).then((res) => res.data)
  return response
}

// TODO : Need to delete this API if not required
export const getGroupMembershipByName = async (payload) =>
  axios({
    url: '/v0/governance/groupDetails',
    method: 'post',
    data: payload
  })
    .then((res) => {
      const response = []
      res.data.hits.hits.forEach((item) => {
        /* eslint no-underscore-dangle: 0 */
        response.push({
          id: item._source.id,
          groupName: item._source.igaContent.displayName,
          approvers: '',
          groupCategory: item?._source?.igaContent?.object?.objectCategory
        })
      })
      console.log('response', response)
      return response
    })
    .catch((err) => console.error(err))

export const addMemberShip = async (payload) =>
  axios({
    url: '/v0/governance/requests/entitlementGrant',
    method: 'post',
    data: payload
  })
    .then((res) => res)
    .catch((err) => err)

export const getTableById = (apiUrl) => {
  const response = axios({
    url: apiUrl,
    baseURL: 'http://localhost:8081'
  }).then((res) => res.data)
  return response
}

export const getAccountTable = () => {
  const response = axios({
    url: '/api/membership/accountTable',
    baseURL: 'http://localhost:8081'
  }).then((res) => res.data)
  return response
}

export const getGroupTable = () => {
  const response = axios({
    url: '/api/membership/groupTable',
    baseURL: 'http://localhost:8081'
  }).then((res) => res.data)
  return response
}

export const setServerMembershipRecord = async (payload) => {
  const result = payload

  return result
    ? [
        {
          id: 'requestType',
          value: result?.requestMembershipType ? result?.requestMembershipType?.split(' ')[0] : ''
        },
        {
          id: 'serverType',
          value: result?.serverDN ? result?.serverDN : ''
        },
        {
          id: 'serverTable',
          value: []
        },
        {
          id: 'groupTypeForServer',
          value: result?.groupDN ? result?.groupDN : ''
        },
        {
          id: 'groupTable',
          value: []
        },
        {
          id: 'businessJustification',
          value: result?.detailedInfo !== '' ? result?.detailedInfo : ''
        },
        {
          id: 'memberServerDN',
          value: result?.memberServerDN !== '' ? result?.memberServerDN : ''
        }
      ]
    : []
}
