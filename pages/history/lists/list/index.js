/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { useLocation, useRouteMatch } from 'react-router-dom'
import translate from 'translations/translate'
import { defineColumns, defineRows, filterArrayNew } from 'helpers/arrays'
import ManageItems from 'advancedComponents/modals/manageItems'
import Filter from 'components/filter'
// import SearchBox from 'components/searchBox'
import MSearchBox from 'components/mSearchBox'
import Button from 'components/button'
import ReviewReassign from '../../../../pageComponents/Review/Dropbox/Reassign'
import ReviewForward from '../../../../pageComponents/Review/Dropbox/Forward'
import ReviewSendEmail from '../../../../pageComponents/Review/Dropbox/SendEmail'
import ReviewAllowExceptions from '../../../../pageComponents/Review/Dropbox/AllowExceptions'
import ReviewComments from '../../../../pageComponents/Review/PopupLink/Comments'
import * as Styled from './style'
import Notification from 'components/notification'
import GenericModal from '../../../../components/genericModal'
import ReviewTable from '../../../../pageComponents/Review/ReviewTable'
import ReviewSummary from '../../../../pageComponents/Review/Summary'
import Divider from '../../../../components/divider'
import Loading from '../../../../components/loading'
import GroupedReviewTable from '../../../../pageComponents/Review/GroupedReviewTable'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectNotificationMessage,
  selectReviewItems,
  selectReviewMetadata,
  isReviewFetching,
  selectSelectedReviewItems
} from '../../../../redux/review/review.selector'
import {
  fetchReviewFilterStart,
  fetchReviewItemsStart,
  fetchReviewMetadataStart,
  fetchReviewSearchStart,
  updateReviewItemsStart,
  updateReviewNotificationMessage
} from '../../../../redux/review/review.action'
import { selectReassignItems } from '../../../../redux/review/reassign/reviewAction.selector'
import * as reviewApi from '../../../../api/review'
import { generateOptions } from '../../../../helpers/table'
import { Breadcrumbs, Link, Typography } from '@mui/material'
import ActionModal from '../../../../pageComponents/Review/Dropbox/ActionModal'
import AppliedFilter from '../../../../components/appliedFilter'

const List = () => {
  // Get review name
  const match = useRouteMatch()
  const location = useLocation()
  const reviewId = location?.state?.id
  const reviewName = location?.state?.name || reviewId

  // Get review items
  const reviewItems = useSelector(selectReviewItems)
  const reviewMetadata = useSelector(selectReviewMetadata)
  const reassignData = useSelector(selectReassignItems)

  // Get selected review items
  const selectedReviewItems = useSelector(selectSelectedReviewItems)

  const [updatedReviewItems, setUpdatedReviewItems] = useState([])
  const getNotificationMessage = useSelector(selectNotificationMessage)
  const isFetching = useSelector(isReviewFetching)

  // Manage columns modal
  const [open, setOpen] = useState(false)
  const [bulkActionsOptions, setBulkActionOptions] = useState({
    openModal: false,
    typeOfAction: null
  })
  const [reviewtasks, setReviewTasks] = useState([])

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
        return <ActionModal closeModal={handleBulkActionsModal} reviewSelectedId={reviewtasks} />
      case 'allowExceptions':
        return <ReviewAllowExceptions closeModal={handleBulkActionsModal} multiple />
      case 'revoke':
        return (
          <ReviewComments
            type="revoke"
            handleClose={handleBulkActionsModal}
            reviewId={reviewtasks}
          />
        )
      default:
        return
    }
  }

  // Manage columns modal
  const [signOffModal, setSignOffModal] = useState(false)
  const [actionCount, setActionCount] = useState(0)

  // Set data for review page
  const [data, setData] = useState({
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

  const [filterData, setFilterData] = useState({
    currentFilter: 'All',
    data: []
  })

  const manageColumnsModalId = 'review-manageColumns'

  const updateDisplayedColumns = (columns) => {
    setData({
      ...data,
      columns
    })
    setOpen(false)
  }

  const dispatch = useDispatch()
  useEffect(async () => {
    dispatch(fetchReviewMetadataStart())
    dispatch(fetchReviewItemsStart(reviewId))
  }, [])

  useEffect(() => {
    if (
      getNotificationMessage.message &&
      (getNotificationMessage.type === 'success' ||
        getNotificationMessage.type === 'Success' ||
        getNotificationMessage.type === 'info' ||
        getNotificationMessage.type === 'Error' ||
        getNotificationMessage.type === 'error')
    ) {
      setTimeout(function () {
        //dispatch here
        dispatch(
          updateReviewNotificationMessage({
            type: '',
            message: '',
            action: ''
          })
        )
      }, 5000)
    }
  }, [getNotificationMessage])

  const handleConfirm = async () => {
    if (reassignData.action === 'Forward' || reassignData.action === 'AllowExceptions') {
      dispatch(fetchReviewItemsStart(reviewId))
    }
    dispatch(
      updateReviewNotificationMessage({
        type: 'success',
        message: `requestsubmission.success`
      })
    )
  }

  useEffect(async () => {
    if (!!updatedReviewItems && !!reviewMetadata) {
      const columns = defineColumns(reviewMetadata.columns, filterData.currentFilter !== 'All')
      const rows = defineRows(reviewMetadata.columns, updatedReviewItems)

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
  }, [updatedReviewItems, reviewMetadata, filterData.currentFilter])

  const handleSearch = (search) => {}

  const clearSearch = () => {
    dispatch(fetchReviewItemsStart(reviewId))
  }

  const handleFilterByGroup = (filter) => {
    setFilterData({
      currentFilter: filter,
      data: filter === 'All' ? [] : filterArrayNew(updatedReviewItems, 'username')
    })
  }

  const renderFilteredData = () => (
    <GroupedReviewTable items={filterData.data} data={data} metadata={reviewMetadata} />
  )

  const handleModal = (value) => {
    if (value === 'managecolumns') {
      setOpen(true)
    } else {
      doAction(value)
    }
  }

  const handleBulkActionsModal = (status) => {
    setBulkActionOptions({
      ...bulkActionsOptions,
      openModal: status
    })
  }

  const isSignOffDisabled = () => {
    if (updatedReviewItems && updatedReviewItems.length > 0) {
      return !updatedReviewItems?.filter((e) => e.status).length > 0
    }
    return false
  }

  const doApiCall = (reviewIds) => {
    const data = reviewIds.map((id) => {
      return {
        id,
        decision: 'certify'
      }
    })
    const payload = {
      items: data
    }
    // Call Certify API Call
    reviewApi
      .reviewActions('certify', reviewId, payload)
      .then((res) => {
        dispatch(
          updateReviewNotificationMessage({
            type: 'Success',
            message: 'maintain.success'
          })
        )
        dispatch(fetchReviewItemsStart(reviewId))
      })
      .catch((err) => {})
  }

  const doAction = (action) => {
    const reviewIds = []
    if (
      action === 'maintain' ||
      action === 'revoke' ||
      action === 'reassign' ||
      action === 'forward' ||
      action === 'allowExceptions'
    ) {
      const reviews = updatedReviewItems.map((e) => {
        if (e.checked === true) {
          reviewIds.push(e.id)
          e.action = action
        }
        return e
      })
      if (action === 'maintain') {
        doApiCall(reviewIds)
      }
      setReviewTasks(reviewIds)
    }

    if (
      action === 'sendEmail' ||
      action === 'forward' ||
      action === 'reassign' ||
      action === 'allowExceptions' ||
      action === 'revoke'
    ) {
      setBulkActionOptions({
        openModal: true,
        typeOfAction: action
      })
    }
  }

  const showBulkActions = () => {
    if (updatedReviewItems && updatedReviewItems.length > 0) {
      for (const item of updatedReviewItems) {
        if (item.action === null && item.checked === true) {
          return true
        }
      }
    }
    return false
  }

  const filterReviews = (word) => {
    if (word === 'All') {
      dispatch(fetchReviewItemsStart(reviewId))
    } else {
      dispatch(fetchReviewFilterStart(word))
    }
  }

  const openSignOffModal = () => {
    let counter = 0

    if (updatedReviewItems && updatedReviewItems.length > 0) {
      for (const item of updatedReviewItems) {
        if (item.status !== null && item.status !== undefined) {
          counter++
        }
      }
    }
    setActionCount(counter)
    setSignOffModal(true)
  }

  return (
    <>
      {open && (
        <GenericModal setOpen={setOpen}>
          <ManageItems
            modalId={manageColumnsModalId}
            title={translate('review.modal.manageColumns.title')}
            description={translate('review.modal.manageColumns.description')}
            submitText={translate('review.modal.manageColumns.submitText')}
            items={data.columns}
            onSubmitCallback={updateDisplayedColumns}
          />
        </GenericModal>
      )}
      {bulkActionsOptions.openModal && (
        <GenericModal setOpen={handleBulkActionsModal}>{getActionModal()}</GenericModal>
      )}
      <Styled.BackButtonLink to={'/history/lists'}>
        <Styled.BackButton>← Back</Styled.BackButton>
      </Styled.BackButtonLink>
      <Breadcrumbs style={{ margin: '25px 0', fontSize: '12px' }} aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/history">
          History
        </Link>
        <Link underline="hover" color="inherit" href="/history/lists">
          History List
        </Link>
        <Typography color="text.primary">{reviewName}</Typography>
      </Breadcrumbs>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Styled.HeaderWrapper>
          <h1 style={{ fontWeight: 'normal', marginBottom: '10px' }}>{reviewName}</h1>
        </Styled.HeaderWrapper>
        {getNotificationMessage.message && (
          <Styled.NotificationWrapper type={getNotificationMessage.type}>
            <Notification
              description={getNotificationMessage.message}
              variant={getNotificationMessage.type}
              action={getNotificationMessage.type === 'info' ? 'confirm' : ''}
              actionCallback={handleConfirm}
            />
          </Styled.NotificationWrapper>
        )}
      </div>

      <Styled.TableOptionsWrapper>
        <MSearchBox
          onSearchCallback={handleSearch}
          placeholder="Search"
          onClickCallback={handleModal}
          data={data.bulkActions}
          filterResultsOptions={data.filterResultsOptions}
          groupResultsOptions={data.groupResultsOptions}
          isManageColumnRequired
        />
      </Styled.TableOptionsWrapper>
      <AppliedFilter />

      {filterData.currentFilter === 'All' ? (
        <ReviewTable
          rows={updatedReviewItems}
          search={data.search}
          columns={data.columns}
          paginationSizes={data.paginationSizes}
          hasSortableColumns={data.hasSortableColumns}
          initialSortColumnId={data.initialSortColumnId}
          bulkActions={data.bulkActions}
          metadata={reviewMetadata}
        />
      ) : (
        <GroupedReviewTable items={filterData.data} data={data} metadata={reviewMetadata} />
      )}
      {isFetching === 'true' && <Loading />}
      {!showBulkActions() && updatedReviewItems.length !== 0 && (
        <Styled.SignOffButtonWrapper>
          <Button
            disabled={isSignOffDisabled()}
            text={translate('review.actions.signOff')}
            onClickCallback={() => openSignOffModal()}
          />
        </Styled.SignOffButtonWrapper>
      )}

      {signOffModal && (
        <GenericModal setOpen={setSignOffModal}>
          <ReviewSummary closeModal={setSignOffModal} id={reviewId} actionCount={actionCount} />
        </GenericModal>
      )}
    </>
  )
}

export default List
