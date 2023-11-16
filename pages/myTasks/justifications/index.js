import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import { blue } from '@mui/material/colors'
import translate from 'translations/translate'
import Breadcrumb from 'components/breadcrumb'
import MSearchBox from 'components/mSearchBox'
import { defineColumns, defineRows } from 'helpers/arrays'
import { generateOptions } from 'helpers/table'

import ApprovalsTable from '../../../pageComponents/Approvals/ApprovalsTable'
import Loading from '../../../components/loading'
import {
  fetchJustificationsMetadataStart,
  fetchJustificationsItemsStart,
  updateShowBigLoader,
  updateJustificationsPaginationKeys,
  fetchJustificationsSortStart,
  updateJustificationsPageNumber,
  updateJustificationsPageSize,
  fetchJustificationsSearchStart
} from '../../../redux/justifications/justifications.action'
import {
  selectJustificationsItems,
  selectJustificationsMetadata,
  isJustificationsFetching,
  selectShowBigLoader,
  selectShowSmallLoader,
  selectJustificationsPageNumber,
  selectJustificationsPageSize,
  selectJustificationsPaginationKeys,
  selectJustificationsIsGoingForwardFlag,
  selectJustificationsSortInfoData
} from '../../../redux/justifications/justifications.selector'
import * as Styled from './style'

const Justifications = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const [age, setAge] = React.useState('action')
  const [sortPaginationKeyword, setSortPaginationKeyword] = useState([])

  const iff = (consition, then, otherise) => (consition ? then : otherise)

  // Get justifications records from redux
  const results = useSelector(selectJustificationsItems)
  const justificationsMeta = useSelector(selectJustificationsMetadata)
  const isFetching = useSelector(isJustificationsFetching)
  const showBigLoader = useSelector(selectShowBigLoader)
  const showSmallLoading = useSelector(selectShowSmallLoader)
  const pageNumber = useSelector(selectJustificationsPageNumber)
  const pageSize = useSelector(selectJustificationsPageSize)
  const paginationKeysArray = useSelector(selectJustificationsPaginationKeys)
  const isGoingForward = useSelector(selectJustificationsIsGoingForwardFlag)
  const sortInfoData = useSelector(selectJustificationsSortInfoData)

  const [initialData, setInitialData] = useState({
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
    defaultGroupResultsId: 'All',

    // Search
    search: ''
  })

  const handleSearch = (searchData) => {
    dispatch(updateShowBigLoader(true))
    localStorage.setItem('searchValue', searchData)
    dispatch(updateJustificationsPageNumber(0))
    dispatch(updateJustificationsPageSize(10))
    const payload = {
      searchIn: 'PendingJustification',
      searchFor: searchData,
      searchInValue: 'true',
      pageSize,
      pageNumber
    }
    dispatch(fetchJustificationsSearchStart(payload))
  }
  const clearSearch = () => {
    dispatch(updateShowBigLoader(true))
    localStorage.setItem('searchValue', '')
    dispatch(updateJustificationsPageNumber(0))
    dispatch(fetchJustificationsItemsStart(pageSize, 0))
  }

  // To Get metadata and  api data on Initital Page
  useEffect(() => {
    dispatch(fetchJustificationsMetadataStart())
    dispatch(updateShowBigLoader(true))
    setSortPaginationKeyword([])
    localStorage.removeItem('searchValue')
  }, [])

  const getPaginationKeyword = () =>
    isGoingForward
      ? iff(
          Object.keys(results).length > 0 && results?.justificationData[0]?.sortKeyword,
          results?.justificationData[0]?.sortKeyword,
          null
        )
      : iff(sortPaginationKeyword, sortPaginationKeyword.slice(-1)[0], '')

  useEffect(() => {
    dispatch(updateShowBigLoader(true))
    const searchKey = localStorage.getItem('searchValue')
    if (![null, undefined, ''].includes(searchKey)) {
      const payload = {
        searchIn: 'PendingJustification',
        searchFor: localStorage.getItem('searchValue'),
        searchInValue: 'true',
        pageSize,
        pageNumber
      }
      dispatch(fetchJustificationsSearchStart(payload))
    } else {
      if (!isGoingForward && paginationKeysArray.length > 0) {
        paginationKeysArray.pop()
        dispatch(updateJustificationsPaginationKeys(paginationKeysArray))
        if (sortInfoData.sortKey !== '' && sortPaginationKeyword.length > 0) {
          sortPaginationKeyword.pop()
          setSortPaginationKeyword(sortPaginationKeyword)
        }
      }
      if (isGoingForward && sortInfoData.sortKey !== '') {
        setSortPaginationKeyword([...sortPaginationKeyword, getPaginationKeyword()])
      }
      if (pageNumber > 0) {
        // let paginationKey
        if (sortInfoData.sortKey !== '') {
          // paginationKey = isGoingForward
          //   ? iff(Object.keys(results).length > 0, results?.justificationData[0]?.id, null)
          //   : iff(
          //       paginationKeysArray && paginationKeysArray?.length > 0,
          //       paginationKeysArray?.slice(-1)[0],
          //       null
          //     )
        } else {
          // paginationKey = isGoingForward
          //   ? iff(Object.keys(results).length > 0, results?.justificationData?.slice(-1)[0]?.id, null)
          //   : iff(
          //       paginationKeysArray && paginationKeysArray?.length > 0,
          //       paginationKeysArray?.slice(-1)[0],
          //       null
          //     )
        }

        if (sortInfoData.sortKey !== '') {
          // const sortPaginationKeyWord = getPaginationKeyword()
          let sortPayload = sortInfoData.payload
          sortPayload = {
            ...sortPayload,
            // search_after_primaryKey: paginationKey,
            // search_after_keyWord: sortPaginationKeyWord,
            pageSize,
            pageNumber
          }
          dispatch(fetchJustificationsSortStart(sortPayload))
        } else {
          dispatch(fetchJustificationsItemsStart(pageSize, pageNumber))
        }
      } else if (sortInfoData.sortKey !== '') {
        const sortPaginationKeyWord = getPaginationKeyword()
        let sortPayload = sortInfoData.payload
        sortPayload = {
          ...sortPayload,
          search_after_keyWord: sortPaginationKeyWord,
          pageSize,
          pageNumber
        }
        dispatch(fetchJustificationsSortStart(sortPayload))
      } else {
        dispatch(fetchJustificationsItemsStart(pageSize, pageNumber))
      }
    }
  }, [pageNumber, pageSize])

  // To render the table when data is available
  useEffect(async () => {
    if (justificationsMeta && Object.keys(results).length !== 0) {
      const columns = defineColumns(justificationsMeta.columns, false, 'Justifications')
      const rows = defineRows(
        justificationsMeta.columns,
        results.justificationData,
        'Justifications'
      )

      const filterResultsOptions = generateOptions(
        justificationsMeta.filterBy,
        justificationsMeta.initialFilterBy
      )

      const groupResultsOptions = generateOptions(
        justificationsMeta.groupBy,
        justificationsMeta.initialGroupBy
      )

      setInitialData({
        ...initialData,
        columns,
        rows,
        paginationSizes: justificationsMeta.paginationSizes,
        hasSortableColumns: justificationsMeta.hasSortableColumns,
        initialSortColumnId: justificationsMeta.initialSortColumnId,
        bulkActions: justificationsMeta.bulkActions,
        filterResultsOptions: filterResultsOptions.options,
        defaultFilterResultsId: filterResultsOptions.defaultOptionId,
        groupResultsOptions: groupResultsOptions.options,
        defaultGroupResultsId: groupResultsOptions.defaultOptionId
      })
    }
  }, [justificationsMeta, results, isFetching])
  useEffect(
    () => () => {
      localStorage.removeItem('searchValue')
    },
    []
  )
  return (
    <>
      <Styled.BackButtonLink to="/tasks">
        <Styled.BackButton>← {translate('review.back')}</Styled.BackButton>
      </Styled.BackButtonLink>
      <Breadcrumb
        path={[
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          { label: translate('myTasks.header.title'), url: '/tasks' },
          { label: translate('justification.justificationList'), url: '' }
        ]}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid container>
          <Grid item xs={12} style={{ display: 'flex' }}>
            <h1 style={{ fontWeight: 'normal', marginBottom: '10px' }}>
              {' '}
              {translate('myTasks.justifications')}
            </h1>
            <div style={{ marginTop: '22px', marginLeft: '5px' }}>
              {showSmallLoading && (
                <CircularProgress
                  size={23}
                  sx={{ top: '5px', marginBottom: '10px', position: 'relative', color: blue[500] }}
                />
              )}
            </div>
          </Grid>
        </Grid>
      </div>
      <Grid sx={{ padding: '9px 11px 6px 9px' }}>
        <Grid
          item
          xs={12}
          sx={{ background: theme.palette.mode === 'dark' ? '#182B44' : '#FFF', display: 'flex' }}
        >
          <MSearchBox
            onSearchCallback={handleSearch}
            onClearCallback={clearSearch}
            placeholder={translate('justification.search.placeholder')}
            age={age}
            setAge={setAge}
            data={initialData.bulkActions}
            filterResultsOptions=""
            groupResultsOptions=""
            type="Justifications"
            isManageColumnRequired={false}
          />
        </Grid>
        {showBigLoader && <Loading />}
        <Grid item xs={12}>
          <Box>
            {results && (
              <ApprovalsTable
                rows={results.justificationData}
                search={initialData.search}
                columns={initialData.columns}
                paginationSizes={initialData.paginationSizes}
                hasSortableColumns={initialData.hasSortableColumns}
                initialSortColumnId={initialData.initialSortColumnId}
                bulkActions={initialData.bulkActions}
                metadata={justificationsMeta}
                type="Justifications"
                total={results?.total ? results?.total : 0}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default Justifications
