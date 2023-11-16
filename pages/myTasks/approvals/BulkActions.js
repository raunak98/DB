import React, { useState } from 'react'
import { Button, TextField, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import translate from 'translations/translate'
import * as draftsApi from 'api/history'
import { fetchDraftsItemsStart, updateDraftsShowBigLoader } from 'redux/drafts/drafts.action'
import { updateReviewNotificationMessage } from 'redux/review/review.action'
import * as Styled from './style'
import {
  fetchApprovalsItemsStart,
  updateShowBigLoader,
  updateApprovalsNotificationMessage
} from '../../../redux/approvals/approvals.action'

import {
  selectApprovalsPageNumber,
  selectApprovalsPaginationKeys,
  selectApprovalsSearchAfterKeyword
} from '../../../redux/approvals/approvals.selector'
import { selectprofileDetails } from '../../../redux/profile/profile.selector'
import { selectMyTeamSearchItem } from '../../../redux/myTeam/myTeam.selector'
import * as approvalApi from '../../../api/approvals'

const BulkActions = ({ closeModal, requestType, bulkActionsData, onCallback }) => {
  const dispatch = useDispatch()
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState('')
  const pageNumber = useSelector(selectApprovalsPageNumber)
  const paginationKeysArray = useSelector(selectApprovalsPaginationKeys)
  const profileDetails = useSelector(selectprofileDetails)
  const myTeamDetails = useSelector(selectMyTeamSearchItem)
  const searchAfterKeywords = useSelector(selectApprovalsSearchAfterKeyword)
  const counter = { successCounter: 0, errorCounter: 0 }
  const component = localStorage.getItem('component')

  const errooccured = translate('approval.errooccured')
  const decision = translate('approval.decision')
  const recordedsuccessfully = translate('approval.recordedsuccessfully')

  const handleJustification = (e) => {
    setMessage(e.target.value)
    if (e.target.value === '') {
      setIsError(true)
      onCallback(false)
    } else {
      setIsError(false)
    }
  }

  const iff = (consition, then, otherise) => (consition ? then : otherise)

  const handleRequestConfirm = async (defaultMessage, request) => {
    let payload = {}
    if (message.trim() === '' && component !== 'Drafts') {
      setIsError(true)
      return false
    }
    closeModal(false)
    // Call API when Clicked on Approved Button

    // API call to approve or reject the request
    // eslint-disable-next-line no-restricted-syntax
    for (const data of bulkActionsData) {
      if (component === 'MyTeam') {
        dispatch(updateShowBigLoader(true))
        payload = {
          LMMail: profileDetails.mail,
          decision: request === 'approveReq' ? 'approve' : 'reject',
          requestId: data.approveId,
          Decision_Comment: {
            comment: message || defaultMessage
          },
          phaseName: data.phaseId
        }
        // eslint-disable-next-line no-await-in-loop
        await approvalApi
          .approveRejectLM(payload)
          .then((res) => {
            if (res?.status !== 200) {
              counter.errorCounter += 1
            } else {
              counter.successCounter += 1
            }
          })
          .catch((err) => {
            console.error(err)
            counter.errorCounter += 1
          })
      } else if (component === 'Drafts') {
        dispatch(updateDraftsShowBigLoader(true))
        // eslint-disable-next-line no-await-in-loop
        await draftsApi
          .cancelRequest(data.draftId, data.phaseId ? data.phaseId : '')
          .then((res) => {
            if (res?.status !== 200) {
              counter.errorCounter += 1
            } else {
              counter.successCounter += 1
            }
          })
      } else {
        payload = {
          comment: message || defaultMessage
        }
        dispatch(updateShowBigLoader(true))
        // eslint-disable-next-line no-await-in-loop
        await approvalApi
          .approvalActions(request, data.approveId, data.phaseId, payload)
          .then((res) => {
            if (res?.status !== 200) {
              counter.errorCounter += 1
            } else {
              counter.successCounter += 1
            }
          })
          .catch((err) => {
            console.error(err)
            counter.errorCounter += 1
          })
      }
    }
    const dispatchApprovalsDraftsData = () => {
      let payload1 = {}
      if (pageNumber > 0) {
        if (component === 'MyTeam') {
          payload1 = {
            id: myTeamDetails[0].id,
            recipientMail: myTeamDetails[0].email,
            search_after_primaryKey: paginationKeysArray ? paginationKeysArray.slice(-1)[0] : null,
            search_after_keyword: searchAfterKeywords ? searchAfterKeywords.slice(-1)[0] : null
          }
        } else if (component === 'Drafts') {
          dispatch(
            fetchDraftsItemsStart({
              saKeyWord: null,
              saprimaryKey: null
            })
          )
        } else {
          payload1 = {
            search_after_primaryKey: paginationKeysArray ? paginationKeysArray.slice(-1)[0] : null,
            search_after_keyword: searchAfterKeywords ? searchAfterKeywords.slice(-1)[0] : null
          }

          dispatch(fetchApprovalsItemsStart(payload1))
        }
      } else {
        if (component === 'MyTeam') {
          payload1 = {
            id: myTeamDetails[0].id,
            recipientMail: myTeamDetails[0].email
          }
        } else if (component === 'Drafts') {
          dispatch(
            fetchDraftsItemsStart({
              saKeyWord: null,
              saprimaryKey: null
            })
          )
          return
        }

        dispatch(fetchApprovalsItemsStart(component === 'MyTeam' ? payload1 : null))
      }
    }

    if (counter.errorCounter + counter.successCounter === bulkActionsData?.length) {
      dispatchApprovalsDraftsData()
      let type
      let messageInfo
      if (counter.errorCounter > 0 && counter.successCounter === 0) {
        type = 'Error'
        messageInfo = `${errooccured} ${counter.errorCounter} ${decision}`
      } else if (counter.successCounter > 0 && counter.errorCounter === 0) {
        type = 'Success'
        messageInfo = `${counter.successCounter} ${decision}
         ${recordedsuccessfully}`
      } else {
        type = 'Mixed'
        messageInfo = [
          `${counter.successCounter} ${decision} 
         ${recordedsuccessfully}`,
          `${errooccured} ${counter.errorCounter} ${decision}`
        ]
      }
      if (component === 'Drafts') {
        dispatch(
          updateReviewNotificationMessage({
            type,
            message: messageInfo
          })
        )
      } else {
        dispatch(
          updateApprovalsNotificationMessage({
            type,
            message: messageInfo
          })
        )
      }
    }

    return true
  }

  return (
    <>
      <Typography variant="h3">{translate('approval.confirmText')}</Typography>
      <p style={{ margin: '20px 0' }}>
        {/* {translate(
          requestType === 'approveReq' ? 'approval.confirm.approval' : 'approval.confirm.reject'
        )} */}
        {translate(
          iff(
            requestType === 'approveReq',
            'approval.confirm.approval',
            requestType === 'RejectReq' ? 'approval.confirm.reject' : 'draft.confirm.delete'
          )
        )}
      </p>
      {requestType !== 'deleteDraftReq' && (
        <TextField
          onChange={(e) => handleJustification(e)}
          sx={{ width: '100%' }}
          required
          id="outlined-required"
          label="Comment"
          placeholder="Enter Comment"
          error={isError}
          helperText={isError ? 'Please enter comment' : ''}
        />
      )}
      <Styled.ApproveButtonWrapper>
        <Button onClick={() => closeModal(false)} autoFocus>
          {translate('approval.cancel')}
        </Button>
        <Button
          onClick={() =>
            handleRequestConfirm(
              ['approveReq', 'deleteDraftReq'].includes(requestType) ? 'Approved' : 'Rejected',
              ['approveReq', 'deleteDraftReq'].includes(requestType) ? 'approveReq' : 'rejectReq'
            )
          }
        >
          {/* {translate(requestType === 'approveReq' ? 'review.approve' : 'review.reject')} */}
          {translate(
            iff(
              requestType === 'approveReq',
              'review.approve',
              requestType === 'RejectReq' ? 'review.reject' : 'drafts.bulkDelete.confirmBtn'
            )
          )}
        </Button>
      </Styled.ApproveButtonWrapper>
    </>
  )
}

export default BulkActions
