/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { useLocation, useRouteMatch } from 'react-router-dom'
import translate from 'translations/translate'
import { defineColumns, defineRows, filterArrayfunction } from 'helpers/arrays'
import { useParams } from 'react-router-dom'
import ManageItems from 'advancedComponents/modals/manageItems'
import Filter from 'components/filter'
import MSearchBox from 'components/mSearchBox'
import { Button } from '@mui/material'
import ReviewReassign from '../../../../../src/pageComponents/Review/Dropbox/Reassign'
import ReviewForward from '../../../../../src/pageComponents/Review/Dropbox/Forward'
import ReviewSendEmail from '../../../../../src/pageComponents/Review/Dropbox/SendEmail'
import ReviewAllowExceptions from '../../../../../src/pageComponents/Review/Dropbox/AllowExceptions'
import ReviewComments from '../../../../../src/pageComponents/Review/PopupLink/Comments'
import * as Styled from './style'
import GenericModal from '../../../../components/genericModal'
import ReviewTable from '../../../../pageComponents/Review/ReviewTable'
import ReviewSummary from '../../../../pageComponents/Review/Summary'
import Loading from '../../../../components/loading'
import { blue } from '@mui/material/colors'
import CircularProgress from '@mui/material/CircularProgress'
import GroupedReviewTable from '../../../../pageComponents/Review/GroupedReviewTable'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectReviewItems,
  selectReviewMetadata,
  isReviewFetching,
  selectShowSmallLoader,
  selectShowBigLoader,
  selectApplyFilters,
  selectReviewPageSize,
  selectReviewPageNumber,
  selectReviewGropupPageNumber,
  selectReviewGroupPageSize,
  selectFilterData,
  selectSortInfoData,
  selectReviewTypeStatus,
  selectIsGoingForwardFlag,
  selectPaginationKeys,
  selectSeach,
  selectCampaignInfo,
  selectCertification,
  selectUpdateIsMonitor,
  selectSelectedReviewItems,
  selectMultiSelectLimit,
  selectReviewPageCount,
  selectNormalizedMonitorData
} from '../../../../redux/review/review.selector'
import {
  fetchReviewFilterStart,
  fetchReviewItemsStart,
  fetchReviewMetadataStart,
  updateReviewNotificationMessage,
  updateShowSmallLoader,
  updateShowBigLoader,
  setFilterData,
  applyFilters,
  fetchReviewItemsSuccess,
  fetchReviewSortStart,
  updatePagenUmber,
  updatePageSize,
  updatePaginationKeys,
  updateGroupPageSize,
  updateGroupPagenUmber,
  updateSortInfoData,
  updateSearch,
  updateGroupByKey,
  updateIsMonitor,
  updateCertification,
  updateSelectedReviewItems,
  fetchReviewPageCount,
  updateNormalizedMonitorData,
  updateIsSemiAnnualCampaign
} from '../../../../redux/review/review.action'

import {
  updatePageSizeReviews,
  updatePageNumberReviews
} from '../../../../redux/reviews/reviews.action'

import { selectReassignItems } from '../../../../redux/review/reassign/reviewAction.selector'
import * as reviewApi from '../../../../api/review'
import { generateOptions } from '../../../../helpers/table'
import Breadcrumb from 'components/breadcrumb'
import { Breadcrumbs, Typography } from '@mui/material'
import ActionModal from '../../../../pageComponents/Review/Dropbox/ActionModal'
import AppliedFilter from '../../../../components/appliedFilter'
import DropdownFilter from '../../../../components/dropdownFilter'
import { setReviewTypeStatue } from '../../../../redux/review/review.action'
import { Link } from 'react-router-dom'
import useTheme from '../../../../hooks/useTheme'
import Icon from 'components/icon'
import { selectProfileDetailsSelector } from '../../../../redux/profile/profile.selector'
import { notificationMessageStrings } from '../../../../helpers/language'
import * as profileAPI from 'api/profile'

const Review = () => {
  const [signOffItems, setSignOffItems] = useState([])
  const [smallLoader, setSmallLoader] = useState(false)
  const [certification, setCertification] = useState('')
  const [showConfirmButton, setShowConfirmButton] = React.useState(true)
  const [showDecesionToast, setShowDecesionToast] = useState(false)
  const isGoingForward = useSelector(selectIsGoingForwardFlag)
  const paginationKeysArray = useSelector(selectPaginationKeys)

  // Get review name
  const match = useRouteMatch()
  const location = useLocation()
  const reviewId = location?.state?.id
  const reviewName = location?.state?.name || reviewId
  const type = location?.state?.type || 'active'
  localStorage.setItem('reviewOrHistoryPage', type)
  const StatusArray = [
    { value: 'Active', text: 'Active' },
    { value: 'Confirmed', text: 'Confirmed' }
  ]

  const [statusArrayValue, setStatusArrayValue] = useState('Active')
  // Get review items
  const reviewItems = useSelector(selectReviewItems)

  // Get selected review items
  const selectedReviewItems = useSelector(selectSelectedReviewItems)

  const [updatedReviewItems, setUpdatedReviewItems] = useState([])
  const reviewMetadata = useSelector(selectReviewMetadata)
  const reassignData = useSelector(selectReassignItems)
  const isFetching = useSelector(isReviewFetching)
  const showSmallLoading = useSelector(selectShowSmallLoader)
  const showBigLoader = useSelector(selectShowBigLoader)
  const filterArray = useSelector(selectApplyFilters)
  const pageSize = useSelector(selectReviewPageSize)
  const pageNumber = useSelector(selectReviewPageNumber)
  const sortInfoData = useSelector(selectSortInfoData)
  const campaignInfo = useSelector(selectCampaignInfo)

  const groupPageSize = useSelector(selectReviewGroupPageSize)
  const groupPageNumber = useSelector(selectReviewGropupPageNumber)
  const filterData = useSelector(selectFilterData)
  const profileDetails = useSelector(selectProfileDetailsSelector)
  const getReviewStatus = useSelector(selectReviewTypeStatus)
  const search = useSelector(selectSeach)
  const reviewCertification = useSelector(selectCertification)
  const monitorSel = useSelector(selectUpdateIsMonitor)
  const multiSelectLimit = useSelector(selectMultiSelectLimit)
  const pageCount = useSelector(selectReviewPageCount)
  const normalizedMonitorData = useSelector(selectNormalizedMonitorData)

  // const { id } = useParams()
  const id = location?.state?.id
  const total =
    updatedReviewItems && updatedReviewItems.length > 0 ? updatedReviewItems[0].total : 0

  const { theme } = useTheme()
  // Manage columns modal
  const [open, setOpen] = useState(false)
  const [bulkActionsOptions, setBulkActionOptions] = useState({
    openModal: false,
    typeOfAction: null
  })
  const [reviewtasks, setReviewTasks] = useState([])
  const [reviewActors, setReviewActors] = useState([])
  const [completionStatus, setCompletionStatus] = useState(0)
  const [totolStatus, setTotolStatus] = useState(0)
  const [selectionLimitPopup, setSelectionLimitPopup] = useState(false)

  const getActionModal = () => {
    switch (bulkActionsOptions.typeOfAction) {
      case 'sendEmail':
        return <ReviewSendEmail closeModal={handleBulkActionsModal} />
      case 'forward':
        return (
          <ReviewForward
            closeModal={handleBulkActionsModal}
            reviewSelectedId={reviewtasks}
            type="bulkForward"
          />
        )
      case 'reassign':
        return (
          <ActionModal
            closeModal={handleBulkActionsModal}
            reviewSelectedId={reviewtasks}
            reviewActors={reviewActors}
            type={type}
          />
        )
      case 'allowExceptions':
        return (
          <ReviewAllowExceptions
            closeModal={handleBulkActionsModal}
            multiple
            action={bulkActionsOptions.typeOfAction}
          />
        )
      case 'revoke':
        return (
          <ReviewComments
            type="revoke"
            handleClose={handleBulkActionsModal}
            reviewId={reviewtasks}
            onCallback={() => {}}
          />
        )

      default:
        return
    }
  }

  // Manage columns modal
  const [signOffModal, setSignOffModal] = useState(false)
  const [actionCount, setActionCount] = useState(0)
  const [age, setAge] = React.useState('action')

  // Set data for review page
  const [data, setData] = useState({
    // Table data
    columns: [],
    rows: [],
    paginationSizes: undefined,
    hasSortableColumns: false,
    initialSortColumnId: '',
    bulkActions: [],

    // Filter by
    filterResultsOptions: [],
    defaultFilterResultsId: 'All',

    // Group by
    groupResultsOptions: [],
    defaultGroupResultsId: 'All',

    // Search
    search: ''
  })

  const manageColumnsModalId = 'review-manageColumns'

  const updateDisplayedColumns = (column, onDefault) => {
    onDefault
      ? localStorage.removeItem(certification)
      : localStorage.setItem(certification, JSON.stringify(column))
    const columns = defineColumns(column, filterData.currentFilter !== 'All', type)
    const rows = defineRows(column, updatedReviewItems, type)
    setData({
      ...data,
      columns,
      rows
    })
    setOpen(false)
  }

  useEffect(() => {
    if (selectedReviewItems?.length !== 0) {
      const updatedItems =
        reviewItems?.length > 0 &&
        reviewItems.map((reviewItem) => {
          // Checking if we have already selected item
          const checkedItem = selectedReviewItems.find(
            (selectedReviewItem) => selectedReviewItem.id === reviewItem.id
          )
          return checkedItem ? { ...reviewItem, checked: true } : reviewItem
        })
      if (updatedItems?.length > 0) {
        setUpdatedReviewItems([...updatedItems])
      } else {
        setUpdatedReviewItems([])
      }
    } else if (reviewItems?.length > 0) {
      setUpdatedReviewItems([...reviewItems])
    } else {
      setUpdatedReviewItems([])
    }
  }, [reviewItems])

  useEffect(() => {
    return () => {
      dispatch(fetchReviewItemsSuccess({ reviewItems: [] }))
      dispatch(applyFilters([]))
      dispatch(updateSearch(''))
      dispatch(updateCertification(''))
      dispatch(updateSelectedReviewItems([]))
      dispatch(
        setFilterData({
          currentFilter: 'All',
          data: [],
          default: true
        })
      )
      dispatch(updatePageSize(10))
      dispatch(updatePagenUmber(0))
      dispatch(updatePageSizeReviews(10))
      dispatch(updatePageNumberReviews(0))
      localStorage.removeItem('searchValue')
    }
  }, [])

  useEffect(async () => {
    let status = type === 'History' ? getStatus() : 'in-progress'
    localStorage.setItem('isGroup', false)
    localStorage.removeItem('searchValue')
    localStorage.setItem('certificationId', '')
    dispatch(updateIsSemiAnnualCampaign(false))
    dispatch(updateSearch(''))
    await reviewApi.getCampaignInfo(reviewId).then((res) => {
      dispatch(updateCertification(res?.description))
      setCertification(res?.description)
    })

    await reviewApi.getCompletionStatus(reviewId, status).then((res) => {
      setCompletionStatus(res.totals.total - (res.totals.NONE ? res.totals.NONE : 0))
      setTotolStatus(res.totals.total)
    })
  }, [])

  useEffect(async () => {
    dispatch(updateShowSmallLoader(true))
    let status = type === 'History' ? getStatus() : 'in-progress'
    if (updatedReviewItems && updatedReviewItems.length > 0) {
      await reviewApi.getCompletionStatus(reviewId, status).then((res) => {
        setCompletionStatus(res.totals.total - (res.totals.NONE ? res.totals.NONE : 0))
        setTotolStatus(res.totals.total)
        dispatch(updateShowSmallLoader(false))
      })
    } else {
      dispatch(updateShowSmallLoader(false))
    }
    dispatch(updateShowBigLoader(false))
  }, [updatedReviewItems])
  useEffect(() => {
    if (updatedReviewItems && updatedReviewItems.length > 0) {
      for (const item of updatedReviewItems) {
        if (item.action === null && item.checked && completionStatus !== 0) {
          setShowDecesionToast(true)
        }
      }
    }
  }, [updatedReviewItems])
  useEffect(() => {
    if (showDecesionToast) {
      setTimeout(() => {
        // dispatch here
        setShowDecesionToast(false)
      }, 5000)
    }
  }, [showDecesionToast])

  const iff = (consition, then, otherise) => (consition ? then : otherise)

  const getStatus = () => {
    return localStorage.getItem('historyStatus') === 'complete'
      ? 'signed-off,expired,cancelled'
      : 'expired'
  }
  const filterReviews = (filterArray) => {
    let payload = {
      campaignId: reviewId,
      filter: filterArray[0].id.type,
      filterValue: filterArray[0].id.value,
      pageSize: pageSize,
      pageNumber,
      certificationName: certification,
      status: type === 'History' ? getStatus() : 'in-progress'
    }
    if (pageNumber > 0) {
      if (!isGoingForward && paginationKeysArray.length > 0) {
        paginationKeysArray.pop()
        dispatch(updatePaginationKeys(paginationKeysArray))
      }
      const paginationKey = isGoingForward
        ? iff(
            updatedReviewItems.length > 0,
            updatedReviewItems[updatedReviewItems.length - 1].sort.sort[0],
            ''
          )
        : iff(paginationKeysArray, paginationKeysArray.slice(-1)[0], '')
      payload = {
        ...payload
        // search_after_primaryKey: paginationKey
      }
    }
    dispatch(fetchReviewFilterStart(payload))
  }

  const dispatch = useDispatch()
  useEffect(() => {
    if (
      filterArray &&
      filterArray.length &&
      filterData.currentFilter === 'All' &&
      !JSON.parse(localStorage.getItem('isGroup'))
    ) {
      filterReviews(filterArray)
    }
    dispatch(updateGroupByKey(null))
  }, [filterArray])

  useEffect(() => {
    if (filterData.currentFilter !== 'All' && filterArray.length) {
      handleFilterByGroup(filterArray)
    }
  }, [groupPageNumber, groupPageSize])

  useEffect(async () => {
    dispatch(setReviewTypeStatue(type === 'History' ? getStatus() : 'in-progress'))
    dispatch(fetchReviewMetadataStart(reviewId))
    dispatch(updateShowBigLoader(true))
    dispatch(fetchReviewItemsStart(reviewId))
  }, [])

  const checkForFilter = async () => {
    if (filterData.currentFilter === 'All' && filterArray.length > 0) {
      let payload = {
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
        const paginationKey = paginationKeysArray.slice(-1)[0]
        payload = {
          ...payload
          // search_after_primaryKey: paginationKey
        }
      }
      if (filterData.currentFilter === 'All') {
        dispatch(fetchReviewFilterStart(payload))
      }
    } else if (search !== '') {
      const userInfo = await profileAPI.getUserInfo()
      let payload

      payload = {
        campaignId: reviewId,
        searchItem: search,
        pageSize: pageSize,
        pageNumber,
        status: type === 'History' ? getStatus() : 'in-progress',
        certType: certification
      }
      const resp = await reviewApi.searchBy(payload, userInfo.id, certification)
      dispatch(
        fetchReviewItemsSuccess({
          reviewItems: resp
        })
      )
    } else {
      dispatch(fetchReviewItemsStart(reviewId))
    }
  }

  const handleConfirm = async () => {
    if (reassignData.action === 'Forward' || reassignData.action === 'AllowExceptions') {
      sortInfoData.sortKey !== ''
        ? dispatch(fetchReviewSortStart(sortInfoData.payload))
        : checkForFilter()
    }
    dispatch(
      updateReviewNotificationMessage({
        type: 'success',
        message: `requestsubmission.success`
      })
    )
  }

  useEffect(async () => {
    if (!!updatedReviewItems && !!reviewMetadata && reviewCertification.length !== 0) {
      let columns
      let rows
      const localStoragedata2 = JSON.parse(localStorage.getItem(certification))
      if (localStoragedata2 !== null && localStoragedata2 !== undefined) {
        columns = defineColumns(localStoragedata2, filterData.currentFilter !== 'All', type)
        rows = defineRows(localStoragedata2, updatedReviewItems, type, certification)
      } else {
        columns = defineColumns(reviewMetadata.columns, filterData.currentFilter !== 'All', type)
        rows = defineRows(reviewMetadata.columns, updatedReviewItems, type, certification)
      }
      const certificationType = [
        'WIN_UNIX_DB_DBPASSPORT_FOBO',
        'AAA_WIN_UNIX_DB_DBPASSPORT_MOV',
        'SECURITY_ADGROUP',
        'SECURITY_VDRGROUP'
      ].includes(reviewCertification)

      if (updatedReviewItems.length) {
        let isMonitor = checkIsMonitor(updatedReviewItems[0].actors)
        dispatch(updateIsMonitor(isMonitor))
      }
      if (
        updatedReviewItems.length &&
        filterData?.default &&
        !certificationType &&
        search.length === 0
      ) {
        const defaultGroup = [{ id: reviewMetadata.groupBy.filter((data) => data.default)[0] }]

        if (defaultGroup[0]?.id?.type) {
          dispatch(applyFilters(defaultGroup))
          handleFilterByGroup(defaultGroup)
          localStorage.setItem('isGroup', true)
        }
      } else if (
        updatedReviewItems.length &&
        filterData?.default &&
        certificationType &&
        search.length === 0 &&
        updatedReviewItems[0]?.actors.length &&
        checkIsMonitor(updatedReviewItems[0].actors)
      ) {
        //Added these changes to check if itbelongs to a group of certification an dif he is a monitor
        const defaultGroup = [{ id: reviewMetadata.groupBy.filter((data) => data.default)[0] }]

        if (defaultGroup[0]?.id?.type) {
          dispatch(applyFilters(defaultGroup))
          handleFilterByGroup(defaultGroup)
          localStorage.setItem('isGroup', true)
        }
      }

      const filterResultsOptions = generateOptions(
        reviewMetadata.filterBy,
        reviewMetadata.initialFilterBy
      )

      const groupResultsOptions = generateOptions(
        reviewMetadata.groupBy,
        reviewMetadata.initialGroupBy
      )

      setData({
        ...data,
        columns,
        rows,
        paginationSizes: reviewMetadata.paginationSizes,
        hasSortableColumns: reviewMetadata.hasSortableColumns,
        initialSortColumnId: reviewMetadata.initialSortColumnId,
        bulkActions: reviewMetadata.bulkActions,
        filterResultsOptions: filterResultsOptions.options,
        defaultFilterResultsId: filterResultsOptions.defaultOptionId,
        groupResultsOptions: groupResultsOptions.options,
        defaultGroupResultsId: groupResultsOptions.defaultOptionId
      })
    }
  }, [updatedReviewItems, reviewMetadata, isFetching, filterData, reviewCertification])

  const handleSearch = async (search) => {
    const userInfo = await profileAPI.getUserInfo()
    localStorage.setItem('searchValue', search)
    dispatch(updateSearch(search))
    dispatch(updateShowBigLoader(true))
    let payload
    let resp
    let resp1
    if (filterData.currentFilter !== 'All') {
      payload = {
        campaignId: reviewId,
        searchItem: search,
        group: filterArray[0].id.type,
        startPage: groupPageNumber * groupPageSize,
        endPage: groupPageNumber * groupPageSize + (groupPageSize - 1),
        status: type === 'History' ? getStatus() : getReviewStatus
      }
      if (monitorSel && filterArray[0]?.id?.label === 'Reviewer') {
        payload = {
          campaignId: reviewId,
          userRole: 'monitor',
          searchItem: search,
          startPage: groupPageNumber * groupPageSize,
          endPage: groupPageNumber * groupPageSize + (groupPageSize - 1),
          status: type === 'History' ? getStatus() : getReviewStatus
        }
      }
      resp1 = await reviewApi.searchByGroup(payload)
      if (resp1?.length > 0) {
        Object.entries(resp1[resp1.length - 1]).map(([key, value]) => {
          dispatch(fetchReviewPageCount(value))
        })
        dispatch(updateShowBigLoader(false))
      } else {
        dispatch(fetchReviewPageCount(0))
        dispatch(updateShowBigLoader(false))
      }
      dispatch(
        setFilterData({
          currentFilter:
            filterData.currentFilter === 'All'
              ? filterData.currentFilter
              : filterArray[0]?.id?.label,
          data: filterData.currentFilter === 'All' ? [] : resp1 !== undefined ? resp1 : []
        })
      )
    } else {
      payload = {
        campaignId: reviewId,
        searchItem: search,
        pageSize: pageSize,
        pageNumber,
        status: type === 'History' ? getStatus() : getReviewStatus,
        certType: certification
      }
      resp = await reviewApi.searchBy(payload, userInfo.id, certification)
      dispatch(
        fetchReviewItemsSuccess({
          reviewItems: resp
        })
      )
    }

    dispatch(updatePageSize(10))
    dispatch(updatePagenUmber(0))
  }

  const clearSearch = () => {
    sortInfoData.sortKey !== ''
      ? dispatch(fetchReviewSortStart(sortInfoData.payload))
      : checkForFilter()
  }

  const handleFilterByGroup = async (filter) => {
    const userInfo = await profileAPI.getUserInfo()
    let response
    if (filter !== 'All') {
      const searchKey = localStorage.getItem('searchValue')
      if ([null, undefined, ''].includes(searchKey)) {
        if (filter[0]?.id?.label === 'Reviewer') {
          let payload
          payload = {
            campaignId: reviewId,
            decisionStatus: type === 'History' ? getStatus() : 'in-progress',
            userEmail: profileDetails?.mail,
            userRole: 'monitor',
            pageSize,
            pageNumber
          }
          const respGroup = await reviewApi.groupByMonitor(payload, userInfo.id, certification)
          if (respGroup && respGroup.normalizedData[0]?.total > 0) {
            payload = {
              campaignId: reviewId,
              decisionStatus: getReviewStatus,
              userEmail: profileDetails?.mail,
              userRole: 'monitor',
              pageSize,
              pageNumber
            }
            const respGroup1 = await reviewApi.groupByMonitor(payload, userInfo.id, certification)
            if (respGroup1 && respGroup1?.aggregations?.g1?.buckets) {
              dispatch(fetchReviewPageCount(respGroup1?.aggregations?.g1?.buckets.length))
              response = respGroup1.aggregations.g1.buckets
              dispatch(updateNormalizedMonitorData(respGroup1.normalizedData))
              dispatch(updateShowBigLoader(false))
            } else {
              dispatch(fetchReviewPageCount(0))
              dispatch(updateShowBigLoader(false))
            }
          } else {
            dispatch(updateShowBigLoader(false))
          }
        } else {
          const payload = {
            campaignId: reviewId,
            group: filter[0]?.id?.type,
            startPage: groupPageNumber * groupPageSize,
            endPage: groupPageNumber * groupPageSize + (groupPageSize - 1),
            status: type === 'History' ? getStatus() : getReviewStatus
          }

          response = await reviewApi.groupBy(payload)
          if (response?.length > 0) {
            Object.entries(response[response.length - 1]).map(([key, value]) => {
              dispatch(fetchReviewPageCount(value))
            })
          } else {
            dispatch(fetchReviewPageCount(0))
          }
          dispatch(updateShowBigLoader(false))
        }
      } else {
        let payload1 = {
          campaignId: reviewId,
          searchItem: search,
          group: filter[0].id.type,
          startPage: groupPageNumber * groupPageSize,
          endPage: groupPageNumber * groupPageSize + (groupPageSize - 1),
          status: type === 'History' ? getStatus() : 'in-progress'
        }
        if (monitorSel && filter[0]?.id?.label === 'Reviewer') {
          payload1 = {
            campaignId: reviewId,
            userRole: 'monitor',
            searchItem: search,
            startPage: groupPageNumber * groupPageSize,
            endPage: groupPageNumber * groupPageSize + (groupPageSize - 1),
            status: type === 'History' ? getStatus() : 'in-progress'
          }
        }
        response = await reviewApi.searchByGroup(payload1)
        if (response?.length > 0) {
          Object.entries(response[response.length - 1]).map(([key, value]) => {
            dispatch(fetchReviewPageCount(value))
          })
          dispatch(updateShowBigLoader(false))
        } else {
          dispatch(fetchReviewPageCount(0))
          dispatch(updateShowBigLoader(false))
        }
        dispatch(updateShowBigLoader(false))
      }
    }
    dispatch(
      setFilterData({
        currentFilter: filter === 'All' ? filter : filter[0]?.id?.label,
        data: filter === 'All' ? [] : response !== undefined ? response : []
      })
    )
  }
  const clearSearchReviewDetais = () => {
    dispatch(updateSearch(''))

    if (filterArray.length > 0) {
      if (filterData.currentFilter === 'All') {
        filterReviews(filterArray)
      } else {
        handleFilterByGroup(filterArray)
      }
    } else {
      dispatch(fetchReviewItemsStart(reviewId))
    }
  }
  const handleModal = (value) => {
    if (value === 'managecolumns') {
      setOpen(true)
    } else if (
      (value === 'maintain' || value === 'revoke' || value === 'reassign' || value === 'forward') &&
      selectedReviewItems.length > multiSelectLimit
    ) {
      setSelectionLimitPopup(true)
    } else {
      doAction(value)
    }
  }

  const handleBulkActionsModal = (status) => {
    setBulkActionOptions({
      ...bulkActionsOptions,
      openModal: status
    })
    setTimeout(() => {
      setAge('action')
    }, 1000)
  }

  const isSignOffDisabled = () => {
    if (updatedReviewItems && updatedReviewItems.length > 0) {
      return !updatedReviewItems?.filter((e) => e.permissions.signoff).length > 0
    }
    return false
  }

  const callDecisionApi = (action, reviewIds) => {
    dispatch(updateShowBigLoader(true))
    const data = reviewIds.map((id) => {
      return {
        id,
        comments:
          action === 'Not-Applicable'
            ? [{ action: 'comment', comment: action }]
            : certification === 'ISA_WIN_UNIX_DB'
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
        decision: action === 'Not-Applicable' ? 'revoke' : 'certify'
      }
    })
    const payload = {
      items: data
    }
    // Call Certify API Call
    const apiToCall = action === 'Not-Applicable' ? 'revoke' : 'certify'
    reviewApi
      .reviewActions(apiToCall, reviewId, payload)
      .then(() => {
        const selectedItems = [...selectedReviewItems]
        for (const item of selectedItems) {
          if (reviewIds.includes(item.id)) {
            item.status = apiToCall
            item.action = null
          }
        }
        dispatch(updateSelectedReviewItems([...selectedItems]))
        dispatch(
          updateReviewNotificationMessage({
            type: 'Success',
            message:
              action === 'Not-Applicable'
                ? notificationMessageStrings.REVIEW_ENTRY_SUCESS
                : notificationMessageStrings.ACCESS_MAINTAIN_SUCCESS
          })
        )
        setTimeout(() => {
          setAge('action')
        }, 1000)

        sortInfoData.sortKey !== ''
          ? dispatch(fetchReviewSortStart(sortInfoData.payload))
          : checkForFilter()
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const callDbDecisions = (action, reviewIds) => {
    dispatch(updateShowBigLoader(true))
    const data = reviewIds.map((id) => {
      return {
        id,
        comments: [
          {
            action: 'comment',
            comment: action === 'EUA' ? 'End-User Account' : action
          }
        ],
        decision: 'certify'
      }
    })
    const payload = {
      items: data
    }

    reviewApi
      .reviewActions('certify', reviewId, payload)
      .then(() => {
        const selectedItems = [...selectedReviewItems]

        for (const item of selectedItems) {
          if (reviewIds.includes(item.id)) {
            item.status = 'certify'
            item.action = null
          }
        }
        dispatch(updateSelectedReviewItems([...selectedItems]))
        dispatch(
          updateReviewNotificationMessage({
            type: 'Success',
            message: notificationMessageStrings.REVIEW_ENTRY_SUCESS
          })
        )
        sortInfoData.sortKey !== ''
          ? dispatch(fetchReviewSortStart(sortInfoData.payload))
          : checkForFilter()
        setTimeout(() => {
          setAge('action')
        }, 1000)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const doApiCall = (reviewIds, action) => {
    if (['maintain', 'Not-Applicable'].includes(action)) {
      callDecisionApi(action, reviewIds)
    } else {
      callDbDecisions(action, reviewIds)
    }
  }
  const handleReset = (reviewIds, statusArray) => {
    const reviewDataCertify = []
    const reviewDataRevoke = []
    reviewIds.map((Id) => {
      if (
        statusArray[reviewIds.indexOf(Id)] === 'certify' ||
        statusArray[reviewIds.indexOf(Id)] === null
      ) {
        reviewDataCertify.push({
          id: Id,
          comments: [],
          decision: 'reset'
        })
      }
      if (
        statusArray[reviewIds.indexOf(Id)] === 'revoke' ||
        statusArray[reviewIds.indexOf(Id)] === null
      ) {
        reviewDataRevoke.push({
          id: Id,
          comments: [],
          decision: 'reset'
        })
      }
    })
    const payload1 = {
      items: reviewDataCertify
    }
    const payload2 = {
      items: reviewDataRevoke
    }
    dispatch(updateShowSmallLoader(true))
    if (payload2) {
      reviewApi
        .reviewActions('revoke', id, payload2)
        .then((res) => {
          sortInfoData.sortKey !== ''
            ? dispatch(fetchReviewSortStart(sortInfoData.payload))
            : checkForFilter()
          if (res.status === 200) {
            dispatch(
              updateReviewNotificationMessage({
                type: 'Success',
                message: notificationMessageStrings.REVOKE_SUCESS
              })
            )
          }
          setTimeout(() => {
            setAge('action')
          }, 1000)
        })
        .catch((err) => {
          dispatch(
            updateReviewNotificationMessage({
              type: 'Error',
              message: `${err}`
            })
          )
          setTimeout(() => {
            setAge('action')
          }, 1000)
        })
    }

    if (payload1) {
      reviewApi
        .reviewActions('certify', id, payload1)
        .then((res) => {
          sortInfoData.sortKey !== ''
            ? dispatch(fetchReviewSortStart(sortInfoData.payload))
            : checkForFilter()
          if (res.status === 200) {
            dispatch(
              updateReviewNotificationMessage({
                type: 'Success',
                message: notificationMessageStrings.REVOKE_SUCESS
              })
            )
          }
          setTimeout(() => {
            setAge('action')
          }, 1000)
        })
        .catch((err) => {
          dispatch(
            updateReviewNotificationMessage({
              type: 'Error',
              message: `${err}`
            })
          )
          setTimeout(() => {
            setAge('action')
          }, 1000)
        })
    }
  }
  const handleRevoke = (reviewIds) => {
    const reviewData = []
    reviewIds.map((Id) =>
      reviewData.push({
        id: Id,
        comments: [{ action: 'comment', comment: 'Revoke' }],
        decision: 'revoke'
      })
    )
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
        sortInfoData.sortKey !== ''
          ? dispatch(fetchReviewSortStart(sortInfoData.payload))
          : checkForFilter()
        if (res.status === 200) {
          const selectedItems = [...selectedReviewItems]
          for (const item of selectedItems) {
            if (reviewIds.includes(item.id)) {
              item.status = 'revoke'
              item.action = null
            }
          }
          dispatch(updateSelectedReviewItems([...selectedItems]))
          dispatch(
            updateReviewNotificationMessage({
              type: 'Success',
              message: notificationMessageStrings.REVOKE_SUCESS
            })
          )
        }
        setTimeout(() => {
          setAge('action')
        }, 1000)
      })
      .catch((err) => {
        setLoader(false)
        dispatch(
          updateReviewNotificationMessage({
            type: 'Error',
            message: `${err}`
          })
        )
        setTimeout(() => {
          setAge('action')
        }, 1000)
      })
  }
  const doAction = (action) => {
    const reviewIds = []
    let reviewIdActors = []
    let statusArray = []
    if (
      [
        'maintain',
        'revoke',
        'reassign',
        'forward',
        'allowExceptions',
        'EUA',
        'AAA',
        'ASA',
        'ISA',
        'YES',
        'Not-Applicable',
        'none'
      ].includes(action)
    ) {
      const reviews = selectedReviewItems.map((e) => {
        if (
          ['maintain', 'revoke'].includes(action)
            ? (e?.username?.includes('@')
                ? e?.username !== profileDetails?.mail
                : e?.username !== profileDetails?.userName?.toLowerCase()) && e.checked
            : e.checked
        ) {
          reviewIds.push(e.id)
          reviewIdActors = [...e.actors]
          e.action = action
        }
        if (['none'].includes(action)) {
          statusArray.push(e.status)
        }
        return e
      })
      if (
        ['maintain', 'YES', 'EUA', 'AAA', 'ASA', 'ISA', 'Not-Applicable'].includes(action) &&
        reviewIds.length > 0
      ) {
        doApiCall(reviewIds, action)
      }
      setReviewTasks(reviewIds)
      setReviewActors(reviewIdActors)
    }

    if (action === 'revoke' && reviewIds.length > 0) {
      handleRevoke(reviewIds)
    }
    if (action === 'none' && reviewIds.length > 0 && statusArray.length > 0) {
      handleReset(reviewIds, statusArray)
    }
    if (['sendEmail', 'forward', 'reassign', 'allowExceptions'].includes(action)) {
      setBulkActionOptions({
        openModal: true,
        typeOfAction: action
      })
    }
  }
  // const checkIsPermissionGranted = () => {
  //   let isSignOffFalseCounter = 0
  //   for (const item of updatedReviewItems) {
  //     if (item.checked) {
  //       const keys = Object.entries(item?.permissions || {})
  //       for (const [key, value] of keys) {
  //         if (key == 'signoff' && !value) {
  //           isSignOffFalseCounter++
  //           break
  //         }
  //       }
  //     }
  //   }
  //   return isSignOffFalseCounter > 0
  // }

  const showBulkActions = () => {
    if (selectedReviewItems && selectedReviewItems.length > 0) {
      for (const item of selectedReviewItems) {
        if (item.action === null && item.checked && item.status) {
          return true
        }
      }
    }
    return false
  }

  const openSignOffModal = () => {
    let counter = 0
    const signOffData = []

    if (selectedReviewItems && selectedReviewItems.length > 0) {
      for (const item of selectedReviewItems) {
        if (item.status !== null && item.status !== undefined && item.checked) {
          if (item?.permissions?.signoff) {
            signOffData.push(item)
            counter++
          }
        }
      }
    }
    setSignOffItems(signOffData)
    setActionCount(counter)

    setSignOffModal(true)
  }
  const setNewstatus = (value) => {
    setStatusArrayValue(value)
    if (['Confirmed', 'Bestätigt'].includes(value)) {
      dispatch(applyFilters([]))
      dispatch(updateSelectedReviewItems([]))
      dispatch(
        setFilterData({
          currentFilter: 'All',
          data: []
        })
      )
      dispatch(updateGroupPagenUmber(0))
      dispatch(updateGroupPageSize(10))
      dispatch(
        updateSortInfoData({
          sortKey: '',
          isAscending: 'asc'
        })
      )
      dispatch(setReviewTypeStatue('signed-off'))
    } else {
      dispatch(setReviewTypeStatue('in-progress'))
    }
    sortInfoData.sortKey !== ''
      ? dispatch(fetchReviewSortStart(sortInfoData.payload))
      : checkForFilter()
  }

  const checkIsMonitor = (actors) => {
    let isMonitor = false
    // eslint-disable-next-line no-unused-vars
    const actorArray = actors.map((actor) => {
      if (actor?.mail === profileDetails?.mail && actor?.label && actor?.label === 'monitor') {
        isMonitor = true
      }
      return actor?.mail
    })
    return isMonitor
  }

  const signOffCallback = () => {
    handleFilterByGroup(filterArray)
  }

  React.useEffect(() => {
    if (updatedReviewItems && updatedReviewItems.length && updatedReviewItems[0]?.actors.length) {
      setShowConfirmButton(
        !(certification === 'ENDUSER_ACCS_DB' && !checkIsMonitor(updatedReviewItems[0].actors))
      )
    }
  }, [updatedReviewItems])

  useEffect(() => {
    if (campaignInfo) {
      setCertification(campaignInfo?.description)
    }
  }, [campaignInfo])

  return (
    <>
      {open && (
        <GenericModal setOpen={setOpen}>
          <ManageItems
            modalId={manageColumnsModalId}
            title={translate('review.modal.manageColumns.title')}
            description={translate('review.modal.manageColumns.description')}
            submitText={translate('review.modal.manageColumns.submitText')}
            onSubmitCallback={updateDisplayedColumns}
            handleClose={() => setOpen(false)}
            reviewId={reviewId}
            certification={certification}
            localStoragedata={
              JSON.parse(localStorage.getItem(certification)) &&
              JSON.parse(localStorage.getItem(certification))
            }
          />
        </GenericModal>
      )}
      {bulkActionsOptions.openModal && (
        <GenericModal setOpen={handleBulkActionsModal}>{getActionModal()}</GenericModal>
      )}
      {selectionLimitPopup && (
        <GenericModal setOpen={setSelectionLimitPopup} width="500px">
          <div>
            <Styled.InfoWrapper>
              <Styled.SelectionLimitHeaderWrapper>
                {translate('selectionLimit.headerMessage')}
              </Styled.SelectionLimitHeaderWrapper>
            </Styled.InfoWrapper>
            {translate('selectionLimit.warningMessageFirstHalf')} {multiSelectLimit}
            {translate('selectionLimit.warningMessageSecondHalf')}
            <Styled.ButtonWrapper>
              <Button
                variant="contained"
                style={{
                  float: 'right',
                  marginTop: '45px',
                  marginRight: '15px',
                  background: '#fff',
                  color: '#333',
                  border: '2px solid rgb(208, 203, 203)'
                }}
                onClick={() => {
                  setSelectionLimitPopup(false)
                  setAge('action')
                }}
              >
                {translate('ok.button')}
              </Button>
            </Styled.ButtonWrapper>
          </div>
        </GenericModal>
      )}
      <Styled.BackButtonLink
        to={{
          pathname: '/tasks/reviews',
          state: { type: type === 'History' ? 'History' : 'Active' }
        }}
      >
        <Styled.BackButton>← {translate('review.back')}</Styled.BackButton>
      </Styled.BackButtonLink>
      <Breadcrumb
        path={
          type === 'History'
            ? [
                { label: translate('navItem.label.dashboard'), url: '/dashboard' },
                {
                  label: translate('navItem.label.history'),
                  url: {
                    pathname: '/history',
                    state: { type: 'History' }
                  }
                },
                {
                  label: translate('review.reviewslist'),
                  url: {
                    pathname: '/tasks/reviews',
                    state: { type: 'History' }
                  }
                },
                { label: reviewName, url: '' }
              ]
            : [
                { label: translate('navItem.label.dashboard'), url: '/dashboard' },
                {
                  label: translate('review.reviewslist'),
                  url: {
                    pathname: '/tasks/reviews',
                    state: { type: 'Active' }
                  }
                },
                { label: reviewName, url: '' }
              ]
        }
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {type === 'History' ? (
          <Styled.HeaderWrapper>
            <h1 style={{ fontWeight: 'normal', marginBottom: '10px', flexDirection: 'row' }}>
              {reviewName + '\u00a0' + '(' + totolStatus + '/' + totolStatus + ')' + '\u00a0'}
            </h1>
          </Styled.HeaderWrapper>
        ) : (
          <Styled.HeaderWrapper>
            <h1 style={{ fontWeight: 'normal', marginBottom: '10px', flexDirection: 'row' }}>
              {reviewName + '\u00a0' + '(' + completionStatus + '/' + totolStatus + ')' + '\u00a0'}
              {showSmallLoading && (
                <CircularProgress
                  size={23}
                  sx={{ top: '5px', position: 'relative', color: blue[500] }}
                />
              )}
            </h1>
          </Styled.HeaderWrapper>
        )}
        <div
          style={{
            paddingRight: '6px',
            width: '100%',
            zIndex: 5
          }}
        >
          {type !== 'History' && (
            <DropdownFilter
              align="right"
              id="ActiveConfirmed"
              defaultOption={statusArrayValue}
              dropdownOptions={StatusArray}
              handleCallback={setNewstatus}
            />
          )}
        </div>
      </div>

      {showDecesionToast && showConfirmButton && (
        <div
          id="main"
          style={{ position: 'relative', top: 0, right: 0, zIndex: 300, minWidth: '8%' }}
        >
          <div
            id="a1"
            style={{
              position: 'absolute',
              padding: '8px',
              margin: '8px',
              marginLeft: '140px',
              marginTop: '14px',
              color: `${theme === 'dark' ? '#fff' : '#333'}`,
              fontWeight: 400,
              fontSize: '16px'
            }}
          >
            {translate(`review.decision.toast`)}
          </div>
        </div>
      )}
      <Styled.TableOptionsWrapper>
        <MSearchBox
          onSearchCallback={handleSearch}
          placeholder="Search"
          onClickCallback={handleModal}
          data={data.bulkActions}
          filterResultsOptions={data.filterResultsOptions}
          groupResultsOptions={data.groupResultsOptions}
          isDisabled={type && type === 'History'}
          onFilterCallback={(filter) => handleFilterByGroup(filter)}
          reviewId={reviewId}
          age={age}
          setAge={setAge}
          onClearCallback={clearSearchReviewDetais}
          isExport={true}
          certification={certification}
          statusValue={statusArrayValue}
          columns={data.columns}
          type={type}
          onClearSearchGroupBy={(filter) => handleFilterByGroup(filter)}
          onClearSearchFilter={(filter) => filterReviews(filter)}
          isManageColumnRequired
        />
      </Styled.TableOptionsWrapper>
      <AppliedFilter reviewId={reviewId} handleFilterByGroup={handleFilterByGroup} />

      {filterData.currentFilter === 'All' ? (
        <ReviewTable
          rows={updatedReviewItems}
          search={search}
          columns={data.columns}
          paginationSizes={data.paginationSizes}
          hasSortableColumns={data.hasSortableColumns}
          initialSortColumnId={data.initialSortColumnId}
          bulkActions={data.bulkActions}
          metadata={reviewMetadata}
          type={type}
          reviewId={reviewId}
          total={total}
          certification={certification}
        />
      ) : (
        <GroupedReviewTable
          items={filterData.data}
          data={data}
          metadata={reviewMetadata}
          reviewItemsData={updatedReviewItems}
          reviewId={reviewId}
          pageCount={pageCount}
          monitorData={normalizedMonitorData}
          certificationId={certification}
          type={type}
        />
      )}
      {isFetching && showBigLoader && !showSmallLoading && <Loading />}
      {updatedReviewItems.length !== 0 && type !== 'History' && showConfirmButton && (
        <div
          style={{
            bottom: 0,
            width: '100%',
            background: theme === 'dark' ? '#182b44' : '#fff',
            zIndex: 1300,
            position: 'fixed',
            left: '-1px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '16px',
            fontWeight: 400,
            color: theme === 'dark' ? '#fff' : '#333',
            borderTop: theme === 'dark' ? '1px solid #404854' : '1px solid #ccc'
          }}
        >
          In order to finalize the decision, please select the review items in the table and click
          on
          <Button
            style={{ marginLeft: '10px', color: 'white' }}
            disabled={!showBulkActions()}
            onClick={() =>
              selectedReviewItems.length > multiSelectLimit
                ? setSelectionLimitPopup(true)
                : openSignOffModal()
            }
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: `${theme === 'dark' ? '#fff' : '#333'}`,
              fontSize: '14px',
              fontWeight: 900,
              marginTop: '10px',
              marginBottom: '10px',
              height: '30px',
              backgroundColor: `${!showBulkActions() === true ? '#E5E4E4' : '#1565C0'}`,
              '&:hover': { backgroundColor: '#1565C0' }
            }}
          >
            {translate('review.actions.signOff')}
          </Button>
        </div>
      )}

      {signOffModal && (
        <GenericModal setOpen={setSignOffModal} width="450px">
          <ReviewSummary
            closeModal={setSignOffModal}
            id={reviewId}
            actionCount={actionCount}
            signOffItems={signOffItems}
            signOffCallback={signOffCallback}
          />
        </GenericModal>
      )}
      {/* <Styled.TrobleShort style={{ marginTop: '65px' }}>
        <Icon name="infos" size="small" />
        <span style={{ paddingLeft: '10px' }}>{translate('dashboard.troubleshooting')}</span>
      </Styled.TrobleShort> */}
    </>
  )
}

export default Review
