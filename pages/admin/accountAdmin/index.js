import React, { useState, useEffect } from 'react'
import { debounce } from 'lodash'
import { Link } from 'react-router-dom'
import { Button, Grid, Box } from '@mui/material' // Tabs, Tab,Typography
import { useSelector, useDispatch } from 'react-redux'
import CircularProgress from '@mui/material/CircularProgress'
import { blue } from '@mui/material/colors'
import { useTheme } from '@mui/material/styles'
import { generateOptions } from 'helpers/table'
import translate from 'translations/translate'
import Breadcrumb from 'components/breadcrumb'
import MSearchBox from 'components/mSearchBox'
import { defineColumns, defineRows } from 'helpers/arrays'
// import { getPersonalAssetsByMail } from 'helpers/utils'
// import * as profileAPI from '../../../api/profile'
import * as adminApi from '../../../api/admin'
import AssetTable from '../../../pageComponents/Assets/MyAssetTable'
import { selectNotificationMessage } from '../../../redux/review/review.selector'
import Loading from '../../../components/loading'
import { updateReviewNotificationMessage } from '../../../redux/review/review.action'
import {
  selectShowBigLoader,
  selectShowSmallLoader,
  selectMyAssetsItems,
  selectPerosnalAssetsMetadata,
  isMyAssetsFetching,
  selectAssetsIsGoingForwardFlag,
  selectAssetsPaginationKeys,
  selectAssetsPageNumber,
  selectAssetsPageSize,
  selectMyAssetsSortInfoData
} from '../../../redux/myAssets/myAssets.selector'
import {
  // fetchMyAssetsItemsStart,
  fetchMyAssetsItemsSuccess,
  fetchPersonalAssetsMetadataStart,
  updateShowBigLoader,
  updateAssetsIsGoingForwardFlag,
  updateAssetsPaginationKeys,
  updateMyAssetsItemsStart,
  updateAssetsPageSize,
  updateAssetsPageNumber
  // fetchMyAssetsSortStart
} from '../../../redux/myAssets/myAssets.action'

const AccountAdmin = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  // const [searchKeyword, setSearchKeyword] = useState('')
  // Get My Assets records from redux
  const results = useSelector(selectMyAssetsItems)
  const getNotificationMessage = useSelector(selectNotificationMessage)
  const modifyMeta = useSelector(selectPerosnalAssetsMetadata)
  const isFetching = useSelector(isMyAssetsFetching)
  const showBigLoader = useSelector(selectShowBigLoader)
  const showSmallLoading = useSelector(selectShowSmallLoader)
  const pageNumber = useSelector(selectAssetsPageNumber)
  const pageSize = useSelector(selectAssetsPageSize)
  const isGoingForward = useSelector(selectAssetsIsGoingForwardFlag)
  const paginationKeysArray = useSelector(selectAssetsPaginationKeys)
  const [sortPaginationKeyword, setSortPaginationKeyword] = useState([])
  const sortInfoData = useSelector(selectMyAssetsSortInfoData)

  // const [userInfo, setUserInfo] = useState({})
  const [initialData, setInitialData] = useState({
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

  const handleSearch = (searchKey) => {
    // TODO : call this API when searching accounts
    localStorage.setItem('searchValue', searchKey)
    dispatch(updateAssetsPageSize(10))
    const payload = {
      sAMAccountName: searchKey,
      pageSize: 10,
      pageNumber: 0
    }
    adminApi
      .searchAccounts(payload)
      .then((res) => {
        if (res) {
          dispatch(updateMyAssetsItemsStart({ myAssetsItems: res }))
        }
      })
      .catch((err) => console.error(err))
  }
  const clearSearch = () => {
    dispatch(updateAssetsPageSize(10))
    localStorage.removeItem('searchValue')
    dispatch(updateShowBigLoader(true))
    dispatch(updateMyAssetsItemsStart({ myAssetsItems: {} }))
    dispatch(updateShowBigLoader(false))
  }

  const iff = (consition, then, otherise) => (consition ? then : otherise)

  const getPaginationKeyword = () =>
    isGoingForward
      ? iff(
          Object.keys(results).length > 0 && results?.assetsData[pageSize - 1]?.searchAfterKey,
          results?.assetsData[pageSize - 1]?.searchAfterKey,
          null
        )
      : iff(sortPaginationKeyword, sortPaginationKeyword.slice(-1)[0], '')

  const callAPI = (payload) => {
    adminApi
      .searchAccounts(payload)
      .then((res) => {
        dispatch(updateShowBigLoader(false))
        if (res) {
          dispatch(updateMyAssetsItemsStart({ myAssetsItems: res }))
        }
      })
      .catch((err) => {
        console.error(err)
        dispatch(updateShowBigLoader(false))
      })
  }

  useEffect(() => {
    let payload = {}
    dispatch(updateShowBigLoader(true))

    const searchKey = localStorage.getItem('searchValue')

    dispatch(fetchMyAssetsItemsSuccess({ myAssetsItems: {} }))

    if (!isGoingForward) {
      payload = {
        pageNumber,
        pageSize,
        sAMAccountName: searchKey
      }
      callAPI(payload)
    }
    if (isGoingForward && sortInfoData.sortKey !== '') {
      setSortPaginationKeyword([...sortPaginationKeyword, getPaginationKeyword()])
    }

    if (pageNumber > 0) {
      let paginationKey
      if (sortInfoData.sortKey !== '') {
        paginationKey = isGoingForward
          ? iff(Object.keys(results).length > 0, results?.assetsData[0]?.id, null)
          : iff(
              paginationKeysArray && paginationKeysArray?.length > 0,
              paginationKeysArray?.slice(-1)[0],
              null
            )
      } else {
        payload = {
          pageNumber,
          pageSize,
          sAMAccountName: searchKey
        }
        callAPI(payload)
      }
      console.log(paginationKey)

      if (sortInfoData.sortKey !== '') {
        let sortPayload = sortInfoData.payload
        sortPayload = {
          ...sortPayload,
          pageNumber,
          pageSize,
          sAMAccountName: searchKey
        }
        callAPI(sortPayload)
      }
    } else if (pageSize) {
      payload = {
        pageNumber,
        pageSize,
        sAMAccountName: searchKey
      }
      callAPI(payload)
    }
  }, [pageNumber, pageSize])

  // To render the table when data is available
  useEffect(() => {
    if (modifyMeta && Object.keys(results).length !== 0) {
      const columns = defineColumns(modifyMeta.columns, false, 'Modify')
      const rows = defineRows(
        modifyMeta.columns,
        results?.assetsData ? results?.assetsData : [],
        'Modify'
      )

      const filterResultsOptions = generateOptions(modifyMeta.filterBy, modifyMeta.initialFilterBy)

      const groupResultsOptions = generateOptions(modifyMeta.groupBy, modifyMeta.initialGroupBy)

      setInitialData({
        ...initialData,
        columns,
        rows,
        paginationSizes: modifyMeta.paginationSizes,
        hasSortableColumns: modifyMeta.hasSortableColumns,
        initialSortColumnId: modifyMeta.initialSortColumnId,
        bulkActions: modifyMeta.bulkActions,
        filterResultsOptions: filterResultsOptions.options,
        defaultFilterResultsId: filterResultsOptions.defaultOptionId,
        groupResultsOptions: groupResultsOptions.options,
        defaultGroupResultsId: groupResultsOptions.defaultOptionId
      })
    }
  }, [modifyMeta, results, isFetching])

  useEffect(() => {
    if (
      getNotificationMessage.message &&
      ['success', 'Success', 'info', 'Error', 'error'].includes(getNotificationMessage.type)
    ) {
      setTimeout(() => {
        // dispatch here
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

  useEffect(() => {
    dispatch(updateAssetsIsGoingForwardFlag(true))
    dispatch(updateAssetsPaginationKeys([]))
    setSortPaginationKeyword([])

    return () => {
      clearSearch()
      dispatch(updateAssetsPageSize(10))
      dispatch(updateAssetsPageNumber(0))
    }
  }, [])

  // To Get metadata and  api data on Initital Page
  useEffect(() => {
    dispatch(updateShowBigLoader(true))
    dispatch(fetchPersonalAssetsMetadataStart())
    dispatch(updateShowBigLoader(false))
    localStorage.setItem('component', 'AccountAdmin')
    dispatch(updateAssetsPageSize(10))
    dispatch(updateAssetsPageNumber(0))
  }, [])

  return (
    <>
      <Link to="/admin" style={{ textDecoration: 'none' }}>
        <Button
          variant="text"
          sx={{ fontSize: '14px', color: theme.palette.mode === 'dark' ? '#FFF' : '#0A1C33' }}
        >
          ← {translate('review.back')}
        </Button>
      </Link>
      <Breadcrumb
        path={[
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          { label: translate('admin.header.title'), url: '/admin' },
          { label: translate('accountAdmin.header'), url: '' }
        ]}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid container>
          <Grid item xs={12} style={{ display: 'flex' }}>
            <h1 style={{ fontWeight: 'normal', marginBottom: '10px' }}>
              {translate('accountAdmin.header')}
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
            onSearchCallback={debounce(handleSearch, 1000)}
            onClearCallback={clearSearch}
            placeholder={translate('accountAdmin.placeholder')}
            data=""
            filterResultsOptions=""
            groupResultsOptions=""
            isManageColumnRequired={false}
            setSearch="true"
            isDisabled="false"
            type="AccountAdmin"
          />
        </Grid>
        {showBigLoader && <Loading />}
        {modifyMeta && results && results?.assetsData?.length > 0 ? (
          <Grid item xs={12}>
            <Box
              sx={{
                width: '100%',
                backgroundColor: `${theme.palette.mode === 'dark' ? '#1a2129' : '#FFF'}`
              }}
            >
              <AssetTable
                rows={results && results.assetsData}
                search={initialData.search}
                columns={initialData.columns}
                paginationSizes={initialData.paginationSizes}
                hasSortableColumns={initialData.hasSortableColumns}
                initialSortColumnId={initialData.initialSortColumnId}
                bulkActions={initialData.bulkActions}
                metadata={modifyMeta}
                type="AccountAdmin"
                total={results?.total ? results?.total : 0}
              />
            </Box>
          </Grid>
        ) : null}
      </Grid>
    </>
  )
}
export default AccountAdmin
