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

const getRequestType = (requestType) => {
  switch (requestType) {
    case 'createResource':
      return 'CREATE GROUP'
    case 'modifyResource':
      return 'MODIFY GROUP'
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
const capitalizeRequester = (res) => {
  const givenName = res?.requester?.givenName ? res?.requester?.givenName : ''
  const snName = res?.requester?.sn ? res?.requester?.sn : ''
  let capitalizedGn = ''
  let capitalizedsN = ''
  if (givenName.length > 0) {
    capitalizedGn = capitalizeFirstLetter(givenName)
  }
  if (snName.length > 0) {
    capitalizedsN = capitalizeFirstLetter(snName)
  }
  return `${capitalizedGn} ${capitalizedsN} `
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

export const getApprovalsMeta = async () => {
  const response = await axios(`/v0/configuration/metaType=approvalTable`).then((res) => res.data)
  return response
}

// This API call required for future development and debugging
// export const getApprovalsMeta = async () => {
//   const response = await axios({
//     url: '/api/metadata/approvalMeta',
//     baseURL: 'http://localhost:8081'
//   }).then((res) => res.data)

//   return response
// }

export const searchApprovals = (payload) =>
  axios({
    url: `/v0/search/common`,
    data: payload,
    method: 'post'
  }).then((res) => {
    const result = {}
    result.total = res?.data?.hits?.total?.value
    const approvalData = []
    res?.data?.hits?.hits?.forEach((item) => {
      /* eslint no-underscore-dangle: 0 */
      const inProgressPhase = item?._source?.decision?.phases
        ? item?._source?.decision?.phases
            .map((act) => (act.status === 'in-progress' ? act.name : null))
            .filter((element) => element !== null)
        : null

      const comments = item?._source?.decision?.comments
      comments.reverse()

      approvalData.push({
        id: item?._source?.id,
        status:
          item?._source?.decision?.status === 'in-progress'
            ? 'IN-PROGRESS'
            : item?._source?.decision?.status,
        justification: item?._source?.request?.common?.requestJustification,
        requestType: getRequestType(item?._source?.requestType),
        requestedItem: getRequestItem(item),
        requestDate: iff(
          formattedDate(item?._source?.decision?.startDate),
          formattedDate(item?._source?.decision?.startDate), // ALM 2105
          ''
        ),
        expiry: formattedDate(item?._source?.request?.common?.endDate),
        comment: comments,
        permissions: item?._source?.decision?.actors?.active[0]?.permissions,
        requester: item._source.request?.common?.requestorMail
          ? convertMailtoName(item._source.request?.common?.requestorMail)
          : '',
        recipient: convertMailtoName(item?._source?.request?.common?.recepientMail),
        requestNumber: item._source.request?.common?.Accessio_Request_No,
        bulkRequestNumber: item?._source?.request?.common?.AccessioBulkRequestNumber,
        category: item?._source?.request?.common?.category,
        operation: item?._source?.request?.common?.operation,
        phase: inProgressPhase && inProgressPhase[0] ? inProgressPhase[0] : '',
        recipientMail: item._source.request?.common?.recepientMail
          ? item._source.request?.common?.recepientMail
          : '',
        requesterMail: item._source?.decision?.actors?.active[0]?.mail
          ? item._source?.decision?.actors?.active[0]?.mail
          : '',
        vipApprover:
          item?._source?.request?.common?.vipApprover &&
          Object.keys(item?._source?.request?.common?.vipApprover).length > 0 &&
          inProgressPhase &&
          inProgressPhase[0]
            ? item?._source?.request?.common?.vipApprover[inProgressPhase[0]]
            : ''
      })
    })
    result.approvalData = approvalData
    return result
  })

export const getApprvals = async () =>
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
      const result = {}
      result.total = res?.data?.hits?.total?.value
      const approvalData = []
      res?.data?.hits?.hits?.forEach((item) => {
        /* eslint no-underscore-dangle: 0 */
        const inProgressPhase = item?._source?.decision?.phases
          ? item?._source?.decision?.phases
              .map((act) => (act.status === 'in-progress' ? act.name : null))
              .filter((element) => element !== null)
          : null

        const approverIds = []
        item?._source?.decision?.actors?.active?.map((data) => {
          if (data.phase) {
            approverIds.push(data.id.split('/')[2])
          }
          return data
        })

        const comments = item?._source?.decision?.comments
        comments.reverse()

        approvalData.push({
          id: item?._source?.id,
          status:
            item?._source?.decision?.status === 'in-progress'
              ? 'IN-PROGRESS'
              : item?._source?.decision?.status,
          justification: item?._source?.request?.common?.requestJustification,
          requestType: getRequestType(item?._source?.requestType),
          requestedItem: getRequestItem(item),
          requestDate: iff(
            formattedDate(item?._source?.decision?.startDate),
            formattedDate(item?._source?.decision?.startDate), // ALM 2105
            ''
          ),
          expiry: formattedDate(item?._source?.request?.common?.endDate),
          comment: comments,
          permissions: item?._source?.decision?.actors?.active[0]?.permissions,
          requester: item._source.request?.common?.requestorMail
            ? convertMailtoName(item._source.request?.common?.requestorMail)
            : '',
          recipient: convertMailtoName(item?._source?.request?.common?.recepientMail),
          requestNumber: item?._source?.request?.common?.Accessio_Request_No,
          bulkRequestNumber: item?._source?.request?.common?.AccessioBulkRequestNumber,
          category: item?._source?.request?.common?.category,
          operation: item?._source?.request?.common?.operation,
          phase: inProgressPhase && inProgressPhase[0] ? inProgressPhase[0] : '',
          requestID: item?._source?.id,
          approverID: approverIds,
          requestorID: item?._source?.requester?.id,
          common: item?._source?.request?.common ? item._source.request.common : {},
          checked: false,
          recipientMail: item._source.request?.common?.recepientMail
            ? item._source.request?.common?.recepientMail
            : '',
          requesterMail: item._source.request?.common?.requestorMail
            ? item._source.request?.common?.requestorMail
            : '',
          vipApprover:
            item?._source?.request?.common?.vipApprover &&
            Object.keys(item?._source?.request?.common?.vipApprover).length > 0 &&
            inProgressPhase &&
            inProgressPhase[0]
              ? item?._source?.request?.common?.vipApprover[inProgressPhase[0]]
              : '',
          sortKeyword: item?.sort ? item.sort[0] : []
        })
      })
      result.approvalData = approvalData
      return result
    })

export const getApprovalSummaryStructure = async () => {
  const response = await axios({
    // method: 'get',
    // url: '/v0/configuration/metaType=approvalSummary'
    url: 'api/metadata/approvalSummary',
    baseURL: 'http://localhost:8081'
  }).then((res) => res.data)
  return response
}
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
export const getApprovalSummary = async () => {
  const response = await axios({
    // url: `/v0/requests/reqByReqId?reqId=${requestId}`,
    // method: 'get'
    // This code is used to connect local API response
    url: 'api/metadata/approvalSummary',
    baseURL: 'http://localhost:8081'
  }).then((res) => res.data)
  const phaseInfo = []
  let phaseName

  if (response?.request?.common?.accessioApprovalLog) {
    phaseInfo.push({
      phaseId: 'LEVEL1 APPROVAL',
      status: response?.decision?.status,
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
  }
  if (
    response?.request?.common?.accessioApprovalLog?.Level2Approval &&
    Object.keys(response?.request?.common?.accessioApprovalLog?.Level2Approval).length
  ) {
    const actName2 = response?.request?.common?.accessioApprovalLog?.Level2Approval?.approverL2Mail
      ? response?.request?.common?.accessioApprovalLog?.Level2Approval?.approverL2Mail
      : []
    phaseInfo.push({
      phaseId: 'LEVEL2 APPROVAL',
      status: response?.decision?.status ? capitalizeFirstLetter(response?.decision?.status) : '--',
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

  response?.decision?.phases?.forEach((phase) => {
    let actName
    phaseName = phase.name
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
    phaseInfo.push({
      phaseId:
        phaseName === 'LineManagerApproval'
          ? 'LEVEL1 APPROVAL'
          : seperateWordsWithCapitalLetter(phaseName),
      status: phase.status,
      decision: phase.decision ? capitalizeFirstLetter(phase.decision) : '--',
      startDate: getFormattedDateTime(phase.startDate),
      completionDate: phase.completionDate ? getFormattedDateTime(phase.completionDate) : '--',
      approverInfo: phase.completedBy
        ? `${phase.completedBy.givenName} ${phase.completedBy.sn} (${phase.completedBy.mail})`
        : iff(
            ![undefined, null, []].includes(actName) && actName.length > 0,
            actName.map((name, index) => {
              if (index === actName.length - 1) {
                return name
              }
              return `${name}/ `
            }),
            ''
          )
    })
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
      id: 'requestError',
      value: response?.request?.common?.accessioFailureMessage
        ? response?.request?.common?.accessioFailureMessage
        : ''
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
        : ''
    },
    {
      id: 'status',
      value: response?.decision?.status
        ? iff(response?.decision?.status === 'complete', 'completed', response?.decision?.status)
        : ''
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
      id: 'dbagExtensionAttribute3',
      value: response?.request?.common?.groupDetails?.dbagExtensionAttribute3
        ? response?.request?.common?.groupDetails?.dbagExtensionAttribute3
        : ''
    },
    {
      id: 'endlocation',
      value:
        response?.request?.common?.groupDetails?.location !== ''
          ? response?.request?.common?.groupDetails?.location
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
      value: response?.request?.common?.accountDetails
        ? iff(
            response?.request?.common?.accountDetails?.middleName,
            response?.request?.common?.accountDetails?.middleName,
            iff(
              response?.request?.common?.accountDetails?.accountNameMiddle,
              response?.request?.common?.accountDetails?.accountNameMiddle,
              ''
            )
          )
        : iff(
            response?.request?.common?.groupDetails?.accountNameMiddle,
            response?.request?.common?.groupDetails?.accountNameMiddle,
            ''
          )
    },
    {
      id: 'passwordNeverExpires',
      value: response?.request?.common?.accountDetails?.passwordNeverExpires
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
      value: capitalizeRequester(response)
    },
    {
      id: 'requestType',
      value: getRequestType(response?.requestType)
    },
    {
      id: 'requestDate', // ALM2105
      value: iff(
        formattedDate(response?.decision?.startDate),
        formattedDate(response?.decision?.startDate),
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
      id: 'externalRequestId',
      value: response?.request?.common?.externalRequestId
        ? response?.request?.common?.externalRequestId
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
      id: 'accessioIsgMSAGroup',
      value: response?.request?.common?.groupDetails?.accessioIsgMSAGroup
        ? response?.request?.common?.groupDetails?.accessioIsgMSAGroup
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
      id: 'mAMs',
      value:
        response?.request?.common?.groupDetails?.dbagApplicationID ||
        response?.request?.common?.groupDetails?.mAMs?.[0]
          ? response?.request?.common?.groupDetails?.dbagApplicationID ||
            response?.request?.common?.groupDetails?.mAMs?.[0]
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
      id: 'vipApprover',
      value:
        response?.request?.common?.vipApprover &&
        Object.keys(response?.request?.common?.vipApprover).length > 0 &&
        phaseName !== ''
          ? response?.request?.common?.vipApprover[phaseName]
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
    }
  ]
}

export const approvalActions = (action, reqId, phaseId, payload) =>
  axios({
    // This code is used to connect local API response
    // url: '/api/approveDecisions/',
    // baseURL: 'http://localhost:8081',
    url: `/v0/governance/${action}?reqId=${reqId}&phaseId=${phaseId}`,
    data: payload,
    method: 'post'
  }).then((res) => res)

// TODO: Approve / Reject requests from LM of LM' API

export const approveRejectLM = (payload) =>
  axios({
    url: '/v0/governance/lmOfLmDecision',
    data: payload,
    method: 'post'
  })
    .then((res) => res)
    .catch((err) => console.error(err))

export const approvalComment = (action, reqId, payload, phaseId) =>
  axios({
    url: `/v0/requests/${action}?reqId=${reqId}&phaseId=${phaseId}`,
    data: payload,
    method: 'post'
  }).then((res) => res)

export const sortApprovals = (payload) =>
  axios({
    url: `/v0/sort/common`,
    data: payload,
    method: 'post'
  }).then((res) => {
    const result = {}
    result.total = res?.data?.hits?.total?.value
    const approvalData = []
    res?.data?.hits?.hits?.forEach((item) => {
      /* eslint no-underscore-dangle: 0 */
      const inProgressPhase = item?._source?.decision?.phases
        ? item?._source?.decision?.phases
            .map((act) => (act.status === 'in-progress' ? act.name : null))
            .filter((element) => element !== null)
        : null

      approvalData.push({
        id: item?._source?.id,
        status:
          item?._source?.decision?.status === 'in-progress'
            ? 'IN-PROGRESS'
            : item?._source?.decision?.status,
        justification: item?._source?.request?.common?.requestJustification,
        requestType: getRequestType(item?._source?.requestType),
        requestedItem: getRequestItem(item),
        requestDate: iff(
          formattedDate(item?._source?.decision?.startDate),
          formattedDate(item?._source?.decision?.startDate), // ALM2105
          ''
        ),
        expiry: formattedDate(item?._source?.request?.common?.endDate),
        comment: item?._source?.decision?.comments,
        permissions: item?._source?.decision?.actors?.active[0]?.permissions,
        requester: item._source.request?.common?.requestorMail
          ? convertMailtoName(item._source.request?.common?.requestorMail)
          : '',
        recipient: convertMailtoName(item?._source?.request?.common?.recepientMail),
        requestNumber: item._source.request?.common?.Accessio_Request_No,
        bulkRequestNumber: item?._source?.request?.common?.AccessioBulkRequestNumber,
        category: item?._source?.request?.common?.category,
        operation: item?._source?.request?.common?.operation,
        phase: inProgressPhase && inProgressPhase[0] ? inProgressPhase[0] : '',
        sortKeyword: item?.sort ? item.sort[0] : [],
        recipientMail: item._source.request?.common?.recepientMail
          ? item._source.request?.common?.recepientMail
          : '',
        requesterMail: item._source?.decision?.actors?.active[0]?.mail
          ? item._source?.decision?.actors?.active[0]?.mail
          : '',
        common: item?._source?.request?.common ? item._source.request.common : {},
        vipApprover:
          item?._source?.request?.common?.vipApprover &&
          Object.keys(item?._source?.request?.common?.vipApprover).length > 0 &&
          inProgressPhase &&
          inProgressPhase[0]
            ? item?._source?.request?.common?.vipApprover[inProgressPhase[0]]
            : '',
        accountDN: item?.request?.common?.accountDN
          ? item?.request?.common?.accountDN.split(',').slice(-4)[0]?.split('=')[1]
          : '',
        groupDN: item?.request?.common?.groupDN
          ? item?.request?.common?.groupDN.split(',').slice(-4)[0]?.split('=')[1]
          : '',
        accountName: item?.request?.common?.accountDN
          ? item?.request?.common?.accountDN.split(',')[0].split('=')[1]
          : '',

        groupName: item?.request?.common?.groupDN
          ? item?.request?.common?.groupDN.split(',')[0].split('=')[1]
          : '',
        serverDN: item?.request?.common?.serverDN
          ? item?.request?.common?.serverDN.split(',').slice(-4)[0]?.split('=')[1]
          : ''
      })
    })
    result.approvalData = approvalData
    return result
  })

export const getGroupApprovalSummaryStructure = async () => {
  const response = await axios({
    method: 'get',
    url: '/v0/configuration/metaType=groupApprovalSummary'
  })
    .then((res) => res.data)
    .catch((error) => console.error(error))
  return response
}

export const getEntitlementSummaryStructure = async () => {
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
