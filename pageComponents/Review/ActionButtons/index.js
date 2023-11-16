import React from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import { Tooltip } from '@mui/material'
import * as profileAPI from 'api/profile'
import {
  fetchReviewItemsStart,
  updateShowSmallLoader,
  updateReviewNotificationMessage,
  fetchReviewSortStart,
  fetchReviewerSortStart,
  fetchMonitorSortStart,
  fetchReviewFilterStart,
  updatePageSize,
  updatePagenUmber,
  fetchReviewItemsSuccess,
  updatePaginationKeys,
  getReviewItemTotalCount,
  updateShowBigLoader
} from '../../../redux/review/review.action'

import {
  selectSortInfoData,
  selectFilterData,
  selectApplyFilters,
  selectReviewPageSize,
  selectSeach,
  selectReviewPageNumber,
  selectIsGoingForwardFlag,
  selectPaginationKeys,
  selectUpdateIsReviewerTabActive,
  selectIsSemiAnnualCampaign
} from '../../../redux/review/review.selector'
import {
  selectProfileDetailsSelector,
  selectProvisioningRoles
} from '../../../redux/profile/profile.selector'
import * as reviewApi from '../../../api/review'

const ActionButtons = ({ permission, actions, status, reviewId, comments, isDisabled, type }) => {
  // const { id } = useParams()
  const location = useLocation()
  const id = location?.state?.id
  const dispatch = useDispatch()
  const sortInfoData = useSelector(selectSortInfoData)
  const filterData = useSelector(selectFilterData)
  const filterArray = useSelector(selectApplyFilters)
  const pageSize = useSelector(selectReviewPageSize)
  const search = useSelector(selectSeach)
  const pageNumber = useSelector(selectReviewPageNumber)
  const isGoingForward = useSelector(selectIsGoingForwardFlag)
  const paginationKeysArray = useSelector(selectPaginationKeys)
  const isReviewerTabActiveSelector = useSelector(selectUpdateIsReviewerTabActive)
  const isSemiAnnualCampaign = useSelector(selectIsSemiAnnualCampaign)
  const profileDetails = useSelector(selectProfileDetailsSelector)
  const provisioningRoles = useSelector(selectProvisioningRoles)

  const getStatus = () =>
    localStorage.getItem('historyStatus') === 'complete'
      ? 'signed-off,expired,cancelled'
      : 'expired'
  const checkForFilter = async (_id) => {
    const userInfo = await profileAPI.getUserInfo()
    const certification = await reviewApi.getCampaignInfo(id)
    if (filterArray.length > 0) {
      let payload1 = {
        campaignId: _id,
        filter: filterArray[0].id.type,
        filterValue: filterArray[0].id.value,
        pageSize,
        status: type === 'History' ? getStatus() : 'in-progress'
      }

      if (pageNumber > 0) {
        if (!isGoingForward && paginationKeysArray.length > 0) {
          paginationKeysArray.pop()
          dispatch(updatePaginationKeys(paginationKeysArray))
        }
        const paginationKey = paginationKeysArray.slice(-1)[0]
        payload1 = {
          ...payload1,
          search_after_primaryKey: paginationKey
        }
      }
      if (filterArray.length === 2) {
        if (isReviewerTabActiveSelector) {
          const filterAndGroupByForReviewer = {
            campaignId: _id,
            status: type === 'History' ? getStatus() : 'in-progress',
            pageSize,
            pageNumber,
            filterBy: filterArray[0].id.type,
            filterByValue: filterArray[0].id.value,
            userRole: 'reviewer',
            userEmail: profileDetails?.mail,
            group: filterArray[1].id.type,
            groupedValue: filterData.groupByValue
          }
          reviewApi
            .postFilterAndGroupByDataSa(
              filterAndGroupByForReviewer,
              userInfo?.id,
              certification,
              provisioningRoles
            )
            .then((response) => {
              dispatch(
                fetchReviewItemsSuccess({
                  reviewItems: response?.normalizedData
                })
              )
              dispatch(
                getReviewItemTotalCount(
                  response?.normalizedData?.length > 0 &&
                    response?.normalizedData[0]?.total !== undefined
                    ? response.normalizedData[0]?.total
                    : 0
                )
              )
            })
            .catch((error) => {
              console.error(error)
              dispatch(updateShowBigLoader(false))
            })
        } else {
          const filterAndGroupByForMonitor = {
            campaignId: _id,
            status: type === 'History' ? getStatus() : 'in-progress',
            pageSize,
            pageNumber,
            filterBy: filterArray[0].id.type,
            filterByValue: filterArray[0].id.value,
            userRole: 'reviewer',
            userEmail: filterData.groupByValue
          }
          reviewApi
            .postFilterAndGroupByMonitorDataSa(
              filterAndGroupByForMonitor,
              userInfo?.id,
              certification,
              provisioningRoles
            )
            .then((response) => {
              dispatch(
                fetchReviewItemsSuccess({
                  reviewItems: response?.normalizedData
                })
              )
              dispatch(
                getReviewItemTotalCount(
                  response?.normalizedData?.length > 0 &&
                    response?.normalizedData[0]?.total !== undefined
                    ? response.normalizedData[0]?.total
                    : 0
                )
              )
            })
            .catch((error) => {
              console.error(error)
              dispatch(updateShowBigLoader(false))
            })
        }
      } else if (filterData.currentFilter === 'All') {
        dispatch(fetchReviewFilterStart(payload1))
      }
    } else if (search !== '') {
      const payload = {
        campaignId: _id,
        searchItem: search,
        pageSize,
        status: type === 'History' ? getStatus() : 'in-progress',
        certType: certification
      }
      const semiAnnualSearchPayload = {
        campaignId: _id,
        searchItem: search,
        pageSize,
        status: type === 'History' ? getStatus() : 'in-progress',
        certType: certification,
        pageNumber,
        userEmail: profileDetails?.mail,
        userRole: 'reviewer'
      }
      let resp
      if (isSemiAnnualCampaign) {
        resp = await reviewApi.searchByReviewerSa(
          semiAnnualSearchPayload,
          userInfo.id,
          certification,
          provisioningRoles
        )
      } else {
        resp = await reviewApi.searchBy(payload, userInfo.id, certification)
      }

      dispatch(updatePageSize(10))
      dispatch(updatePagenUmber(0))
      dispatch(
        fetchReviewItemsSuccess({
          reviewItems: resp
        })
      )
    } else {
      dispatch(fetchReviewItemsStart(id))
    }
  }
  const getLatestActionText = () => {
    let latestActionText = ''
    comments
      ?.slice()
      .reverse()
      ?.some((e) => {
        if (
          ['ISA', 'AAA', 'ASA', 'End-User Account', 'YES', 'Not-Applicable'].includes(e.comment)
        ) {
          latestActionText = e.comment
        }
        return ['ISA', 'AAA', 'ASA', 'End-User Account', 'YES', 'Not-Applicable'].includes(
          e.comment
        )
      })
    return latestActionText
  }
  const checkComments = () => {
    const latestActionText = getLatestActionText()
    return latestActionText.toLowerCase() === actions.text.toLowerCase()
  }
  const handleClick = (value) => {
    if ((status === 'certify' && checkComments()) || (status === 'revoke' && checkComments())) {
      const payload = {
        items: [
          {
            id: reviewId,
            comments: [],
            decision: 'reset'
          }
        ]
      }
      dispatch(updateShowSmallLoader(true))
      reviewApi
        .reviewActions(status, id, payload) // Need to change to .reviewAction('comment', id, payload)
        .then(() => {
          if (sortInfoData.sortKey !== '') {
            if (isSemiAnnualCampaign) {
              if (isReviewerTabActiveSelector) {
                dispatch(fetchReviewerSortStart(sortInfoData.payload))
              } else {
                dispatch(fetchMonitorSortStart(sortInfoData.payload))
              }
            } else {
              dispatch(fetchReviewSortStart(sortInfoData.payload))
            }
          } else {
            checkForFilter(id)
          }
        })
    } else {
      const payload = {
        items: [
          {
            id: reviewId,
            comments: [
              {
                action: 'comment',
                comment: value
              }
            ],
            decision: value === 'Not-Applicable' ? 'revoke' : 'certify'
          }
        ]
      }
      dispatch(updateShowSmallLoader(true))
      const apiToCall = value === 'Not-Applicable' ? 'revoke' : 'certify'
      reviewApi
        .reviewActions(apiToCall, id, payload)
        .then((response) => {
          if (sortInfoData.sortKey !== '') {
            if (isSemiAnnualCampaign) {
              if (isReviewerTabActiveSelector) {
                dispatch(fetchReviewerSortStart(sortInfoData.payload))
              } else {
                dispatch(fetchMonitorSortStart(sortInfoData.payload))
              }
            } else {
              dispatch(fetchReviewSortStart(sortInfoData.payload))
            }
          } else {
            checkForFilter(id)
          }
          if (response.status === 200) {
            dispatch(
              updateReviewNotificationMessage({
                type: 'Success',
                message: `reviewentry.success`
              })
            )
          }
        })
        .catch((error) => console.error(error))
    }
  }

  const showButtons = (action) => {
    if (action.text === 'YES') {
      return (
        <Tooltip key={action.id} title={action.title}>
          <Button
            key={action.id}
            sx={{ marginLeft: '10px' }}
            variant={status === 'certify' ? 'contained' : 'outlined'}
            onClick={() => handleClick(actions.text)}
            disabled={isDisabled}
            style={{ cursor: !permission ? 'not-allowed' : 'pointer' }}
          >
            {action.text}
          </Button>
        </Tooltip>
      )
    }
    if (action.text === 'Not-Applicable') {
      return (
        <Tooltip key={action.id} title={action.title}>
          <Button
            key={action.id}
            sx={{ marginLeft: '10px' }}
            variant={status === 'revoke' ? 'contained' : 'outlined'}
            onClick={() => handleClick(action.text)}
            disabled={isDisabled}
            style={{ cursor: !permission ? 'not-allowed' : 'pointer' }}
          >
            {action.text}
          </Button>
        </Tooltip>
      )
    }
    if (['ISA', 'AAA', 'ASA', 'End-User Account'].includes(action.text)) {
      return (
        <Tooltip key={action.id} title={action.title}>
          <Button
            key={action.id}
            sx={{ marginLeft: '10px' }}
            variant={
              (status === 'certify' || isDisabled) && checkComments() ? 'contained' : 'outlined'
            }
            onClick={() => handleClick(action.text)}
            disabled={isDisabled}
            style={{ cursor: !permission ? 'not-allowed' : 'pointer' }}
          >
            {action.text}
          </Button>
        </Tooltip>
      )
    }
    if (action.text === 'Request Info') {
      return (
        <Tooltip key={action.id} title={action.title}>
          <Button
            key={action.id}
            sx={{ marginLeft: '10px' }}
            variant="outlined"
            onClick={() => handleClick(action.text)}
            disabled={isDisabled}
          >
            {action.text}
          </Button>
        </Tooltip>
      )
    }
    return null
  }
  return <div style={{ display: 'flex' }}>{!!actions && showButtons(actions)}</div>
}

export default ActionButtons
