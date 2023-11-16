import React from 'react'
import { Tooltip, Button } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import { useHistory } from 'react-router-dom'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { useDispatch } from 'react-redux'
import useTheme from '../../../hooks/useTheme'
import translate from '../../../translations/translate'
import * as accountApi from '../../../api/accountManagement'
import * as draftApi from '../../../api/drafts'
import { updateReviewNotificationMessage } from '../../../redux/review/review.action'
import {
  updateDraftsShowSmallLoader,
  fetchDraftsItemsStart
} from '../../../redux/drafts/drafts.action'
import { checkUniqueRequestForMembership } from '../../../helpers/utils'
import * as adGroupApi from '../../../api/groupManagement'

const SubmitButton = ({ title, submitId }) => {
  const [open, setOpen] = React.useState(false)
  const { theme } = useTheme()
  const dispatch = useDispatch()
  const history = useHistory()
  const samErrorMessage = translate('create.ADAccount.samErrorMessage')
  const submitDraftSuccessMsg = translate('drafts.submit.success')
  const submitDraftErrorMsg = translate('draft.error.message')
  const submitGroupDraftSuccessMsg = translate('drafts.submit.success')
  const submitGroupDraftErrorMsg = translate('draft.error.message')
  const uniqueErrorMessage = translate('request.unique.errormessage')
  const handleSubmit = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const dispatchDraftsData = () => {
    dispatch(
      fetchDraftsItemsStart({
        saKeyWord: null,
        saprimaryKey: null
      })
    )
    // }
  }
  const checkUniqueRequest = async (distinguishedName) => {
    const payload = {
      targetFilter: {
        operator: 'AND',
        operand: [
          {
            operator: 'EQUALS',
            operand: {
              targetName: 'decision.status',
              targetValue: 'in-progress'
            }
          },
          {
            operator: 'EQUALS',
            operand: {
              targetName: 'request.common.isDraft',
              targetValue: false
            }
          },
          {
            operator: 'EQUALS',
            operand: {
              targetName: 'request.common.operation',
              targetValue: 'Create'
            }
          },
          {
            operator: 'EQUALS',
            operand: {
              targetName: 'request.common.category',
              targetValue: 'AD Group'
            }
          },
          {
            operator: 'OR',
            operand: [
              {
                operator: 'EQUALS',
                operand: {
                  targetName: 'request.common.groupDetails.distinguishedName',
                  targetValue: `${distinguishedName}`
                }
              },
              {
                operator: 'EQUALS',
                operand: {
                  targetName: 'request.common.distinguishedName',
                  targetValue: `${distinguishedName}`
                }
              }
            ]
          }
        ]
      }
    }
    const res = await adGroupApi.validateUniqueRequest('/v0/governance/checkRequest', payload)
    if (res?.result?.length > 0) {
      return false
    }
    return true
  }
  const SubmitDraft = (responseItem) => {
    draftApi
      .submitDraft(responseItem, submitId)
      .then((response) => {
        if (response.status === 200) {
          dispatch(
            updateReviewNotificationMessage({
              type: 'Success',
              message: submitDraftSuccessMsg
            })
          )
          dispatchDraftsData()
          history.push('/history/requestHistory')
        } else {
          dispatch(
            updateReviewNotificationMessage({
              type: 'Error',
              message: submitDraftErrorMsg
            })
          )
          dispatchDraftsData()
        }
      })
      .catch(() => {
        dispatch(
          updateReviewNotificationMessage({
            type: 'Error',
            message: submitDraftErrorMsg
          })
        )
        dispatchDraftsData()
      })
  }

  const submitGroupDraft = async (responseItem, distinguishedName) => {
    const uniqueFlag = await checkUniqueRequest(distinguishedName)
    if (uniqueFlag) {
      draftApi
        .submitDraft(responseItem, submitId)
        .then((res) => {
          if (res?.status === 200) {
            dispatch(
              updateReviewNotificationMessage({
                type: 'Success',
                message: submitGroupDraftSuccessMsg
              })
            )
            dispatchDraftsData()
            history.push('/history/requestHistory')
          } else {
            dispatch(
              updateReviewNotificationMessage({
                type: 'Error',
                message: submitGroupDraftErrorMsg
              })
            )
            dispatchDraftsData()
          }
        })
        .catch(() => {
          dispatch(
            updateReviewNotificationMessage({
              type: 'Error',
              message: submitGroupDraftErrorMsg
            })
          )
          dispatchDraftsData()
        })
    } else {
      dispatch(
        updateReviewNotificationMessage({
          type: 'Error',
          message: uniqueErrorMessage
        })
      )
    }
  }

  const submitDraftMembership = async (groupDN, accountDN, payload) => {
    let uniqueFlag = true
    if (accountDN) {
      uniqueFlag = await checkUniqueRequestForMembership(groupDN, {
        accountDN
      })
    }
    if (uniqueFlag) {
      draftApi
        .submitDraft(payload, submitId)
        .then((res) => {
          if (res?.status === 200) {
            dispatch(
              updateReviewNotificationMessage({
                type: 'Success',
                message: submitDraftSuccessMsg
              })
            )
            dispatchDraftsData()
            history.push('/history/requestHistory')
          } else {
            dispatch(
              updateReviewNotificationMessage({
                type: 'Error',
                message: submitDraftErrorMsg
              })
            )
            dispatchDraftsData()
          }
        })
        .catch((error) => {
          dispatch(
            updateReviewNotificationMessage({
              type: 'Error',
              message: error
            })
          )
          dispatchDraftsData()
        })
    } else {
      dispatch(
        updateReviewNotificationMessage({
          type: 'Error',
          message: uniqueErrorMessage
        })
      )
      dispatchDraftsData()
    }
  }

  const handleConfirm = () => {
    setOpen(false)
    dispatch(updateDraftsShowSmallLoader(true))
    draftApi.getDraftRequestDetailsById(submitId).then((responseData) => {
      let commonItem = {}
      let responseItem = {}
      commonItem = { ...responseData.common, isDraft: false }
      responseItem = { ...responseData, common: commonItem }
      if (responseItem?.common?.groupDetails?.distinguishedName) {
        submitGroupDraft(responseItem, responseItem?.common?.groupDetails?.distinguishedName)
      }
      if (
        responseItem?.common?.accountDetails?.sAMAccountName ||
        responseItem?.common?.sAMAccountName
      ) {
        const payload = {
          targetName: 'sAMAccountName',
          targetValue: responseItem?.common?.accountDetails?.sAMAccountName
            ? responseItem?.common?.accountDetails?.sAMAccountName
            : responseItem?.common?.sAMAccountName,
          pageSize: 10,
          pageNumber: 0
        }
        if (responseItem?.common?.operation !== 'Amend') {
          accountApi.validateSAMAccount('/v0/account/accountDetails', payload).then((res) => {
            if (!res || res?.hits?.hits?.length > 0) {
              dispatch(updateDraftsShowSmallLoader(false))
              dispatch(
                updateReviewNotificationMessage({
                  type: 'Error',
                  message: samErrorMessage
                })
              )
              dispatchDraftsData()
            } else {
              SubmitDraft(responseItem)
            }
          })
        } else {
          SubmitDraft(responseItem)
        }
      }
      if (responseItem?.common?.groupDN) {
        let payload = {}
        if (responseItem?.common?.accountDN) {
          payload = {
            common: {
              applicationName: responseItem?.common?.applicationName,
              category: responseItem?.common?.category,
              operation: responseItem?.common?.operation,
              requestorMail: responseItem?.common?.requestorMail,
              groupDN: responseItem?.common?.groupDN,
              accountDN: responseItem?.common?.accountDN,
              isDraft: false,
              requestJustification: responseItem?.common?.requestJustification,
              Accessio_Request_No: '',
              recepientMail: responseItem?.common?.recepientMail
            }
          }
        }
        if (responseItem?.common?.serverDN) {
          payload = {
            common: {
              applicationName: responseItem?.common?.applicationName,
              category: responseItem?.common?.category,
              operation: responseItem?.common?.operation,
              requestorMail: responseItem?.common?.requestorMail,
              groupDN: responseItem?.common?.groupDN,
              serverDN: responseItem?.common?.serverDN,
              isDraft: false,
              requestJustification: responseItem?.common?.requestJustification,
              Accessio_Request_No: '',
              recepientMail: responseItem?.common?.recepientMail
            }
          }
        }
        if (responseItem?.common?.serverDN || responseItem?.common?.accountDN) {
          submitDraftMembership(
            responseItem?.common?.groupDN,
            responseItem?.common?.accountDN,
            payload
          )
        }
      }
    })
  }

  return (
    <>
      <Tooltip title={title}>
        <Button
          onClick={handleSubmit}
          sx={{
            padding: '3px 0',
            marginLeft: '-6px',
            color: `${theme === 'dark' ? '#FFF' : '#000'}`
          }}
        >
          <PlayArrowIcon onClick={handleSubmit} name="Submit Draft" />
        </Button>
      </Tooltip>
      <div>
        <Dialog
          open={open}
          PaperProps={{
            style: {
              backgroundColor: theme === 'dark' ? '#1A2129' : '#FFF',
              boxShadow: 'none'
            }
          }}
        >
          <DialogTitle id="alert-dialog-title">{translate('submit.confirmationTitle')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {translate('submit.confirmationMessage')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirm}>{translate('create.ADAccount.confirm')}</Button>
            <Button onClick={handleClose} autoFocus>
              {translate('create.ADAccount.cancel')}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}

SubmitButton.defaultProps = {
  defaultChecked: false,
  disabled: false,
  errorMessage: '',
  label: '',
  name: '',
  onChangeCallback: undefined
}

export default SubmitButton
