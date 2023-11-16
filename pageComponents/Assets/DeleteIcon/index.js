import React, { useEffect } from 'react'
import { Tooltip, Button } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { findDomain } from 'helpers/strings'
import Icon from 'components/icon'
import {
  getPersonalAssetsByMail,
  applicationNamePrefix,
  checkModifiedValidation
} from 'helpers/utils'
import useTheme from '../../../hooks/useTheme'
import translate from '../../../translations/translate'
import * as accountApi from '../../../api/accountManagement'
import * as groupApi from '../../../api/groupManagement'
import * as adminApi from '../../../api/admin'
import { updateReviewNotificationMessage } from '../../../redux/review/review.action'
import {
  updateShowBigLoader,
  fetchMyAssetsItemsStart,
  fetchGroupAssetsItemsStart,
  fetchOwnedGroupAssetsItemsStart,
  updateMyAssetsItemsStart
} from '../../../redux/myAssets/myAssets.action'
import {
  selectMyAssetsItems,
  selectAssetsPageSize,
  selectGroupAssetsItems,
  selectAssetsGroupPageSize,
  selectAssetsPageNumber,
  selectAssetsGroupPageNumber,
  selectOwnedGroupAssetsItems
} from '../../../redux/myAssets/myAssets.selector'
import { selectMyTeamSearchItem } from '../../../redux/myTeam/myTeam.selector'
import { selectprofileDetails } from '../../../redux/profile/profile.selector'

const DeleteIcon = ({ deleteId, title, type, isDisabled }) => {
  const [open, setOpen] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const [error, setError] = React.useState('')
  const [groupResult, setGroupResult] = React.useState([])
  const { theme } = useTheme()
  const results = useSelector(selectMyAssetsItems)
  const pageSize = useSelector(selectAssetsPageSize)
  const pageNumber = useSelector(selectAssetsPageNumber)
  const pageSizeGroup = useSelector(selectAssetsGroupPageSize)
  const pageNumberGroup = useSelector(selectAssetsGroupPageNumber)
  const myTeamAssetProfile = useSelector(selectMyTeamSearchItem)
  const profileDetails = useSelector(selectprofileDetails)
  const uinqueReqError = translate('request.unique.errormessage')
  const blockedReqError = translate('request.blockedModifyDelete.errormessage')
  const deleteSuccess = translate('delete.success')
  const deleteGroupSuccess = translate('request.group.delete.message')
  const mandatoryErrorMessage = translate('form.mandatoryErrorMessage')
  const deleteError = translate('delete.error')
  const dispatch = useDispatch()
  const history = useHistory()
  const selectedGroup = useSelector(selectGroupAssetsItems)
  const indirectlyOwnedGroupItems = useSelector(selectOwnedGroupAssetsItems)
  const cannotDeleteGroup = translate('deleteIcon.modifyGroup.cannotDelete')
  const [iOGRforDelete, setIndirectlyOwnedGroupReponse] = React.useState(false)

  const valueFinder = (fieldId) => {
    const targetIndex = groupResult?.findIndex((field) => field.id === fieldId)
    return groupResult[targetIndex]?.value
  }
  const valueFinderForIog = (fieldId) => {
    const targetIndex = iOGRforDelete?.findIndex((field) => field.id === fieldId)
    return iOGRforDelete[targetIndex]?.value
  }
  useEffect(() => {
    let selected
    if (selectedGroup && Object.keys(selectedGroup).length !== 0 && ['ModifyGroup', 'GroupAdmin']) {
      selected = selectedGroup?.groupData?.filter((resp) => resp.id === deleteId)
      if (selected.length) {
        groupApi.setGroupRecord(selected[0]?.groupDetails).then((res) => {
          setGroupResult(res)
        })
      }
    }
    if (
      indirectlyOwnedGroupItems &&
      Object.keys(indirectlyOwnedGroupItems).length !== 0 &&
      type === 'IndirectlyOwnedGroup'
    ) {
      selected = indirectlyOwnedGroupItems?.groupData?.filter((resp) => resp.cn === deleteId?.cn)
      if (selected.length) {
        groupApi.setIndirectlyOwnedGroupRecord(selected[0]?.groupDetails).then((res) => {
          setGroupResult(res)
        })
      }
    }
  }, [])

  const checkIfDeleteBlocked = async () => {
    dispatch(updateShowBigLoader(true))
    const modifiedByValue = groupResult.filter((attribute) => attribute.id === 'dbagModifiedBy')[0]
      ?.value
    dispatch(updateShowBigLoader(false))
    if (modifiedByValue === 'Descoped' || !checkModifiedValidation(modifiedByValue)) {
      return true
    }
    return false
  }

  const checkUniqueRequest = async () => {
    dispatch(updateShowBigLoader(true))
    const selectedObj = results?.assetsData?.filter((response) => response.id === deleteId)
    console.log('groupResult', groupResult)
    const payload = ['GroupAdmin', 'IndirectlyOwnedGroup', 'ModifyGroup'].includes(type)
      ? {
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
                  targetValue: `${valueFinder('distinguishedName')}`
                }
              }
            ]
          }
        }
      : {
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
                  targetName: 'request.common.category',
                  targetValue: 'AD Account'
                }
              },
              {
                operator: 'EQUALS',
                operand: {
                  targetName: 'request.common.applicationName',
                  targetValue: `${applicationNamePrefix}DBG`
                }
              },
              {
                operator: 'OR',
                operand: [
                  {
                    operator: 'EQUALS',
                    operand: {
                      targetName: 'request.common.accountDetails.sAMAccountName',
                      targetValue: selectedObj[0]?.sAMAccountName
                        ? selectedObj[0]?.sAMAccountName
                        : ''
                    }
                  },
                  {
                    operator: 'EQUALS',
                    operand: {
                      targetName: 'request.common.sAMAccountName',
                      targetValue: selectedObj[0]?.sAMAccountName
                        ? selectedObj[0]?.sAMAccountName
                        : ''
                    }
                  }
                ]
              }
            ]
          }
        }
    const resp = await accountApi.validateUniqueRequest(payload)
    dispatch(updateShowBigLoader(false))
    if (resp?.result?.length > 0) {
      return false
    }
    return true
  }

  const handleDelete = async () => {
    if (['ModifyGroup'].includes(type) && (await checkIfDeleteBlocked())) {
      dispatch(
        updateReviewNotificationMessage({
          type: 'Error',
          message: blockedReqError
        })
      )
    } else if (await checkUniqueRequest()) {
      if (['ModifyGroup', 'GroupAdmin'].includes(type)) {
        // TODO : Remove below code if working
        // const payload = {
        //   searchItem: deleteId,
        //   pageSize: 10
        // }
        // await groupApi.searchGroupRecord(payload).then((res) => {
        //   setGroupResult(res)
        // })
        setOpen(true)
      } else if (type === 'IndirectlyOwnedGroup') {
        const payload = {
          searchValue: `${valueFinder('groupNameText')}`,
          pageSize: 100,
          pageNumber: 0
        }
        accountApi.getOptions(`/v0/governance/searchGroups`, payload).then((res) => {
          if (res.hits.hits.length > 0) {
            const element = res.hits.hits[0]
            groupApi.setGroupRecord(element).then((resp1) => {
              setIndirectlyOwnedGroupReponse(resp1)
            })
            if (element?.igaContent?.member && element.igaContent?.member?.length > 0) {
              dispatch(
                updateReviewNotificationMessage({
                  type: 'Error',
                  message: cannotDeleteGroup
                })
              )
            } else {
              setOpen(true)
            }
          } else if (res.hits.hits.length === 0) {
            dispatch(
              updateReviewNotificationMessage({
                type: 'Error',
                message: cannotDeleteGroup
              })
            )
          }
        })
      } else {
        setOpen(true)
      }
    } else {
      dispatch(
        updateReviewNotificationMessage({
          type: 'Error',
          message: uinqueReqError
        })
      )
    }
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleJustification = (e) => {
    setMessage(e.target.value)
    setError('')
  }

  const callAccountAdminAPI = () => {
    const searchKey = localStorage.getItem('searchValue')
    // setSearchKeyword(searchKey)
    const payload = {
      sAMAccountName: searchKey,
      pageSize,
      pageNumber
    }
    adminApi
      .searchAccounts(payload)
      .then((res) => {
        if (res) {
          dispatch(updateMyAssetsItemsStart({ myAssetsItems: res }))
        }
        history.push('/history/requestHistory')
      })
      .catch((err) => console.error(err))
  }
  const getApplicationName = () => {
    if (['ModifyGroup', 'GroupAdmin'].includes(type)) {
      return `${applicationNamePrefix}${findDomain(valueFinder('distinguishedName'))}`
    }
    if (type === 'IndirectlyOwnedGroup') {
      return `${applicationNamePrefix}${findDomain(valueFinderForIog('distinguishedName'))}`
    }
    return deleteId?.applicationName
  }
  const handleConfirm = () => {
    if (message !== '') {
      let selectedObj
      if (results && Object.keys(results).length !== 0) {
        selectedObj = results?.assetsData?.filter((response) => response.id === deleteId)
      }
      const groupDetailsObject = {}

      if (['ModifyGroup', 'GroupAdmin'].includes(type)) {
        groupDetailsObject.cn = `${valueFinder('samAccount')}`
        groupDetailsObject.displayName = `${valueFinder('samAccount')}`
      }
      if (type === 'IndirectlyOwnedGroup') {
        groupDetailsObject.cn = `${valueFinderForIog('samAccount')}`
        groupDetailsObject.displayName = `${valueFinderForIog('samAccount')}`
      }

      setOpen(false)
      // call delete API
      dispatch(updateShowBigLoader(true))
      const payload = ['GroupAdmin', 'IndirectlyOwnedGroup', 'ModifyGroup'].includes(type)
        ? {
            common: {
              applicationName: getApplicationName(),
              requestorMail: profileDetails?.mail ? profileDetails?.mail : '',
              category: 'AD Group',
              operation: 'Delete',
              groupDN: `${valueFinder('dn')}`,
              requestJustification: message || '',
              groupDetails: groupDetailsObject
            }
          }
        : {
            common: {
              applicationName: `${applicationNamePrefix}DBG`,
              accountName: selectedObj[0].sAMAccountName ? selectedObj[0].sAMAccountName : '',
              operation: 'Delete',
              category: 'AD Account',
              recepientMail: selectedObj[0].recepientMail ? selectedObj[0].recepientMail : '',
              requestorMail: profileDetails?.mail ? profileDetails?.mail : '',
              requestJustification: message || '',
              sAMAccountName: selectedObj[0].sAMAccountName ? selectedObj[0].sAMAccountName : '',
              accountType: selectedObj[0].category ? selectedObj[0].category : '',
              accountDescription:
                typeof selectedObj[0].description === 'string' ? selectedObj[0].description : '',
              rFirstName: profileDetails?.givenName ? profileDetails?.givenName : '',
              rLastName: profileDetails?.sn ? profileDetails?.sn : ''
            }
          }

      if (['ModifyGroup', 'IndirectlyOwnedGroup', 'GroupAdmin'].includes(type)) {
        groupApi.deleteAdGroup(payload).then((res) => {
          if (res.status === 200) {
            dispatch(
              updateReviewNotificationMessage({
                type: 'Success',
                message: deleteGroupSuccess
              })
            )
            history.push('/history/requestHistory')
          } else {
            dispatch(
              updateReviewNotificationMessage({
                type: 'Error',
                message: deleteError
              })
            )
          }
          if (type === 'ModifyGroup') {
            const groupPayload = {
              pageSize: pageSizeGroup,
              userEmail: `${profileDetails?.mail}`,
              pageNumber: pageNumberGroup
            }
            dispatch(fetchGroupAssetsItemsStart(groupPayload))
          } else {
            const indirectlyOwnedGroupPayload = {
              userEmail: `${profileDetails.mail}`
            }
            dispatch(fetchOwnedGroupAssetsItemsStart(indirectlyOwnedGroupPayload))
          }

          dispatch(updateShowBigLoader(false))
        })
      } else {
        accountApi.deleteAdAccount(payload).then((res) => {
          /* eslint no-underscore-dangle: 0 */
          const userId = type === 'MyTeam' ? myTeamAssetProfile[0].id : profileDetails?._id
          if (res.status === 200) {
            dispatch(
              updateReviewNotificationMessage({
                type: 'Success',
                message: deleteSuccess
              })
            )
            if (type === 'Modify' || type === 'MyTeam') {
              history.push('/history/requestHistory')
              dispatch(
                fetchMyAssetsItemsStart(getPersonalAssetsByMail(userId, pageSize, pageNumber)) // TODO : check the pagination value.
              )
            } else if (type === 'AccountAdmin') {
              callAccountAdminAPI()
            }

            dispatch(updateShowBigLoader(false))
          } else {
            dispatch(
              updateReviewNotificationMessage({
                type: 'Error',
                message: deleteError
              })
            )
            if (type === 'AccountAdmin') {
              callAccountAdminAPI()
            } else {
              dispatch(
                fetchMyAssetsItemsStart(getPersonalAssetsByMail(userId, pageSize, pageNumber)) // TODO : check the pagination value.
              )
            }

            dispatch(updateShowBigLoader(false))
          }
        })
      }
    } else {
      setError(mandatoryErrorMessage)
    }
  }

  return (
    <>
      {isDisabled ? (
        // <span style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}>
        <Tooltip title={type === 'ModifyGroup' ? cannotDeleteGroup : ''}>
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
            <Icon
              name="delete"
              onClick={() => {
                handleDelete()
              }}
            />
          </Button>
        </Tooltip>
      ) : (
        // </span>
        <Tooltip title={title}>
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
            <Icon
              onClick={() => {
                handleDelete()
              }}
              name="delete"
            />
          </Button>
        </Tooltip>
      )}

      <div>
        <Dialog
          open={open}
          PaperProps={{
            style: {
              backgroundColor: theme === 'dark' ? '#1A2129' : '#FFF',
              boxShadow: 'none',
              width: '300px'
            }
          }}
        >
          <DialogTitle id="alert-dialog-title">{translate('delete.confirmationTitle')}</DialogTitle>

          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {translate('delete.confirmationMessage')}
            </DialogContentText>
          </DialogContent>
          <TextField
            error={error !== ''}
            onChange={(e) => handleJustification(e)}
            sx={{ margin: '0 15px' }}
            required
            id="outlined-required"
            label={translate('delete.title')}
            placeholder={translate('delete.placeHolder')}
            inputProps={{ maxLength: 500 }}
          />
          <div style={{ color: '#F00', paddingLeft: '15px', fontSize: '12px' }}>{error}</div>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              {translate('create.ADAccount.cancel')}
            </Button>
            <Button onClick={handleConfirm}>{translate('create.ADAccount.confirm')}</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}

DeleteIcon.defaultProps = {
  defaultChecked: false,
  disabled: false,
  errorMessage: '',
  label: '',
  name: '',
  onChangeCallback: undefined
}

export default DeleteIcon
