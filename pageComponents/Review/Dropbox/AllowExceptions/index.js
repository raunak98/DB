/* eslint-disable */
import React, { useState, useEffect } from 'react'

import { Button, TextField, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import * as Styled from './style'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import {
  selectReviewItems,
  selectSortInfoData,
  selectFilterData,
  selectApplyFilters,
  selectReviewPageSize,
  selectSeach,
  selectReviewPageNumber,
  selectIsGoingForwardFlag,
  selectPaginationKeys,
  selectSelectedReviewItems,
  selectUpdateIsReviewerTabActive,
  selectIsSemiAnnualCampaign
} from '../../../../redux/review/review.selector'
import {
  fetchReviewItemsStart,
  updateReviewNotificationMessage,
  updateShowSmallLoader,
  updateShowBigLoader,
  fetchReviewSortStart,
  fetchReviewerSortStart,
  fetchMonitorSortStart,
  fetchReviewFilterStart,
  fetchReviewItemsSuccess,
  updatePaginationKeys,
  getReviewItemTotalCount,
  updatePageSize,
  updatePagenUmber
} from '../../../../redux/review/review.action'
import * as reviewApi from '../../../../api/review'
import useTheme from '../../../../hooks/useTheme'
import * as profileAPI from 'api/profile'
import {
  selectProfileDetailsSelector,
  selectProvisioningRoles
} from 'redux/profile/profile.selector'

const style = {
  position: 'absolute',
  top: '46%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: '#FFF',
  boxShadow: 24,
  p: 4,
  height: 'auto',
  width: '692px',
  borderRadius: '0px'
}

const ReviewAllowExceptions = ({
  closeModal,
  multiple = false,
  reviewId,
  onCallback,
  status,
  type,
  setLoading
}) => {
  const handleClose = () => closeModal(false)
  const [days, setDays] = React.useState('')
  const [campaign, setCampaign] = useState(0)
  const dispatch = useDispatch()
  const reviewItems = useSelector(selectReviewItems)

  // Get selected review items
  const selectedReviewItems = useSelector(selectSelectedReviewItems)

  const [updatedReviewItems, setUpdatedReviewItems] = useState([])
  const sortInfoData = useSelector(selectSortInfoData)
  const filterData = useSelector(selectFilterData)
  const filterArray = useSelector(selectApplyFilters)
  const pageSize = useSelector(selectReviewPageSize)
  const pageNumber = useSelector(selectReviewPageNumber)
  const isGoingForward = useSelector(selectIsGoingForwardFlag)
  const paginationKeysArray = useSelector(selectPaginationKeys)
  const isReviewerTabActiveSelector = useSelector(selectUpdateIsReviewerTabActive)
  const selectedItems = updatedReviewItems.filter((e) => e.checked === true)
  const search = useSelector(selectSeach)
  const isSemiAnnualCampaign = useSelector(selectIsSemiAnnualCampaign)
  const profileDetails = useSelector(selectProfileDetailsSelector)
  const provisioningRoles = useSelector(selectProvisioningRoles)

  // const { id } = useParams()
  const location = useLocation()
  const id = location?.state?.id
  const { theme } = useTheme()

  const [comment, setComment] = React.useState('')

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

  const handleChange = (event) => {
    setDays(event.target.value)
  }
  const getStatus = () => {
    return localStorage.getItem('historyStatus') === 'complete'
      ? 'signed-off,expired,cancelled'
      : 'expired'
  }
  const checkForFilter = async (id) => {
    const userInfo = await profileAPI.getUserInfo()
    const certification = await reviewApi.getCampaignInfo(id)
    if (filterArray.length > 0) {
      let payload1 = {
        campaignId: id,
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
        campaignId: id,
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

      dispatch(
        fetchReviewItemsSuccess({
          reviewItems: resp
        })
      )
    } else {
      dispatch(fetchReviewItemsStart(id))
    }
  }
  useEffect(() => {
    reviewApi.getCampaignInfo(id).then((res) => setCampaign(res.exceptionDuration))
  }, [])
  if (status === 'exception') {
    onCallback()
    handleClose(false)
    let payload = {}
    const reviewData = []
    if (multiple) {
      const reviews = updatedReviewItems.map((e) => {
        if (e.checked) {
          reviewData.push({
            id: e.id,
            comments: [],
            decision: 'reset'
          })
        }
      })
      payload = {
        items: reviewData
      }
    } else {
      payload = {
        items: [
          {
            id: reviewId,
            comments: [],
            decision: 'reset'
          }
        ]
      }
    }
    dispatch(updateShowSmallLoader(true))
    reviewApi.reviewActions('grantexception', id, payload) // Need to change to .reviewAction('comment', id, payload)

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
  }

  const handleConfirm = () => {
    let payload = {}
    const reviewData = []
    if (multiple) {
      handleModal(false)
      const reviews = updatedReviewItems.map((e) => {
        if (e.checked) {
          e.action = 'allowExceptions'
          e.checked = false
          reviewData.push({
            id: e.id,
            comments: [{ action: 'comment', comment: comment }],
            decision: 'exception',
            exceptionDuration: days
          })
        }

        payload = {
          items: reviewData
        }
        dispatch(updateShowBigLoader(true))
        return e
      })
    } else {
      handleModal(false)

      payload = {
        items: [
          {
            id: reviewId,
            comments: [
              {
                action: 'comment',
                comment: comment
              }
            ],
            decision: 'exception',
            exceptionDuration: days
          }
        ]
      }
      dispatch(updateShowSmallLoader(true))
    }

    reviewApi
      .reviewActions('grantexception', id, payload) // Need to change to .reviewAction('comment', id, payload)
      .then((res) => {
        setLoading(false)
        if (res.status === 200) {
          closeModal(false)
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

          dispatch(
            updateReviewNotificationMessage({
              type: 'Success',
              message: 'exception.success'
            })
          )
        } else {
          dispatch(
            updateReviewNotificationMessage({
              type: 'Error',
              message: 'exception.error'
            })
          )
        }
      })
      .catch((err) => {
        setLoading(false)
        console.error(err)
        dispatch(
          updateReviewNotificationMessage({
            type: 'Error',
            message: err
          })
        )
      })
  }

  const handleModal = () => {
    closeModal(false)
  }

  return (
    <>
      {status !== 'exception' && (
        <div>
          <Styled.headerWrapper>
            <Typography
              variant="h3"
              fontWeight="400"
              fontSize="31px"
              lineHeight="42.2px"
              sx={{ color: `${theme === 'dark' ? '#ffffff' : '#000000'}`, marginBottom: '10px' }}
            >
              Allow Exception
            </Typography>
          </Styled.headerWrapper>
          <Styled.subHeader>
            <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }} variant="p">
              Select number of days to be deferred:
            </Typography>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120, mt: 0 }}>
              <InputLabel id="demo-simple-select-standard-label">Days</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={days}
                onChange={handleChange}
                label="day"
              >
                {Array.from(Array(campaign)).map((e, value) => (
                  <MenuItem
                    sx={{
                      background: `${theme === 'dark' ? 'transparent' : '#FFFFFF'}`,
                      boxShadow: '1px -1px 1px #E7E7E7'
                    }}
                    value={value + 1}
                    key={value + 1}
                  >
                    {value + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Styled.subHeader>
          <TextField
            id="outlined-multiline-static"
            label="Add New Comment"
            multiline
            rows={4}
            sx={{ marginTop: 5, width: '100%' }}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <Styled.CommentButtonWrapper>
            <Button
              variant="outlined"
              sx={{
                color: `${theme === 'dark' ? '#ffffff' : '#000000'}`,
                borderColor: '1px solid rgba(255, 255, 255, 0.4);'
              }}
              disabled={!comment?.length > 0}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
            <Button
              onClick={() => handleClose(false)}
              sx={{ marginRight: '8px', color: `${theme === 'dark' ? '#ffffff' : '#000000'}` }}
            >
              Cancel
            </Button>
          </Styled.CommentButtonWrapper>
        </div>
      )}
    </>
  )
}

export default ReviewAllowExceptions
