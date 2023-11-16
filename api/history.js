import axios from '../axios'
import {
  seperateWordsWithCapitalLetter,
  capitalizeFirstLetter,
  formattedDate,
  getFormattedDateTime,
  convertMailtoName
} from '../helpers/strings'
import { getRequestItem, checkKerberosEncryptionType } from '../helpers/utils'

const iff = (consition, then, otherise) => (consition ? then : otherise)

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

// This API call required for future development and debugging
export const getRequestHistoryMeta = async () => {
  const response = await axios({
    url: '/api/metadata/requestHistory',
    baseURL: 'http://localhost:8081'
  })
    .then((res) => res.data)
    .catch((error) => console.error(error))
  return response
}

// export const getRequestHistoryMeta = async () => {
//   const response = await axios({
//     url: '/v0/configuration/metaType=requestHistory'
//   })
//     .then((res) => res.data)
//     .catch((error) => console.error(error))

//   return response
// }

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

const getSAMAccountName = (requestObj, requestType) => {
  let samAccountName = ''
  switch (requestType) {
    case 'deleteAccount':
    case 'modifyAccount':
      samAccountName = requestObj?.common?.sAMAccountName
      break

    default:
      samAccountName = requestObj?.common?.accountDetails?.sAMAccountName
      break
  }
  return samAccountName
}

const getAccountType = (requestObj, requestType) => {
  let accountType = ''
  switch (requestType) {
    case 'deleteAccount':
    case 'modifyAccount':
      accountType = requestObj?.common?.accountType
      break

    default:
      accountType = requestObj?.common?.accountDetails?.accountType
      break
  }
  return accountType
}

const getCompletionDateFromPhases = (phasesArr) => {
  const completedItem = phasesArr.filter((phase) => phase.status === 'complete')
  const lastCompletedItem = completedItem.pop()
  return getFormattedDateTime(lastCompletedItem.completionDate).split(' ')[0]
}

export const searchRequestHistory = (payload) =>
  axios({
    url: `/v0/search/common`,
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

          requestedItem: getRequestItem(item),
          completionDate: item._source.decision?.completionDate
            ? getFormattedDateTime(item._source.decision?.completionDate).split(' ')[0]
            : '',
          // added this as a part of approvalHistory metadata changes
          approvalHisCompletionDate: item._source.decision?.completionDate
            ? formattedDate(item._source.decision?.completionDate.split('T')[0])
            : '',
          // eslint-disable-next-line no-nested-ternary
          approvalDate: item._source.decision?.completionDate
            ? formattedDate((item._source.decision?.completionDate).split('T')[0])
            : item._source.decision?.phases &&
              ![null, 'null'].includes(item?._source?.decision?.phases[0]?.decision) &&
              item._source.decision?.phases[0]?.completionDate
            ? formattedDate((item?._source?.decision?.phases[0]?.completionDate).split('T')[0])
            : '',
          requestDate: iff(
            formattedDate(item?._source?.decision?.startDate),
            formattedDate(item?._source?.decision?.startDate), // ALM2105
            ''
          ),
          expiry: item._source.request?.common?.endDate
            ? formattedDate(item._source.request?.common?.endDate)
            : formattedDate(item?._source?.request?.common?.accountDetails?.accountExpires),
          comments: item._source.decision?.comments ? item._source.decision?.comments : '',
          permissions: item._source.decision?.actors?.active[0]?.permissions
            ? item._source.decision?.actors?.active[0]?.permissions
            : '',
          requester: item._source.request?.common?.requestorMail
            ? convertMailtoName(item._source.request?.common?.requestorMail)
            : '',
          recipient: item._source.request?.common?.recepientMail
            ? convertMailtoName(item._source.request?.common?.recepientMail)
            : '',
          requestNumber: item._source.request?.common?.Accessio_Request_No,
          sortKeyword: item?.sort ? item.sort[0] : [],
          recipientMail: item._source.request?.common?.recepientMail
            ? item._source.request?.common?.recepientMail
            : '',
          requesterMail: item._source.request?.common?.requestorMail
            ? item._source.request?.common?.requestorMail
            : '',
          bulkRequestId: item._source.request?.common?.AccessioBulkRequestNumber,
          category: item?._source?.request?.common?.category,
          operation: item?._source?.request?.common?.operation,
          phase: inProgressPhase && inProgressPhase[0] ? inProgressPhase[0] : '',
          phases: item?._source?.decision?.phases ? item?._source?.decision?.phases : ''
        })
      })
      results.historyData = historyData
      return results
    })
    .catch((error) => console.error(error))

export const getRequestHistory = async () =>
  // axios(`/v0/requests/allRequests?isDraft=false&pageSize=${pageSize}&pageNumber=${pageNumber}`)
  // Local Data
  // console.log(pageSize, pageNumber)
  axios({
    url: '/api/metadata/requestHistoryDataResponse',
    baseURL: 'http://localhost:8081'
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
            ? getFormattedDateTime(item._source.decision?.completionDate).split(' ')[0]
            : '',
          approvalHisCompletionDate: item._source.decision?.completionDate
            ? formattedDate((item._source.decision?.completionDate).split('T')[0])
            : '',
          requestDate: iff(
            formattedDate(item?._source?.decision?.startDate),
            formattedDate(item?._source?.decision?.startDate), // ALM2105
            ''
          ),
          // eslint-disable-next-line no-nested-ternary
          approvalDate: item._source.decision?.completionDate
            ? formattedDate((item._source.decision?.completionDate).split('T')[0])
            : item._source.decision?.phases &&
              ![null, 'null'].includes(item?._source?.decision?.phases[0]?.decision) &&
              item._source.decision?.phases[0]?.completionDate
            ? formattedDate((item?._source?.decision?.phases[0]?.completionDate).split('T')[0])
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
          category: item?._source?.request?.common?.category,
          operation: item?._source?.request?.common?.operation,
          sortKeyword: item?.sort ? item.sort[0] : [],
          recipientMail: item._source.request?.common?.recepientMail
            ? item._source.request?.common?.recepientMail
            : '',
          phase: inProgressPhase && inProgressPhase[0] ? inProgressPhase[0] : '',
          phases: item?._source?.decision?.phases ? item?._source?.decision?.phases : ''
        })
      })
      results.historyData = historyData
      return results
    })
    .catch((error) => console.error(error))
// Search Approval History
export const approvalsHistorysearch = (payload) =>
  axios({
    url: `/v0/search/common`,
    method: 'post',
    data: payload
  })
    .then((res) => {
      const approvalData = []
      const results = {}
      results.total = res?.data?.hits?.total?.value
      res.data.hits.hits.forEach((item) => {
        /* eslint no-underscore-dangle: 0 */
        approvalData.push({
          id: item._source.id,
          status: getStatus(item._source?.decision?.status, item._source?.decision?.outcome),
          itAssests: item._source.request?.common?.applicationName
            ? item._source.request?.common?.applicationName
            : '',
          requestType: getRequestType(item?._source?.requestType),
          requestDate: iff(
            formattedDate(item._source?.decision?.startDate),
            formattedDate(item._source?.decision?.startDate), // ALM2105
            ''
          ),
          approvalHisCompletionDate:
            item._source?.decision?.phases?.length >= 0
              ? getCompletionDateFromPhases(item._source?.decision?.phases)
              : iff(
                  item._source?.decision?.completionDate,
                  getFormattedDateTime(item._source.decision?.completionDate).split(' ')[0],
                  ''
                ),
          expiry: item._source.request?.common?.endDate
            ? formattedDate(item._source.request?.common?.endDate)
            : '',
          comments: item._source.decision?.comments ? item._source.decision?.comments : '',
          permissions: item._source.decision?.actors?.active[0]?.permissions
            ? item._source.decision?.actors?.active[0]?.permissions
            : '',
          requester: item._source?.request?.common?.requestorMail
            ? convertMailtoName(item._source?.request?.common?.requestorMail)
            : '',
          requestedItem: getRequestItem(item),
          recipient: item._source.request?.common?.recepientMail
            ? convertMailtoName(item._source.request?.common?.recepientMail)
            : '',
          requestNumber: item._source.request?.common?.Accessio_Request_No,
          category: item?._source?.request?.common?.category,
          operation: item?._source?.request?.common?.operation,
          recipientMail: item._source.request?.common?.recepientMail
            ? item._source.request?.common?.recepientMail
            : '',
          requesterMail: item._source.request?.common?.requestorMail
            ? item._source.request?.common?.requestorMail
            : '',
          bulkRequestId: item._source?.request?.common?.AccessioBulkRequestNumber
            ? item._source?.request?.common.AccessioBulkRequestNumber
            : ''
        })
      })
      results.approvalData = approvalData
      return results
    })
    .catch((error) => console.error(error))

// Get All Approval History Data on pageload
export const getHistoryData = async (approvalPayload, email) =>
  // axios(`/v0/requests/search?pageSize=${pageSize}&saKeyWord=${searchKey}`).then((res) => {
  // Local Data
  axios({
    url: '/api/metadata/approvalDataResponse',
    baseURL: 'http://localhost:8081'
  })
    // axios({
    //   url: `/v0/requests/getAllRequests`,
    //   method: 'post',
    //   data: approvalPayload
    // })
    .then((res) => {
      const approvalData = []
      const results = {}
      results.total = res?.data?.hits?.total?.value
      res.data.hits.hits.forEach((item) => {
        const approvalAction = item?._source?.decision?.phases
          .map((phase) => (phase?.completedBy?.mail === email ? phase.decision : null))
          .filter((element) => element !== null)

        /* eslint no-underscore-dangle: 0 */
        approvalData.push({
          id: item._source.id,
          status: getStatus(item._source?.decision?.status, item._source?.decision?.outcome),
          itAssests: item._source.request?.common?.applicationName
            ? item._source.request?.common?.applicationName
            : '',
          requestType: getRequestType(item?._source?.requestType),
          completionDate: item._source.decision?.completionDate
            ? getFormattedDateTime(item._source.decision?.completionDate).split(' ')[0]
            : '',
          approvalHisCompletionDate:
            item._source?.decision?.phases?.length >= 0
              ? getCompletionDateFromPhases(item._source?.decision?.phases)
              : iff(
                  item._source?.decision?.completionDate,
                  formattedDate((item._source?.decision?.completionDate).split('T')[0]),
                  ''
                ),
          requestDate: iff(
            formattedDate(item._source.decision?.startDate),
            formattedDate(item._source.decision?.startDate), // ALM 2105 changes
            ''
          ),
          requestedItem: getRequestItem(item),
          expiry: item._source.request?.common?.endDate
            ? formattedDate(item._source.request?.common?.endDate)
            : '',
          comments: item._source.decision?.comments ? item._source.decision?.comments : '',
          permissions: item._source.decision?.actors?.active[0]?.permissions
            ? item._source.decision?.actors?.active[0]?.permissions
            : '',
          requester: item._source.request?.common?.requestorMail
            ? convertMailtoName(item._source.request?.common?.requestorMail)
            : '',
          recipient: item._source.request?.common?.recepientMail
            ? convertMailtoName(item._source.request?.common?.recepientMail)
            : '',
          requestNumber: item._source.request?.common?.Accessio_Request_No,
          category: item?._source?.request?.common?.category,
          operation: item?._source?.request?.common?.operation,
          bulkRequestId: item._source.request?.common?.AccessioBulkRequestNumber
            ? item._source.request.common.AccessioBulkRequestNumber
            : '',
          approvalAction: approvalAction.length > 0 ? capitalizeFirstLetter(approvalAction[0]) : '',
          recipientMail: item._source.request?.common?.recepientMail
            ? item._source.request?.common?.recepientMail
            : '',
          requesterMail: item._source.request?.common?.requestorMail
            ? item._source.request?.common?.requestorMail
            : '',
          sortKeyword: item?.sort ? item.sort[0] : []
        })
      })
      results.approvalData = approvalData
      return results
    })
    .catch((error) => console.error(error))

//  This API call required for future development and debugging
export const getApprovalHistoryMeta = async () => {
  const response = await axios({
    url: '/api/metadata/approvalHistory',
    baseURL: 'http://localhost:8081'
  })
    .then((res) => res.data)
    .catch((error) => console.error(error))
  return response
}

// export const getApprovalHistoryMeta = async () => {
//   const response = await axios({
//     url: '/v0/configuration/metaType=approvalHistory'
//   })
//     .then((res) => res.data)
//     .catch((error) => console.error(error))
//   return response
// }

// export const getApprovalHistoryMeta = async () => {
//   const response = await axios({
//     url: '/v0/configuration/metaType=approvalHistory'
//   })
//     .then((res) => res.data)
//     .catch((error) => console.error(error))
//   return response
// }
const getSummaryRequestType = (requestType) => {
  let type = ''
  type = getRequestType(requestType)
  if (type.includes('ACCOUNT')) {
    return 'Account'
  }
  if (type.includes('GROUP')) {
    return 'Group'
  }
  return 'Entitlement'
}
export const getRequestHistorySummaryById = async (requestId) => {
  const response = await axios({
    url: `/v0/requests/reqByReqId?reqId=${requestId}`,
    method: 'get'
    // This code is used to connect local API response
    // url: 'api/metadata/approvalSummary',
    // baseURL: 'http://localhost:8081'
  })
    .then((res) => res.data)
    .catch((error) => console.error(error))
  const phaseInfo = []
  let phaseName

  if (response?.request?.common?.accessioApprovalLog) {
    phaseInfo.push({
      phaseId: 'LEVEL1 APPROVAL',
      status: response?.decision?.status ? capitalizeFirstLetter(response?.decision?.status) : '--',
      decision: 'Auto Approve',
      startDate: getFormattedDateTime(
        response?.request?.common?.accessioApprovalLog?.LineManagerApproval?.autoApproval_date
          ? response?.request?.common?.accessioApprovalLog?.LineManagerApproval?.autoApproval_date
          : response?.request?.common?.accessioApprovalLog?.Level1Approval?.autoApproval_date
      ),
      completionDate: getFormattedDateTime(
        response?.request?.common?.accessioApprovalLog?.LineManagerApproval?.autoApproval_date
          ? response?.request?.common?.accessioApprovalLog?.LineManagerApproval?.autoApproval_date
          : response?.request?.common?.accessioApprovalLog?.Level1Approval?.autoApproval_date
      ),
      approvalHisCompletionDate: getFormattedDateTime(
        response?.request?.common?.accessioApprovalLog?.LineManagerApproval?.autoApproval_date
          ? response?.request?.common?.accessioApprovalLog?.LineManagerApproval?.autoApproval_date
          : response?.request?.common?.accessioApprovalLog?.Level1Approval?.autoApproval_date
      ),
      approverInfo: response?.request?.common?.accessioApprovalLog?.LineManagerApproval
        ?.approverL1Mail
        ? response?.request?.common?.accessioApprovalLog?.LineManagerApproval?.approverL1Mail
        : iff(response?.requester?.mail, response?.requester?.mail, '')
    })
    if (
      response?.request?.common?.accessioApprovalLog?.Level2Approval &&
      Object.keys(response?.request?.common?.accessioApprovalLog?.Level2Approval).length
    ) {
      const actName2 = response?.request?.common?.accessioApprovalLog?.Level2Approval
        ?.approverL2Mail
        ? response?.request?.common?.accessioApprovalLog?.Level2Approval?.approverL2Mail
        : []
      phaseInfo.push({
        phaseId: 'LEVEL2 APPROVAL',
        status: response?.decision?.status
          ? capitalizeFirstLetter(response?.decision?.status)
          : '--',
        decision: 'Auto Approve',
        startDate: response?.request?.common?.accessioApprovalLog?.Level2Approval?.autoApproval_date
          ? getFormattedDateTime(
              response?.request?.common?.accessioApprovalLog?.Level2Approval?.autoApproval_date
            )
          : '',
        completionDate: response?.request?.common?.accessioApprovalLog?.Level2Approval
          ?.autoApproval_date
          ? getFormattedDateTime(
              response?.request?.common?.accessioApprovalLog?.Level2Approval?.autoApproval_date
            )
          : '',
        approvalHisCompletionDate: response?.request?.common?.accessioApprovalLog?.Level2Approval
          ?.autoApproval_date
          ? getFormattedDateTime(
              response?.request?.common?.accessioApprovalLog?.Level2Approval?.autoApproval_date
            )
          : '',
        approverInfo: response?.request?.common?.accessioApprovalLog?.Level2Approval?.approverL2Mail
          ? iff(
              Array.isArray(actName2) && actName2.length > 0,
              actName2.map((name, index) => {
                if (index === actName2.length - 1) {
                  return name
                }
                return `${name}/ `
              }),
              ''
            )
          : []
      })
    }
  }

  response?.decision?.phases?.forEach((phase) => {
    let actName = []
    phaseName = phase?.name ? phase.name : ''
    if (phase.status === 'in-progress') {
      actName = response?.decision?.actors?.active
        ? response.decision.actors.active
            .map((act) =>
              act?.permissions?.approve && act?.phase === phase.name
                ? `${act.givenName} ${act.sn} (${act.mail})`
                : null
            )
            .filter((element) => element !== null)
        : null
    }
    if (
      phase?.status !== 'complete' ||
      (phase?.status === 'complete' && phase?.decision !== null)
    ) {
      let systemExpiredStatus = ''
      if (
        phase?.decision?.toLowerCase() === 'reject' &&
        phase?.completedBy?.id &&
        phase?.completedBy?.id.toLowerCase() === 'system'
      ) {
        systemExpiredStatus = 'Expired'
        actName = response?.decision?.actors?.inactive
          ? response.decision.actors.inactive
              .map((act) =>
                act?.permissions?.approve && act?.phase === phase.name
                  ? `${act?.givenName} ${act?.sn} (${act?.mail})`
                  : null
              )
              .filter((element) => element !== null)
          : null
      }

      phaseInfo.push({
        phaseId:
          phaseName === 'LineManagerApproval'
            ? 'LEVEL1 APPROVAL'
            : seperateWordsWithCapitalLetter(phaseName),
        phases: phase,
        status: phase.status,
        decision:
          systemExpiredStatus || iff(phase?.decision, capitalizeFirstLetter(phase?.decision), '--'),
        startDate: getFormattedDateTime(phase.startDate),
        completionDate: phase.completionDate ? getFormattedDateTime(phase.completionDate) : '--',
        approvalHisCompletionDate: phase.completionDate
          ? getFormattedDateTime(phase.completionDate)
          : '--',
        approverInfo:
          phase?.completedBy && systemExpiredStatus === ''
            ? `${phase?.completedBy?.givenName} ${phase?.completedBy?.sn} (${phase?.completedBy?.mail})`
            : iff(
                ![undefined, null, []].includes(actName) &&
                  Array.isArray(actName) &&
                  actName.length > 0,
                actName.map((name, index) => {
                  if (index === actName.length - 1) {
                    return name
                  }
                  return `${name}/ `
                }),
                ''
              )
      })
    }
  })
  let privateData
  if (response?.request?.common?.groupDetails?.dbagExtensionAttribute6) {
    const input = response?.request?.common?.groupDetails?.dbagExtensionAttribute6
    privateData = input.split('')
  }

  let robotBusinessDescription
  if (
    response?.request?.common?.groupDetails?.accessioGroupType &&
    response?.request?.common?.groupDetails?.accessioGroupType ===
      'Robot Object - Infrastructure Other'
  ) {
    if (
      response?.request?.common?.groupDetails?.description &&
      response?.request?.common?.groupDetails?.description.length > 0
    ) {
      robotBusinessDescription = response?.request?.common?.groupDetails?.description[0]
        .split(',')[2]
        .trim()
    }
  }

  return [
    {
      id: 'identificationRequestType',
      value: getSummaryRequestType(response?.requestType)
    },
    {
      id: 'accountType',
      value: getAccountType(response?.request, response?.requestType)
    },
    {
      id: 'dbagApplicationID',
      value: response?.request?.common?.accountDetails
        ? iff(
            response?.request?.common?.accountDetails?.dbagApplicationID,
            response?.request?.common?.accountDetails?.dbagApplicationID,
            ''
          )
        : iff(
            response?.request?.common?.groupDetails?.dbagApplicationID,
            iff(
              response?.request?.common?.groupDetails?.accessioGroupType ===
                'Robot Object - Infrastructure Other',
              '',
              response?.request?.common?.groupDetails?.dbagApplicationID
            ),
            ''
          )
    },
    {
      id: 'primaryAccount',
      value: response?.request?.common?.accountDetails?.primaryAccount
        ? response?.request?.common?.accountDetails?.primaryAccount
        : ''
    },
    {
      id: 'requestError',
      value: response?.request?.common?.accessioFailureMessage
        ? response?.request?.common?.accessioFailureMessage
        : ''
    },
    {
      id: 'domain',
      value: response?.request?.common?.accountDetails
        ? iff(
            response?.request?.common?.accountDetails?.domain,
            response?.request?.common?.accountDetails?.domain,
            ''
          )
        : iff(
            response?.request?.common?.groupDetails?.domain !== '',
            response?.request?.common?.groupDetails?.domain,
            ''
          )
    },
    {
      id: 'dbagCostcenter',
      value: response?.request?.common?.accountDetails
        ? iff(
            response?.request?.common?.accountDetails?.dbagCostcenter,
            response?.request?.common?.accountDetails?.dbagCostcenter,
            ''
          )
        : iff(
            response?.request?.common?.groupDetails?.dbagCostcenter !== '',
            response?.request?.common?.groupDetails?.dbagCostcenter,
            ''
          )
    },
    {
      id: 'department',
      value: response?.request?.common?.accountDetails
        ? iff(
            response?.request?.common?.accountDetails?.department,
            response?.request?.common?.accountDetails?.department,
            ''
          )
        : iff(
            response?.request?.common?.groupDetails?.department !== '',
            response?.request?.common?.groupDetails?.department,
            ''
          )
    },
    {
      id: 'region',
      value: response?.request?.common?.accountDetails?.l
        ? response?.request?.common?.accountDetails?.l
        : ''
    },
    {
      id: 'cyberarkregion',
      value:
        response?.request?.common?.groupDetails?.location !== ''
          ? response?.request?.common?.groupDetails?.location
          : ''
    },
    {
      id: 'accountStatus',
      value: response?.request?.common?.accountDetails?.userAccountControl
        ? response?.request?.common?.accountDetails?.userAccountControl
        : iff(
            response?.request?.common?.accountDetails?.accountStatus,
            response?.request?.common?.accountDetails?.accountStatus,
            ''
          )
    },
    {
      id: 'status',
      value: getStatus(response?.decision?.status, response?.decision?.outcome)
    },
    {
      id: 'description',
      value: response?.request?.common?.accountDetails
        ? iff(
            response?.request?.common?.accountDetails?.description,
            response?.request?.common?.accountDetails?.description,
            ''
          )
        : iff(
            response?.request?.common?.groupDetails?.description !== '',
            response?.request?.common?.groupDetails?.description,
            ''
          )
    },
    {
      id: 'recertificationPeriod',
      value: response?.request?.common?.accountDetails?.recertificationPeriod
        ? response?.request?.common?.accountDetails?.recertificationPeriod
        : ''
    },
    {
      id: 'sAMAccountName',
      value: getSAMAccountName(response?.request, response?.requestType)
    },
    {
      id: 'location',
      value: response?.request?.common?.accountDetails
        ? iff(
            response?.request?.common?.accountDetails?.l,
            response?.request?.common?.accountDetails?.l,
            ''
          )
        : iff(
            response?.request?.common?.groupDetails?.location !== '',
            response?.request?.common?.groupDetails?.location,
            ''
          )
    },
    {
      id: 'endlocation',
      value:
        response?.request?.common?.groupDetails?.location !== ''
          ? response?.request?.common?.groupDetails?.location
          : ''
    },
    {
      id: 'dbagDataPrivClass',
      value:
        response?.request?.common?.groupDetails?.dbagDataPrivClass !== ''
          ? response?.request?.common?.groupDetails?.dbagDataPrivClass
          : ''
    },
    {
      id: 'dwsPrivate',
      value:
        response?.request?.common?.groupDetails?.dbagExtensionAttribute6 &&
        response?.request?.common?.groupDetails?.dbagExtensionAttribute6 !== ''
          ? privateData[0]
          : ''
    },
    {
      id: 'clientPrivate',
      value:
        response?.request?.common?.groupDetails?.dbagExtensionAttribute6 &&
        response?.request?.common?.groupDetails?.dbagExtensionAttribute6 !== ''
          ? privateData[1]
          : ''
    },
    {
      id: 'dbPrivate',
      value:
        response?.request?.common?.groupDetails?.dbagExtensionAttribute6 &&
        response?.request?.common?.groupDetails?.dbagExtensionAttribute6 !== ''
          ? privateData[2]
          : ''
    },
    {
      id: 'serviceNowLevel',
      value: response?.request?.common?.accountDetails?.serviceNowLevel
        ? response?.request?.common?.accountDetails?.serviceNowLevel
        : ''
    },
    {
      id: 'dbagInfrastructureID',
      value: response?.request?.common?.accountDetails
        ? response?.request?.common?.accountDetails?.dbagInfrastructureID
        : iff(
            response?.request?.common?.groupDetails?.dbagInfrastructureID,
            response?.request?.common?.groupDetails?.dbagInfrastructureID,
            ''
          )
    },
    {
      id: 'platformType',
      value: response?.request?.common?.accountDetails?.platformType
        ? response?.request?.common?.accountDetails?.platformType
        : ''
    },
    {
      id: 'accessioPlatformType',
      value: response?.request?.common?.groupDetails?.accessioPlatformType
        ? response?.request?.common?.groupDetails?.accessioPlatformType
        : ''
    },
    {
      id: 'accountAccessLevel',
      value: response?.request?.common?.accountDetails?.accountAccessLevel
        ? response?.request?.common?.accountDetails?.accountAccessLevel
        : ''
    },
    {
      id: 'accountNameSuffix',
      value: response?.request?.common?.accountDetails?.accountNameSuffix
        ? response?.request?.common?.accountDetails?.accountNameSuffix
        : ''
    },
    {
      id: 'accountNameMiddle',
      value: response?.request?.common?.accountDetails?.middleName
        ? response?.request?.common?.accountDetails?.middleName
        : iff(
            response?.request?.common?.accountDetails?.accountNameMiddle,
            response?.request?.common?.accountDetails?.accountNameMiddle,
            ''
          )
    },
    {
      id: 'passwordNeverExpires',
      value: [true, false].includes(response?.request?.common?.accountDetails?.passwordNeverExpires)
        ? response?.request?.common?.accountDetails?.passwordNeverExpires
        : ''
    },
    {
      id: 'expiry',
      value:
        response?.request?.common?.accountDetails?.accountExpires &&
        ![0, undefined, null].includes(response?.request?.common?.accountDetails?.accountExpires)
          ? getFormattedDateTime(response?.request?.common?.accountDetails?.accountExpires)
          : ''
    },
    {
      id: 'requestNo',
      value: response?.request?.common?.Accessio_Request_No
        ? response?.request?.common?.Accessio_Request_No
        : ''
    },
    {
      id: 'bulkRequestNo',
      value: response?.request?.common?.AccessioBulkRequestNumber
        ? response?.request?.common?.AccessioBulkRequestNumber
        : ''
    },
    {
      id: 'recipient',
      value: response?.request?.common?.recepientMail
        ? convertMailtoName(response?.request?.common?.recepientMail)
        : ''
    },
    {
      id: 'requester',
      value: response?.requester?.mail ? convertMailtoName(response?.requester?.mail) : ''
    },
    {
      id: 'requestType',
      value: getRequestType(response?.requestType)
    },
    {
      id: 'requestDate',
      value: iff(
        formattedDate(response?.decision?.startDate),
        formattedDate(response?.decision?.startDate), // ALM2105
        ''
      )
    },
    {
      id: 'completionDate',
      value: response?.decision?.completionDate
        ? getFormattedDateTime(response?.decision?.completionDate).split(' ')[0]
        : ''
    },
    {
      id: 'approvalDate',
      value: response?.decision?.approvalDate
        ? formattedDate(response?.decision?.approvalDate.split('T')[0])
        : ''
    },
    {
      id: 'expiryDate',
      value: response?.request?.common?.endDate
        ? formattedDate(response?.request?.common?.endDate)
        : ''
    },
    { id: 'id', value: response?.id ? response?.id : '' },
    {
      id: 'providedComments',
      value: response?.decision?.comments ? response?.decision?.comments.reverse() : ''
    },
    {
      id: 'justification',
      value: response?.request?.common?.requestJustification
        ? response?.request?.common?.requestJustification
        : ''
    },
    {
      id: 'businessJustification',
      value: response?.request?.common?.requestJustification
        ? response?.request?.common?.requestJustification
        : ''
    },
    {
      id: 'phasesInfo',
      value: phaseInfo
    },
    {
      id: 'phase',
      value: phaseName
    },
    {
      id: 'adGroupType',
      value: response?.request?.common?.groupDetails?.dbagRecerttype
        ? response?.request?.common?.groupDetails?.dbagRecerttype
        : ''
    },
    {
      id: 'adGroupSubType',
      value: response?.request?.common?.groupDetails?.dbagRecertSubtype
        ? response?.request?.common?.groupDetails?.dbagRecertSubtype
        : ''
    },
    {
      id: 'accessioGroupType',
      value: response?.request?.common?.groupDetails?.accessioGroupType
        ? response?.request?.common?.groupDetails?.accessioGroupType
        : ''
    },
    {
      id: 'digitalIdentity',
      value: response?.request?.common?.groupDetails?.digitalIdentity
        ? response?.request?.common?.groupDetails?.digitalIdentity
        : ''
    },
    {
      id: 'role',
      value: response?.request?.common?.groupDetails?.role
        ? response?.request?.common?.groupDetails?.role
        : ''
    },
    {
      id: 'approverLevel',
      value: response?.request?.common?.groupDetails?.approverLevel
        ? response?.request?.common?.groupDetails?.approverLevel
        : ''
    },
    {
      id: 'categoryReference',
      value: response?.request?.common?.groupDetails?.categoryReference
        ? response?.request?.common?.groupDetails?.categoryReference
        : ''
    },
    {
      id: 'versionIterationofGroup',
      value: response?.request?.common?.groupDetails?.versionIterationofGroup
        ? response?.request?.common?.groupDetails?.versionIterationofGroup
        : ''
    },
    {
      id: 'vRMID',
      value: response?.request?.common?.groupDetails?.vRMID
        ? response?.request?.common?.groupDetails?.vRMID
        : ''
    },
    {
      id: 'groupNameText',
      value: response?.request?.common?.groupDetails?.groupNameText
        ? response?.request?.common?.groupDetails?.groupNameText
        : ''
    },
    {
      id: 'projectName',
      value: response?.request?.common?.groupDetails?.projectName
        ? response?.request?.common?.groupDetails?.projectName
        : ''
    },
    {
      id: 'productionUATorDEV',
      value: response?.request?.common?.groupDetails?.productionUATorDEV
        ? response?.request?.common?.groupDetails?.productionUATorDEV
        : ''
    },
    {
      id: 'applicationName',
      value: response?.request?.common?.groupDetails?.applicationName
        ? response?.request?.common?.groupDetails?.applicationName
        : ''
    },
    {
      id: 'groupRole',
      value: response?.request?.common?.groupDetails?.groupRole
        ? response?.request?.common?.groupDetails?.groupRole
        : ''
    },
    {
      id: 'safeName',
      value: response?.request?.common?.groupDetails?.safeName
        ? response?.request?.common?.groupDetails?.safeName
        : ''
    },
    {
      id: 'enterpriseServices',
      value: response?.request?.common?.groupDetails?.enterpriseServices
        ? response?.request?.common?.groupDetails?.enterpriseServices
        : ''
    },
    {
      id: 'dLPEnvironment',
      value: response?.request?.common?.groupDetails?.dLPEnvironment
        ? response?.request?.common?.groupDetails?.dLPEnvironment
        : ''
    },
    {
      id: 'dLPGroupRole',
      value: response?.request?.common?.groupDetails?.dLPGroupRole
        ? response?.request?.common?.groupDetails?.dLPGroupRole
        : ''
    },
    {
      id: 'serverName',
      value: ['Remove Membership', 'Add Membership'].includes(response?.request?.common?.operation)
        ? iff(
            response?.request?.common?.serverDN,
            response?.request?.common?.serverDN?.split(',')[0].split('=')[1],
            ''
          )
        : iff(
            response?.request?.common?.groupDetails?.serverName,
            response?.request?.common?.groupDetails?.serverName,
            ''
          )
    },
    {
      id: 'vendorteamName',
      value: response?.request?.common?.groupDetails?.vendorteamName
        ? response?.request?.common?.groupDetails?.vendorteamName
        : ''
    },
    {
      id: 'samLocation',
      value: response?.request?.common?.groupDetails?.location
        ? response?.request?.common?.groupDetails?.location
        : ''
    },
    {
      id: 'samAccount',
      value: response?.request?.common?.groupDetails?.cn
        ? response?.request?.common?.groupDetails?.cn
        : ''
    },
    {
      id: 'isGroupPrivileged',
      value: response?.request?.common?.groupDetails?.accessioIsGroupPrivileged
        ? response?.request?.common?.groupDetails?.accessioIsGroupPrivileged
        : ''
    },
    {
      id: 'dataSecurityClass',
      value: response?.request?.common?.groupDetails?.dbagIMSDataSecCLass
        ? response?.request?.common?.groupDetails?.dbagIMSDataSecCLass
        : ''
    },
    {
      id: 'accessioIsgMSAGroup',
      value: response?.request?.common?.groupDetails?.accessioIsgMSAGroup
        ? response?.request?.common?.groupDetails?.accessioIsgMSAGroup
        : ''
    },
    {
      id: 'dbagExtensionAttribute3',
      value: response?.request?.common?.groupDetails?.dbagExtensionAttribute3
        ? response?.request?.common?.groupDetails?.dbagExtensionAttribute3
        : ''
    },
    {
      id: 'groupType',
      value: response?.request?.common?.groupDetails?.groupType
        ? response?.request?.common?.groupDetails?.groupType
        : ''
    },
    {
      id: 'groupScope',
      value: response?.request?.common?.groupDetails?.groupScope
        ? response?.request?.common?.groupDetails?.groupScope
        : ''
    },
    {
      id: 'dbSRSApproverLevel',
      value: response?.request?.common?.groupDetails?.dbSRSApproverLevel
        ? response?.request?.common?.groupDetails?.dbSRSApproverLevel
        : ''
    },
    {
      id: 'dbagExternalProvider',
      value: response?.request?.common?.groupDetails?.dbagExternalProvider
        ? response?.request?.common?.groupDetails?.dbagExternalProvider
        : ''
    },
    {
      id: 'info',
      value: response?.request?.common?.groupDetails?.info
        ? response?.request?.common?.groupDetails?.info
        : ''
    },
    {
      id: 'dbagExtensionAttribute2',
      value: response?.request?.common?.groupDetails?.dbagExtensionAttribute2
        ? response?.request?.common?.groupDetails?.dbagExtensionAttribute2
        : ''
    },
    {
      id: 'dbagProcessingdata',
      value: response?.request?.common?.groupDetails?.dbagProcessingdata
        ? response?.request?.common?.groupDetails?.dbagProcessingdata
        : ''
    },
    {
      id: 'entitlement',
      value: response?.request?.common?.groupDetails?.dbagEntitlement
        ? response?.request?.common?.groupDetails?.dbagEntitlement
        : ''
    },
    {
      id: 'dbagFileSystemFullPaths',
      value: response?.request?.common?.groupDetails?.dbagFileSystemFullPaths
        ? response?.request?.common?.groupDetails?.dbagFileSystemFullPaths
        : ''
    },
    {
      id: 'IsgMSAGroup',
      value: response?.request?.common?.groupDetails?.IsgMSAGroup
        ? response?.request?.common?.groupDetails?.IsgMSAGroup
        : ''
    },
    {
      id: 'accessToPSI',
      value: response?.request?.common?.groupDetails?.accessToPSI
        ? response?.request?.common?.groupDetails?.accessToPSI
        : ''
    },
    {
      id: 'RobotBusinessDescription',
      value: response?.request?.common?.groupDetails?.description ? robotBusinessDescription : ''
    },
    {
      id: 'platformType',
      value: response?.request?.common?.groupDetails?.platformType
        ? response?.request?.common?.groupDetails?.platformType
        : ''
    },
    {
      id: 'mAMs',
      value:
        response?.request?.common?.groupDetails?.dbagApplicationID ||
        response?.request?.common?.groupDetails?.mAMs?.[0]
          ? iff(
              response?.request?.common?.groupDetails?.accessioGroupType ===
                'Robot Object - Infrastructure Other',
              response?.request?.common?.groupDetails?.dbagApplicationID ||
                response?.request?.common?.groupDetails?.mAMs?.[0],
              ''
            )
          : ''
    },
    {
      id: 'accessioPrerequisiteRMPRoles',
      value: response?.request?.common?.groupDetails?.accessioPrerequisiteRMPRoles
        ? response?.request?.common?.groupDetails?.accessioPrerequisiteRMPRoles
        : ''
    },
    {
      id: 'dbagSupportGroup',
      value: response?.request?.common?.groupDetails?.dbagSupportGroup
        ? response?.request?.common?.groupDetails?.dbagSupportGroup
        : ''
    },
    {
      id: 'userScopeRestriction',
      value: response?.request?.common?.groupDetails?.userScopeRestriction
        ? response?.request?.common?.groupDetails?.userScopeRestriction
        : ''
    },
    {
      id: 'dlpOu',
      value: response?.request?.common?.groupDetails?.location
        ? response?.request?.common?.groupDetails?.location
        : ''
    },
    {
      id: 'externalRequestId',
      value: response?.request?.common?.externalRequestId
        ? response?.request?.common?.externalRequestId
        : ''
    },
    {
      id: 'dbagIMSAuthContact',
      value: response?.request?.common?.groupDetails?.dbagIMSAuthContact
        ? response?.request?.common?.groupDetails?.dbagIMSAuthContact
        : ''
    },
    {
      id: 'dbagIMSAuthContactDelegate',
      value: response?.request?.common?.groupDetails?.dbagIMSAuthContactDelegate
        ? response?.request?.common?.groupDetails?.dbagIMSAuthContactDelegate
        : ''
    },
    {
      id: 'dbagIMSApprovers',
      value: response?.request?.common?.groupDetails?.dbagIMSApprovers
        ? response?.request?.common?.groupDetails?.dbagIMSApprovers.join(', ')
        : ''
    },
    {
      id: 'pSIDescription',
      value: response?.request?.common?.groupDetails?.pSIDescription
        ? response?.request?.common?.groupDetails?.pSIDescription
        : ''
    },
    {
      id: 'categoryEnt',
      value: response?.request?.common?.category ? response?.request?.common?.category : ''
    },
    {
      id: 'operation',
      value: response?.request?.common?.operation ? response?.request?.common?.operation : ''
    },
    {
      id: 'requestJustification',
      value: response?.request?.common?.requestJustification
        ? response?.request?.common?.requestJustification
        : ''
    },
    {
      id: 'accountDN',
      value: response?.request?.common?.accountDN
        ? response?.request?.common?.accountDN.split(',').slice(-4)[0]?.split('=')[1]
        : ''
    },
    {
      id: 'groupDN',
      value: response?.request?.common?.groupDN
        ? response?.request?.common?.groupDN.split(',').slice(-4)[0]?.split('=')[1]
        : ''
    },
    {
      id: 'accountName',
      value: response?.request?.common?.accountDN
        ? response?.request?.common?.accountDN.split(',')[0].split('=')[1]
        : ''
    },
    {
      id: 'groupName',
      value: response?.request?.common?.groupDN
        ? response?.request?.common?.groupDN.split(',')[0].split('=')[1]
        : ''
    },
    {
      id: 'serverDN',
      value: response?.request?.common?.serverDN
        ? response?.request?.common?.serverDN.split(',').slice(-4)[0]?.split('=')[1]
        : ''
    },
    {
      id: 'serverDN',
      value: response?.request?.common?.serverDN
        ? response?.request?.common?.serverDN.split(',').slice(-4)[0]?.split('=')[1]
        : ''
    },
    {
      id: 'itao',
      value: response?.request?.common?.accountDetails?.iTAO
        ? response?.request?.common?.accountDetails?.iTAO
        : ''
    },
    {
      id: 'itaoDelegate',
      value: response?.request?.common?.accountDetails?.iTAODelegate
        ? response?.request?.common?.accountDetails?.iTAODelegate
        : ''
    },
    {
      id: 'PrincipalsAllowedToRetrieveManagedPassword',
      value: response?.request?.common?.accountDetails?.PrincipalsAllowedToRetrieveManagedPassword
        ? response?.request?.common?.accountDetails?.PrincipalsAllowedToRetrieveManagedPassword
        : ''
    },
    {
      id: 'KerberosEncryptionType',
      value: response?.request?.common?.accountDetails?.KerberosEncryptionType
        ? checkKerberosEncryptionType(
            response?.request?.common?.accountDetails?.KerberosEncryptionType
          )
        : ''
    },
    {
      id: 'ManagedPasswordIntervalInDays',
      value: response?.request?.common?.accountDetails?.ManagedPasswordIntervalInDays
        ? response?.request?.common?.accountDetails?.ManagedPasswordIntervalInDays
        : ''
    },
    {
      id: 'dbagModifiedBy',
      value: response?.request?.common?.groupDetails?.dbagModifiedBy
        ? response?.request?.common?.groupDetails?.dbagModifiedBy
        : ''
    }
  ]
}

export const sortRequestHistory = (payload) =>
  axios({
    url: `/v0/sort/common`,
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
          requestedItem: getRequestItem(item),
          completionDate: item._source.decision?.completionDate
            ? getFormattedDateTime(item._source.decision?.completionDate).split(' ')[0]
            : '',
          approvalHisCompletionDate: item._source.decision?.completionDate
            ? formattedDate(item._source.decision?.completionDate.split('T')[0])
            : '',
          // eslint-disable-next-line no-nested-ternary
          approvalDate: item._source.decision?.completionDate
            ? formattedDate((item._source.decision?.completionDate).split('T')[0])
            : item._source.decision?.phases &&
              ![null, 'null'].includes(item?._source?.decision?.phases[0]?.decision) &&
              item._source.decision?.phases[0]?.completionDate
            ? formattedDate((item?._source?.decision?.phases[0]?.completionDate).split('T')[0])
            : '',
          requestDate: iff(
            formattedDate(item._source.decision?.startDate),
            formattedDate(item._source.decision?.startDate), // ALM2105 changes
            ''
          ),
          expiry: item._source.request?.common?.endDate
            ? formattedDate(item._source.request?.common?.endDate)
            : '',
          comments: item._source.decision?.comments ? item._source.decision?.comments : '',
          permissions: item._source.decision?.actors?.active[0]?.permissions
            ? item._source.decision?.actors?.active[0]?.permissions
            : '',
          requester: item._source.request?.common?.requestorMail
            ? convertMailtoName(item._source.request?.common?.requestorMail)
            : '',
          recipient: item._source.request?.common?.recepientMail
            ? convertMailtoName(item._source.request?.common?.recepientMail)
            : '',
          requestNumber: item._source.request?.common?.Accessio_Request_No,
          sortKeyword: item?.sort ? item.sort[0] : [],
          recipientMail: item._source.request?.common?.recepientMail
            ? item._source.request?.common?.recepientMail
            : '',
          requesterMail: item._source.request?.common?.requestorMail
            ? item._source.request?.common?.requestorMail
            : '',
          bulkRequestId: item._source.request?.common?.AccessioBulkRequestNumber,
          category: item?._source?.request?.common?.category,
          operation: item?._source?.request?.common?.operation,
          phase: inProgressPhase && inProgressPhase[0] ? inProgressPhase[0] : '',
          phases: item?._source?.decision?.phases ? item?._source?.decision?.phases : ''
        })
      })
      results.historyData = historyData
      return results
    })
    .catch((error) => console.error(error))
// Sort Approval History API call
export const sortApprovalHistory = (payload, email) =>
  axios({
    url: `/v0/sort/common`,
    method: 'post',
    data: payload
  })
    .then((res) => {
      const approvalData = []
      const results = {}
      results.total = res?.data?.hits?.total?.value
      res.data.hits.hits.forEach((item) => {
        const approvalAction = item?._source?.decision?.phases
          .map((phase) => (phase?.completedBy?.mail === email ? phase.decision : null))
          .filter((element) => element !== null)
        /* eslint no-underscore-dangle: 0 */
        approvalData.push({
          id: item._source.id,
          status: getStatus(item._source?.decision?.status, item._source?.decision?.outcome),
          itAssests: item._source.request?.common?.applicationName
            ? item._source.request?.common?.applicationName
            : '',
          requestType: getRequestType(item?._source?.requestType),
          completionDate: item._source.decision?.completionDate
            ? getFormattedDateTime(item._source.decision?.completionDate).split(' ')[0]
            : '',
          approvalHisCompletionDate:
            item._source?.decision?.phases?.length >= 0
              ? getCompletionDateFromPhases(item._source?.decision?.phases)
              : iff(
                  item._source?.decision?.completionDate,
                  formattedDate((item._source?.decision?.completionDate).split('T')[0]),
                  ''
                ),
          requestDate: iff(
            formattedDate(item?._source?.decision?.startDate),
            formattedDate(item?._source?.decision?.startDate), // ALM2105
            ''
          ),
          requestedItem: getRequestItem(item),
          expiry: item._source.request?.common?.endDate
            ? formattedDate(item._source.request?.common?.endDate)
            : '',
          comments: item._source.decision?.comments ? item._source.decision?.comments : '',
          permissions: item._source.decision?.actors?.active[0]?.permissions
            ? item._source.decision?.actors?.active[0]?.permissions
            : '',
          requester: item._source.request?.common?.requestorMail
            ? convertMailtoName(item._source.request?.common?.requestorMail)
            : '',
          recipient: item._source.request?.common?.recepientMail
            ? convertMailtoName(item._source.request?.common?.recepientMail)
            : '',
          requestNumber: item._source.request?.common?.Accessio_Request_No,
          category: item?._source?.request?.common?.category,
          operation: item?._source?.request?.common?.operation,
          approvalAction: approvalAction.length > 0 ? capitalizeFirstLetter(approvalAction[0]) : '',
          recipientMail: item._source.request?.common?.recepientMail
            ? item._source.request?.common?.recepientMail
            : '',
          requesterMail: item._source.request?.common?.requestorMail
            ? item._source.request?.common?.requestorMail
            : '',
          bulkRequestId: item._source?.request?.common?.AccessioBulkRequestNumber
            ? item._source?.request?.common.AccessioBulkRequestNumber
            : '',
          sortKeyword: item?.sort ? item.sort[0] : []
        })
      })
      results.approvalData = approvalData
      return results
    })
    .catch((error) => console.error(error))

export const getGroupHistorySummaryStructure = async () => {
  const response = await axios({
    method: 'get',
    url: '/v0/configuration/metaType=groupApprovalSummary'
  })
    .then((res) => res.data)
    .catch((error) => console.error(error))
  return response
}
// right now pointing to local..later need to map to actual api
export const getEntitlementHistorySummaryStructure = async () => {
  const response = await axios({
    method: 'get',
    // url: '/v0/configuration/metaType=entitlementApprovalSummary'
    url: '/api/metadata/entitlementApprovalSummary',
    baseURL: 'http://localhost:8081'
  })
    .then((res) => res.data)
    .catch((error) => console.error(error))
  return response
}

export const cancelRequest = async (requestId, phaseId) => {
  const response = await axios({
    method: 'post',
    url: `/v0/governance/cancelReq`,
    data: {
      phaseName: phaseId,
      requestId,
      comment: 'cancel request'
    }
  })
    .then((res) => res)
    .catch((error) => console.error(error))
  return response
}

// TODO: below functiona will be enable in future
const getCount = async (list, email) => {
  const data = []
  await Promise.all(
    list?.map(async (obj) => {
      switch (obj?.id[0]) {
        case 'reviewshistory':
          await axios(`/v0/dashboard/reviews?status=complete`)
            .then((res) => {
              data.push({
                id: obj.id,
                count: res?.data?.reviews,
                redirectTo: obj.redirectTo,
                data: obj.data,
                displayInMenu: obj.displayInMenu
              })
            })
            .catch((err) => {
              console.error(err)
              data.push({ ...obj, count: 0 })
            })
          break
        case 'approvals':
          await getHistoryData(
            {
              approvalStatus: 'complete',
              pageSize: 10,
              pageNumber: 0
            },
            email
          )
            .then((res) => {
              data.push({
                id: obj?.id,
                count: res?.total || 0,
                redirectTo: obj?.redirectTo,
                data: obj?.data,
                displayInMenu: obj.displayInMenu
              })
            })
            .catch((err) => {
              console.error(err)
              data.push({ ...obj, count: 0 })
            })
          break
        case 'violations':
          data.push({
            id: obj.id,
            count: 0,
            redirectTo: obj.redirectTo,
            data: obj.data
          })

          break
        case 'requesthistory':
          await getRequestHistory(10, 0)
            .then((res) => {
              data.push({
                id: obj.id,
                count: res.total,
                redirectTo: obj.redirectTo,
                data: obj.data,
                displayInMenu: obj.displayInMenu
              })
            })
            .catch((err) => {
              console.error(err)
              data.push({ ...obj, count: 0 })
            })
          break

        default:
          break
      }
    })
  )
  return data
}

export const getHistoryMeta = async (email) => {
  // This API call required for future development and debugging
  // const response = await axios({
  //   url: '/api/metadata/historyDashboard',
  //   baseURL: 'http://localhost:8081'
  // }).then((res) => res.data)

  const response = await axios(`/v0/configuration/metaType=historyDashboard`) //  Passing  historyDashboard for MetaType as this is the stored in config files
    .then((res) => res.data)
    .catch((error) => console.error(error))
  return getCount(response, email)
}

export const getRequestHistoryByUser = async (payload) =>
  axios({
    url: `/v0/requests/myReporteeAllRequests`,
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
            ? getFormattedDateTime(item._source.decision?.completionDate).split(' ')[0]
            : '',
          approvalHisCompletionDate: item._source.decision?.completionDate
            ? formattedDate((item._source.decision?.completionDate).split('T')[0])
            : '',
          requestDate: iff(
            formattedDate(item?._source?.decision?.startDate),
            formattedDate(item?._source?.decision?.startDate), // ALM2105
            ''
          ),
          // eslint-disable-next-line no-nested-ternary
          approvalDate: item._source.decision?.completionDate
            ? formattedDate((item._source.decision?.completionDate).split('T')[0])
            : item._source.decision?.phases &&
              ![null, 'null'].includes(item?._source?.decision?.phases[0]?.decision) &&
              item._source.decision?.phases[0]?.completionDate
            ? formattedDate((item?._source?.decision?.phases[0]?.completionDate).split('T')[0])
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
          requestNumber: item._source.request?.common?.Accessio_Request_No,
          bulkRequestId: item._source.request?.common?.AccessioBulkRequestNumber,
          sortKeyword: item?.sort ? item.sort[0] : [],
          recipientMail: item._source.request?.common?.recepientMail
            ? item._source.request?.common?.recepientMail
            : '',
          category: item._source.request?.common?.category
            ? item._source.request?.common?.category
            : '',
          operation: item._source.request?.common?.operation
            ? item._source.request?.common?.operation
            : '',
          phase: inProgressPhase && inProgressPhase[0] ? inProgressPhase[0] : '',
          phases: item?._source?.decision?.phases ? item?._source?.decision?.phases : ''
        })
      })
      results.historyData = historyData
      return results
    })
    .catch((error) => console.error(error))

export const sortRequestHistoryByReportee = (payload) =>
  axios({
    url: `/v0/requests/myReporteeAllRequests/sort`,
    method: 'post',
    data: payload
  })
    .then((res) => {
      const historyData = []
      const results = {}
      results.total = res?.data?.hits?.total?.value
      res.data.hits.hits.forEach((item) => {
        historyData.push({
          id: item._source.id,
          status: getStatus(item._source?.decision?.status, item._source?.decision?.outcome),
          itAssests: item._source.request?.common?.applicationName
            ? item._source.request?.common?.applicationName
            : '',
          requestType: getRequestType(item?._source?.requestType),
          requestedItem: getRequestItem(item),
          completionDate: item._source.decision?.completionDate
            ? getFormattedDateTime(item._source.decision?.completionDate).split(' ')[0]
            : '',
          approvalHisCompletionDate: item._source.decision?.completionDate
            ? formattedDate(item._source.decision?.completionDate.split('T')[0])
            : '',
          requestDate: item._source.metadata?.created.split('T')[0]
            ? formattedDate(item._source.metadata?.created.split('T')[0])
            : '',
          expiry: item._source.request?.common?.endDate
            ? formattedDate(item._source.request?.common?.endDate)
            : '',
          comments: item._source.decision?.comments ? item._source.decision?.comments : '',
          permissions: item._source.decision?.actors?.active[0]?.permissions
            ? item._source.decision?.actors?.active[0]?.permissions
            : '',
          requester: item._source.request?.common?.requestorMail
            ? convertMailtoName(item._source.request?.common?.requestorMail)
            : '',
          recipient: item._source.request?.common?.recepientMail
            ? convertMailtoName(item._source.request?.common?.recepientMail)
            : '',
          requestNumber: item._source.request?.common?.Accessio_Request_No,
          bulkRequestId: item._source.request?.common?.AccessioBulkRequestNumber,
          sortKeyword: item?.sort ? item.sort[0] : [],
          recipientMail: item._source.request?.common?.recepientMail
            ? item._source.request?.common?.recepientMail
            : '',
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

export const searchRequestHistoryByReportee = (payload) =>
  axios({
    url: `/v0/requests/myReporteeAllRequests/search`,
    method: 'post',
    data: payload
  })
    .then((res) => {
      const historyData = []
      const results = {}
      results.total = res?.data?.hits?.total?.value
      res.data.hits.hits.forEach((item) => {
        historyData.push({
          id: item._source.id,
          status: getStatus(item._source?.decision?.status, item._source?.decision?.outcome),
          itAssests: item._source.request?.common?.applicationName
            ? item._source.request?.common?.applicationName
            : '',
          requestType: getRequestType(item?._source?.requestType),

          requestedItem: getRequestItem(item),
          completionDate: item._source.decision?.completionDate
            ? getFormattedDateTime(item._source.decision?.completionDate).split(' ')[0]
            : '',
          approvalHisCompletionDate: item._source.decision?.completionDate
            ? formattedDate(item._source.decision?.completionDate.split('T')[0])
            : '',
          requestDate: item._source.metadata?.created.split('T')[0]
            ? formattedDate(item._source.metadata?.created.split('T')[0])
            : '',
          expiry: item._source.request?.common?.endDate
            ? formattedDate(item._source.request?.common?.endDate)
            : formattedDate(item?._source?.request?.common?.accountDetails?.accountExpires),
          comments: item._source.decision?.comments ? item._source.decision?.comments : '',
          permissions: item._source.decision?.actors?.active[0]?.permissions
            ? item._source.decision?.actors?.active[0]?.permissions
            : '',
          requester: item._source.request?.common?.requestorMail
            ? convertMailtoName(item._source.request?.common?.requestorMail)
            : '',
          recipient: item._source.request?.common?.recepientMail
            ? convertMailtoName(item._source.request?.common?.recepientMail)
            : '',
          requestNumber: item._source.request?.common?.Accessio_Request_No,
          bulkRequestId: item._source.request?.common?.AccessioBulkRequestNumber,
          sortKeyword: item?.sort ? item.sort[0] : [],
          recipientMail: item._source.request?.common?.recepientMail
            ? item._source.request?.common?.recepientMail
            : '',
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
