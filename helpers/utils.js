import axios from '../axios'
import * as accountApi from '../api/accountManagement'
import { getGroupDN, findDomain } from './strings'

export const applicationNamePrefix = 'APP_AD_B_'

export const CheckAdmin = (roles) =>
  roles.replace('[', '').replace(']', '').split(', ').includes('internal/role/application-admin') ||
  roles.replace('[', '').replace(']', '').split(', ').includes('internal/role/Service_Desk_Admin')

export const checkApplicationAdmin = (roles) =>
  roles.replace('[', '').replace(']', '').split(', ').includes('internal/role/application-admin')

export const checkServiceDeskAdmin = (roles) =>
  roles.replace('[', '').replace(']', '').split(', ').includes('internal/role/Service_Desk_Admin')

export const getPersonalAssetsPayload = (emailId, saPrimaryKey, pageSize, pageNumber) => ({
  targetName: '_id',
  targetValue: `${emailId}`,
  search_after_primaryKey: `${saPrimaryKey}`,
  pageSize,
  pageNumber
})

export const getPersonalAssetsByMail = (Id, pageSize, pageNumber) => ({
  targetName: '_id',
  targetValue: `${Id}`,
  pageSize,
  pageNumber
})

export const checkNoGroupApproversValidation = (approvers) => !(approvers && approvers.length > 0)

export const checkActiveApproverValidation = async (approver) => {
  const approverMail = approver.trim()
  const isValid = await axios({
    url: `/v0/governance/getEmailAddress?exactMatch=${true}&emailId=${approverMail}`,
    method: 'get'
  }).then((res) => res && res?.data?.length > 0)
  return isValid
}

export const checkProvisioningValidation = (dbagprovisioningby) =>
  ['169700-1', '65953-2', '38710-1', null, 0, 'null', 'NULL', '0'].includes(dbagprovisioningby)

export const checkModifiedValidation = (dbagModifiedby) =>
  ['169700-1', '65953-2', null, 0, 'null', 'NULL', '0'].includes(dbagModifiedby)

// If AccessioApp Request is true, It should not be allowed
export const checkAppManagementValidation = (accessioAppRequest) =>
  accessioAppRequest?.toLowerCase() === 'true'

export const checkisGMSAGroup = (id, accessioIsgMSAGroup) =>
  ['groupTypeForServer', 'PrincipalsAllowedToRetrieveManagedPassword']?.includes(id)
    ? accessioIsgMSAGroup?.toLowerCase() === 'no' ||
      accessioIsgMSAGroup === undefined ||
      accessioIsgMSAGroup === '' ||
      accessioIsgMSAGroup?.toLowerCase() === '0' ||
      accessioIsgMSAGroup?.toLowerCase() === 0 ||
      accessioIsgMSAGroup === false ||
      accessioIsgMSAGroup?.toLowerCase() === 'false'
    : accessioIsgMSAGroup?.toLowerCase() === 'yes' ||
      accessioIsgMSAGroup === true ||
      accessioIsgMSAGroup?.toLowerCase() === 'true' ||
      accessioIsgMSAGroup?.toLowerCase() === 1 ||
      accessioIsgMSAGroup?.toLowerCase() === '1'

// 1 -  Non-complaint
export const checkComplianceStatusValidation = (dbagComplianceStatus) =>
  dbagComplianceStatus !== '1'

export const checkOffBoardedValidation = (info) => info && info.includes('Disabled by dbAccessGate')

export const checkPrerequisiteRole = async (roleName, emailId) => {
  const encodedRoleName = encodeURIComponent(roleName)
  const result = await axios({
    url: `/v0/governance/getEMPRole?email=${emailId}&roleName=${encodedRoleName}`,
    method: 'get'
  })
    .then((res) => (res && res.data ? res.data : null))
    .catch((err) => {
      console.error(err)
      return null
    })

  return result
}

export const checkActiveInactiveUser = async (userId) => {
  const result = await axios({
    url: `/v0/user/getIdentityStatus?userId=${userId}`,
    method: 'get'
  })
    .then((res) => (res && res.data ? res.data : null))
    .catch((err) => {
      console.error(err)
      return null
    })

  return result
}

export const checkDomainTrust = async (groupDomain, accountDomain) => {
  const result = await axios({
    url: `/v0/governance/getDomainTrust?groupDomain=${groupDomain.toUpperCase()}&accountDomain=${accountDomain.toUpperCase()}`,
    method: 'get'
  })
    .then((res) => (res && res.data ? res.data : null))
    .catch((err) => {
      console.error(err)
      return null
    })

  return result
}

export const isValidEmail = (email) =>
  email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)

export const checkNoDomainValidation = (distinguishedName) =>
  ['', null, undefined, 'null'].includes(distinguishedName)

export const checkUniqueRequestForMembership = async (groupDN, dnObject) => {
  const payload = {
    targetFilter: {
      operator: 'AND',
      operand: [
        {
          operator: 'EQUALS',
          operand: {
            targetName: 'decision.status',
            targetValue: 'in-progress'
          }
        },
        {
          operator: 'EQUALS',
          operand: {
            targetName: 'request.common.isDraft',
            targetValue: false
          }
        },
        {
          operator: 'EQUALS',
          operand: {
            targetName: 'request.common.category',
            targetValue: 'AD Group'
          }
        },
        {
          operator: 'OR',
          operand: [
            {
              operator: 'AND',
              operand: [
                {
                  operator: 'OR',
                  operand: [
                    {
                      operator: 'EQUALS',
                      operand: {
                        targetName: 'request.common.operation',
                        targetValue: 'Amend'
                      }
                    },
                    {
                      operator: 'EQUALS',
                      operand: {
                        targetName: 'request.common.operation',
                        targetValue: 'Delete'
                      }
                    }
                  ]
                },
                {
                  operator: 'EQUALS',
                  operand: {
                    targetName: 'request.common.groupDN',
                    targetValue: groupDN
                  }
                }
              ]
            },
            {
              operator: 'AND',
              operand: [
                {
                  operator: 'OR',
                  operand: [
                    {
                      operator: 'EQUALS',
                      operand: {
                        targetName: 'request.common.operation',
                        targetValue: 'Add Membership'
                      }
                    },
                    {
                      operator: 'EQUALS',
                      operand: {
                        targetName: 'request.common.operation',
                        targetValue: 'Remove Membership'
                      }
                    }
                  ]
                },
                {
                  operator: 'EQUALS',
                  operand: {
                    targetName: 'request.common.groupDN',
                    targetValue: groupDN
                  }
                },
                {
                  operator: 'OR',
                  operand: [
                    {
                      operator: 'EQUALS',
                      operand: {
                        targetName: 'request.common.accountDN',
                        targetValue: dnObject?.accountDN || ''
                      }
                    },
                    {
                      operator: 'EQUALS',
                      operand: {
                        targetName: 'request.common.serverDN',
                        targetValue: dnObject?.serverDN || ''
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  }
  const resp = await accountApi.validateUniqueRequest(payload)
  if (resp?.result?.length > 0) {
    return false
  }
  return true
}

export const isParsable = (str) => {
  try {
    JSON.parse(str)
    return true
  } catch (error) {
    return false
  }
}

export const areEqualCaseInsensitive = (str1, str2) => str1.toLowerCase() === str2.toLowerCase()

export const ternaryCheck = (condition, then, otherise) => (condition ? then : otherise)

export const checkKerberosEncryptionType = (value) => {
  let KerberosType = ''
  if ([24, '24'].includes(value)) {
    KerberosType = 'AES128,AES256'
  }
  if ([8, '8'].includes(value)) {
    KerberosType = 'AES128'
  }
  if ([16, '16'].includes(value)) {
    KerberosType = 'AES256'
  }
  return KerberosType
}

export const getRequestItem = (item) => {
  let requestItem = ''
  /* eslint no-underscore-dangle: 0 */
  if (item?._source?.requestType === 'entitlementGrant') {
    requestItem = item?._source?.request?.common?.groupDN
      ? `${findDomain(item?._source?.request?.common?.groupDN)}/${getGroupDN(
          item?._source?.request?.common?.groupDN
        )}`
      : ''
  } else {
    requestItem = item?._source?.request?.common?.accountDetails?.sAMAccountName
      ? item?._source?.request?.common?.accountDetails?.sAMAccountName
      : ternaryCheck(
          item?._source?.request?.common?.sAMAccountName,
          item?._source?.request?.common?.sAMAccountName,
          ternaryCheck(
            item?._source?.request?.common?.groupDN,
            `${findDomain(item?._source?.request?.common?.groupDN)}/${getGroupDN(
              item?._source?.request?.common?.groupDN
            )}`,
            ternaryCheck(
              item?._source?.request?.common?.groupDetails?.distinguishedName,
              `${findDomain(
                item?._source?.request?.common?.groupDetails?.distinguishedName
              )}/${getGroupDN(item?._source?.request?.common?.groupDetails?.distinguishedName)}`,
              item?._source?.request?.common?.groupDetails?.displayName
            )
          )
        )
  }
  return requestItem
}

export const getExpiryDate = (expiryValue) => {
  let formattedDateTime = ''
  if (expiryValue && expiryValue !== '') {
    let expiry = expiryValue
    if (expiry.indexOf('T') === -1 && expiry.indexOf('Z') === -1) {
      expiry = new Date(expiryValue / 1e4 - 1.16444736e13).toISOString()
    }
    if (typeof expiry === 'string' && expiry.indexOf('T') > -1 && expiry.indexOf('Z') > -1) {
      const event = new Date(expiry)
      const padZero = (number) => number.toString().padStart(2, '0')
      const year = event.getFullYear()
      const month = event.getMonth() + 1
      const date = event.getDate()
      const hours = event.getHours()
      const minutes = event.getMinutes()
      const seconds = event.getSeconds()
      formattedDateTime = `${year}-${padZero(month)}-${padZero(date)} ${padZero(hours)}:${padZero(
        minutes
      )}:${padZero(seconds)}`
      return formattedDateTime
    }
    return expiry
  }
  return formattedDateTime
}
