import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Tooltip, Button } from '@mui/material'
import Icon from 'components/icon'
import translate from 'translations/translate'
import { applicationNamePrefix, checkModifiedValidation } from 'helpers/utils'
import useTheme from '../../../hooks/useTheme'
import * as accountApi from '../../../api/accountManagement'
import {
  selectMyAssetsItems,
  selectGroupAssetsItems,
  selectOwnedGroupAssetsItems
} from '../../../redux/myAssets/myAssets.selector'
import { updateShowBigLoader } from '../../../redux/myAssets/myAssets.action'
import { updateReviewNotificationMessage } from '../../../redux/review/review.action'

const RedirectButton = ({
  title,
  dataItem,
  columnMetaData,
  name,
  type,
  isDisabled,
  toolTipTextAccountType
}) => {
  const { theme } = useTheme()
  const results = useSelector(selectMyAssetsItems)
  const selectedGroup = useSelector(selectGroupAssetsItems)
  const indirectlyOwnedGroupItems = useSelector(selectOwnedGroupAssetsItems)
  const history = useHistory()
  const dispatch = useDispatch()
  const uniqueReqError = translate('request.unique.errormessage')
  const blockedReqError = translate('request.blockedModifyDelete.errormessage')
  const actionNotAllowed = translate('action.notAllowed.message')
  // const viewGroupError = translate('viewDetails.group.error') // commented here to add below in the code later
  const editGroupError = translate('editIcon.group.error')
  const actualTitle = translate(title)

  const checkUniqueRequest = async () => {
    dispatch(updateShowBigLoader(true))
    const summaryDetails = results?.assetsData?.filter((response) => response.id === dataItem.id)
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
                  targetValue: summaryDetails[0]?.sAMAccountName
                }
              },
              {
                operator: 'EQUALS',
                operand: {
                  targetName: 'request.common.sAMAccountName',
                  targetValue: summaryDetails[0]?.sAMAccountName
                }
              }
            ]
          }
        ]
      }
    }
    const resp = await accountApi.validateUniqueRequest(payload)
    if (resp?.result?.length > 0) {
      dispatch(updateShowBigLoader(false))
      return false
    }
    return true
  }
  const checkGroupUniqueRequest = async () => {
    dispatch(updateShowBigLoader(true))
    let summaryDetails = {}
    let distinguishedName = ''
    if (selectedGroup && Object.keys(selectedGroup).length !== 0 && type === 'ModifyGroup') {
      summaryDetails = selectedGroup?.groupData?.filter((resp) => resp.id === dataItem.id)
      distinguishedName =
        // eslint-disable-next-line no-underscore-dangle
        summaryDetails[0]?.groupDetails?._source?.igaContent?.distinguishedName
    } else if (
      indirectlyOwnedGroupItems &&
      Object.keys(indirectlyOwnedGroupItems).length !== 0 &&
      type === 'IndirectlyOwnedGroup'
    ) {
      summaryDetails = indirectlyOwnedGroupItems?.groupData?.filter(
        (resp) => resp?.cn === dataItem?.cn
      )
      distinguishedName = summaryDetails[0]?.groupDetails?.dn
    }

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
              targetValue: distinguishedName
            }
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

  const handleEdit = async () => {
    localStorage.removeItem('requestHistoryId')
    localStorage.removeItem('approvalId')
    localStorage.removeItem('approvalHistoryId')
    if (type === 'Drafts') {
      switch (dataItem?.requestType.trim()) {
        case 'CREATE ACCOUNT':
          history.push(`/drafts/${dataItem.id}`)
          break
        case 'MODIFY ACCOUNT':
          history.push(`/my-asset/modify?id=${dataItem.id}`)
          break
        case 'CREATE GROUP':
          history.push(`/drafts/adGroupManagement/${dataItem.id}`)
          break
        case 'MODIFY GROUP':
          history.push(`/my-asset/modify/group?id=${dataItem.id}`)
          break
        case 'ENTITLEMENT GRANT':
          if (dataItem?.accountDN) {
            history.push(`/requests/request/adGroupMembership/addOrRemove?id=${dataItem.id}`)
          } else {
            history.push(`/requests/request/adGroupMembership/addOrRemoveServer?id=${dataItem.id}`)
          }

          break
        default:
          break
      }
    } else if (['Request History', 'assetGrpReqHistory', 'ServiceDeskAdmin'].includes(type)) {
      localStorage.setItem('requestHistoryId', dataItem.id)
      history.push(`/history/requestHistory/request`)
    } else if (type === 'Approvals') {
      localStorage.setItem('approvalId', dataItem.id)
      history.push(`/tasks/approvals/summary`)
    } else if (type === 'Approval History') {
      localStorage.setItem('approvalHistoryId', dataItem.id)
      history.push(`/history/approvalHistory/approvalSummary`)
    } else if (type === 'ModifyGroup' || type === 'GroupAdmin') {
      /* eslint no-underscore-dangle: 0 */
      const modifiedByValue = dataItem?.groupDetails?._source?.igaContent?.object?.dbagModifiedBy
      const isModifyBlocked =
        modifiedByValue === 'Descoped' || !checkModifiedValidation(modifiedByValue)
      const uniqueRequest = await checkGroupUniqueRequest()
      if (isModifyBlocked) {
        dispatch(
          updateReviewNotificationMessage({
            type: 'Error',
            message: blockedReqError
          })
        )
      } else if (uniqueRequest) {
        history.push(`/my-asset/modify/group?id=${dataItem.id}`)
      } else {
        dispatch(
          updateReviewNotificationMessage({
            type: 'Error',
            message: uniqueReqError
          })
        )
      }
    } else if (type === 'IndirectlyOwnedGroup') {
      const summaryDetails = indirectlyOwnedGroupItems?.groupData?.filter(
        (resp) => resp?.cn === dataItem?.cn
      )
      const groupNameText = summaryDetails[0]?.groupDetails?.groupName
      const payload = {
        searchValue: groupNameText,
        pageSize: 100,
        pageNumber: 0
      }
      const uniqueRequest = await checkGroupUniqueRequest()
      let dataForEdit = ''
      const indirectlyOwnedGroupId = await accountApi
        .getOptions(`/v0/governance/searchGroups`, payload)
        .then((res) => {
          if (res.hits.hits.length > 0) {
            const element = res.hits.hits[0]
            dataForEdit = element
            // eslint-disable-next-line no-underscore-dangle
            return element?._source?.id
          }
          dispatch(
            updateReviewNotificationMessage({
              type: 'Error',
              message: editGroupError
            })
          )

          return ''
        })
        .catch((err) => console.error(err))
      if (uniqueRequest && indirectlyOwnedGroupId.length > 0) {
        history.push({
          pathname: `/my-asset/modify/indirectlyOwnedModifyGroup`,
          search: `?id=${indirectlyOwnedGroupId}`,
          state: { dataItem: dataForEdit }
        })
      } else {
        dispatch(
          updateReviewNotificationMessage({
            type: 'Error',
            message: uniqueReqError
          })
        )
      }
    } else {
      const uniqueRequest = await checkUniqueRequest()
      if (uniqueRequest) {
        history.push(`/my-asset/modify?id=${dataItem.id}`)
      } else {
        dispatch(
          updateReviewNotificationMessage({
            type: 'Error',
            message: uniqueReqError
          })
        )
      }
    }
  }
  const getTooltipData = () => (isDisabled && isDisabled ? actionNotAllowed : actualTitle)
  const getViewDetails = () => {
    if (localStorage.getItem('component') === 'IndirectlyOwnedGroup') {
      return (
        <Link
          to={`${columnMetaData.properties.redirectTo}?id=${
            dataItem[columnMetaData.properties.fieldForPath]
          }`}
          style={{
            textDecoration: 'none',
            display: 'flex',
            justifyContent: 'center',
            marginLeft: '1px'
          }}
        >
          <Icon name={name} />
        </Link>
      )
    }
    return (
      <Link
        to={`${columnMetaData.properties.redirectTo}?id=${
          dataItem[columnMetaData.properties.fieldForPath]
        }`}
        style={{
          textDecoration: 'none',
          display: 'flex',
          justifyContent: 'center',
          marginLeft: '1px'
        }}
      >
        <Icon name={name} />
      </Link>
    )
  }
  return (
    <>
      {[
        'Modify',
        'MyTeam',
        'Drafts',
        'Request History',
        'ModifyGroup',
        'Approvals',
        'Approval History',
        'IndirectlyOwnedGroup',
        'ServiceDeskAdmin',
        'assetGrpReqHistory',
        'GroupAdmin',
        'AccountAdmin'
      ].indexOf(type) < 0 ? (
        <Tooltip title={translate(title)}>{getViewDetails()}</Tooltip>
      ) : (
        <Tooltip
          title={
            toolTipTextAccountType
              ? translate('action.notAllowedAccountType.message')
              : getTooltipData()
          }
        >
          <Button
            onClick={() => {
              if (!isDisabled) {
                handleEdit()
              }
            }}
            sx={{
              padding: '3px 0',
              marginLeft: '1px',
              color: `${theme === 'dark' ? '#FFF' : '#000'}`
            }}
          >
            <Icon name={name} disabled={isDisabled && isDisabled} />
          </Button>
        </Tooltip>
      )}
    </>
  )
}

RedirectButton.defaultProps = {
  defaultChecked: false,
  disabled: false,
  errorMessage: '',
  label: '',
  name: '',
  onChangeCallback: undefined
}

export default RedirectButton
