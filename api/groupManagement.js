import { findDomain } from 'helpers/strings'
import axios from '../axios'

const iff = (consition, then, otherise) => (consition ? then : otherise)
export const getMeta = async () => {
  const response = await axios({
    url: '/v0/configuration/metaType=accountManagement'
  }).then((res) => res.data)

  return response
}

export const getCreateADGroup = async () => {
  const response = await axios({
    // url: '/v0/config/getMetadata?metaType=Create_Ad_Group'
    url: '/api/metadata/createADGroup',
    baseURL: 'http://localhost:8081'
  }).then((res) => res.data)

  return response
}

export const getAdGroupType = async (adGroupUrl) => {
  const response = await axios({
    url: adGroupUrl
  }).then((res) => res.data)

  return response
}

export const submitAdGroup = async (payload) => {
  const response = await axios({
    url: '/v0/governance/createResource',
    data: payload,
    method: 'post'
  }).then((res) => res)
  return response
}

export const modifyAdGroup = async (payload) => {
  const response = await axios({
    url: '/v0/governance/modifyResource',
    data: payload,
    method: 'post'
  })
    .then((res) => res)
    .catch((error) => {
      console.error(error)
      return { status: 500, statusText: 'Error', message: 'API Error' }
    })
  return response
}

// Created for temporary rendering. To be removed after integration
export const getCreateADGroupSummary = async () => {
  const response = await axios({
    url: '/v0/configuration/metaType=createADGroupSummary'
  })
    .then((res) => res.data)
    .catch((error) => {
      console.error(error)
      return { status: 500, statusText: 'Error', message: 'API Error' }
    })

  return response
}

export const getOptionsById = async (url) => {
  const response = await axios({
    url,
    baseURL: 'http://localhost:8081'
  }).then((res) => res.data)

  return response
}

export const validateSAMAccount = async (url, payload) => {
  const response = await axios({
    url,
    method: 'post',
    data: payload
  })
    .then((res) => res.data)
    .catch((err) => console.error(err))

  return response
}

export const validateGroupDetails = async (url, payload) => {
  const response = await axios({
    url,
    method: 'post',
    data: payload
  })
    .then((res) => res.data)
    .catch((err) => console.error(err))
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

export const validateUniqueRequest = async (url, payload) => {
  const response = await axios({
    url,
    method: 'post',
    data: payload
  })
    .then((res) => res.data)
    .catch((error) => {
      console.error(error)
      return { status: 500, statusText: 'Error', message: 'API Error' }
    })

  return response
}

export const getModifyADGroup = async () => {
  const response = await axios(`/v0/config/getMetadata?metaType=Modify_Ad_Group`)
    // const response = await axios({
    //   url: '/api/metadata/modifyADGroup',
    //   baseURL: 'http://localhost:8081'
    // })
    .then((res) => res.data)
    .catch((error) => {
      console.error(error)
      return { status: 500, statusText: 'Error', message: 'API Error' }
    })

  return response
}

export const getGroupSummaryStructure = async () => {
  const response = await axios({
    // url: '/v0/configuration/metaType=assetsGroupSummary'
    url: '/api/metadata/groupApprovalSummary',
    baseURL: 'http://localhost:8081'
  })
    .then((res) => res.data)
    .catch((error) => {
      console.error(error)
      return { status: 500, statusText: 'Error', message: 'API Error' }
    })
  return response
}

export const setIndirectlyOwnedGroupRecord = async (payload) => {
  const result = payload
  const applicationID = result?.applicationId
  return result
    ? [
        {
          id: 'dbagApplicationID',
          value: result?._source?.igaContent?.dbagApplicationID
            ? result?._source?.igaContent?.dbagApplicationID[0]
            : applicationID
        },
        {
          id: 'domain',
          value: result?.domain ? result.domain : ''
        },
        {
          id: 'dbagCostcenter',
          value: result?.costCenter ? result.costCenter : ''
        },
        {
          id: 'department',
          value: result?.department ? result.department : ''
        },
        {
          id: 'region',
          value: result?.region ? result.region : ''
        },
        {
          id: 'description',
          value: result?.description ? result?.description : ''
        },
        {
          id: 'endlocation',
          value: result?.location ? result?.location : ''
        },
        {
          id: 'dbagInfrastructureID',
          value: result?.infrastructureId ? result.infrastructureId : ''
        },
        { id: 'id', value: result?.id ? result?.id : '' },
        {
          id: 'accessioRequestNo',
          value: result?.Accessio_Request_No ? result?.Accessio_Request_No : ''
        },
        {
          id: 'adGroupType',
          value: result?.groupType ? result.groupType : ''
        },
        {
          id: 'adGroupSubType',
          value: result?._source?.igaContent?.dbagRecertSubtype
            ? result?._source?.igaContent?.dbagRecertSubtype
            : iff(result?.adGroupSubType, result?.adGroupSubType, '')
        },
        {
          id: 'accessioGroupType',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioGroupType
              ? result?._source?.glossary?.idx['/']?.accessioGroupType
              : iff(result?.accessioGroupType, result?.accessioGroupType, '')
        },
        {
          id: 'digitalIdentity',
          value: result?._source?.igaContent?.object?.digitalIdentity
            ? result?._source?.igaContent?.object?.digitalIdentity
            : iff(result?.digitalIdentity, result?.digitalIdentity, '')
        },
        {
          id: 'distinguishedName',
          value: result?.dn ? result.dn : ''
        },
        {
          id: 'role',
          value: result?._source?.igaContent?.object?.role
            ? result?._source?.igaContent?.object?.role
            : iff(result?.role, result?.role, '')
        },
        {
          id: 'approverLevel',
          value: result?._source?.igaContent?.object?.approverLevel
            ? result?._source?.igaContent?.object?.approverLevel
            : iff(result?.approverLevel, result?.approverLevel, '')
        },
        {
          id: 'categoryReference',
          value: result?._source?.igaContent?.object?.categoryReference
            ? result?._source?.igaContent?.object?.categoryReference
            : iff(result?.categoryReference, result?.categoryReference, '')
        },
        {
          id: 'versionIterationofGroup',
          value: result?._source?.igaContent?.object?.versionIterationofGroup
            ? result?._source?.igaContent?.object?.versionIterationofGroup
            : iff(result?.versionIterationofGroup, result?.versionIterationofGroup, '')
        },
        {
          id: 'vRMID',
          value: result?._source?.igaContent?.object?.vRMID
            ? result?._source?.igaContent?.object?.vRMID
            : iff(result?.vRMID, result?.vRMID, '')
        },
        {
          id: 'groupNameText',
          value: result?.groupName ? result?.groupName : ''
        },
        {
          id: 'projectName',
          value: result?._source?.igaContent?.object?.projectName
            ? result?._source?.igaContent?.object?.projectName
            : iff(result?.projectName, result?.projectName, '')
        },
        {
          id: 'productionUATorDEV',
          value: result?._source?.igaContent?.object?.productionUATorDEV
            ? result?._source?.igaContent?.object?.productionUATorDEV
            : iff(result?.productionUATorDEV, result?.productionUATorDEV, '')
        },
        {
          id: 'applicationName',
          value: result?._source?.applicationProperties?.name
            ? result?._source?.applicationProperties?.name
            : iff(result?.applicationName, result?.applicationName, '')
        },
        {
          id: 'groupRole',
          value: result?._source?.igaContent?.object?.groupRole
            ? result?._source?.igaContent?.object?.groupRole
            : iff(result?.groupRole, result?.groupRole, '')
        },
        {
          id: 'safeName',
          value: result?._source?.igaContent?.object?.safeName
            ? result?._source?.igaContent?.object?.safeName
            : iff(result?.safeName, result?.safeName, '')
        },
        {
          id: 'enterpriseServices',
          value: result?._source?.igaContent?.object?.enterpriseServices
            ? result?._source?.igaContent?.object?.enterpriseServices
            : iff(result?.enterpriseServices, result?.enterpriseServices, '')
        },
        {
          id: 'dLPEnvironment',
          value: result?._source?.igaContent?.object?.dLPEnvironment
            ? result?._source?.igaContent?.object?.dLPEnvironment
            : iff(result?.dLPEnvironment, result?.dLPEnvironment, '')
        },
        {
          id: 'dLPGroupRole',
          value: result?._source?.igaContent?.object?.dLPGroupRole
            ? result?._source?.igaContent?.object?.dLPGroupRole
            : iff(result?.dLPGroupRole, result?.dLPGroupRole, '')
        },
        {
          id: 'serverName',
          value: result?._source?.igaContent?.object?.serverName
            ? result?._source?.igaContent?.object?.serverName
            : iff(result?.serverName, result?.serverName, '')
        },
        {
          id: 'vendorteamName',
          value: result?._source?.igaContent?.object?.vendorteamName
            ? result?._source?.igaContent?.object?.vendorteamName
            : iff(result?.vendorteamName, result?.vendorteamName, '')
        },
        {
          id: 'samLocation',
          value: result?._source?.igaContent?.object?.location
            ? result?._source?.igaContent?.object?.location
            : iff(result?.samLocation, result?.samLocation, '')
        },
        {
          id: 'samAccount',
          value: result?.samaAcctName ? result.samaAcctName : ''
        },
        {
          id: 'dbagsupportGroup',
          value: result?._source?.igaContent?.dbagSupportGroup
            ? result?._source?.igaContent?.dbagSupportGroup
            : iff(result?.dbagSupportGroup, result?.dbagSupportGroup, '')
        },
        {
          id: 'accessioIsGroupPrivileged',
          value: result?._source?.igaContent?.object?.isGroupPrivileged
            ? result?._source?.igaContent?.object?.isGroupPrivileged
            : iff(result?.accessioIsGroupPrivileged, result?.accessioIsGroupPrivileged, '')
        },
        {
          id: 'dbagIMSDataSecCLass',
          value: result?.imsDataSecClass ? result.imsDataSecClass : ''
        },
        {
          id: 'groupType',
          value: result?.groupType ? result.groupType : ''
        },
        {
          id: 'groupScope',
          value: result?._source?.igaContent?.object?.groupScope
            ? result?._source?.igaContent?.object?.groupScope
            : iff(result?.groupScope, result?.groupScope, '')
        },
        {
          id: 'dbagExternalProvider',
          value: result?._source?.igaContent?.dbagExternalProvider
            ? result?._source?.igaContent?.dbagExternalProvider
            : iff(result?.dbagExternalProvider, result?.dbagExternalProvider, '')
        },
        {
          id: 'info',
          value: result?._source?.igaContent?.object?.info
            ? result?._source?.igaContent?.object?.info
            : iff(result?.info, result?.info, '')
        },
        {
          id: 'dbagExtensionAttribute2',
          value: result?._source?.igaContent?.object?.dbagExtensionAttribute2
            ? result?._source?.igaContent?.object?.dbagExtensionAttribute2
            : iff(result?.dbagExtensionAttribute2, result?.dbagExtensionAttribute2, '')
        },
        {
          id: 'dbagExtensionAttribute3',
          value: result?._source?.igaContent?.object?.dbagExtensionAttribute3
            ? result?._source?.igaContent?.object?.dbagExtensionAttribute3
            : iff(result?.dbagExtensionAttribute3, result?.dbagExtensionAttribute3, '')
        },
        {
          id: 'dbagProcessingdata',
          value: result?._source?.igaContent?.dbagProcessingdata
            ? result?._source?.igaContent?.dbagProcessingdata
            : iff(result?.dbagProcessingdata, result?.dbagProcessingdata, '')
        },
        {
          id: 'entitlement',
          value: result?.entitlement ? result.entitlement : ''
        },
        {
          id: 'dbagFileSystemFullPaths',
          value: result?.filesysFullPaths ? result?.filesysFullPaths : ''
        },
        {
          id: 'accessToPSI',
          value: result?._source?.igaContent?.object?.accessToPSI
            ? result?._source?.igaContent?.object?.accessToPSI
            : iff(result?.accessToPSI, result?.accessToPSI, '')
        },
        {
          id: 'RobotBusinessDescription',
          value: result?._source?.igaContent?.object?.RobotBusinessDescription
            ? result?._source?.igaContent?.object?.RobotBusinessDescription
            : iff(result?.RobotBusinessDescription, result?.RobotBusinessDescription, '')
        },
        {
          id: 'mAMs',
          value: result?._source?.igaContent?.object?.mAMs
            ? result?._source?.igaContent?.object?.mAMs
            : iff(result?.mAMs, result?.mAMs, '')
        },
        {
          id: 'accessioPrerequisiteRMPRoles',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioPrerequisiteRMPRoles
              ? result?._source?.glossary?.idx['/']?.accessioPrerequisiteRMPRoles
              : iff(result?.accessioPrerequisiteRMPRoles, result?.accessioPrerequisiteRMPRoles, '')
        },
        {
          id: 'dbagInfrastructureID',
          value: result?.infrastructureId ? result?.infrastructureId : ''
        },
        {
          id: 'dbagSupportGroup',
          value:
            result?.supportGroup && ['null', 'NULL'].includes(result?.supportGroup)
              ? result?.supportGroup
              : ''
        },
        {
          id: 'userScopeRestriction',
          value: result?._source?.igaContent?.dbagExtensionAttribute3
            ? result?._source?.igaContent?.dbagExtensionAttribute3
            : iff(result?.dbagExtensionAttribute3, result?.dbagExtensionAttribute3, '')
        },
        {
          id: 'dlpOu',
          value: result?._source?.igaContent?.object?.location
            ? result?._source?.igaContent?.object?.location
            : iff(result?.dlpOu, result?.dlpOu, '')
        },
        {
          id: 'dbagIMSAuthContact',
          value: result?.authContact ? result?.authContact : ''
        },
        {
          id: 'dbagIMSAuthContactDelegate',
          value: result?.imsAuthContactDelegate ? result?.imsAuthContactDelegate : ''
        },
        {
          id: 'dbagIMSApprovers',
          value: result?.allApprovers ? result?.allApprovers : ''
        },
        {
          id: 'pSIDescription',
          value: result?._source?.igaContent?.object?.pSIDescription
            ? result?._source?.igaContent?.object?.pSIDescription
            : iff(result?.pSIDescription, result?.pSIDescription, '')
        },
        {
          id: 'businessJustification',
          value: result?._source?.igaContent?.object?.requestJustification
            ? result?._source?.igaContent?.object?.requestJustification
            : iff(result?.detailedInfo, result?.detailedInfo, '')
        },
        {
          id: 'accessioIsGroupPrivileged',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioIsGroupPrivileged
              ? result?._source?.glossary?.idx['/']?.accessioIsGroupPrivileged
              : iff(result?.accessioIsGroupPrivileged, result?.accessioIsGroupPrivileged, '')
        },
        {
          id: 'accessioPlatformType',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioPlatformType
              ? result?._source?.glossary?.idx['/']?.accessioPlatformType
              : iff(result?.accessioPlatformType, result?.accessioPlatformType, '')
        },
        {
          id: 'accessioIsgMSAGroup',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioIsgMSAGroup
              ? result?._source?.glossary?.idx['/']?.accessioIsgMSAGroup
              : iff(result?.accessioIsgMSAGroup, result?.accessioIsgMSAGroup, '')
        },
        {
          id: 'dn',
          value: result?.dn ? result?.dn : ''
        },
        {
          id: 'dbagDataPrivClass',
          value: result?.dataPrivClass ? result?.dataPrivClass : ''
        },
        {
          id: 'dbagExtensionAttribute6',
          value: result?._source?.igaContent?.dbagExtensionAttribute6
            ? result?._source?.igaContent?.dbagExtensionAttribute6
            : ''
        },
        {
          id: 'accessioPrerequisiteRMPRolesText',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioPrerequisiteRMPRoles
              ? result?._source?.glossary?.idx['/']?.accessioPrerequisiteRMPRoles
              : ''
        },
        {
          id: 'dbagIMSDataSecCLass',
          value: result?.imsDataSecClass ? result?.imsDataSecClass : ''
        },
        {
          id: 'dwsPrivate',
          value: result?._source?.igaContent?.object?.dwsPrivate
            ? result?._source?.igaContent?.object?.dwsPrivate
            : 0
        },
        {
          id: 'clientPrivate',
          value: result?.clientPrivate ? result?.clientPrivate : 0
        },
        {
          id: 'dbPrivate',
          value: result?.dbPrivate ? result?.dbPrivate : 0
        },
        {
          id: 'accessioPermissionType',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioPermissionType
              ? result?._source?.glossary?.idx['/']?.accessioPermissionType
              : null
        }
      ]
    : []
}
export const setGroupRecord = async (payload) => {
  const result = payload
  const applicationID =
    result?.dbagApplicationID && Array.isArray(result?.dbagApplicationID)
      ? result?.dbagApplicationID[0]
      : ''
  const description =
    Array.isArray(result?.description) && result?.description.length > 0
      ? result?.description[0]
      : ''

  let privateData
  if (result?._source?.igaContent?.object?.dbagExtensionAttribute6?.length > 0) {
    const input = result?._source?.igaContent?.object?.dbagExtensionAttribute6
    privateData = input[0]?.split('')
  }

  let groupTypeData
  switch (result?._source?.igaContent?.object?.groupType) {
    case '-2147483646':
    case '-2147483640':
    case '-2147483644':
    case '-2147483643':
      groupTypeData = 'security'
      break
    case '2':
    case '4':
    case '8':
      groupTypeData = 'distribution'
      break
    default:
      break
  }
  return result
    ? [
        {
          id: 'dbagApplicationID',
          value: result?._source?.igaContent?.dbagApplicationID
            ? result?._source?.igaContent?.dbagApplicationID[0]
            : applicationID
        },
        {
          id: 'domain',
          value: !['', undefined, null].includes(result?._source?.igaContent?.object?.domain)
            ? result?._source?.igaContent?.object?.domain
            : iff(result?.domain, result?.domain, '')
        },
        {
          id: 'dbagCostcenter',
          value: !['', undefined, null].includes(result?._source?.igaContent?.dbagCostcenter)
            ? result?._source?.igaContent?.dbagCostcenter
            : iff(result?.dbagCostcenter, result?.dbagCostcenter, '')
        },
        {
          id: 'department',
          value: !['', undefined, null].includes(result?._source?.igaContent?.object?.department)
            ? result?._source?.igaContent?.object?.department
            : result?.department || ''
        },
        {
          id: 'region',
          value: !['', undefined, null].includes(result?._source?.igaContent?.object?.region)
            ? result?._source?.igaContent?.object?.region
            : ''
        },
        {
          id: 'description',
          value:
            !['', null].includes(result?._source?.igaContent?.description) &&
            result?._source?.igaContent?.description
              ? result?._source?.igaContent?.description[0]
              : description
        },
        {
          id: 'endlocation',
          value: !['', undefined, null].includes(result?._source?.igaContent?.object?.location)
            ? result?._source?.igaContent?.object?.location
            : iff(result?.location, result?.location, '')
        },
        {
          id: 'dbagInfrastructureID',
          value: !['', undefined, null].includes(
            result?._source?.igaContent?.object.dbagInfrastructureID
          )
            ? iff(
                Array.isArray(result?._source?.igaContent?.object.dbagInfrastructureID),
                result?._source?.igaContent?.object.dbagInfrastructureID[0],
                result?._source?.igaContent?.object.dbagInfrastructureID
              )
            : result?.dbAGInfrastructureNARID || ''
        },
        { id: 'id', value: result?._source?.id ? result?._source?.id : '' },
        {
          id: 'accessioRequestNo',
          value: result?._source?.Accessio_Request_No ? result?._source?.Accessio_Request_No : ''
        },
        {
          id: 'adGroupType',
          value: result?._source?.igaContent?.dbagRecerttype
            ? result?._source?.igaContent?.dbagRecerttype
            : iff(result?.adGroupType, result?.adGroupType, '')
        },
        {
          id: 'adGroupSubType',
          value: result?._source?.igaContent?.dbagRecertSubtype
            ? result?._source?.igaContent?.dbagRecertSubtype
            : iff(result?.adGroupSubType, result?.adGroupSubType, '')
        },
        {
          id: 'accessioGroupType',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioGroupType
              ? result?._source?.glossary?.idx['/']?.accessioGroupType || ''
              : iff(result?.accessioGroupType, result?.accessioGroupType, '')
        },
        {
          id: 'digitalIdentity',
          value: result?._source?.igaContent?.object?.digitalIdentity
            ? result?._source?.igaContent?.object?.digitalIdentity
            : iff(result?.digitalIdentity, result?.digitalIdentity, '')
        },
        {
          id: 'distinguishedName',
          value: !['', undefined, null].includes(result?._source?.igaContent?.distinguishedName)
            ? result?._source?.igaContent?.distinguishedName
            : iff(result?.distinguishedName, result?.distinguishedName, '')
        },
        {
          id: 'role',
          value: result?._source?.igaContent?.object?.role
            ? result?._source?.igaContent?.object?.role
            : iff(result?.role, result?.role, '')
        },
        {
          id: 'approverLevel',
          value: result?._source?.igaContent?.object?.approverLevel
            ? result?._source?.igaContent?.object?.approverLevel
            : iff(result?.approverLevel, result?.approverLevel, '')
        },
        {
          id: 'categoryReference',
          value: result?._source?.igaContent?.object?.categoryReference
            ? result?._source?.igaContent?.object?.categoryReference
            : iff(result?.categoryReference, result?.categoryReference, '')
        },
        {
          id: 'versionIterationofGroup',
          value: result?._source?.igaContent?.object?.versionIterationofGroup
            ? result?._source?.igaContent?.object?.versionIterationofGroup
            : iff(result?.versionIterationofGroup, result?.versionIterationofGroup, '')
        },
        {
          id: 'vRMID',
          value: result?._source?.igaContent?.object?.vRMID
            ? result?._source?.igaContent?.object?.vRMID
            : iff(result?.vRMID, result?.vRMID, '')
        },
        {
          id: 'groupNameText',
          value: result?._source?.igaContent?.object?.groupNameText
            ? result?._source?.igaContent?.object?.groupNameText
            : iff(result?.groupNameText, result?.groupNameText, '')
        },
        {
          id: 'projectName',
          value: result?._source?.igaContent?.object?.projectName
            ? result?._source?.igaContent?.object?.projectName
            : iff(result?.projectName, result?.projectName, '')
        },
        {
          id: 'productionUATorDEV',
          value: result?._source?.igaContent?.object?.productionUATorDEV
            ? result?._source?.igaContent?.object?.productionUATorDEV
            : iff(result?.productionUATorDEV, result?.productionUATorDEV, '')
        },
        {
          id: 'applicationName',
          value: result?._source?.applicationProperties?.name
            ? result?._source?.applicationProperties?.name
            : iff(result?.applicationName, result?.applicationName, '')
        },
        {
          id: 'groupRole',
          value: result?._source?.igaContent?.object?.groupRole
            ? result?._source?.igaContent?.object?.groupRole
            : iff(result?.groupRole, result?.groupRole, '')
        },
        {
          id: 'safeName',
          value: result?._source?.igaContent?.object?.safeName
            ? result?._source?.igaContent?.object?.safeName
            : iff(result?.safeName, result?.safeName, '')
        },
        {
          id: 'enterpriseServices',
          value: result?._source?.igaContent?.object?.enterpriseServices
            ? result?._source?.igaContent?.object?.enterpriseServices
            : iff(result?.enterpriseServices, result?.enterpriseServices, '')
        },
        {
          id: 'dLPEnvironment',
          value: result?._source?.igaContent?.object?.dLPEnvironment
            ? result?._source?.igaContent?.object?.dLPEnvironment
            : iff(result?.dLPEnvironment, result?.dLPEnvironment, '')
        },
        {
          id: 'dLPGroupRole',
          value: result?._source?.igaContent?.object?.dLPGroupRole
            ? result?._source?.igaContent?.object?.dLPGroupRole
            : iff(result?.dLPGroupRole, result?.dLPGroupRole, '')
        },
        {
          id: 'serverName',
          value: result?._source?.igaContent?.object?.serverName
            ? result?._source?.igaContent?.object?.serverName
            : iff(result?.serverName, result?.serverName, '')
        },
        {
          id: 'vendorteamName',
          value: result?._source?.igaContent?.object?.vendorteamName
            ? result?._source?.igaContent?.object?.vendorteamName
            : iff(result?.vendorteamName, result?.vendorteamName, '')
        },
        {
          id: 'samLocation',
          value: result?._source?.igaContent?.object?.location
            ? result?._source?.igaContent?.object?.location
            : iff(result?.samLocation, result?.samLocation, '')
        },
        {
          id: 'samAccount',
          value: result?._source?.igaContent?.displayName
            ? result?._source?.igaContent?.displayName
            : iff(result?.samAccount, result?.samAccount, '')
        },
        {
          id: 'dbagsupportGroup',
          value: result?._source?.igaContent?.object?.dbagSupportGroup
            ? result?._source?.igaContent?.object?.dbagSupportGroup
            : result?.dbagsupportGroup || ''
        },
        {
          id: 'accessioIsGroupPrivileged',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioIsGroupPrivileged
              ? result?._source?.glossary?.idx['/']?.accessioIsGroupPrivileged
              : iff(result?.accessioIsGroupPrivileged, result?.accessioIsGroupPrivileged, '')
        },
        {
          id: 'dbagIMSDataSecCLass',
          value: result?._source?.igaContent?.dbagIMSDataSecCLass
            ? result?._source?.igaContent?.dbagIMSDataSecCLass
            : iff(result?.dbagIMSDataSecCLass, result?.dbagIMSDataSecCLass, '')
        },
        {
          id: 'groupType',
          value: result?._source?.igaContent?.object?.groupType
            ? iff(groupTypeData, groupTypeData, result?._source?.igaContent?.object?.groupType)
            : iff(result?.groupType, result?.groupType, '')
        },
        {
          id: 'groupScope',
          value: result?._source?.igaContent?.object?.groupScope
            ? result?._source?.igaContent?.object?.groupScope
            : iff(result?.groupScope, result?.groupScope, '')
        },
        {
          id: 'dbagExternalProvider',
          value: result?._source?.igaContent?.dbagExternalProvider
            ? result?._source?.igaContent?.dbagExternalProvider
            : iff(result?.dbagExternalProvider, result?.dbagExternalProvider, '')
        },
        {
          id: 'info',
          value: result?._source?.igaContent?.object?.info
            ? result?._source?.igaContent?.object?.info
            : iff(result?.info, result?.info, '')
        },
        {
          id: 'dbagExtensionAttribute2',
          value: result?._source?.igaContent?.object?.dbagExtensionAttribute2
            ? result?._source?.igaContent?.object?.dbagExtensionAttribute2
            : iff(result?.dbagExtensionAttribute2, result?.dbagExtensionAttribute2, '')
        },
        {
          id: 'dbagExtensionAttribute3',
          value: result?._source?.igaContent?.object?.dbagExtensionAttribute3
            ? result?._source?.igaContent?.object?.dbagExtensionAttribute3
            : iff(result?.dbagExtensionAttribute3, result?.dbagExtensionAttribute3, '')
        },
        {
          id: 'dbagProcessingdata',
          value: result?._source?.igaContent?.dbagProcessingdata
            ? result?._source?.igaContent?.dbagProcessingdata
            : iff(result?.dbagProcessingdata, result?.dbagProcessingdata, '')
        },
        {
          id: 'entitlement',
          value: result?._source?.igaContent?.object?.dbagEntitlement
            ? iff(
                Array.isArray(result?._source?.igaContent?.object?.dbagEntitlement),
                result?._source?.igaContent?.object?.dbagEntitlement[0],
                result?._source?.igaContent?.object?.dbagEntitlement
              )
            : result?.entitlement || ''
        },
        {
          id: 'dbagFileSystemFullPaths',
          value: result?._source?.igaContent?.object?.dbagFileSystemFullPaths
            ? iff(
                Array.isArray(result?._source?.igaContent?.object?.dbagFileSystemFullPaths),
                result?._source?.igaContent?.object?.dbagFileSystemFullPaths[0],
                result?._source?.igaContent?.object?.dbagFileSystemFullPaths
              )
            : result?.paths || ''
        },
        {
          id: 'accessToPSI',
          value: result?._source?.igaContent?.object?.accessToPSI
            ? result?._source?.igaContent?.object?.accessToPSI
            : iff(result?.accessToPSI, result?.accessToPSI, '')
        },
        {
          id: 'RobotBusinessDescription',
          value: result?._source?.igaContent?.object?.RobotBusinessDescription
            ? result?._source?.igaContent?.object?.RobotBusinessDescription
            : iff(result?.RobotBusinessDescription, result?.RobotBusinessDescription, '')
        },
        {
          id: 'mAMs',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioGroupType ===
              'Robot Object - Infrastructure Other' &&
            result?._source?.igaContent?.dbagApplicationID
              ? iff(
                  Array.isArray(result?._source?.igaContent?.dbagApplicationID),
                  result?._source?.igaContent?.dbagApplicationID[0],
                  result?._source?.igaContent?.dbagApplicationID
                )
              : iff(result?.mAMs, result?.mAMs, '')
        },
        {
          id: 'accessioPrerequisiteRMPRoles',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioPrerequisiteRMPRoles
              ? result?._source?.glossary?.idx['/']?.accessioPrerequisiteRMPRoles
              : iff(result?.accessioPrerequisiteRMPRoles, result?.accessioPrerequisiteRMPRoles, '')
        },
        {
          id: 'dbagInfrastructureID',
          value: result?._source?.igaContent?.dbagInfrastructureID
            ? result?._source?.igaContent?.dbagInfrastructureID[0]
            : iff(result?.dbagInfrastructureID, result?.dbagInfrastructureID, '')
        },
        {
          id: 'dbagSupportGroup',
          value: result?._source?.igaContent?.object?.dbagSupportGroup
            ? result?._source?.igaContent?.object?.dbagSupportGroup
            : result?.dbagSupportGroup || ''
        },
        {
          id: 'userScopeRestriction',
          value: result?._source?.igaContent?.dbagExtensionAttribute3
            ? result?._source?.igaContent?.dbagExtensionAttribute3
            : iff(result?.dbagExtensionAttribute3, result?.dbagExtensionAttribute3, '')
        },
        {
          id: 'dlpOu',
          value: result?._source?.igaContent?.object?.location
            ? result?._source?.igaContent?.object?.location
            : iff(result?.dlpOu, result?.dlpOu, '')
        },
        {
          id: 'dbagIMSAuthContact',
          value: result?._source?.igaContent?.object?.dbagIMSAuthContact
            ? result?._source?.igaContent?.object?.dbagIMSAuthContact
            : iff(result?.dbagIMSAuthContact, result?.dbagIMSAuthContact, '')
        },
        {
          id: 'dbagIMSAuthContactDelegate',
          value: result?._source?.igaContent?.object?.dbagIMSAuthContactDelegate
            ? result?._source?.igaContent?.object?.dbagIMSAuthContactDelegate
            : iff(result?.dbagIMSAuthContactDelegate, result?.dbagIMSAuthContactDelegate, '')
        },
        {
          id: 'dbagIMSApprovers',
          value: result?._source?.igaContent?.dbagIMSApprovers
            ? result?._source?.igaContent?.dbagIMSApprovers
            : iff(result?.dbagIMSApprovers, result?.dbagIMSApprovers, '')
        },
        {
          id: 'pSIDescription',
          value: result?._source?.igaContent?.object?.pSIDescription
            ? result?._source?.igaContent?.object?.pSIDescription
            : iff(result?.pSIDescription, result?.pSIDescription, '')
        },
        {
          id: 'businessJustification',
          value: result?._source?.igaContent?.object?.requestJustification
            ? result?._source?.igaContent?.object?.requestJustification
            : iff(result?.detailedInfo, result?.detailedInfo, '')
        },
        {
          id: 'accessioIsGroupPrivileged',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioIsGroupPrivileged
              ? result?._source?.glossary?.idx['/']?.accessioIsGroupPrivileged
              : iff(result?.accessioIsGroupPrivileged, result?.accessioIsGroupPrivileged, '')
        },
        {
          id: 'accessioPlatformType',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioPlatformType
              ? result?._source?.glossary?.idx['/']?.accessioPlatformType
              : iff(result?.accessioPlatformType, result?.accessioPlatformType, '')
        },
        {
          id: 'accessioIsgMSAGroup',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioIsgMSAGroup
              ? result?._source?.glossary?.idx['/']?.accessioIsgMSAGroup
              : iff(result?.accessioIsgMSAGroup, result?.accessioIsgMSAGroup, '')
        },
        {
          id: 'dn',
          value: result?._source?.igaContent?.distinguishedName
            ? result?._source?.igaContent?.distinguishedName
            : iff(result?.distinguishedName, result?.distinguishedName, '')
        },
        {
          id: 'dbagDataPrivClass',
          value: result?._source?.igaContent?.object?.dbagDataPrivClass
            ? result?._source?.igaContent?.object?.dbagDataPrivClass
            : result?.dbagDataPrivClass || ''
        },
        {
          id: 'dbagExtensionAttribute6',
          value: result?._source?.igaContent?.object?.dbagExtensionAttribute6
            ? result?._source?.igaContent?.object?.dbagExtensionAttribute6
            : result?.dbagExtensionAttribute6 || ''
        },
        {
          id: 'accessioPrerequisiteRMPRolesText',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioPrerequisiteRMPRoles
              ? result?._source?.glossary?.idx['/']?.accessioPrerequisiteRMPRoles
              : result?.accessioPrerequisiteRMPRoles || ''
        },
        {
          id: 'dbagIMSDataSecCLass',
          value: result?._source?.igaContent?.dbagIMSDataSecCLass
            ? result?._source?.igaContent?.dbagIMSDataSecCLass
            : ''
        },
        {
          id: 'dwsPrivate',
          value:
            result?._source?.igaContent?.object?.dbagDataPrivClass === 'TRUE' &&
            result?._source?.igaContent?.object?.dbagExtensionAttribute6?.length > 0
              ? privateData[0]
              : ''
        },
        {
          id: 'clientPrivate',
          value:
            result?._source?.igaContent?.object?.dbagDataPrivClass === 'TRUE' &&
            result?._source?.igaContent?.object?.dbagExtensionAttribute6?.length > 0
              ? privateData[1]
              : ''
        },
        {
          id: 'dbPrivate',
          value:
            result?._source?.igaContent?.object?.dbagDataPrivClass === 'TRUE' &&
            result?._source?.igaContent?.object?.dbagExtensionAttribute6?.length > 0
              ? privateData[2]
              : ''
        },
        {
          id: 'accessioPermissionType',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioPermissionType
              ? result?._source?.glossary?.idx['/']?.accessioPermissionType
              : null
        },
        {
          id: 'dbagModifiedBy',
          value: result?._source?.igaContent?.object?.dbagModifiedBy
            ? result?._source?.igaContent?.object?.dbagModifiedBy
            : ''
        }
      ]
    : []
}
// TODO : COMMENTING FOR TESTING
export const searchGroupRecord = async (payload) => {
  const response = await axios({
    url: '/v0/users/myGroups/search',
    data: payload,
    method: 'post'
  }).then((res) => res.data)
  /* eslint no-underscore-dangle: 0 */
  const result = response?.hits?.hits ? response?.hits?.hits[0] : []
  let groupTypeData
  switch (result?._source?.igaContent?.object?.groupType) {
    case '-2147483646':
    case '-2147483640':
    case '-2147483644':
    case '-2147483643':
      groupTypeData = 'security'
      break
    case '2':
    case '4':
    case '8':
      groupTypeData = 'distribution'
      break
    default:
      break
  }
  return result
    ? [
        {
          id: 'dbagApplicationID',
          value: result?._source?.igaContent?.dbagApplicationID
            ? result?._source?.igaContent?.dbagApplicationID[0]
            : ''
        },
        {
          id: 'domain',
          value:
            result?._source?.igaContent?.object?.domain !== ''
              ? result?._source?.igaContent?.object?.domain
              : ''
        },
        {
          id: 'dbagCostcenter',
          value:
            result?._source?.igaContent?.dbagCostcenter !== ''
              ? result?._source?.igaContent?.dbagCostcenter
              : ''
        },
        {
          id: 'department',
          value:
            result?._source?.igaContent?.object?.department !== ''
              ? result?._source?.igaContent?.object?.department
              : result?.department || ''
        },
        {
          id: 'region',
          value:
            result?._source?.igaContent?.object?.region !== ''
              ? result?._source?.igaContent?.object?.region
              : ''
        },
        {
          id: 'description',
          value:
            result?._source?.igaContent?.description !== ''
              ? result?._source?.igaContent?.description[0]
              : ''
        },
        {
          id: 'endlocation',
          value:
            result?._source?.igaContent?.object?.location !== ''
              ? result?._source?.igaContent?.object?.location
              : ''
        },
        {
          id: 'dbagInfrastructureID',
          value:
            result?._source?.igaContent?.object?.dbagInfrastructureID !== ''
              ? iff(
                  Array.isArray(result?._source?.igaContent?.object.dbagInfrastructureID),
                  result?._source?.igaContent?.object.dbagInfrastructureID[0],
                  result?._source?.igaContent?.object.dbagInfrastructureID
                )
              : result?.dbAGInfrastructureNARID || ''
        },
        { id: 'id', value: result?._source?.id ? result?._source?.id : '' },
        {
          id: 'accessioRequestNo',
          value: result?._source?.Accessio_Request_No ? result?._source?.Accessio_Request_No : ''
        },
        {
          id: 'adGroupType',
          value: result?._source?.igaContent?.dbagRecerttype
            ? result?._source?.igaContent?.dbagRecerttype
            : ''
        },
        {
          id: 'adGroupSubType',
          value: result?._source?.igaContent?.dbagRecertSubtype
            ? result?._source?.igaContent?.dbagRecertSubtype
            : ''
        },
        {
          id: 'accessioGroupType',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioGroupType
              ? result?._source?.glossary?.idx['/']?.accessioGroupType
              : ''
        },
        {
          id: 'digitalIdentity',
          value: result?._source?.igaContent?.object?.digitalIdentity
            ? result?._source?.igaContent?.object?.digitalIdentity
            : ''
        },
        {
          id: 'role',
          value: result?._source?.igaContent?.object?.role
            ? result?._source?.igaContent?.object?.role
            : ''
        },
        {
          id: 'approverLevel',
          value: result?._source?.igaContent?.object?.approverLevel
            ? result?._source?.igaContent?.object?.approverLevel
            : ''
        },
        {
          id: 'categoryReference',
          value: result?._source?.igaContent?.object?.categoryReference
            ? result?._source?.igaContent?.object?.categoryReference
            : ''
        },
        {
          id: 'versionIterationofGroup',
          value: result?._source?.igaContent?.object?.versionIterationofGroup
            ? result?._source?.igaContent?.object?.versionIterationofGroup
            : ''
        },
        {
          id: 'vRMID',
          value: result?._source?.igaContent?.object?.vRMID
            ? result?._source?.igaContent?.object?.vRMID
            : ''
        },
        {
          id: 'groupNameText',
          value: result?._source?.igaContent?.object?.groupNameText
            ? result?._source?.igaContent?.object?.groupNameText
            : ''
        },
        {
          id: 'projectName',
          value: result?._source?.igaContent?.object?.projectName
            ? result?._source?.igaContent?.object?.projectName
            : ''
        },
        {
          id: 'productionUATorDEV',
          value: result?._source?.igaContent?.object?.productionUATorDEV
            ? result?._source?.igaContent?.object?.productionUATorDEV
            : ''
        },
        {
          id: 'applicationName',
          value: result?._source?.igaContent?.object?.applicationName
            ? result?._source?.igaContent?.object?.applicationName
            : ''
        },
        {
          id: 'groupRole',
          value: result?._source?.igaContent?.object?.groupRole
            ? result?._source?.igaContent?.object?.groupRole
            : ''
        },
        {
          id: 'safeName',
          value: result?._source?.igaContent?.object?.safeName
            ? result?._source?.igaContent?.object?.safeName
            : ''
        },
        {
          id: 'enterpriseServices',
          value: result?._source?.igaContent?.object?.enterpriseServices
            ? result?._source?.igaContent?.object?.enterpriseServices
            : ''
        },
        {
          id: 'dLPEnvironment',
          value: result?._source?.igaContent?.object?.dLPEnvironment
            ? result?._source?.igaContent?.object?.dLPEnvironment
            : ''
        },
        {
          id: 'dLPGroupRole',
          value: result?._source?.igaContent?.object?.dLPGroupRole
            ? result?._source?.igaContent?.object?.dLPGroupRole
            : ''
        },
        {
          id: 'serverName',
          value: result?._source?.igaContent?.object?.serverName
            ? result?._source?.igaContent?.object?.serverName
            : ''
        },
        {
          id: 'vendorteamName',
          value: result?._source?.igaContent?.object?.vendorteamName
            ? result?._source?.igaContent?.object?.vendorteamName
            : ''
        },
        {
          id: 'samLocation',
          value: result?._source?.igaContent?.object?.location
            ? result?._source?.igaContent?.object?.location
            : ''
        },
        {
          id: 'samAccount',
          value: result?._source?.igaContent?.displayName
            ? result?._source?.igaContent?.displayName
            : ''
        },
        {
          id: 'dbagsupportGroup',
          value: result?._source?.igaContent?.object?.dbagSupportGroup
            ? result?._source?.igaContent?.object?.dbagSupportGroup
            : result?.dbagsupportGroup || ''
        },
        {
          id: 'isGroupPrivileged',
          value: result?._source?.igaContent?.object?.isGroupPrivileged
            ? result?._source?.igaContent?.object?.isGroupPrivileged
            : ''
        },
        {
          id: 'dbagIMSDataSecCLass',
          value: result?._source?.igaContent?.dbagIMSDataSecCLass
            ? result?._source?.igaContent?.dbagIMSDataSecCLass
            : ''
        },
        {
          id: 'groupType',
          value: iff(groupTypeData, groupTypeData, result?._source?.igaContent?.object?.groupType)
        },
        {
          id: 'groupScope',
          value: result?._source?.igaContent?.object?.groupScope
            ? result?._source?.igaContent?.object?.groupScope
            : ''
        },
        {
          id: 'dbagExternalProvider',
          value: result?._source?.igaContent?.dbagExternalProvider
            ? result?._source?.igaContent?.dbagExternalProvider
            : ''
        },
        {
          id: 'info',
          value: result?._source?.igaContent?.object?.info
            ? result?._source?.igaContent?.object?.info
            : ''
        },
        {
          id: 'dbagExtensionAttribute2',
          value: result?._source?.igaContent?.object?.dbagExtensionAttribute2
            ? result?._source?.igaContent?.object?.dbagExtensionAttribute2
            : ''
        },
        {
          id: 'dbagProcessingdata',
          value: result?._source?.igaContent?.dbagProcessingdata
            ? result?._source?.igaContent?.dbagProcessingdata
            : ''
        },
        {
          id: 'entitlement',
          value: result?._source?.igaContent?.object?.dbagEntitlement
            ? iff(
                Array.isArray(result?._source?.igaContent?.object?.dbagEntitlement),
                result?._source?.igaContent?.object?.dbagEntitlement[0],
                result?._source?.igaContent?.object?.dbagEntitlement
              )
            : result?.entitlement || ''
        },
        {
          id: 'entitlementOther',
          value: result?._source?.igaContent?.object?.entitlementOther
            ? result?._source?.igaContent?.object?.entitlementOther
            : ''
        },
        {
          id: 'dbagFileSystemFullPaths',
          value: result?._source?.igaContent?.object?.dbagFileSystemFullPaths
            ? iff(
                Array.isArray(result?._source?.igaContent?.object?.dbagFileSystemFullPaths),
                result?._source?.igaContent?.object?.dbagFileSystemFullPaths[0],
                result?._source?.igaContent?.object?.dbagFileSystemFullPaths
              )
            : result?.paths || ''
        },
        {
          id: 'accessToPSI',
          value: result?._source?.igaContent?.object?.accessToPSI
            ? result?._source?.igaContent?.object?.accessToPSI
            : ''
        },
        {
          id: 'RobotBusinessDescription',
          value: result?._source?.igaContent?.object?.RobotBusinessDescription
            ? result?._source?.igaContent?.object?.RobotBusinessDescription
            : ''
        },
        {
          id: 'mAMs',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioGroupType ===
              'Robot Object - Infrastructure Other' &&
            result?._source?.igaContent?.dbagApplicationID
              ? iff(
                  Array.isArray(result?._source?.igaContent?.dbagApplicationID),
                  result?._source?.igaContent?.dbagApplicationID[0],
                  result?._source?.igaContent?.dbagApplicationID
                )
              : ''
        },
        {
          id: 'accessioPrerequisiteRMPRoles',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioPrerequisiteRMPRoles
              ? result?._source?.glossary?.idx['/']?.accessioPrerequisiteRMPRoles
              : ''
        },
        {
          id: 'dbagInfrastructureID',
          value: result?._source?.igaContent?.dbagInfrastructureID
            ? result?._source?.igaContent?.dbagInfrastructureID[0]
            : ''
        },
        {
          id: 'dbagSupportGroup',
          value: result?._source?.igaContent?.object?.dbagSupportGroup
            ? result?._source?.igaContent?.object?.dbagSupportGroup
            : result?.dbagSupportGroup || ''
        },
        {
          id: 'userScopeRestriction',
          value: result?._source?.igaContent?.object?.userScopeRestriction
            ? result?._source?.igaContent?.object?.userScopeRestriction
            : ''
        },
        {
          id: 'dlpOu',
          value: result?._source?.igaContent?.object?.location
            ? result?._source?.igaContent?.object?.location
            : ''
        },
        {
          id: 'dbagIMSAuthContact',
          value: result?._source?.igaContent?.object?.dbagIMSAuthContact
            ? result?._source?.igaContent?.object?.dbagIMSAuthContact
            : ''
        },
        {
          id: 'dbagIMSAuthContactDelegate',
          value: result?._source?.igaContent?.object?.dbagIMSAuthContactDelegate
            ? result?._source?.igaContent?.object?.dbagIMSAuthContactDelegate
            : ''
        },
        {
          id: 'dbagIMSApprovers',
          value: result?._source?.igaContent?.dbagIMSApprovers
            ? result?._source?.igaContent?.dbagIMSApprovers
            : ''
        },
        {
          id: 'pSIDescription',
          value: result?._source?.igaContent?.object?.pSIDescription
            ? result?._source?.igaContent?.object?.pSIDescription
            : ''
        },
        {
          id: 'justification',
          value: result?._source?.igaContent?.object?.requestJustification
            ? result?._source?.igaContent?.object?.requestJustification
            : ''
        },
        {
          id: 'accessioIsGroupPrivileged',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioIsGroupPrivileged
              ? result?._source?.glossary?.idx['/']?.accessioIsGroupPrivileged
              : ''
        },
        {
          id: 'accessioPlatformType',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioPlatformType
              ? result?._source?.glossary?.idx['/']?.accessioPlatformType
              : ''
        },
        {
          id: 'accessioIsgMSAGroup',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioIsgMSAGroup
              ? result?._source?.glossary?.idx['/']?.accessioIsgMSAGroup
              : ''
        },
        {
          id: 'dn',
          value: result?._source?.igaContent?.object?.dn
            ? result?._source?.igaContent?.object?.dn
            : ''
        },
        {
          id: 'dbagDataPrivClass',
          value: result?._source?.igaContent?.object?.dbagDataPrivClass
            ? result?._source?.igaContent?.object?.dbagDataPrivClass
            : result?.dbagDataPrivClass || ''
        },
        {
          id: 'dbagExtensionAttribute6',
          value: result?._source?.igaContent?.object?.dbagExtensionAttribute6
            ? result?._source?.igaContent?.object?.dbagExtensionAttribute6
            : result?.dbagExtensionAttribute6 || ''
        },
        {
          id: 'accessioPrerequisiteRMPRolesText',
          value:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioPrerequisiteRMPRoles
              ? result?._source?.glossary?.idx['/']?.accessioPrerequisiteRMPRoles
              : result?.accessioPrerequisiteRMPRoles || ''
        },
        {
          id: 'dbagIMSDataSecCLass',
          value: result?._source?.igaContent?.dbagIMSDataSecCLass
            ? result?._source?.igaContent?.dbagIMSDataSecCLass
            : ''
        },
        {
          id: 'dwsPrivate',
          value: result?._source?.igaContent?.object?.dwsPrivate
            ? result?._source?.igaContent?.object?.dwsPrivate
            : ''
        },
        {
          id: 'clientPrivate',
          value: result?._source?.igaContent?.object?.clientPrivate
            ? result?._source?.igaContent?.object?.clientPrivate
            : ''
        },
        {
          id: 'dbPrivate',
          value: result?._source?.igaContent?.object?.dbPrivate
            ? result?._source?.igaContent?.object?.dbPrivate
            : ''
        }
      ]
    : []
}

export const deleteAdGroup = async (payload) => {
  const response = await axios({
    url: '/v0/governance/deleteResource',
    data: payload,
    method: 'post'
  })
    .then((res) => res)
    .catch((error) => {
      console.error(error)
      return { status: 500, statusText: 'Error' }
    })
  return response
}
// It is duplicate function we need to remove this
// export const getModifyAdGroupMetaData = async () => {
//   const response = await axios(`/v0/configuration/metaType=modifyADGroup`).then((res) => res.data)
//   return response
// }

export const getReviewGroupMetadata = async () => {
  const response = await axios(`/v0/configuration/metaType=reviewMetadataGroup`)
    .then((res) => res.data)
    .catch((error) => {
      console.error(error)
      return { status: 500, statusText: 'Error', message: 'API Error' }
    })
  return response
}

export const getMetadataReviewRecordsToDownload = async (payload) =>
  axios({
    url: `/v0/users/groups/complianceFilter`,
    data: payload,
    method: 'post'
  })
    .then((res) => {
      const result = {}
      result.status = res?.status
      result.total = res?.data?.hits?.total?.value
      const groupData = []
      res?.data?.hits?.hits?.forEach((item) => {
        const applicationID =
          item?._source?.igaContent?.dbagApplicationID &&
          Array.isArray(item?._source?.igaContent?.dbagApplicationID)
            ? item?._source?.igaContent?.dbagApplicationID[0]
            : iff(
                item?._source?.igaContent?.dbagApplicationID,
                item?._source?.igaContent?.dbagApplicationID,
                ''
              )
        /* eslint no-underscore-dangle: 0 */
        groupData.push({
          displayName: item?._source?.igaContent?.displayName
            ? item?._source?.igaContent?.displayName
            : '',
          domain: item?._source?.igaContent?.distinguishedName
            ? findDomain(item?._source?.igaContent?.distinguishedName)
            : '',
          dbagObjectLastRecertified: item?._source?.igaContent?.object?.dbagObjectLastRecertified
            ? item?._source?.igaContent?.object?.dbagObjectLastRecertified
            : '',
          dbagApplicationID: applicationID,
          dbagCostcenter: item?._source?.igaContent?.dbagCostcenter
            ? item?._source?.igaContent?.dbagCostcenter
            : '',
          groupType: item?._source?.igaContent?.dbagRecerttype
            ? item?._source?.igaContent?.dbagRecerttype
            : '',
          groupSubType: item?._source?.igaContent?.dbagRecertSubtype
            ? item?._source?.igaContent?.dbagRecertSubtype
            : '',
          accessioGroupType:
            result?._source?.glossary?.idx &&
            result?._source?.glossary?.idx['/'] &&
            result?._source?.glossary?.idx['/']?.accessioGroupType
              ? result?._source?.glossary?.idx['/']?.accessioGroupType
              : ''
        })
      })
      result.groupData = groupData
      return result
    })
    .catch((err) => {
      console.error(err)
      const result = {}
      result.status = err?.status
      result.groupData = []
      result.total = 0
      return result
    })
