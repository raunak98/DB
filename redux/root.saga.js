import { all, call } from 'redux-saga/effects'
import dashboardSagas from './dashboard/dashboard.saga'
import profileSagas from './profile/profile.saga'
import reviewsSagas from './reviews/reviews.saga'
import reviewSagas from './review/review.saga'
import reviewActionSagas from './review/reassign/reviewAction.saga'
import requestHistorySagas from './history/requestHistory/requestHistory.saga'
import myAssetsSagas from './myAssets/myAssets.saga'
import approvalsSagas from './approvals/approvals.saga'
import draftsSagas from './drafts/drafts.saga'
import approvaltHistorySagas from './history/approvalHistory/approvalHistory.saga'
import myTeamSagas from './myTeam/myTeam.saga'
import justificationsSagas from './justifications/justifications.saga'
import myAccessSagas from './myAccess/myAccess.saga'
import serviceDeskAdminSagas from './admin/serviceDeskAdmin/serviceDeskAdmin.saga'

export default function* rootSaga() {
  yield all([
    call(dashboardSagas),
    call(reviewsSagas),
    call(reviewSagas),
    call(reviewActionSagas),
    call(profileSagas),
    call(requestHistorySagas),
    call(myAssetsSagas),
    call(approvalsSagas),
    call(draftsSagas),
    call(approvaltHistorySagas),
    call(myTeamSagas),
    call(justificationsSagas),
    call(myAccessSagas),
    call(serviceDeskAdminSagas)
  ])
}
