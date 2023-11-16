import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import CircularIntegration from 'components/circularIntegration'
import translate from 'translations/translate'
import { selectMyTeamSearchItem } from '../../../redux/myTeam/myTeam.selector'
import useTheme from '../../../hooks/useTheme'
import * as approvalApi from '../../../api/approvals'
import { updateReviewNotificationMessage } from '../../../redux/review/review.action'
import {
  fetchApprovalsItemsStart,
  updateShowBigLoader
} from '../../../redux/approvals/approvals.action'
import {
  selectApprovalsPageNumber,
  selectApprovalsPaginationKeys,
  selectApprovalsSearchAfterKeyword
} from '../../../redux/approvals/approvals.selector'
import * as justificationApi from '../../../api/justifications'

const RequestInfo = ({ iconName, requestInfoId, title, phaseId, dataItem }) => {
  const [open, setOpen] = React.useState(false)
  const { theme } = useTheme()
  const dispatch = useDispatch()
  const [message, setMessage] = React.useState('')
  const [isError, setIsError] = React.useState(false)
  const successMessage = translate('justification.approver.successMsg')
  const commentErrorMessage = translate('justification.requestInfo.comment.errorMsg')
  const requestErrorMessage = translate('justification.requestInfo.request.errorMsg')
  const pageNumber = useSelector(selectApprovalsPageNumber)
  const paginationKeysArray = useSelector(selectApprovalsPaginationKeys)
  const searchAfterKeywords = useSelector(selectApprovalsSearchAfterKeyword)
  const myTeamDetails = useSelector(selectMyTeamSearchItem)
  const component = localStorage.getItem('component')

  const handleRequestInfoBtn = () => {
    setOpen(true)
  }

  const handleJustification = (e) => {
    setMessage(e.target.value)
    setIsError(e.target.value === '')
  }

  const dispatchRequestInfoData = () => {
    let payload = {}

    if (pageNumber > 0) {
      if (component === 'MyTeam') {
        payload = {
          id: myTeamDetails[0].id,
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
      if (component === 'MyTeam') {
        payload = {
          id: myTeamDetails[0].id,
          recipientMail: myTeamDetails[0].email
        }
      }
      dispatch(fetchApprovalsItemsStart(component === 'MyTeam' ? payload : null))
    }
  }

  const handleConfirm = () => {
    if (message.trim() === '') {
      setIsError(true)
    } else {
      setOpen(false)
      dispatch(updateShowBigLoader(true))
      const payloadComments = {
        comment: message
      }
      approvalApi
        .approvalComment('commentReq', requestInfoId, payloadComments, phaseId)
        .then((res) => {
          if (res?.status === 200) {
            dispatch(
              updateReviewNotificationMessage({
                type: 'Success',
                message: successMessage
              })
            )
            const commonDetails = dataItem.common
            commonDetails.pendingJustification = true
            let requestorIDNew = dataItem.requestorID
            if (dataItem.requestorID) {
              if (dataItem?.requestorID.indexOf('managed/user') > -1) {
                requestorIDNew = dataItem?.requestorID.replace('managed/user/', '')
              } else {
                requestorIDNew = dataItem.requestorID
              }
            }
            const payload = {
              requestID: dataItem.requestID,
              requestorID: requestorIDNew,
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
              } else if (resp?.response?.status !== 200) {
                dispatch(
                  updateReviewNotificationMessage({
                    type: 'error',
                    message: requestErrorMessage
                  })
                )
              }
              dispatchRequestInfoData()
            })
          } else if (res?.response?.status !== 200) {
            dispatch(
              updateReviewNotificationMessage({
                type: 'error',
                message: commentErrorMessage
              })
            )
            dispatchRequestInfoData()
          }
        })
        .catch((error) => {
          console.error(error)
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
      <Tooltip title={title}>
        <div
          tabIndex={0}
          role="button"
          onKeyDown={handleRequestInfoBtn}
          onClick={handleRequestInfoBtn}
        >
          <CircularIntegration
            name={iconName}
            onClick={handleRequestInfoBtn}
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
          <DialogTitle id="alert-dialog-title">{translate('justification.title')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {translate('justification.submit.request')}
            </DialogContentText>
          </DialogContent>
          <TextField
            onChange={(e) => handleJustification(e)}
            sx={{ margin: '0 15px' }}
            required
            multiline
            rows={6}
            id="outlined-required"
            label={translate('justification.requestLabel')}
            placeholder={translate('justification.requestPlaceholder')}
            error={isError}
            helperText={isError ? translate('justification.error.message') : ''}
          />
          <DialogActions>
            <Button onClick={handleConfirm}>{translate('justification.requestBtn')}</Button>
            <Button onClick={() => setOpen(false)} autoFocus>
              {translate('approval.cancel')}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}

export default RequestInfo
