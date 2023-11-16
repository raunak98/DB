import React, { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import { Grid } from '@mui/material'
import { flexbox } from '@mui/system'
import translate from 'translations/translate'
import { findDomain } from 'helpers/strings'
import * as Styled from './style'
import { storeReviewActionItems } from '../../../../redux/review/reassign/reviewAction.action'
import {
  updateReviewNotificationMessage,
  fetchReviewItemsStart,
  fetchReviewSortStart,
  fetchReviewerSortStart,
  fetchMonitorSortStart,
  fetchReviewFilterStart,
  updatePageSize,
  updatePagenUmber,
  fetchReviewItemsSuccess,
  updateSelectedReviewItems,
  updateShowBigLoader,
  fetchReviewerdataStart,
  fetchReviewPageCount,
  updateGroupPageSize,
  updateGroupPagenUmber,
  fetchMonitordataStart,
  fetchReviewGroupByStart,
  setFilterData
} from '../../../../redux/review/review.action'
import {
  selectSortInfoData,
  selectFilterData,
  selectApplyFilters,
  selectReviewPageSize,
  selectSeach,
  selectReviewPageNumber,
  selectReviewItems,
  selectSelectedReviewItems,
  selectUpdateIsReviewerTabActive,
  selectIsSemiAnnualCampaign,
  selectShowBigLoader,
  selectReviewGroupPageSize,
  selectReviewGropupPageNumber,
  selectCampaignInfo
} from '../../../../redux/review/review.selector'
import { selectGroupAssetsItems } from '../../../../redux/myAssets/myAssets.selector'
import * as adGroupApi from '../../../../api/groupManagement'
import * as usersAPI from '../../../../api/users'
import Error from '../../../../components/error'
import * as reviewApi from '../../../../api/review'
import * as profileAPI from '../../../../api/profile'
import {
  selectProfileDetailsSelector,
  // selectProfileSelector,
  selectProvisioningRoles
} from '../../../../redux/profile/profile.selector'
import SummaryCard from '../SummaryCard'
import Loading from '../../../../components/loading'
import useTheme from '../../../../hooks/useTheme'
import { applicationNamePrefix } from '../../../../helpers/utils'

const ActionModal = ({ closeModal, type, reviewSelectedId }) => {
  const [users, setUsers] = useState([])
  const initialOwner = [
    { id: 'dbagIMSAuthContact', value: '', label: 'Group Authorization Contact' },
    { id: 'dbagIMSAuthContactDelegate', value: '', label: 'Group Authorization Delegate' },
    { id: 'justification', value: '', label: 'Business Justification' }
  ]
  const [selectedUser, setSelectedUser] = useState(
    type === 'transferownership' ? initialOwner : undefined
  )
  const [error, setError] = useState({ isError: false, errMessage: '' })
  const [loader, setLoader] = useState(false)
  const dispatch = useDispatch()
  const sortInfoData = useSelector(selectSortInfoData)
  const filterData = useSelector(selectFilterData)
  const filterArray = useSelector(selectApplyFilters)
  const pageSize = useSelector(selectReviewPageSize)
  const profile = useSelector(selectProfileDetailsSelector)
  const search = useSelector(selectSeach)
  const pageNumber = useSelector(selectReviewPageNumber)
  const isReviewerTabActiveSelector = useSelector(selectUpdateIsReviewerTabActive)
  const reviewItems = useSelector(selectReviewItems)
  // const profileReview = useSelector(selectProfileSelector)
  const isSemiAnnualCampaign = useSelector(selectIsSemiAnnualCampaign)
  const profileDetails = useSelector(selectProfileDetailsSelector)
  const provisioningRoles = useSelector(selectProvisioningRoles)
  const showBigLoader = useSelector(selectShowBigLoader)
  const groupPageSize = useSelector(selectReviewGroupPageSize)
  const groupPageNumber = useSelector(selectReviewGropupPageNumber)
  const campaignDetails = useSelector(selectCampaignInfo)

  // Get selected review items
  const selectedReviewItems = useSelector(selectSelectedReviewItems)
  const selectedGroup = useSelector(selectGroupAssetsItems)

  const [updatedReviewItems, setUpdatedReviewItems] = useState([])
  // const { id } = useParams()
  const location = useLocation()
  const id = location?.state?.id
  const [confirmButton, setConfirmButton] = useState(false)
  const { theme } = useTheme()
  const [signOffCheckbox, setSignOffCheckbox] = useState(!isSemiAnnualCampaign)
  const [isNetworkError, setNetworkError] = useState(false)
  const [failedUsers, setFailedUsers] = useState([])
  const failedUserArr = []
  let userPermissions = {}
  const reassignSuccessMsg = translate('reassign.success')
  const reassignFailureMsg = translate('reassign.failed')
  const transferOwnershipErrorMsg = translate('myAssets.transferOwnership.ErrorMsg')
  const transferOwnershipSuccessMsg = translate('myAssets.transferOwnership.SuccessMsg')
  const noUserErrorMsg = translate('myAssers.noUser')
  const searchLimitErrorMsg = translate('myAssers.searchLimit')

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

  const checkIsPermissionGranted = () => {
    let isSignOffFalseCounter = 0
    updatedReviewItems.map((item) => {
      if (item.checked) {
        userPermissions = item?.permissions
        const keys = Object.entries(item?.permissions || {})
        keys.map((key) => {
          if (key[0] === 'signoff' && !key[1]) {
            isSignOffFalseCounter += 1
          }
          return key
        })
      } else if (reviewSelectedId.length === 1) {
        if (item.id === reviewSelectedId[0]) {
          userPermissions = item?.permissions
          const keys = Object.entries(item?.permissions || {})
          keys.map((key) => {
            if (key[0] === 'signoff' && !key[1]) {
              isSignOffFalseCounter += 1
            }
            return key
          })
        }
      }
      return item
    })
    return isSignOffFalseCounter > 0
  }
  const handleSearch = (value) => {
    if (value.indexOf('(') > -1) {
      return
    }
    if (value.length > 3) {
      setError({ isError: false, errMessage: '' })
      if (type !== 'transferownership') {
        usersAPI
          .searchUsers(value)
          .then((res) => {
            if (res.length > 0) {
              setUsers(res)
              setError({ isError: false, errMessage: '' })
            } else {
              setUsers([])
              setError({ isError: true, errMessage: noUserErrorMsg })
            }
          })
          .catch((err) => {
            console.error(err)
            setUsers([])
          })
      } else {
        usersAPI
          .searchOwnerContact(value)
          .then((res) => {
            if (res && res.length > 0) {
              setUsers(res)
              setError({ isError: false, errMessage: '' })
            } else {
              setUsers([])
              setError({ isError: true, errMessage: noUserErrorMsg })
            }
          })
          .catch((err) => {
            console.error(err)
            setUsers([])
          })
      }
    } else {
      setUsers([])
      setError({ isError: true, errMessage: searchLimitErrorMsg })
    }
  }

  // useCallback provides us the memoized function
  const callDebounce = useCallback(debounce(handleSearch))
  const setConfirmedFalse = () => {
    setConfirmButton(false)
    setSelectedUser([])
  }

  const onCheckboxChange = () => {
    setSignOffCheckbox(!signOffCheckbox)
  }
  const getStatus = () =>
    localStorage.getItem('historyStatus') === 'complete'
      ? 'signed-off,expired,cancelled'
      : 'expired'
  const checkForFilterGroupBy = async (_id) => {
    if (!showBigLoader) {
      dispatch(updateShowBigLoader(true))
    }
    const userInfo = await profileAPI.getUserInfo()
    const certification = await reviewApi.getCampaignInfo(id)
    if (filterArray.length === 2) {
      let response
      if (isReviewerTabActiveSelector) {
        const filterAndGroupByPayload = {
          campaignId: _id,
          status: type === 'History' ? getStatus() : 'in-progress',
          pageSize: groupPageSize,
          pageNumber: groupPageNumber,
          filterBy: filterArray[0]?.id?.type,
          filterByValue: filterArray[0]?.id?.value,
          userRole: 'reviewer',
          userEmail: profileDetails?.mail,
          group: filterArray[1]?.id?.type
        }
        response = await reviewApi.filterAndGroupByForReviewerTabSa(filterAndGroupByPayload)
        if (response?.length > 0) {
          const objEntries = Object.entries(response[response.length - 1])
          dispatch(fetchReviewPageCount(objEntries[0][1]))
        } else {
          dispatch(fetchReviewPageCount(0))
        }
      } else {
        const filterGroupByMonitorPayload = {
          campaignId: _id,
          status: type === 'History' ? getStatus() : 'in-progress',
          pageSize: groupPageSize,
          pageNumber: groupPageNumber,
          filterBy: filterArray[0]?.id?.type,
          filterByValue: filterArray[0]?.id?.value,
          userRole: 'monitor',
          userEmail: profileDetails?.mail
        }
        response = await reviewApi.filterAndGroupByForMonitorTabSa(filterGroupByMonitorPayload)
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
          currentFilter: filterArray[1]?.id?.label,
          // currentFilter2 holds the filter
          currentFilter2: filterArray[0]?.id?.label,
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
          campaignId: _id,
          status: type === 'History' ? getStatus() : 'in-progress',
          userEmail: profileDetails?.mail,
          userRole: 'monitor',
          pageSize: groupPageSize,
          pageNumber: groupPageNumber
        }
        dispatch(fetchMonitordataStart(payload))
      } else if (filterData.currentFilter === 'Reviewer') {
        payload = {
          campaignId: _id,
          decisionStatus: type === 'History' ? getStatus() : 'in-progress',
          userEmail: profileDetails?.mail,
          userRole: 'monitor',
          pageSize: groupPageSize,
          pageNumber: groupPageNumber
        }
        dispatch(fetchReviewGroupByStart(payload))
      } else {
        payload = {
          campaignId: _id,
          group: filterArray[0]?.id?.type,
          startPage: groupPageNumber * groupPageSize,
          endPage: groupPageNumber * groupPageSize + (groupPageSize - 1),
          status: type === 'History' ? getStatus() : 'in-progress'
        }
        const loggedInUserEmail = localStorage.getItem('loggedInUserEmail')
        const payloadForReviewerSa = {
          campaignId: _id,
          group: filterArray[0]?.id?.type,
          pageSize: groupPageSize,
          pageNumber: groupPageNumber,
          status: type === 'History' ? getStatus() : 'in-progress',
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
    } else if (filterArray.length > 0) {
      const payload1 = {
        campaignId: _id,
        filter: filterArray[0].id.type,
        filterValue: filterArray[0].id.value,
        pageSize,
        status: type === 'History' ? getStatus() : 'in-progress'
      }
      if (filterData.currentFilter === 'All') {
        dispatch(fetchReviewFilterStart(payload1))
      }
      dispatch(updateShowBigLoader(false))
      dispatch(updatePageSize(10))
      dispatch(updatePagenUmber(0))
    } else if (search !== '') {
      const payload = {
        campaignId: _id,
        searchItem: search,
        pageSize,
        pageNumber,
        status: type === 'History' ? getStatus() : 'in-progress',
        certType: certification?.description
      }
      const semiAnnualSearchPayload = {
        campaignId: _id,
        searchItem: search,
        status: type === 'History' ? getStatus() : 'in-progress',
        pageSize,
        pageNumber,
        certType: certification?.description,
        userEmail: profileDetails?.mail,
        userRole: 'reviewer'
      }
      let resp
      if (isSemiAnnualCampaign) {
        resp = await reviewApi.searchByReviewerSa(
          semiAnnualSearchPayload,
          userInfo.id,
          certification?.description,
          provisioningRoles
        )
      } else {
        resp = await reviewApi.searchBy(payload, userInfo.id, certification?.description)
      }

      dispatch(updatePageSize(10))
      dispatch(updatePagenUmber(0))
      dispatch(
        fetchReviewItemsSuccess({
          reviewItems: resp
        })
      )
    } else {
      const loggedInUserEmail = localStorage.getItem('loggedInUserEmail')
      const reviewerPayload = {
        campaignId: _id,
        status: type === 'History' ? getStatus() : 'in-progress',
        userEmail: loggedInUserEmail || profileDetails?.mail,
        userRole: 'reviewer',
        pageSize,
        pageNumber
      }
      if (isSemiAnnualCampaign && isReviewerTabActiveSelector) {
        dispatch(fetchReviewerdataStart(reviewerPayload))
      } else {
        dispatch(fetchReviewItemsStart(_id))
      }
      dispatch(updateShowBigLoader(false))
      dispatch(updatePageSize(10))
      dispatch(updatePagenUmber(0))
    }
  }

  const handleReassign = async () => {
    const itemsNotActedUpon = []
    let cDetails
    if (campaignDetails === undefined) {
      cDetails = await reviewApi.getCampaignInfo(id)
    }
    if (selectedUser) {
      setLoader(true)
      let signOffPermission = true
      if (checkIsPermissionGranted()) {
        signOffPermission = false
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const item of selectedUser) {
        const payload = {
          newActorId: `managed/user/${item.id}`,
          permissions: { ...userPermissions, signoff: signOffPermission && signOffCheckbox },
          ids: reviewSelectedId
        }
        dispatch(storeReviewActionItems(payload))

        // eslint-disable-next-line no-await-in-loop
        await reviewApi.takeAction('multireassign', id, payload).then(async (res) => {
          if (res.status === 200) {
            setNetworkError(false)
            if (res.data.idsNotActedOn.length > 0) {
              itemsNotActedUpon.push(res.data.idsNotActedOn.length)
            }
            // the below condition is to send emails for semi annual campaigns because they have turned off the notification at campaign level
            if (
              cDetails?.reassignNotification === null ||
              campaignDetails?.reassignNotification === null
            ) {
              const loggedInUserEmail = localStorage.getItem('loggedInUserEmail')
              const emailPayload = {
                templateName: 'DBADMainCertificationReassigned',
                object: {
                  user: {
                    givenName: item?.givenName,
                    sn: item?.sn
                  },
                  campaign: {
                    name: campaignDetails ? campaignDetails?.name : cDetails?.name,
                    deadline: campaignDetails ? campaignDetails?.deadline : cDetails?.deadline
                  }
                },
                to: item?.mail,
                cc: loggedInUserEmail || profileDetails?.mail
              }
              await reviewApi.sendEmailForReassign(emailPayload).catch((err) => {
                console.log(err)
              })
            }
          } else {
            setLoader(false)
            setNetworkError(true)
            setFailedUsers((prevState) => [...prevState, item.givenName])
            failedUserArr.push(item.givenName)
          }
        })
      }
    }
    setLoader(false)
    closeModal(false)
    dispatch(updateSelectedReviewItems([]))
    // Calling sort API if we didn't apply filter or groupBy
    if (sortInfoData.sortKey !== '' && filterArray.length === 0) {
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
      checkForFilterGroupBy(id)
    }
    if (failedUserArr.length > 0) {
      dispatch(
        updateReviewNotificationMessage({
          type: 'Error',
          message: reassignFailureMsg
        })
      )
    } else {
      dispatch(
        updateReviewNotificationMessage({
          type: 'Success',

          message: reassignSuccessMsg,

          action: 'confirm'
        })
      )
    }
  }

  const responseValueFinder = (groupResponse, fieldId) => {
    const targetIndex = groupResponse.findIndex((field) => field.id === fieldId)
    return groupResponse[targetIndex]?.value
  }

  const sendNotification = (isSuccessful) => {
    dispatch(
      updateReviewNotificationMessage({
        type: isSuccessful ? 'Success' : 'Error',
        message: isSuccessful ? transferOwnershipSuccessMsg : transferOwnershipErrorMsg,
        action: 'confirm'
      })
    )
  }

  const handleTransferOwnership = async () => {
    if (selectedUser) {
      setLoader(true)
      // find the details by id and then prepare the payload
      // const payload = {
      //   searchItem: reviewSelectedId[0],
      //   pageSize: 10
      // }
      let selected
      if (selectedGroup && Object.keys(selectedGroup).length !== 0) {
        selected = selectedGroup?.groupData?.filter((resp) => resp.id === reviewSelectedId[0])

        adGroupApi.setGroupRecord(selected[0]?.groupDetails).then((res) => {
          if (res) {
            const adGroupDetails = {}
            const commonObject = {
              applicationName: `${applicationNamePrefix}${findDomain(
                responseValueFinder(res, 'distinguishedName')
              )}`,
              requestorMail: `${profile.mail}`,
              category: 'AD Group',
              operation: 'Amend',
              groupDN: `${responseValueFinder(res, 'dn')}`,
              requestJustification: selectedUser[2]?.value,
              Accessio_Request_No: '',
              groupDetails: {
                displayName: `${responseValueFinder(res, 'samAccount')}`,
                dbagIMSAuthContact: [selectedUser[0]?.value?.value],
                dbagIMSAuthContactDelegate: [selectedUser[1]?.value?.value]
              }
            }
            adGroupDetails.common = commonObject
            adGroupApi
              .modifyAdGroup(adGroupDetails)
              .then((res1) => {
                if (res1?.status === 200) {
                  sendNotification(true)
                } else {
                  sendNotification(false)
                }
                setLoader(false)
                closeModal(false)
              })
              .catch(() => {
                setLoader(false)
                closeModal(false)
                sendNotification(false)
              })
          } else {
            sendNotification(false)
            setLoader(false)
            closeModal(false)
          }
        })
      }
    }
  }

  const handleClose = () => {
    closeModal(false)
    // Calling sort API if we didn't apply filter or groupBy
    if (sortInfoData.sortKey !== '' && filterArray.length === 0) {
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
      checkForFilterGroupBy(id)
    }
  }
  return confirmButton ? (
    <>
      {loader && <Loading />}
      <SummaryCard
        selectedUser={selectedUser}
        closeModal={() => closeModal(false)}
        setConfirmedFalse={setConfirmedFalse}
        handleReassign={() =>
          type !== 'transferownership' ? handleReassign : handleTransferOwnership
        }
        title={type !== 'transferownership' ? 'Reassign' : 'Transfer Ownership'}
        failedUsers={failedUsers}
        handleClose={() => handleClose}
        modalType={type}
        reviewSelectedId={reviewSelectedId}
      />
      {isNetworkError && failedUsers.length > 0 && (
        <p style={{ color: 'red' }}>
          {translate('popup.reassignmentFailure')}
          {failedUsers.join(', ')}
        </p>
      )}
    </>
  ) : (
    <Styled.MainContainer>
      {type !== 'transferownership' ? (
        <>
          <h3
            style={{
              fontWeight: 'normal',
              fontSize: '31px',
              color: `${theme === 'dark' ? '#FFF' : '#000'}`
            }}
          >
            {translate('review.bulkActions.reassign')}
          </h3>
          {/* We need to add account name later from API */}
          <div style={{ display: 'flex', width: '100%' }}>
            <Autocomplete
              disablePortal
              multiple="true"
              id="tags-outlined"
              options={users}
              getOptionLabel={(option) =>
                typeof option === 'string'
                  ? option
                  : `${option.givenName} ${option.sn} (${option.mail})`
              }
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
                  {`${option.givenName} ${option.sn} (${option.mail})`}
                </Box>
              )}
              sx={{ width: '80%' }}
            />

            <div
              style={{ display: 'flex', justifyContent: 'center', paddingLeft: 40, maxHeight: 56 }}
            >
              <Checkbox
                onChange={() => onCheckboxChange()}
                checked={signOffCheckbox}
                disabled={checkIsPermissionGranted()}
              />
              <div style={{ paddingTop: 15, whiteSpace: 'nowrap' }}>
                {' '}
                {translate('confirm.button.reassign')}
              </div>
            </div>
          </div>
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
        </>
      ) : (
        <>
          <h3
            style={{
              fontWeight: 'normal',
              fontSize: '31px',
              color: `${theme === 'dark' ? '#FFF' : '#000'}`
            }}
          >
            {translate('review.transferOwnership')}
          </h3>
          {error.isError === true && <Error message={error.errMessage} />}
          {/* We need to add account name later from API */}
          <div style={{ display: 'flex', width: '100%', paddingTop: '15px' }}>
            <Grid sx={{ direction: flexbox, width: '100%' }}>
              <Autocomplete
                id="dbagIMSAuthContact"
                options={users}
                getOptionLabel={(option) => (option.label ? option.label : '')}
                getOptionDisabled={(option) => {
                  if (
                    selectedUser &&
                    selectedUser[1]?.value !== '' &&
                    selectedUser[1]?.value !== null &&
                    option?.value === selectedUser[1]?.value?.value
                  ) {
                    return true
                  }
                  return false
                }}
                clearOnBlur={false}
                noOptionsText={null}
                renderInput={(params) => (
                  <TextField
                    required="true"
                    {...params}
                    label={translate('myAssets.authContactTitle')}
                    placeholder={translate('myAssets.authContactPlaceholder')}
                  />
                )}
                onInputChange={(event, newInputValue) => {
                  if (newInputValue !== '') {
                    callDebounce(newInputValue)
                  }
                }}
                onChange={(event, newValue) => {
                  setSelectedUser((updatedOwner) =>
                    updatedOwner.map((item) => {
                      if (item.id === 'dbagIMSAuthContact') {
                        return {
                          ...item,
                          value: newValue
                        }
                      }
                      return item
                    })
                  )
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
                    {option.label}
                  </Box>
                )}
                sx={{ width: '100%', marginBottom: '10px' }}
              />
              <Autocomplete
                id="dbagIMSAuthContactDelegate"
                options={users}
                getOptionLabel={(option) => (option.label ? option.label : '')}
                getOptionDisabled={(option) => {
                  if (
                    selectedUser &&
                    selectedUser[0]?.value !== '' &&
                    selectedUser[0]?.value !== null &&
                    option?.value === selectedUser[0]?.value?.value
                  ) {
                    return true
                  }
                  return false
                }}
                clearOnBlur={false}
                noOptionsText={null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={translate('myAssets.authContactDelegateTitle')}
                    placeholder={translate('myAssets.authContactDelegatePlaceholder')}
                  />
                )}
                onInputChange={(event, newInputValue) => {
                  if (newInputValue !== '') {
                    callDebounce(newInputValue)
                  }
                }}
                onChange={(event, newValue) => {
                  setSelectedUser((updatedOwner) =>
                    updatedOwner.map((item) => {
                      if (item.id === 'dbagIMSAuthContactDelegate') {
                        return {
                          ...item,
                          value: newValue
                        }
                      }
                      return item
                    })
                  )
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
                    {option.label}
                  </Box>
                )}
                sx={{ width: '100%', marginBottom: '10px' }}
              />
              <TextField
                sx={{ width: '100%' }}
                id="justification"
                label={translate('myAssets.justification')}
                multiline
                rows={2}
                required="true"
                title={translate('myAssets.justification')}
                onChange={(e) => {
                  setSelectedUser((updatedOwner) =>
                    updatedOwner.map((item) => {
                      if (item.id === 'justification') {
                        return {
                          ...item,
                          value: e.target.value
                        }
                      }
                      return item
                    })
                  )
                }}
              />
            </Grid>
          </div>
          <Styled.ForwardButtonWrapper>
            <Button
              variant="outlined"
              sx={{
                color: `${theme === 'dark' ? '#FFF' : '#000'}`,
                borderColor: ' 1px solid rgba(255, 255, 255, 0.4);'
              }}
              disabled={
                !selectedUser ||
                !selectedUser.length ||
                selectedUser[0].value === null ||
                selectedUser[2].value === null ||
                selectedUser[2].value === undefined ||
                selectedUser[0].value === '' ||
                selectedUser[2].value === ''
              }
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
        </>
      )}
    </Styled.MainContainer>
  )
}

export default ActionModal
