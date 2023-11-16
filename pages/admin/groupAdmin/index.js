import React, { useState, useEffect } from 'react'
import { debounce } from 'lodash'
import { Link } from 'react-router-dom'
import { Button, Grid, Box } from '@mui/material' // Tabs, Tab,Typography
import { useTheme } from '@mui/material/styles'
import { useSelector, useDispatch } from 'react-redux'
import Breadcrumb from 'components/breadcrumb'
import MSearchBox from 'components/mSearchBox'
import { defineColumns, defineRows } from 'helpers/arrays'
import translate from 'translations/translate'
import AssetTable from '../../../pageComponents/Assets/MyAssetTable'
import { selectNotificationMessage } from '../../../redux/review/review.selector'
import Loading from '../../../components/loading'
import { updateReviewNotificationMessage } from '../../../redux/review/review.action'
import {
  selectShowBigLoader,
  selectGroupAssetsItems,
  selectAssetsPageNumber,
  selectAssetsPageSize,
  selectAssetsIsGoingForwardFlag,
  selectAssetsPaginationKeys,
  selectMyAssetsSortInfoData,
  selectGroupAssetsMetadata
} from '../../../redux/myAssets/myAssets.selector'

import {
  updateShowBigLoader,
  updateAssetsIsGoingForwardFlag,
  updateAssetsPaginationKeys,
  fetchGroupAssetsMetadataStart,
  fetchGroupAssetsItemsSuccess,
  fetchSearchGroupAssetsItemsStart,
  updateAssetsPageSize,
  updateAssetsPageNumber
} from '../../../redux/myAssets/myAssets.action'
import { selectProfileDetailsSelector } from '../../../redux/profile/profile.selector'

const GroupAdmin = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const [searchKeyword, setSearchKeyword] = useState('')
  // Get My Assets group records from redux
  const groupResults = useSelector(selectGroupAssetsItems)
  const groupMeta = useSelector(selectGroupAssetsMetadata)
  const showBigLoader = useSelector(selectShowBigLoader)
  const getNotificationMessage = useSelector(selectNotificationMessage)
  const pageNumber = useSelector(selectAssetsPageNumber)
  const pageSize = useSelector(selectAssetsPageSize)
  const isGoingForward = useSelector(selectAssetsIsGoingForwardFlag)
  const paginationKeysArray = useSelector(selectAssetsPaginationKeys)
  const [sortPaginationKeyword, setSortPaginationKeyword] = useState([])
  const sortInfoData = useSelector(selectMyAssetsSortInfoData)
  const profile = useSelector(selectProfileDetailsSelector)

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
    setSearchKeyword(searchKey)
    dispatch(updateAssetsPageSize(10))
    localStorage.setItem('groupAdmin-searchKey', searchKey)
    if (searchKey || searchKeyword) {
      const payload = {
        displayName: searchKey,
        pageSize: 10,
        userEmail: `${profile?.mail}`,
        pageNumber: 0
      }
      dispatch(fetchSearchGroupAssetsItemsStart(payload))
    }
  }
  const clearSearch = () => {
    dispatch(updateAssetsPageSize(10))
    localStorage.removeItem('groupAdmin-searchKey')
    setSearchKeyword('')
    dispatch(updateShowBigLoader(true))
    dispatch(fetchGroupAssetsItemsSuccess({ groupAssetsItems: {} }))
    dispatch(updateShowBigLoader(false))
  }

  const iff = (consition, then, otherise) => (consition ? then : otherise)

  const getPaginationKeyword = () =>
    isGoingForward
      ? iff(
          Object.keys(groupResults).length > 0 &&
            groupResults?.groupData[pageSize - 1]?.searchAfterKey,
          groupResults?.groupData[pageSize - 1]?.searchAfterKey,
          null
        )
      : iff(sortPaginationKeyword, sortPaginationKeyword.slice(-1)[0], '')

  const callAPI = (payload) => {
    dispatch(fetchSearchGroupAssetsItemsStart(payload))
  }
  useEffect(() => {
    let payload = {}
    const searchKey = localStorage.getItem('groupAdmin-searchKey')
    dispatch(updateShowBigLoader(true))
    dispatch(fetchGroupAssetsItemsSuccess({ groupAssetsItems: {} }))

    if (!isGoingForward) {
      payload = {
        displayName: searchKey,
        pageSize,
        userEmail: `${profile?.mail}`,
        pageNumber
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
          ? iff(Object.keys(groupResults).length > 0, groupResults?.groupData[0]?.id, null)
          : iff(
              paginationKeysArray && paginationKeysArray?.length > 0,
              paginationKeysArray?.slice(-1)[0],
              null
            )
      } else {
        payload = {
          displayName: searchKey,
          pageSize,
          userEmail: `${profile?.mail}`,
          pageNumber
        }

        callAPI(payload)
      }

      if (sortInfoData.sortKey !== '') {
        const sortPaginationKeyWord = getPaginationKeyword()
        let sortPayload = sortInfoData.payload
        sortPayload = {
          ...sortPayload,
          search_after_primaryKey: paginationKey,
          search_after_keyWord: sortPaginationKeyWord
        }
        console.log(sortPayload)
        // still not have sort API for Admin Group sort
      }

      // else {
      //   payload = {
      //     searchValue: searchKeyword,
      //     pageSize: 10,
      //     search_after_primaryKey: paginationKey,
      //     userEmail: `${profile.mail}`
      //   }
      //   dispatch(fetchSearchGroupAssetsItemsStart(payload))
      // }
    } else if (pageSize) {
      payload = {
        displayName: searchKey,
        pageSize,
        userEmail: `${profile?.mail}`,
        pageNumber
      }
      callAPI(payload)
    }
    // else if (searchKeyword) {
    //   payload = {
    //     searchValue: searchKeyword,
    //     pageSize: 10,
    //     userEmail: `${profile.mail}`
    //   }
    //   dispatch(fetchSearchGroupAssetsItemsStart(payload))
    // }
  }, [pageNumber, pageSize])

  // To render the table when data is available
  useEffect(() => {
    if (groupMeta && groupResults && Object.keys(groupResults).length > 0) {
      dispatch(updateShowBigLoader(false))
      const columns = defineColumns(groupMeta.columns, false, 'GroupAdmin')
      const rows = defineRows(groupMeta.columns, groupResults.groupData, 'ModifyGroup')

      setInitialData({
        ...initialData,
        columns,
        rows,
        paginationSizes: groupMeta.paginationSizes,
        hasSortableColumns: groupMeta.hasSortableColumns,
        initialSortColumnId: groupMeta.initialSortColumnId,
        bulkActions: groupMeta.bulkActions
      })
    }
  }, [groupMeta, groupResults])

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

  useEffect(
    () => () => {
      dispatch(updateAssetsIsGoingForwardFlag(true))
      dispatch(updateAssetsPaginationKeys([]))
      setSortPaginationKeyword([])
      clearSearch()
      dispatch(updateAssetsPageSize(10))
      dispatch(updateAssetsPageNumber(0))
    },
    []
  )

  // To Get metadata and  api data on Initital Page
  useEffect(() => {
    setSearchKeyword(localStorage.getItem('groupAdmin-searchKey'))
    dispatch(updateShowBigLoader(true))
    dispatch(fetchGroupAssetsMetadataStart())
    dispatch(updateShowBigLoader(false))
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
          { label: translate('groupAdmin.header'), url: '' }
        ]}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid container>
          <Grid item xs={12} style={{ display: 'flex' }}>
            <h1 style={{ fontWeight: 'normal', marginBottom: '10px' }}>
              {translate('groupAdmin.header')}
            </h1>
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
            onSearchCallback={debounce(handleSearch, 500)}
            onClearCallback={clearSearch}
            placeholder={translate('groupAdmin.placeholder')}
            data=""
            filterResultsOptions=""
            groupResultsOptions=""
            isManageColumnRequired={false}
            setSearch="true"
            isDisabled="false"
            type="GroupAdmin"
          />
        </Grid>
        {showBigLoader && <Loading />}

        {groupMeta && groupResults && groupResults?.groupData?.length > 0 ? (
          <Grid item xs={12}>
            <Box
              sx={{
                width: '100%',
                backgroundColor: `${theme.palette.mode === 'dark' ? '#1a2129' : '#FFF'}`
              }}
            >
              <AssetTable
                rows={groupResults?.groupData}
                search={initialData.search}
                columns={initialData.columns}
                paginationSizes={initialData.paginationSizes}
                hasSortableColumns={initialData.hasSortableColumns}
                initialSortColumnId={initialData.initialSortColumnId}
                bulkActions={initialData.bulkActions}
                metadata={groupMeta}
                type="GroupAdmin"
                total={groupResults?.total ? groupResults?.total : 0}
              />
            </Box>
          </Grid>
        ) : null}
      </Grid>
    </>
  )
}
export default GroupAdmin
