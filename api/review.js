import translate from 'translations/translate'
import { getsemiAnnualBaseUrl } from 'helpers/appHelpers'
import axios from '../axios'

export const get = (id, reviewStatus, pageSize, pageNumber, description, userId) =>
  axios(
    `/v0/dashboard/mytasks/reviewertasks?campaignId=${id}&status=${reviewStatus}&itemType=AccountGrant,sharedAccount,ResourceGrant&pageSize=${pageSize}&pageNumber=${pageNumber}&sortBy=assignment&sortDesc=false`
  ).then((response) => {
    const normalizedData = []
    const total = response?.data?.totalHits ? response.data.totalHits : 0

    response.data.result.forEach((e, ind) => {
      const permission = e?.decision?.certification?.actors
        ?.map((act) => (act.id === `managed/user/${userId}` ? act.permissions : null))
        .filter((element) => element !== null)

      const entitlement = e?.assignment?.name.split(',')[0].includes('CN=')
        ? e?.assignment?.name.split(',')[0].slice(3)
        : e?.assignment?.name

      normalizedData.push({
        // Data available
        id: e?.id,
        total,
        applicationName: e?.application?.name ? e?.application?.name : e?.assignment?.name,
        entitlement: e?.account?.igaContent?.account_entitlement
          ? e?.account?.igaContent?.account_entitlement
          : entitlement,
        username: e?.user?.userName,
        email: e?.user?.mail,
        expirationDate: e?.decision?.certification?.deadline,
        comment: e?.decision?.certification?.comments,
        status: e?.decision?.certification?.decision,
        decision: e?.decision?.certification,
        permissions: permission ? permission[0] : e?.permissions,

        // Data not available
        /* eslint no-underscore-dangle: 0 */

        accountName: e?.account?.igaContent?.account_name
          ? e?.account?.igaContent?.account_name
          : e?.account?.__NAME__, // e?.account?.__NAME__.split(',')[0].slice(3)
        lastLogin: 'N/A',

        accountOwner: e?.account?.igaContent?.account_owner
          ? e?.account?.igaContent?.account_owner
          : '',
        accountDomain: e?.account?.igaContent?.account_domain
          ? e?.account?.igaContent?.account_domain
          : '',
        isPrivilegedAccount: e?.account?.igaContent?.is_privileged_account
          ? e?.account?.igaContent?.is_privileged_account
          : '',
        accountPlatform: e?.account?.igaContent?.account_platform
          ? e?.account?.igaContent?.account_platform
          : '',
        accountEntityStatus: e?.account?.igaContent?.account_entity_status
          ? e?.account?.igaContent?.account_entity_status
          : '',
        resourceType: e?.account?.igaContent?.resource_type
          ? e?.account?.igaContent?.resource_type
          : '',
        resourceClassification: e?.account?.igaContent?.resource_classification
          ? e?.account?.igaContent?.resource_classification
          : '',

        // DATABASE END USER CALRIFICATION

        databaseInstanceName: e?.account?.igaContent?.app_name
          ? e?.account?.igaContent?.app_name
          : '',
        source: e?.account?.igaContent?.account_platform
          ? e?.account?.igaContent?.account_platform
          : '',
        resource: e?.account?.igaContent?.account_hostname
          ? e?.account?.igaContent?.account_hostname
          : '',
        narId: e?.account?.igaContent?.account_nar_id
          ? e?.account?.igaContent?.account_nar_id
          : e?.account?.igaContent?.grp_nar_id,
        businessSource: e?.account?.igaContent?.account_nar_id
          ? `Application_${e?.account?.igaContent?.account_nar_id}`
          : '',
        // SELF ASSESMENT
        dataResourceSet: e?.account?.igaContent?.resource_type
          ? e?.account?.igaContent?.resource_type
          : '',
        resourceName: e?.account?.igaContent?.resource_name
          ? e?.account?.igaContent?.resource_name
          : '',
        entitledName: e?.account?.igaContent?.account_nar_id
          ? `SELF_ASSESMENT-${e?.account?.igaContent?.account_nar_id}-SELF_ASSESMENT_Domain-enabled`
          : '',
        entitledType: e?.account?.igaContent?.account_type ? 'Account' : '',
        account: e?.account?.igaContent?.account_type ? 'SELF_ASSESMENT' : '',
        accountOwnerValidated: e?.account?.igaContent?.account_owner
          ? e?.account?.igaContent?.account_owner
          : '',
        question: e?.account?.igaContent?.action ? e?.account?.igaContent?.action : '',
        description: e?.account?.igaContent?.description ? e?.account?.igaContent?.description : '',
        // EOF SELF ESSESMENT

        // AAA_WIN_UNIX_DB_DBPASSPORT_FOBO and AAA_WIN_UNIX_DB_DBPASSPORT_MOV
        databaseName: e?.account?.igaContent?.account_hostname
          ? e?.account?.igaContent?.account_hostname
          : '',
        accountType: e?.account?.igaContent?.account_entity_type
          ? e?.account?.igaContent?.account_entity_type
          : e?.account?.accountType,
        hostname: e?.account?.igaContent?.account_hostname
          ? e?.account?.igaContent?.account_hostname
          : '',
        // EOF AAA_WIN_UNIX_DB_DBPASSPORT_FOBO and AAA_WIN_UNIX_DB_DBPASSPORT_MOV

        // WIN_UNIX_DB_DBPASSPORT_FOBO
        groupId: e?.account?.igaContent?.group_id ? e?.account?.igaContent?.group_id : '',
        // EOF WIN_UNIX_DB_DBPASSPORT_FOBO
        // VDR
        dataRoomName: e?.assignment?.igaContent?.DR_NAME ? e?.assignment?.igaContent?.DR_NAME : '',
        dataRoomId: e?.assignment?.igaContent?.DR_APPLICATION_ID
          ? e?.assignment?.igaContent?.DR_APPLICATION_ID
          : '',
        accountTypeA: e?.account?.accountType ? e?.account?.accountType : '',
        groupDescription: e?.assignment?.igaContent?.GRP_DESCRIPTION
          ? e?.assignment?.igaContent?.GRP_DESCRIPTION
          : '',
        dataRoomDescription: e?.assignment?.igaContent?.DR_DESCRIPTION
          ? e?.assignment?.igaContent?.DR_DESCRIPTION
          : '',
        calOwner: e?.assignment?.igaContent?.CAL_OWNER ? e?.assignment?.igaContent?.CAL_OWNER : '',
        accountStatus: e?.account?.igaContent?.ACCOUNT_STATUS
          ? e?.account?.igaContent?.ACCOUNT_STATUS
          : '',
        // EOF VDR

        // AD
        name: e?.account?.igaContent?.givenName ? e?.account?.igaContent?.givenName : '',
        displayName: e?.account?.igaContent?.displayName ? e?.account?.igaContent?.displayName : '',
        distinguishedName: e?.account?.igaContent?.distinguishedName
          ? e?.account?.igaContent?.distinguishedName
          : '',
        sAMAccountName: e?.account?.igaContent?.sAMAccountName
          ? e?.account?.igaContent?.sAMAccountName
          : '',
        employeeType: e?.account?.igaContent?.employeeType
          ? e?.account?.igaContent?.employeeType
          : '',
        costCenter: e?.account?.igaContent?.dbagCostcenter
          ? e?.account?.igaContent?.dbagCostcenter
          : 'N/A',
        employeeID: e?.account?.igaContent?.employeeID ? e?.account?.igaContent?.employeeID : '',
        groupCategory: e?.assignment?.igaContent?.GroupCategory
          ? e?.assignment?.igaContent?.GroupCategory
          : '',
        adGroupDescription: e?.assignment?.igaContent?.description
          ? e?.assignment?.igaContent?.description[0]
          : '',
        // EOF AD

        // DB Passport
        groupName: e?.assignment?.igaContent?.grp_name
          ? e?.assignment?.igaContent?.grp_name
          : e?.account?.igaContent?.grp_name,
        groupType: e?.assignment?.igaContent?.grp_type
          ? e?.assignment?.igaContent?.grp_type
          : e?.account?.igaContent?.grp_type,
        groupDomain: e?.assignment?.igaContent?.grp_domain
          ? e?.assignment?.igaContent?.grp_domain
          : e?.account?.igaContent?.grp_domain,
        groupNarId: e?.assignment?.igaContent?.grp_nar_id
          ? e?.assignment?.igaContent?.grp_nar_id
          : e?.account?.igaContent?.grp_nar_id,
        // EOF DB Passport

        // DB Passport Entitlement
        dbEntitlement: e?.assignment?.igaContent?.entitlement
          ? e?.assignment?.igaContent?.entitlement
          : '',
        entitlementType: e?.assignment?.igaContent?.entitlement_type
          ? e?.assignment?.igaContent?.entitlement_type
          : '',
        entitlementDescription: e?.assignment?.igaContent?.entitlement_description
          ? e?.assignment?.igaContent?.entitlement_description
          : '',
        entitlementNarId: e?.assignment?.igaContent?.entitlement_nar_id
          ? e?.assignment?.igaContent?.entitlement_nar_id
          : '',
        // EOF DB Passport Entitlement
        UBRnode: 'N/A',
        supervisor: 'N/A',
        DISOM: 'N/A',
        history: [
          'History 1 last action',
          'History 1 before last action',
          'History 1 another previous action'
        ],

        action: null,
        confirmedDecision: false,
        checked: false,
        actors: e?.decision?.certification?.actors ? e.decision.certification.actors : []
      })
      if (['RACF_ROL_ACC'].includes(description)) {
        normalizedData[ind].narId = e?.account?.igaContent?.account_nar_id
          ? e?.account?.igaContent?.account_nar_id
          : ''
        // dummy values
        normalizedData[ind].accountType = e?.account?.igaContent?.account_type
          ? e?.account?.igaContent?.account_type
          : ''

        normalizedData[ind].accountName = e?.account?.igaContent?.account_name
          ? e?.account?.igaContent?.account_name
          : ''

        normalizedData[ind].accountDomain = e?.account?.igaContent?.account_domain
          ? e?.account?.igaContent?.account_domain
          : ''

        normalizedData[ind].accountOwner = e?.account?.igaContent?.account_owner
          ? e?.account?.igaContent?.account_owner
          : ''

        normalizedData[ind].accountSecondaryOwner = e?.account?.igaContent?.account_secondary_owner
          ? e?.account?.igaContent?.account_secondary_owner
          : ''

        normalizedData[ind].accountPlatform = e?.account?.igaContent?.account_platform
          ? e?.account?.igaContent?.account_platform
          : ''

        normalizedData[ind].accountEntityType = e?.account?.igaContent?.account_entity_type
          ? e?.account?.igaContent?.account_entity_type
          : ''

        normalizedData[ind].isPersonalAccount = e?.account?.igaContent?.is_personal_account
          ? e?.account?.igaContent?.is_personal_account
          : ''
        normalizedData[ind].isPrivilegedAccount = e?.account?.igaContent?.is_privileged_account
          ? e?.account?.igaContent?.is_privileged_account
          : ''
        normalizedData[ind].accountEntityStatus = e?.account?.igaContent?.account_entity_status
          ? e?.account?.igaContent?.account_entity_status
          : ''

        normalizedData[ind].appName = e?.account?.igaContent?.app_name
          ? e?.account?.igaContent?.app_name
          : ''
        normalizedData[ind].roleName = e?.account?.igaContent?.role_name
          ? e?.account?.igaContent?.role_name
          : ''
        normalizedData[ind].roleDescription = e?.account?.igaContent?.role_description
          ? e?.account?.igaContent?.role_description
          : ''

        normalizedData[ind].groupId = e?.account?.igaContent?.grp_name
          ? e?.account?.igaContent?.grp_name
          : ''
        normalizedData[ind].groupName = e?.account?.igaContent?.grp_name
          ? e?.account?.igaContent?.grp_name
          : ''
      }
      if (
        ['AAA_WIN_UNIX_DB_DBPASSPORT_MOV', 'AAA_WIN_UNIX_DB_DBPASSPORT_FOBO'].includes(description)
      ) {
        normalizedData[ind].accountType = e?.account?.igaContent?.account_entity_type
          ? e?.account?.igaContent?.account_entity_type
          : ''
        normalizedData[ind].accountCategory = e?.account?.accountType ? e?.account?.accountType : ''
      }
      if (['WIN_UNIX_DB_DBPASSPORT_FOBO'].includes(description)) {
        normalizedData[ind].accountType = e?.account?.igaContent?.account_entity_type
          ? e?.account?.igaContent?.account_entity_type
          : ''
        normalizedData[ind].accountCategory = e?.account?.accountType ? e?.account?.accountType : ''
        normalizedData[ind].entitlement = e?.account?.igaContent?.group_name
          ? e?.account?.igaContent?.group_name
          : ''
        normalizedData[ind].groupId = e?.account?.igaContent?.group_id
          ? e?.account?.igaContent?.group_id
          : ''
      }
      if (['SECURITY_VDRGROUP', 'SECURITY_VDRGROUP_MAIN'].includes(description)) {
        normalizedData[ind].accountName = e?.account?.igaContent?.ACCOUNT_ID
          ? e.account.igaContent.ACCOUNT_ID
          : ''
        normalizedData[ind].vdrProvider = e?.account?.igaContent?.VDR_PROVIDER
          ? e.account.igaContent.VDR_PROVIDER
          : ''
        normalizedData[ind].groupType = e?.assignment?.igaContent?.GRP_TYPE
          ? e.assignment.igaContent.GRP_TYPE
          : ''
        normalizedData[ind].groupName = e?.assignment?.igaContent?.GRP_NAME
          ? e.assignment.igaContent.GRP_NAME
          : ''
      }
      if (['RACF_ROL_GRP'].includes(description)) {
        // Valid Mpping
        normalizedData[ind].groupType = e?.account?.igaContent?.grp_type
          ? e?.account?.igaContent?.grp_type
          : ''

        normalizedData[ind].groupName = e?.account?.igaContent?.grp_name
          ? e?.account?.igaContent?.grp_name
          : ''

        normalizedData[ind].groupDomain = e?.account?.igaContent?.grp_domain
          ? e?.account?.igaContent?.grp_domain
          : ''

        normalizedData[ind].groupOwner = e?.account?.igaContent?.grp_owner
          ? e?.account?.igaContent?.grp_owner
          : ''

        normalizedData[ind].groupDelegateOwner = e?.account?.igaContent?.grp_delegate_owner
          ? e?.account?.igaContent?.grp_delegate_owner
          : ''

        normalizedData[ind].groupPlatform = e?.account?.igaContent?.grp_platform
          ? e?.account?.igaContent?.grp_platform
          : ''

        normalizedData[ind].groupNarId = e?.account?.igaContent?.grp_nar_id
          ? e?.account?.igaContent?.grp_nar_id
          : ''

        normalizedData[ind].groupDescription = e?.account?.igaContent?.grp_comments
          ? e?.account?.igaContent?.grp_comments
          : ''

        normalizedData[ind].groupEntityId = e?.account?.igaContent?.grp_entity_id
          ? e?.account?.igaContent?.grp_entity_id
          : ''

        normalizedData[ind].groupId = e?.account?.igaContent?.group_id
          ? e?.account?.igaContent?.group_id
          : ''

        normalizedData[ind].roleName = e?.account?.igaContent?.role_name
          ? e?.account?.igaContent?.role_name
          : ''

        normalizedData[ind].roleDescription = e?.account?.igaContent?.role_description
          ? e?.account?.igaContent?.role_description
          : ''
      }
      if (['RACF_GRP_ACC'].includes(description)) {
        // response JSON is not created yet so taking hardcoded values need to replace after getting proper response
        normalizedData[ind].groupDomain = e?.assignment?.igaContent?.grp_domain
          ? e?.assignment?.igaContent?.grp_domain
          : ''
        normalizedData[ind].groupName = e?.assignment?.igaContent?.grp_name
          ? e?.assignment?.igaContent?.grp_name
          : ''

        normalizedData[ind].groupId = e?.assignment?.igaContent?.group_id
          ? e?.assignment?.igaContent?.group_id
          : ''
        normalizedData[ind].groupPlatform = e?.assignment?.igaContent?.grp_platform
          ? e?.assignment?.igaContent?.grp_platform
          : ''

        normalizedData[ind].groupDelegateOwner = e?.assignment?.igaContent?.grp_delegate_owner
          ? e?.assignment?.igaContent?.grp_delegate_owner
          : ''

        normalizedData[ind].groupType = e?.assignment?.igaContent?.grp_type
          ? e?.assignment?.igaContent?.grp_type
          : ''

        normalizedData[ind].groupOwner = e?.assignment?.igaContent?.grp_owner
          ? e?.assignment?.igaContent?.grp_owner
          : ''

        normalizedData[ind].groupNarId = e?.assignment?.igaContent?.grp_nar_id
          ? e?.assignment?.igaContent?.grp_nar_id
          : ''
        normalizedData[ind].groupEntityId = e?.assignment?.igaContent?.grp_entity_id
          ? e?.assignment?.igaContent?.grp_entity_id
          : ''
        normalizedData[ind].groupDescription = e?.assignment?.igaContent?.grp_comments
          ? e?.assignment?.igaContent?.grp_comments
          : ''

        // New Columns added
        normalizedData[ind].accountNarId = e?.assignment?.igaContent?.account_nar_id
          ? e?.assignment?.igaContent?.account_nar_id
          : ''
        normalizedData[ind].accountType = e?.assignment?.igaContent?.account_type
          ? e?.assignment?.igaContent?.account_type
          : ''
        normalizedData[ind].accountName = e?.assignment?.igaContent?.account_name
          ? e?.assignment?.igaContent?.account_name
          : ''
        normalizedData[ind].accountDomain = e?.assignment?.igaContent?.account_domain
          ? e?.assignment?.igaContent?.account_domain
          : ''
        normalizedData[ind].accountOwner = e?.assignment?.igaContent?.account_owner
          ? e?.assignment?.igaContent?.account_owner
          : ''
        normalizedData[ind].accountSecondaryOwner = e?.assignment?.igaContent
          ?.account_secondary_owner
          ? e?.assignment?.igaContent?.account_secondary_owner
          : ''
        normalizedData[ind].accountPlatform = e?.assignment?.igaContent?.account_platform
          ? e?.assignment?.igaContent?.account_platform
          : ''
        normalizedData[ind].accountEntityType = e?.assignment?.igaContent?.account_entity_type
          ? e?.assignment?.igaContent?.account_entity_type
          : ''
        normalizedData[ind].isPersonalAccount = e?.assignment?.igaContent?.is_personal_account
          ? e?.assignment?.igaContent?.is_personal_account
          : ''
        normalizedData[ind].isPrivilegedAccount = e?.assignment?.igaContent?.is_privileged_account
          ? e?.assignment?.igaContent?.is_privileged_account
          : ''
        normalizedData[ind].accountEntityStatus = e?.assignment?.igaContent?.account_entity_status
          ? e?.assignment?.igaContent?.account_entity_status
          : ''
        normalizedData[ind].appName = e?.assignment?.igaContent?.app_name
          ? e?.assignment?.igaContent?.app_name
          : ''
        normalizedData[ind].roleDescription = e?.assignment?.igaContent?.role_description
          ? e?.assignment?.igaContent?.role_description
          : ''
        normalizedData[ind].groupId = e?.assignment?.igaContent?.grp_id
          ? e?.assignment?.igaContent?.grp_id
          : ''
        normalizedData[ind].groupName = e?.assignment?.igaContent?.grp_name
          ? e?.assignment?.igaContent?.grp_name
          : ''
      }
      if (['SECURITY_ADGROUP', 'SECURITY_ADGROUP_MAIN'].includes(description)) {
        normalizedData[ind].groupType = e?.assignment?.igaContent?.group_type
          ? e.assignment.igaContent.group_type
          : ''
      }
      if (['DB2_GRP'].includes(description)) {
        // response JSON is not created yet so taking hardcoded values need to replace after getting proper response
        normalizedData[ind].entilementUniqueName = 'entilementUniqueName'
        // dummy values
        normalizedData[ind].entilementDomain = 'entilementDomain'

        normalizedData[ind].groupId = 'groupId'

        normalizedData[ind].entilementPlatform = 'entilementPlatform'

        normalizedData[ind].entitlementDelegate = 'entitlementDelegate'
        normalizedData[ind].entitlementType = 'entitlementType'
        normalizedData[ind].entitlementOwner = 'entitlementOwner'
        normalizedData[ind].entitlementOwner = 'entitlementOwner'
      }
      if (['DB2_ACC', 'MIDRANGE_ACC'].includes(description)) {
        // response JSON is not created yet so taking hardcoded values need to replace after getting proper response

        normalizedData[ind].accountNarId = e?.account?.igaContent?.account_nar_id
          ? e?.account?.igaContent?.account_nar_id
          : ''
        normalizedData[ind].accountType = e?.account?.igaContent?.account_type
          ? e?.account?.igaContent?.account_type
          : ''
        normalizedData[ind].accountName = e?.account?.igaContent?.account_name
          ? e?.account?.igaContent?.account_name
          : ''
        normalizedData[ind].accountDomain = e?.account?.igaContent?.account_domain
          ? e?.account?.igaContent?.account_domain
          : ''
        normalizedData[ind].accountOwner = e?.account?.igaContent?.account_owner
          ? e?.account?.igaContent?.account_owner
          : ''
        normalizedData[ind].accountSecondaryOwner = e?.account?.igaContent?.account_secondary_owner
          ? e?.account?.igaContent?.account_secondary_owner
          : ''
        normalizedData[ind].accountPlatform = e?.account?.igaContent?.account_platform
          ? e?.account?.igaContent?.account_platform
          : ''
        normalizedData[ind].accountEntityType = e?.account?.igaContent?.account_entity_type
          ? e?.account?.igaContent?.account_entity_type
          : ''
        normalizedData[ind].isPersonalAccount = e?.account?.igaContent?.is_personal_account
          ? e?.account?.igaContent?.is_personal_account
          : ''
        normalizedData[ind].isPrivilegedAccount = e?.account?.igaContent?.is_privileged_account
          ? e?.account?.igaContent?.is_privileged_account
          : ''
        normalizedData[ind].accountEntityStatus = e?.account?.igaContent?.account_entity_status
          ? e?.account?.igaContent?.account_entity_status
          : ''
        normalizedData[ind].appName = e?.account?.igaContent?.app_name
          ? e?.account?.igaContent?.app_name
          : ''
      }
      if (['CYB_ACL_MEM'].includes(description)) {
        // Mapping for Account Object
        normalizedData[ind].accountNarId = e?.account?.igaContent?.account_nar_id
          ? e?.account?.igaContent?.account_nar_id
          : ''

        normalizedData[ind].accountEntityId = e?.account?.igaContent?.account_entity_id
          ? e?.account?.igaContent?.account_entity_id
          : ''

        normalizedData[ind].accountType = e?.account?.igaContent?.account_type
          ? e?.account?.igaContent?.account_type
          : ''

        normalizedData[ind].accountName = e?.account?.igaContent?.account_name
          ? e?.account?.igaContent?.account_name
          : ''

        normalizedData[ind].accountDomain = e?.account?.igaContent?.account_domain
          ? e?.account?.igaContent?.account_domain
          : ''

        normalizedData[ind].individualId = e?.account?.igaContent?.individual_id
          ? e?.account?.igaContent?.individual_id
          : ''

        normalizedData[ind].accountOwner = e?.account?.igaContent?.account_owner
          ? e?.account?.igaContent?.account_owner
          : ''

        normalizedData[ind].accountSecondaryOwner = e?.account?.igaContent?.account_secondary_owner
          ? e?.account?.igaContent?.account_secondary_owner
          : ''

        normalizedData[ind].accountPlatform = e?.account?.igaContent?.account_platform
          ? e?.account?.igaContent?.account_platform
          : ''

        normalizedData[ind].accountEntityType = e?.account?.igaContent?.account_entity_type
          ? e?.account?.igaContent?.account_entity_type
          : ''

        normalizedData[ind].isPersonalAccount = e?.account?.igaContent?.is_personal_account
          ? e?.account?.igaContent?.is_personal_account
          : ''

        normalizedData[ind].isPrivilegedAccount = e?.account?.igaContent?.is_privileged_account
          ? e?.account?.igaContent?.is_privileged_account
          : ''

        normalizedData[ind].accountEntityStatus = e?.account?.igaContent?.account_entity_status
          ? e?.account?.igaContent?.account_entity_status
          : ''

        normalizedData[ind].appName = e?.account?.igaContent?.app_name
          ? e?.account?.igaContent?.app_name
          : ''

        // Mapping for Group Object
        normalizedData[ind].groupType = e?.assignment?.igaContent?.grp_type
          ? e?.assignment?.igaContent?.grp_type
          : ''

        normalizedData[ind].groupNameGrp = e?.assignment?.igaContent?.grp_name
          ? e?.assignment?.igaContent?.grp_name
          : ''

        normalizedData[ind].groupDomain = e?.assignment?.igaContent?.grp_domain
          ? e?.assignment?.igaContent?.grp_domain
          : ''

        normalizedData[ind].groupOwner = e?.assignment?.igaContent?.grp_owner
          ? e?.assignment?.igaContent?.grp_owner
          : ''

        normalizedData[ind].groupDelegateOwner = e?.assignment?.igaContent?.grp_delegate_owner
          ? e?.assignment?.igaContent?.grp_delegate_owner
          : ''

        normalizedData[ind].groupPlatform = e?.assignment?.igaContent?.grp_platform
          ? e?.assignment?.igaContent?.grp_platform
          : ''

        normalizedData[ind].groupNarId = e?.assignment?.igaContent?.grp_nar_id
          ? e?.assignment?.igaContent?.grp_nar_id
          : ''

        normalizedData[ind].groupDescription = e?.assignment?.igaContent?.grp_comments
          ? e?.assignment?.igaContent?.grp_comments
          : ''

        normalizedData[ind].groupEntityId = e?.assignment?.igaContent?.grp_entity_id
          ? e?.assignment?.igaContent?.grp_entity_id
          : ''

        normalizedData[ind].groupId = e?.assignment?.igaContent?.grp_id
          ? e?.assignment?.igaContent?.grp_id
          : ''
      }
      if (['CYB_SAFE_CNT_ACL'].includes(description)) {
        // Mapping for Account Object

        normalizedData[ind].groupType = e?.account?.igaContent?.group_type
          ? e?.account?.igaContent?.group_type
          : ''

        normalizedData[ind].groupName = e?.account?.igaContent?.group_name
          ? e?.account?.igaContent?.group_name
          : ''

        normalizedData[ind].groupIndividualId = e?.account?.igaContent?.group_individual_id
          ? e?.account?.igaContent?.group_individual_id
          : ''

        normalizedData[ind].groupEntityId = e?.account?.igaContent?.group_entity_id
          ? e?.account?.igaContent?.group_entity_id
          : ''

        normalizedData[ind].groupPlatform = e?.account?.igaContent?.group_platform
          ? e?.account?.igaContent?.group_platform
          : ''
        normalizedData[ind].groupOwner = e?.account?.igaContent?.group_owner
          ? e?.account?.igaContent?.group_owner
          : ''
        normalizedData[ind].groupOwnerType = e?.account?.igaContent?.group_owner_type
          ? e?.account?.igaContent?.group_owner_type
          : ''

        normalizedData[ind].groupOwnerDelegate = e?.account?.igaContent?.group_owner_delegate
          ? e?.account?.igaContent?.group_owner_delegate
          : ''

        normalizedData[ind].groupEntityType = e?.account?.igaContent?.group_entity_type
          ? e?.account?.igaContent?.group_entity_type
          : ''

        normalizedData[ind].groupEntityStatus = e?.account?.igaContent?.group_entity_status
          ? e?.account?.igaContent?.group_entity_status
          : ''

        normalizedData[ind].groupDomain = e?.account?.igaContent?.group_domain
          ? e?.account?.igaContent?.group_domain
          : ''

        normalizedData[ind].groupComments = e?.account?.igaContent?.group_comments
          ? e?.account?.igaContent?.group_comments
          : ''

        normalizedData[ind].groupNarId = e?.account?.igaContent?.group_nar_id
          ? e?.account?.igaContent?.group_nar_id
          : ''

        normalizedData[ind].groupCreateDate = e?.account?.igaContent?.group_create_date
          ? e?.account?.igaContent?.group_create_date
          : ''

        normalizedData[ind].cybaction = e?.account?.igaContent?.action
          ? e?.account?.igaContent?.action
          : ''

        normalizedData[ind].actionDescription = e?.account?.igaContent?.action_description
          ? e?.account?.igaContent?.action_description
          : ''
        normalizedData[ind].resourseName = e?.account?.igaContent?.resource_name
          ? e?.account?.igaContent?.resource_name
          : ''

        normalizedData[ind].resourseType = e?.account?.igaContent?.resource_type
          ? e?.account?.igaContent?.resource_type
          : ''

        normalizedData[ind].resourseFQN = e?.account?.igaContent?.resource_fqn
          ? e?.account?.igaContent?.resource_fqn
          : ''

        normalizedData[ind].resourseDescription = e?.account?.igaContent?.resource_description
          ? e?.account?.igaContent?.resource_description
          : ''

        normalizedData[ind].resourseClassification = e?.account?.igaContent?.resource_classification
          ? e?.account?.igaContent?.resource_classification
          : ''

        normalizedData[ind].resourseEntityLifeStatus = e?.account?.igaContent
          ?.resource_entity_life_status
          ? e?.account?.igaContent?.resource_entity_life_status
          : ''

        normalizedData[ind].resourseEntityInstanceName = e?.account?.igaContent
          ?.resource_entity_instance_name
          ? e?.account?.igaContent?.resource_entity_instance_name
          : ''

        normalizedData[ind].resourseEntityType = e?.account?.igaContent?.resource_entity_type
          ? e?.account?.igaContent?.resource_entity_type
          : ''

        normalizedData[ind].supportRoleName = e?.account?.igaContent?.support_role_name
          ? e?.account?.igaContent?.support_role_name
          : ''

        normalizedData[ind].supportRoleLeader = e?.account?.igaContent?.support_role_leader
          ? e?.account?.igaContent?.support_role_leader
          : ''

        normalizedData[ind].resourseCreateDate = e?.account?.igaContent?.resource_create_date
          ? e?.account?.igaContent?.resource_create_date
          : ''

        // Mapping for Group Object

        normalizedData[ind].safeOwnerEmail = e?.account?.igaContent?.safe_owner_email
          ? e?.account?.igaContent?.safe_owner_email
          : ''

        normalizedData[ind].safeDelegate1Email = e?.account?.igaContent?.safe_delegate_1_email
          ? e?.account?.igaContent?.safe_delegate_1_email
          : ''

        normalizedData[ind].safeDelegate2Email = e?.account?.igaContent?.safe_delegate_2_email
          ? e?.account?.igaContent?.safe_delegate_2_email
          : ''
        normalizedData[ind].safeDelegate3Email = e?.account?.igaContent?.safe_delegate_3_email
          ? e?.account?.igaContent?.safe_delegate_3_email
          : ''
      }
      if (['CYB_SAFE_CNT'].includes(description)) {
        // Mapping for Account Object

        normalizedData[ind].safetype = e?.account?.igaContent?.safe_type
          ? e?.account?.igaContent?.safe_type
          : ''

        normalizedData[ind].safeName = e?.account?.igaContent?.safe_name
          ? e?.account?.igaContent?.safe_name
          : ''

        normalizedData[ind].safeIndividualId = e?.igaContent?.safe_individual_id
          ? e?.igaContent?.safe_individual_id
          : ''

        normalizedData[ind].safeEntityId = e?.account?.igaContent?.safe_entity_id
          ? e?.account?.igaContent?.safe_entity_id
          : ''

        normalizedData[ind].safePlatform = e?.account?.igaContent?.safe_platform
          ? e?.account?.igaContent?.safe_platform
          : ''
        normalizedData[ind].safeOwner = e?.account?.igaContent?.safe_owner
          ? e?.account?.igaContent?.safe_owner
          : ''
        normalizedData[ind].safeOwnerType = e?.account?.igaContent?.safe_owner_type
          ? e?.account?.igaContent?.safe_owner_type
          : ''

        normalizedData[ind].safeOwnerDelegate = e?.account?.igaContent?.safe_owner_delegate
          ? e?.account?.igaContent?.safe_owner_delegate
          : ''

        normalizedData[ind].safeEntityType = e?.account?.igaContent?.safe_entity_type
          ? e?.account?.igaContent?.safe_entity_type
          : ''

        normalizedData[ind].safeEntityStatus = e?.account?.igaContent?.safe_entity_status
          ? e?.account?.igaContent?.safe_entity_status
          : ''

        normalizedData[ind].safeDomain = e?.account?.igaContent?.safe_domain
          ? e?.account?.igaContent?.safe_domain
          : ''

        normalizedData[ind].safeComments = e?.account?.igaContent?.safe_comments
          ? e?.account?.igaContent?.safe_comments
          : ''

        normalizedData[ind].safeNarId = e?.account?.igaContent?.safe_nar_id
          ? e?.account?.igaContent?.safe_nar_id
          : ''

        normalizedData[ind].safeCreateDate = e?.account?.igaContent?.safe_create_date
          ? e?.account?.igaContent?.safe_create_date
          : ''

        normalizedData[ind].cybaction = e?.account?.igaContent?.action
          ? e?.account?.igaContent?.action
          : ''

        normalizedData[ind].actionDescription = e?.account?.igaContent?.action_description
          ? e?.account?.igaContent?.action_description
          : ''

        normalizedData[ind].resourseName = e?.account?.igaContent?.resource_name
          ? e?.account?.igaContent?.resource_name
          : ''

        normalizedData[ind].resourseType = e?.account?.igaContent?.resource_type
          ? e?.account?.igaContent?.resource_type
          : ''

        normalizedData[ind].resourseFQN = e?.account?.igaContent?.resource_fqn
          ? e?.account?.igaContent?.resource_fqn
          : ''

        normalizedData[ind].resourseDescription = e?.account?.igaContent?.resource_description
          ? e?.account?.igaContent?.resource_description
          : ''

        normalizedData[ind].resourseClassification = e?.account?.igaContent?.resource_classification
          ? e?.account?.igaContent?.resource_classification
          : ''

        normalizedData[ind].resourseEntityLifeStatus = e?.account?.igaContent
          ?.resource_entity_life_status
          ? e?.account?.igaContent?.resource_entity_life_status
          : ''

        normalizedData[ind].resourseEntityInstanceName = e?.account?.igaContent
          ?.resource_entity_instance_name
          ? e?.account?.igaContent?.resource_entity_instance_name
          : ''

        normalizedData[ind].resourseEntityType = e?.account?.igaContent?.resource_entity_type
          ? e?.account?.igaContent?.resource_entity_type
          : ''

        normalizedData[ind].supportRoleLeader = e?.account?.igaContent?.support_role_leader
          ? e?.account?.igaContent?.support_role_leader
          : ''
        normalizedData[ind].supportRoleName = e?.account?.igaContent?.support_role_name
          ? e?.account?.igaContent?.support_role_name
          : ''
        normalizedData[ind].entitlementCreateDate = e?.account?.igaContent?.resource_create_date
          ? e?.account?.igaContent?.resource_create_date
          : ''

        // Mapping for Group Object

        normalizedData[ind].resourseCreateDate = e?.account?.igaContent?.resource_create_date
          ? e?.account?.igaContent?.resource_create_date
          : ''
      }
    })
    return normalizedData
  })
const checkRolePermission = (actorId, userRoles) => {
  if (userRoles.indexOf(actorId) >= 0) {
    return true
  }
  return false
}
const getNormalizedData = (response, userId, description, total, provisioningRoles) => {
  const normalizedData = []
  const userRoles = provisioningRoles
  response?.data?.hits?.hits.forEach((e, index) => {
    let permission = e?._source?.decision?.certification?.actors
      ?.map((act) => (act.id === `managed/user/${userId}` ? act.permissions : null))
      .filter((element) => element !== null)
    if (permission.length === 0) {
      permission = e?._source?.decision?.certification?.actors
        ?.map((act) => (checkRolePermission(act.id, userRoles) ? act.permissions : null))
        .filter((element) => element !== null)
    }
    const entitlement = e?._source?.assignment?.name.split(',')[0].includes('CN=')
      ? e?._source?.assignment?.name.split(',')[0].slice(3)
      : e?._source?.assignment?.name

    normalizedData.push({
      // Data available
      id: e?._source?.id,
      total,
      applicationName: e?._source?.application?.name
        ? e?._source?.application?.name
        : e?._source?.assignment?.name,
      entitlement: e?._source?.account?.igaContent?.account_entitlement
        ? e?._source?.account?.igaContent?.account_entitlement
        : entitlement,
      username: e?._source?.user?.userName,
      email: e?._source?.user?.mail,
      expirationDate: e?._source?.decision?.certification?.deadline,
      comment: e?._source?.decision?.certification?.comments,
      status: e?._source?.decision?.certification?.decision,
      decision: e?._source?.decision?.certification,
      permissions: permission ? permission[0] : e?._source?.permissions,

      // Data not available
      /* eslint no-underscore-dangle: 0 */

      accountName: e?._source?.account?.igaContent?.account_name
        ? e?._source?.account?.igaContent?.account_name
        : e?._source?.account?.__NAME__, // e?.account?.__NAME__.split(',')[0].slice(3)
      lastLogin: 'N/A',

      accountOwner: e?._source?.account?.igaContent?.account_owner
        ? e?._source?.account?.igaContent?.account_owner
        : '',
      accountDomain: e?._source?.account?.igaContent?.account_domain
        ? e?._source?.account?.igaContent?.account_domain
        : '',
      isPrivilegedAccount: e?._source?.account?.igaContent?.is_privileged_account
        ? e?._source?.account?.igaContent?.is_privileged_account
        : '',
      accountPlatform: e?._source?.account?.igaContent?.account_platform
        ? e?._source?.account?.igaContent?.account_platform
        : '',
      accountEntityStatus: e?._source?.account?.igaContent?.account_entity_status
        ? e?._source?.account?.igaContent?.account_entity_status
        : '',
      resourceType: e?._source?.account?.igaContent?.resource_type
        ? e?._source?.account?.igaContent?.resource_type
        : '',
      resourceClassification: e?._source?.account?.igaContent?.resource_classification
        ? e?._source?.account?.igaContent?.resource_classification
        : '',

      // DATABASE END USER CALRIFICATION

      databaseInstanceName: e?._source?.account?.igaContent?.app_name
        ? e?._source?.account?.igaContent?.app_name
        : '',
      source: e?._source?.account?.igaContent?.account_platform
        ? e?._source?.account?.igaContent?.account_platform
        : '',
      resource: e?._source?.account?.igaContent?.account_hostname
        ? e?._source?.account?.igaContent?.account_hostname
        : '',
      narId: e?._source?.account?.igaContent?.account_nar_id
        ? e?._source?.account?.igaContent?.account_nar_id
        : e?._source?.account?.igaContent?.grp_nar_id,
      businessSource: e?._source?.account?.igaContent?.account_nar_id
        ? `Application_${e?._source?.account?.igaContent?.account_nar_id}`
        : '',
      // SELF ASSESMENT
      dataResourceSet: e?._source?.account?.igaContent?.resource_type
        ? e?._source?.account?.igaContent?.resource_type
        : '',
      resourceName: e?._source?.account?.igaContent?.resource_name
        ? e?._source?.account?.igaContent?.resource_name
        : '',
      entitledName: e?._source?.account?.igaContent?.account_nar_id
        ? `SELF_ASSESMENT-${e?._source?.account?.igaContent?.account_nar_id}-SELF_ASSESMENT_Domain-enabled`
        : '',
      entitledType: e?._source?.account?.igaContent?.account_type ? 'Account' : '',
      account: e?._source?.account?.igaContent?.account_type ? 'SELF_ASSESMENT' : '',
      accountOwnerValidated: e?._source?.account?.igaContent?.account_owner
        ? e?._source?.account?.igaContent?.account_owner
        : '',
      question: e?._source?.account?.igaContent?.action
        ? e?._source?.account?.igaContent?.action
        : '',
      description: e?._source?.account?.igaContent?.description
        ? e?._source?.account?.igaContent?.description
        : '',
      // EOF SELF ESSESMENT

      // AAA_WIN_UNIX_DB_DBPASSPORT_FOBO and AAA_WIN_UNIX_DB_DBPASSPORT_MOV
      databaseName: e?._source?.account?.igaContent?.account_hostname
        ? e?._source?.account?.igaContent?.account_hostname
        : '',
      accountType: e?._source?.account?.igaContent?.account_entity_type
        ? e?._source?.account?.igaContent?.account_entity_type
        : e?._source?.account?.accountType,
      hostname: e?._source?.account?.igaContent?.account_hostname
        ? e?._source?.account?.igaContent?.account_hostname
        : '',
      // EOF AAA_WIN_UNIX_DB_DBPASSPORT_FOBO and AAA_WIN_UNIX_DB_DBPASSPORT_MOV

      // AAA_WIN_UNIX_DB_DBPASSPORT_MOV
      groupId: e?._source?.account?.igaContent?.group_id
        ? e?._source?.account?.igaContent?.group_id
        : '',
      // EOF AAA_WIN_UNIX_DB_DBPASSPORT_MOV

      // VDR
      dataRoomName: e?._source?.assignment?.igaContent?.DR_NAME
        ? e?._source?.assignment?.igaContent?.DR_NAME
        : '',
      dataRoomId: e?._source?.assignment?.igaContent?.DR_APPLICATION_ID
        ? e?._source?.assignment?.igaContent?.DR_APPLICATION_ID
        : '',
      accountTypeA: e?._source?.account?.accountType ? e?._source?.account?.accountType : '',
      groupDescription: e?._source?.assignment?.igaContent?.GRP_DESCRIPTION
        ? e?._source?.assignment?.igaContent?.GRP_DESCRIPTION
        : '',
      dataRoomDescription: e?._source?.assignment?.igaContent?.DR_DESCRIPTION
        ? e?._source?.assignment?.igaContent?.DR_DESCRIPTION
        : '',
      calOwner: e?._source?.assignment?.igaContent?.CAL_OWNER
        ? e?._source?.assignment?.igaContent?.CAL_OWNER
        : '',
      accountStatus: e?._source?.account?.igaContent?.ACCOUNT_STATUS
        ? e?._source?.account?.igaContent?.ACCOUNT_STATUS
        : '',
      // EOF VDR

      // AD
      name: e?._source?.account?.igaContent?.givenName
        ? e?._source?.account?.igaContent?.givenName
        : '',
      displayName: e?._source?.account?.igaContent?.displayName
        ? e?._source?.account?.igaContent?.displayName
        : '',
      distinguishedName: e?._source?.account?.igaContent?.distinguishedName
        ? e?._source?.account?.igaContent?.distinguishedName
        : '',
      sAMAccountName: e?._source?.account?.igaContent?.sAMAccountName
        ? e?._source?.account?.igaContent?.sAMAccountName
        : '',
      employeeType: e?._source?.account?.igaContent?.employeeType
        ? e?._source?.account?.igaContent?.employeeType
        : '',
      costCenter: e?._source?.account?.igaContent?.dbagCostcenter
        ? e?._source?.account?.igaContent?.dbagCostcenter
        : '',
      employeeID: e?._source?.account?.igaContent?.employeeID
        ? e?._source?.account?.igaContent?.employeeID
        : '',
      groupCategory: e?._source?.assignment?.igaContent?.GroupCategory
        ? e?._source?.assignment?.igaContent?.GroupCategory
        : '',
      adGroupDescription: e?._source?.assignment?.igaContent?.description
        ? e?._source?.assignment?.igaContent?.description[0]
        : '',
      // EOF AD

      // DB Passport
      groupName: e?._source?.assignment?.igaContent?.grp_name
        ? e?._source?.assignment?.igaContent?.grp_name
        : e?._source?.account?.igaContent?.grp_name,
      groupType: e?._source?.assignment?.igaContent?.grp_type
        ? e?._source?.assignment?.igaContent?.grp_type
        : e?._source?.account?.igaContent?.grp_type,
      groupDomain: e?._source?.assignment?.igaContent?.grp_domain
        ? e?._source?.assignment?.igaContent?.grp_domain
        : e?._source?.account?.igaContent?.grp_domain,
      groupNarId: e?._source?.assignment?.igaContent?.grp_nar_id
        ? e?._source?.assignment?.igaContent?.grp_nar_id
        : e?._source?.account?.igaContent?.grp_nar_id,
      // EOF DB Passport

      // DB Passport Entitlement
      dbEntitlement: e?._source?.assignment?.igaContent?.entitlement
        ? e?._source?.assignment?.igaContent?.entitlement
        : '',
      entitlementType: e?._source?.assignment?.igaContent?.entitlement_type
        ? e?._source?.assignment?.igaContent?.entitlement_type
        : '',
      entitlementDescription: e?._source?.assignment?.igaContent?.entitlement_description
        ? e?._source?.assignment?.igaContent?.entitlement_description
        : '',
      entitlementNarId: e?._source?.assignment?.igaContent?.entitlement_nar_id
        ? e?._source?.assignment?.igaContent?.entitlement_nar_id
        : '',
      // EOF DB Passport Entitlement

      UBRnode: 'N/A',
      supervisor: 'N/A',
      DISOM: 'N/A',
      history: [
        'History 1 last action',
        'History 1 before last action',
        'History 1 another previous action'
      ],

      action: null,
      confirmedDecision: false,
      checked: false,
      sort: { sort: e?.sort },
      actors: e?._source?.decision?.certification?.actors
        ? e?._source?.decision?.certification?.actors
        : []
    })
    if (
      ['AAA_WIN_UNIX_DB_DBPASSPORT_MOV', 'AAA_WIN_UNIX_DB_DBPASSPORT_FOBO'].includes(description)
    ) {
      normalizedData[index].accountType = e?._source?.account?.igaContent?.account_entity_type
        ? e?._source?.account?.igaContent?.account_entity_type
        : ''
      normalizedData[index].accountCategory = e?._source?.account?.accountType
        ? e?._source?.account?.accountType
        : ''
    }
    if (['WIN_UNIX_DB_DBPASSPORT_FOBO'].includes(description)) {
      normalizedData[index].accountType = e?._source?.account?.igaContent?.account_entity_type
        ? e?._source?.account?.igaContent?.account_entity_type
        : ''
      normalizedData[index].accountCategory = e?._source?.account?.accountType
        ? e?._source?.account?.accountType
        : ''
      normalizedData[index].entitlement = e?._source?.account?.igaContent?.group_name
        ? e?._source?.account?.igaContent?.group_name
        : ''
      normalizedData[index].groupId = e?._source?.account?.igaContent?.group_id
        ? e?._source?.account?.igaContent?.group_id
        : ''
    }
    if (['SECURITY_VDRGROUP', 'SECURITY_VDRGROUP_MAIN'].includes(description)) {
      normalizedData[index].accountName = e?._source?.account?.igaContent?.ACCOUNT_ID
        ? e._source.account.igaContent.ACCOUNT_ID
        : ''
      normalizedData[index].vdrProvider = e?._source?.account?.igaContent?.VDR_PROVIDER
        ? e._source?.account.igaContent.VDR_PROVIDER
        : ''
      normalizedData[index].groupType = e?._source?.assignment?.igaContent?.GRP_TYPE
        ? e._source?.assignment.igaContent.GRP_TYPE
        : ''
      normalizedData[index].groupName = e?._source?.assignment?.igaContent?.GRP_NAME
        ? e._source?.assignment.igaContent.GRP_NAME
        : ''
    }
    if (['SECURITY_ADGROUP', 'SECURITY_ADGROUP_MAIN'].includes(description)) {
      normalizedData[index].groupType = e?.assignment?.igaContent?.group_type
        ? e._source.assignment.igaContent.group_type
        : ''
    }
    if (['RACF_ROL_GRP'].includes(description)) {
      // Valid Mpping
      normalizedData[index].groupType = e?._source?.account?.igaContent?.grp_type
        ? e?._source?.account?.igaContent?.grp_type
        : ''

      normalizedData[index].groupName = e?._source?.account?.igaContent?.grp_name
        ? e?._source?.account?.igaContent?.grp_name
        : ''

      normalizedData[index].groupDomain = e?._source?.account?.igaContent?.grp_domain
        ? e?._source?.account?.igaContent?.grp_domain
        : ''

      normalizedData[index].groupOwner = e?._source?.account?.igaContent?.grp_owner
        ? e?._source?.account?.igaContent?.grp_owner
        : ''

      normalizedData[index].groupDelegateOwner = e?._source?.account?.igaContent?.grp_delegate_owner
        ? e?._source?.account?.igaContent?.grp_delegate_owner
        : ''

      normalizedData[index].groupPlatform = e?._source?.account?.igaContent?.grp_platform
        ? e?._source?.account?.igaContent?.grp_platform
        : ''

      normalizedData[index].groupNarId = e?._source?.account?.igaContent?.grp_nar_id
        ? e?._source?.account?.igaContent?.grp_nar_id
        : ''

      normalizedData[index].groupEntityId = e?._source?.account?.igaContent?.grp_entity_id
        ? e?._source?.account?.igaContent?.grp_entity_id
        : ''

      normalizedData[index].groupDescription = e?._source?.account?.igaContent?.grp_comments
        ? e?._source?.account?.igaContent?.grp_comments
        : ''

      normalizedData[index].groupId = e?._source?.account?.igaContent?.group_id
        ? e?._source?.account?.igaContent?.group_id
        : ''

      normalizedData[index].roleName = e?._source?.account?.igaContent?.role_name
        ? e?._source?.account?.igaContent?.role_name
        : ''

      normalizedData[index].roleDescription = e?._source?.account?.igaContent?.role_description
        ? e?._source?.account?.igaContent?.role_description
        : ''
    }
    if (['RACF_GRP_ACC'].includes(description)) {
      // response JSON is not created yet so taking hardcoded values need to replace after getting proper response
      normalizedData[index].entilementDomain = e?._source?.assignment?.igaContent?.grp_domain
        ? e?._source?.assignment?.igaContent?.grp_domain
        : ''

      normalizedData[index].groupId = e?._source?.assignment?.igaContent?.group_id
        ? e?._source?.assignment?.igaContent?.group_id
        : ''

      normalizedData[index].entilementPlatform = e?._source?.assignment?.igaContent?.grp_platform
        ? e?._source?.assignment?.igaContent?.grp_platform
        : ''

      normalizedData[index].entitlementDelegate = e?._source?.assignment?.igaContent
        ?.grp_delegate_owner
        ? e?._source?.assignment?.igaContent?.grp_delegate_owner
        : ''

      normalizedData[index].entitlementType = e?._source?.assignment?.igaContent?.grp_type
        ? e?._source?.assignment?.igaContent?.grp_type
        : ''

      normalizedData[index].entitlementOwner = e?._source?.assignment?.igaContent
        ?.grp_delegate_owner
        ? e?._source?.assignment?.igaContent?.grp_delegate_owner
        : ''
      // New column added
      normalizedData[index].accountNarId = e?._source?.assignment?.igaContent?.account_nar_id
        ? e?._source?.assignment?.igaContent?.account_nar_id
        : ''
      normalizedData[index].accountType = e?._source?.assignment?.igaContent?.account_type
        ? e?._source?.assignment?.igaContent?.account_type
        : ''
      normalizedData[index].accountName = e?._source?.assignment?.igaContent?.account_name
        ? e?._source?.assignment?.igaContent?.account_name
        : ''
      normalizedData[index].accountDomain = e?._source?.assignment?.igaContent?.account_domain
        ? e?._source?.assignment?.igaContent?.account_domain
        : ''
      normalizedData[index].accountOwner = e?._source?.assignment?.igaContent?.account_owner
        ? e?._source?.assignment?.igaContent?.account_owner
        : ''
      normalizedData[index].accountSecondaryOwner = e?._source?.assignment?.igaContent
        ?.account_secondary_owner
        ? e?._source?.assignment?.igaContent?.account_secondary_owner
        : ''
      normalizedData[index].accountPlatform = e?._source?.assignment?.igaContent?.account_platform
        ? e?._source?.assignment?.igaContent?.account_platform
        : ''
      normalizedData[index].accountEntityType = e?._source?.assignment?.igaContent
        ?.account_entity_type
        ? e?._source?.assignment?.igaContent?.account_entity_type
        : ''
      normalizedData[index].isPersonalAccount = e?._source?.assignment?.igaContent
        ?.is_personal_account
        ? e?._source?.assignment?.igaContent?.is_personal_account
        : ''
      normalizedData[index].isPrivilegedAccount = e?._source?.assignment?.igaContent
        ?.is_privileged_account
        ? e?._source?.assignment?.igaContent?.is_privileged_account
        : ''
      normalizedData[index].accountEntityStatus = e?._source?.assignment?.igaContent
        ?.account_entity_status
        ? e?._source?.assignment?.igaContent?.account_entity_status
        : ''
      normalizedData[index].appName = e?._source?.assignment?.igaContent?.app_name
        ? e?._source?.assignment?.igaContent?.app_name
        : ''
      normalizedData[index].roleDescription = e?._source?.assignment?.igaContent?.role_description
        ? e?._source?.assignment?.igaContent?.role_description
        : ''
      normalizedData[index].groupId = e?._source?.assignment?.igaContent?.grp_id
        ? e?._source?.assignment?.igaContent?.grp_id
        : ''
      normalizedData[index].groupName = e?._source?.assignment?.igaContent?.grp_name
        ? e?._source?.assignment?.igaContent?.grp_name
        : ''
    }
    if (['RACF_ROL_ACC'].includes(description)) {
      normalizedData[index].narId = e?._source?.account?.igaContent?.account_nar_id
        ? e?._source?.account?.igaContent?.account_nar_id
        : ''
      // dummy values
      normalizedData[index].accountType = e?._source?.account?.igaContent?.account_type
        ? e?._source?.account?.igaContent?.account_type
        : ''

      normalizedData[index].accountName = e?._source?.account?.igaContent?.account_name
        ? e?._source?.account?.igaContent?.account_name
        : ''

      normalizedData[index].accountDomain = e?._source?.account?.igaContent?.account_domain
        ? e?._source?.account?.igaContent?.account_domain
        : ''

      normalizedData[index].accountOwner = e?._source?.account?.igaContent?.account_owner
        ? e?._source?.account?.igaContent?.account_owner
        : ''

      normalizedData[index].accountSecondaryOwner = e?._source?.account?.igaContent
        ?.account_secondary_owner
        ? e?._source?.account?.igaContent?.account_secondary_owner
        : ''

      normalizedData[index].accountPlatform = e?._source?.account?.igaContent?.account_platform
        ? e?._source?.account?.igaContent?.account_platform
        : ''

      normalizedData[index].accountEntityType = e?._source?.account?.igaContent?.account_entity_type
        ? e?._source?.account?.igaContent?.account_entity_type
        : ''

      normalizedData[index].isPersonalAccount = e?._source?.account?.igaContent?.is_personal_account
        ? e?._source?.account?.igaContent?.is_personal_account
        : ''
      normalizedData[index].isPrivilegedAccount = e?._source?.account?.igaContent
        ?.is_privileged_account
        ? e?._source?.account?.igaContent?.is_privileged_account
        : ''
      normalizedData[index].accountEntityStatus = e?._source?.account?.igaContent
        ?.account_entity_status
        ? e?._source?.account?.igaContent?.account_entity_status
        : ''

      normalizedData[index].appName = e?._source?.account?.igaContent?.app_name
        ? e?._source?.account?.igaContent?.app_name
        : ''
      normalizedData[index].roleName = e?._source?.account?.igaContent?.role_name
        ? e?._source?.account?.igaContent?.role_name
        : ''
      normalizedData[index].roleDescription = e?._source?.account?.igaContent?.role_description
        ? e?._source?.account?.igaContent?.role_description
        : ''

      normalizedData[index].groupId = e?._source?.account?.igaContent?.grp_name
        ? e?._source?.account?.igaContent?.grp_name
        : ''
      normalizedData[index].groupName = e?._source?.account?.igaContent?.grp_name
        ? e?._source?.account?.igaContent?.grp_name
        : ''
    }
    if (['DB2_ACC', 'MIDRANGE_ACC'].includes(description)) {
      // response JSON is not created yet so taking hardcoded values need to replace after getting proper response

      normalizedData[index].accountNarId = e?._source?.account?.igaContent?.account_nar_id
        ? e?._source?.account?.igaContent?.account_nar_id
        : ''
      normalizedData[index].accountType = e?._source?.account?.igaContent?.account_type
        ? e?._source?.account?.igaContent?.account_type
        : ''
      normalizedData[index].accountName = e?._source?.account?.igaContent?.account_name
        ? e?._source?.account?.igaContent?.account_name
        : ''
      normalizedData[index].accountDomain = e?._source?.account?.igaContent?.account_domain
        ? e?._source?.account?.igaContent?.account_domain
        : ''
      normalizedData[index].accountOwner = e?._source?.account?.igaContent?.account_owner
        ? e?._source?.account?.igaContent?.account_owner
        : ''
      normalizedData[index].accountSecondaryOwner = e?._source?.account?.igaContent
        ?.account_secondary_owner
        ? e?._source?.account?.igaContent?.account_secondary_owner
        : ''
      normalizedData[index].accountPlatform = e?._source?.account?.igaContent?.account_platform
        ? e?._source?.account?.igaContent?.account_platform
        : ''
      normalizedData[index].accountEntityType = e?._source?.account?.igaContent?.account_entity_type
        ? e?._source?.account?.igaContent?.account_entity_type
        : ''
      normalizedData[index].isPersonalAccount = e?._source?.account?.igaContent?.is_personal_account
        ? e?._source?.account?.igaContent?.is_personal_account
        : ''
      normalizedData[index].isPrivilegedAccount = e?._source?.account?.igaContent
        ?.is_privileged_account
        ? e?._source?.account?.igaContent?.is_privileged_account
        : ''
      normalizedData[index].accountEntityStatus = e?._source?.account?.igaContent
        ?.account_entity_status
        ? e?._source?.account?.igaContent?.account_entity_status
        : ''
      normalizedData[index].appName = e?._source?.account?.igaContent?.app_name
        ? e?._source?.account?.igaContent?.app_name
        : ''
    }
    if (['CYB_ACL_MEM'].includes(description)) {
      // Mapping for Account Object
      normalizedData[index].accountNarId = e?._source?.account?.igaContent?.account_nar_id
        ? e?._source?.account?.igaContent?.account_nar_id
        : ''

      normalizedData[index].accountEntityId = e?._source?.account?.igaContent?.account_entity_id
        ? e?._source?.account?.igaContent?.account_entity_id
        : ''

      normalizedData[index].accountType = e?._source?.account?.igaContent?.account_type
        ? e?._source?.account?.igaContent?.account_type
        : ''

      normalizedData[index].accountName = e?._source?.account?.igaContent?.account_name
        ? e?._source?.account?.igaContent?.account_name
        : ''

      normalizedData[index].accountDomain = e?._source?.account?.igaContent?.account_domain
        ? e?._source?.account?.igaContent?.account_domain
        : ''

      normalizedData[index].individualId = e?._source?.account?.igaContent?.individual_id
        ? e?._source?.account?.igaContent?.individual_id
        : ''

      normalizedData[index].accountOwner = e?._source?.account?.igaContent?.account_owner
        ? e?._source?.account?.igaContent?.account_owner
        : ''
      normalizedData[index].accountSecondaryOwner = e?._source?.account?.igaContent
        ?.account_secondary_owner
        ? e?._source?.account?.igaContent?.account_secondary_owner
        : ''

      normalizedData[index].accountPlatform = e?._source?.account?.igaContent?.account_platform
        ? e?._source?.account?.igaContent?.account_platform
        : ''

      normalizedData[index].accountEntityType = e?._source?.account?.igaContent?.account_entity_type
        ? e?._source?.account?.igaContent?.account_entity_type
        : ''

      normalizedData[index].isPersonalAccount = e?._source?.account?.igaContent?.is_personal_account
        ? e?._source?.account?.igaContent?.is_personal_account
        : ''
      normalizedData[index].isPrivilegedAccount = e?._source?.account?.igaContent
        ?.is_privileged_account
        ? e?._source?.account?.igaContent?.is_privileged_account
        : ''

      normalizedData[index].accountEntityStatus = e?._source?.account?.igaContent
        ?.account_entity_status
        ? e?._source?.account?.igaContent?.account_entity_status
        : ''

      normalizedData[index].appName = e?._source?.account?.igaContent?.app_name
        ? e?._source?.account?.igaContent?.app_name
        : ''

      // Mapping for Group Object
      normalizedData[index].groupType = e?._source?.assignment?.igaContent?.grp_type
        ? e?._source?.assignment?.igaContent?.grp_type
        : ''

      normalizedData[index].groupNameGrp = e?._source?.assignment?.igaContent?.grp_name
        ? e?._source?.assignment?.igaContent?.grp_name
        : ''

      normalizedData[index].groupDomain = e?._source?.assignment?.igaContent?.grp_domain
        ? e?._source?.assignment?.igaContent?.grp_domain
        : ''

      normalizedData[index].groupOwner = e?._source?.assignment?.igaContent?.grp_owner
        ? e?._source?.assignment?.igaContent?.grp_owner
        : ''

      normalizedData[index].groupDelegateOwner = e?._source?.assignment?.igaContent
        ?.grp_delegate_owner
        ? e?._source?.assignment?.igaContent?.grp_delegate_owner
        : ''

      normalizedData[index].groupPlatform = e?._source?.assignment?.igaContent?.grp_platform
        ? e?._source?.assignment?.igaContent?.grp_platform
        : ''

      normalizedData[index].groupNarId = e?._source?.assignment?.igaContent?.grp_nar_id
        ? e?._source?.assignment?.igaContent?.grp_nar_id
        : ''

      normalizedData[index].groupDescription = e?._source?.assignment?.igaContent?.grp_comments
        ? e?._source?.assignment?.igaContent?.grp_comments
        : ''

      normalizedData[index].groupEntityId = e?._source?.assignment?.igaContent?.grp_entity_id
        ? e?._source?.assignment?.igaContent?.grp_entity_id
        : ''

      normalizedData[index].groupId = e?._source?.assignment?.igaContent?.grp_id
        ? e?._source?.assignment?.igaContent?.grp_id
        : ''
    }
    if (['CYB_SAFE_CNT_ACL'].includes(description)) {
      normalizedData[index].groupType = e?._source?.account?.igaContent?.group_type
        ? e?._source?.account?.igaContent?.group_type
        : ''
      normalizedData[index].groupName = e?._source?.account?.igaContent?.group_name
        ? e?._source?.account?.igaContent?.group_name
        : ''
      normalizedData[index].groupIndividualId = e?._source?.account?.igaContent?.group_id
        ? e?._source?.account?.igaContent?.group_id
        : ''

      normalizedData[index].groupEntityId = e?._source?.account?.igaContent?.group_entity_id
        ? e?._source?.account?.igaContent?.group_entity_id
        : ''
      normalizedData[index].groupPlatform = e?._source?.account?.igaContent?.group_platform
        ? e?._source?.account?.igaContent?.group_platform
        : ''

      normalizedData[index].groupOwner = e?._source?.account?.igaContent?.group_owner
        ? e?._source?.account?.igaContent?.group_owner
        : ''

      normalizedData[index].groupOwnerType = e?._source?.account?.igaContent?.group_owner_type
        ? e?._source?.account?.igaContent?.group_owner_type
        : ''
      normalizedData[index].groupOwnerDelegate = e?._source?.account?.igaContent
        ?.group_owner_delegate
        ? e?._source?.account?.igaContent?.group_owner_delegate
        : ''
      normalizedData[index].groupEntityType = e?._source?.account?.igaContent?.group_entity_type
        ? e?._source?.account?.igaContent?.group_entity_type
        : ''

      normalizedData[index].groupEntityStatus = e?._source?.account?.igaContent?.group_entity_status
        ? e?._source?.account?.igaContent?.group_entity_status
        : ''
      normalizedData[index].groupDomain = e?._source?.account?.igaContent?.group_domain
        ? e?._source?.account?.igaContent?.group_domain
        : ''

      normalizedData[index].groupComments = e?._source?.account?.igaContent?.group_comments
        ? e?._source?.account?.igaContent?.group_comments
        : ''
      normalizedData[index].groupNarId = e?._source?.account?.igaContent?.group_nar_id
        ? e?._source?.account?.igaContent?.group_nar_id
        : ''

      normalizedData[index].groupCreateDate = e?._source?.account?.igaContent?.group_create_date
        ? e?._source?.account?.igaContent?.group_create_date
        : ''
      normalizedData[index].cybaction = e?._source?.account?.igaContent?.action
        ? e?._source?.account?.igaContent?.action
        : ''
      normalizedData[index].actionDescription = e?._source?.account?.igaContent?.action_description
        ? e?._source?.account?.igaContent?.action_description
        : ''
      normalizedData[index].resourseName = e?._source?.account?.igaContent?.resource_name
        ? e?._source?.account?.igaContent?.resource_name
        : ''
      normalizedData[index].resourseType = e?._source?.account?.igaContent?.resource_type
        ? e?._source?.account?.igaContent?.resource_type
        : ''
      normalizedData[index].resourseFQN = e?._source?.account?.igaContent?.resource_fnq
        ? e?._source?.account?.igaContent?.resource_fnq
        : ''

      normalizedData[index].resourseDescription = e?._source?.account?.igaContent
        ?.resource_description
        ? e?._source?.account?.igaContent?.resource_description
        : ''
      normalizedData[index].resourseClassification = e?._source?.account?.igaContent
        ?.resource_classification
        ? e?._source?.account?.igaContent?.resource_classification
        : ''
      normalizedData[index].resourseEntityType = e?._source?.account?.igaContent
        ?.resource_entity_type
        ? e?._source?.account?.igaContent?.resource_entity_type
        : ''

      normalizedData[index].supportRoleLeader = e?._source?.account?.igaContent?.support_role_leader
        ? e?._source?.account?.igaContent?.support_role_leader
        : ''
      normalizedData[index].resourseCreateDate = e?._source?.account?.igaContent
        ?.resource_create_date
        ? e?._source?.account?.igaContent?.resource_create_date
        : ''

      normalizedData[index].safeOwnerEmail = e?._source?.account?.igaContent?.safe_owner_email
        ? e?._source?.account?.igaContent?.safe_owner_email
        : ''

      normalizedData[index].safeDelegate1Email = e?._source?.account?.igaContent
        ?.safe_delegate_1_email
        ? e?._source?.account?.igaContent?.safe_delegate_1_email
        : ''
      normalizedData[index].safeDelegate2Email = e?._source?.account?.igaContent
        ?.safe_delegate_2_email
        ? e?._source?.account?.igaContent?.safe_delegate_2_email
        : ''

      normalizedData[index].safeDelegate3Email = e?._source?.account?.igaContent
        ?.safe_delegate_3_email
        ? e?._source?.account?.igaContent?.safe_delegate_3_email
        : ''

      normalizedData[index].resourseEntityLifeStatus = e?._source?.account?.igaContent
        ?.resource_entity_life_status
        ? e?._source?.account?.igaContent?.resource_entity_life_status
        : ''

      normalizedData[index].supportRoleName = e?._source?.account?.igaContent?.support_role_name
        ? e?._source?.account?.igaContent?.support_role_name
        : ''

      normalizedData[index].resourseEntityInstanceName = e?._source?.account?.igaContent
        ?.resource_entity_instance_name
        ? e?._source?.account?.igaContent?.resource_entity_instance_name
        : ''
    }
    if (['CYB_SAFE_CNT'].includes(description)) {
      // Mapping for Account Object

      normalizedData[index].safetype = e?._source?.account?.igaContent?.safe_type
        ? e?._source?.account?.igaContent?.safe_type
        : ''

      normalizedData[index].safeName = e?._source?.account?.igaContent?.safe_name
        ? e?._source?.account?.igaContent?.safe_name
        : ''

      normalizedData[index].safeIndividualId = e?.account?.igaContent?.safe_individual_id
        ? e?.account?.igaContent?.safe_individual_id
        : ''

      normalizedData[index].safeEntityId = e?._source?.account?.igaContent?.safe_entity_id
        ? e?._source?.account?.igaContent?.safe_entity_id
        : ''

      normalizedData[index].safePlatform = e?._source?.account?.igaContent?.safe_platform
        ? e?._source?.account?.igaContent?.safe_platform
        : ''
      normalizedData[index].safeOwner = e?._source?.account?.igaContent?.safe_owner
        ? e?._source?.account?.igaContent?.safe_owner
        : ''
      normalizedData[index].safeOwnerType = e?._source?.account?.igaContent?.safe_owner_type
        ? e?._source?.account?.igaContent?.safe_owner_type
        : ''

      normalizedData[index].safeOwnerDelegate = e?._source?.account?.igaContent?.safe_owner_delegate
        ? e?._source?.account?.igaContent?.safe_owner_delegate
        : ''

      normalizedData[index].safeEntityType = e?._source?.account?.igaContent?.safe_entity_type
        ? e?._source?.account?.igaContent?.safe_entity_type
        : ''

      normalizedData[index].safeEntityStatus = e?._source?.account?.igaContent?.safe_entity_status
        ? e?._source?.account?.igaContent?.safe_entity_status
        : ''

      normalizedData[index].safeDomain = e?._source?.account?.igaContent?.safe_domain
        ? e?._source?.account?.igaContent?.safe_domain
        : ''

      normalizedData[index].safeComments = e?._source?.account?.igaContent?.safe_comments
        ? e?._source?.account?.igaContent?.safe_comments
        : ''

      normalizedData[index].safeNarId = e?._source?.account?.igaContent?.safe_nar_id
        ? e?._source?.account?.igaContent?.safe_nar_id
        : ''

      normalizedData[index].safeCreateDate = e?._source?.account?.igaContent?.safe_create_date
        ? e?._source?.account?.igaContent?.safe_create_date
        : ''

      normalizedData[index].cybaction = e?._source?.account?.igaContent?.action
        ? e?._source?.account?.igaContent?.action
        : ''

      normalizedData[index].actionDescription = e?._source?.account?.igaContent?.action_description
        ? e?._source?.account?.igaContent?.action_description
        : ''

      normalizedData[index].resourseName = e?._source?.account?.igaContent?.resource_name
        ? e?._source?.account?.igaContent?.resource_name
        : ''

      normalizedData[index].resourseType = e?._source?.account?.igaContent?.resource_type
        ? e?._source?.account?.igaContent?.resource_type
        : ''

      normalizedData[index].resourseFQN = e?._source?.account?.igaContent?.resource_fqn
        ? e?._source?.account?.igaContent?.resource_fqn
        : ''

      normalizedData[index].resourseDescription = e?._source?.account?.igaContent
        ?.resource_description
        ? e?._source?.account?.igaContent?.resource_description
        : ''

      normalizedData[index].resourseClassification = e?._source?.account?.igaContent
        ?.resource_classification
        ? e?._source?.account?.igaContent?.resource_classification
        : ''

      normalizedData[index].resourseEntityLifeStatus = e?._source?.account?.igaContent
        ?.resource_entity_life_status
        ? e?._source?.account?.igaContent?.resource_entity_life_status
        : ''

      normalizedData[index].resourseEntityInstanceName = e?._source?.account?.igaContent
        ?.resource_entity_instance_name
        ? e?._source?.account?.igaContent?.resource_entity_instance_name
        : ''

      normalizedData[index].resourseEntityType = e?._source?.account?.igaContent
        ?.resource_entity_type
        ? e?._source?.account?.igaContent?.resource_entity_type
        : ''

      normalizedData[index].supportRoleLeader = e?._source?.account?.igaContent?.support_role_leader
        ? e?._source?.account?.igaContent?.support_role_leader
        : ''

      normalizedData[index].supportRoleName = e?._source?.account?.igaContent?.support_role_name
        ? e?._source?.account?.igaContent?.support_role_name
        : ''
      normalizedData[index].entitlementCreateDate = e?._source?.account?.igaContent
        ?.resourcet_create_date
        ? e?._source?.account?.igaContent?.resource_create_date
        : ''

      // Mapping for Group Object

      normalizedData[index].resourseCreateDate = e?._source?.account?.igaContent
        ?.resource_create_date
        ? e?._source?.account?.igaContent?.resource_create_date
        : ''
    }
  })
  return normalizedData
}

export const search = (id, word) =>
  axios(`/v0/dashboard/mytasks/searchquery/${id}/items?search=${word}`).then(() => [])

// uncommnet below code

export const getMetadata = () =>
  axios(`/v0/configuration/uireviewtable`).then((response) => response.data)

export const getMetadataByDescription = (payload) =>
  axios(`/v0/configuration/metaType=${payload}`).then((response) => response.data)

// Remove below code when everything works
// export const getMetadata = (description) =>
//   axios({ url: `/metadata/review?type=${description}`, baseURL: 'http://localhost:8081/api' }).then(
//     (response) => response.data
//   )
export const reassignToMultiUsers = (id, payload) =>
  axios({
    url: `/v0/dashboard/actions/reassign/items?itemId=${id}`,
    data: payload,
    method: 'put'
  }).then((response) => response)

export const takeAction = (action, id, payload) =>
  axios({
    url: `/v0/dashboard/actions/${action}/items?certificationId=${id}`,
    data: payload,
    method: 'post'
  })

export const reviewComment = (action, taskId, payload) =>
  axios({
    url: `/v0/dashboard/actions/${action}/items?certificationId=${taskId}`,
    data: payload,
    method: 'post'
  })

export const reviewActions = (action, certificationId, payload) => {
  const res = axios({
    url: `/v0/dashboard/actions/${action}?certificationId=${certificationId}`,
    data: payload,
    method: 'post'
  }).then((response) => response)
  return res
}
export const signOffReview = (id, payload) =>
  axios.post(`/v0/dashboard/actions/signoff?certificationId=${id}`, payload)

export const getItemHistory = (id) =>
  axios({
    url: `/${id}/history`,
    baseURL: 'http://localhost:8081/api'
  }).then((response) => response.data)
// filterby
export const filterBy = (payload, id, description) =>
  axios({
    url: `/v0/filter`,
    data: payload,
    method: 'post'
  }).then((response) => {
    let normalizedData = []
    const total = response?.data?.hits?.total?.value ? response.data.hits.total.value : 0
    normalizedData = getNormalizedData(response, id, description, total)
    return normalizedData
  })
// groupby
export const groupBy = (payload) =>
  axios({
    url: `/v0/groupby`,
    data: payload,
    method: 'post'
  }).then((response) => response.data)

export const getCampaignInfo = (reviewId) =>
  axios(`/v0/dashboard/mytasks/campaignInfo?campaignId=${reviewId}`).then(
    (response) => response.data
  )
export const forwardItem = (reviewId, payload) =>
  axios({
    url: `/v0/dashboard/actions/forward/items?certificationId=${reviewId}`,
    data: payload,
    method: 'post'
  })
export const forwardActors = (itemId, payload) =>
  axios({
    url: `/v0/dashboard/actions/updateActors/items?itemId=${itemId}`,
    data: payload,
    method: 'post'
  })
export const forwardActorsWithNotification = (itemId, payload) =>
  axios({
    url: `/v1/dashboard/actions/updateActors/items?itemId=${itemId}`,
    data: payload,
    method: 'post'
  })
export const sendEmailForReassign = (payload) =>
  axios({
    url: `${getsemiAnnualBaseUrl()}/sendEmail`,
    data: payload,
    method: 'post'
  })
export const getAccountInfoById = (reviewId, id, certification) =>
  axios(`/v0/actions/accountInfo/items?certificationid=${id}&itemid=${reviewId}`).then((res) => {
    let data = {
      dn: res.data?.__NAME__ ? res.data?.__NAME__ : '',
      accountName: res.data?.igaContent?.sAMAccountName ? res.data.igaContent.sAMAccountName : '',
      mail: res.data?.igaContent?.mail ? res.data?.igaContent?.mail : '',
      employeeType: res.data?.igaContent?.employeeType ? res.data?.igaContent?.employeeType : '',
      lastName: res.data?.igaContent?.sn ? res.data?.igaContent?.sn : '',
      firstName: res.data?.igaContent?.givenName ? res.data?.igaContent?.givenName : '',
      type: res.data?.igaContent?.account_type ? res.data?.igaContent?.account_type : '',
      entityType: res.data?.igaContent?.account_entity_type
        ? res.data?.igaContent?.account_entity_type
        : '',
      domain: res.data?.igaContent?.account_domain ? res.data?.igaContent?.account_domain : '',
      entitlement: res.data?.igaContent?.account_entitlement
        ? res.data?.igaContent?.account_entitlement
        : '',
      error: !res.data ? translate('review.accountInfo.errorMessage') : ''
    }
    if (['SECURITY_VDRGROUP', 'SECURITY_VDRGROUP_MAIN'].includes(certification)) {
      data = {
        ...data,
        accountId: res?.data?.igaContent?.ACCOUNT_ID ? res?.data?.igaContent?.ACCOUNT_ID : '',
        accountFriendlyName: res?.data?.igaContent?.ACCOUNT_FRIENDLY_NAME
          ? res?.data?.igaContent?.ACCOUNT_FRIENDLY_NAME
          : '',
        accountType: res?.data?.igaContent?.ACCOUNT_TYPE ? res?.data?.igaContent?.ACCOUNT_TYPE : '',
        accountStatus: res?.data?.igaContent?.ACCOUNT_STATUS
          ? res?.data?.igaContent?.ACCOUNT_STATUS
          : '',
        accountOwner: res?.data?.igaContent?.ACCOUNT_OWNER
          ? res?.data?.igaContent?.ACCOUNT_OWNER
          : '',
        vdrProvider: res?.data?.igaContent?.VDR_PROVIDER ? res?.data?.igaContent?.VDR_PROVIDER : ''
      }
    }
    return data
  })

export const getEntInfoById = (reviewId, id, certification) =>
  axios(`/v0/actions/entInfo/items?certificationid=${id}&itemid=${reviewId}`).then((res) => {
    let data = {
      dn: res.data?.__NAME__ ? res.data?.__NAME__ : '',
      groupId: res.data?.igaContent?.sAMAccountName ? res.data?.igaContent?.sAMAccountName : '',
      groupApprovers: res.data?.igaContent?.dbagIMSApprovers
        ? res.data?.igaContent?.dbagIMSApprovers.toString()
        : '',
      recertType: res.data?.igaContent?.dbagRecerttype ? res.data?.igaContent?.dbagRecerttype : '',
      error: !res.data ? translate('review.entInfo.errorMessage') : ''
    }
    if (['SECURITY_ADGROUP', 'SECURITY_ADGROUP_MAIN'].includes(certification)) {
      data = {
        ...data,
        name: res.data?.name ? res.data.name : '',
        displayName: res.data?.igaContent?.displayName ? res.data?.igaContent?.displayName : '',
        ApplicationID: res.data?.applicationId ? res.data.applicationId : '',
        sAMAccountName: res.data?.igaContent?.sAMAccountName
          ? res.data?.igaContent?.sAMAccountName
          : '',
        grpType: res?.data?.igaContent?.group_type ? res?.data?.igaContent?.group_type : '',
        dbagComplianceStatus: res?.data?.igaContent?.dbagComplianceStatus
          ? res.data.igaContent.dbagComplianceStatus
          : '',
        dbagRecerttype: res?.data?.igaContent?.object?.dbagRecerttype
          ? res.data.igaContent.object.dbagRecerttype
          : '',
        dbagRecertSubtype: res?.data?.igaContent?.object?.dbagRecertSubtype
          ? res.data.igaContent.object.dbagRecertSubtype
          : '',
        dbagInfrastructureID: res?.data?.igaContent?.dbagInfrastructureID
          ? res.data.igaContent.dbagInfrastructureID[0]
          : '',
        dbagIMSAuthContact: res?.data?.igaContent?.dbagIMSAuthContact
          ? res.data.igaContent.dbagIMSAuthContact.toString()
          : '',
        dbagIMSAuthContactDelegate: res?.data?.igaContent?.dbagIMSAuthContactDelegate
          ? res.data.igaContent.dbagIMSAuthContactDelegate.toString()
          : '',
        dbagEntitlement: res?.data?.igaContent?.dbagEntitlement
          ? res.data.igaContent.dbagEntitlement[0]
          : '',
        dbagIMSDataSecClass: res?.data?.igaContent?.dbagIMSDataSecClass
          ? res.data.igaContent.dbagIMSDataSecClass.toString()
          : '',

        description: res?.data?.igaContent?.description ? res.data.igaContent.description[0] : '',
        DistinguishedName: res?.data?.igaContent?.distinguishedName
          ? res.data.igaContent.distinguishedName
          : '',
        GroupCategory: res?.data?.igaContent?.GroupCategory
          ? res.data.igaContent.GroupCategory
          : '',
        dbagExtensionAttribute6: res?.data?.igaContent?.dbagExtensionAttribute6
          ? res.data.igaContent.dbagExtensionAttribute6
          : '',
        costCenter: res?.data?.igaContent?.dbagCostcenter ? res.data.igaContent.dbagCostcenter : '',
        dbagApplicationID: res?.data?.igaContent?.object?.dbagApplicationID
          ? res.data.igaContent.object.dbagApplicationID[0]
          : '',
        dbagDataPrivClass: res?.data?.igaContent?.dbagDataPrivClass
          ? res.data.igaContent.dbagDataPrivClass
          : '',
        dbagFileSystemFullPath: res?.data?.igaContent?.dbagFileSystemFullPath
          ? res.data.igaContent.dbagFileSystemFullPath.toString()
          : '',
        dbagProcessingdata: res?.data?.igaContent?.dbagProcessingdata
          ? res.data.igaContent.dbagProcessingdata
          : '',
        dbagExternalProvider: res?.data?.igaContent?.dbagExternalProvider
          ? res.data.igaContent.dbagExternalProvider.toString()
          : '',
        dbagSupportGroup: res?.data?.igaContent?.dbagSupportGroup
          ? res.data.igaContent.dbagSupportGroup
          : '',
        dbagProvisioningBy: res?.data?.igaContent?.dbagProvisioningBy
          ? res.data.igaContent.dbagProvisioningBy
          : '',
        dbagFileSystemFullPaths: res?.data?.igaContent?.dbagFileSystemFullPaths
          ? res.data.igaContent.dbagFileSystemFullPaths.toString()
          : '',
        dbagIMSApprovers: res?.data?.igaContent?.object?.dbagIMSApprovers
          ? res.data.igaContent.object.dbagIMSApprovers.toString()
          : '',
        createdDate: res?.data?.igaContent?.whenCreated ? res.data.igaContent.whenCreated : '',
        dbagModifiedBy: res?.data?.igaContent?.dbagModifiedBy
          ? res.data.igaContent.dbagModifiedBy
          : '',
        member: res?.data?.igaContent?.member ? res?.data.igaContent.member : '',
        dbagObjectRecertificationStatus: res?.data?.igaContent?.dbagObjectRecertificationStatus
          ? res?.data.igaContent.dbagObjectRecertificationStatus
          : '',
        dbagObjectLastRecertified: res?.data?.igaContent?.dbagObjectLastRecertified
          ? res?.data.igaContent.dbagObjectLastRecertified
          : '',
        mail: res?.data?.igaContent?.mail ? res.data.igaContent.mail : '',
        whenChanged: res?.data?.igaContent?.whenChanged ? res.data.igaContent.whenChanged : '',
        objectClass: res?.data?.igaContent?.objectClass
          ? res?.data?.igaContent?.objectClass.toString()
          : ''
      }
    }
    if (['SECURITY_VDRGROUP', 'SECURITY_VDRGROUP_MAIN'].includes(certification)) {
      data = {
        ...data,
        grpName: res?.data?.igaContent?.GRP_NAME ? res?.data?.igaContent?.GRP_NAME : '',
        grpType: res?.data?.igaContent?.GRP_TYPE ? res?.data?.igaContent?.GRP_TYPE : '',
        grpDescription: res?.data?.igaContent?.GRP_DESCRIPTION
          ? res?.data?.igaContent?.GRP_DESCRIPTION
          : '',
        calOwner: res?.data?.igaContent?.CAL_OWNER ? res?.data?.igaContent?.CAL_OWNER : '',
        calCBISO: res?.data?.igaContent?.CAL_CBISO ? res?.data?.igaContent?.CAL_CBISO : '',
        drName: res?.data?.igaContent?.DR_NAME ? res?.data?.igaContent?.DR_NAME : '',
        drDescription: res?.data?.igaContent?.DR_DESCRIPTION
          ? res?.data?.igaContent?.DR_DESCRIPTION
          : '',
        drType: res?.data?.igaContent?.DR_TYPE ? res?.data?.igaContent?.DR_TYPE : '',
        subInfoTwo: res?.data?.igaContent?.SUB_INFO_2 ? res?.data?.igaContent?.SUB_INFO_2 : '',
        drStatus: res?.data?.igaContent?.DR_STATUS ? res?.data?.igaContent?.DR_STATUS : '',
        vdrProvider: res?.data?.igaContent?.VDR_PROVIDER ? res?.data?.igaContent?.VDR_PROVIDER : '',
        divisionalISO: res?.data?.igaContent?.CAL_CBISO ? res?.data?.igaContent?.CAL_CBISO : '',
        groupOwner: res?.data?.igaContent?.SNAPSHOT_OWNER
          ? res?.data?.igaContent?.SNAPSHOT_OWNER
          : '',
        accessApprover1: res?.data?.igaContent?.CAL_ACCESS_APPR_RANK_1
          ? res?.data?.igaContent?.CAL_ACCESS_APPR_RANK_1
          : '',
        accessApprover2: res?.data?.igaContent?.CAL_ACCESS_APPR_RANK_2
          ? res?.data?.igaContent?.CAL_ACCESS_APPR_RANK_2
          : '',
        calAdminRank1: res?.data?.igaContent?.CAL_ADMIN_RANK_1
          ? res?.data?.igaContent?.CAL_ADMIN_RANK_1
          : '',
        calAdminRank2: res?.data?.igaContent?.CAL_ADMIN_RANK_
          ? res?.data?.igaContent?.CAL_ADMIN_RANK_
          : '',
        // ================new==========
        calFriendlyName: res?.data?.igaContent?.CAL_FRIENDLY_NAME
          ? res?.data?.igaContent?.CAL_FRIENDLY_NAME
          : null,
        subGroupName: res?.data?.igaContent?.SUBGRP_NAME
          ? res?.data?.igaContent?.SUBGRP_NAME
          : null,
        calSource: res?.data?.igaContent?.CAL_SOURCE ? res?.data?.igaContent?.CAL_SOURCE : null,
        calCBISOSource: res?.data?.igaContent?.CAL_CBISO_SOURCE
          ? res?.data?.igaContent?.CAL_CBISO_SOURCE
          : null,
        drStatusDate: res?.data?.igaContent?.DR_STATUS_DATE
          ? res?.data?.igaContent?.DR_STATUS_DATE
          : null,
        drCreateDate: res?.data?.igaContent?.DR_CREATE_DATE
          ? res?.data?.igaContent?.DR_CREATE_DATE
          : null,
        drUBRNode: res?.data?.igaContent?.DR_UBR_NODE ? res?.data?.igaContent?.DR_UBR_NODE : null,
        drCostCenter: res?.data?.igaContent?.DR_COST_CENTER
          ? res?.data?.igaContent?.DR_COST_CENTER
          : null,

        drInformationClass: res?.data?.igaContent?.DR_INFORMATION_CLASS
          ? res?.data?.igaContent?.DR_INFORMATION_CLASS
          : null,
        drIBCategory: res?.data?.igaContent?.DR_IB_CATEGORY
          ? res?.data?.igaContent?.DR_IB_CATEGORY
          : null,
        drIBDesignation: res?.data?.igaContent?.DR_IB_DESIGNATION
          ? res?.data?.igaContent?.DR_IB_DESIGNATION
          : null
      }
    }
    return data
  })

export const getUserInfoById = (reviewId, id) =>
  axios(`/v0/actions/userInfoBttn/items?certificationid=${id}&itemid=${reviewId}`).then((res) => {
    const data = {
      username: res.data?.userName ? res.data?.userName : '',
      firstName: res.data?.givenName ? res.data?.givenName : '',
      lastName: res.data?.sn ? res.data?.sn : '',
      mail: res.data?.mail ? res.data?.mail : '',
      status: res.data?.accountStatus ? res.data?.accountStatus : ''
    }
    return data
  })

export const getAccountInfoMetaData = () =>
  axios(`/v0/configuration/accountInfo`).then((response) => response.data)

export const getUserInfoMetaData = () =>
  axios('/v0/configuration/userInfo').then((response) => response.data)

export const getEntInfoMetaData = () =>
  axios(`/v0/configuration/entitlementInfo`).then((response) => response.data)

export const groupByMonitor = (payload, id, description) =>
  axios({
    url: `/v0/elasticFilter`,
    data: payload,
    method: 'post'
  }).then((response) => {
    let result = { aggregations: {}, normalizedData: [] }
    let normalizedData = []
    const total = response?.data?.hits?.total?.value ? response.data.hits.total.value : 0
    normalizedData = getNormalizedData(response, id, description, total)
    result = { normalizedData, aggregations: response.data.aggregations }
    return result
  })

export const elasticFilterByEmail = (payload, userId, description) =>
  axios({
    url: `/v0/reviewerFilter`,
    data: payload,
    method: 'post'
  }).then((response) => {
    let normalizedData = []
    const total = response?.data?.hits?.total?.value ? response.data.hits.total.value : 0
    normalizedData = getNormalizedData(response, userId, description, total)
    return normalizedData
  })

export const sortBy = (payload, userId, description) =>
  axios({
    url: `/v0/elasticSort`,
    data: payload,
    method: 'post'
  }).then((response) => {
    let normalizedData = []
    const total = response?.data?.hits?.total?.value ? response.data.hits.total.value : 0
    normalizedData = getNormalizedData(response, userId, description, total)
    return normalizedData
  })
// Reviewer sort
export const sortReviewerBy = (payload, userId, description, provisioningRoles) =>
  axios({
    url: `${getsemiAnnualBaseUrl()}/reviewer/listAll&action=sort`,
    data: payload,
    method: 'post'
  }).then((response) => {
    let normalizedData = []
    const total = response?.data?.hits?.total?.value ? response.data.hits.total.value : 0
    normalizedData = getNormalizedData(response, userId, description, total, provisioningRoles)
    return normalizedData
  })
// Monitor Sort
export const sortMonitorBy = (payload, userId, description, provisioningRoles) =>
  axios({
    url: `${getsemiAnnualBaseUrl()}/monitor/listAll&action=sort`,
    data: payload,
    method: 'post'
  }).then((response) => {
    let normalizedData = []
    const total = response?.data?.hits?.total?.value ? response.data.hits.total.value : 0
    normalizedData = getNormalizedData(response, userId, description, total, provisioningRoles)
    return normalizedData
  })

export const getCompletionStatus = (campaignId, status) =>
  axios(`/v0/dashboard/mytasks/campaignPages?campaignId=${campaignId}&status=${status}`).then(
    (response) => response.data
  )

// eslint-disable-next-line no-unused-vars
export const searchByReviewerSa = (payload, userId, description, provisioningRoles) =>
  axios({
    url: `/v1/reviewer/searchCampItems`,
    data: payload,
    method: 'post'
  }).then((response) => {
    let normalizedData = []
    const total = response?.data?.hits?.total?.value ? response.data.hits.total.value : 0
    normalizedData = getNormalizedData(response, userId, description, total, provisioningRoles)
    return normalizedData
  })

export const searchBy = (payload, userId, description) =>
  axios({
    url: `/v0/searchCampItems`,
    data: payload,
    method: 'post'
  }).then((response) => {
    let normalizedData = []
    const total = response?.data?.hits?.total?.value ? response.data.hits.total.value : 0
    normalizedData = getNormalizedData(response, userId, description, total)
    return normalizedData
  })

export const reviewerSearch = (payload, userId, description, provisioningRoles) =>
  axios({
    url: `/v1/monitor/searchCampItems`,
    data: payload,
    method: 'post'
  }).then((response) => {
    let normalizedData = []
    const total = response?.data?.hits?.total?.value ? response.data.hits.total.value : 0
    normalizedData = getNormalizedData(response, userId, description, total, provisioningRoles)
    return normalizedData
  })

export const searchByGroup = (payload) =>
  axios({
    url: `/v0/searchGroup`,
    data: payload,
    method: 'post'
  }).then((response) => response.data)
// export
export const exportData = (payload, userId, description) =>
  axios({
    url: `/v0/data/export`,
    data: payload,
    method: 'post'
  }).then((response) => {
    let normalizedData = []
    if (response.status === 200) {
      const total = response?.data?.hits?.total?.value ? response.data.hits.total.value : 0
      normalizedData = getNormalizedData(response, userId, description, total)
      return normalizedData
    }
    const errorObj = {
      status: 'Error'
    }
    return errorObj
  })
export const exportReviewerData = (payload, userId, description, provisioningRoles) =>
  axios({
    url: `/v1/reviewer/data/export`,
    data: payload,
    method: 'post'
  }).then((response) => {
    let normalizedData = []
    if (response.status === 200) {
      const total = response?.data?.hits?.total?.value ? response.data.hits.total.value : 0
      normalizedData = getNormalizedData(response, userId, description, total, provisioningRoles)
      return normalizedData
    }
    const errorObj = {
      status: 'Error'
    }
    return errorObj
  })
export const exporMonitortData = (payload, userId, description, provisioningRoles) =>
  axios({
    url: `/v1/monitor/data/export`,
    data: payload,
    method: 'post'
  }).then((response) => {
    let normalizedData = []
    if (response.status === 200) {
      const total = response?.data?.hits?.total?.value ? response.data.hits.total.value : 0
      normalizedData = getNormalizedData(response, userId, description, total, provisioningRoles)
      return normalizedData
    }
    const errorObj = {
      status: 'Error'
    }
    return errorObj
  })
// reviewer post method
export const postReviwerData = (payload, userId, description, provisioningRoles) =>
  axios({
    url: `${getsemiAnnualBaseUrl()}/reviewer/listAll&action=listAll`,
    data: payload,
    method: 'post'
  }).then((response) => {
    let normalizedData = []
    const total = response?.data?.hits?.total?.value ? response.data.hits.total.value : 0
    normalizedData = getNormalizedData(response, userId, description, total, provisioningRoles)
    return normalizedData
  })
// monitor post method
export const postMonitorData = (payload, userId, description, provisioningRoles) =>
  axios({
    url: `${getsemiAnnualBaseUrl()}/monitor/listAll&action=listAll`,
    data: payload,
    method: 'post'
  }).then((response) => {
    let result = { aggregations: {}, normalizedData: [] }
    let normalizedData = []
    const total = response?.data?.hits?.total?.value ? response.data.hits.total.value : 0
    normalizedData = getNormalizedData(response, userId, description, total, provisioningRoles)
    result = { normalizedData, aggregations: response.data.aggregations }
    return result
  })

// API to call filter for semiannual reviewer tab
export const filterByReviewerSa = (payload, id, description, provisioningRoles) =>
  axios({
    url: `${getsemiAnnualBaseUrl()}/reviewer/listAll&action=filter`,
    data: payload,
    method: 'post'
  }).then((response) => {
    let normalizedData = []
    const total = response?.data?.hits?.total?.value ? response.data.hits.total.value : 0
    normalizedData = getNormalizedData(response, id, description, total, provisioningRoles)
    return normalizedData
  })

// API to call group by for reviewer tab semi annual
export const groupByForReviewerTabSa = (payload) =>
  axios({
    url: `${getsemiAnnualBaseUrl()}/reviewer/listAll&action=group`,
    data: payload,
    method: 'post'
  }).then((response) => response.data)

export const groupByForReviewerTabExpandSa = (payload, userId, description, provisioningRoles) =>
  axios({
    url: `${getsemiAnnualBaseUrl()}/reviewer/listAll&action=group`,
    data: payload,
    method: 'post'
  }).then((response) => {
    let normalizedData = []
    const total = response?.data?.hits?.total?.value ? response.data.hits.total.value : 0
    normalizedData = getNormalizedData(response, userId, description, total, provisioningRoles)
    return normalizedData
  })

export const filterSortReviewer = (payload, id, description, provisioningRoles) =>
  axios({
    url: `${getsemiAnnualBaseUrl()}/reviewer/listAll&action=filterSort`,
    data: payload,
    method: 'post'
  }).then((response) => {
    let normalizedData = []
    const total = response?.data?.hits?.total?.value ? response.data.hits.total.value : 0
    normalizedData = getNormalizedData(response, id, description, total, provisioningRoles)
    return normalizedData
  })
// API to get monitor tab search
export const searchByGroupMonitor = (payload) =>
  axios({
    url: `/v1/searchGroup`,
    data: payload,
    method: 'post'
  }).then((response) => response.data)

export const searchByFilterGroupReviewerTab = (payload) =>
  axios({
    url: `${getsemiAnnualBaseUrl()}/reviewer/listAll&action=filterGroupSearch`,
    data: payload,
    method: 'post'
  }).then((response) => response.data)

// API to call filter + group by for reviewer tab semi annual
export const filterAndGroupByForReviewerTabSa = (payload) =>
  axios({
    url: `${getsemiAnnualBaseUrl()}/reviewer/listAll&action=filterGroup`,
    data: payload,
    method: 'post'
  }).then((response) => response.data)

export const postFilterAndGroupByDataSa = (payload, userId, description, provisioningRoles) =>
  axios({
    url: `${getsemiAnnualBaseUrl()}/reviewer/listAll&action=filterGroup`,
    data: payload,
    method: 'post'
  }).then((response) => {
    let result = { aggregations: {}, normalizedData: [] }
    let normalizedData = []
    const total = response?.data?.hits?.total?.value ? response.data.hits.total.value : 0
    normalizedData = getNormalizedData(response, userId, description, total, provisioningRoles)
    result = { normalizedData, aggregations: response.data.aggregations }
    return result
  })

export const postSortFilterAndGroupByDataSa = (payload, userId, description, provisioningRoles) =>
  axios({
    url: `${getsemiAnnualBaseUrl()}/reviewer/listAll&action=filterGroup`,
    data: payload,
    method: 'post'
  }).then((response) => {
    let result = { aggregations: {}, normalizedData: [] }
    let normalizedData = []
    const total = response?.data?.hits?.total?.value ? response.data.hits.total.value : 0
    normalizedData = getNormalizedData(response, userId, description, total, provisioningRoles)
    result = { normalizedData, aggregations: response.data.aggregations }
    return result
  })

// API to get reviewer tab grouped search
export const searchByGroupReviewerTab = (payload) =>
  axios({
    url: `${getsemiAnnualBaseUrl()}/reviewer/listAll&action=groupSearch`,
    data: payload,
    method: 'post'
  }).then((response) => response.data)

// API to call filter + group by for monitor tab semi annual
export const filterAndGroupByForMonitorTabSa = (payload) =>
  axios({
    url: `${getsemiAnnualBaseUrl()}/monitor/listAll&action=filterGroup`,
    data: payload,
    method: 'post'
  }).then((response) => response.data)

export const postFilterAndGroupByMonitorDataSa = (
  payload,
  userId,
  description,
  provisioningRoles
) =>
  axios({
    url: `${getsemiAnnualBaseUrl()}/monitor/listAll&action=filterGroup`,
    data: payload,
    method: 'post'
  }).then((response) => {
    let result = { aggregations: {}, normalizedData: [] }
    let normalizedData = []
    const total = response?.data?.hits?.total?.value ? response.data.hits.total.value : 0
    normalizedData = getNormalizedData(response, userId, description, total, provisioningRoles)
    result = { normalizedData, aggregations: response.data.aggregations }
    return result
  })

export const postSortFilterGroupByMonitorDataSa = (
  payload,
  userId,
  description,
  provisioningRoles
) =>
  axios({
    url: `${getsemiAnnualBaseUrl()}/monitor/listAll&action=filterSort`,
    data: payload,
    method: 'post'
  }).then((response) => {
    let result = { aggregations: {}, normalizedData: [] }
    let normalizedData = []
    const total = response?.data?.hits?.total?.value ? response.data.hits.total.value : 0
    normalizedData = getNormalizedData(response, userId, description, total, provisioningRoles)
    result = { normalizedData, aggregations: response.data.aggregations }
    return result
  })

export const postSortGroupByReviewerSa = (payload, userId, description, provisioningRoles) =>
  axios({
    url: `${getsemiAnnualBaseUrl()}/reviewer/listAll&action=groupSort`,
    data: payload,
    method: 'post'
  }).then((response) => {
    let normalizedData = []
    const total = response?.data?.hits?.total?.value ? response.data.hits.total.value : 0
    normalizedData = getNormalizedData(response, userId, description, total, provisioningRoles)
    return normalizedData
  })

export const postForwardNotification = (payload) =>
  axios({
    url: `${getsemiAnnualBaseUrl()}/sendEmail`,
    data: payload,
    method: 'post'
  }).then((response) => response.data)
