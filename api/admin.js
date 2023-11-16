import axios from '../axios'
import {
  formattedDate,
  convertMailtoName,
  getDate,
  seperateWordsWithCapitalLetter,
  capitalizeFirstLetter
} from '../helpers/strings'

const iff = (consition, then, otherise) => (consition ? then : otherise)

const getRequestType = (requestType) => {
  switch (requestType) {
    case 'createResource':
      return 'CREATE GROUP'
    case 'modifyResource':
      return 'MODIFY GROUP'
    case 'deleteResource':
      return 'DELETE GROUP'
    default:
      return requestType ? seperateWordsWithCapitalLetter(capitalizeFirstLetter(requestType)) : ''
  }
}

export const getStatus = (status, outcome) => {
  if (status && outcome && status === 'complete' && outcome === 'cancelled') {
    return 'cancelled'
  }
  if (status && status === 'complete') {
    return 'completed'
  }
  if (status) {
    return status
  }
  return ''
}

// Remove below code when everything works
// export const getMetadata = () =>
//   axios({ url: `/metadata/adminMeta`, baseURL: 'http://localhost:8081/api' }).then(
//     (response) => response.data
//   )

export const getMetadata = () => {
  const response = axios(`/v0/configuration/metaType=adminMeta`)
    .then((res) => res.data)
    .catch((error) => {
      console.error(error)
      return { status: 500, statusText: 'Error', message: 'API Error' }
    })

  return response
}

const constructResponse = (res) => {
  const result = {}
  result.total = res?.data?.hits?.total?.value
  const assetsData = []
  res?.data?.hits?.hits?.forEach((item) => {
    /* eslint no-underscore-dangle: 0 */
    const sAMAccountName = item?._source?.igaContent?.sAMAccountName
      ? item?._source?.igaContent?.sAMAccountName
      : ''
    let status = ''
    if (
      ['512', '66048', '4096', 512, 66048, 4096].includes(
        item?._source?.igaContent?.userAccountControl
      )
    ) {
      status = 'Enabled'
    } else if (
      ['514', '66050', '4098', 514, 66050, 4098].includes(
        item?._source?.igaContent?.userAccountControl
      )
    ) {
      status = 'Disabled'
    }
    let accountCategory = ''

    switch (item?._source?.igaContent?.employeeType) {
      case 'gMSA_Account':
        accountCategory = 'gMSA (Group Managed Service Account)'
        break
      case 'Secnd':
        accountCategory = 'Personal - Additional'
        break
      case 'Admin':
        if (sAMAccountName.endsWith('-a')) {
          accountCategory = 'Personal - Admin'
        } else if (sAMAccountName.endsWith('-caa')) {
          accountCategory = 'CyberArk Named Account (Application)'
        } else {
          accountCategory = 'CyberArk Named Account (Infrastructure)'
        }
        break
      case 'GenB':
        accountCategory = 'CyberArk Role (shared) Account / Technical Generic Brokered'
        break
      case 'DAdmin':
        accountCategory = 'Personal - Desktop Admin'
        break
      case 'DomSpt':
        accountCategory = 'Personal - Domain Support'
        break
      case 'Test':
        accountCategory = 'Technical - Test'
        break
      case 'Svc':
        accountCategory = 'Technical - Service/ Process'
        break
      case 'Gen':
        accountCategory = 'Shared - Generic'
        break
      default:
        accountCategory = ''
    }
    assetsData.push({
      employeeId: item?._source?.igaContent?.employeeID
        ? item?._source?.igaContent?.employeeID
        : '',
      sAMAccountName,
      category: accountCategory,
      expiry: ['0', undefined, ''].includes(item?._source?.igaContent?.accountExpires)
        ? ''
        : item?._source?.igaContent?.accountExpires,
      id: item?._source?.id ? item?._source?.id : '',
      accountStatus: status,
      recipientId: item?._source?.userId?.mail
        ? convertMailtoName(item?._source?.userId?.mail)
        : '',
      recepientMail: item?._source?.userId?.mail ? item?._source?.userId?.mail : '',
      dbagApplicationID: item?._source?.igaContent?.dbagApplicationID
        ? item?._source?.igaContent?.dbagApplicationID
        : '',
      primaryAccount: item?._source?.igaContent?.object?.primaryAccount
        ? item?._source?.igaContent?.object?.primaryAccount
        : '',
      domain: item?._source?.igaContent?.object?.domain
        ? item?._source?.igaContent?.object?.domain
        : '',
      department: item?._source?.igaContent?.dbagCostcenter
        ? item?._source?.igaContent?.dbagCostcenter
        : '',
      description: item?._source?.igaContent?.description
        ? item?._source?.igaContent?.description
        : '',
      recertificationPeriod: item?._source?.igaContent?.object?.recertificationPeriod
        ? item?._source?.igaContent?.object?.recertificationPeriod
        : '',
      l: item?._source?.igaContent?.object?.l ? item?._source?.igaContent?.object?.l : '',
      serviceNowLevel: item?._source?.igaContent?.object?.serviceNowLevel
        ? item?._source?.igaContent?.object?.serviceNowLevel
        : '',
      dbagInfrastructureID: item?._source?.igaContent?.dbagInfrastructureID
        ? item?._source?.igaContent?.dbagInfrastructureID
        : '',
      platformType: item?._source?.igaContent?.object?.platformType
        ? item?._source?.igaContent?.object?.platformType
        : '',
      accountAccessLevel: item?._source?.igaContent?.object?.accountAccessLevel
        ? item?._source?.igaContent?.object?.accountAccessLevel
        : '',
      accountNameSuffix: item?._source?.igaContent?.object?.accountNameSuffix
        ? item?._source?.igaContent?.object?.accountNameSuffix
        : '',
      accountNameMiddle: item?._source?.igaContent?.object?.accountNameMiddle
        ? item?._source?.igaContent?.object?.accountNameMiddle
        : '',
      passwordNeverExpires: item?._source?.igaContent?.object?.passwordNeverExpires
        ? item?._source?.igaContent?.object?.passwordNeverExpires
        : '',
      requester: item?._source?.igaContent?.object?.requestorMail
        ? item?._source?.igaContent?.object?.requestorMail
        : '',
      requestType: item?._source?.igaContent?.object?.requestType
        ? item?._source?.igaContent?.object?.requestType
        : '',
      requestDate: item?._source?.igaContent?.object?.requestDate
        ? formattedDate(item?._source?.igaContent?.object?.requestDate)
        : '',
      accountStatusValidationString: item?._source?.igaContent?.object?.l
        ? item?._source?.igaContent?.object?.comment
        : '',
      recipient: item?._source?.userId?.mail ? item?._source?.userId?.mail : '',
      searchAfterKey: item?.sort ? item?.sort[0] : []
    })
  })
  result.assetsData = assetsData
  console.log('result', result)
  return result
}

export const searchAccounts = async (payload) => {
  const response = await axios({
    url: '/v0/governance/admin/searchAccounts',
    method: 'post',

    data: payload
  })
    .then((res) => constructResponse(res))
    .catch((err) => console.error(err))

  return response
}

export const sortAccounts = async (payload) => {
  const response = await axios({
    url: '/v0/governance/admin/sortAccounts',
    method: 'post',
    data: payload
  })
    .then((res) => constructResponse(res))
    .catch((err) => console.error(err))

  return response
}

const constructGroupResponse = (res, userEmail) => {
  const result = {}
  result.total = res?.data?.hits?.total?.value
  const groupData = []
  res?.data?.hits?.hits?.forEach((item) => {
    let roleTitle = ''
    if (
      item?._source?.igaContent?.dbagIMSApprovers &&
      item?._source?.igaContent?.dbagIMSApprovers.includes(userEmail)
    ) {
      roleTitle = 'Approver'
    } else if (
      (item?._source?.igaContent?.dbagIMSAuthContactDelegate &&
        item?._source?.igaContent?.dbagIMSAuthContactDelegate.includes(userEmail)) ||
      item?._source?.igaContent?.dbagIMSAuthContactDelegate === userEmail
    ) {
      roleTitle = 'Group Authorization Delegate'
    } else if (
      (item?._source?.igaContent?.dbagIMSAuthContact &&
        item?._source?.igaContent?.dbagIMSAuthContact.includes(userEmail)) ||
      item?._source?.igaContent?.dbagIMSAuthContact === userEmail
    ) {
      roleTitle = 'Group Authorization Contact'
    }
    const accessioGroupType = item?._source?.glossary?.kv?.filter(
      (gattrb) => gattrb.key === 'accessioGroupType'
    )[0]?.value
    /* eslint no-underscore-dangle: 0 */
    groupData.push({
      id: item?._source?.id ? item?._source?.id : '',
      cn: item?._source?.igaContent?.displayName ? item?._source?.igaContent?.displayName : '',
      applicationId: item?._source?.igaContent?.dbagApplicationID
        ? item?._source?.igaContent?.dbagApplicationID
        : '',
      accessioGroupType: accessioGroupType || '',
      description: item?._source?.igaContent?.description
        ? item?._source?.igaContent?.description
        : '',
      role: roleTitle,
      groupDetails: item
    })
  })

  result.groupData = groupData
  return result
}

export const sortGroups = async (payload, userEmail) => {
  const response = await axios({
    url: '/v0/governance/admin/sortGroups',
    method: 'post',

    data: payload
  })
    .then((res) => constructGroupResponse(res, userEmail))
    .catch((err) => console.error(err))
  return response
}

export const searchGroups = async (payload, userEmail) => {
  const response = await axios({
    url: '/v0/governance/admin/searchGroups',
    method: 'post',

    data: payload
  })
    .then((res) => constructGroupResponse(res, userEmail))
    .catch((err) => console.error(err))
  return response
}

// APIs for Service Desk Administration
// Table Metadata
export const serviceDeskTableMeta = async () => {
  const response = await axios(`/v0/configuration/metaType=serviceDeskAdmin`).then(
    (res) => res.data
  )
  return response
}

// export const serviceDeskTableMeta = async () => {
//   const response = await axios({
//     url: '/api/metadata/getServiceDeskAdminMeta',
//     baseURL: 'http://localhost:8081'
//   })
//     .then((res) => res.data)
//     .catch((err) => console.error(err))
//   return response
// }

export const serviceDeskTableResults = async (payload) => {
  const response = await axios({
    url: '/v0/admin/requestFilter',
    method: 'post',
    // url: '/api/metadata/getServiceDeskAdminData',
    // baseURL: 'http://localhost:8081',
    data: payload
  })
    // .then((res) => res.data)
    .then((res) => {
      const serviceDeskData = []
      const results = {}
      results.total = res?.data?.hits?.total?.value

      res.data.hits.hits.forEach((item) => {
        const inProgressPhase = item?._source?.decision?.phases
          ? item?._source?.decision?.phases
              .map((act) => (act.status === 'in-progress' ? act.name : null))
              .filter((element) => element !== null)
          : null
        serviceDeskData.push({
          id: item._source.id,
          status: getStatus(item._source?.decision?.status, item._source?.decision?.outcome),
          itAssests: item._source.request?.common?.applicationName
            ? item._source.request?.common?.applicationName
            : '',
          requestType: getRequestType(item?._source?.requestType),
          completionDate: item._source.decision?.completionDate
            ? formattedDate((item._source.decision?.completionDate).split('T')[0])
            : '',
          approvalHisCompletionDate: item._source.decision?.completionDate
            ? formattedDate((item._source.decision?.completionDate).split('T')[0])
            : '',
          requestDate: item?._source?.decision?.startDate
            ? formattedDate(item?._source?.decision?.startDate)
            : '',
          approvalDate:
            item._source.decision?.phases &&
            ![null, 'null'].includes(item._source.decision?.phases[0]?.decision) &&
            item._source.decision?.phases[0]?.completionDate
              ? formattedDate((item._source.decision?.phases[0]?.completionDate).split('T')[0])
              : '',
          expiry: item._source.request?.common?.endDate
            ? formattedDate(item._source.request?.common?.endDate)
            : '',

          comments: item._source.decision?.comments ? item._source.decision?.comments : '',
          requestedItem: item?._source?.request?.common?.accountDetails?.sAMAccountName
            ? item?._source?.request?.common?.accountDetails?.sAMAccountName
            : iff(
                item?._source?.request?.common?.sAMAccountName,
                item?._source?.request?.common?.sAMAccountName,
                item?._source?.request?.common?.groupDetails?.displayName
              ),
          permissions: item._source.decision?.actors?.active[0]?.permissions
            ? item._source.decision?.actors?.active[0]?.permissions
            : '',
          requester: item._source.request?.common?.requestorMail
            ? convertMailtoName(item._source.request?.common?.requestorMail)
            : '',
          recipient: item._source.request?.common?.recepientMail
            ? convertMailtoName(item._source.request?.common?.recepientMail)
            : '',
          requesterMail: item._source.request?.common?.requestorMail
            ? item._source.request?.common?.requestorMail
            : '',
          category: item._source.request?.common?.category
            ? item._source.request?.common?.category
            : '',
          operation: item._source.request?.common?.operation
            ? item._source.request?.common?.operation
            : '',
          requestNumber: item._source.request?.common?.Accessio_Request_No,
          bulkRequestId: item._source.request?.common?.AccessioBulkRequestNumber
            ? item._source.request.common.AccessioBulkRequestNumber
            : '',
          sortKeyword: item?.sort ? item.sort[0] : [],
          recipientMail: item._source.request?.common?.recepientMail
            ? item._source.request?.common?.recepientMail
            : '',
          phase: inProgressPhase && inProgressPhase[0] ? inProgressPhase[0] : '',
          phases: item?._source?.decision?.phases ? item?._source?.decision?.phases : ''
        })
      })
      results.serviceDeskData = serviceDeskData
      return results
    })
    .catch((err) => console.error(err))
  return response
}

export const serviceDeskTableSortResults = async (payload) => {
  const response = await axios({
    url: '/v0/admin/requestFilter/sort',
    method: 'post',
    // url: '/api/metadata/getServiceDeskAdminData',
    // baseURL: 'http://localhost:8081',
    data: payload
  })
    // .then((res) => res.data)
    .then((res) => {
      const serviceDeskData = []
      const results = {}
      results.total = res?.data?.hits?.total?.value

      res.data.hits.hits.forEach((item) => {
        const inProgressPhase = item?._source?.decision?.phases
          ? item?._source?.decision?.phases
              .map((act) => (act.status === 'in-progress' ? act.name : null))
              .filter((element) => element !== null)
          : null
        serviceDeskData.push({
          id: item._source.id,
          status: getStatus(item._source?.decision?.status, item._source?.decision?.outcome),
          itAssests: item._source.request?.common?.applicationName
            ? item._source.request?.common?.applicationName
            : '',
          requestType: getRequestType(item?._source?.requestType),
          completionDate: item._source.decision?.completionDate
            ? formattedDate((item._source.decision?.completionDate).split('T')[0])
            : '',
          approvalHisCompletionDate: item._source.decision?.completionDate
            ? formattedDate((item._source.decision?.completionDate).split('T')[0])
            : '',
          requestDate: getDate(item._source.request?.common?.Accessio_Request_No),
          approvalDate:
            item._source.decision?.phases &&
            ![null, 'null'].includes(item._source.decision?.phases[0]?.decision) &&
            item._source.decision?.phases[0]?.completionDate
              ? formattedDate((item._source.decision?.phases[0]?.completionDate).split('T')[0])
              : '',
          expiry: item._source.request?.common?.endDate
            ? formattedDate(item._source.request?.common?.endDate)
            : '',

          comments: item._source.decision?.comments ? item._source.decision?.comments : '',
          requestedItem: item?._source?.request?.common?.accountDetails?.sAMAccountName
            ? item?._source?.request?.common?.accountDetails?.sAMAccountName
            : iff(
                item?._source?.request?.common?.sAMAccountName,
                item?._source?.request?.common?.sAMAccountName,
                item?._source?.request?.common?.groupDetails?.displayName
              ),
          permissions: item._source.decision?.actors?.active[0]?.permissions
            ? item._source.decision?.actors?.active[0]?.permissions
            : '',
          requester: item._source.request?.common?.requestorMail
            ? convertMailtoName(item._source.request?.common?.requestorMail)
            : '',
          recipient: item._source.request?.common?.recepientMail
            ? convertMailtoName(item._source.request?.common?.recepientMail)
            : '',
          requesterMail: item._source.request?.common?.requestorMail
            ? item._source.request?.common?.requestorMail
            : '',
          category: item._source.request?.common?.category
            ? item._source.request?.common?.category
            : '',
          operation: item._source.request?.common?.operation
            ? item._source.request?.common?.operation
            : '',
          requestNumber: item._source.request?.common?.Accessio_Request_No,
          bulkRequestId: item._source.request?.common?.AccessioBulkRequestNumber
            ? item._source.request.common.AccessioBulkRequestNumber
            : '',
          sortKeyword: item?.sort ? item.sort[0] : [],
          recipientMail: item._source.request?.common?.recepientMail
            ? item._source.request?.common?.recepientMail
            : '',
          phase: inProgressPhase && inProgressPhase[0] ? inProgressPhase[0] : '',
          phases: item?._source?.decision?.phases ? item?._source?.decision?.phases : ''
        })
      })
      results.serviceDeskData = serviceDeskData
      return results
    })
    .catch((err) => console.error(err))
  return response
}
