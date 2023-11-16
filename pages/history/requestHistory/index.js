import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert } from '@mui/material'
import translate from 'translations/translate'
import { defineColumns, defineRows } from 'helpers/arrays'
import { generateOptions } from 'helpers/table'
import Breadcrumb from 'components/breadcrumb'
import Loading from 'components/loading'
import MSearchBox from 'components/mSearchBox'
import MUITable from 'components/MUITable'
import { isParsable } from 'helpers/utils'
import { Notification } from 'components/notification'
import {
  fetchRequestHistoryMetadataStart,
  fetchRequestHistoryItemsStart,
  fetchRequestHistorySearchStart,
  fetchRequestHistoryItemsSuccess,
  updateShowBigLoader,
  fetchRequestHistorySortStart,
  fetchRequestHistorySortByUserStart,
  fetchRequestHistoryItemsByUserStart,
  updateRequestHistorySortInfoData,
  updatePageNumberRequestHistory,
  fetchRequestHistorySearchByUserStart,
  updatePageSizeRequestHistory
} from '../../../redux/history/requestHistory/requestHistory.action'
import {
  selectRequestHistoryMetadata,
  selectRequestHistoryItems,
  selectRequestHistoryPageNumber,
  selectRequestHistoryPageSize,
  isRequestHistoryFetching,
  selectShowBigLoader,
  selectRequestHistorySortInfoData
} from '../../../redux/history/requestHistory/requestHistory.selector'
import * as Styled from './style'

const RequestHistory = ({ userId, userEmail }) => {
  const [totalCount, setTotalCount] = useState(0)
  const dispatch = useDispatch()
  const metaData = useSelector(selectRequestHistoryMetadata)
  const requestHistory = useSelector(selectRequestHistoryItems)
  const pageNumber = useSelector(selectRequestHistoryPageNumber)
  const pageSize = useSelector(selectRequestHistoryPageSize)
  const showBigLoader = useSelector(selectShowBigLoader)
  const componentType = localStorage.getItem('component')

  const sortInfoData = useSelector(selectRequestHistorySortInfoData)

  const isFetching = useSelector(isRequestHistoryFetching)
  const [notification, setNotification] = useState({ description: '', variant: '' })

  // eslint-disable-next-line no-unused-vars
  const [search, setSearch] = useState('')
  const [searchedValue, setSearchValue] = useState('')
  const type = 'Request History'
  const initialPayload = {
    saKeyWord: null,
    saprimaryKey: null,
    pageSize,
    pageNumber
  }
  const reporteePayload = {
    reporteeMail: userEmail,
    isDraft: false,
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
    setSearchValue(searchData)
    let payload
    if (searchData && Object.values(searchData).some((val) => val !== '')) {
      const { startDate, endDate } = searchData
      if ((startDate === '' && endDate === '') || (startDate && endDate)) {
        localStorage.setItem('searchValue', JSON.stringify(searchData))
        dispatch(updatePageNumberRequestHistory(0))
        dispatch(updatePageSizeRequestHistory(10))
        payload = {
          ...searchData,
          searchIn: 'RequestHistory',
          searchInValue: 'false',
          pageSize,
          pageNumber
        }
        dispatch(fetchRequestHistorySearchStart(payload))
      } else if (componentType === 'MyTeam') {
        payload = {
          ...reporteePayload,
          searchFor: searchData
        }
        dispatch(fetchRequestHistorySearchByUserStart(payload))
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
    setSearchValue('')
    localStorage.setItem('searchValue', '')
    dispatch(updateShowBigLoader(true))
    dispatch(updatePageNumberRequestHistory(0))
    if (userId) {
      dispatch(fetchRequestHistoryItemsByUserStart(reporteePayload))
    } else {
      dispatch(fetchRequestHistoryItemsStart(initialPayload))
    }
  }

  const filteredItems = () => {
    if (search === '') return data.rows
    return data.rows.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
  }

  useEffect(
    () => () => {
      dispatch(fetchRequestHistoryItemsSuccess(null))
      dispatch(
        updateRequestHistorySortInfoData({
          sortKey: '',
          isAscending: 'asc',
          payload: {}
        })
      )
      dispatch(updatePageNumberRequestHistory(0))
      dispatch(updatePageSizeRequestHistory(10))
      localStorage.removeItem('searchValue')
    },
    []
  )

  useEffect(() => {
    localStorage.removeItem('requestHistoryId')
    localStorage.removeItem('searchValue')
    if (!userId) {
      localStorage.removeItem('component')
      localStorage.removeItem('myTeam-userId')
      localStorage.removeItem('myTeam-userEmail')
      localStorage.removeItem('myTeam-userName')
      localStorage.removeItem('myTeam-selectedTab')
    }
    dispatch(fetchRequestHistoryMetadataStart())
    dispatch(updateShowBigLoader(true))

    if (userId) {
      dispatch(fetchRequestHistoryItemsByUserStart(reporteePayload))
    } else {
      dispatch(fetchRequestHistoryItemsStart(initialPayload))
    }
  }, [])

  useEffect(() => {
    if (!!metaData && !!requestHistory) {
      const allColumns = defineColumns(metaData.columns)
      const rows = defineRows(metaData.columns, requestHistory.historyData, type)
      setTotalCount(requestHistory.total)
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
  }, [metaData, requestHistory])

  useEffect(() => {
    const searchDetails = localStorage.getItem('searchValue')
    const searchKey = isParsable(searchDetails) ? JSON.parse(searchDetails) : searchDetails
    if (![null, undefined, ''].includes(searchKey) && sortInfoData.sortKey === '') {
      let payload
      if (typeof searchKey === 'object') {
        payload = {
          ...searchKey,
          searchIn: 'RequestHistory',
          searchInValue: 'false',
          pageSize,
          pageNumber
        }
      } else {
        payload = {
          searchIn: 'RequestHistory',
          searchInValue: 'false',
          searchFor: searchKey,
          pageSize,
          pageNumber
        }
      }
      if (userId && userEmail) {
        payload = {
          ...reporteePayload,
          searchFor: searchKey
        }
        dispatch(fetchRequestHistorySearchByUserStart(payload))
      } else {
        dispatch(fetchRequestHistorySearchStart(payload))
      }
    } else if (pageNumber > 0) {
      if (sortInfoData.sortKey !== '') {
        let sortPayload = userId ? { ...sortInfoData.payload, id: userId } : sortInfoData.payload
        sortPayload = {
          ...sortPayload,
          pageSize,
          pageNumber
        }
        dispatch(fetchRequestHistorySortStart(sortPayload))
      } else {
        let newPayload = userId ? reporteePayload : initialPayload
        if (userId) {
          newPayload = searchedValue ? { ...newPayload, searchFor: searchedValue } : newPayload
          if (searchedValue) {
            dispatch(
              fetchRequestHistorySearchByUserStart({
                ...newPayload
              })
            )
          } else {
            dispatch(
              fetchRequestHistoryItemsByUserStart({
                ...newPayload
              })
            )
          }
        } else {
          newPayload = {
            searchIn: 'RequestHistory',
            searchInValue: 'false',
            pageSize,
            pageNumber
          }
          if (typeof searchKey === 'object' && ![null, undefined, ''].includes(searchKey)) {
            dispatch(fetchRequestHistorySearchStart({ ...newPayload, searchKey }))
          } else if (typeof searchKey === 'string' && ![null, undefined, ''].includes(searchKey)) {
            dispatch(fetchRequestHistorySearchStart({ ...newPayload, searchFor: searchKey }))
          } else {
            dispatch(fetchRequestHistoryItemsStart({}))
          }
        }
      }
    } else if (sortInfoData.sortKey !== '') {
      const sortPayload = userId
        ? { ...sortInfoData.payload, isDraft: 'false', pageSize, pageNumber }
        : { ...sortInfoData.payload, pageSize, pageNumber }
      if (userId) {
        dispatch(fetchRequestHistorySortByUserStart(sortPayload))
      } else {
        dispatch(fetchRequestHistorySortStart(sortPayload))
      }
    } else {
      const payload = userId ? reporteePayload : initialPayload
      let newPayload
      if (userId) {
        newPayload = searchedValue ? { ...payload, searchFor: searchedValue } : payload
        if (searchedValue) {
          dispatch(
            fetchRequestHistorySearchByUserStart({
              ...newPayload
            })
          )
        } else {
          dispatch(fetchRequestHistoryItemsByUserStart(newPayload))
        }
      } else {
        newPayload = {
          searchIn: 'RequestHistory',
          searchInValue: 'false',
          pageSize,
          pageNumber
        }
        if (typeof searchKey === 'object' && ![null, undefined, ''].includes(searchKey)) {
          dispatch(fetchRequestHistorySearchStart({ ...newPayload, searchKey }))
        } else if (typeof searchKey === 'string' && ![null, undefined, ''].includes(searchKey)) {
          dispatch(fetchRequestHistorySearchStart({ ...newPayload, searchFor: searchKey }))
        } else {
          dispatch(fetchRequestHistoryItemsStart(payload))
        }
      }
    }
  }, [pageNumber, pageSize])

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

  return (
    <>
      {!userId && (
        <>
          <Styled.BackButtonLink to="/history">
            <Styled.BackButton>← {translate('review.back')}</Styled.BackButton>
          </Styled.BackButtonLink>
          <Breadcrumb
            path={[
              { label: translate('navItem.label.dashboard'), url: '/dashboard' },
              { label: translate('navItem.label.history'), url: '/history' },
              { label: translate('navItem.label.requesthistory'), url: '' }
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
            <div style={{ display: 'flex' }}>
              <h1 style={{ fontWeight: 'normal', marginBottom: '25px' }}>
                {translate('history.requesthistory')}
              </h1>
            </div>
          </Styled.HeaderWrapper>
        </>
      )}
      <Styled.TableOptionsWrapper>
        <MSearchBox
          onSearchCallback={handleSearch}
          onClearCallback={clearSearch}
          placeholder={translate('requestHistory.search.placeholder')}
          data=""
          filterResultsOptions=""
          groupResultsOptions=""
          isManageColumnRequired={false}
          type="RequestHistory"
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
        <Alert severity="info">{translate('history.requesthistory.alert')}</Alert>
      )}
    </>
  )
}

export default RequestHistory
