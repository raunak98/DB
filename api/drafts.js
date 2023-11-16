import axios from '../axios'
import {
  convertMailtoName,
  seperateWordsWithCapitalLetter,
  capitalizeFirstLetter
} from '../helpers/strings'

import { getExpiryDate } from '../helpers/utils'

const iff = (consition, then, otherise) => (consition ? then : otherise)
// export const getDraftsMeta = async () => {
//   const response = await axios({
//     url: '/api/metadata/draftsTable',
//     baseURL: 'http://localhost:8081'
//   })
//     .then((res) => res.data)
//     .catch((err) => console.error(err))

//   return response
// }

// this is API call, after metadata deployment need to call this API
export const getDraftsMeta = async () => {
  const response = await axios(`/v0/configuration/metaType=draftsTable`).then((res) => res.data)

  return response
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

const fetchDetailsFromDN = (dnDetails) => {
  if (dnDetails && dnDetails.indexOf(',') > -1 && dnDetails.indexOf('=') > -1) {
    const data = dnDetails?.split(',')[0]?.split('=')[1]
    return data
  }
  return dnDetails
}

export const getDraftsData = async (pageSize, pageNumber) => {
  const response = await axios({
    url: `/v0/requests/allRequests?isDraft=${true}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
    method: 'get'
    // url: '/api/drafts/draftsResponse',
    // baseURL: 'http://localhost:8081'
  }).then((res) => {
    const result = {}
    result.total = res?.data?.hits?.total?.value
    const draftData = []
    res?.data?.hits?.hits?.forEach((item) => {
      // res?.data?.forEach((item) => {
      /* eslint no-underscore-dangle: 0 */
      let childValue = ''
      let expiry =
        item?._source?.request?.common?.accountDetails?.accountExpires &&
        ['0', ''].includes(item?._source?.request?.common?.accountDetails?.accountExpires)
          ? ''
          : item?._source?.request?.common?.accountDetails?.accountExpires
      expiry = getExpiryDate(expiry)
      if (
        ['512', '66048'].includes(
          item?._source?.request?.common?.accountDetails?.userAccountControl
        )
      ) {
        childValue = 'Enabled'
      } else if (item?._source?.request?.common?.accountDetails?.userAccountControl === '546') {
        childValue = 'Inactive'
      } else if (item?._source?.request?.common?.accountDetails?.userAccountControl === '514') {
        childValue = 'Disabled'
      }
      draftData.push({
        id: item?._source?.id,
        requestNo: item?._source?.id,
        requestType: getRequestType(item?._source?.requestType),
        categoryDraft: item?._source?.request?.common?.category,
        operation: item?._source?.request?.common?.operation,
        recipient: item?._source?.request?.common?.recepientMail
          ? convertMailtoName(item?._source?.request?.common?.recepientMail)
          : '',
        recipientMail: item?._source?.request?.common?.recepientMail
          ? item?._source?.request?.common?.recepientMail
          : '',
        detailedInfo: item?._source?.request?.common?.requestJustification,
        sort: item?.sort ? item?.sort[0] : null,
        expiry,
        accountStatus: childValue,
        checked: false,
        dbagApplicationID: item?._source?.request?.common?.accountDetails
          ? iff(
              item?._source?.request?.common?.accountDetails?.dbagApplicationID,
              item?._source?.request?.common?.accountDetails?.dbagApplicationID,
              ''
            )
          : iff(
              item?._source?.request?.common?.groupDetails?.dbagApplicationID,
              item?._source?.request?.common?.groupDetails?.dbagApplicationID,
              ''
            ),
        sAMAccountName: item?._source?.request?.common?.accountDetails?.sAMAccountName
          ? item?._source?.request?.common?.accountDetails?.sAMAccountName
          : iff(
              item?._source?.request?.common?.sAMAccountName,
              item?._source?.request?.common?.sAMAccountName,
              ''
            ),
        category: item?._source?.request?.common?.accountDetails?.accountType
          ? item?._source?.request?.common?.accountDetails?.accountType
          : iff(
              item?._source?.request?.common?.accountType,
              item?._source?.request?.common?.accountType,
              ''
            ),
        domain: item?._source?.request?.common?.accountDetails
          ? iff(
              item?._source?.request?.common?.accountDetails?.domain,
              item?._source?.request?.common?.accountDetails?.domain,
              ''
            )
          : iff(
              item?._source?.request?.common?.groupDetails?.domain !== '',
              item?._source?.request?.common?.groupDetails?.domain,
              ''
            ),
        description: item?._source?.request?.common?.accountDetails
          ? iff(
              item?._source?.request?.common?.accountDetails?.description,
              item?._source?.request?.common?.accountDetails?.description,
              ''
            )
          : iff(
              item?._source?.request?.common?.groupDetails?.description !== '',
              item?._source?.request?.common?.groupDetails?.description,
              ''
            ),
        location: item?._source?.request?.common?.accountDetails
          ? iff(
              item?._source?.request?.common?.accountDetails?.l,
              item?._source?.request?.common?.accountDetails?.l,
              ''
            )
          : iff(
              item?._source?.request?.common?.groupDetails?.location !== '',
              item?._source?.request?.common?.groupDetails?.location,
              ''
            ),
        adGroupType: item?._source?.request?.common?.groupDetails?.dbagRecerttype
          ? item?._source?.request?.common?.groupDetails?.dbagRecerttype
          : '',
        adGroupSubType: item?._source?.request?.common?.groupDetails?.dbagRecertSubtype
          ? item?._source?.request?.common?.groupDetails?.dbagRecertSubtype
          : '',
        accessioGroupType: item?._source?.request?.common?.groupDetails?.accessioGroupType
          ? item?._source?.request?.common?.groupDetails?.accessioGroupType
          : '',
        digitalIdentity: item?._source?.request?.common?.groupDetails?.digitalIdentity
          ? item?._source?.request?.common?.groupDetails?.digitalIdentity
          : '',
        role: item?._source?.request?.common?.groupDetails?.role
          ? item?._source?.request?.common?.groupDetails?.role
          : '',
        approverLevel: item?._source?.request?.common?.groupDetails?.approverLevel
          ? item?._source?.request?.common?.groupDetails?.approverLevel
          : '',
        categoryReference: item?._source?.request?.common?.groupDetails?.categoryReference
          ? item?._source?.request?.common?.groupDetails?.categoryReference
          : '',
        versionIterationofGroup: item?._source?.request?.common?.groupDetails
          ?.versionIterationofGroup
          ? item?._source?.request?.common?.groupDetails?.versionIterationofGroup
          : '',
        vRMID: item?._source?.request?.common?.groupDetails?.vRMID
          ? item?._source?.request?.common?.groupDetails?.vRMID
          : '',
        groupNameText: item?._source?.request?.common?.groupDetails?.groupNameText
          ? item?._source?.request?.common?.groupDetails?.groupNameText
          : '',
        projectName: item?._source?.request?.common?.groupDetails?.projectName
          ? item?._source?.request?.common?.groupDetails?.projectName
          : '',
        productionUATorDEV: item?._source?.request?.common?.groupDetails?.productionUATorDEV
          ? item?._source?.request?.common?.groupDetails?.productionUATorDEV
          : '',
        applicationName: item?._source?.request?.common?.groupDetails?.applicationName
          ? item?._source?.request?.common?.groupDetails?.applicationName
          : '',
        groupRole: item?._source?.request?.common?.groupDetails?.groupRole
          ? item?._source?.request?.common?.groupDetails?.groupRole
          : '',
        safeName: item?._source?.request?.common?.groupDetails?.safeName
          ? item?._source?.request?.common?.groupDetails?.safeName
          : '',
        enterpriseServices: item?._source?.request?.common?.groupDetails?.enterpriseServices
          ? item?._source?.request?.common?.groupDetails?.enterpriseServices
          : '',
        dLPEnvironment: item?._source?.request?.common?.groupDetails?.dLPEnvironment
          ? item?._source?.request?.common?.groupDetails?.dLPEnvironment
          : '',
        dLPGroupRole: item?._source?.request?.common?.groupDetails?.dLPGroupRole
          ? item?._source?.request?.common?.groupDetails?.dLPGroupRole
          : '',
        serverName: item?._source?.request?.common?.groupDetails?.serverName
          ? item?._source?.request?.common?.groupDetails?.serverName
          : '',
        vendorteamName: item?._source?.request?.common?.groupDetails?.vendorteamName
          ? item?._source?.request?.common?.groupDetails?.vendorteamName
          : '',
        samLocation: item?._source?.request?.common?.groupDetails?.location
          ? item?._source?.request?.common?.groupDetails?.location
          : '',
        samAccount: item?._source?.request?.common?.groupDetails?.cn
          ? item?._source?.request?.common?.groupDetails?.cn
          : '',
        dbagsupportGroup: item?._source?.request?.common?.groupDetails?.dbagSupportGroup
          ? item?._source?.request?.common?.groupDetails?.dbagSupportGroup
          : '',
        accessioIsGroupPrivileged: item?._source?.request?.common?.groupDetails
          ?.accessioIsGroupPrivileged
          ? item?._source?.request?.common?.groupDetails?.accessioIsGroupPrivileged
          : '',
        dbagIMSDataSecCLass: item?._source?.request?.common?.groupDetails?.dbagIMSDataSecCLass
          ? item?._source?.request?.common?.groupDetails?.dbagIMSDataSecCLass
          : '',
        accessioIsgMSAGroup: item?._source?.request?.common?.groupDetails?.accessioIsgMSAGroup
          ? item?._source?.request?.common?.groupDetails?.accessioIsgMSAGroup
          : '',
        dbagExtensionAttribute3: item?._source?.request?.common?.groupDetails
          ?.dbagExtensionAttribute3
          ? item?._source?.request?.common?.groupDetails?.dbagExtensionAttribute3
          : '',
        groupType: item?._source?.request?.common?.groupDetails?.groupType
          ? item?._source?.request?.common?.groupDetails?.groupType
          : '',
        groupScope: item?._source?.request?.common?.groupDetails?.groupScope
          ? item?._source?.request?.common?.groupDetails?.groupScope
          : '',
        dbagExternalProvider: item?._source?.request?.common?.groupDetails?.dbagExternalProvider
          ? item?._source?.request?.common?.groupDetails?.dbagExternalProvider
          : '',
        info: item?._source?.request?.common?.groupDetails?.info
          ? item?._source?.request?.common?.groupDetails?.info
          : '',
        dbagExtensionAttribute2: item?._source?.request?.common?.groupDetails
          ?.dbagExtensionAttribute2
          ? item?._source?.request?.common?.groupDetails?.dbagExtensionAttribute2
          : '',
        dbagProcessingdata: item?._source?.request?.common?.groupDetails?.dbagProcessingdata
          ? item?._source?.request?.common?.groupDetails?.dbagProcessingdata
          : '',
        entitlement: item?._source?.request?.common?.groupDetails?.dbagEntitlement
          ? iff(
              Array.isArray(item?._source?.request?.common?.groupDetails?.dbagEntitlement),
              item?._source?.request?.common?.groupDetails?.dbagEntitlement[0],
              item?._source?.request?.common?.groupDetails?.dbagEntitlement
            )
          : '',
        entitlementOther: item?._source?.request?.common?.groupDetails?.entitlementOther
          ? item?._source?.request?.common?.groupDetails?.entitlementOther
          : '',
        paths: item?._source?.request?.common?.groupDetails?.dbagFileSystemFullPaths
          ? iff(
              Array.isArray(item?._source?.request?.common?.groupDetails?.dbagFileSystemFullPaths),
              item?._source?.request?.common?.groupDetails?.dbagFileSystemFullPaths[0],
              item?._source?.request?.common?.groupDetails?.dbagFileSystemFullPaths
            )
          : '',
        IsgMSAGroup: item?._source?.request?.common?.groupDetails?.IsgMSAGroup
          ? item?._source?.request?.common?.groupDetails?.IsgMSAGroup
          : '',
        accessToPSI: item?._source?.request?.common?.groupDetails?.accessToPSI
          ? item?._source?.request?.common?.groupDetails?.accessToPSI
          : '',
        RobotBusinessDescription: item?._source?.request?.common?.groupDetails
          ?.RobotBusinessDescription
          ? item?._source?.request?.common?.groupDetails?.RobotBusinessDescription
          : '',
        platformType: item?._source?.request?.common?.groupDetails?.platformType
          ? item?._source?.request?.common?.groupDetails?.platformType
          : '',
        mAMs:
          item?._source?.request?.common?.groupDetails?.dbagApplicationID ||
          item?._source?.request?.common?.groupDetails?.mAMs?.[0]
            ? iff(
                item?._source?.request?.common?.groupDetails?.accessioGroupType ===
                  'Robot Object - Infrastructure Other',
                item?._source?.request?.common?.groupDetails?.dbagApplicationID ||
                  item?._source?.request?.common?.groupDetails?.mAMs?.[0],
                ''
              )
            : '',
        accessioPrerequisiteRMPRoles: item?._source?.request?.common?.groupDetails
          ?.accessioPrerequisiteRMPRoles
          ? item?._source?.request?.common?.groupDetails?.accessioPrerequisiteRMPRoles
          : '',
        dbAGInfrastructureNARID: item?._source?.request?.common?.groupDetails?.dbagInfrastructureID
          ? item?._source?.request?.common?.groupDetails?.dbagInfrastructureID[0]
          : '',
        dbagSupportGroup: item?._source?.request?.common?.groupDetails?.dbagSupportGroup
          ? item?._source?.request?.common?.groupDetails?.dbagSupportGroup
          : '',
        userScopeRestriction: item?._source?.request?.common?.groupDetails?.userScopeRestriction
          ? item?._source?.request?.common?.groupDetails?.userScopeRestriction
          : '',
        dlpOu: item?._source?.request?.common?.groupDetails?.location
          ? item?._source?.request?.common?.groupDetails?.location
          : '',
        dbagIMSAuthContact: item?._source?.request?.common?.groupDetails?.dbagIMSAuthContact
          ? item?._source?.request?.common?.groupDetails?.dbagIMSAuthContact
          : '',
        dbagIMSAuthContactDelegate: item?._source?.request?.common?.groupDetails
          ?.dbagIMSAuthContactDelegate
          ? item?._source?.request?.common?.groupDetails?.dbagIMSAuthContactDelegate
          : '',
        dbagIMSApprovers: item?._source?.request?.common?.groupDetails?.dbagIMSApprovers
          ? item?._source?.request?.common?.groupDetails?.dbagIMSApprovers
          : '',
        pSIDescription: item?._source?.request?.common?.groupDetails?.pSIDescription
          ? item?._source?.request?.common?.groupDetails?.pSIDescription
          : '',
        dbagCostcenter: item?._source?.request?.common?.groupDetails?.dbagCostcenter
          ? item?._source?.request?.common?.groupDetails?.dbagCostcenter
          : '',
        distinguishedName: item?._source?.request?.common?.groupDN
          ? item?._source?.request?.common?.groupDN
          : '',
        groupDN: item?._source?.request?.common?.groupDN
          ? fetchDetailsFromDN(item?._source?.request?.common?.groupDN)
          : '',
        accountDN: item?._source?.request?.common?.accountDN
          ? fetchDetailsFromDN(item?._source?.request?.common?.accountDN)
          : '',
        requestMembershipType: item?._source?.request?.common?.operation
          ? item?._source?.request?.common?.operation
          : '',
        serverDN: item?._source?.request?.common?.serverDN
          ? fetchDetailsFromDN(item?._source?.request?.common?.serverDN)
          : '',
        memberServerDN: item?._source?.request?.common?.accountDN
          ? item?._source?.request?.common?.accountDN
          : iff(
              item?._source?.request?.common?.serverDN,
              item?._source?.request?.common?.serverDN,
              ''
            ),
        department:
          item?._source?.request?.common?.groupDetails?.department &&
          !['', undefined, null].includes(item?._source?.request?.common?.groupDetails?.department)
            ? item?._source?.request?.common?.groupDetails?.department
            : '',
        dbagDataPrivClass:
          item?._source?.request?.common?.groupDetails?.dbagDataPrivClass &&
          !['', undefined, null].includes(
            item?._source?.request?.common?.groupDetails?.dbagDataPrivClass
          )
            ? item?._source?.request?.common?.groupDetails?.dbagDataPrivClass
            : '',

        dbagExtensionAttribute6:
          item?._source?.request?.common?.groupDetails?.dbagExtensionAttribute6 &&
          !['', undefined, null].includes(
            item?._source?.request?.common?.groupDetails?.dbagExtensionAttribute6
          )
            ? item?._source?.request?.common?.groupDetails?.dbagExtensionAttribute6
            : ''
      })
    })
    result.draftData = draftData
    return result
  })
  return response
}

export const searchdrafts = (payload) =>
  axios({
    url: `/v0/search/common`,
    data: payload,
    method: 'post'
  }).then((res) => {
    const result = {}
    result.total = res?.data?.hits?.total?.value
    const draftData = []
    res?.data?.hits?.hits?.forEach((item) => {
      /* eslint no-underscore-dangle: 0 */
      let childValue = ''
      if (
        ['512', '66048'].includes(
          item?._source?.request?.common?.accountDetails?.userAccountControl
        )
      ) {
        childValue = 'Enabled'
      } else if (item?._source?.request?.common?.accountDetails?.userAccountControl === '546') {
        childValue = 'Inactive'
      } else if (item?._source?.request?.common?.accountDetails?.userAccountControl === '514') {
        childValue = 'Disabled'
      }

      let expiry =
        item?._source?.request?.common?.accountDetails?.accountExpires &&
        ['0', ''].includes(item?._source?.request?.common?.accountDetails?.accountExpires)
          ? ''
          : item?._source?.request?.common?.accountDetails?.accountExpires
      expiry = getExpiryDate(expiry)
      draftData.push({
        id: item?._source?.id,
        requestNo: item?._source?.id,

        requestType: getRequestType(item?._source?.requestType),
        categoryDraft: item?._source?.request?.common?.category,
        operation: item?._source?.request?.common?.operation,
        recipient: item?._source?.request?.common?.recepientMail
          ? convertMailtoName(item?._source?.request?.common?.recepientMail)
          : '',
        recipientMail: item?._source?.request?.common?.recepientMail
          ? item?._source?.request?.common?.recepientMail
          : '',
        detailedInfo: item?._source?.request?.common?.requestJustification,
        sort: item?.sort ? item?.sort[0] : null,
        expiry,
        accountStatus: childValue,
        checked: false,
        dbagApplicationID: item?._source?.request?.common?.accountDetails
          ? iff(
              item?._source?.request?.common?.accountDetails?.dbagApplicationID,
              item?._source?.request?.common?.accountDetails?.dbagApplicationID,
              ''
            )
          : iff(
              item?._source?.request?.common?.groupDetails?.dbagApplicationID,
              item?._source?.request?.common?.groupDetails?.dbagApplicationID,
              ''
            ),
        sAMAccountName: item?._source?.request?.common?.accountDetails?.sAMAccountName
          ? item?._source?.request?.common?.accountDetails?.sAMAccountName
          : '',
        category: item?._source?.request?.common?.accountDetails?.accountType
          ? item?._source?.request?.common?.accountDetails?.accountType
          : '',
        domain: item?._source?.request?.common?.accountDetails
          ? iff(
              item?._source?.request?.common?.accountDetails?.domain,
              item?._source?.request?.common?.accountDetails?.domain,
              ''
            )
          : iff(
              item?._source?.request?.common?.groupDetails?.domain !== '',
              item?._source?.request?.common?.groupDetails?.domain,
              ''
            ),
        description: item?._source?.request?.common?.accountDetails
          ? iff(
              item?._source?.request?.common?.accountDetails?.description,
              item?._source?.request?.common?.accountDetails?.description,
              ''
            )
          : iff(
              item?._source?.request?.common?.groupDetails?.description !== '',
              item?._source?.request?.common?.groupDetails?.description,
              ''
            ),
        location: item?._source?.request?.common?.accountDetails
          ? iff(
              item?._source?.request?.common?.accountDetails?.l,
              item?._source?.request?.common?.accountDetails?.l,
              ''
            )
          : iff(
              item?._source?.request?.common?.groupDetails?.location !== '',
              item?._source?.request?.common?.groupDetails?.location,
              ''
            ),
        adGroupType: item?._source?.request?.common?.groupDetails?.dbagRecerttype
          ? item?._source?.request?.common?.groupDetails?.dbagRecerttype
          : '',
        adGroupSubType: item?._source?.request?.common?.groupDetails?.dbagRecertSubtype
          ? item?._source?.request?.common?.groupDetails?.dbagRecertSubtype
          : '',
        accessioGroupType: item?._source?.request?.common?.groupDetails?.accessioGroupType
          ? item?._source?.request?.common?.groupDetails?.accessioGroupType
          : '',
        digitalIdentity: item?._source?.request?.common?.groupDetails?.digitalIdentity
          ? item?._source?.request?.common?.groupDetails?.digitalIdentity
          : '',
        role: item?._source?.request?.common?.groupDetails?.role
          ? item?._source?.request?.common?.groupDetails?.role
          : '',
        approverLevel: item?._source?.request?.common?.groupDetails?.approverLevel
          ? item?._source?.request?.common?.groupDetails?.approverLevel
          : '',
        categoryReference: item?._source?.request?.common?.groupDetails?.categoryReference
          ? item?._source?.request?.common?.groupDetails?.categoryReference
          : '',
        versionIterationofGroup: item?._source?.request?.common?.groupDetails
          ?.versionIterationofGroup
          ? item?._source?.request?.common?.groupDetails?.versionIterationofGroup
          : '',
        vRMID: item?._source?.request?.common?.groupDetails?.vRMID
          ? item?._source?.request?.common?.groupDetails?.vRMID
          : '',
        groupNameText: item?._source?.request?.common?.groupDetails?.groupNameText
          ? item?._source?.request?.common?.groupDetails?.groupNameText
          : '',
        projectName: item?._source?.request?.common?.groupDetails?.projectName
          ? item?._source?.request?.common?.groupDetails?.projectName
          : '',
        productionUATorDEV: item?._source?.request?.common?.groupDetails?.productionUATorDEV
          ? item?._source?.request?.common?.groupDetails?.productionUATorDEV
          : '',
        applicationName: item?._source?.request?.common?.groupDetails?.applicationName
          ? item?._source?.request?.common?.groupDetails?.applicationName
          : '',
        groupRole: item?._source?.request?.common?.groupDetails?.groupRole
          ? item?._source?.request?.common?.groupDetails?.groupRole
          : '',
        safeName: item?._source?.request?.common?.groupDetails?.safeName
          ? item?._source?.request?.common?.groupDetails?.safeName
          : '',
        enterpriseServices: item?._source?.request?.common?.groupDetails?.enterpriseServices
          ? item?._source?.request?.common?.groupDetails?.enterpriseServices
          : '',
        dLPEnvironment: item?._source?.request?.common?.groupDetails?.dLPEnvironment
          ? item?._source?.request?.common?.groupDetails?.dLPEnvironment
          : '',
        dLPGroupRole: item?._source?.request?.common?.groupDetails?.dLPGroupRole
          ? item?._source?.request?.common?.groupDetails?.dLPGroupRole
          : '',
        serverName: item?._source?.request?.common?.groupDetails?.serverName
          ? item?._source?.request?.common?.groupDetails?.serverName
          : '',
        vendorteamName: item?._source?.request?.common?.groupDetails?.vendorteamName
          ? item?._source?.request?.common?.groupDetails?.vendorteamName
          : '',
        samLocation: item?._source?.request?.common?.groupDetails?.location
          ? item?._source?.request?.common?.groupDetails?.location
          : '',
        samAccount: item?._source?.request?.common?.groupDetails?.cn
          ? item?._source?.request?.common?.groupDetails?.cn
          : '',
        dbagsupportGroup: item?._source?.request?.common?.groupDetails?.dbagSupportGroup
          ? item?._source?.request?.common?.groupDetails?.dbagSupportGroup
          : '',
        accessioIsGroupPrivileged: item?._source?.request?.common?.groupDetails
          ?.accessioIsGroupPrivileged
          ? item?._source?.request?.common?.groupDetails?.accessioIsGroupPrivileged
          : '',
        dbagIMSDataSecCLass: item?._source?.request?.common?.groupDetails?.dbagIMSDataSecCLass
          ? item?._source?.request?.common?.groupDetails?.dbagIMSDataSecCLass
          : '',
        accessioIsgMSAGroup: item?._source?.request?.common?.groupDetails?.accessioIsgMSAGroup
          ? item?._source?.request?.common?.groupDetails?.accessioIsgMSAGroup
          : '',
        dbagExtensionAttribute3: item?._source?.request?.common?.groupDetails
          ?.dbagExtensionAttribute3
          ? item?._source?.request?.common?.groupDetails?.dbagExtensionAttribute3
          : '',
        groupType: item?._source?.request?.common?.groupDetails?.groupType
          ? item?._source?.request?.common?.groupDetails?.groupType
          : '',
        groupScope: item?._source?.request?.common?.groupDetails?.groupScope
          ? item?._source?.request?.common?.groupDetails?.groupScope
          : '',
        dbagExternalProvider: item?._source?.request?.common?.groupDetails?.dbagExternalProvider
          ? item?._source?.request?.common?.groupDetails?.dbagExternalProvider
          : '',
        info: item?._source?.request?.common?.groupDetails?.info
          ? item?._source?.request?.common?.groupDetails?.info
          : '',
        dbagExtensionAttribute2: item?._source?.request?.common?.groupDetails
          ?.dbagExtensionAttribute2
          ? item?._source?.request?.common?.groupDetails?.dbagExtensionAttribute2
          : '',
        dbagProcessingdata: item?._source?.request?.common?.groupDetails?.dbagProcessingdata
          ? item?._source?.request?.common?.groupDetails?.dbagProcessingdata
          : '',
        entitlement: item?._source?.request?.common?.groupDetails?.entitlement
          ? iff(
              Array.isArray(item?._source?.request?.common?.groupDetails?.dbagEntitlement),
              item?._source?.request?.common?.groupDetails?.dbagEntitlement[0],
              item?._source?.request?.common?.groupDetails?.dbagEntitlement
            )
          : '',
        entitlementOther: item?._source?.request?.common?.groupDetails?.entitlementOther
          ? item?._source?.request?.common?.groupDetails?.entitlementOther
          : '',
        paths: item?._source?.request?.common?.groupDetails?.paths
          ? iff(
              Array.isArray(item?._source?.request?.common?.groupDetails?.dbagFileSystemFullPaths),
              item?._source?.request?.common?.groupDetails?.dbagFileSystemFullPaths[0],
              item?._source?.request?.common?.groupDetails?.dbagFileSystemFullPaths
            )
          : '',
        IsgMSAGroup: item?._source?.request?.common?.groupDetails?.IsgMSAGroup
          ? item?._source?.request?.common?.groupDetails?.IsgMSAGroup
          : '',
        accessToPSI: item?._source?.request?.common?.groupDetails?.accessToPSI
          ? item?._source?.request?.common?.groupDetails?.accessToPSI
          : '',
        RobotBusinessDescription: item?._source?.request?.common?.groupDetails
          ?.RobotBusinessDescription
          ? item?._source?.request?.common?.groupDetails?.RobotBusinessDescription
          : '',
        platformType: item?._source?.request?.common?.groupDetails?.platformType
          ? item?._source?.request?.common?.groupDetails?.platformType
          : '',
        mAMs:
          item?._source?.request?.common?.groupDetails?.dbagApplicationID ||
          item?._source?.request?.common?.groupDetails?.mAMs?.[0]
            ? iff(
                item?._source?.request?.common?.groupDetails?.accessioGroupType ===
                  'Robot Object - Infrastructure Other',
                item?._source?.request?.common?.groupDetails?.dbagApplicationID ||
                  item?._source?.request?.common?.groupDetails?.mAMs?.[0],
                ''
              )
            : '',
        accessioPrerequisiteRMPRoles: item?._source?.request?.common?.groupDetails
          ?.accessioPrerequisiteRMPRoles
          ? item?._source?.request?.common?.groupDetails?.accessioPrerequisiteRMPRoles
          : '',
        dbAGInfrastructureNARID: item?._source?.request?.common?.groupDetails?.dbagInfrastructureID
          ? item?._source?.request?.common?.groupDetails?.dbagInfrastructureID[0]
          : '',
        dbagSupportGroup: item?._source?.request?.common?.groupDetails?.dbagSupportGroup
          ? item?._source?.request?.common?.groupDetails?.dbagSupportGroup
          : '',
        userScopeRestriction: item?._source?.request?.common?.groupDetails?.userScopeRestriction
          ? item?._source?.request?.common?.groupDetails?.userScopeRestriction
          : '',
        dlpOu: item?._source?.request?.common?.groupDetails?.location
          ? item?._source?.request?.common?.groupDetails?.location
          : '',
        dbagIMSAuthContact: item?._source?.request?.common?.groupDetails?.dbagIMSAuthContact
          ? item?._source?.request?.common?.groupDetails?.dbagIMSAuthContact
          : '',
        dbagIMSAuthContactDelegate: item?._source?.request?.common?.groupDetails
          ?.dbagIMSAuthContactDelegate
          ? item?._source?.request?.common?.groupDetails?.dbagIMSAuthContactDelegate
          : '',
        dbagIMSApprovers: item?._source?.request?.common?.groupDetails?.dbagIMSApprovers
          ? item?._source?.request?.common?.groupDetails?.dbagIMSApprovers
          : '',
        pSIDescription: item?._source?.request?.common?.groupDetails?.pSIDescription
          ? item?._source?.request?.common?.groupDetails?.pSIDescription
          : '',
        dbagCostcenter: item?._source?.request?.common?.groupDetails?.dbagCostcenter
          ? item?._source?.request?.common?.groupDetails?.dbagCostcenter
          : '',
        distinguishedName: item?._source?.request?.common?.groupDN
          ? item?._source?.request?.common?.groupDN
          : '',
        groupDN: item?._source?.request?.common?.groupDN
          ? fetchDetailsFromDN(item?._source?.request?.common?.groupDN)
          : '',
        accountDN: item?._source?.request?.common?.accountDN
          ? fetchDetailsFromDN(item?._source?.request?.common?.accountDN)
          : '',
        requestMembershipType: item?._source?.request?.common?.operation
          ? item?._source?.request?.common?.operation
          : '',
        serverDN: item?._source?.request?.common?.serverDN
          ? fetchDetailsFromDN(item?._source?.request?.common?.serverDN)
          : '',
        memberServerDN: item?._source?.request?.common?.accountDN
          ? item?._source?.request?.common?.accountDN
          : iff(
              item?._source?.request?.common?.serverDN,
              item?._source?.request?.common?.serverDN,
              ''
            ),
        department:
          item?._source?.request?.common?.groupDetails?.department &&
          !['', undefined, null].includes(item?._source?.request?.common?.groupDetails?.department)
            ? item?._source?.request?.common?.groupDetails?.department
            : '',
        dbagDataPrivClass:
          item?._source?.request?.common?.groupDetails?.dbagDataPrivClass &&
          !['', undefined, null].includes(
            item?._source?.request?.common?.groupDetails?.dbagDataPrivClass
          )
            ? item?._source?.request?.common?.groupDetails?.dbagDataPrivClass
            : '',

        dbagExtensionAttribute6:
          item?._source?.request?.common?.groupDetails?.dbagExtensionAttribute6 &&
          !['', undefined, null].includes(
            item?._source?.request?.common?.groupDetails?.dbagExtensionAttribute6
          )
            ? item?._source?.request?.common?.groupDetails?.dbagExtensionAttribute6
            : ''
      })
    })
    result.draftData = draftData
    return result
  })

export const getDraftsResponse = async () => {
  const response = await axios({
    url: '/api/drafts/draftsResponse',
    baseURL: 'http://localhost:8081'
  })
    .then((res) => res.data)
    .catch((err) => console.error(err))
  return response
}

export const getDraftRequestDetailsById = async (requestId) => {
  const response = await axios({
    url: `/v0/requests/reqByReqId?reqId=${requestId}`,
    method: 'get'
  }).then((res) => res.data)
  return response?.request
}

export const submitDraft = async (payload, draftId) => {
  const response = await axios({
    url: `/v0/governance/submitDraft?draftId=${draftId}`,
    data: payload,
    method: 'post'
  })
    .then((res) => res)
    .catch((error) => console.error(error))

  return response
}

export const sortDrafts = (payload) =>
  axios({
    url: `/v0/sort/common`,
    method: 'post',
    data: payload
  }).then((res) => {
    const result = {}
    result.total = res?.data?.hits?.total?.value
    const draftData = []
    res?.data?.hits?.hits?.forEach((item) => {
      /* eslint no-underscore-dangle: 0 */
      let childValue = ''
      if (
        ['512', '66048'].includes(
          item?._source?.request?.common?.accountDetails?.userAccountControl
        )
      ) {
        childValue = 'Enabled'
      } else if (item?._source?.request?.common?.accountDetails?.userAccountControl === '546') {
        childValue = 'Inactive'
      } else if (item?._source?.request?.common?.accountDetails?.userAccountControl === '514') {
        childValue = 'Disabled'
      }
      let expiry =
        item?._source?.request?.common?.accountDetails?.accountExpires &&
        ['0', ''].includes(item?._source?.request?.common?.accountDetails?.accountExpires)
          ? ''
          : item?._source?.request?.common?.accountDetails?.accountExpires
      expiry = getExpiryDate(expiry)
      draftData.push({
        id: item?._source?.id,
        requestNo: item?._source?.id,
        requestType: getRequestType(item?._source?.requestType),
        categoryDraft: item?._source?.request?.common?.category,
        operation: item?._source?.request?.common?.operation,
        recipient: item?._source?.request?.common?.recepientMail
          ? convertMailtoName(item?._source?.request?.common?.recepientMail)
          : '',
        recipientMail: item?._source?.request?.common?.recepientMail
          ? item?._source?.request?.common?.recepientMail
          : '',
        detailedInfo: item?._source?.request?.common?.requestJustification,
        sort: item?.sort ? item?.sort[0] : null,
        expiry,
        accountStatus: childValue,
        checked: false,
        dbagApplicationID: item?._source?.request?.common?.accountDetails
          ? iff(
              item?._source?.request?.common?.accountDetails?.dbagApplicationID,
              item?._source?.request?.common?.accountDetails?.dbagApplicationID,
              ''
            )
          : iff(
              item?._source?.request?.common?.groupDetails?.dbagApplicationID,
              item?._source?.request?.common?.groupDetails?.dbagApplicationID,
              ''
            ),
        sAMAccountName: item?._source?.request?.common?.accountDetails?.sAMAccountName
          ? item?._source?.request?.common?.accountDetails?.sAMAccountName
          : iff(
              item?._source?.request?.common?.sAMAccountName,
              item?._source?.request?.common?.sAMAccountName,
              ''
            ),
        category: item?._source?.request?.common?.accountDetails?.accountType
          ? item?._source?.request?.common?.accountDetails?.accountType
          : iff(
              item?._source?.request?.common?.accountType,
              item?._source?.request?.common?.accountType,
              ''
            ),
        domain: item?._source?.request?.common?.accountDetails
          ? iff(
              item?._source?.request?.common?.accountDetails?.domain,
              item?._source?.request?.common?.accountDetails?.domain,
              ''
            )
          : iff(
              item?._source?.request?.common?.groupDetails?.domain !== '',
              item?._source?.request?.common?.groupDetails?.domain,
              ''
            ),
        description: item?._source?.request?.common?.accountDetails
          ? iff(
              item?._source?.request?.common?.accountDetails?.description,
              item?._source?.request?.common?.accountDetails?.description,
              ''
            )
          : iff(
              item?._source?.request?.common?.groupDetails?.description !== '',
              item?._source?.request?.common?.groupDetails?.description,
              ''
            ),
        location: item?._source?.request?.common?.accountDetails
          ? iff(
              item?._source?.request?.common?.accountDetails?.l,
              item?._source?.request?.common?.accountDetails?.l,
              ''
            )
          : iff(
              item?._source?.request?.common?.groupDetails?.location !== '',
              item?._source?.request?.common?.groupDetails?.location,
              ''
            ),
        adGroupType: item?._source?.request?.common?.groupDetails?.dbagRecerttype
          ? item?._source?.request?.common?.groupDetails?.dbagRecerttype
          : '',
        adGroupSubType: item?._source?.request?.common?.groupDetails?.dbagRecertSubtype
          ? item?._source?.request?.common?.groupDetails?.dbagRecertSubtype
          : '',
        accessioGroupType: item?._source?.request?.common?.groupDetails?.accessioGroupType
          ? item?._source?.request?.common?.groupDetails?.accessioGroupType
          : '',
        digitalIdentity: item?._source?.request?.common?.groupDetails?.digitalIdentity
          ? item?._source?.request?.common?.groupDetails?.digitalIdentity
          : '',
        role: item?._source?.request?.common?.groupDetails?.role
          ? item?._source?.request?.common?.groupDetails?.role
          : '',
        approverLevel: item?._source?.request?.common?.groupDetails?.approverLevel
          ? item?._source?.request?.common?.groupDetails?.approverLevel
          : '',
        categoryReference: item?._source?.request?.common?.groupDetails?.categoryReference
          ? item?._source?.request?.common?.groupDetails?.categoryReference
          : '',
        versionIterationofGroup: item?._source?.request?.common?.groupDetails
          ?.versionIterationofGroup
          ? item?._source?.request?.common?.groupDetails?.versionIterationofGroup
          : '',
        vRMID: item?._source?.request?.common?.groupDetails?.vRMID
          ? item?._source?.request?.common?.groupDetails?.vRMID
          : '',
        groupNameText: item?._source?.request?.common?.groupDetails?.groupNameText
          ? item?._source?.request?.common?.groupDetails?.groupNameText
          : '',
        projectName: item?._source?.request?.common?.groupDetails?.projectName
          ? item?._source?.request?.common?.groupDetails?.projectName
          : '',
        productionUATorDEV: item?._source?.request?.common?.groupDetails?.productionUATorDEV
          ? item?._source?.request?.common?.groupDetails?.productionUATorDEV
          : '',
        applicationName: item?._source?.request?.common?.groupDetails?.applicationName
          ? item?._source?.request?.common?.groupDetails?.applicationName
          : '',
        groupRole: item?._source?.request?.common?.groupDetails?.groupRole
          ? item?._source?.request?.common?.groupDetails?.groupRole
          : '',
        safeName: item?._source?.request?.common?.groupDetails?.safeName
          ? item?._source?.request?.common?.groupDetails?.safeName
          : '',
        enterpriseServices: item?._source?.request?.common?.groupDetails?.enterpriseServices
          ? item?._source?.request?.common?.groupDetails?.enterpriseServices
          : '',
        dLPEnvironment: item?._source?.request?.common?.groupDetails?.dLPEnvironment
          ? item?._source?.request?.common?.groupDetails?.dLPEnvironment
          : '',
        dLPGroupRole: item?._source?.request?.common?.groupDetails?.dLPGroupRole
          ? item?._source?.request?.common?.groupDetails?.dLPGroupRole
          : '',
        serverName: item?._source?.request?.common?.groupDetails?.serverName
          ? item?._source?.request?.common?.groupDetails?.serverName
          : '',
        vendorteamName: item?._source?.request?.common?.groupDetails?.vendorteamName
          ? item?._source?.request?.common?.groupDetails?.vendorteamName
          : '',
        samLocation: item?._source?.request?.common?.groupDetails?.location
          ? item?._source?.request?.common?.groupDetails?.location
          : '',
        samAccount: item?._source?.request?.common?.groupDetails?.cn
          ? item?._source?.request?.common?.groupDetails?.cn
          : '',
        dbagsupportGroup: item?._source?.request?.common?.groupDetails?.dbagSupportGroup
          ? item?._source?.request?.common?.groupDetails?.dbagSupportGroup
          : '',
        accessioIsGroupPrivileged: item?._source?.request?.common?.groupDetails
          ?.accessioIsGroupPrivileged
          ? item?._source?.request?.common?.groupDetails?.accessioIsGroupPrivileged
          : '',
        dbagIMSDataSecCLass: item?._source?.request?.common?.groupDetails?.dbagIMSDataSecCLass
          ? item?._source?.request?.common?.groupDetails?.dbagIMSDataSecCLass
          : '',
        accessioIsgMSAGroup: item?._source?.request?.common?.groupDetails?.accessioIsgMSAGroup
          ? item?._source?.request?.common?.groupDetails?.accessioIsgMSAGroup
          : '',
        dbagExtensionAttribute3: item?._source?.request?.common?.groupDetails
          ?.dbagExtensionAttribute3
          ? item?._source?.request?.common?.groupDetails?.dbagExtensionAttribute3
          : '',
        groupType: item?._source?.request?.common?.groupDetails?.groupType
          ? item?._source?.request?.common?.groupDetails?.groupType
          : '',
        groupScope: item?._source?.request?.common?.groupDetails?.groupScope
          ? item?._source?.request?.common?.groupDetails?.groupScope
          : '',
        dbagExternalProvider: item?._source?.request?.common?.groupDetails?.dbagExternalProvider
          ? item?._source?.request?.common?.groupDetails?.dbagExternalProvider
          : '',
        info: item?._source?.request?.common?.groupDetails?.info
          ? item?._source?.request?.common?.groupDetails?.info
          : '',
        dbagExtensionAttribute2: item?._source?.request?.common?.groupDetails
          ?.dbagExtensionAttribute2
          ? item?._source?.request?.common?.groupDetails?.dbagExtensionAttribute2
          : '',
        dbagProcessingdata: item?._source?.request?.common?.groupDetails?.dbagProcessingdata
          ? item?._source?.request?.common?.groupDetails?.dbagProcessingdata
          : '',
        entitlement: item?._source?.request?.common?.groupDetails?.dbagEntitlement
          ? iff(
              Array.isArray(item?._source?.request?.common?.groupDetails?.dbagEntitlement),
              item?._source?.request?.common?.groupDetails?.dbagEntitlement[0],
              item?._source?.request?.common?.groupDetails?.dbagEntitlement
            )
          : '',
        entitlementOther: item?._source?.request?.common?.groupDetails?.entitlementOther
          ? item?._source?.request?.common?.groupDetails?.entitlementOther
          : '',
        paths: item?._source?.request?.common?.groupDetails?.dbagFileSystemFullPaths
          ? iff(
              Array.isArray(item?._source?.request?.common?.groupDetails?.dbagFileSystemFullPaths),
              item?._source?.request?.common?.groupDetails?.dbagFileSystemFullPaths[0],
              item?._source?.request?.common?.groupDetails?.dbagFileSystemFullPaths
            )
          : '',
        IsgMSAGroup: item?._source?.request?.common?.groupDetails?.IsgMSAGroup
          ? item?._source?.request?.common?.groupDetails?.IsgMSAGroup
          : '',
        accessToPSI: item?._source?.request?.common?.groupDetails?.accessToPSI
          ? item?._source?.request?.common?.groupDetails?.accessToPSI
          : '',
        RobotBusinessDescription: item?._source?.request?.common?.groupDetails
          ?.RobotBusinessDescription
          ? item?._source?.request?.common?.groupDetails?.RobotBusinessDescription
          : '',
        platformType: item?._source?.request?.common?.groupDetails?.platformType
          ? item?._source?.request?.common?.groupDetails?.platformType
          : '',
        mAMs:
          item?._source?.request?.common?.groupDetails?.dbagApplicationID ||
          item?._source?.request?.common?.groupDetails?.mAMs?.[0]
            ? iff(
                item?._source?.request?.common?.groupDetails?.accessioGroupType ===
                  'Robot Object - Infrastructure Other',
                item?._source?.request?.common?.groupDetails?.dbagApplicationID ||
                  item?._source?.request?.common?.groupDetails?.mAMs?.[0],
                ''
              )
            : '',
        accessioPrerequisiteRMPRoles: item?._source?.request?.common?.groupDetails
          ?.accessioPrerequisiteRMPRoles
          ? item?._source?.request?.common?.groupDetails?.accessioPrerequisiteRMPRoles
          : '',
        dbAGInfrastructureNARID: item?._source?.request?.common?.groupDetails?.dbagInfrastructureID
          ? item?._source?.request?.common?.groupDetails?.dbagInfrastructureID[0]
          : '',
        dbagSupportGroup: item?._source?.request?.common?.groupDetails?.dbagSupportGroup
          ? item?._source?.request?.common?.groupDetails?.dbagSupportGroup
          : '',
        userScopeRestriction: item?._source?.request?.common?.groupDetails?.userScopeRestriction
          ? item?._source?.request?.common?.groupDetails?.userScopeRestriction
          : '',
        dlpOu: item?._source?.request?.common?.groupDetails?.location
          ? item?._source?.request?.common?.groupDetails?.location
          : '',
        dbagIMSAuthContact: item?._source?.request?.common?.groupDetails?.dbagIMSAuthContact
          ? item?._source?.request?.common?.groupDetails?.dbagIMSAuthContact
          : '',
        dbagIMSAuthContactDelegate: item?._source?.request?.common?.groupDetails
          ?.dbagIMSAuthContactDelegate
          ? item?._source?.request?.common?.groupDetails?.dbagIMSAuthContactDelegate
          : '',
        dbagIMSApprovers: item?._source?.request?.common?.groupDetails?.dbagIMSApprovers
          ? item?._source?.request?.common?.groupDetails?.dbagIMSApprovers
          : '',
        pSIDescription: item?._source?.request?.common?.groupDetails?.pSIDescription
          ? item?._source?.request?.common?.groupDetails?.pSIDescription
          : '',
        dbagCostcenter: item?._source?.request?.common?.groupDetails?.dbagCostcenter
          ? item?._source?.request?.common?.groupDetails?.dbagCostcenter
          : '',
        distinguishedName: item?._source?.request?.common?.groupDN
          ? item?._source?.request?.common?.groupDN
          : '',
        groupDN: item?._source?.request?.common?.groupDN
          ? fetchDetailsFromDN(item?._source?.request?.common?.groupDN)
          : '',
        accountDN: item?._source?.request?.common?.accountDN
          ? fetchDetailsFromDN(item?._source?.request?.common?.accountDN)
          : '',
        requestMembershipType: item?._source?.request?.common?.operation
          ? item?._source?.request?.common?.operation
          : '',
        serverDN: item?._source?.request?.common?.serverDN
          ? fetchDetailsFromDN(item?._source?.request?.common?.serverDN)
          : '',
        memberServerDN: item?._source?.request?.common?.accountDN
          ? item?._source?.request?.common?.accountDN
          : iff(
              item?._source?.request?.common?.serverDN,
              item?._source?.request?.common?.serverDN,
              ''
            ),
        department:
          item?._source?.request?.common?.groupDetails?.department &&
          !['', undefined, null].includes(item?._source?.request?.common?.groupDetails?.department)
            ? item?._source?.request?.common?.groupDetails?.department
            : '',
        dbagDataPrivClass:
          item?._source?.request?.common?.groupDetails?.dbagDataPrivClass &&
          !['', undefined, null].includes(
            item?._source?.request?.common?.groupDetails?.dbagDataPrivClass
          )
            ? item?._source?.request?.common?.groupDetails?.dbagDataPrivClass
            : '',

        dbagExtensionAttribute6:
          item?._source?.request?.common?.groupDetails?.dbagExtensionAttribute6 &&
          !['', undefined, null].includes(
            item?._source?.request?.common?.groupDetails?.dbagExtensionAttribute6
          )
            ? item?._source?.request?.common?.groupDetails?.dbagExtensionAttribute6
            : ''
      })
    })
    result.draftData = draftData
    return result
  })
