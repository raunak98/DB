// Mock data

const fs = require('fs')
const express = require('express')

// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser')
const cors = require('cors')
const reviewsData = require('./reviews/index.json')
const reviewData = require('./reviews/review/index.json')
const dashboardData = require('./dashboard/index.json')
const reviewTableMetadata = require('./metadata/reviewTable.json')
const usersData = require('./metadata/users.json')
const reviewsTableMetadata = require('./metadata/reviewsTable.json')
const dashboardMetadata = require('./metadata/dashboard.json')
const historyPayload = require('./reviews/history.json')
const userPreferances = require('./metadata/userPreferances.json')
const historyDashboard = require('./metadata/historyDashboard.json')
const requestHistory = require('./metadata/requestHistory.json')
const approvalHistory = require('./metadata/approvalHistory.json')
const accountMetadata = require('./metadata/accountInfo.json')
const entitlementMetadata = require('./metadata/entitlementInfo.json')
const accountManagementMeta = require('./metadata/accountManagement.json')
const createADGroupMeta = require('./metadata/createADGroup.json')
// const createADAccountMeta = require('./metadata/createADAccount.json')
const createADAccountSummaryMeta = require('./metadata/createADAccountSummary.json')
const createADAccountMetaUpdated = require('./metadata/createADAccount_updated.json')
const modifyAdAccountMeta = require('./metadata/assets/modifyADAccount.json')
const modifyADOptions = require('./metadata/assets/modifyADOptions.json')
const assetsGroupSummary = require('./metadata/assets/assetsGroupSummary.json')
const createADGroupSummary = require('./metadata/createADGroupSummary.json')
const myTeamMeta = require('./metadata/myTeamTable.json')
const justificationMeta = require('./metadata/justificationTable.json')

const createADOptions = require('./metadata/createADOptions.json')
const createADGroupOptions = require('./metadata/createADGroupOptions.json')
const useMetadata = require('./metadata/userInfo.json')
const ENDUSER_ACCS_DB = require('./metadata/ENDUSER_ACCS_DB.json')
const SELF_ASSESSMENT = require('./metadata/SELF_ASSESSMENT.json')
const AAA_WIN_UNIX_DB_DBPASSPORT_FOBO = require('./metadata/AAA_WIN_UNIX_DB_DBPASSPORT_FOBO.json')
const AAA_WIN_UNIX_DB_DBPASSPORT_MOV = require('./metadata/AAA_WIN_UNIX_DB_DBPASSPORT_MOV.json')
const AAA_ASA_DB = require('./metadata/AAA_ASA_DB.json')
const AAA_ASA_UNIX = require('./metadata/AAA_ASA_UNIX.json')
const AAA_ASA_WIN = require('./metadata/AAA_ASA_WIN.json')
const ACCS_GROUP_DBPASSPORT = require('./metadata/ACCS_GROUP_DBPASSPORT.json')
const GROUP_ENT_DBPASSPORT = require('./metadata/GROUP_ENT_DBPASSPORT.json')
const ISA_WIN_UNIX_DB = require('./metadata/ISA_WIN_UNIX_DB.json')
const SECURITY_VDRGROUP = require('./metadata/SECURITY_VDRGROUP.json')
const DORMANT_AD_ACCS = require('./metadata/DORMANT_AD_ACCS.json')
const SECURITY_ADGROUP = require('./metadata/SECURITY_ADGROUP.json')
const approvalMetadata = require('./metadata/approvalTable.json')
const approvalsResult = require('./approvals/approvals.json')
const approvalSummary = require('./approvals/approvalSummary.json')
const modifyPersonalMetadata = require('./metadata/assets/modifyPersonalMetadata.json')
const modifyNonPersonalMetadata = require('./metadata/assets/modifyNonPersonalMetadata.json')
const modifyTabMetadata = require('./metadata/assets/modifyTab.json')
const modifyRequests = require('./metadata/assets/assetsResults.json')
const narIdInfo = require('./metadata/assets/narIdInfo.json')
const draftsMetadata = require('./metadata/draftsTable.json')
const draftsdata = require('./drafts/draftsData.json')
const draftsResponse = require('./drafts/draftsResponse.json')
const assetsSummary = require('./metadata/assets/assetsSummary.json')
const bulkRequest = require('./metadata/bulkRequests/bulkRequest.json')
const modifyListGroupMetadata = require('./metadata/assets/modifyListGroupMetadata.json')
const modifyListIndirectlyOwnedGroupMetadata = require('./metadata/assets/modifyListIndirectlyOwnedGroupMetadata.json')
const groupApprovalSummary = require('./approvals/groupApprovalSummary.json')
const addOrRemoveGroupMeta = require('./metadata/addOrRemoveGroupMeta.json')
const addOrRemoveResult = require('./metadata/addOrRemoveGroup.json')
const modifyListGroupResponse = require('./metadata/assets/groupListResponse.json')
const groupDetails = require('./metadata/assets/groupdetails.json')
const requestHistoryDataResponse = require('./metadata/assets/requestHistoryData.json')
const approvalDataResponse = require('./metadata/assets/approvalData.json')
const justificationDataResponse = require('./metadata/assets/justificationData.json')
const notificationResponse = require('./dashboard/notification.json')
const modifyADGroup = require('./metadata/modifyADGroup.json')
const racfRolAcc = require('./metadata/RACF_ROL_ACC.json')
const racfRolGrp = require('./metadata/RACF_ROL_GRP.json')
const racfGrpAcc = require('./metadata/RACF_GRP_ACC.json')
const DB2Acc = require('./metadata/DB2_ACC.json')
const DB2Grp = require('./metadata/DB2_GRP.json')
const MidRangeAcc = require('./metadata/MIDRANGE_ACC.json')
const cybAclMem = require('./metadata/CYB_ACL_MEM.json')
const groupMembership = require('./membership/groupMembership.json')
const serverMembership = require('./membership/serverMembershipMeta.json')
const accountTable = require('./membership/accountTable.json')
const groupTable = require('./membership/groupTable.json')
// const serverTable = require('./membership/serverTable.json')
const cybSafeCntAcl = require('./metadata/CYB_SAFE_CNT_ACL.json')
const cybSafeCnt = require('./metadata/CYB_SAFE_CNT.json')
const accessTabMetadata = require('./metadata/access/accessTab.json')
const accessGroupMetadata = require('./metadata/access/accessGroup.json')
const entitleMentApprovalSummary = require('./approvals/entitlementApprovalSummary.json')
const adminMeta = require('./admin/adminMeta.json')
// const groupResponse = require('./admin/searchGroupsResponse.json')
const accountsResponse = require('./admin/searchAccountsResponse.json')
const reviewGroupMetadata = require('./metadata/reviewMetadataGroup.json')
const getServerResponse = require('./membership/getServerResponse.json')
const getGroupResponse = require('./metadata/assets/groupListResponse.json')
const getServiceDeskAdminMeta = require('./metadata/serviceDeskAdmin.json')
const getServiceDeskAdminData = require('./metadata/serviceDeskAdminResponse.json')

const SECURITY_ADGROUP_MAIN = require('./metadata/SECURITY_ADGROUP_MAIN.json')
const SECURITY_VDRGROUP_MAIN = require('./metadata/SECURITY_VDRGROUP_MAIN.json')
// const REVIEWERDATA = require('./metadata/ReviewerData.json')
// const MONITORDATA = require('./metadata/MonitorData.json')
// Express JS
const app = express()

// Cors
app.use(
  cors({
    origin: '*'
  })
)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/api/dashboard', (req, res) => {
  // TODO: To remove, for demo purpose only
  setTimeout(() => {
    res.send(dashboardData)
  }, 1000) // wait 2 seconds
})
// Reviewer Data
// app.get('/api/metadata/reviewerdata', (req, res) => {
//   res.send(REVIEWERDATA)
// })
// // Monitor Data
// app.get('/api/metadata/monitordata', (req, res) => {
//   res.send(MONITORDATA)
// })

app.get('/api', (req, res) => {
  res.send('Server is working!')
})

// GroupMembership Meta
app.get('/api/membership/groupMeta', (req, res) => {
  res.send(groupMembership)
})

// GroupMembership Meta
app.get('/api/membership/serverMembershipMeta', (req, res) => {
  res.send(serverMembership)
})

app.get('/api/membership/accountTable', (req, res) => {
  res.send(accountTable)
})

app.get('/api/membership/groupTable', (req, res) => {
  res.send(groupTable)
})

app.get('/api/metadata/searchAccounts', (req, res) => {
  res.send(accountsResponse)
})

app.get('/api/metadata/searchGroups', (req, res) => {
  res.send(getGroupResponse)
})

app.get('/api/metadata/sortGroups1', (req, res) => {
  res.send(getGroupResponse)
})

app.get('/api/metadata/adminMeta', (req, res) => {
  res.send(adminMeta)
})

// ADD OR REMOVE GROUPS
app.get('/api/metadata/addOrRemoveMeta', (req, res) => {
  res.send(addOrRemoveGroupMeta)
})

app.get('/api/addOrRemoveRes', (req, res) => {
  res.send(addOrRemoveResult)
})

// Approvals Meta file
app.get('/api/metadata/approvalMeta', (req, res) => {
  res.send(approvalMetadata)
})
// Approvals table Result
app.get('/api/approvalResult', (req, res) => {
  res.send(approvalsResult)
})

// Review Meatadata
app.get('/api/metadata/reviewGroupMetadata', (req, res) => {
  res.send(reviewGroupMetadata)
})

app.get('/api/metadata/approvalSummary', (req, res) => {
  res.send(approvalSummary)
})
app.post('/api/approveDecisions/:type', (req, res) => {
  if (req.params.type === 'approve') {
    res.status(200).json({ success: true })
  }
})

app.get('/api/metadata/accountInfo', (req, res) => {
  res.send(accountMetadata)
})

app.get('/api/getServerResponse', (req, res) => {
  res.send(getServerResponse)
})

app.get('/api/getGroupResponse', (req, res) => {
  res.send(getGroupResponse)
})

app.get('/api/metadata/entitlementInfo', (req, res) => {
  res.send(entitlementMetadata)
})

app.get('/api/metadata/userInfo', (req, res) => {
  res.send(useMetadata)
})

app.get('/api/metadata/dashboard', (req, res) => {
  res.send(dashboardMetadata)
})
app.get('/api/metadata/notification', (req, res) => {
  res.send(notificationResponse)
})

app.get('/api/reviews', (req, res) => {
  res.send(reviewsData)
})

app.get('/api/review', (req, res) => {
  res.send(reviewData)
})

app.get('/api/metadata/review', (req, res) => {
  console.log('type', req.query.type)
  if (req.query.type === 'ENDUSER_ACCS_DB') {
    res.send(ENDUSER_ACCS_DB)
  }
  if (req.query.type === 'SELF_ASSESSMENT') {
    res.send(SELF_ASSESSMENT)
  }
  if (req.query.type === 'AAA_WIN_UNIX_DB_DBPASSPORT_FOBO') {
    res.send(AAA_WIN_UNIX_DB_DBPASSPORT_FOBO)
  }
  if (req.query.type === 'AAA_WIN_UNIX_DB_DBPASSPORT_MOV') {
    res.send(AAA_WIN_UNIX_DB_DBPASSPORT_MOV)
  }
  if (req.query.type === 'AAA_ASA_DB') {
    res.send(AAA_ASA_DB)
  }
  if (req.query.type === 'AAA_ASA_UNIX') {
    res.send(AAA_ASA_UNIX)
  }
  if (req.query.type === 'AAA_ASA_WIN') {
    res.send(AAA_ASA_WIN)
  }
  if (req.query.type === 'ACCS_GROUP_DBPASSPORT') {
    res.send(ACCS_GROUP_DBPASSPORT)
  }
  if (req.query.type === 'GROUP_ENT_DBPASSPORT') {
    res.send(GROUP_ENT_DBPASSPORT)
  }
  if (req.query.type === 'ISA_WIN_UNIX_DB') {
    res.send(ISA_WIN_UNIX_DB)
  }
  if (req.query.type === 'SECURITY_VDRGROUP') {
    res.send(SECURITY_VDRGROUP)
  }
  if (req.query.type === 'DORMANT_AD_ACCS') {
    res.send(DORMANT_AD_ACCS)
  }
  if (req.query.type === 'SECURITY_ADGROUP') {
    res.send(SECURITY_ADGROUP)
  }
  if (req.query.type === 'SECURITY_ADGROUP_MAIN') {
    res.send(SECURITY_ADGROUP_MAIN)
  }
  if (req.query.type === 'SECURITY_VDRGROUP_MAIN') {
    res.send(SECURITY_VDRGROUP_MAIN)
  }

  if (req.query.type === 'RACF_ROL_ACC') {
    res.send(racfRolAcc)
  }

  if (req.query.type === 'RACF_ROL_GRP') {
    res.send(racfRolGrp)
  }
  if (req.query.type === 'RACF_GRP_ACC') {
    res.send(racfGrpAcc)
  }
  if (req.query.type === 'DB2_ACC') {
    res.send(DB2Acc)
  }
  if (req.query.type === 'DB2_GRP') {
    res.send(DB2Grp)
  }
  if (req.query.type === 'MIDRANGE_ACC') {
    res.send(MidRangeAcc)
  }
  if (req.query.type === 'CYB_ACL_MEM') {
    res.send(cybAclMem)
  }
  if (req.query.type === 'CYB_SAFE_CNT') {
    res.send(cybSafeCnt)
  }
  if (req.query.type === 'CYB_SAFE_CNT_ACL') {
    res.send(cybSafeCntAcl)
  }

  res.send(reviewTableMetadata)
})

// app.get('/api/metadata/reviewDB', (req, res) => {
//   res.send(ENDUSER_ACCS_DB)
// })

app.get('/api/searchUser', (req, res) => {
  const { name } = req.query
  const filteredUsers = usersData.filter(
    (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) > -1
  )
  if (filteredUsers.length) {
    res.send(filteredUsers)
  } else {
    res.status(400).send('No users found')
  }
})

app.get('/api/metadata/reviews', (req, res) => {
  res.send(reviewsTableMetadata)
})

app.post('/api/reviewAction/:type', (req, res) => {
  if (req.params.type === 'Forward') {
    const updatedData = reviewData.filter((review) => !req.body.reviewIds.includes(review.id))
    res.send(updatedData)
  } else if (req.params.type === 'AllowExceptions') {
    // eslint-disable-next-line no-restricted-syntax
    for (const i in reviewData) {
      if (req.body.reviewIds.includes(reviewData[i].id)) {
        reviewData[i].expirationDate = req.body.expirationDate
      }
    }
    res.send(reviewData)
  } else {
    res.status(200).json({ success: true })
  }
})

app.get('/api/metadata/userPreferances', (req, res) => {
  res.send(userPreferances)
})

app.get('/api/metadata/historyDashboard', (req, res) => {
  res.send(historyDashboard)
})

app.get('/api/metadata/requestHistory', (req, res) => {
  res.send(requestHistory)
})

app.get('/api/metadata/myTeamTable', (req, res) => {
  res.send(myTeamMeta)
})

app.get('/api/metadata/justificationTable', (req, res) => {
  res.send(justificationMeta)
})

app.get('/api/metadata/approvalHistory', (req, res) => {
  res.send(approvalHistory)
})

app.get('/api/metadata/draftsTable', (req, res) => {
  res.send(draftsMetadata)
})

app.get('/api/drafts/draftsData', (req, res) => {
  res.send(draftsdata)
})

app.get('/api/drafts/draftsResponse', (req, res) => {
  res.send(draftsResponse)
})

app.post('/api/metadata/userPreferances/:action', (req, res) => {
  fs.writeFile('./metadata/userPreferances.json', JSON.stringify(req.body), (err) => {
    // error checking
    if (err) throw err
  })
  res.status(200).json({ success: true })
})

app.get('/api/:id/history', (req, res) => {
  setTimeout(() => res.send(historyPayload), 1500)
})

app.get('/api/filterBy/:word', (req, res) => {
  res.send([])
})

/* AD Group Management API */

app.get('/api/metadata/createADGroup', (req, res) => {
  res.send(createADGroupMeta)
})

app.get('/api/metadata/createADGroupSummary', (req, res) => {
  res.send(createADGroupSummary)
})

/* Account Management Create,Modify */
app.post('/api/submitAdDetails', (req) => {
  console.log('body', req.body)
})

app.get('/api/metadata/accountManagement', (req, res) => {
  res.send(accountManagementMeta)
})

app.get('/api/metadata/bulkRequest', (req, res) => {
  res.send(bulkRequest)
})

app.get('/api/metadata/createADGroup', (req, res) => {
  res.send(createADGroupMeta)
})

app.get('/api/metadata/createADAccount', (req, res) => {
  res.send(createADAccountMetaUpdated)
})
app.get('/api/metadata/createADAccountSummary', (req, res) => {
  res.send(createADAccountSummaryMeta)
})
app.get('/api/metadata/accountCategory/', (req, res) => {
  res.send(createADOptions.accountCategory)
})

app.get('/api/metadata/accountCategoryGroup/', (req, res) => {
  res.send(createADGroupOptions.accessioGroupType)
})
app.get('/api/metadata/modifyAdAccount', (req, res) => {
  res.send(modifyAdAccountMeta)
})

app.get('/api/metadata/Application/', (req, res) => {
  res.send(
    createADOptions.application.filter(
      (o) => o.label.toLowerCase().indexOf(req.query.queryString.toLowerCase()) > -1
    )
  )
})

app.get('/api/metadata/locations', (req, res) => {
  res.send(createADOptions.locations)
})

app.get('/api/metadata/getDN', (req, res) => {
  res.send([
    {
      label: 'OU=Infrastructure Services, DC=dbg, DC=ads,DC=db,DC=com',
      value: 'OU=Infrastructure Services, DC=dbg, DC=ads,DC=db,DC=com'
    }
  ])
})
app.get('/api/metadata/recipient', (req, res) => {
  res.send(
    createADOptions.recipient.filter(
      (o) => o.label.toLowerCase().indexOf(req.query.queryString.toLowerCase()) > -1
    )
  )
})
app.get('/api/metadata/dbagCostcenter', (req, res) => {
  res.send(
    createADOptions.costCenter.filter(
      (o) => o.label.toLowerCase().indexOf(req.query.queryString.toLowerCase()) > -1
    )
  )
})
app.get('/api/metadata/Department', (req, res) => {
  res.send(
    createADOptions.department.filter(
      (o) => o.label.toLowerCase().indexOf(req.query.queryString.toLowerCase()) > -1
    )
  )
})
app.get('/api/metadata/dbagApplicationID/', (req, res) => {
  res.send(
    createADOptions.dbagApplicationID.filter(
      (o) => o.label.toLowerCase().indexOf(req.query.queryString.toLowerCase()) > -1
    )
  )
})
app.get('/api/metadata/primaryAccount/', (req, res) => {
  res.send(
    createADOptions.primaryAccount.filter(
      (o) => o.id.toLowerCase().indexOf(req.query.queryString.toLowerCase()) > -1
    )
  )
})
app.get('/api/metadata/getADAccountInfo/', (req, res) => {
  res.send(modifyADOptions.result.filter((o) => o.id.indexOf(req.query.id) > -1))
})
app.get('/api/metadata/validateSAMAccount/', (req, res) => {
  let isValid = true
  if (req.query.queryString.toLowerCase() === 'avp-caa') {
    isValid = false
  }
  if (req.query.queryString.toLowerCase() === 'mkvtest') {
    isValid = false
  }
  res.send(isValid)
})

app.get('/api/metadata/modifyPersonalMetadata', (req, res) => {
  res.send(modifyPersonalMetadata)
})
app.get('/api/metadata/modifyNonPersonalMetadata', (req, res) => {
  res.send(modifyNonPersonalMetadata)
})
app.get('/api/metadata/modifyTabMeta', (req, res) => {
  res.send(modifyTabMetadata)
})
app.get('/api/metadata/getNarIdInfo', (req, res) => {
  res.send(narIdInfo)
})

// eslint-disable-next-line no-unused-vars
app.post('/api/deleteAdDetails', (req, res) => {
  console.log('body', req.body)
})
// Approvals table Result
app.get('/api/modifyRequests', (req, res) => {
  res.send(modifyRequests)
})

app.get('/api/metadata/assetsSummary', (req, res) => {
  res.send(assetsSummary)
})

app.get('/api/metadata/modifyListGroupMetadata', (req, res) => {
  res.send(modifyListGroupMetadata)
})
app.get('/api/metadata/modifyListIndirectlyOwnedGroupMetadata', (req, res) => {
  res.send(modifyListIndirectlyOwnedGroupMetadata)
})

app.get('/api/metadata/groupApprovalSummary', (req, res) => {
  res.send(groupApprovalSummary)
})
app.get('/api/metadata/modifyListGroupResponse', (req, res) => {
  res.send(modifyListGroupResponse)
})
app.get('/api/metadata/requestHistoryDataResponse', (req, res) => {
  res.send(requestHistoryDataResponse)
})
app.get('/api/metadata/approvalDataResponse', (req, res) => {
  res.send(approvalDataResponse)
})
app.get('/api/metadata/justificationDataResponse', (req, res) => {
  res.send(justificationDataResponse)
})
app.get('/api/metadata/modifyADGroup', (req, res) => {
  res.send(modifyADGroup)
})
app.get('/api/metadata/assetsGroupSummary', (req, res) => {
  res.send(assetsGroupSummary)
})
app.get('/api/metadata/accessTabMeta', (req, res) => {
  res.send(accessTabMetadata)
})
app.get('/api/metadata/accessGroupMeta', (req, res) => {
  res.send(accessGroupMetadata)
})

app.get('/api/metadata/groupDetails', (req, res) => {
  res.send(groupDetails)
})

app.get('/api/metadata/entitlementApprovalSummary', (req, res) => {
  res.send(entitleMentApprovalSummary)
})

app.get('/api/metadata/entitlementApprovalSummary', (req, res) => {
  res.send(entitleMentApprovalSummary)
})

app.get('/api/metadata/getServiceDeskAdminMeta', (req, res) => {
  res.send(getServiceDeskAdminMeta)
})

app.get('/api/metadata/getServiceDeskAdminData', (req, res) => {
  res.send(getServiceDeskAdminData)
})

const server = app.listen(8081, () => {
  // eslint-disable-next-line no-unused-vars
  const host = server.address().address
  const { port } = server.address()

  console.log(`Server for mocking data started`)
  console.log(`Application is listening at http://localhost:${port}/api`)
})
