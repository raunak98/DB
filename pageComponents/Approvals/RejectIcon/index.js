import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import TextField from '@mui/material/TextField'
import { Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import CircularIntegration from 'components/circularIntegration'
import translate from 'translations/translate'
import { getAction } from '../../../helpers/table'
import * as approveApi from '../../../api/approvals'
import {
  updateApprovalsNotificationMessage,
  updateShowSmallLoader,
  fetchApprovalsItemsStart
} from '../../../redux/approvals/approvals.action'
import {
  selectApprovalsPageNumber,
  selectApprovalsPaginationKeys,
  selectApprovalsSearchAfterKeyword
} from '../../../redux/approvals/approvals.selector'
import { selectMyTeamSearchItem } from '../../../redux/myTeam/myTeam.selector'
import { selectprofileDetails } from '../../../redux/profile/profile.selector'
import useTheme from '../../../hooks/useTheme'

const RejectIcon = ({
  iconInactive,
  iconActive,
  type,
  rejectId,
  requestNumber,
  status,
  title,
  phaseId,
  isVipApprover
}) => {
  const [open, setOpen] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const [statusCode, setStatusCode] = React.useState('')
  const [isError, setIsError] = React.useState(false)
  const isChecked = getAction(status) === type
  const iconName = isChecked ? iconInactive : iconActive
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const approvalRejectSucessMsg = `${translate('approval.reject.success')} ${translate(
    'approval.forRequestNo'
  )} ${requestNumber}`
  const approvalErrMsg = `${translate('approval.reject.errorMsg')} ${translate(
    'approval.forRequestNo'
  )} ${requestNumber}`
  const pageNumber = useSelector(selectApprovalsPageNumber)
  const paginationKeysArray = useSelector(selectApprovalsPaginationKeys)
  const searchAfterKeywords = useSelector(selectApprovalsSearchAfterKeyword)
  const myTeamDetails = useSelector(selectMyTeamSearchItem)
  const componentType = localStorage.getItem('component')
  const { id } = useParams()
  const profileDetails = useSelector(selectprofileDetails)
  const commentErrorMessage = translate('justification.requestInfo.comment.errorMsg')

  const handleRejectBtn = () => {
    setOpen(true)
    setIsError(false)
  }

  const handleJustification = (e) => {
    setMessage(e.target.value)
    if (e.target.value === '') {
      setIsError(true)
    } else {
      setIsError(false)
    }
  }

  const dispatchApprovalsData = () => {
    let payload = {}
    if (pageNumber > 0) {
      if (id) {
        payload = {
          id,
          recipientMail: myTeamDetails[0].email,
          search_after_primaryKey: paginationKeysArray ? paginationKeysArray.slice(-1)[0] : null,
          search_after_keyword: searchAfterKeywords ? searchAfterKeywords.slice(-1)[0] : null
        }
      } else {
        payload = {
          search_after_primaryKey: paginationKeysArray ? paginationKeysArray.slice(-1)[0] : null,
          search_after_keyword: searchAfterKeywords ? searchAfterKeywords.slice(-1)[0] : null
        }
      }

      dispatch(fetchApprovalsItemsStart(payload))
    } else {
      if (id && myTeamDetails && myTeamDetails.length) {
        payload = {
          id,
          recipientMail: myTeamDetails[0].email
        }
      }
      dispatch(
        fetchApprovalsItemsStart(id && myTeamDetails && myTeamDetails.length ? payload : null)
      )
    }
  }

  const handleConfirm = () => {
    let payload = {}
    if (message.trim() === '') {
      setIsError(true)
      return false
    }
    setOpen(false)
    // Call API when Clicked on Reject Button

    if (componentType === 'MyTeam' || isVipApprover) {
      payload = {
        LMMail: profileDetails.mail,
        decision: 'reject',
        requestId: rejectId,
        Decision_Comment: {
          comment: message || 'Rejected'
        },
        phaseName: phaseId
      }
      dispatch(updateShowSmallLoader(true))
      approveApi
        .approveRejectLM(payload)
        .then((res) => {
          setStatusCode(res?.status)
          dispatch(updateShowSmallLoader(false))
          dispatchApprovalsData()
        })
        .catch((err) => {
          console.error(err)
          dispatch(
            updateApprovalsNotificationMessage({
              type: 'Error',
              message: approvalErrMsg
            })
          )
        })
    } else {
      payload = {
        comment: message || 'Rejected'
      }
      dispatch(updateShowSmallLoader(true))
      approveApi
        .approvalComment('commentReq', rejectId, payload, phaseId)
        .then((resp) => {
          if (resp?.status === 200) {
            approveApi
              .approvalActions('rejectReq', rejectId, phaseId, payload)
              .then((res) => {
                if (res?.status === 200) {
                  setStatusCode(res?.status)
                  dispatch(
                    updateApprovalsNotificationMessage({
                      type: 'Success',
                      message: approvalRejectSucessMsg,
                      action: 'confirm',
                      actionType: 'Approve'
                    })
                  )
                  dispatchApprovalsData()
                } else {
                  dispatch(updateShowSmallLoader(false))
                  dispatch(
                    updateApprovalsNotificationMessage({
                      type: 'Error',
                      message: approvalErrMsg
                    })
                  )
                }
              })
              .catch((err) => {
                dispatch(updateShowSmallLoader(false))
                console.error(err)
                dispatch(
                  updateApprovalsNotificationMessage({
                    type: 'Error',
                    message: approvalErrMsg
                  })
                )
              })
          } else if (resp?.response?.status !== 200) {
            dispatch(
              updateApprovalsNotificationMessage({
                type: 'error',
                message: commentErrorMessage
              })
            )
          }
        })
        .catch((error) => {
          console.error(error)
          dispatch(
            updateApprovalsNotificationMessage({
              type: 'error',
              message: commentErrorMessage
            })
          )
        })
    }

    return true
  }

  useEffect(() => {
    if (statusCode && statusCode !== 200) {
      dispatch(
        updateApprovalsNotificationMessage({
          type: 'Error',
          message: approvalErrMsg
        })
      )
      dispatchApprovalsData()
    } else if (statusCode && statusCode === 200) {
      dispatch(
        updateApprovalsNotificationMessage({
          type: 'Success',
          message: approvalRejectSucessMsg,
          action: 'confirm',
          actionType: 'Approve'
        })
      )
      dispatchApprovalsData()
    }
  }, [statusCode])

  return (
    <>
      <Tooltip title={title}>
        <div tabIndex={0} role="button" onKeyDown={handleRejectBtn} onClick={handleRejectBtn}>
          <CircularIntegration
            color="red"
            name={iconName}
            onClick={handleRejectBtn}
            aria-label="circular-progress"
          />
        </div>
      </Tooltip>
      <div>
        <Dialog
          open={open}
          PaperProps={{
            style: {
              backgroundColor: theme === 'dark' ? '#1A2129' : '#FFF',
              boxShadow: 'none',
              width: '1000px',
              height: '300px'
            }
          }}
        >
          <DialogTitle id="alert-dialog-title">{translate('approval.confirmText')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {translate('approval.confirm.reject')}
            </DialogContentText>
          </DialogContent>
          <TextField
            onChange={(e) => handleJustification(e)}
            sx={{ margin: '0 15px' }}
            required
            multiline
            rows={6}
            id="outlined-required"
            label={translate('approval.commentBtnLabel')}
            placeholder={translate('approval.commentPlaceholder')}
            error={isError}
            helperText={isError ? `${translate('approval.summary.errorComment')}` : ''}
          />
          <DialogActions>
            <Button onClick={handleConfirm}> {translate('review.reject')}</Button>
            <Button onClick={() => setOpen(false)} autoFocus>
              {translate('approval.cancel')}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}

RejectIcon.defaultProps = {
  defaultChecked: false,
  disabled: false,
  errorMessage: '',
  label: '',
  name: ''
}

export default RejectIcon
