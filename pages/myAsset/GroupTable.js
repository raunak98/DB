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
  selectGroupAssetsItems,
  selectGroupAssetsMetadata,
  isMyAssetsFetching,
  selectAssetsGroupPageNumber,
  selectAssetsGroupPageSize,
  selectAssetsGroupIsGoingForwardFlag,
  selectAssetsGroupPaginationKeys,
  selectMyGroupAssetsSortInfoData
} from '../../redux/myAssets/myAssets.selector'
import {
  fetchGroupAssetsItemsStart,
  updateShowBigLoader,
  fetchGroupAssetsItemsSuccess,
  fetchGroupAssetsMetadataStart,
  updateAssetsGroupIsGoingForwardFlag,
  updateAssetsGroupPaginationKeys,
  fetchMyGroupAssetsSortStart,
  fetchMyGroupAssetsSearchStart
} from '../../redux/myAssets/myAssets.action'
import { selectProfileDetailsSelector } from '../../redux/profile/profile.selector'

const GroupTable = () => {
  const dispatch = useDispatch()

  const groupResults = useSelector(selectGroupAssetsItems)
  const groupMeta = useSelector(selectGroupAssetsMetadata)
  const isFetching = useSelector(isMyAssetsFetching)
  const showBigLoader = useSelector(selectShowBigLoader)
  const pageNumber = useSelector(selectAssetsGroupPageNumber)
  const pageSize = useSelector(selectAssetsGroupPageSize)
  const isGoingForward = useSelector(selectAssetsGroupIsGoingForwardFlag)
  const paginationKeysArray = useSelector(selectAssetsGroupPaginationKeys)
  const profile = useSelector(selectProfileDetailsSelector)
  const sortInfoData = useSelector(selectMyGroupAssetsSortInfoData)
  const [sortPaginationKeyword, setSortPaginationKeyword] = useState([])
  const [userInfo, setUserInfo] = useState({})

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

  const iff = (consition, then, otherise) => (consition ? then : otherise)

  const getPaginationKeyword = () =>
    isGoingForward
      ? iff(
          groupResults &&
            Object.keys(groupResults).length > 0 &&
            groupResults?.groupData[pageSize - 1]?.searchAfterKey,
          groupResults?.groupData[pageSize - 1]?.searchAfterKey,
          null
        )
      : iff(sortPaginationKeyword, sortPaginationKeyword.slice(-1)[0], '')

  const sortingGroup = () => {
    let paginationKey
    if (sortInfoData.sortKey !== '') {
      paginationKey = isGoingForward
        ? iff(Object.keys(groupResults).length > 0, groupResults?.groupData?.slice(-1)[0]?.id, null)
        : iff(paginationKeysArray.length > 0, paginationKeysArray?.slice(-1)[0], null)
    } else {
      paginationKey = isGoingForward
        ? iff(Object.keys(groupResults).length > 0, groupResults?.groupData?.slice(-1)[0]?.id, null)
        : iff(
            paginationKeysArray && paginationKeysArray?.length > 0,
            paginationKeysArray?.slice(-1)[0],
            null
          )
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
      dispatch(fetchMyGroupAssetsSortStart(sortPayload))
    } else if (pageNumber > 0) {
      console.log(userInfo.id) // TODO : Remove this piece of code if pagination works
      const payload = {
        userEmail: `${profile.mail}`,
        paginationKey,
        pageSize,
        pageNumber
      }
      // dispatch(
      //   fetchGroupAssetsItemsStart(
      //     getPersonalAssetsByMail(userInfo?.id, paginationKey, pageSize, pageNumber)
      //   )
      // )
      dispatch(fetchGroupAssetsItemsStart(payload))
    }
    return paginationKey
  }

  useEffect(() => {
    dispatch(updateShowBigLoader(true))
    dispatch(fetchGroupAssetsItemsSuccess({ groupAssetsItems: {} }))
    const searchKey = localStorage.getItem('searchValue')
    if (![null, undefined, ''].includes(searchKey)) {
      const payload = {
        searchIn: 'MyAssets-Groups',
        searchInValue: '_id',
        searchFor: localStorage.getItem('searchValue'),
        pageSize,
        pageNumber
      }
      dispatch(updateShowBigLoader(true))
      dispatch(fetchMyGroupAssetsSearchStart(payload))
    } else {
      if (!isGoingForward && paginationKeysArray.length > 0) {
        paginationKeysArray.pop()
        dispatch(updateAssetsGroupPaginationKeys(paginationKeysArray))
        if (sortInfoData.sortKey !== '' && sortPaginationKeyword.length > 0) {
          sortPaginationKeyword.pop()
          setSortPaginationKeyword(sortPaginationKeyword)
        }
      }
      if (isGoingForward && sortInfoData.sortKey !== '') {
        setSortPaginationKeyword([...sortPaginationKeyword, getPaginationKeyword()])
      }
      let payload = {
        pageSize,
        userEmail: `${profile.mail}`,
        pageNumber
      }
      if (pageNumber > 0) {
        const paginationKey = sortingGroup()
        payload = {
          ...payload,
          search_after_primaryKey: `${paginationKey}`
        }
      } else {
        profileAPI
          .getUserInfo()
          .then((res) => {
            if (res) {
              setUserInfo(res)
              if (profile) {
                dispatch(fetchGroupAssetsItemsStart(payload))
                sortingGroup()
              }
            }
          })
          .catch((err) => {
            console.error(err)
          })
      }
    }
  }, [pageNumber, pageSize])

  useEffect(async () => {
    dispatch(updateShowBigLoader(true))
    dispatch(fetchGroupAssetsMetadataStart())
    dispatch(updateAssetsGroupIsGoingForwardFlag(true))
    dispatch(updateAssetsGroupPaginationKeys([]))
    localStorage.removeItem('searchValue')
  }, [])

  useEffect(() => {
    if (groupMeta && groupResults && Object.keys(groupResults).length > 0) {
      dispatch(updateShowBigLoader(false))
      const columns = defineColumns(groupMeta.columns, false, 'ModifyGroup')
      const rows = defineRows(groupMeta.columns, groupResults.groupData, 'ModifyGroup')

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
      dispatch(updateAssetsGroupIsGoingForwardFlag(true))
      dispatch(updateAssetsGroupPaginationKeys([]))
      localStorage.removeItem('searchValue')
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
        type="ModifyGroup"
        total={groupResults?.total ? groupResults?.total : 0}
      />
    </>
  )
}

export default GroupTable
