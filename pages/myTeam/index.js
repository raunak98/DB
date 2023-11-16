import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert } from '@mui/material'
import translate from 'translations/translate'
import Breadcrumb from 'components/breadcrumb'
import MSearchBox from 'components/mSearchBox'
import MUITable from 'components/MUITable'
import GenericModal from 'components/genericModal'
import ManageItems from 'advancedComponents/modals/manageItems'
import { defineColumns, defineRows } from 'helpers/arrays'
import Loading from 'components/loading'
import {
  fetchMyTeamMetadataStart,
  fetchMyTeamItemsStart,
  fetchMyTeamSearchStart,
  fetchMyTeamItemsSuccess,
  updateShowBigLoader,
  updateMyTeamPaginationKeys,
  fetchMyTeamSortStart,
  updateMyTeamPageSize,
  updateMyTeamPageNumber
} from 'redux/myTeam/myTeam.action'

import {
  selectMyTeamMetadata,
  selectMyTeamItems,
  selectMyTeamPageNumber,
  selectMyTeamPageSize,
  isMyTeamFetching,
  selectShowBigLoader,
  selectIsGoingForwardFlag,
  selectMyTeamPaginationKeys,
  selectMyTeamSortInfoData,
  selectMyTeamSearchItem
} from 'redux/myTeam/myTeam.selector'
import * as Styled from './style'

const MyTeamAccess = () => {
  // Global declaration
  const type = 'MyTeam'
  const manageColumnsModalId = 'myTeam-manageColumns'
  // UseState
  const [open, setOpen] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [sortPaginationKeyword, setSortPaginationKeyword] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [search, setSearch] = useState('')

  // TODO : ADD SELECTORS
  const metaData = useSelector(selectMyTeamMetadata)
  const myteamData = useSelector(selectMyTeamItems)
  const myTeamSearchResults = useSelector(selectMyTeamSearchItem)
  const pageNumber = useSelector(selectMyTeamPageNumber)
  const pageSize = useSelector(selectMyTeamPageSize)
  const showBigLoader = useSelector(selectShowBigLoader)
  const paginationKeysArray = useSelector(selectMyTeamPaginationKeys)
  const isGoingForward = useSelector(selectIsGoingForwardFlag)
  const sortInfoData = useSelector(selectMyTeamSortInfoData)
  const isFetching = useSelector(isMyTeamFetching)

  const dispatch = useDispatch()

  const [data, setData] = useState({
    allColumns: [],
    rows: [],
    paginationSizes: undefined,
    hasSortableColumns: false,
    initialSortColumnId: ''
  })

  const iff = (condition, then, other) => (condition ? then : other)

  const updateDisplayedColumns = (columns) => {
    setData({
      ...data,
      allColumns: columns
    })
  }

  useEffect(
    () => () => {
      dispatch(fetchMyTeamItemsSuccess(null))
    },
    []
  )

  const handleModal = (value) => {
    if (value === 'managecolumns') {
      setOpen(true)
    }
  }

  const handleSearch = (searchData) => {
    dispatch(updateMyTeamPageNumber(0))
    dispatch(updateMyTeamPageSize(10))
    const payload = {
      searchItem: searchData,
      pageSize,
      pageNumber
    }
    setSearch(searchData)
    dispatch(fetchMyTeamSearchStart(payload))
  }

  const clearSearch = () => {
    setSearch('')
    dispatch(fetchMyTeamItemsStart(null))
    dispatch(updateMyTeamPageNumber(0))
  }

  useEffect(async () => {
    localStorage.removeItem('component')
    localStorage.removeItem('myTeam-userId')
    localStorage.removeItem('myTeam-userEmail')
    localStorage.removeItem('myTeam-userName')
    localStorage.removeItem('myTeam-selectedTab')
    localStorage.removeItem('MyteamUserId')
    dispatch(fetchMyTeamMetadataStart())
    dispatch(updateShowBigLoader(true))
    dispatch(fetchMyTeamItemsStart())
    localStorage.setItem('component', type)
    localStorage.setItem('myTeam-selectedTab', 0)
  }, [])

  const getPaginationKeyword = () =>
    isGoingForward
      ? iff(myteamData.length > 0 && myteamData.slice(-1)[0]?.id, myteamData.slice(-1)[0]?.id, null)
      : iff(sortPaginationKeyword, sortPaginationKeyword.slice(-1)[0], '')

  // TODO : Add changes for My Teams table pagination
  useEffect(() => {
    dispatch(updateShowBigLoader(true))
    if (!isGoingForward && paginationKeysArray.length > 0) {
      paginationKeysArray.pop()
      dispatch(updateMyTeamPaginationKeys(paginationKeysArray))
      if (sortInfoData.sortKey !== '' && sortPaginationKeyword.length > 0) {
        sortPaginationKeyword.pop()
        setSortPaginationKeyword(sortPaginationKeyword)
      }
    }
    if (isGoingForward && sortInfoData.sortKey !== '') {
      setSortPaginationKeyword([...sortPaginationKeyword, getPaginationKeyword()])
    }
    if (search !== '') {
      const payload = {
        searchItem: search,
        pageSize,
        pageNumber
      }
      dispatch(fetchMyTeamSearchStart(payload))
    } else if (pageNumber > 0) {
      const paginationKey = isGoingForward
        ? iff(myteamData?.length && myteamData.slice(-1)[0]?.id, null)
        : iff(paginationKeysArray, paginationKeysArray.slice(-1)[0], null)
      if (sortInfoData.sortKey !== '') {
        // const sortPaginationKeyWord = getPaginationKeyword()
        let sortPayload = sortInfoData.payload
        sortPayload = {
          ...sortPayload,
          // search_after_primaryKey: paginationKey,
          // search_after_keyWord: sortPaginationKeyWord,
          pageNumber,
          pageSize
        }
        dispatch(fetchMyTeamSortStart(sortPayload))
      } else {
        dispatch(fetchMyTeamItemsStart(paginationKey))
      }
    } else if (sortInfoData.sortKey !== '') {
      // const sortPaginationKeyWord = getPaginationKeyword()
      let sortPayload = sortInfoData.payload
      sortPayload = {
        ...sortPayload,
        // search_after_keyWord: sortPaginationKeyWord,
        pageNumber,
        pageSize
      }
      dispatch(fetchMyTeamSortStart(sortPayload))
    } else {
      dispatch(fetchMyTeamItemsStart(null))
    }
  }, [pageNumber, pageSize])

  useEffect(() => {
    if (!!metaData && !!myteamData) {
      console.log('useEffect', myteamData)
      const allColumns = defineColumns(metaData.columns)
      const rows = defineRows(metaData.columns, myteamData, type)
      setTotalCount(myteamData[0]?.total)
      setData({
        allColumns,
        rows,
        paginationSizes: metaData.paginationSizes,
        hasSortableColumns: metaData.hasSortableColumns,
        initialSortColumnId: metaData.initialSortColumnId
      })
    }
  }, [metaData, myteamData])

  useEffect(() => {
    if (metaData && metaData?.columns && myTeamSearchResults !== null) {
      const allColumns = defineColumns(metaData.columns)
      const rows = defineRows(metaData.columns, myTeamSearchResults, type)
      setTotalCount(myTeamSearchResults.total)
      setData({
        allColumns,
        rows,
        paginationSizes: metaData.paginationSizes,
        hasSortableColumns: metaData.hasSortableColumns,
        initialSortColumnId: metaData.initialSortColumnId
      })
    }
  }, [myTeamSearchResults])

  return (
    <>
      {(isFetching || showBigLoader) && <Loading />}
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
      <Styled.BackButtonLink to="/dashboard">
        <Styled.BackButton>← {translate('create.ADAccount.back')}</Styled.BackButton>
      </Styled.BackButtonLink>
      <Breadcrumb
        path={[
          // { label: translate('navItem.label.dashboard'), url: './dashboard' },
          { label: translate('navItem.label.myTeam'), url: '' }
        ]}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Styled.HeaderWrapper>
          <h1 style={{ fontWeight: 'normal', marginBottom: '10px' }}>
            {translate('navItem.label.myTeam')}
          </h1>
        </Styled.HeaderWrapper>
      </div>
      <Styled.TableOptionsWrapper>
        <MSearchBox
          onSearchCallback={handleSearch}
          onClearCallback={clearSearch}
          placeholder={translate('myteam.search.placeholder')}
          onClickCallback={handleModal}
          data=""
          filterResultsOptions=""
          groupResultsOptions=""
        />
      </Styled.TableOptionsWrapper>
      {(isFetching || showBigLoader) && <Loading />}
      {data.rows.length === 0 && <Alert severity="info">{translate('myteam.alert')}</Alert>}
      {!!data.rows.length && !!data.allColumns.length && (
        <MUITable
          pageSizes={data.paginationSizes}
          allColumns={data.allColumns}
          type={type}
          data={data?.rows}
          totalCount={totalCount}
          hasSort={data.hasSortableColumns}
        />
      )}
    </>
  )
}

export default MyTeamAccess
