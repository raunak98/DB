import React, { useState } from 'react'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { red, blue } from '@mui/material/colors'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Badge from '@mui/material/Badge'
import Fab from '@mui/material/Fab'
import { Tooltip } from '@mui/material'
import Icon from 'components/icon'
import translate from 'translations/translate'
import * as profileAPI from 'api/profile'
import {
  selectProfileDetailsSelector,
  selectProvisioningRoles
} from 'redux/profile/profile.selector'
import GenericModal from '../../../components/genericModal'
import AllowExceptions from '../Dropbox/AllowExceptions'
import ReviewComments from '../PopupLink/Comments'
import ApprovalComments from '../../Approvals/ApprovalComments'
import JustificationComments from '../../Justifications/JustificationComments'
import { getAction } from '../../../helpers/table'
import * as reviewApi from '../../../api/review'
import {
  fetchReviewItemsStart,
  updateReviewNotificationMessage,
  updateShowSmallLoader,
  updateShowBigLoader,
  fetchReviewSortStart,
  fetchReviewFilterStart,
  updatePageSize,
  updatePagenUmber,
  fetchReviewItemsSuccess,
  updatePaginationKeys,
  updateSelectedReviewItems,
  fetchReviewerdataStart,
  getReviewItemTotalCount
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
  selectSelectedReviewItems,
  selectIsSemiAnnualCampaign,
  selectUpdateIsReviewerTabActive
} from '../../../redux/review/review.selector'

const badgeStyle = {
  '& .MuiBadge-badge': {
    backgroundColor: '#1565C0',
    minWidth: '30px'
  }
}

const PopupIcon = ({
  onChangeCallback,
  iconInactive,
  iconActive,
  type,
  status,
  reviewId,
  comments,
  permission = true,
  isDisabled,
  title,
  requestFrom,
  phaseId,
  dataItem
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = React.useState(false)
  // const { id } = useParams()
  const location = useLocation()
  const id = location?.state?.id
  const sortInfoData = useSelector(selectSortInfoData)
  const filterData = useSelector(selectFilterData)
  const filterArray = useSelector(selectApplyFilters)
  const pageSize = useSelector(selectReviewPageSize)
  const modalType = type
  const search = useSelector(selectSeach)
  const pageNumber = useSelector(selectReviewPageNumber)
  const isGoingForward = useSelector(selectIsGoingForwardFlag)
  const paginationKeysArray = useSelector(selectPaginationKeys)
  const selectedReviewItems = useSelector(selectSelectedReviewItems)
  const profileDetails = useSelector(selectProfileDetailsSelector)
  const isSemiAnnualCampaign = useSelector(selectIsSemiAnnualCampaign)
  const isReviewerTabActiveSelector = useSelector(selectUpdateIsReviewerTabActive)
  const provisioningRoles = useSelector(selectProvisioningRoles)
  const accessRevokeSuccessMsg = translate('accessrevoke.success')
  const revokeRemoveSuccess = translate('revoke.remove.success')

  const timer = React.useRef
  const dispatch = useDispatch()

  const onCallback = () => {
    if (!loading) {
      setLoading(true)
      timer.current = window.setTimeout(() => {
        setLoading(false)
      }, 2000)
    }
  }

  const getPopupIconType = () => {
    // TODO: Add a switch here since we expect in the future other types that "Allow Exceptions"

    switch (modalType) {
      case 'allowExceptions':
        if (!isDisabled) {
          return (
            <AllowExceptions
              closeModal={setOpen}
              reviewId={reviewId}
              key={reviewId}
              status={status}
              setLoading={setLoading}
              onCallback={onCallback}
              type={type}
            />
          )
        }
        break
      case 'revoke':
        setOpen(false)
        break

      case 'comment':
        switch (requestFrom) {
          case 'Approvals':
            return (
              <ApprovalComments
                handleClose={setOpen}
                reviewId={[reviewId]}
                comments={comments}
                phaseId={phaseId}
                title={title}
              />
            )
          case 'Justifications':
            return (
              <JustificationComments
                handleClose={setOpen}
                reviewId={[reviewId]}
                comments={comments}
                phaseId={phaseId}
                title={title}
                dataItem={dataItem}
              />
            )
          default:
            return (
              <ReviewComments
                handleClose={setOpen}
                reviewId={[reviewId]}
                comments={comments}
                disabled={isDisabled}
              />
            )
        }

      default:
        return null
    }
    return modalType
  }

  const getStatus = () =>
    localStorage.getItem('historyStatus') === 'complete'
      ? 'signed-off,expired,cancelled'
      : 'expired'

  const checkForFilter = async (filterId) => {
    const userInfo = await profileAPI.getUserInfo()
    const certification = await reviewApi.getCampaignInfo(id)
    if (filterArray.length > 0) {
      let payload1 = {
        campaignId: filterId,
        filter: filterArray[0].id.type,
        filterValue: filterArray[0].id.value,
        pageSize,
        pageNumber,
        status: type === 'History' ? getStatus() : 'in-progress'
      }
      if (pageNumber > 0) {
        if (!isGoingForward && paginationKeysArray.length > 0) {
          paginationKeysArray.pop()
          dispatch(updatePaginationKeys(paginationKeysArray))
        }
        // const paginationKey = paginationKeysArray.slice(-1)[0]
        payload1 = {
          ...payload1
          // search_after_primaryKey: paginationKey
        }
      }
      if (filterArray.length === 2) {
        if (isReviewerTabActiveSelector) {
          const filterAndGroupByForReviewer = {
            campaignId: id,
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
            campaignId: id,
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
        campaignId: filterId,
        searchItem: search,
        pageSize,
        pageNumber,
        status: type === 'History' ? getStatus() : 'in-progress',
        certType: certification
      }
      const semiAnnualSearchPayload = {
        campaignId: id,
        searchItem: search,
        status: type === 'History' ? getStatus() : 'in-progress',
        pageSize,
        pageNumber,
        certType: certification,
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
    } else if (isSemiAnnualCampaign && isReviewerTabActiveSelector) {
      const reviewerPayload = {
        campaignId: id,
        status: type === 'History' ? getStatus() : 'in-progress',
        userEmail: profileDetails?.mail,
        userRole: 'reviewer',
        pageSize,
        pageNumber
      }
      dispatch(fetchReviewerdataStart(reviewerPayload))
    } else {
      dispatch(fetchReviewItemsStart(filterId))
    }
  }

  const checkCondition = () => {
    if (status === 'revoke' && type === 'revoke') {
      if (!isDisabled) {
        const reviewData = []
        reviewData.push({
          id: reviewId,
          comments: [],
          decision: 'reset'
        })
        const payload = {
          items: reviewData
        }
        dispatch(updateShowSmallLoader(true))
        reviewApi
          .reviewActions('revoke', id, payload)
          .then((res) => {
            // Need to change to .reviewAction('comment', id, payload)
            const isReviewIdSelected = selectedReviewItems.filter((item) => item.id === reviewId)

            if (isReviewIdSelected.length !== 0) {
              const otherReviewItems = selectedReviewItems.filter((item) => item.id !== reviewId)
              dispatch(
                updateSelectedReviewItems([
                  ...otherReviewItems,
                  { ...isReviewIdSelected[0], status: null }
                ])
              )
            }
            if (sortInfoData.sortKey !== '') {
              dispatch(fetchReviewSortStart(sortInfoData.payload))
            } else {
              checkForFilter(id)
            }
            if (res.status === 200) {
              dispatch(
                updateReviewNotificationMessage({
                  type: 'Success',
                  message: revokeRemoveSuccess
                })
              )
            }
          })
          .catch((err) => {
            dispatch(
              updateReviewNotificationMessage({
                type: 'Error',
                message: `${err}`
              })
            )
          })
      }
      onCallback()
    }
  }
  const isChecked = getAction(status) === type

  const onChange = () => {
    if (onChangeCallback instanceof Function) {
      // eslint-disable-next-line no-undef
      onChangeCallback(!checked)
    }
    if (!permission) {
      setOpen(false)
    } else {
      setLoading(true)
      if (permission) {
        setOpen(true)
        if (status === 'revoke' && type === 'revoke' && !isDisabled) {
          checkCondition()
        } else if (modalType === 'revoke' && !isDisabled) {
          const reviewData = []
          reviewData.push({
            id: reviewId,
            comments: [{ action: 'comment', comment: 'Revoke' }],
            decision: 'revoke'
          })
          const payload = {
            items: reviewData
          }
          if (payload.items.length > 1) {
            dispatch(updateShowBigLoader(true))
          } else {
            dispatch(updateShowSmallLoader(true))
          }
          reviewApi
            .reviewActions('revoke', id, payload) // Need to change to .reviewAction('comment', id, payload)
            .then((res) => {
              const isReviewIdSelected = selectedReviewItems.filter((item) => item.id === reviewId)
              if (isReviewIdSelected.length !== 0) {
                const otherReviewItems = selectedReviewItems.filter((item) => item.id !== reviewId)
                dispatch(
                  updateSelectedReviewItems([
                    ...otherReviewItems,
                    { ...isReviewIdSelected[0], status: 'revoke' }
                  ])
                )
              }
              setLoading(false)
              if (sortInfoData.sortKey !== '') {
                dispatch(fetchReviewSortStart(sortInfoData.payload))
              } else {
                checkForFilter(id)
              }

              if (res.status === 200 && !isChecked) {
                dispatch(
                  updateReviewNotificationMessage({
                    type: 'Success',
                    message: accessRevokeSuccessMsg
                  })
                )
              }
            })
            .catch((err) => {
              setLoading(false)
              dispatch(
                updateReviewNotificationMessage({
                  type: 'Error',
                  message: `${err}`
                })
              )
            })
        }
      } else {
        setOpen(true)
      }
    }
  }

  React.useEffect(() => clearTimeout(timer.current), [])

  const getCommentCount = () => {
    let count = 0
    if (comments?.length) {
      comments.forEach((comment) => {
        if (!comment.request) {
          count += 1
        }
      })
    }

    if (count === 0) {
      count = '0'
    }
    return count
  }

  return (
    <>
      {open && <GenericModal setOpen={setOpen}>{getPopupIconType()}</GenericModal>}

      {modalType === 'comment' ? (
        <div
          tabIndex={0}
          role="button"
          onKeyDown={() => onChange()}
          onClick={() => onChange()}
          style={{ cursor: !permission ? 'not-allowed' : 'pointer' }}
        >
          {isChecked ? (
            <Badge badgeContent={getCommentCount()} color="primary" sx={badgeStyle}>
              <Icon name={iconInactive} size="small" disabled={!permission} />
            </Badge>
          ) : (
            <Badge badgeContent={getCommentCount()} color="primary" sx={badgeStyle}>
              <Icon name={iconActive} size="small" disabled={!permission} />
            </Badge>
          )}
        </div>
      ) : (
        <div tabIndex={0} role="button" onKeyDown={() => onChange()} onClick={() => onChange()}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                m: 1,
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              <Tooltip title={title}>
                <span>
                  <Fab
                    aria-label="save"
                    sx={{
                      width: '20px',
                      height: '20px',
                      minHeight: '20px',
                      background: 'transparent',
                      position: 'initial'
                    }}
                    disabled={!permission || isDisabled}
                  >
                    <Icon name={isChecked ? iconInactive : iconActive} />
                  </Fab>
                </span>
              </Tooltip>
              {loading && !isDisabled && (
                <CircularProgress
                  size={26}
                  sx={{
                    color: modalType === 'revoke' ? red[500] : blue[500],
                    position: 'absolute',
                    top: 0,
                    left: -3,
                    zIndex: 1
                  }}
                  disabled={!permission || isDisabled}
                />
              )}
            </Box>
          </Box>
        </div>
      )}
    </>
  )
}
PopupIcon.defaultProps = {
  defaultChecked: false,
  disabled: false,
  errorMessage: '',
  label: '',
  name: '',
  onChangeCallback: undefined
}

export default PopupIcon
