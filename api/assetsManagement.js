import axios from '../axios'
import {
  formattedDate,
  convertMailtoName,
  seperateWordsWithCapitalLetter,
  capitalizeFirstLetter
} from '../helpers/strings'

import { getExpiryDate, checkKerberosEncryptionType, getRequestItem } from '../helpers/utils'

const iff = (consition, then, otherise) => (consition ? then : otherise)

export const getPersonalModifyMetadata = () =>
  axios({ url: `/metadata/modifyPersonalMetadata`, baseURL: 'http://localhost:8081/api' }).then(
    (response) => response.data
  )

// export const getPersonalModifyMetadata = async () => {
//   const response = await axios(`/v0/configuration/metaType=modifyPersonalMetadata`)
//     .then((res) => res.data)
//     .catch((error) => {
//       console.error(error)
//       return { status: 500, statusText: 'Error', message: 'API Error' }
//     })

//   return response
// }

export const getNonPersonalModifyMetadata = async () => {
  const response = await axios(`/v0/configuration/metaType=modifyNonPersonalMetadata`)
    .then((res) => res.data)
    .catch((error) => {
      console.error(error)
      return { status: 500, statusText: 'Error', message: 'API Error' }
    })

  return response
}

// export const getModifyTabMeta = async () => {
//   const response = await axios(`/v0/configuration/metaType=modifyTab`)
//     .then((res) => res.data)
//     .catch((error) => {
//       console.error(error)
//       return { status: 500, statusText: 'Error', message: 'API Error' }
//     })

//   return response
// }

export const getModifyTabMeta = () =>
  axios({ url: `/metadata/modifyTabMeta`, baseURL: 'http://localhost:8081/api' })
    .then((response) => response.data)
    .catch((error) => {
      console.error(error)
      return { status: 500, statusText: 'Error', message: 'API Error' }
    })

export const getNarIdInfo = async (emailId) => {
  const response = await axios({
    url: `/v0/governance/getNarId?Id=${emailId}`
  })
    .then((res) => res.data)
    .catch((error) => {
      console.error(error)
      return { status: 500, statusText: 'Error', message: 'API Error' }
    })
  return response
}

export const getModifyRequests = async (payload) =>
  axios({
    url: '/v0/account/accountDetails',
    method: 'post',
    data: payload
  }).then((res) => {
    const result = {}
    result.total = res?.data?.hits?.total?.value
    const assetsData = []
    res?.data?.hits?.hits?.forEach((item, index) => {
      /* eslint no-underscore-dangle: 0 */
      const igaContent = item?._source?.igaContent // Setting IgaContent
      const dbagApplicationID =
        item?._source?.igaContent?.dbagApplicationID ||
        item?._source?.igaContent?.object?.dbagApplicationID // For GMSA dbagApplicationID is From IgaContent.object, Other Accounts need to check the response
      let expiry =
        item?._source?.igaContent?.accountExpires &&
        ['0', ''].includes(item?._source?.igaContent?.accountExpires)
          ? ''
          : item?._source?.igaContent?.accountExpires
      expiry = getExpiryDate(expiry)
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
          if (sAMAccountName.includes('_')) {
            accountCategory = 'CyberArk Role (shared) Account'
          } else {
            accountCategory = 'Technical Generic Brokered'
          }
          break
        case 'DAdmin':
          accountCategory = 'Personal - Desktop Admin'
          break
        case 'DomSpt':
        case 'Domspt':
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
        employeeType: item?._source?.igaContent?.employeeType
          ? item?._source?.igaContent?.employeeType
          : '',
        sAMAccountName,
        category: accountCategory,
        expiry,
        id: item?._source?.id ? item?._source?.id : '',
        accountStatus: status,
        recipientId: item?._source?.userId?.mail
          ? convertMailtoName(item?._source?.userId?.mail)
          : '',
        recepientMail: item?._source?.userId?.mail ? item?._source?.userId?.mail : '',
        dbagApplicationID: dbagApplicationID
          ? iff(
              typeof dbagApplicationID !== 'string' && dbagApplicationID.length,
              dbagApplicationID[0],
              dbagApplicationID
            )
          : '',
        dbagCostcenter: item?._source?.igaContent?.dbagCostcenter
          ? iff(
              typeof item?._source?.igaContent?.dbagCostcenter !== 'string' &&
                item?._source?.igaContent?.dbagCostcenter.length,
              item?._source?.igaContent?.dbagCostcenter[0],
              item?._source?.igaContent?.dbagCostcenter
            )
          : '',
        primaryAccount: item?._source?.igaContent?.object?.primaryAccount
          ? item?._source?.igaContent?.object?.primaryAccount
          : '',
        domain: item?._source?.igaContent?.object?.domain
          ? item?._source?.igaContent?.object?.domain
          : '',
        // dbagCostcenter: item?._source?.igaContent?.dbagCostcenter
        //   ? item?._source?.igaContent?.dbagCostcenter
        //   : '',
        department: item?._source?.igaContent?.object?.department
          ? item?._source?.igaContent?.object?.department
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
        accountStatusValidationString: item?._source?.igaContent?.object?.info
          ? item?._source?.igaContent?.object?.info
          : '',
        KerberosEncryptionType: igaContent?.object?.KerberosEncryptionType
          ? checkKerberosEncryptionType(igaContent?.KerberosEncryptionType)
          : '',
        KerberosEncryptionType1: igaContent?.object?.KerberosEncryptionType
          ? [8, '8'].includes(igaContent?.object?.KerberosEncryptionType) === true
          : '',
        KerberosEncryptionType2: igaContent?.object?.KerberosEncryptionType
          ? [16, '16'].includes(igaContent?.object?.KerberosEncryptionType) === true
          : '',

        PrincipalsAllowedToRetrieveManagedPassword: igaContent?.object
          ?.PrincipalsAllowedToRetrieveManagedPassword
          ? igaContent?.object?.PrincipalsAllowedToRetrieveManagedPassword
          : '',
        name: igaContent?.object?.name ? igaContent?.object?.name : '',
        recipient: item?._source?.userId?.mail ? item?._source?.userId?.mail : '',
        searchAfterKey: item?.sort ? item?.sort[0] : [],
        ManagedPasswordIntervalInDays: igaContent?.object?.ManagedPasswordIntervalInDays
          ? igaContent?.object?.ManagedPasswordIntervalInDays
          : '',
        servicePrincipalName: igaContent?.object?.servicePrincipalName
          ? igaContent?.object?.servicePrincipalName
          : '',
        expiryDate: expiry
      })
      if ([24, '24'].includes(igaContent?.object?.KerberosEncryptionType)) {
        assetsData[index].KerberosEncryptionType1 = true
        assetsData[index].KerberosEncryptionType2 = true
      }
    })
    result.assetsData = assetsData
    return result
  })

// export const getAccountCategories = async () => {
//   const response = await axios(`/v0/configuration/metaType=accountCategory`).then((res) => res.data)

//   return response.accountCategory
// }

export const getAccountCategories = async () => {
  const response = await axios({
    url: '/api/metadata/accountCategory',
    baseURL: 'http://localhost:8081'
  }).then((res) => res.data)

  return response
}

export const getOptionsById = async (url, payload) => {
  const response = await axios({
    url,
    baseURL: 'http://localhost:8081',
    method: 'get',
    params: payload
  })
    .then((res) => res.data)
    .catch((error) => {
      console.error(error)
      return { status: 500, statusText: 'Error', message: 'API Error' }
    })

  return response
}

export const getAssetsSummaryStructure = async () => {
  const response = await axios(`/v0/configuration/metaType=assetsSummary`)
    .then((res) => res.data)
    .catch((error) => {
      console.error(error)
      return { status: 500, statusText: 'Error', message: 'API Error' }
    })

  return response
}

export const getGroupListModifyMetadata = async () => {
  const response = await axios(`/v0/configuration/metaType=modifyListGroupMetadata`)
    .then((res) => res.data)
    .catch((error) => {
      console.error(error)
      return { status: 500, statusText: 'Error', message: 'API Error' }
    })
  return response
}

export const getIndirectlyOwnedGroupListModifyMetadata = async () => {
  const response = await axios(`/v0/configuration/metaType=modifyListIndirectlyOwnedGroupMetadata`)
    .then((res) => res.data)
    .catch((error) => {
      console.error(error)
      return { status: 500, statusText: 'Error', message: 'API Error' }
    })
  return response
}

// pointed to local
// export const getIndirectlyOwnedGroupListModifyMetadata = async () => {
//   const response = await axios({
//     url: `/metadata/modifyListIndirectlyOwnedGroupMetadata`,
//     baseURL: 'http://localhost:8081/api'
//   }).then((res) => res.data)
//   return response
// }

export const getGroupAssetRequestHistoryMetadata = async () => {
  const response = await axios(`/v0/configuration/metaType=groupRequestHistory`)
    .then((res) => res.data)
    .catch((error) => {
      console.error(error)
      return { status: 500, statusText: 'Error', message: 'API Error' }
    })
  return response
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

export const getGroupAssetRequestHistoryData = async (payload) =>
  axios({
    url: '/v0/admin/membership/groups',
    method: 'post',
    data: payload
  })
    .then((res) => {
      const historyData = []
      const results = {}
      results.total = res?.data?.hits?.total?.value

      res.data.hits.hits.forEach((item) => {
        const inProgressPhase = item?._source?.decision?.phases
          ? item?._source?.decision?.phases
              .map((act) => (act.status === 'in-progress' ? act.name : null))
              .filter((element) => element !== null)
          : null
        historyData.push({
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
          requestDate: formattedDate(item?._source?.metadata?.created),
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
          requestedItem: getRequestItem(item),
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
          requestNumber: item._source.request?.common?.Accessio_Request_No,
          bulkRequestId: item._source.request?.common?.AccessioBulkRequestNumber
            ? item._source.request.common.AccessioBulkRequestNumber
            : '',
          sortKeyword: item?.sort ? item.sort[0] : [],
          recipientMail: item._source.request?.common?.recepientMail
            ? item._source.request?.common?.recepientMail
            : '',
          phase: inProgressPhase && inProgressPhase[0] ? inProgressPhase[0] : '',
          phases: item?._source?.decision?.phases ? item?._source?.decision?.phases : '',
          category: item._source.request?.common?.category
            ? item._source.request?.common?.category
            : '',
          operation: item._source.request?.common?.operation
            ? item._source.request?.common?.operation
            : ''
        })
      })
      results.historyData = historyData
      return results
    })
    .catch((error) => console.error(error))

export const sortGroupAssetRequestHistoryData = async (payload) =>
  axios({
    url: '/v0/admin/membership/groups/sort',
    method: 'post',
    data: payload
  })
    .then((res) => {
      const historyData = []
      const results = {}
      results.total = res?.data?.hits?.total?.value

      res.data.hits.hits.forEach((item) => {
        const inProgressPhase = item?._source?.decision?.phases
          ? item?._source?.decision?.phases
              .map((act) => (act.status === 'in-progress' ? act.name : null))
              .filter((element) => element !== null)
          : null
        historyData.push({
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
          requestDate: formattedDate(item?._source?.metadata?.created),
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
          requestedItem: getRequestItem(item),
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
          requestNumber: item._source.request?.common?.Accessio_Request_No,
          bulkRequestId: item._source.request?.common?.AccessioBulkRequestNumber
            ? item._source.request.common.AccessioBulkRequestNumber
            : '',
          sortKeyword: item?.sort ? item.sort[0] : [],
          recipientMail: item._source.request?.common?.recepientMail
            ? item._source.request?.common?.recepientMail
            : '',
          phase: inProgressPhase && inProgressPhase[0] ? inProgressPhase[0] : '',
          phases: item?._source?.decision?.phases ? item?._source?.decision?.phases : '',
          category: item._source.request?.common?.category
            ? item._source.request?.common?.category
            : '',
          operation: item._source.request?.common?.operation
            ? item._source.request?.common?.operation
            : ''
        })
      })
      results.historyData = historyData
      return results
    })
    .catch((error) => console.error(error))

export const searchGroupAssetRequestHistoryData = async (payload) =>
  axios({
    url: '/v0/admin/membership/groups/search',
    method: 'post',
    data: payload
  })
    .then((res) => {
      const historyData = []
      const results = {}
      results.total = res?.data?.hits?.total?.value

      res.data.hits.hits.forEach((item) => {
        const inProgressPhase = item?._source?.decision?.phases
          ? item?._source?.decision?.phases
              .map((act) => (act.status === 'in-progress' ? act.name : null))
              .filter((element) => element !== null)
          : null
        historyData.push({
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
          requestDate: formattedDate(item?._source?.metadata?.created),
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
          requestedItem: getRequestItem(item),
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
          requestNumber: item._source.request?.common?.Accessio_Request_No,
          bulkRequestId: item._source.request?.common?.AccessioBulkRequestNumber
            ? item._source.request.common.AccessioBulkRequestNumber
            : '',
          sortKeyword: item?.sort ? item.sort[0] : [],
          recipientMail: item._source.request?.common?.recepientMail
            ? item._source.request?.common?.recepientMail
            : '',
          phase: inProgressPhase && inProgressPhase[0] ? inProgressPhase[0] : '',
          phases: item?._source?.decision?.phases ? item?._source?.decision?.phases : '',
          category: item._source.request?.common?.category
            ? item._source.request?.common?.category
            : '',
          operation: item._source.request?.common?.operation
            ? item._source.request?.common?.operation
            : ''
        })
      })
      results.historyData = historyData
      return results
    })
    .catch((error) => console.error(error))

export const getGroupRecordStatus = (dbagObjectLastRecertified) => {
  if (dbagObjectLastRecertified) {
    const dyear = dbagObjectLastRecertified.slice(0, 4)
    const dmonth = dbagObjectLastRecertified.slice(4, 6)
    const ddate = dbagObjectLastRecertified.slice(6, 8)
    const lastRecertifiedDate = new Date(dyear, dmonth - 1, ddate)
    const currentDate = new Date()
    const days = parseInt(
      (currentDate.getTime() - lastRecertifiedDate.getTime()) / (1000 * 60 * 60 * 24),
      10
    )

    if (days <= 180) return 'No Pending Review'

    if (days > 180 && days <= 240) return 'Pending Review'

    if (days > 240 && days <= 300) return 'Overdue Review'
    if (days > 300) return 'Overdue Review and Members Removed'
  }
  return 'No Pending Review'
}

export const getGroupRequests = async (payload, userEmail) =>
  axios({
    //   url: '/v0/users/myGroups',
    //   method: 'post',
    //   data: payload
    // }).then((res) => {
    url: `/metadata/modifyListGroupResponse`,
    baseURL: 'http://localhost:8081/api'
    // method: 'post',
    // data: payload
  }).then((res) => {
    console.log(payload)
    const result = {}
    result.total = res?.data?.hits?.total?.value
    const groupData = []
    res?.data?.hits?.hits?.forEach((item) => {
      const roleTitle = []
      if (
        item?._source?.igaContent?.dbagIMSApprovers &&
        (item?._source?.igaContent?.dbagIMSApprovers.includes(userEmail) ||
          item?._source?.igaContent?.dbagIMSApprovers === userEmail)
      ) {
        roleTitle.push('Approver')
      }
      if (
        item?._source?.igaContent?.object?.dbagIMSAuthContactDelegate &&
        (item?._source?.igaContent?.object?.dbagIMSAuthContactDelegate.includes(userEmail) ||
          item?._source?.igaContent?.object?.dbagIMSAuthContactDelegate === userEmail)
      ) {
        roleTitle.push('Group Authorization Delegate')
      }
      if (
        item?._source?.igaContent?.object?.dbagIMSAuthContact &&
        (item?._source?.igaContent?.object?.dbagIMSAuthContact.includes(userEmail) ||
          item?._source?.igaContent?.object?.dbagIMSAuthContact === userEmail)
      ) {
        roleTitle.push('Group Authorization Contact')
      }
      const accessioGroupType =
        item?._source?.glossary?.idx &&
        item?._source?.glossary?.idx['/'] &&
        item?._source?.glossary?.idx['/']?.accessioGroupType

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
        role: roleTitle ? roleTitle.join(',') : '',
        status: getGroupRecordStatus(item?._source?.igaContent?.object?.dbagObjectLastRecertified),
        groupDetails: item,
        checked: false
      })
    })
    result.groupData = groupData
    return result
  })
export const sortAssets = (payload) =>
  axios({
    url: `/v0/sort/common`,
    method: 'post',
    data: payload
  })
    .then((res) => {
      const result = {}
      result.total = res?.data?.hits?.total?.value
      const assetsData = []
      res?.data?.hits?.hits?.forEach((item, index) => {
        /* eslint no-underscore-dangle: 0 */
        const igaContent = item?._source?.igaContent // Setting IgaContent
        const dbagApplicationID =
          item?._source?.igaContent?.dbagApplicationID ||
          item?._source?.igaContent?.object?.dbagApplicationID // For GMSA dbagApplicationID is From IgaContent.object, Other Accounts need to check the response

        const sAMAccountName = item?._source?.igaContent?.sAMAccountName
          ? item?._source?.igaContent?.sAMAccountName
          : ''
        let expiry =
          item?._source?.igaContent?.accountExpires &&
          ['0', ''].includes(item?._source?.igaContent?.accountExpires)
            ? ''
            : item?._source?.igaContent?.accountExpires
        expiry = getExpiryDate(expiry)

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
            if (sAMAccountName.includes('_')) {
              accountCategory = 'CyberArk Role (shared) Account'
            } else {
              accountCategory = 'Technical Generic Brokered'
            }
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
          employeeType: item?._source?.igaContent?.employeeType
            ? item?._source?.igaContent?.employeeType
            : '',
          sAMAccountName,
          category: accountCategory,
          expiry,
          id: item?._source?.id ? item?._source?.id : '',
          accountStatus: status,
          recipientId: item?._source?.userId?.mail
            ? convertMailtoName(item?._source?.userId?.mail)
            : '',
          dbagApplicationID: dbagApplicationID?.dbagApplicationID
            ? iff(
                typeof dbagApplicationID?.dbagApplicationID !== 'string' &&
                  dbagApplicationID?.dbagApplicationID.length,
                dbagApplicationID?.dbagApplicationID[0],
                dbagApplicationID?.dbagApplicationID
              )
            : '',
          primaryAccount: item?._source?.igaContent?.object?.primaryAccount
            ? item?._source?.igaContent?.object?.primaryAccount
            : '',
          domain: item?._source?.igaContent?.object?.domain
            ? item?._source?.igaContent?.object?.domain
            : '',
          dbagCostcenter: item?._source?.igaContent?.dbagCostcenter
            ? item?._source?.igaContent?.dbagCostcenter
            : '',
          department: item?._source?.igaContent?.object?.department
            ? item?._source?.igaContent?.object?.departments
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
            : iff(item?._source?.igaContent?.middleName, item?._source?.igaContent?.middleName, ''),
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
          accountStatusValidationString: item?._source?.igaContent?.object?.info
            ? item?._source?.igaContent?.object?.info
            : '',
          recipient: item?._source?.userId?.mail ? item?._source?.userId?.mail : '',
          searchAfterKey: item?.sort ? item?.sort[0] : [],
          expiryDate: expiry,
          // FOR GMSA Mapping
          KerberosEncryptionType: igaContent?.object?.KerberosEncryptionType
            ? checkKerberosEncryptionType(igaContent?.KerberosEncryptionType)
            : '',
          KerberosEncryptionType1: igaContent?.object?.KerberosEncryptionType
            ? [8, '8'].includes(igaContent?.object?.KerberosEncryptionType) === true
            : '',
          KerberosEncryptionType2: igaContent?.object?.KerberosEncryptionType
            ? [16, '16'].includes(igaContent?.object?.KerberosEncryptionType) === true
            : '',
          PrincipalsAllowedToRetrieveManagedPassword: igaContent?.object
            ?.PrincipalsAllowedToRetrieveManagedPassword
            ? igaContent?.object?.PrincipalsAllowedToRetrieveManagedPassword
            : '',
          name: igaContent?.object?.name ? igaContent?.object?.name : '',
          ManagedPasswordIntervalInDays: igaContent?.object?.ManagedPasswordIntervalInDays
            ? igaContent?.object?.ManagedPasswordIntervalInDays
            : '',
          servicePrincipalName: igaContent?.object?.servicePrincipalName
            ? igaContent?.object?.servicePrincipalName
            : ''
        })
        if ([24, '24'].includes(igaContent?.object?.KerberosEncryptionType)) {
          assetsData[index].KerberosEncryptionType1 = true
          assetsData[index].KerberosEncryptionType2 = true
        }
      })
      result.assetsData = assetsData
      return result
    })
    .catch((error) => console.error(error))

export const searchAssets = async (payload) => {
  const response = await axios({
    url: `/v0/search/common`,
    method: 'post',
    data: payload
  }).then((res) => {
    const result = {}
    result.total = res?.data?.hits?.total?.value
    const assetsData = []
    res?.data?.hits?.hits?.forEach((item, index) => {
      /* eslint no-underscore-dangle: 0 */
      const igaContent = item?._source?.igaContent // Setting IgaContent
      const dbagApplicationID =
        item?._source?.igaContent?.dbagApplicationID ||
        item?._source?.igaContent?.object?.dbagApplicationID // FOR GMSA dbagApplicationID is from igaContent.object Need to test for other types

      const sAMAccountName = item?._source?.igaContent?.sAMAccountName
        ? item?._source?.igaContent?.sAMAccountName
        : ''
      let accountCategory = ''
      let expiry =
        item?._source?.igaContent?.accountExpires &&
        ['0', ''].includes(item?._source?.igaContent?.accountExpires)
          ? ''
          : item?._source?.igaContent?.accountExpires
      expiry = getExpiryDate(expiry)
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
          if (sAMAccountName.includes('_')) {
            accountCategory = 'CyberArk Role (shared) Account'
          } else {
            accountCategory = 'Technical Generic Brokered'
          }
          break
        case 'DAdmin':
          accountCategory = 'Personal - Desktop Admin'
          break
        case 'DomSpt':
        case 'Domspt':
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
        employeeType: item?._source?.igaContent?.employeeType
          ? item?._source?.igaContent?.employeeType
          : '',
        sAMAccountName,
        category: accountCategory,
        expiry,
        id: item?._source?.id ? item?._source?.id : '',
        accountStatus: status,
        recipientId: item?._source?.userId?.mail
          ? convertMailtoName(item?._source?.userId?.mail)
          : '',
        recepientMail: item?._source?.userId?.mail ? item?._source?.userId?.mail : '',
        dbagApplicationID: dbagApplicationID
          ? iff(
              typeof dbagApplicationID !== 'string' && dbagApplicationID?.length,
              dbagApplicationID[0],
              dbagApplicationID
            )
          : '',
        primaryAccount: item?._source?.igaContent?.object?.primaryAccount
          ? item?._source?.igaContent?.object?.primaryAccount
          : '',
        domain: item?._source?.igaContent?.object?.domain
          ? item?._source?.igaContent?.object?.domain
          : '',
        dbagCostcenter: item?._source?.igaContent?.dbagCostcenter
          ? item?._source?.igaContent?.dbagCostcenter
          : '',
        department: item?._source?.igaContent?.object?.department
          ? item?._source?.igaContent?.object?.department
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
          : iff(item?._source?.igaContent?.middleName, item?._source?.igaContent?.middleName, ''),
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
          ? formattedDate(item?._source?.metadata?.created)
          : '',
        accountStatusValidationString: item?._source?.igaContent?.object?.info
          ? item?._source?.igaContent?.object?.info
          : '',
        recipient: item?._source?.userId?.mail ? item?._source?.userId?.mail : '',
        searchAfterKey: item?.sort ? item?.sort[0] : [],
        expiryDate: expiry,
        // FOR GMSA Mapping
        KerberosEncryptionType: igaContent?.object?.KerberosEncryptionType
          ? checkKerberosEncryptionType(igaContent?.KerberosEncryptionType)
          : '',
        KerberosEncryptionType1: igaContent?.object?.KerberosEncryptionType
          ? [8, '8'].includes(igaContent?.object?.KerberosEncryptionType) === true
          : '',
        KerberosEncryptionType2: igaContent?.object?.KerberosEncryptionType
          ? [16, '16'].includes(igaContent?.object?.KerberosEncryptionType) === true
          : '',
        PrincipalsAllowedToRetrieveManagedPassword: igaContent?.object
          ?.PrincipalsAllowedToRetrieveManagedPassword
          ? igaContent?.object?.PrincipalsAllowedToRetrieveManagedPassword
          : '',
        name: igaContent?.object?.name ? igaContent?.object?.name : '',
        ManagedPasswordIntervalInDays: igaContent?.object?.ManagedPasswordIntervalInDays
          ? igaContent?.object?.ManagedPasswordIntervalInDays
          : '',
        servicePrincipalName: igaContent?.object?.servicePrincipalName
          ? igaContent?.object?.servicePrincipalName
          : ''
      })
      if ([24, '24'].includes(igaContent?.object?.KerberosEncryptionType)) {
        assetsData[index].KerberosEncryptionType1 = true
        assetsData[index].KerberosEncryptionType2 = true
      }
    })
    result.assetsData = assetsData
    return result
  })
  return response
}

export const sortGroupAssets = async (payload, userEmail) => {
  const response = await axios({
    url: `/v0/sort/common`,
    method: 'post',
    data: payload
  })
    .then((res) => {
      console.log(payload)
      const result = {}
      result.total = res?.data?.hits?.total?.value
      const groupData = []
      res?.data?.hits?.hits?.forEach((item) => {
        const roleTitle = []
        if (
          item?._source?.igaContent?.dbagIMSApprovers &&
          item?._source?.igaContent?.dbagIMSApprovers.includes(userEmail)
        ) {
          roleTitle.push('Approver')
        }
        if (
          (item?._source?.igaContent?.object?.dbagIMSAuthContactDelegate &&
            item?._source?.igaContent?.object?.dbagIMSAuthContactDelegate.includes(userEmail)) ||
          item?._source?.igaContent?.object?.dbagIMSAuthContactDelegate === userEmail
        ) {
          roleTitle.push('Group Authorization Delegate')
        }
        if (
          (item?._source?.igaContent?.object?.dbagIMSAuthContact &&
            item?._source?.igaContent?.object?.dbagIMSAuthContact.includes(userEmail)) ||
          item?._source?.igaContent?.object?.dbagIMSAuthContact === userEmail
        ) {
          roleTitle.push('Group Authorization Contact')
        }
        const accessioGroupType =
          item?._source?.glossary?.idx &&
          item?._source?.glossary?.idx['/'] &&
          item?._source?.glossary?.idx['/']?.accessioGroupType
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
          role: roleTitle ? roleTitle.join(',') : '',
          groupDetails: item,
          checked: false,
          status: getGroupRecordStatus(item?._source?.igaContent?.object?.dbagObjectLastRecertified)
        })
      })
      result.groupData = groupData
      return result
    })
    .catch((error) => console.error(error))
  return response
}

export const searchGroupAssets = async (payload, userEmail) => {
  const response = await axios({
    url: `/v0/search/common`,
    method: 'post',
    data: payload
  })
    .then((res) => {
      const result = {}
      result.total = res?.data?.hits?.total?.value
      const groupData = []
      res?.data?.hits?.hits?.forEach((item) => {
        const roleTitle = []
        if (
          item?._source?.igaContent?.dbagIMSApprovers &&
          (item?._source?.igaContent?.dbagIMSApprovers.includes(userEmail) ||
            item?._source?.igaContent?.dbagIMSApprovers === userEmail)
        ) {
          roleTitle.push('Approver')
        }
        if (
          item?._source?.igaContent?.object?.dbagIMSAuthContactDelegate &&
          (item?._source?.igaContent?.object?.dbagIMSAuthContactDelegate.includes(userEmail) ||
            item?._source?.igaContent?.object?.dbagIMSAuthContactDelegate === userEmail)
        ) {
          roleTitle.push('Group Authorization Delegate')
        }
        if (
          item?._source?.igaContent?.object?.dbagIMSAuthContact &&
          (item?._source?.igaContent?.object?.dbagIMSAuthContact.includes(userEmail) ||
            item?._source?.igaContent?.object?.dbagIMSAuthContact === userEmail)
        ) {
          roleTitle.push('Group Authorization Contact')
        }
        const accessioGroupType =
          item?._source?.glossary?.idx &&
          item?._source?.glossary?.idx['/'] &&
          item?._source?.glossary?.idx['/']?.accessioGroupType
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
          role: roleTitle ? roleTitle.join(',') : '',
          groupDetails: item,
          checked: false,
          status: getGroupRecordStatus(item?._source?.igaContent?.object?.dbagObjectLastRecertified)
        })
      })
      result.groupData = groupData
      return result
    })
    .catch((error) => console.error(error))
  return response
}

export const getOwnedGroupRequests = async (userEmail, pageSize, pageNumber) => {
  const response = axios({
    url: `/v0/governance/getDisoAdGroups?email=${userEmail}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
    method: 'get'
  }).then((res) => {
    const result = {}
    result.total = res?.data?.totalItems
    const groupData = []
    res?.data?.details?.forEach((item) => {
      const roleTitle = []
      if (item?.approver && (item?.approver.includes(userEmail) || item?.approver === userEmail)) {
        roleTitle.push('Approver')
      }
      if (
        item?.imsAuthContactDelegate &&
        (item?.imsAuthContactDelegate.includes(userEmail) ||
          item?.imsAuthContactDelegate === userEmail)
      ) {
        roleTitle.push('Group Authorization Delegate')
      }
      if (
        item?.authContact &&
        (item?.authContact.includes(userEmail) || item?.authContact === userEmail)
      ) {
        roleTitle.push('Group Authorization Contact')
      }
      // const accessioGroupType = item?._source?.glossary?.kv?.filter(
      //   (gattrb) => gattrb.key === 'accessioGroupType'
      // )[0]?.value
      groupData.push({
        // id: item?._source?.id ? item?._source?.id : '', // not there in response
        cn: item?.groupName ? item?.groupName : '',
        applicationId: item?.applicationId ? item?.applicationId : '',
        // accessioGroupType: accessioGroupType || '', //remove this column not there in response
        description: item?.description ? item?.description : '',
        role: roleTitle ? roleTitle.join(',') : '',
        groupDetails: item
      })
    })
    result.groupData = groupData
    return result
  })
  return response
}
