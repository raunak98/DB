import React from 'react'
import { useSelector } from 'react-redux'

import { Link } from 'react-router-dom'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { grey } from '@mui/material/colors'
import { Tooltip } from '@mui/material'
import Fab from '@mui/material/Fab'
import translate from 'translations/translate'
import Icon from 'components/icon'
import ToggleIcon from '../ToggleIcon'
import PopupIcon from '../PopupIcon'
import ActionButtons from '../ActionButtons'
import ApproveIcon from '../../Approvals/ApproveIcon'
import RejectIcon from '../../Approvals/RejectIcon'
import RequestInfo from '../../Approvals/RequestInfo'
import RedirectButton from '../../Assets/RedirectButton'
import ReviewDropbox from '../Dropbox'
import DeleteIcon from '../../Assets/DeleteIcon'
import DeleteAccessIcon from '../../Access/DeleteAccessIcon'
import ReviewMetadataIcon from '../../Assets/ReviewMetadataIcon'
import { getApiAction } from '../../../helpers/table'
import { selectProfileDetailsSelector } from '../../../redux/profile/profile.selector'
import { selectAccountTypeItems } from '../../../redux/dashboard/dashboard.selector'
import WithdrawIcon from '../../History/WithdrawIcon'
import SubmitButton from '../../Drafts/SubmitButton'
import ViewApprovers from '../../Requests/ViewApprovers'

const confirmedStatusArray = ['signed-off', 'expired']
const requestCompletedStatusArray = ['completed', 'cancelled']
const componentType = localStorage.getItem('component')
let isVipApprover = false
const getAccountTypePermissions = (category, accountTypeItems) => {
  const catPermissions = accountTypeItems?.accountTypeItems?.filter(
    (acc) => acc.label === category
  )[0]
  return catPermissions ? !catPermissions.availableForAmend : false
}
const checkAccountTypeModifyPermission = (dItem, type, accountTypeItems) => {
  if (type?.toLowerCase() === 'modify') {
    return getAccountTypePermissions(dItem.category, accountTypeItems)
  }
  return false
}
const getAccountTypeDeletePermissions = (category, accountTypeItems) => {
  const catPermissions = accountTypeItems?.accountTypeItems?.filter(
    (acc) => acc.label === category
  )[0]
  return catPermissions ? !catPermissions.availableForDelete : false
}
const checkAccountTypeDeletePermissions = (dItem, type, accountTypeItems) => {
  const accTypePermissions = getAccountTypeDeletePermissions(dItem.category, accountTypeItems)
  return type.toLowerCase() === 'modify' && accTypePermissions
}
const checkIfGroupMemberExists = (dItem, type) => {
  if (type === 'ModifyGroup' || type === 'IndirectlyOwnedGroup' || type === 'GroupAdmin') {
    if (
      // eslint-disable-next-line no-underscore-dangle
      dItem?.groupDetails?._source?.igaContent?.member &&
      // eslint-disable-next-line no-underscore-dangle
      dItem?.groupDetails?._source?.igaContent?.member?.length > 0
    ) {
      return true
    }
  }
  return false
}

const checkIfRoleIsApprover = (dItem, type) => {
  if (type === 'ModifyGroup') {
    if (dItem?.role && dItem?.role === 'Approver') {
      return true
    }
  }
  return false
}

const iff = (consition, then, otherise) => (consition ? then : otherise)
const getView = (option, dataItem, columnMetaData, type, profile, accountTypeItems) => {
  const disableDecisions = dataItem?.username?.includes('@')
    ? dataItem?.username === profile?.mail
    : dataItem?.username === profile?.userName?.toLowerCase()
  isVipApprover = dataItem?.vipApprover !== '' && dataItem.vipApprover === profile?.mail
  if (option.id === 'maintain') {
    return (
      <ToggleIcon
        permission={dataItem?.permissions && dataItem?.permissions[getApiAction(option.id)]}
        status={dataItem?.status}
        iconActive={option.iconActive}
        iconInactive={option.iconInactive}
        type={option.id}
        reviewId={dataItem?.id}
        key={`rcp_${dataItem?.id}`}
        isDisabled={
          (type && type === 'History') ||
          (dataItem.decision && confirmedStatusArray.includes(dataItem.decision.status)) ||
          disableDecisions
        }
        title={option.title}
        comments={dataItem.comment}
      />
    )
  }
  if (option.id === 'approve') {
    return (
      <ApproveIcon
        status={dataItem.status}
        iconActive={option.iconActive}
        iconInactive={option.iconInactive}
        type={option.id}
        approvalId={dataItem.id}
        requestNumber={dataItem.requestNumber}
        key={`approve_${dataItem.id}`}
        title={translate('approval.approveBtn')}
        phaseId={dataItem.phase}
        isVipApprover={isVipApprover}
        lmMail={profile?.mail}
      />
    )
  }
  if (option.id === 'reject') {
    return (
      <RejectIcon
        status={dataItem.status}
        iconActive={option.iconActive}
        iconInactive={option.iconInactive}
        type={option.id}
        rejectId={dataItem.id}
        requestNumber={dataItem.requestNumber}
        key={`reject_${dataItem.id}`}
        title={translate('approval.rejectBtn')}
        phaseId={dataItem.phase}
        isVipApprover={isVipApprover}
        lmMail={profile?.mail}
      />
    )
  }
  if (option.id === 'revoke') {
    return (
      <PopupIcon
        permission={dataItem?.permissions && dataItem.permissions[getApiAction(option.id)]}
        iconActive={option.iconActive}
        iconInactive={option.iconInactive}
        type={option.id}
        columnMetaData={columnMetaData}
        dataItem={dataItem}
        comments={dataItem?.comment}
        status={dataItem?.status}
        reviewId={dataItem?.id}
        key={`rev_${dataItem?.id}`}
        isDisabled={
          (type && type === 'History') ||
          (dataItem.decision && confirmedStatusArray.includes(dataItem.decision.status)) ||
          (dataItem.decision && confirmedStatusArray.includes(dataItem?.decision.status)) ||
          disableDecisions
        }
        title={option.title}
      />
    )
  }
  if (option.type === 'redirectButton') {
    return (
      <div style={{ padding: '11px 40px 11px 8px' }}>
        <Link
          to={
            componentType === 'MyTeam' && type === 'Request History'
              ? `${columnMetaData.properties.options[0].redirectTo}/${
                  dataItem[columnMetaData.properties.options[0].fieldForPath]
                }`
              : {
                  pathname: `${window.location.pathname}/${dataItem[option.fieldForPath]}`,
                  state: option.redirectProps.reduce(
                    (accumulator, currentProp) => ({
                      ...accumulator,
                      [currentProp]: dataItem[currentProp]
                    }),
                    {}
                  )
                }
          }
          style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
        >
          {['Request History', 'Drafts'].includes(type) ? (
            <Tooltip title={translate(option.title)}>
              <Fab
                aria-label="save"
                sx={{
                  width: '15px',
                  height: '15px',
                  minHeight: '15px',
                  background: 'transparent'
                }}
                disabled={['Request History', 'Drafts'].includes(type) === false}
              >
                <Icon
                  name={type === 'Request History' ? 'view' : 'editNew'}
                  width="7px"
                  height="7px"
                />
              </Fab>
            </Tooltip>
          ) : (
            <ArrowForwardIosIcon sx={{ color: grey[700] }} fontSize="small" />
          )}
        </Link>
      </div>
    )
  }
  if (option.type === 'actionButton') {
    let permission = true
    if (['ISA', 'AAA', 'ASA', 'End-User Account', 'YES'].includes(option.text)) {
      permission = dataItem?.permissions && dataItem.permissions[getApiAction('maintain')]
    }
    if (['Not-Applicable'].includes(option.text)) {
      permission = dataItem?.permissions && dataItem.permissions[getApiAction('revoke')]
    }
    return (
      <ActionButtons
        permission={permission}
        actions={option}
        status={dataItem?.status}
        reviewId={dataItem?.id}
        comments={dataItem?.comment}
        key={`${option.id}_${dataItem?.id}`}
        isDisabled={
          (type && type === 'History') ||
          (dataItem?.decision && confirmedStatusArray.includes(dataItem?.decision.status))
        }
        type={type}
      />
    )
  }
  if (option.id === 'withdraw') {
    const getDisblecheck = (dataItems) => {
      let disableValue
      if (dataItems && dataItems.length > 0) {
        disableValue = dataItems.find(
          (data) =>
            data.name === 'ThresholdBreach' ||
            data.name === 'dbUnityPhase' ||
            data.name === 'ProvisioningRetry'
        )
      }
      return !!disableValue
    }
    if (
      type &&
      type === 'Request History' &&
      (requestCompletedStatusArray.includes(dataItem.status) ||
        getDisblecheck(dataItem.phases ? dataItem.phases : []))
    ) {
      return null
    }
    return (
      <WithdrawIcon
        status={dataItem.status}
        type={type}
        reviewId={dataItem.id}
        key={`rcp_${dataItem.id}`}
        isDisabled={
          (type && type === 'History') ||
          (dataItem.decision && confirmedStatusArray.includes(dataItem.decision.status))
        }
        title={translate(option.title)}
        phaseId={dataItem?.phase ? dataItem.phase : ''}
      />
    )
  }
  if (option.id === 'approvers') {
    return (
      <ViewApprovers
        type={option.id}
        id={dataItem.id}
        key={`view_${dataItem.id}`}
        title={option.title}
        actions={option}
      />
    )
  }
  if (option.id === 'edit') {
    return (dataItem?.role && dataItem?.role === 'Approver' && type === 'ModifyGroup') ||
      ['Perm', 'Ext'].includes(dataItem?.employeeType) ? (
      <div style={{ width: '34px', margin: '16px' }}>&nbsp;</div>
    ) : (
      <RedirectButton
        permission={
          type &&
          [
            'Modify',
            'MyTeam',
            'ModifyGroup',
            'IndirectlyOwnedGroup',
            'GroupAdmin',
            'AccountAdmin'
          ].indexOf(type) < 0 ? (
            dataItem?.permissions && dataItem.permissions[getApiAction(option.id)]
          ) : (
            <div style={{ width: '34px', margin: '16px' }}>&nbsp;</div>
          )
        }
        title={option.title}
        type={type}
        dataItem={dataItem}
        key={`redirect_${option.id}`}
        name="editNew"
        columnMetaData={columnMetaData.properties.options[1]}
        isDisabled={
          dataItem?.accountStatusValidationString?.includes('Disabled by dbAccessGate')
            ? true
            : checkAccountTypeModifyPermission(dataItem, type, accountTypeItems)
        }
        toolTipTextAccountType={
          !!checkAccountTypeModifyPermission(dataItem, type, accountTypeItems)
        }
      />
    )
  }
  if (option.id === 'viewDetails') {
    return (
      <RedirectButton
        permission={
          type &&
          [
            'Modify',
            'MyTeam',
            'ModifyGroup',
            'IndirectlyOwnedGroup',
            'GroupAdmin',
            'AccountAdmin'
          ].indexOf(type) < 0 // type && (type !== 'Modify' || type !== 'MyTeam')
            ? dataItem?.permissions && dataItem?.permissions[getApiAction(option.id)]
            : ''
        }
        title={option.title}
        dataItem={dataItem}
        key={`redirect_${option.id}`}
        name="view"
        columnMetaData={option}
        type={
          [
            'Request History',
            'Approvals',
            'Approval History',
            'ServiceDeskAdmin',
            'assetGrpReqHistory'
          ].includes(type)
            ? type
            : ''
        }
      />
    )
  }
  if (option.id === 'delete') {
    if (dataItem?.accountStatus || dataItem?.employeeType) {
      return dataItem?.accountStatus !== 'Enabled' &&
        !['Perm', 'Ext'].includes(dataItem?.employeeType) ? (
        <DeleteIcon
          deleteId={dataItem.id}
          title={translate(option.title)}
          key={`delete_${dataItem.id}`}
          type={type}
          isDisabled={checkAccountTypeDeletePermissions(dataItem, type, accountTypeItems)}
        />
      ) : (
        <div style={{ width: '34px', margin: '16px' }}>&nbsp;</div>
      )
    }
    return !checkIfRoleIsApprover(dataItem, type) && !checkIfGroupMemberExists(dataItem, type) ? (
      <DeleteIcon
        deleteId={type === 'IndirectlyOwnedGroup' ? dataItem : dataItem.id}
        title={translate(option.title)}
        key={`delete_${dataItem.id}`}
        type={type}
      />
    ) : (
      <div style={{ width: '34px', margin: '16px' }}>&nbsp;</div>
    )
  }
  if (option.id === 'deleteAccess') {
    return (
      <DeleteAccessIcon
        deleteId={dataItem.memberOf}
        dataItemValue={dataItem}
        title={translate(option.title)}
        key={`delete_${dataItem.id}`}
      />
    )
  }
  if (option.id === 'reviewMetadata') {
    return !checkIfRoleIsApprover(dataItem, type) ? (
      <ReviewMetadataIcon
        itemId={dataItem.id}
        isDisabled={dataItem.status === ''}
        status={dataItem.status}
        key={`reviewMetadata_${dataItem.id}`}
      />
    ) : (
      <div style={{ width: '34px', margin: '16px' }}>&nbsp;</div>
    )
  }
  if (option.id === 'submit') {
    return (
      <SubmitButton
        submitId={dataItem.id}
        title={translate(option.title)}
        key={`play_${dataItem.id}`}
      />
    )
  }
  if (option.id === 'requestInfo') {
    return (
      <RequestInfo
        iconName={option.iconActive}
        requestInfoId={dataItem.id}
        key={`request_${dataItem.id}`}
        title={translate('approval.requestInfoBtn')}
        phaseId={dataItem.phase}
        dataItem={dataItem}
      />
    )
  }
  if (option.id === 'moreActions') {
    return type && type !== 'GroupAdmin' ? (
      <ReviewDropbox
        columnMetaData={columnMetaData?.properties?.options[4]}
        reviewId={dataItem.id}
        permission={dataItem.permissions}
        key={`request_${dataItem.id}`}
        type="longMenu"
        data={dataItem}
        isDisabled={
          (type && type === 'History') ||
          (dataItem.decision && confirmedStatusArray.includes(dataItem.decision.status))
        }
        reviewActors={dataItem.actors ? dataItem.actors : []}
        moduleType={type}
        groupId={dataItem.id}
      />
    ) : null
  }

  return (
    <PopupIcon
      permission={
        type && ['Approvals', 'Justifications'].includes(type)
          ? true
          : dataItem?.permissions && dataItem.permissions[getApiAction(option.id)]
      }
      iconActive={option.iconActive}
      iconInactive={option.iconInactive}
      type={option.id}
      columnMetaData={columnMetaData}
      dataItem={dataItem}
      comments={dataItem?.comment}
      status={dataItem?.status}
      reviewId={dataItem?.id}
      key={`acc_${dataItem?.id}`}
      isDisabled={
        ['Approvals', 'Justifications'].includes(type)
          ? false
          : (type && type === 'History') ||
            (dataItem.decision && confirmedStatusArray.includes(dataItem.decision.status)) ||
            (option.id === 'allowExceptions' ? disableDecisions : false)
      }
      title={option.title}
      requestFrom={type}
      phaseId={type && ['Approvals', 'Justifications'].includes(type) ? dataItem.phase : ''}
    />
  )
}
const CollapsibleColumn = ({ columnMetaData, dataItem, type }) => {
  const profile = useSelector(selectProfileDetailsSelector)
  const accountTypeItems = useSelector(selectAccountTypeItems)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: ['AccessGroup'].includes(type)
          ? 'space-around'
          : iff(['Modify', 'AccountAdmin', 'GroupAdmin'].includes(type), 'start', 'space-between'),
        // paddingLeft: '10px',
        marginLeft: [
          'AccountAdmin',
          'GroupAdmin',
          'Request History',
          'Approvals',
          'Approval History'
        ].includes(type)
          ? '0px'
          : '10px',
        // paddingRight: '10px',
        alignItems: 'center',
        cursor: 'pointer'
      }}
    >
      {dataItem &&
        columnMetaData?.properties?.options.map((option) =>
          getView(option, dataItem, columnMetaData, type, profile, accountTypeItems)
        )}
    </div>
  )
}

CollapsibleColumn.defaultProps = {}

export default CollapsibleColumn
