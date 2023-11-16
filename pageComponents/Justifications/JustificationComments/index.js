import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, TextField, Typography } from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import translate from 'translations/translate'
import useTheme from '../../../hooks/useTheme'
import * as Styled from './style'
import {
  updateShowBigLoader,
  fetchJustificationsItemsStart
} from '../../../redux/justifications/justifications.action'
import * as approvalApi from '../../../api/approvals'
import * as justificationApi from '../../../api/justifications'
import {
  selectJustificationsPageNumber,
  selectJustificationsPageSize
} from '../../../redux/justifications/justifications.selector'
import { updateReviewNotificationMessage } from '../../../redux/review/review.action'
import { getFormattedDateTime } from '../../../helpers/strings'

const JustificationComments = ({ reviewId, comments, handleClose, phaseId, dataItem, type }) => {
  const [comm, setComment] = useState('')
  const [isError, setIsError] = useState(false)
  const [leaveComment, setLeaveComment] = useState(false)
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const successMessage = translate('justification.requestor.successMsg')
  const commentErrorMessage = translate('justification.comment.errorMsg')
  const submitErrorMessage = translate('justification.submit.errorMsg')
  const pageNumber = useSelector(selectJustificationsPageNumber)

  const pageSize = useSelector(selectJustificationsPageSize)
  const history = useHistory()

  const dispatchSubmitData = () => {
    if (pageNumber > 0) {
      dispatch(fetchJustificationsItemsStart(pageSize, pageNumber))
    } else {
      dispatch(fetchJustificationsItemsStart(pageSize, pageNumber))
    }
  }
  const handleJustification = (e) => {
    setComment(e.target.value)
    setIsError(e.target.value === '')
  }
  const handleComment = () => {
    if (comm.trim() === '') {
      setIsError(true)
    } else {
      handleClose(false)
      dispatch(updateShowBigLoader(true))
      const payloadComments = {
        comment: comm
      }
      approvalApi
        .approvalComment('commentReq', reviewId[0], payloadComments, phaseId)
        .then((res) => {
          handleClose(false)
          if (res?.status === 200) {
            const commonDetails = dataItem.common
            commonDetails.pendingJustification = false
            let requestorID = dataItem.requestID
            if (dataItem.requestorID) {
              if (dataItem.requestorID.indexOf('managed/user') > -1) {
                requestorID = dataItem.requestor.id.replace('managed/user/', '')
              } else {
                requestorID = dataItem.requestorID
              }
            }

            const payload = {
              requestID: dataItem.requestID,
              requestorID,
              approverID: dataItem.approverID,
              phaseName: phaseId,
              requestDetails: {
                common: commonDetails
              }
            }
            justificationApi.reassignItem(payload).then((resp) => {
              if (resp?.status === 200) {
                dispatch(
                  updateReviewNotificationMessage({
                    type: 'Success',
                    message: successMessage
                  })
                )
              } else if (res?.response?.status !== 200) {
                dispatch(
                  updateReviewNotificationMessage({
                    type: 'error',
                    message: submitErrorMessage
                  })
                )
              }
              if (type === 'justificationSummary') {
                history.push('/tasks/justifications')
              }
              dispatchSubmitData()
            })
          } else if (res?.response?.status !== 200) {
            dispatch(
              updateReviewNotificationMessage({
                type: 'error',
                message: commentErrorMessage
              })
            )
            if (type === 'justificationSummary') {
              history.push('/tasks/justifications')
            }
            dispatchSubmitData()
          }
        })
        .catch(() => {
          handleClose(false)
          dispatch(
            updateReviewNotificationMessage({
              type: 'error',
              message: commentErrorMessage
            })
          )
        })
    }
  }

  return (
    <>
      {!leaveComment ? (
        <>
          <Typography variant="h1" style={{ fontWeight: '300', marginBottom: '30px' }}>
            {translate('justification.justificationList')}
          </Typography>
          {comments?.length > 0 ? (
            <>
              {comments.map(
                (e) =>
                  !e.request && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div
                            style={{
                              background: theme === 'dark' ? 'transparent' : '#eff9fc',
                              borderRadius: '40px',
                              margin: '5px 5px 0 4px'
                            }}
                          >
                            <ChatBubbleOutlineIcon
                              style={{ margin: '11px 10px 7px 10px', opacity: '0.5' }}
                            />
                          </div>
                          <Typography color={theme === 'dark' ? '#fff' : '#333'} variant="body1">
                            {`${e.user.givenName} ${e.user.sn} `}
                          </Typography>
                          <Typography
                            color={theme === 'dark' ? '#fff' : '#aaa'}
                            variant="body1"
                            style={{ marginLeft: '5px' }}
                          >
                            {e.user.mail}
                          </Typography>
                        </div>
                        <div style={{ alignSelf: 'center' }}>
                          <Typography variant="body1">
                            {e.timeStamp ? getFormattedDateTime(e.timeStamp) : ''}
                          </Typography>
                        </div>
                      </div>
                      <div style={{ marginLeft: '50px' }}>
                        <Typography variant="body1">{e.comment}</Typography>
                      </div>
                    </>
                  )
              )}
            </>
          ) : (
            <p>{translate('approval.noComments')} </p>
          )}
          {comments?.length === 0 && <p>{translate('approval.noComments')} </p>}
          <Button
            variant="contained"
            style={{ width: '100%', marginTop: '15px' }}
            onClick={() => setLeaveComment(true)}
          >
            {translate('justification.submitJustification')}
          </Button>
        </>
      ) : (
        <>
          <TextField
            id="outlined-multiline-static"
            label={translate('justification.label.addJustification')}
            multiline
            rows={4}
            sx={{ marginTop: 5, width: '100%' }}
            value={comm}
            error={isError}
            helperText={isError ? translate('justification.error.message') : ''}
            onChange={(e) => {
              handleJustification(e)
            }}
          />

          <Styled.CommentButtonWrapper>
            <Button
              variant="outlined"
              sx={{
                color: `${theme === 'dark' ? '#FFF' : '#000'}`,
                borderColor: '#000'
              }}
              disabled={!comm?.length > 0}
              onClick={handleComment}
            >
              {translate('justification.button.submit')}
            </Button>
            <Button onClick={() => handleClose(false)} sx={{ marginRight: '8px', color: '#000' }}>
              {translate('approval.cancel')}
            </Button>
          </Styled.CommentButtonWrapper>
        </>
      )}
    </>
  )
}

export default JustificationComments
