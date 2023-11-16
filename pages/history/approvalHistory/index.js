import React, { useEffect, useState } from 'react'
import { Alert } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import translate from 'translations/translate'
import { defineColumns, defineRows } from 'helpers/arrays'
import Breadcrumb from 'components/breadcrumb'
import Loading from 'components/loading'
import MSearchBox from 'components/mSearchBox'
import MUITable from 'components/MUITable'
import { generateOptions } from 'helpers/table'
import { Notification } from 'components/notification'
import {
  fetchApprovalHistoryMetadataStart,
  fetchApprovalHistoryItemsStart,
  fetchApprovalHistoryItemsSuccess,
  updateShowBigLoader,
  fetchApprovalHistorySearchStart,
  fetchApprovalHistorySortStart,
  updatePageSizeApprovalHistory,
  updatePageNumberApprovalHistory
} from 'redux/history/approvalHistory/approvalHistory.action'
import { isParsable } from 'helpers/utils'
import {
  selectApprovalHistoryMetadata,
  selectApprovalHistoryItems,
  selectApprovalHistoryPageNumber,
  selectApprovalHistoryPageSize,
  isApprovalHistoryFetching,
  selectShowBigLoader,
  selectApprovalHistorySortInfoData
} from '../../../redux/history/approvalHistory/approvalHistory.selector'
import * as Styled from './style'

const ApprovalHistory = () => {
  const [totalCount, setTotalCount] = useState(0)
  const dispatch = useDispatch()
  const metaData = useSelector(selectApprovalHistoryMetadata)
  const approvalHistory = useSelector(selectApprovalHistoryItems)
  const pageNumber = useSelector(selectApprovalHistoryPageNumber)
  const pageSize = useSelector(selectApprovalHistoryPageSize)
  const showBigLoader = useSelector(selectShowBigLoader)

  const sortInfoData = useSelector(selectApprovalHistorySortInfoData)

  const isFetching = useSelector(isApprovalHistoryFetching)
  const [notification, setNotification] = useState({ description: '', variant: '' })
  // eslint-disable-next-line no-unused-vars
  const [search, setSearch] = useState('')
  const type = 'Approval History'
  const initialPayload = {
    pageSize,
    pageNumber
  }

  const [data, setData] = useState({
    allColumns: [],
    rows: [],
    paginationSizes: undefined,
    hasSortableColumns: false,
    initialSortColumnId: ''
  })

  const handleSearch = (searchData) => {
    // localStorage.setItem('searchValue', searchData)
    let payload
    if (searchData && Object.values(searchData).some((val) => val !== '')) {
      const { startDate, endDate } = searchData
      if ((startDate === '' && endDate === '') || (startDate && endDate)) {
        localStorage.setItem('searchValue', JSON.stringify(searchData))
        dispatch(updatePageSizeApprovalHistory(10))
        dispatch(updatePageNumberApprovalHistory(0))
        payload = {
          ...searchData,
          searchIn: 'ApprovalHistory',
          searchInValue: 'complete',
          pageSize,
          pageNumber
        }
        dispatch(fetchApprovalHistorySearchStart(payload))
      } else {
        setNotification({
          description: 'serviceDesk.dateError',
          variant: 'error'
        })
      }
    } else if (Object.values(searchData).every((val) => val === '')) {
      setNotification({
        description: 'serviceDesk.emptyValues',
        variant: 'error'
      })
    }
  }

  const clearSearch = () => {
    localStorage.setItem('searchValue', '')
    dispatch(fetchApprovalHistoryItemsStart(initialPayload))
  }

  const filteredItems = () => {
    if (search === '') return data.rows
    return data.rows.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
  }
  useEffect(
    () => () => {
      dispatch(updatePageSizeApprovalHistory(10))
      dispatch(updatePageNumberApprovalHistory(0))
      localStorage.removeItem('searchValue')
    },
    []
  )
  useEffect(() => {
    localStorage.removeItem('approvalHistoryId')
    localStorage.removeItem('searchValue')
    dispatch(fetchApprovalHistoryMetadataStart())
    dispatch(updateShowBigLoader(true))
    dispatch(fetchApprovalHistoryItemsStart(initialPayload))
    dispatch(fetchApprovalHistoryItemsSuccess(null))
  }, [])

  useEffect(() => {
    if (notification.description && ['success', 'error'].includes(notification.variant)) {
      setTimeout(() => {
        // Set empty notification after timeout
        if (notification.variant === 'error') {
          dispatch(updateShowBigLoader(false))
        }
        setNotification({ description: '', variant: '' })
      }, 5000)
    }
  }, [notification.variant])

  useEffect(() => {
    if (!!metaData && !!approvalHistory) {
      const allColumns = defineColumns(metaData.columns)
      const rows = defineRows(metaData.columns, approvalHistory.approvalData, type)
      setTotalCount(approvalHistory.total)
      const filterResultsOptions = generateOptions(metaData.filterBy, metaData.initialFilterBy)
      const groupResultsOptions = generateOptions(metaData.groupBy, metaData.initialGroupBy)
      setData({
        allColumns,
        rows,
        paginationSizes: metaData.paginationSizes,
        hasSortableColumns: metaData.hasSortableColumns,
        initialSortColumnId: metaData.initialSortColumnId,
        filterResultsOptions: filterResultsOptions.options,
        defaultFilterResultsId: filterResultsOptions.defaultOptionId,
        groupResultsOptions: groupResultsOptions.options,
        defaultGroupResultsId: groupResultsOptions.defaultOptionId
      })
    }
  }, [metaData, approvalHistory])

  useEffect(() => {
    dispatch(updateShowBigLoader(true))
    const searchDetails = localStorage.getItem('searchValue')
    const searchKey = isParsable(searchDetails) ? JSON.parse(searchDetails) : searchDetails
    let payload
    if (![null, undefined, ''].includes(searchKey) && sortInfoData.sortKey === '') {
      if (typeof searchKey === 'object') {
        // searchKey = JSON.parse(localStorage.getItem('searchValue'))
        payload = {
          ...searchKey,
          searchIn: 'ApprovalHistory',
          searchInValue: 'complete',
          pageSize,
          pageNumber
        }
      } else {
        payload = {
          searchIn: 'ApprovalHistory',
          searchInValue: 'complete',
          searchFor: searchKey,
          pageSize,
          pageNumber
        }
      }
      dispatch(fetchApprovalHistorySearchStart(payload))
    } else if (pageNumber > 0) {
      if (sortInfoData.sortKey !== '') {
        let sortPayload = sortInfoData.payload
        sortPayload = {
          ...sortInfoData.payload,
          pageSize,
          pageNumber
        }
        dispatch(fetchApprovalHistorySortStart(sortPayload))
      } else {
        const newPayload = {
          searchIn: 'ApprovalHistory',
          searchInValue: 'complete',
          pageSize,
          pageNumber
        }
        if (['object'].includes(typeof searchKey) && ![null, undefined, ''].includes(searchKey)) {
          dispatch(fetchApprovalHistorySearchStart({ ...newPayload, searchKey }))
        } else if (
          ['string'].includes(typeof searchKey && ![null, undefined, ''].includes(searchKey)) &&
          ![null, undefined, ''].includes(searchKey)
        ) {
          dispatch(fetchApprovalHistorySearchStart({ ...newPayload, searchFor: searchKey }))
        } else {
          dispatch(fetchApprovalHistoryItemsStart({}))
        }
      }
    } else if (sortInfoData.sortKey !== '') {
      const sortPayload = { ...sortInfoData.payload, pageSize, pageNumber }
      dispatch(fetchApprovalHistorySortStart(sortPayload))
    } else {
      const newPayload = {
        searchIn: 'ApprovalHistory',
        searchInValue: 'complete',
        pageSize,
        pageNumber
      }
      if (['object'].includes(typeof searchKey) && ![null, undefined, ''].includes(searchKey)) {
        dispatch(fetchApprovalHistorySearchStart({ ...newPayload, searchKey }))
      } else if (
        ['string'].includes(typeof searchKey) &&
        ![null, undefined, ''].includes(searchKey)
      ) {
        dispatch(fetchApprovalHistorySearchStart({ ...newPayload, searchFor: searchKey }))
      } else {
        dispatch(fetchApprovalHistoryItemsStart(initialPayload))
      }
    }
  }, [pageNumber, pageSize])

  return (
    <>
      <Styled.BackButtonLink to="/history">
        <Styled.BackButton>← {translate('review.back')}</Styled.BackButton>
      </Styled.BackButtonLink>
      <Breadcrumb
        path={[
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          { label: translate('navItem.label.history'), url: '/history' },
          { label: translate('navItem.label.approvalthistory'), url: '' }
        ]}
      />

      {notification.description && (
        <div
          id="main"
          style={{ position: 'relative', top: 0, right: 0, zIndex: 300, minWidth: '8%' }}
        >
          <div
            id="a1"
            style={{
              position: 'absolute',
              right: 0,
              top: '70px'
            }}
          >
            <Styled.NotificationWrapper type={notification.variant}>
              <Notification
                description={translate(notification.description)}
                variant={notification.variant}
                sx={{ zIndex: 503 }}
              />
            </Styled.NotificationWrapper>
          </div>
        </div>
      )}

      <Styled.HeaderWrapper>
        <h1 style={{ fontWeight: 'normal', marginBottom: '25px' }}>
          {translate('history.approvals')}
        </h1>
      </Styled.HeaderWrapper>
      <Styled.TableOptionsWrapper>
        <MSearchBox
          onSearchCallback={handleSearch}
          onClearCallback={clearSearch}
          placeholder={translate('approvalHistory.search.placeholder')}
          data=""
          filterResultsOptions=""
          groupResultsOptions=""
          isManageColumnRequired={false}
          type="ApprovalsHistory"
        />
      </Styled.TableOptionsWrapper>

      {!!data.rows.length && !!data.allColumns.length && (
        <MUITable
          pageSizes={data.paginationSizes}
          allColumns={data.allColumns}
          type={type}
          data={filteredItems()}
          totalCount={totalCount}
          hasSort={data.hasSortableColumns}
        />
      )}
      {(isFetching || showBigLoader) && <Loading />}
      {data.rows.length === 0 && (
        <Alert severity="info">{translate('history.approvalhistory.alert')}</Alert>
      )}
    </>
  )
}

export default ApprovalHistory
