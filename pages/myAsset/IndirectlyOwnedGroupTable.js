import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { defineColumns, defineRows } from 'helpers/arrays'
import { generateOptions } from 'helpers/table'
// import { getPersonalAssetsByMail } from 'helpers/utils'
import Loading from '../../components/loading'
import AssetTable from '../../pageComponents/Assets/MyAssetTable'
import * as profileAPI from '../../api/profile'
import {
  selectShowBigLoader,
  selectOwnedGroupAssetsItems,
  selectIndirectlyOwnedGroupAssetsMetadata,
  isMyAssetsFetching,
  selectOwnedGroupPageNumber,
  selectOwnedGroupPageSize,
  selectOwnedGroupSortInfoData
} from '../../redux/myAssets/myAssets.selector'
import {
  fetchOwnedGroupAssetsItemsStart,
  updateShowBigLoader,
  fetchOwnedGroupAssetsItemsSuccess,
  fetchIndirectlyOwnedGroupAssetsMetadataStart,
  fetchOwnedGroupAssetsSortStart
} from '../../redux/myAssets/myAssets.action'
import { selectProfileDetailsSelector } from '../../redux/profile/profile.selector'

const IndirectlyOwnedGroupTable = () => {
  const dispatch = useDispatch()

  const groupResults = useSelector(selectOwnedGroupAssetsItems)
  const groupMeta = useSelector(selectIndirectlyOwnedGroupAssetsMetadata)
  const isFetching = useSelector(isMyAssetsFetching)
  const showBigLoader = useSelector(selectShowBigLoader)
  const pageNumber = useSelector(selectOwnedGroupPageNumber)
  const pageSize = useSelector(selectOwnedGroupPageSize)
  const profile = useSelector(selectProfileDetailsSelector)
  const sortInfoData = useSelector(selectOwnedGroupSortInfoData)

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
    groupResultsOptions: [],
    defaultGroupResultsId: 'All',

    // Search
    search: ''
  })

  const sortingGroup = () => {
    let paginationKey

    if (sortInfoData.sortKey !== '') {
      let sortPayload = sortInfoData.payload
      sortPayload = {
        ...sortPayload,
        pageSize,
        pageNumber
      }
      dispatch(fetchOwnedGroupAssetsSortStart(sortPayload))
    } else if (pageNumber > 0) {
      const payload = {
        userEmail: `${profile.mail}`
      }
      dispatch(fetchOwnedGroupAssetsItemsStart(payload))
    }
    return paginationKey
  }

  useEffect(() => {
    dispatch(updateShowBigLoader(true))
    dispatch(fetchOwnedGroupAssetsItemsSuccess({ ownedGroupAssetsItems: {} }))
    let payload = {
      pageSize,
      userEmail: `${profile.mail}`,
      pageNumber
    }

    if (pageNumber > 0) {
      sortingGroup()
      payload = {
        ...payload
      }
    } else {
      profileAPI
        .getUserInfo()
        .then((res) => {
          if (res) {
            // setUserInfo(res)
            if (profile) {
              dispatch(fetchOwnedGroupAssetsItemsStart(payload))
              sortingGroup()
            }
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }, [pageNumber, pageSize])

  useEffect(async () => {
    dispatch(updateShowBigLoader(true))
    dispatch(fetchIndirectlyOwnedGroupAssetsMetadataStart())
    localStorage.setItem('component', 'IndirectlyOwnedGroup')
  }, [])

  useEffect(() => {
    if (groupMeta && groupResults && Object.keys(groupResults).length > 0) {
      dispatch(updateShowBigLoader(false))
      const columns = defineColumns(groupMeta.columns, false, 'IndirectlyOwnedGroup')
      const rows = defineRows(groupMeta.columns, groupResults.groupData, 'IndirectlyOwnedGroup')

      const filterResultsOptions = generateOptions(groupMeta.filterBy, groupMeta.initialFilterBy)

      const groupResultsOptions = generateOptions(groupMeta.groupBy, groupMeta.initialGroupBy)

      setInitialData({
        ...initialData,
        columns,
        rows,
        paginationSizes: groupMeta.paginationSizes,
        hasSortableColumns: groupMeta.hasSortableColumns,
        initialSortColumnId: groupMeta.initialSortColumnId,
        bulkActions: groupMeta.bulkActions,
        filterResultsOptions: filterResultsOptions.options,
        defaultFilterResultsId: filterResultsOptions.defaultOptionId,
        groupResultsOptions: groupResultsOptions.options,
        defaultGroupResultsId: groupResultsOptions.defaultOptionId
      })
    }
  }, [groupMeta, groupResults])
  useEffect(
    () => () => {
      localStorage.setItem('component', 'Modify')
    },
    []
  )
  return (
    <>
      {(isFetching || showBigLoader) && <Loading />}
      <AssetTable
        rows={groupResults?.groupData}
        search={initialData.search}
        columns={initialData.columns}
        paginationSizes={initialData.paginationSizes}
        hasSortableColumns={initialData.hasSortableColumns}
        initialSortColumnId={initialData.initialSortColumnId}
        bulkActions={initialData.bulkActions}
        metadata={groupMeta}
        type="IndirectlyOwnedGroup"
        total={groupResults?.total ? groupResults?.total : 0}
      />
    </>
  )
}

export default IndirectlyOwnedGroupTable
