/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Alert } from '@mui/material'
import Breadcrumb from 'components/breadcrumb'
import translate from 'translations/translate'
import { defineColumns, defineRows } from 'helpers/arrays'
import { generateOptions } from 'helpers/table'
import Loading from 'components/loading'
import MSearchBox from 'components/mSearchBox'
import MUITable from 'components/MUITable'
import {
  fetchGroupAssetsRequestHistoryMetadataStart,
  fetchGropAssetsRequestHistoryItemsStart,
  fetchGropAssetsRequestHistoryItemsSuccess,
  updateShowBigLoader,
  updatePageSizeAssetGroupRequestHistory,
  updatePageNumberAssetGroupRequestHistory,
  updateAssetGrpRequestHistorySortInfoData,
  fetchAssetGroupRequestHistorySortStart,
  fetchGroupAssetsRequestHistorySearchStart,
  updateAssetsSelectedGroupName
} from '../../../redux/myAssets/myAssets.action'
import {
  selectHistoricalRequestHistoryMetadata,
  selectGroupAssetRequestHistoryItems,
  selectShowBigLoader,
  selectAssetGroupRequestHistoryPageNumber,
  selectAssetGroupRequestHistoryPageSize,
  selectAssetGrpRequestHistorySortInfoData
} from '../../../redux/myAssets/myAssets.selector'
import * as Styled from './style'

const HistoricalRequestHistory = () => {
  const [totalCount, setTotalCount] = useState(0)
  // const [sortPaginationKeyword, setSortPaginationKeyword] = useState([])
  const dispatch = useDispatch()
  const locationParams = useLocation()
  const lineItemData = locationParams?.state?.dataItem
  const groupNameForBreadCrumb = lineItemData?.cn
  const metaData = useSelector(selectHistoricalRequestHistoryMetadata)
  const requestHistory = useSelector(selectGroupAssetRequestHistoryItems)
  const pageNumber = useSelector(selectAssetGroupRequestHistoryPageNumber)
  const pageSize = useSelector(selectAssetGroupRequestHistoryPageSize)
  const showBigLoader = useSelector(selectShowBigLoader)

  const sortInfoData = useSelector(selectAssetGrpRequestHistorySortInfoData)

  // const isFetching = useSelector(isRequestHistoryFetching)
  // const iff = (consition, then, otherise) => (consition ? then : otherise)
  // eslint-disable-next-line no-unused-vars
  const [search, setSearch] = useState('')
  const type = 'assetGrpReqHistory'
  const initialPayload = {
    dnValue: lineItemData?.groupDetails?._source?.igaContent?.distinguishedName,
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
    localStorage.setItem('searchValue', searchData)
    const payload = {
      dnValue: lineItemData?.groupDetails?._source?.igaContent?.distinguishedName,
      searchIn: 'request.common.groupDetails.role.keyword',
      searchInValue: searchData,
      pageSize,
      pageNumber
    }
    dispatch(fetchGroupAssetsRequestHistorySearchStart(payload))
  }

  const clearSearch = () => {
    localStorage.setItem('searchValue', '')
    dispatch(updateShowBigLoader(true))
    dispatch(updatePageNumberAssetGroupRequestHistory(0))
    dispatch(fetchGropAssetsRequestHistoryItemsStart(initialPayload))
  }

  const filteredItems = () => {
    if (search === '') return data.rows
    return data.rows.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
  }

  useEffect(
    () => () => {
      dispatch(fetchGropAssetsRequestHistoryItemsSuccess(null))
      dispatch(
        updateAssetGrpRequestHistorySortInfoData({
          sortKey: '',
          isAscending: 'asc',
          payload: {}
        })
      )
      dispatch(updatePageSizeAssetGroupRequestHistory(10))
      dispatch(updatePageNumberAssetGroupRequestHistory(0))
      localStorage.removeItem('searchValue')
    },
    []
  )

  useEffect(() => {
    localStorage.removeItem('requestHistoryId')
    localStorage.removeItem('searchValue')
    localStorage.removeItem('myTeam-userId')
    localStorage.removeItem('myTeam-userEmail')
    localStorage.removeItem('myTeam-userName')
    localStorage.removeItem('myTeam-selectedTab')
    dispatch(fetchGroupAssetsRequestHistoryMetadataStart())
    dispatch(fetchGropAssetsRequestHistoryItemsStart(initialPayload))
    dispatch(updateShowBigLoader(true))
    dispatch(updateAssetsSelectedGroupName(groupNameForBreadCrumb))
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
    const searchKey = localStorage.getItem('searchValue')
    if (![null, undefined, ''].includes(searchKey)) {
      const payload = {
        dnValue: lineItemData?.groupDetails?._source?.igaContent?.distinguishedName,
        searchIn: 'request.common.groupDetails.role.keyword',
        searchFor: localStorage.getItem('searchValue'),
        pageSize,
        pageNumber
      }
      dispatch(fetchGropAssetsRequestHistoryItemsStart(payload))
    } else {
      dispatch(updateShowBigLoader(true))
      if (pageNumber > 0) {
        if (sortInfoData.sortKey !== '') {
          let sortPayload = sortInfoData.payload
          sortPayload = {
            ...sortPayload,
            dnValue: lineItemData?.groupDetails?._source?.igaContent?.distinguishedName,
            pageSize,
            pageNumber
          }
          dispatch(fetchAssetGroupRequestHistorySortStart(sortPayload))
        } else {
          const newPayload = initialPayload
          dispatch(
            fetchGropAssetsRequestHistoryItemsStart({
              newPayload
            })
          )
        }
      } else if (sortInfoData.sortKey !== '') {
        let sortPayload = { ...sortInfoData.payload, pageSize, pageNumber }
        sortPayload = {
          ...sortPayload,
          dnValue: lineItemData?.groupDetails?._source?.igaContent?.distinguishedName
        }
        dispatch(fetchAssetGroupRequestHistorySortStart(sortPayload))
      } else {
        const payload = initialPayload
        dispatch(fetchGropAssetsRequestHistoryItemsStart(payload))
      }
    }
  }, [pageNumber, pageSize])

  return (
    <>
      <>
        <Styled.BackButtonLink to="/my-asset">
          <Styled.BackButton>← {translate('review.back')}</Styled.BackButton>
        </Styled.BackButtonLink>
        <Breadcrumb
          path={[
            { label: translate('navItem.label.dashboard'), url: '/dashboard' },
            { label: translate('navItem.label.myAsset'), url: '/my-asset' },
            { label: groupNameForBreadCrumb, url: '' },
            { label: translate('review.bulkActions.linkforRequestHistory'), url: '' }
          ]}
        />
        <Styled.HeaderWrapper>
          <h1 style={{ fontWeight: 'normal', marginBottom: '25px' }}>
            {translate('review.bulkActions.linkforRequestHistory')}
          </h1>
        </Styled.HeaderWrapper>
      </>
      <Styled.TableOptionsWrapper>
        <MSearchBox
          onSearchCallback={handleSearch}
          onClearCallback={clearSearch}
          placeholder={translate('requestHistory.search.placeholder')}
          data=""
          filterResultsOptions=""
          groupResultsOptions=""
          isManageColumnRequired={false}
        />
      </Styled.TableOptionsWrapper>

      {!!data.rows.length && !!data.allColumns.length && (
        <MUITable
          pageSizes={data.paginationSizes}
          allColumns={data.allColumns}
          type="assetGrpReqHistory"
          data={filteredItems()}
          totalCount={totalCount}
          hasSort={data.hasSortableColumns}
        />
      )}
      {showBigLoader && <Loading />}
      {data.rows.length === 0 && (
        <Alert severity="info">{translate('membershipHistory.alert')}</Alert>
      )}
    </>
  )
}

export default HistoricalRequestHistory
