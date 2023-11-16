/* eslint-disable */
import React, { useState, useEffect } from 'react'
import translate from 'translations/translate'
import { defineColumns, defineRows } from 'helpers/arrays'
import Header from 'components/header'
// import SearchBox from 'components/searchBox'
import MSearchBox from 'components/mSearchBox'
import GenericModal from '../../../components/genericModal'
import ManageItems from 'advancedComponents/modals/manageItems'
import Loading from 'components/loading'
// import Loading from 'components/loading'
import Table from 'components/table'
import { useDispatch, useSelector } from 'react-redux'
import * as Styled from './style'
import Divider from '../../../components/divider'
import {
  fetchReviewsItemsStart,
  fetchReviewsMetadataStart,
  fetchReviewsSearchStart
} from '../../../redux/reviews/reviews.action'
import {
  selectReviewsItems,
  selectReviewsMetadata,
  isReviewsFetching
} from '../../../redux/reviews/reviews.selector'
import { Alert, Breadcrumbs, Link, Typography } from '@mui/material'
import MUITable from './MUITable'

const Lists = () => {
  const dispatch = useDispatch()
  const metaData = useSelector(selectReviewsMetadata)
  const reviews = useSelector(selectReviewsItems)
  const isFetching = useSelector(isReviewsFetching)
  const [search, setSearch] = useState('')

  const formatFunction = (value) => {
    const date = new Date(value)
    return `${date.getDate()}-${date.toLocaleString('en', {
      month: 'short'
    })}-${date.getFullYear()}`
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

  const manageColumnsModalId = 'review-manageColumns'
  const updateDisplayedColumns = (columns) => {
    setData({
      ...data,
      allColumns: columns
    })
  }

  useEffect(async () => {
    dispatch(fetchReviewsMetadataStart())
    dispatch(fetchReviewsItemsStart())
  }, [])

  useEffect(() => {
    if (!!metaData && !!reviews) {
      const updatedData = reviews.results.map((review) => ({
        id: review?.campaignId,
        name: review?.campaignName,
        dueDate: formatFunction(review?.deadline),
        startDate: formatFunction(review?.startDate),
        completion: `${review?.totals?.total - review?.totals['in-progress']}/${
          review?.totals?.total
        }`
      }))

      const allColumns = defineColumns(metaData.columns)
      const rows = defineRows(metaData.columns, updatedData)

      setData({
        allColumns,
        rows,
        paginationSizes: metaData.paginationSizes,
        hasSortableColumns: metaData.hasSortableColumns,
        initialSortColumnId: metaData.initialSortColumnId
      })
    }
  }, [metaData, reviews])

  const handleSearch = (search) => {
    //setSearch(search)
    dispatch(fetchReviewsSearchStart(search))
  }

  const clearSearch = () => {
    //setSearch('')
    dispatch(fetchReviewsItemsStart())
  }

  const filteredItems = () => {
    if (search === '') return data.rows
    return data.rows.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
  }

  const handleModal = (value) => {
    if (value === 'managecolumns') {
      setOpen(true)
    } else {
      doAction(value)
    }
  }

  // Manage columns modal
  const [open, setOpen] = useState(false)
  const [bulkActionsOptions, setBulkActionOptions] = useState({
    openModal: false,
    typeOfAction: null
  })
  const [reviewtasks, setReviewTasks] = useState([])

  return (
    <>
      {open && (
        <GenericModal setOpen={setOpen}>
          <ManageItems
            modalId={manageColumnsModalId}
            title={translate('review.modal.manageColumns.title')}
            description={translate('review.modal.manageColumns.description')}
            submitText={translate('review.modal.manageColumns.submitText')}
            items={data.allColumns}
            onSubmitCallback={updateDisplayedColumns}
          />
        </GenericModal>
      )}
      {bulkActionsOptions.openModal && (
        <GenericModal setOpen={handleBulkActionsModal}>{getActionModal()}</GenericModal>
      )}
      <Styled.BackButtonLink to={'/history'}>
        <Styled.BackButton>← Back erer</Styled.BackButton>
      </Styled.BackButtonLink>

      <Breadcrumbs style={{ margin: '25px 0', fontSize: '12px' }} aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/history" style={{ marginLeft: '10px' }}>
          History
        </Link>
        <Typography color="text.primary" style={{ marginRight: '10px' }}>
          History List
        </Typography>
      </Breadcrumbs>

      <Styled.HeaderWrapper>
        <h1 style={{ fontWeight: 'normal', marginBottom: '7px' }}>
          {translate('history.reviews')}
        </h1>
        <p style={{ fontSize: '14px' }}>{translate('history.reviews.description')}</p>
      </Styled.HeaderWrapper>

      <Styled.TableOptionsWrapper>
        {/* <SearchBox
          onClearCallback={clearSearch}
          onSearchCallback={handleSearch}
          placeholder="Search"
          filterResultsOptions={data.filterResultsOptions}
          groupResultsOptions={data.groupResultsOptions}
        /> */}
        <MSearchBox
          onSearchCallback={handleSearch}
          onClearCallback={clearSearch}
          placeholder="Search"
          onClickCallback={handleModal}
          data=""
          filterResultsOptions=""
          groupResultsOptions=""
          isManageColumnRequired
        />
      </Styled.TableOptionsWrapper>

      {!!data.rows.length && !!data.allColumns.length && (
        <MUITable
          paginationSizes={data.paginationSizes}
          data={data.allColumns}
          items={filteredItems()}
        />
      )}
      {isFetching === 'true' && <Loading />}
      {data.rows.length === 0 && <Alert severity="info">No reviews found</Alert>}
    </>
  )
}

export default Lists
