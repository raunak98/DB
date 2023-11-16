import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Typography, Grid } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useTheme } from '@mui/material/styles'
import translate from 'translations/translate'
import { defineColumns, defineRows } from 'helpers/arrays'
import { generateOptions } from 'helpers/table'
import MSearchBox from 'components/mSearchBox'
import AssetTable from '../../pageComponents/Assets/MyAssetTable'
import {
  selectMyAssetsItems,
  selectNonPersonalAssetsMetadata,
  selectAssetsIsGoingForwardFlag,
  selectAssetsPaginationKeys,
  selectAssetsPageNumber,
  selectAssetsPageSize,
  selectAssetsNarIdInfo
} from '../../redux/myAssets/myAssets.selector'
import {
  fetchMyAssetsItemsStart,
  fetchNonPersonalAssetsMetadataStart,
  updateShowBigLoader,
  updateAssetsIsGoingForwardFlag,
  updateAssetsPaginationKeys,
  fetchMyAssetsItemsSuccess,
  updateAssetsPageSize,
  updateAssetsPageNumber,
  fetchNarIdInfoStart,
  fetchMyAssetsSearchStart,
  updateAssetsNarId
} from '../../redux/myAssets/myAssets.action'

import { selectProfileDetailsSelector } from '../../redux/profile/profile.selector'

const GRIDTable = ({ email }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const results = useSelector(selectMyAssetsItems)
  const modifyMeta = useSelector(selectNonPersonalAssetsMetadata)
  const pageNumber = useSelector(selectAssetsPageNumber)
  const pageSize = useSelector(selectAssetsPageSize)
  const isGoingForward = useSelector(selectAssetsIsGoingForwardFlag)
  const paginationKeysArray = useSelector(selectAssetsPaginationKeys)
  const profileDetails = useSelector(selectProfileDetailsSelector)
  const [clickedItem, setClickedItem] = useState(-1)

  const narIdInfo = useSelector(selectAssetsNarIdInfo)

  const [narId, setNarId] = useState(0)
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

  const handleSearch = (search) => {
    localStorage.setItem('searchValue', search)
    dispatch(updateAssetsPageSize(10))
    dispatch(updateAssetsPageNumber(0))
    const payload = {
      searchIn: 'MyAssets-NonPersonalAccounts',
      searchInValue: `${narId}`,
      searchFor: search,
      pageSize,
      pageNumber
    }
    dispatch(updateShowBigLoader(true))
    dispatch(fetchMyAssetsSearchStart(payload))
  }

  const clearSearch = () => {
    localStorage.setItem('searchValue', '')
    dispatch(updateShowBigLoader(true))
    dispatch(updateAssetsPageNumber(0))
    const payload = {
      targetName: 'dbagApplicationId',
      targetValue: `${narId}`,
      pageSize,
      pageNumber
    }
    dispatch(fetchMyAssetsItemsStart(payload))
  }

  const iff = (consition, then, otherise) => (consition ? then : otherise)

  useEffect(() => {
    dispatch(fetchMyAssetsItemsSuccess({ myAssetsItems: {} }))
    const searchKey = localStorage.getItem('searchValue')
    if (![null, undefined, ''].includes(searchKey)) {
      const payload = {
        searchIn: 'MyAssets-NonPersonalAccounts',
        searchInValue: `${narId}`,
        searchFor: localStorage.getItem('searchValue'),
        pageSize,
        pageNumber
      }
      dispatch(updateShowBigLoader(true))
      dispatch(fetchMyAssetsSearchStart(payload))
    } else {
      if (!isGoingForward && paginationKeysArray.length > 0) {
        paginationKeysArray.pop()
        dispatch(updateAssetsPaginationKeys(paginationKeysArray))
      }
      let payload = {
        targetName: 'dbagApplicationId',
        targetValue: `${narId}`,
        pageSize,
        pageNumber
      }
      if (pageNumber > 0) {
        const paginationKey = isGoingForward
          ? iff(Object.keys(results).length > 0, results?.assetsData?.slice(-1)[0]?.id, null)
          : iff(paginationKeysArray.length > 0, paginationKeysArray?.slice(-1)[0], null)
        payload = {
          ...payload,
          search_after_primaryKey: `${paginationKey}`
        }
        dispatch(fetchMyAssetsItemsStart(payload))
      } else if (narId !== 0) {
        payload = {
          ...payload,
          search_after_primaryKey: null
        }
        dispatch(fetchMyAssetsItemsStart(payload))
      }
    }
    dispatch(updateShowBigLoader(false))
  }, [pageNumber, pageSize])

  useEffect(async () => {
    dispatch(updateAssetsIsGoingForwardFlag(true))
    dispatch(updateAssetsPaginationKeys([]))
    dispatch(fetchNarIdInfoStart(email || profileDetails?.mail))
    localStorage.removeItem('searchValue')
    dispatch(updateAssetsPageSize(10))
    dispatch(updateAssetsPageNumber(0))
  }, [])

  const getAccountDataByNarId = (narIdData) => {
    dispatch(updateAssetsPageSize(10))
    dispatch(updateAssetsPageNumber(0))
    setNarId(narIdData)
    dispatch(updateAssetsNarId(narIdData))
    dispatch(fetchNonPersonalAssetsMetadataStart())
    dispatch(updateShowBigLoader(true))
    const payload = {
      targetName: 'dbagApplicationId',
      targetValue: `${narIdData}`,
      pageSize: 10,
      pageNumber: 0
    }
    dispatch(fetchMyAssetsItemsStart(payload))
  }

  const setExpandedData = (narIdData, index) => {
    if (clickedItem === index) {
      setClickedItem(-1)
    } else {
      setClickedItem(index)
    }

    getAccountDataByNarId(narIdData)
  }

  useEffect(() => {
    if (modifyMeta && results && Object.keys(results).length !== 0) {
      const columns = defineColumns(modifyMeta.columns, false, 'Modify')
      const rows = defineRows(modifyMeta.columns, results.assetsData, 'Modify')

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
  }, [modifyMeta, results])

  useEffect(
    () => () => {
      dispatch(updateAssetsIsGoingForwardFlag(true))
      dispatch(updateAssetsPaginationKeys([]))
      localStorage.removeItem('searchValue')
    },
    []
  )

  return (
    <>
      {narIdInfo && narIdInfo.length > 0 ? (
        narIdInfo.map((narIdData, index) => (
          <Accordion
            key={`accordian${narIdData}`}
            expanded={clickedItem === index}
            sx={{
              border: `0.1px solid ${theme.palette.divider}`,
              '&:not(:last-child)': {
                borderBottom: 0
              },
              '&:before': {
                display: 'none'
              }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id={`accordianSummary${narIdData}`}
              onClick={() => setExpandedData(narIdData, index)}
            >
              <Typography sx={{ fontSize: '16px' }}>{narIdData}</Typography>
            </AccordionSummary>
            <AccordionDetails id={`accordianDetails${narIdData}`}>
              {results && (
                <>
                  <Grid sx={{ padding: '9px 11px 6px 9px' }}>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        background: theme.palette.mode === 'dark' ? '#182B44' : '#FFF',
                        display: 'flex'
                      }}
                    >
                      <MSearchBox
                        onSearchCallback={handleSearch}
                        onClearCallback={clearSearch}
                        placeholder={translate('myAsset.search.placeholder.nonpersonal')}
                        data=""
                        filterResultsOptions=""
                        groupResultsOptions=""
                        isManageColumnRequired={false}
                      />
                    </Grid>
                    <AssetTable
                      rows={results.assetsData}
                      search={initialData.search}
                      columns={initialData.columns}
                      paginationSizes={initialData.paginationSizes}
                      hasSortableColumns={initialData.hasSortableColumns}
                      initialSortColumnId={initialData.initialSortColumnId}
                      bulkActions={initialData.bulkActions}
                      metadata={modifyMeta}
                      type="Modify"
                      total={results?.total ? results?.total : 0}
                      myAssetType="NonPersonal"
                    />
                  </Grid>
                </>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography sx={{ padding: '10px 0px 10px 17px' }}>
          {translate('myAssets.dataNotAvailable')}
        </Typography>
      )}
    </>
  )
}

export default GRIDTable
