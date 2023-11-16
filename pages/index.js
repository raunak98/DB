export { default as Admin } from './admin'
export { default as AccountAdmin } from './admin/accountAdmin'
export { default as GroupAdmin } from './admin/groupAdmin'
export { default as ServiceDeskAdmin } from './admin/serviceDeskAdmin'

export { default as BulkRequests } from './bulkRequests'
export { default as BulkCreate } from './bulkRequests/request/create'
export { default as BulkModify } from './bulkRequests/request/modify'
export { default as BulkDelete } from './bulkRequests/request/delete'

export { default as BulkCreateAdGroup } from './bulkRequests/adGroup/create'
export { default as BulkDeleteAdGroup } from './bulkRequests/adGroup/delete'
export { default as BulkModifyAdGroup } from './bulkRequests/adGroup/modify'
export { default as BulkAddRemoveGroupMember } from './bulkRequests/adGroup/addRemoveGroupMember'

export { default as Dashboard } from './dashboard'

export { default as History } from './history'
export { default as Lists } from './history/lists'
export { default as List } from './history/lists/list'
export { default as RequestHistory } from './history/requestHistory'
export { default as ApprovalHistory } from './history/approvalHistory'
export { default as RequestSummary } from './history/requestHistory/summary'
export { default as ApprovalSummary } from './history/approvalHistory/summary'
export { default as MyAccess } from './myAccess'

export { default as MyOwnership } from './myOwnership'

export { default as Tasks } from './myTasks'
export { default as Approvals } from './myTasks/approvals'
export { default as Summary } from './myTasks/approvals/summary'
export { default as Reviews } from './myTasks/reviews'
export { default as Review } from './myTasks/reviews/review'
export { default as SemiAnnual } from './myTasks/reviews/semiAnnualReview'
export { default as Violations } from './myTasks/violations'
export { default as Justifications } from './myTasks/justifications'
export { default as JustificationsSummary } from './myTasks/justifications/summary'

export { default as Profile } from './profile'
export { default as MyTeam } from './myTeam'
export { default as MyAsset } from './myAsset'
export { default as Modify } from './myAsset/modify'
export { default as Group } from './myAsset/modify/group'
export { default as IndirectlyOwnedModifyGroup } from './myAsset/modify/IndirectlyOwnedModifyGroup'
export { default as GroupSummary } from './myAsset/summary/groupSummary'
export { default as IndirectlyOwnedGroupSummary } from './myAsset/summary/IndirectlyOwnedGroupSummary'
export { default as AccountSummary } from './myAsset/summary'
export { default as HistoricalRequestHistory } from './myAsset/historicalRequestHistory'
export { default as View } from './myTeam/view'

export { default as Create } from './requests/request/create'
// export { default as AddOrRemove } from './requests/request/adGroupMembership/addOrRemove'
export { default as AddOrRemoveServer } from './requests/request/adGroupMembership/addOrRemoveServer'

export { default as AddOrRemove } from './requests/request/adGroupMembership/addOrRemoveMembership'
export { default as CreateADGroup } from './requests/request/create/adGroupManagement'

export { default as NotAuthorised } from './notAuthorised'

export { default as NotFound } from './notFound'
export { default as Drafts } from './drafts'

export { default as Reports } from './reports'

export { default as Requests } from './requests'

export { default as Error } from './error'
