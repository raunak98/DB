import { combineReducers } from 'redux'
import dashboardReducer from './dashboard/dashboard.reducer'
import profileReducer from './profile/profile.reducer'
import reviewsReducer from './reviews/reviews.reducer'
import reviewReducer from './review/review.reducer'
import reviewActionReducer from './review/reassign/reviewAction.reducer'
import activeDirectoryReducer from './requests/activeDirectory/activeDirectorySlice'
import requestHistoryReducer from './history/requestHistory/requestHistory.reducer'
import myAssetsReducer from './myAssets/myAssets.reducer'
import approvalsReducer from './approvals/approvals.reducer'
import draftsReducer from './drafts/drafts.reducer'
import approvalHistoryReducer from './history/approvalHistory/approvalHistory.reducer'
import myTeamReducer from './myTeam/myTeam.reducer'
import justificationsReducer from './justifications/justifications.reducer'
import myAccessReducer from './myAccess/myAccess.reducer'
import serviceDeskAdminReducer from './admin/serviceDeskAdmin/serviceDeskAdmin.reducer'

const reducers = combineReducers({
  dashboard: dashboardReducer,
  reviews: reviewsReducer,
  review: reviewReducer,
  reviewAction: reviewActionReducer,
  profile: profileReducer,
  adAccountInfo: activeDirectoryReducer,
  requestHistory: requestHistoryReducer,
  myAssets: myAssetsReducer,
  approvals: approvalsReducer,
  drafts: draftsReducer,
  approvalHistory: approvalHistoryReducer,
  myTeam: myTeamReducer,
  justifications: justificationsReducer,
  myAccess: myAccessReducer,
  serviceDeskAdmin: serviceDeskAdminReducer
})

export default reducers
