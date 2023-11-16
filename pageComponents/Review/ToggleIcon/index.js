import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Tooltip } from '@mui/material'
import CircularIntegration from 'components/circularIntegration'
import * as profileAPI from 'api/profile'
import {
  selectProfileDetailsSelector,
  selectProvisioningRoles
} from 'redux/profile/profile.selector'
import { getAction } from '../../../helpers/table'
import {
  fetchReviewItemsStart,
  updateReviewNotificationMessage,
  updateShowSmallLoader,
  fetchReviewSortStart,
  fetchReviewFilterStart,
  fetchReviewItemsSuccess,
  updatePaginationKeys,
  updateSelectedReviewItems,
  fetchReviewerdataStart,
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
  selectCampaignInfo,
  selectReviewTypeStatus,
  selectSelectedReviewItems,
  selectIsSemiAnnualCampaign,
  selectUpdateIsReviewerTabActive
} from '../../../redux/review/review.selector'
import * as reviewApi from '../../../api/review'

const ToggleIcon = ({
  onChangeCallback,
  iconInactive,
  iconActive,
  type,
  status,
  reviewId,
  permission = true,
  isDisabled,
  title,
  comments
}) => {
  const [loader, setLoader] = useState(false)
  const [certification, setCertification] = useState('')
  // const { id } = useParams()
  const location = useLocation()
  const id = location?.state?.id
  const sortInfoData = useSelector(selectSortInfoData)
  const filterData = useSelector(selectFilterData)
  const filterArray = useSelector(selectApplyFilters)
  const pageSize = useSelector(selectReviewPageSize)
  const search = useSelector(selectSeach)
  const pageNumber = useSelector(selectReviewPageNumber)
  const isGoingForward = useSelector(selectIsGoingForwardFlag)
  const paginationKeysArray = useSelector(selectPaginationKeys)
  const campaignInfo = useSelector(selectCampaignInfo)
  const getReviewStatus = useSelector(selectReviewTypeStatus)
  const selectedReviewItems = useSelector(selectSelectedReviewItems)
  const profileDetails = useSelector(selectProfileDetailsSelector)
  const isSemiAnnualCampaign = useSelector(selectIsSemiAnnualCampaign)
  const isReviewerTabActiveSelector = useSelector(selectUpdateIsReviewerTabActive)
  const provisioningRoles = useSelector(selectProvisioningRoles)

  React.useEffect(() => {
    if (campaignInfo) {
      setCertification(campaignInfo?.description)
    }
  }, [])
  const dispatch = useDispatch()
  const isChecked =
    (getAction(status) === type && certification !== 'ISA_WIN_UNIX_DB') ||
    (certification === 'ISA_WIN_UNIX_DB' &&
      getAction(status) === type &&
      comments?.slice(-1)[0]?.comment === 'ISA')
  const iconName = isChecked ? iconActive : iconInactive

  const getStatus = () =>
    localStorage.getItem('historyStatus') === 'complete'
      ? 'signed-off,expired,cancelled'
      : 'expired'

  const checkforSearch = async (_id) => {
    const userInfo = await profileAPI.getUserInfo()
    const payload = {
      campaignId: _id,
      searchItem: search,
      pageSize,
      pageNumber,
      status: type === 'History' ? getStatus() : getReviewStatus,
      certType: certification
    }
    const semiAnnualSearchPayload = {
      campaignId: _id,
      searchItem: search,
      status: type === 'History' ? getStatus() : getReviewStatus,
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
  }
  const onChange = () => {
    if (!isDisabled) {
      if (permission) {
        setLoader(true)
        if (
          (status === 'certify' && certification !== 'ISA_WIN_UNIX_DB') ||
          (certification === 'ISA_WIN_UNIX_DB' &&
            status === 'certify' &&
            comments?.slice(-1)[0].comment === 'ISA')
        ) {
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
            .reviewActions('certify', id, payload) // Need to change to .reviewAction('comment', id, payload)
            .then(async (res) => {
              console.error(res)
              setLoader(false)
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
              const userInfo = await profileAPI.getUserInfo()
              if (sortInfoData.sortKey !== '') {
                if (filterArray.length === 2) {
                  if (isReviewerTabActiveSelector) {
                    const filterAndGroupByForReviewerSort = {
                      campaignId: id,
                      status: type === 'History' ? getStatus() : 'in-progress',
                      pageSize,
                      pageNumber,
                      filterBy: filterArray[0].id.type,
                      filterByValue: filterArray[0].id.value,
                      userRole: 'reviewer',
                      userEmail: profileDetails?.mail,
                      group: filterArray[1].id.type,
                      groupedValue: filterData.groupByValue,
                      sortBy: sortInfoData.sortKey,
                      sortOrder: sortInfoData.isAscending
                    }
                    reviewApi
                      .postSortFilterAndGroupByDataSa(
                        filterAndGroupByForReviewerSort,
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
                    const filterAndGroupByForMonitorSort = {
                      campaignId: id,
                      status: type === 'History' ? getStatus() : 'in-progress',
                      pageSize,
                      pageNumber,
                      filterBy: filterArray[0].id.type,
                      filterByValue: filterArray[0].id.value,
                      userRole: 'reviewer',
                      userEmail: filterData.groupByValue,
                      sortBy: sortInfoData.sortKey,
                      sortOrder: sortInfoData.isAscending
                    }
                    reviewApi
                      .postSortFilterGroupByMonitorDataSa(
                        filterAndGroupByForMonitorSort,
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
                } else {
                  dispatch(fetchReviewSortStart(sortInfoData.payload))
                }
              } else if (filterArray.length > 0) {
                let payload1 = {
                  campaignId: id,
                  filter: filterArray[0].id.type,
                  filterValue: filterArray[0].id.value,
                  pageSize,
                  pageNumber,
                  status: type === 'History' ? getStatus() : 'in-progress'
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
                  payload1 = {
                    campaignId: id,
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

                  dispatch(fetchReviewFilterStart(payload1))
                }
              } else if (search !== '') {
                checkforSearch(id)
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
                dispatch(fetchReviewItemsStart(id))
              }
              setLoader(false)
              if (res.status === 200) {
                dispatch(
                  updateReviewNotificationMessage({
                    type: 'Success',
                    message: `maintain.remove.success`,
                    action: 'confirm',
                    actionType: 'reset'
                  })
                )
              }
            })
            .catch((err) => {
              console.error(err)
              setLoader(false)
              dispatch(
                updateReviewNotificationMessage({
                  type: 'Error',
                  message: `maintain.remove.error`
                })
              )
            })
        } else {
          setLoader(true)
          const payload = {
            items: [
              {
                id: reviewId,
                comments:
                  certification === 'ISA_WIN_UNIX_DB'
                    ? [
                        {
                          action: 'comment',
                          comment: 'ISA'
                        }
                      ]
                    : [
                        {
                          action: 'comment',
                          comment: 'Maintain'
                        }
                      ],
                decision: 'certify'
              }
            ]
          }
          dispatch(updateShowSmallLoader(true))
          reviewApi
            .reviewActions('certify', id, payload) // Need to change to .reviewAction('comment', id, payload)
            .then(async (res) => {
              const isReviewIdSelected = selectedReviewItems.filter((item) => item.id === reviewId)
              if (isReviewIdSelected.length !== 0) {
                const otherReviewItems = selectedReviewItems.filter((item) => item.id !== reviewId)
                dispatch(
                  updateSelectedReviewItems([
                    ...otherReviewItems,
                    { ...isReviewIdSelected[0], status: 'certify' }
                  ])
                )
              }
              const userInfo = await profileAPI.getUserInfo()
              if (sortInfoData.sortKey !== '') {
                if (filterArray.length === 2) {
                  if (isReviewerTabActiveSelector) {
                    const filterAndGroupByForReviewerSort = {
                      campaignId: id,
                      status: type === 'History' ? getStatus() : 'in-progress',
                      pageSize,
                      pageNumber,
                      filterBy: filterArray[0].id.type,
                      filterByValue: filterArray[0].id.value,
                      userRole: 'reviewer',
                      userEmail: profileDetails?.mail,
                      group: filterArray[1].id.type,
                      groupedValue: filterData.groupByValue,
                      sortBy: sortInfoData.sortKey,
                      sortOrder: sortInfoData.isAscending
                    }
                    reviewApi
                      .postSortFilterAndGroupByDataSa(
                        filterAndGroupByForReviewerSort,
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
                    const filterAndGroupByForMonitorSort = {
                      campaignId: id,
                      status: type === 'History' ? getStatus() : 'in-progress',
                      pageSize,
                      pageNumber,
                      filterBy: filterArray[0].id.type,
                      filterByValue: filterArray[0].id.value,
                      userRole: 'reviewer',
                      userEmail: filterData.groupByValue,
                      sortBy: sortInfoData.sortKey,
                      sortOrder: sortInfoData.isAscending
                    }
                    reviewApi
                      .postSortFilterGroupByMonitorDataSa(
                        filterAndGroupByForMonitorSort,
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
                } else {
                  dispatch(fetchReviewSortStart(sortInfoData.payload))
                }
              } else if (filterArray.length > 0) {
                let payload1 = {
                  campaignId: id,
                  filter: filterArray[0].id.type,
                  filterValue: filterArray[0].id.value,
                  pageSize,
                  pageNumber,
                  status: type === 'History' ? getStatus() : 'in-progress'
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
                  payload1 = {
                    campaignId: id,
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
                  dispatch(fetchReviewFilterStart(payload1))
                }
              } else if (search !== '') {
                checkforSearch(id)
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
                dispatch(fetchReviewItemsStart(id))
              }

              setLoader(false)
              if (res.status === 200) {
                dispatch(
                  updateReviewNotificationMessage({
                    type: 'Success',
                    message: `accessmaintained.sucessfully`,
                    action: 'confirm',
                    actionType: 'maintain'
                  })
                )
              }
            })
            .catch((err) => {
              console.error(err)
              setLoader(false)
              dispatch(
                updateReviewNotificationMessage({
                  type: 'Error',
                  message: `error.maintain`
                })
              )
            })
        }

        if (onChangeCallback instanceof Function) {
          // eslint-disable-next-line no-undef
          onChangeCallback(!checked)
        }
      }
    }
  }

  return (
    <>
      <Tooltip title={title}>
        <div tabIndex={0} role="button" onKeyDown={false} onClick={onChange}>
          <CircularIntegration
            name={iconName}
            onClick={onChange}
            loader={loader}
            disabled={!permission || isDisabled}
            aria-label="circular-progress"
          />
        </div>
      </Tooltip>
    </>
  )
}

ToggleIcon.defaultProps = {
  defaultChecked: false,
  disabled: false,
  errorMessage: '',
  label: '',
  name: '',
  onChangeCallback: undefined
}

export default ToggleIcon
