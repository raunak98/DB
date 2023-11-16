import React, { useEffect } from 'react'
import { Button } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Icon from 'components/icon'
import { findDomain } from 'helpers/strings'
import {
  applicationNamePrefix,
  checkNoGroupApproversValidation,
  checkActiveApproverValidation,
  checkAppManagementValidation,
  checkProvisioningValidation
} from 'helpers/utils'
import useTheme from '../../../hooks/useTheme'
import translate from '../../../translations/translate'
import * as accessApi from '../../../api/accessManagement'
import * as adGroupApi from '../../../api/groupManagement'
import { updateReviewNotificationMessage } from '../../../redux/review/review.action'
import {
  updateShowBigAccessLoader,
  fetchMyAccessGroupItemsStart
} from '../../../redux/myAccess/myAccess.action'
import {
  selectMyAccessGroupItems,
  selectAccessPageSize,
  selectAccessPageNumber
} from '../../../redux/myAccess/myAccess.selector'
// import { selectMyTeamSearchItem } from '../../../redux/myTeam/myTeam.selector'
import { selectprofileDetails } from '../../../redux/profile/profile.selector'

const DeleteAccessIcon = ({ deleteId, dataItemValue }) => {
  const [open, setOpen] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const [isError, setIsError] = React.useState(false)
  const [openValidation, setOpenValidation] = React.useState(false)
  const { theme } = useTheme()
  const selectedGroup = useSelector(selectMyAccessGroupItems)
  const component = localStorage.getItem('component')
  const myTeamSelectedUserId = localStorage.getItem('myTeam-userId')
  const myTeamSelectedUserEmail = localStorage.getItem('myTeam-userEmail')
  const pageSize = useSelector(selectAccessPageSize)
  const pageNumber = useSelector(selectAccessPageNumber)
  const deleteSuccess = translate('removeAccess.success')
  const deleteError = translate('removeAccess.error')
  const requestUniquesness = translate('create.bulkrequest.addRemove.unique.errormessage')
  const dispatch = useDispatch()
  const history = useHistory()
  const [arrayError, setArrayError] = React.useState([])
  const [groupDnValue, setgroupDnValue] = React.useState('')

  const removalNoApproverValidationMessage1 = translate(
    'addGroupMembership.removalNoApproverValidationMessage1'
  )
  const removalNoApproverValidationMessage2 = translate(
    'addGroupMembership.removalNoApproverValidationMessage2'
  )
  const removalNoApproverValidationMessage3 = translate(
    'addGroupMembership.removalNoApproverValidationMessage3'
  )
  const removalNoApproverValidationMessage4 = translate(
    'addGroupMembership.removalNoApproverValidationMessage4'
  )
  const RemoveisActiveApprover1 = translate('addGroupMembership.RemoveisActiveApprover1')
  const RemoveisActiveApprover2 = translate('addGroupMembership.RemoveisActiveApprover2')

  const RemoveisActiveApprover3 = translate('addGroupMembership.RemoveisActiveApprover3')

  const RemoveisActiveApprover4 = translate('addGroupMembership.RemoveisActiveApprover4')
  const removalProvisionValidationMessage1 = translate(
    'addGroupMembership.removalProvisionValidationMessage1'
  )
  const removalProvisionValidationMessage2 = translate(
    'addGroupMembership.removalProvisionValidationMessage2'
  )
  const appManagementValidationMessageRemove = translate(
    'addGroupMembership.appManagementValidationMessageRemove'
  )
  const profileDetails = useSelector(selectprofileDetails)
  let groupResult = []

  const valueFinder = (fieldId) => {
    const targetIndex = groupResult?.findIndex((field) => field.id === fieldId)
    return groupResult[targetIndex]?.value
  }

  const approverValidation = async (approvers) => {
    let isValid = false
    // eslint-disable-next-line no-await-in-loop, no-restricted-syntax
    for (const approver of approvers) {
      if (!isValid) {
        // eslint-disable-next-line no-await-in-loop
        isValid = await checkActiveApproverValidation(approver)
      }
    }
    return isValid
  }

  const handleDelete = async () => {
    const payload = {
      targetName: 'igaContent.cn.keyword',
      targetValue: deleteId,
      accessioIsgMSAGroup: 'All',
      pageSize: 1,
      pageNumber: 0
    }
    const myAccessGroupDetails = await accessApi.getGroupDetails(payload)
    setgroupDnValue(myAccessGroupDetails?.groupDn)
    const errorArray = []
    if (Object.keys(myAccessGroupDetails).length > 0) {
      const isApproverAvailable = checkNoGroupApproversValidation(
        myAccessGroupDetails.dbagIMSApprovers
      )
      if (isApproverAvailable) {
        errorArray.push(
          `${removalNoApproverValidationMessage1} ${myAccessGroupDetails?.groupName} ${removalNoApproverValidationMessage2} ${myAccessGroupDetails?.dbagIMSAuthContact}
           ${removalNoApproverValidationMessage3}  ${myAccessGroupDetails?.dbagIMSAuthContactDelegate} ${removalNoApproverValidationMessage4}`
        )
      } else {
        const isApproverActive = await approverValidation(myAccessGroupDetails.dbagIMSApprovers)
        if (!isApproverActive) {
          errorArray.push(
            `${RemoveisActiveApprover1} ${myAccessGroupDetails?.groupName} ${RemoveisActiveApprover2} ${myAccessGroupDetails?.dbagIMSAuthContact} ${RemoveisActiveApprover3} ${myAccessGroupDetails?.dbagIMSAuthContactDelegate}  ${RemoveisActiveApprover4}`
          )
        }
      }

      if (!checkProvisioningValidation(myAccessGroupDetails?.dbagProvisioningBy)) {
        errorArray.push(
          `${removalProvisionValidationMessage1} ${myAccessGroupDetails?.groupName} ${removalProvisionValidationMessage2}`
        )
      }

      if (checkAppManagementValidation(myAccessGroupDetails.accessioAppRequest)) {
        errorArray.push(
          `${myAccessGroupDetails?.groupName} ${appManagementValidationMessageRemove}`
        )
      }
    }
    if (errorArray.length > 0) {
      setOpenValidation(true)
    } else {
      setOpen(true)
      setIsError(false)
    }

    setArrayError(errorArray)
  }
  const handleClose = () => {
    setOpenValidation(false)
    setOpen(false)
  }
  const handleJustification = (e) => {
    setMessage(e.target.value)
    if (e.target.value === '' && component === 'MyTeam') {
      setIsError(true)
    } else {
      setIsError(false)
    }
  }

  const checkUniqueRequest = async () => {
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
              targetName: 'request.common.category',
              targetValue: 'AD Group'
            }
          },
          {
            operator: 'OR',
            operand: [
              {
                operator: 'AND',
                operand: [
                  {
                    operator: 'OR',
                    operand: [
                      {
                        operator: 'EQUALS',
                        operand: {
                          targetName: 'request.common.operation',
                          targetValue: 'Amend'
                        }
                      },
                      {
                        operator: 'EQUALS',
                        operand: {
                          targetName: 'request.common.operation',
                          targetValue: 'Delete'
                        }
                      }
                    ]
                  },
                  {
                    operator: 'EQUALS',
                    operand: {
                      targetName: 'request.common.groupDN',
                      targetValue: dataItemValue.memberOf
                    }
                  }
                ]
              },
              {
                operator: 'AND',
                operand: [
                  {
                    operator: 'OR',
                    operand: [
                      {
                        operator: 'EQUALS',
                        operand: {
                          targetName: 'request.commomn.operation',
                          targetValue: 'Add Membership'
                        }
                      },
                      {
                        operator: 'EQUALS',
                        operand: {
                          targetName: 'request.commomn.operation',
                          targetValue: 'Remove Membership'
                        }
                      }
                    ]
                  },
                  {
                    operator: 'EQUALS',
                    operand: {
                      targetName: 'request.commomn.groupDN',
                      targetValue: dataItemValue.memberOf
                    }
                  },
                  {
                    operator: 'EQUALS',
                    operand: {
                      targetName: 'request.commomn.accountDN',
                      targetValue: valueFinder('distinguishedName')
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    }
    const resp = adGroupApi.validateUniqueRequest('/v0/governance/checkRequest', payload)
    if (resp?.result?.length > 0) {
      return false
    }
    return true
  }
  // eslint-disable-next-line consistent-return
  const handleConfirm = async () => {
    const selected = selectedGroup?.groupData?.filter((resp) => resp.id === dataItemValue.id)
    if (selected.length > 0) {
      groupResult = accessApi.setGroupRecord(selected[0]?.details)
    }
    if (await checkUniqueRequest()) {
      if (message.trim() === '' && component === 'MyTeam') {
        setIsError(true)
        return false
      }
      setOpen(false)
      setOpenValidation(false)
      // call delete API
      dispatch(updateShowBigAccessLoader(true))
      const payload = {
        common: {
          applicationName: `${applicationNamePrefix}${findDomain(groupDnValue)}`, // aligning with single remove membership as domain is based on groupDn
          category: 'AD Group',
          operation: 'Remove Membership',
          requestorMail: profileDetails?.mail ? profileDetails?.mail : '',
          groupDN: groupDnValue,
          accountDN: `${valueFinder('distinguishedName')}`,
          requestJustification:
            message || `Removing Access form selected group ${dataItemValue.memberOf}`,
          Accessio_Request_No: '',
          recepientMail: dataItemValue.mail ? dataItemValue.mail : ''
        }
      }
      const res = await accessApi.removeAccess(payload)
      if (res?.status === 200 && !res?.data?.Response) {
        dispatch(
          updateReviewNotificationMessage({
            type: 'Success',
            message: deleteSuccess
          })
        )
      } else {
        dispatch(
          updateReviewNotificationMessage({
            type: 'Error',
            message: deleteError
          })
        )
      }
      history.push('/history/requestHistory')
      let fetchDataPayload = {
        pageSize,
        pageNumber
      }
      if (component === 'MyTeam') {
        fetchDataPayload = {
          ...fetchDataPayload,
          mail: myTeamSelectedUserEmail,
          id: myTeamSelectedUserId
        }
      }
      dispatch(fetchMyAccessGroupItemsStart(fetchDataPayload))
      dispatch(updateShowBigAccessLoader(false))
    } else {
      dispatch(
        updateReviewNotificationMessage({
          type: 'Error',
          message: requestUniquesness
        })
      )
      setOpen(false)
    }
  }

  useEffect(() => {
    let selected
    if (selectedGroup && Object.keys(selectedGroup).length !== 0) {
      selected = selectedGroup?.groupData?.filter((resp) => resp.id === deleteId)
      if (selected.length > 0) {
        groupResult = accessApi.setGroupRecord(selected[0]?.details)
      }
    }
  }, [])
  return (
    <>
      <Button
        onClick={() => {
          handleDelete()
        }}
        sx={{
          padding: '3px 0',
          marginLeft: '-16px',
          color: `${theme === 'dark' ? '#FFF' : '#000'}`
        }}
      >
        <Icon name="delete" />
      </Button>
      <div>
        <Dialog
          open={open}
          PaperProps={{
            style: {
              backgroundColor: theme === 'dark' ? '#1A2129' : '#FFF',
              boxShadow: 'none',
              width: '350px'
            }
          }}
        >
          <DialogTitle id="alert-dialog-title">
            {translate('removeAccess.confirmationTitle')}
          </DialogTitle>

          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {translate('removeAccess.confirmationMessage')}
            </DialogContentText>
          </DialogContent>
          {component === 'MyTeam' ? (
            <TextField
              onChange={(e) => handleJustification(e)}
              sx={{ margin: '0 15px' }}
              required
              id="outlined-required"
              label="Required"
              placeholder="Enter Justification"
              inputProps={{ maxLength: 500 }}
              error={isError}
              helperText={isError ? 'Please enter comment' : ''}
            />
          ) : null}

          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              {translate('create.ADAccount.cancel')}
            </Button>
            <Button onClick={handleConfirm}>{translate('create.ADAccount.confirm')}</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={openValidation}
          PaperProps={{
            style: {
              backgroundColor: theme === 'dark' ? '#1A2129' : '#FFF',
              boxShadow: 'none',
              width: '350px'
            }
          }}
        >
          <DialogTitle id="alert-dialog-title" />
          <DialogContent>
            {arrayError &&
              arrayError.length > 0 &&
              arrayError.map((singleGoupError) => (
                <DialogContentText id="alert-dialog-description">
                  <li style={{ paddingBottom: '15px' }}>{singleGoupError}</li>
                </DialogContentText>
              ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              {translate('create.ADAccount.ok')}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}

DeleteAccessIcon.defaultProps = {
  defaultChecked: false,
  disabled: false,
  errorMessage: '',
  label: '',
  name: '',
  onChangeCallback: undefined
}

export default DeleteAccessIcon
