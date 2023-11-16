import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Checkbox from '@mui/material/Checkbox'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { Tooltip } from '@mui/material'
import { selectDraftsItems } from 'redux/drafts/drafts.selector'
import { updateDraftsItemsStart } from 'redux/drafts/drafts.action'
import {
  selectReviewItems,
  selectReviewTypeStatus,
  selectSelectedReviewItems
} from '../../../redux/review/review.selector'
import {
  updateReviewItemsStart,
  updateSelectedReviewItems
} from '../../../redux/review/review.action'
import { selectApprovalsItems } from '../../../redux/approvals/approvals.selector'
import { updateApprovalsItemsStart } from '../../../redux/approvals/approvals.action'
import { selectGroupAssetsItems } from '../../../redux/myAssets/myAssets.selector'
import { fetchGroupAssetsItemsSuccess } from '../../../redux/myAssets/myAssets.action'

import * as Styled from './style'

const SingleSelectCheckbox = ({ reviewId, name, isChecked, dataItem, type }) => {
  const dispatch = useDispatch()
  const approvalsItems = useSelector(selectApprovalsItems)
  const reviewItems = useSelector(selectReviewItems)
  const reviewTypeStatus = useSelector(selectReviewTypeStatus)
  const selectedReviewItems = useSelector(selectSelectedReviewItems)
  const groupAssetsItems = useSelector(selectGroupAssetsItems)
  const draftItems = useSelector(selectDraftsItems)

  // const keys = Object.entries(dataItem?.permissions || {})
  // let checkBoxCounter = 0

  // let isSignOffOnlyFalse = false
  // eslint-disable-next-line no-restricted-syntax
  // for (const [key, value] of keys) {
  // if (key === 'signoff' && !value) {
  // eslint-disable-next-line no-unused-vars
  // isSignOffOnlyFalse = true
  // }
  // if (!value) {
  // eslint-disable-next-line no-plusplus, no-unused-vars
  // checkBoxCounter++
  // }
  // }

  const onChange = (checkBoxState) => {
    if (reviewItems.length) {
      const reviews = reviewItems?.map((review) => {
        let reviewItem = {}
        if (review.id === reviewId) {
          reviewItem = { ...review, checked: checkBoxState }
        } else {
          reviewItem = { ...review }
        }

        // Updating the selected review item if user selects an item
        if (checkBoxState && review.id === reviewId) {
          dispatch(
            updateSelectedReviewItems([...selectedReviewItems, { ...review, checked: true }])
          )
        }

        // Updating the selected review item if user un-selects the selected item
        if (selectedReviewItems.length !== 0 && !checkBoxState && review.id === reviewId) {
          const updatedReviewItems = selectedReviewItems.filter(
            (selectedItem) => selectedItem.id !== reviewId
          )
          dispatch(updateSelectedReviewItems([...updatedReviewItems]))
        }
        return reviewItem
      })
      dispatch(updateReviewItemsStart([...reviews]))
    } else if (approvalsItems?.approvalData?.length) {
      const approvals = {}
      const approvalData = approvalsItems.approvalData.map((approval) => {
        let approvalItem = {}
        if (approval.id === reviewId) {
          approvalItem = { ...approval, checked: checkBoxState }
        } else {
          approvalItem = { ...approval }
        }
        return approvalItem
      })
      approvals.total = approvalsItems.total
      approvals.approvalData = approvalData
      dispatch(updateApprovalsItemsStart({ ...approvals }))
    } else if (draftItems?.draftData?.length) {
      const drafts = {}
      const draftData = draftItems.draftData.map((draft) => {
        let draftItem = {}
        if (draft.id === reviewId) {
          draftItem = { ...draft, checked: checkBoxState }
        } else {
          draftItem = { ...draft }
        }
        return draftItem
      })
      drafts.total = draftItems.total
      drafts.draftData = draftData
      dispatch(updateDraftsItemsStart({ ...drafts }))
    }
    // TODO : Add Single checkbox selection for MyAssets Groups
    else if (groupAssetsItems && groupAssetsItems?.groupData.length) {
      const groupAssets = {}
      const data = groupAssetsItems.groupData.map((eachGrp) => {
        let groupAssetItem = {}
        if (eachGrp.id === reviewId) {
          groupAssetItem = { ...eachGrp, checked: checkBoxState }
        } else {
          groupAssetItem = { ...eachGrp }
        }

        return groupAssetItem
      })
      groupAssets.total = groupAssetsItems.total
      groupAssets.groupData = data
      dispatch(fetchGroupAssetsItemsSuccess({ groupAssetsItems: groupAssets }))
    }
  }

  const fitTooltip = () => {
    let res = ''
    if (dataItem.approvers.length === 0) {
      res = (
        <Tooltip title="You cannot request for this group membership as there are no defined group approvers">
          <WarningAmberIcon fontSize="medium" />
        </Tooltip>
      )
    } else if (dataItem.dbagComplianceStatus === 1) {
      res = (
        <Tooltip title="You cannot request for this membership as the selected group is non-compliant">
          <WarningAmberIcon fontSize="medium" />
        </Tooltip>
      )
    } else {
      res = (
        <Tooltip title="This group needs to be requested through Application Access Management">
          <WarningAmberIcon fontSize="medium" />
        </Tooltip>
      )
    }
    return res
  }

  const checkIfRoleIsApprover = (dItem, moduletype) => {
    if (moduletype === 'ModifyGroup') {
      if (dItem?.role && dItem?.role === 'Approver') {
        return true
      }
    }
    return false
  }

  const showCheckbox = () => {
    let isCheckOrError = ''
    if (
      dataItem.approvers.length === 0 ||
      dataItem.dbagComplianceStatus === 1 ||
      dataItem.accessioAppRequest !== 'true'
    ) {
      isCheckOrError = <div style={{ display: 'flex', paddingLeft: '10px' }}>{fitTooltip()}</div>
    } else {
      isCheckOrError = (
        <Checkbox
          onChange={(e) => onChange(e.target.checked)}
          label={name}
          disabled={reviewTypeStatus === 'signed-off' || (type && type === 'History')}
        />
      )
    }
    return isCheckOrError
  }

  return (
    <Styled.CheckboxWrapper>
      {type === 'AddOrRemoveGroups' ? (
        showCheckbox()
      ) : (
        <Checkbox
          onChange={(e) => onChange(e.target.checked)}
          label={name}
          checked={isChecked}
          disabled={
            reviewTypeStatus === 'signed-off' ||
            (type && type === 'History') ||
            checkIfRoleIsApprover(dataItem, type)
          }
        />
      )}
    </Styled.CheckboxWrapper>
  )
}

SingleSelectCheckbox.defaultProps = {
  reviewId: undefined,
  name: undefined
}

export default SingleSelectCheckbox
