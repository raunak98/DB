/* eslint-disable */
import React, { useState, useEffect } from 'react'
import translate from 'translations/translate'
import { defineColumns, defineRows } from 'helpers/arrays'
import Header from 'components/header'
import MSearchBox from 'components/mSearchBox'
import GenericModal from '../../../components/genericModal'
import ManageItems from 'advancedComponents/modals/manageItems'
import Loading from 'components/loading'
import Table from 'components/table'
import { useDispatch, useSelector } from 'react-redux'
import Breadcrumb from 'components/breadcrumb'
import * as Styled from './style'
import Divider from '../../../components/divider'
import {
  fetchReviewsItemsStart,
  fetchReviewsMetadataStart,
  fetchReviewsSearchStart,
  updatePageSizeReviews,
  updatePageNumberReviews,
  fetchReviewsItemsSuccess
} from '../../../redux/reviews/reviews.action'
import {
  selectReviewsItems,
  selectReviewsMetadata,
  isReviewsFetching,
  selectReviewsPageNumber,
  selectReviewsPageSize
} from '../../../redux/reviews/reviews.selector'
import { Alert, Typography } from '@mui/material'
import MUITable from './MUITable'
import { useLocation, Link } from 'react-router-dom'
import useTheme from '../../../hooks/useTheme'
import * as dashboardApi from '../../../api/dashboard'
import Icon from 'components/icon'
import DropdownFilter from '../../../components/dropdownFilter'
import { formattedDate } from '../../../helpers/strings'

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]
const Reviews = () => {
  const dispatch = useDispatch()
  const metaData = useSelector(selectReviewsMetadata)
  const reviews = useSelector(selectReviewsItems)
  const pagenumber = useSelector(selectReviewsPageNumber)

  const pagesize = useSelector(selectReviewsPageSize)

  const isFetching = useSelector(isReviewsFetching)
  const [search, setSearch] = useState('')
  const [totalReviewsCount, setTotalReviewsCount] = useState(-1)
  const location = useLocation()
  const type = location?.state?.type || 'active'
  const { theme } = useTheme()
  const StatusArray = [
    { value: 'Complete', text: 'Complete' },
    { value: 'Closed', text: 'Closed' }
  ]
  const [actionStatus, setActionStatus] = useState('Complete')
  const metaDataColumns = metaData?.columns?.filter((item) => item?.id !== 'redirect')
  const padto2Digits = (num) => {
    return num.toString().padStart(2, '0')
  }
  const formatFunction = (value) => {
    if (value !== null) {
      const date = new Date(value)
      return [
        padto2Digits(date.getDate()),
        months[date.getMonth()],
        date.getFullYear().toString()
      ].join(' ')
    } else {
      return ''
    }
  }
  const [data, setData] = useState({
    allColumns: [],
    rows: [],
    paginationSizes: undefined,
    hasSortableColumns: false,
    initialSortColumnId: ''
  })
  const [filterData, setFilterData] = useState({
    currentFilter: 'All',
    data: []
  })
  const checkIfStatusIsCancelled = (reviewItem) => {
    if (
      reviewItem.startDate === null ||
      (reviewItem?.status?.toLowerCase() === 'completed' && reviewItem?.totals['in-progress'] > 0)
    ) {
      return 'Cancelled'
    }
    return reviewItem.status
  }
  const manageColumnsModalId = 'review-manageColumns'
  const updateDisplayedColumns = (columns) => {
    setOpen(false)

    const updatedData = reviews.results.map((review) => ({
      id: review?.campaignId,
      dueDate: review?.deadline ? formattedDate(review?.deadline) : '',
      name: review?.campaignName,
      startDate: review?.startDate ? formattedDate(review?.startDate) : '',
      completion: `${review?.totals?.total - review?.totals['in-progress']}/${
        review?.totals?.total
      }`,
      status: checkIfStatusIsCancelled(review)
    }))
    let finalArray = []
    columns.map((column) => {
      metaDataColumns.map((mcolumn, i) => {
        if (column.id === mcolumn.id) {
          finalArray.push({
            ...mcolumn,
            initialDisplay: column.initialDisplay ? column.initialDisplay : column.display
          })
        }
      })
    })
    const allColumns = defineColumns(finalArray)
    const rows = defineRows(finalArray, updatedData, type)

    setData({
      ...data,
      allColumns,
      rows
    })
  }
  useEffect(
    () => () => {
      dispatch(fetchReviewsItemsSuccess(null))
    },
    []
  )
  useEffect(
    () => () => {
      dispatch(updatePageNumberReviews(0))
    },
    [type]
  )

  useEffect(async () => {
    dashboardApi
      .getCountByStatus(type === 'History' ? 'closed' : 'active')
      .then((res) => {
        setTotalReviewsCount(res.reviews)
      })
      .catch((err) => console.error(err))
    dispatch(fetchReviewsMetadataStart())
    dispatch(fetchReviewsItemsStart(type === 'History' ? 'closed' : 'active'))

    type === 'History'
      ? localStorage.setItem('historyStatus', 'complete')
      : localStorage.setItem('historyStatus', 'active')
  }, [])

  useEffect(() => {
    if (!!metaData && !!reviews) {
      const updatedData = reviews.results
        ? reviews?.results?.map((review) => ({
            id: review?.campaignId,
            name: review?.campaignName,
            dueDate: review?.deadline ? formattedDate(review?.deadline) : '',
            startDate: review?.startDate ? formattedDate(review?.startDate) : '',
            completion: `${review?.totals?.total - review?.totals['in-progress']}/${
              review?.totals?.total
            }`,

            status: checkIfStatusIsCancelled(review)
          }))
        : reviews?.reviewItems?.results?.map((review) => ({
            id: review?.campaignId,
            name: review?.campaignName,
            dueDate: review?.deadline ? formattedDate(review?.deadline) : '',
            startDate: review?.startDate ? formattedDate(review?.startDate) : '',
            completion: `${review?.totals?.total - review?.totals['in-progress']}/${
              review?.totals?.total
            }`,
            status: checkIfStatusIsCancelled(review)
          }))

      const allColumns = defineColumns(metaDataColumns)
      const rows = defineRows(metaDataColumns, updatedData, type)

      setData({
        allColumns,
        rows,
        paginationSizes: metaData.paginationSizes,
        hasSortableColumns: metaData.hasSortableColumns,
        initialSortColumnId: metaData.initialSortColumnId
      })
    }
  }, [metaData, reviews])

  const handleSearch = (searchData) => {
    setSearch(searchData)
    const payload = {
      search: searchData,
      status: type === 'History' ? 'closed' : 'active',
      pagenumber,
      pagesize
    }
    dispatch(fetchReviewsSearchStart(payload))
  }

  const clearSearch = () => {
    dispatch(fetchReviewsItemsStart(type === 'History' ? 'closed' : 'active'))
    setSearch('')
  }

  const filteredItems = () => {
    const searchTerm = search?.toLowerCase()
    if (!searchTerm) return data?.rows
    return data?.rows.filter((e) => {
      const name = e?.name?.props?.children?.toLowerCase()
      return name && name.includes(searchTerm)
    })
  }

  const handleModal = (value) => {
    if (value === 'managecolumns') {
      setOpen(true)
    } else {
      doAction(value)
    }
  }

  const handlePageChange = () => {
    dispatch(fetchReviewsItemsStart(type === 'History' ? 'closed' : 'active'))
  }

  // Manage columns modal
  const [open, setOpen] = useState(false)
  const [bulkActionsOptions, setBulkActionOptions] = useState({
    openModal: false,
    typeOfAction: null
  })
  const [reviewtasks, setReviewTasks] = useState([])

  const getResponseCount = (value) => {
    dashboardApi
      .getCountByStatus(value)
      .then((res) => {
        setTotalReviewsCount(res.reviews)
      })
      .catch((err) => console.error(err))
  }

  const setNewstatus = (value) => {
    if (type === 'History') {
      if (
        ['Complete', 'Vollständig'].includes(value?.target?.innerHTML) ||
        ['Complete', 'Vollständig'].includes(value)
      ) {
        setActionStatus('Complete')
        getResponseCount('complete')
        dispatch(fetchReviewsItemsStart('complete'))
        localStorage.setItem('historyStatus', 'complete')
      } else {
        setActionStatus('Closed')
        getResponseCount('closed')
        dispatch(fetchReviewsItemsStart('closed'))
        localStorage.setItem('historyStatus', 'closed')
      }
      dispatch(updatePageNumberReviews(0))
      dispatch(updatePageSizeReviews(10))
    }
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
            from="reviews table"
            handleClose={() => setOpen(false)}
            columns={data.allColumns}
            onSubmitCallback={updateDisplayedColumns}
          />
        </GenericModal>
      )}
      {bulkActionsOptions.openModal && (
        <GenericModal setOpen={handleBulkActionsModal}>{getActionModal()}</GenericModal>
      )}
      <Styled.BackButtonLink
        to={{
          pathname: type === 'History' ? '/history' : '/tasks',
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
                  url: '/history'
                },
                { label: translate('review.reviewslist'), url: '' }
              ]
            : [
                { label: translate('navItem.label.dashboard'), url: '/dashboard' },
                { label: translate('review.reviewslist'), url: '' }
              ]
        }
      />
      <div
        style={{
          paddingRight: '6px',
          width: '100%',
          zIndex: 5
        }}
      >
        {/* commented the below code to hide the closed and completed dropdown */}
        {/* {type === 'History' && (
          <DropdownFilter
            align="right"
            id="Closed_Reviews"
            defaultOption={actionStatus}
            dropdownOptions={StatusArray}
            handleCallback={setNewstatus}
          />
        )} */}
      </div>

      <Styled.HeaderWrapper>
        <h1 style={{ fontWeight: 'normal', marginBottom: '0px' }}>
          {translate('review.reviewslist')}
        </h1>
      </Styled.HeaderWrapper>

      <Styled.TableOptionsWrapper>
        <MSearchBox
          onSearchCallback={handleSearch}
          onClearCallback={clearSearch}
          placeholder="Search"
          onClickCallback={handleModal}
          data=""
          filterResultsOptions={data.filterResultsOptions}
          groupResultsOptions=""
          isManageColumnRequired
        />
      </Styled.TableOptionsWrapper>

      {!!data.rows.length && !!data.allColumns.length && (
        <MUITable
          paginationSizes={data.paginationSizes}
          data={data.allColumns}
          items={filteredItems()}
          type={type}
          totalItemCount={search !== '' ? filteredItems().length : totalReviewsCount}
          handlePageChange={() => handlePageChange}
        />
      )}
      {(isFetching || !data.allColumns) && <Loading />}
      {data.rows.length === 0 && <Alert severity="info">{translate('review.noRecordFound')}</Alert>}
      {/* <Styled.TrobleShort>
        <Icon name="infos" size="small" />
        <span style={{ paddingLeft: '10px' }}>{translate('dashboard.troubleshooting')}</span>
      </Styled.TrobleShort> */}
    </>
  )
}

export default Reviews
