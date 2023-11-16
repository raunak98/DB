import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, TextField, Typography } from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import translate from 'translations/translate'
import { selectMyTeamSearchItem } from 'redux/myTeam/myTeam.selector'
import useTheme from '../../../hooks/useTheme'
import * as Styled from './style'
import {
  fetchApprovalsItemsStart,
  updateShowSmallLoader
} from '../../../redux/approvals/approvals.action'
import {
  selectApprovalsPageNumber,
  selectApprovalsPaginationKeys,
  selectApprovalsSearchAfterKeyword
} from '../../../redux/approvals/approvals.selector'
import { updateReviewNotificationMessage } from '../../../redux/review/review.action'
import * as approvalApi from '../../../api/approvals'
import { getFormattedDateTime } from '../../../helpers/strings'

const ApprovalComments = ({ reviewId, comments, handleClose, phaseId }) => {
  const [comm, setComment] = useState('')
  const [leaveComment, setLeaveComment] = useState(false)
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const successMessage = translate('approval.comment.successMsg')
  const errorMessage = translate('approval.comment.errorMsg')
  const pageNumber = useSelector(selectApprovalsPageNumber)
  const paginationKeysArray = useSelector(selectApprovalsPaginationKeys)
  const searchAfterKeywords = useSelector(selectApprovalsSearchAfterKeyword)
  const myTeamDetails = useSelector(selectMyTeamSearchItem)
  const component = localStorage.getItem('component')

  const triggerUpdate = () => {
    let payload1 = {}
    if (pageNumber > 0) {
      if (component === 'MyTeam') {
        payload1 = {
          id: myTeamDetails[0]?.id,
          recipientMail: myTeamDetails[0]?.email,
          search_after_primaryKey: paginationKeysArray ? paginationKeysArray.slice(-1)[0] : null,
          search_after_keyword: searchAfterKeywords ? searchAfterKeywords.slice(-1)[0] : null
        }
      } else {
        payload1 = {
          search_after_primaryKey: paginationKeysArray ? paginationKeysArray.slice(-1)[0] : null,
          search_after_keyword: searchAfterKeywords ? searchAfterKeywords.slice(-1)[0] : null
        }
      }

      dispatch(fetchApprovalsItemsStart(payload1))
    } else {
      if (component === 'MyTeam') {
        payload1 = {
          id: myTeamDetails[0]?.id,
          recipientMail: myTeamDetails[0]?.email
        }
      }
      dispatch(fetchApprovalsItemsStart(component === 'MyTeam' ? payload1 : null))
    }
  }

  const handleComment = () => {
    handleClose(false)
    dispatch(updateShowSmallLoader(true))
    const payload = {
      comment: comm
    }
    approvalApi
      .approvalComment('commentReq', reviewId[0], payload, phaseId)
      .then((res) => {
        handleClose(false)
        if (res?.status === 200) {
          dispatch(
            updateReviewNotificationMessage({
              type: 'Success',
              message: successMessage
            })
          )
          dispatch(updateShowSmallLoader(false))
          triggerUpdate()
        } else if (res?.response?.status !== 200) {
          dispatch(
            updateReviewNotificationMessage({
              type: 'error',
              message: errorMessage
            })
          )
          dispatch(updateShowSmallLoader(false))
          triggerUpdate()
        }
      })
      .catch(() => {
        handleClose(false)
        dispatch(
          updateReviewNotificationMessage({
            type: 'error',
            message: errorMessage
          })
        )
        dispatch(updateShowSmallLoader(false))
        triggerUpdate()
      })
  }
  const iff = (consition, then, otherise) => (consition ? then : otherise)

  return (
    <>
      {!leaveComment ? (
        <>
          <Typography variant="h1" style={{ fontWeight: '300', marginBottom: '30px' }}>
            {translate('approval.commentList')}
          </Typography>
          {comments?.length > 0 ? (
            <>
              {comments.map((e) =>
                !e.request &&
                (e?.user?.id === 'SYSTEM' ||
                  ['etl', 'accessio', 'IGAdminUser'].includes(e?.user?.givenName)) &&
                ![undefined, '', null].includes(e?.comment) ? (
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
                          {translate('approval.SYSTEMGENERATED')}
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
                ) : (
                  iff(
                    ['reassign', 'updateStatus', 'comment'].includes(e.action) &&
                      ![undefined, '', null].includes(e?.comment) &&
                      !e.request,
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
                            {`${e.user.givenName} ${e.user.sn}`}
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
                    </>,
                    null
                  )
                )
              )}
            </>
          ) : (
            <p>{translate('approval.noComments')} </p>
          )}
          {comments?.length === 1 && comments[0].request && (
            <p>{translate('approval.noComments')} </p>
          )}
          <Button
            variant="contained"
            style={{ width: '100%', marginTop: '15px' }}
            onClick={() => setLeaveComment(true)}
          >
            {translate('approval.leaveACommentLabel')}
          </Button>
        </>
      ) : (
        <>
          <p>{translate('approval.leaveCommentsLabel')}</p>
          <TextField
            id="outlined-multiline-static"
            label={translate('approval.comment.addCommentBtnLabel')}
            multiline
            rows={4}
            sx={{ marginTop: 5, width: '100%' }}
            value={comm}
            onChange={(event) => setComment(event.target.value)}
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
              {translate('approval.commentBtnLabel')}
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

export default ApprovalComments
