import React, { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@mui/material'
import { useLocation } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import translate from 'translations/translate'

import { selectProfileDetailsSelector } from 'redux/profile/profile.selector'
import * as Styled from './style'
import * as usersAPI from '../../../../api/users'
import * as reviewAPI from '../../../../api/review'
import Error from '../../../../components/error'
import Loading from '../../../../components/loading'
import {
  fetchReviewItemsStart,
  updateReviewNotificationMessage,
  fetchReviewSortStart,
  fetchReviewFilterStart,
  updatePageSize,
  updatePagenUmber,
  fetchReviewGroupByStart,
  updateShowBigLoader,
  updateSelectedReviewItems,
  fetchReviewerdataStart,
  fetchMonitordataStart,
  fetchReviewPageCount,
  setFilterData,
  updateGroupPageSize,
  updateGroupPagenUmber,
  fetchReviewerSortStart,
  fetchMonitorSortStart
} from '../../../../redux/review/review.action'
import {
  selectSortInfoData,
  selectFilterData,
  selectApplyFilters,
  selectReviewPageSize,
  selectSelectedReviewItems,
  selectReviewTypeStatus,
  selectReviewPageNumber,
  selectReviewGroupPageSize,
  selectReviewGropupPageNumber,
  selectShowBigLoader,
  selectReviewItems,
  selectIsSemiAnnualCampaign,
  selectUpdateIsReviewerTabActive,
  selectCampaignInfo
} from '../../../../redux/review/review.selector'
// import { selectProfileSelector } from '../../../../redux/profile/profile.selector'
import SummaryCard from '../SummaryCard'
import useTheme from '../../../../hooks/useTheme'

const ReviewForward = ({ closeModal, reviewSelectedId, type }) => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState([])
  const [error, setError] = useState({ isError: false, errMessage: '' })
  const [loader, setLoader] = useState(false)
  const dispatch = useDispatch()
  // const match = useRouteMatch()
  const location = useLocation()
  const reviewId = location?.state?.id
  const [confirmButton, setConfirmButton] = useState(false)
  const { theme } = useTheme()
  const sortInfoData = useSelector(selectSortInfoData)
  const filterData = useSelector(selectFilterData)
  const appliedFilter = useSelector(selectApplyFilters)
  const pageSize = useSelector(selectReviewPageSize)
  const pageNumber = useSelector(selectReviewPageNumber)
  const [failedUsers, setFailedUsers] = useState([])
  const [isNetworkError, setNetworkError] = useState(false)
  const reviewItems = useSelector(selectReviewItems)
  const selectedReviewItems = useSelector(selectSelectedReviewItems)
  const profileDetails = useSelector(selectProfileDetailsSelector)
  // const profile = useSelector(selectProfileSelector)
  const getReviewStatus = useSelector(selectReviewTypeStatus)
  const groupPageSize = useSelector(selectReviewGroupPageSize)
  const groupPageNumber = useSelector(selectReviewGropupPageNumber)
  const showBigLoader = useSelector(selectShowBigLoader)
  const isSemiAnnualCampaign = useSelector(selectIsSemiAnnualCampaign)
  const isReviewerTabActiveSelector = useSelector(selectUpdateIsReviewerTabActive)
  const campaignDetails = useSelector(selectCampaignInfo)
  const failedUserArr = []
  // debounce calls every 500 seconds
  const debounce = (func) => {
    let timer
    return (...args) => {
      const context = this
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        func.apply(context, args)
      }, 500)
    }
  }
  const handleSearch = (value) => {
    if (value.length > 3) {
      usersAPI
        .searchUsers(value)
        .then((res) => {
          if (res.length > 0) {
            setUsers(res)
            setError({ isError: false, errMessage: '' })
          } else {
            setUsers([])
            setError({ isError: true, errMessage: 'No users found' })
          }
        })
        .catch((err) => {
          console.error(err)
        })
    } else {
      setUsers([])
      setError({ isError: true, errMessage: 'Enter more than 3 characters' })
    }
  }

  const setConfirmedFalse = () => {
    setConfirmButton(false)
    setSelectedUser([])
  }
  // useCallback provides us the memoized function
  const callDebounce = useCallback(debounce(handleSearch))

  const checkForFilterAndGroupBy = async (id) => {
    if (!showBigLoader) {
      dispatch(updateShowBigLoader(true))
    }
    if (appliedFilter.length === 2) {
      let response
      if (isReviewerTabActiveSelector) {
        const filterAndGroupByPayload = {
          campaignId: id,
          status: getReviewStatus,
          pageSize: groupPageSize,
          pageNumber: groupPageNumber,
          filterBy: appliedFilter[0]?.id?.type,
          filterByValue: appliedFilter[0]?.id?.value,
          userRole: 'reviewer',
          userEmail: profileDetails?.mail,
          group: appliedFilter[1]?.id?.type
        }
        response = await reviewAPI.filterAndGroupByForReviewerTabSa(filterAndGroupByPayload)
        if (response?.length > 0) {
          const objEntries = Object.entries(response[response.length - 1])
          dispatch(fetchReviewPageCount(objEntries[0][1]))
        } else {
          dispatch(fetchReviewPageCount(0))
        }
      } else {
        const filterGroupByMonitorPayload = {
          campaignId: id,
          status: getReviewStatus,
          pageSize: groupPageSize,
          pageNumber: groupPageNumber,
          filterBy: appliedFilter[0]?.id?.type,
          filterByValue: appliedFilter[0]?.id?.value,
          userRole: 'monitor',
          userEmail: profileDetails?.mail
        }
        response = await reviewAPI.filterAndGroupByForMonitorTabSa(filterGroupByMonitorPayload)
        if (response?.length > 0) {
          const objEntries = Object.entries(response[response.length - 1])
          dispatch(fetchReviewPageCount(objEntries[0][1]))
        } else {
          dispatch(fetchReviewPageCount(0))
        }
      }
      dispatch(
        setFilterData({
          // currentFilter holds the groupBy
          currentFilter: appliedFilter[1]?.id?.label,
          // currentFilter2 holds the filter
          currentFilter2: appliedFilter[0]?.id?.label,
          data: response !== undefined ? response : []
        })
      )
      dispatch(updateShowBigLoader(false))
      dispatch(updateGroupPageSize(10))
      dispatch(updateGroupPagenUmber(0))
    } else if (filterData.currentFilter !== 'All') {
      let payload
      if (filterData.currentFilter === 'Reviewer' && isSemiAnnualCampaign) {
        payload = {
          campaignId: id,
          status: getReviewStatus,
          userEmail: profileDetails?.mail,
          userRole: 'monitor',
          pageSize: groupPageSize,
          pageNumber: groupPageNumber
        }
        dispatch(fetchMonitordataStart(payload))
      } else if (filterData.currentFilter === 'Reviewer') {
        payload = {
          campaignId: id,
          decisionStatus: getReviewStatus,
          userEmail: profileDetails?.mail,
          userRole: 'monitor',
          pageSize: groupPageSize,
          pageNumber: groupPageNumber
        }
        dispatch(fetchReviewGroupByStart(payload))
      } else {
        payload = {
          campaignId: id,
          group: appliedFilter[0]?.id?.type,
          startPage: groupPageNumber * groupPageSize,
          endPage: groupPageNumber * groupPageSize + (groupPageSize - 1),
          status: getReviewStatus
        }
        const loggedInUserEmail = localStorage.getItem('loggedInUserEmail')
        const payloadForReviewerSa = {
          campaignId: id,
          group: appliedFilter[0]?.id?.type,
          pageSize: groupPageSize,
          pageNumber: groupPageNumber,
          status: getReviewStatus,
          userRole: 'reviewer',
          userEmail: loggedInUserEmail || profileDetails?.mail
        }
        if (isSemiAnnualCampaign) {
          dispatch(fetchReviewGroupByStart(payloadForReviewerSa))
        } else {
          dispatch(fetchReviewGroupByStart(payload))
        }
      }
      dispatch(updateShowBigLoader(false))
      dispatch(updateGroupPageSize(10))
      dispatch(updateGroupPagenUmber(0))
    } else if (appliedFilter.length > 0) {
      const payload1 = {
        campaignId: id,
        filter: appliedFilter[0].id.type,
        filterValue: appliedFilter[0].id.value,
        pageSize
      }
      if (filterData.currentFilter === 'All') {
        dispatch(fetchReviewFilterStart(payload1))
      }
      dispatch(updateShowBigLoader(false))
      dispatch(updatePageSize(10))
      dispatch(updatePagenUmber(0))
    } else if (isSemiAnnualCampaign) {
      const reviewerPayload = {
        campaignId: id,
        status: getReviewStatus,
        userEmail: profileDetails?.mail,
        userRole: 'reviewer',
        pageSize,
        pageNumber
      }
      dispatch(fetchReviewerdataStart(reviewerPayload))
      dispatch(updateShowBigLoader(false))
      dispatch(updatePageSize(10))
      dispatch(updatePagenUmber(0))
    } else {
      dispatch(fetchReviewItemsStart(id))
      dispatch(updateShowBigLoader(false))
      dispatch(updatePageSize(10))
      dispatch(updatePagenUmber(0))
    }
  }

  const handleForward = async () => {
    const itemsNotActedUpon = []
    // let cDetails
    if (campaignDetails === undefined) {
      // cDetails = await reviewAPI.getCampaignInfo(reviewId)
    }
    if (selectedUser) {
      setLoader(true)
      // const selectedUsersList = selectedUser.map((usr) => `${usr?.givenName} ${usr?.sn}`).join(',')
      // eslint-disable-next-line no-restricted-syntax
      for (const itm of reviewSelectedId) {
        let itmObject
        if (type === 'bulkForward') {
          itmObject = selectedReviewItems.filter((lineItem) => lineItem.id === itm)
        } else {
          itmObject = reviewItems.filter((lineItem) => lineItem.id === itm)
        }
        // updating id's of users by adding managed/user for payload
        const updatedSelectedUsers = selectedUser.map((user) => {
          if (user.id) {
            return { ...user, id: `managed/user/${user.id}` }
          }
          return user
        })

        // Fetching already avaialble object's id
        const availableIds = itmObject[0].actors.map((actor) => actor.id)

        // Removing the object from updatedSelectedUsers if it's already present in itmObject[0].actors
        const newlySelectedUsers = updatedSelectedUsers.filter(
          (user) => !availableIds.includes(user.id)
        )

        // Adding the permission in newly selected items
        const newlySelectedItemsWithPermission = newlySelectedUsers.map((user) => ({
          ...user,
          permissions: itmObject[0]?.permissions
        }))

        // All the new users and actual users of the lineitem
        const allUsersList = [...itmObject[0].actors, ...newlySelectedItemsWithPermission]

        let updatedActorsObject = []
        if (appliedFilter[0]?.id?.label === 'Reviewer') {
          updatedActorsObject = allUsersList.filter(
            (user) => user.mail !== filterData?.groupByValue
          )
        } else {
          updatedActorsObject = allUsersList.filter(
            // eslint-disable-next-line no-underscore-dangle
            (usr) => !usr.id.includes(profileDetails?._id) // removing the user who is forwrding the line item
          )
        }

        const payload = {
          actors: updatedActorsObject
          // campaignName: campaignDetails ? campaignDetails.name : cDetails?.name,
          // campaignDeadline: campaignDetails ? campaignDetails.deadline : cDetails?.deadline
        }
        // eslint-disable-next-line no-await-in-loop
        await reviewAPI
          .forwardActors(itm, payload)
          .then((resp) => {
            if (resp.status === 200) {
              setNetworkError(false)
              // const commentPayload = {
              //   items: [
              //     {
              //       id: itm,
              //       comments: [
              //         {
              //           action: 'comment',
              //           comment: `${profile?.firstName} ${profile?.lastName} Forwarded item to ${selectedUsersList}`,
              //           user: {
              //             _id: profile.userId
              //           }
              //         }
              //       ]
              //     }
              //   ]
              // }
              // await reviewAPI.reviewComment('addcomment', reviewId, commentPayload)
              if (resp?.data?.idsNotActedOn?.length > 0) {
                itemsNotActedUpon.push(resp.data.idsNotActedOn.length)
              }
            } else {
              setLoader(false)
              setNetworkError(true)
              setFailedUsers((prevState) => [...prevState, itm])
              // failedUserArr.push(item.givenName)
            }
          })
          .catch(() => {
            // setFailedUsers((prevState) => [...prevState, item?.userName])
            updateReviewNotificationMessage({
              type: 'Error',
              message: `Forwarding of item(s) failed for ${itm}`,
              action: 'confirm'
            })
            setLoader(false)
            closeModal(false)
          })
      }
    } else if (users.length === 0) {
      setError({ isError: true, errMessage: 'Search users' })
    } else {
      setUsers([])
      setError({ isError: true, errMessage: 'No user selected' })
    }
    const successRecordCount =
      selectedUser.length * reviewSelectedId.length -
      itemsNotActedUpon.reduce((partialSum, a) => partialSum + a, 0)
    if (itemsNotActedUpon.length > 0) {
      dispatch(
        updateReviewNotificationMessage({
          type: 'Error',
          message: `Forwarding failed for ${itemsNotActedUpon.reduce(
            (partialSum, a) => partialSum + a,
            0
          )} Item(s)`
        })
      )
      if (successRecordCount === 0) {
        setLoader(false)
        closeModal(false)
      }
    }
    if (successRecordCount > 0) {
      setTimeout(() => {
        if (failedUserArr.length === 0) {
          setLoader(false)
          closeModal(false)
          dispatch(updateSelectedReviewItems([]))
          // Calling sort API if we didn't apply filter or groupBy
          if (sortInfoData.sortKey !== '' && appliedFilter.length === 0) {
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
            checkForFilterAndGroupBy(reviewId)
          }

          dispatch(
            updateReviewNotificationMessage({
              type: 'Success',
              message: `Forwarding of ${
                reviewSelectedId.length === 0 ? 1 : successRecordCount
              } item(s) has been completed successfully`,
              action: 'confirm'
            })
          )
          if (failedUserArr.length > 0) {
            failedUserArr.splice(0, failedUserArr.length)
          }
        } else {
          // Calling sort API if we didn't apply filter or groupBy
          if (sortInfoData.sortKey !== '' && appliedFilter.length === 0) {
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
            checkForFilterAndGroupBy(reviewId)
          }
          dispatch(updateSelectedReviewItems([]))
          dispatch(
            updateReviewNotificationMessage({
              type: 'Success',
              message: `Forwarding of ${
                reviewSelectedId.length === 0 ? 1 : successRecordCount
              } item(s) has been completed successfully`,
              action: 'confirm'
            })
          )
          setLoader(false)
          closeModal(false)
        }
      }, 7000)
    }
  }

  return confirmButton ? (
    <>
      {loader && <Loading />}
      <SummaryCard
        selectedUser={selectedUser}
        closeModal={() => closeModal(false)}
        setConfirmedFalse={setConfirmedFalse}
        handleReassign={() => handleForward}
        title="Forward"
        reviewSelectedId={reviewSelectedId}
        failedUsers={failedUsers}
        // handleClose={() => handleClose}
      />
      {isNetworkError && failedUsers.length > 0 && (
        <p style={{ color: 'red' }}>
          Forwarding of item(s) failed for
          {failedUsers.join(', ')}
        </p>
      )}
    </>
  ) : (
    <Styled.MainContainer>
      <h3
        style={{
          fontWeight: 'normal',
          fontSize: '31px',
          color: `${theme === 'dark' ? '#FFF' : '#000'}`
        }}
      >
        {translate('review.bulkActions.forward')}
      </h3>

      <Autocomplete
        disablePortal
        multiple
        id="tags-outlined"
        options={users}
        getOptionLabel={(option) => (option ? option.mail : '')}
        isOptionEqualToValue={(option, value) => option.mail === value.mail}
        filterSelectedOptions
        clearOnBlur={false}
        noOptionsText={null}
        renderInput={(params) => (
          <TextField {...params} label="User Name" placeholder="Type to search for user" />
        )}
        onInputChange={(event, newInputValue) => {
          if (newInputValue !== '') {
            callDebounce(newInputValue)
          }
        }}
        onChange={(event, newValue) => {
          setSelectedUser(newValue)
        }}
        renderOption={(props, option) => (
          <Box
            {...props}
            sx={{
              backgroundColor: `${theme === 'dark' ? '#182B44' : '#FFF'} !important`,
              '&:hover,&:focus': {
                backgroundColor: `${theme === 'dark' ? '#3C485A' : '#EEE'} !important`
              }
            }}
          >
            {option.mail}
          </Box>
        )}
      />

      {error.isError === true && <Error message={error.errMessage} />}
      <Styled.ForwardButtonWrapper>
        <Button
          variant="outlined"
          sx={{
            color: `${theme === 'dark' ? '#FFF' : '#000'}`,
            borderColor: ' 1px solid rgba(255, 255, 255, 0.4);'
          }}
          disabled={!selectedUser?.length > 0 || selectedUser[0] === null}
          onClick={() => setConfirmButton(true)}
        >
          {translate('seeSummary.button')}
        </Button>
        <Button
          onClick={() => closeModal(false)}
          sx={{ marginRight: '8px', color: `${theme === 'dark' ? '#FFF' : '#000'}` }}
        >
          {translate('cancel.button')}
        </Button>
      </Styled.ForwardButtonWrapper>
    </Styled.MainContainer>
  )
}

export default ReviewForward
