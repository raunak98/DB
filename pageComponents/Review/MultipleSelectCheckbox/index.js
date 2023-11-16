import React, { useState, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { selectDraftsItems } from 'redux/drafts/drafts.selector'
import { updateDraftsItemsStart } from 'redux/drafts/drafts.action'
import Checkbox from '@mui/material/Checkbox'
// eslint-disable-next-line import/no-cycle
// import { filterArrayNew } from 'helpers/arrays'
import * as Styled from './style'

import {
  selectApplyFilters,
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

const MultipleSelectCheckbox = ({ type, reviewData, arrayOfGroup, index }) => {
  const dispatch = useDispatch()
  const applyFilters = useSelector(selectApplyFilters)
  const approvalsItems = useSelector(selectApprovalsItems)
  const reviewItems = useSelector(selectReviewItems)

  // Get selected review items
  const selectedReviewItems = useSelector(selectSelectedReviewItems)

  const [updatedReviewItems, setUpdatedReviewItems] = useState([])
  const status = useSelector(selectReviewTypeStatus)
  const groupAssetsItems = useSelector(selectGroupAssetsItems)
  const draftsItems = useSelector(selectDraftsItems)

  const [checked, setChecked] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [isDiable, setIsDisable] = useState(false)

  const [filterKey, setFilterKey] = useState('')

  useEffect(() => {
    if (selectedReviewItems?.length !== 0) {
      const updatedItems = reviewItems.map((reviewItem) => {
        // Checking if we have already selected item
        const checkedItem = selectedReviewItems.find(
          (selectedReviewItem) => selectedReviewItem.id === reviewItem.id
        )
        return checkedItem ? { ...reviewItem, checked: true } : reviewItem
      })
      setUpdatedReviewItems([...updatedItems])
    } else {
      setUpdatedReviewItems([...reviewItems])
    }
  }, [reviewItems])

  const isCheckedArray = (groupedBy) => {
    let isTrue = true

    groupedBy.map((e) => {
      if (!e.checked) {
        isTrue = false
      }
      return isTrue
    })

    return isTrue
  }

  // eslint-disable-next-line no-unused-vars
  const checkIsPermissionGranted = (groupedBy) => {
    let isTrue = true

    // eslint-disable-next-line no-restricted-syntax
    for (const e of groupedBy) {
      const keys = Object.entries(e?.permissions || {})
      if (!isTrue) break
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of keys) {
        if (key !== 'signoff' && !value) {
          // eslint-disable-next-line no-plusplus
          isTrue = false
          break
        }
      }
    }
  }

  useEffect(() => {
    if (updatedReviewItems && updatedReviewItems.length) {
      const isAllChecked = isCheckedArray(updatedReviewItems)
      setChecked(isAllChecked)
      // setIsDisable(!checkIsPermissionGranted(updatedReviewItems))
    } else if (approvalsItems && approvalsItems?.approvalData?.length) {
      const isAllChecked = isCheckedArray(approvalsItems?.approvalData)
      setChecked(isAllChecked)
    } else if (groupAssetsItems && groupAssetsItems?.groupData?.length) {
      const isAllChecked = isCheckedArray(groupAssetsItems?.groupData)
      setChecked(isAllChecked)
    } else if (draftsItems && draftsItems?.draftData?.length) {
      const isAllChecked = isCheckedArray(draftsItems.draftData)
      setChecked(isAllChecked)
    }
  }, [updatedReviewItems, approvalsItems, groupAssetsItems, draftsItems])

  useEffect(() => {
    const pos = applyFilters.length === 2 ? 1 : 0
    if (applyFilters[pos]?.id?.value) {
      switch (applyFilters[pos]?.id?.value) {
        case 'Username':
          setFilterKey('username')
          break
        case 'Account Name':
          setFilterKey('accountName')
          break
        case 'By Question':
          setFilterKey('question')
          break
        case 'NAR ID':
          setFilterKey('narId')
          break
        case 'Hostname':
          setFilterKey('resource')
          break
        case 'Resource Name':
          setFilterKey('resourceName')
          break
        case 'Application Name':
          setFilterKey('applicationName')
          break
        case 'Entitlement':
          setFilterKey('entitlement')
          break
        case 'GRP Name':
          setFilterKey('groupName')
          break
        default:
          setFilterKey('username')
          break
      }
    } else {
      setFilterKey('')
    }
  }, [applyFilters])

  // useEffect(() => {
  //   if (reviewData && reviewData.length && filterKey) {
  //     const groupedBy = filterArrayNew(reviewData, filterKey)
  //     if (groupedBy && groupedBy[arrayOfGroup[index].key]) {
  //       const data = groupedBy[arrayOfGroup[index].key]

  //       const isAllChecked = isCheckedArray(data)

  //       setChecked(isAllChecked)
  //       // setIsDisable(!checkIsPermissionGranted(data))
  //     }
  //   }
  // }, [reviewData])

  // need to check the below function filterkey
  const onChange = (checkBoxState) => {
    setChecked(checkBoxState)

    if (reviewData && reviewData.length) {
      const reviews = reviewData.map((review) => {
        let reviewItem = {}
        if (review[filterKey] === arrayOfGroup[index].key) {
          reviewItem = { ...review, checked: checkBoxState }
        } else {
          reviewItem = { ...review }
        }
        return reviewItem
      })

      dispatch(updateReviewItemsStart([...reviews]))
    } else if (reviewItems && reviewItems.length && checkBoxState) {
      const nonSelectedItems = updatedReviewItems.filter((item) => item.checked === false)
      const newlySelectedItems = nonSelectedItems.map((review) => {
        // eslint-disable-next-line no-param-reassign
        review.checked = checkBoxState
        return review
      })
      const reviews = reviewItems.map((review) => {
        // eslint-disable-next-line no-param-reassign
        review.checked = checkBoxState
        return review
      })
      dispatch(updateSelectedReviewItems([...selectedReviewItems, ...newlySelectedItems]))
      dispatch(updateReviewItemsStart([...reviews]))
    } else if (reviewItems && reviewItems.length && !checkBoxState) {
      const reviews = reviewItems.map((review) => {
        const reviewItem = { ...review, checked: checkBoxState }
        // review.checked = checkBoxState
        return reviewItem
      })
      // Function to check if the selected item's id is present in reviews
      const isIdPresentInReviews = (item) => reviews.some((review) => review.id === item.id)
      // Filter out items from selected items that have a matching id in reviews
      const updatedSelectedItems = selectedReviewItems.filter((item) => !isIdPresentInReviews(item))

      dispatch(updateSelectedReviewItems([...updatedSelectedItems]))
      dispatch(updateReviewItemsStart([...reviews]))
    } else if (approvalsItems?.approvalData?.length) {
      const approvals = {}
      const approvalData = approvalsItems.approvalData.map((approval) => {
        const approvalItem = { ...approval, checked: checkBoxState }
        return approvalItem
      })
      approvals.total = approvalsItems.total
      approvals.approvalData = approvalData
      dispatch(updateApprovalsItemsStart({ ...approvals }))
    } else if (draftsItems?.draftData?.length) {
      const drafts = {}
      const draftData = draftsItems.draftData.map((draft) => {
        const draftItem = { ...draft, checked: checkBoxState }
        return draftItem
      })
      drafts.total = draftsItems.total
      drafts.draftData = draftData
      const draftsObj = { ...drafts }
      dispatch(updateDraftsItemsStart(draftsObj))
    } else if (groupAssetsItems?.groupData?.length) {
      const groupAssets = {}
      const data = groupAssetsItems?.groupData?.map((eachGrp) => {
        const groupItem = { ...eachGrp, checked: checkBoxState }
        return groupItem
      })
      groupAssets.total = groupAssetsItems?.total
      groupAssets.groupData = data
      dispatch(fetchGroupAssetsItemsSuccess({ groupAssetsItems: groupAssets }))
    }
  }

  return (
    <Styled.CheckboxWrapper>
      <Checkbox
        onChange={(e) => onChange(e.target.checked)}
        checked={checked}
        disabled={(type && type === 'History') || isDiable || status === 'signed-off'}
      />
      {/* <span style={{ paddingLeft: '10px' }}>Select all</span> */}
    </Styled.CheckboxWrapper>
  )
}

export default MultipleSelectCheckbox
