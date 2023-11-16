import React, { useState, useEffect } from 'react'
import { Alert } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { blue } from '@mui/material/colors'
import { useSelector, useDispatch } from 'react-redux'
import translate from 'translations/translate'
import { defineColumns, defineRows } from 'helpers/arrays'
import MSearchBox from 'components/mSearchBox'
import Breadcrumb from 'components/breadcrumb'
import BulkActions from 'pages/myTasks/approvals/BulkActions'
import GenericModal from 'components/genericModal'
import Loading from '../../components/loading'
import * as Styled from './style'
import MUITable from '../../components/MUITable'
import { selectNotificationMessage } from '../../redux/review/review.selector'
import { updateReviewNotificationMessage } from '../../redux/review/review.action'
import {
  fetchDraftsMetadataStart,
  fetchDraftsItemsStart,
  updateDraftsShowBigLoader,
  updatePaginationKeys,
  updateDraftsPageNumber,
  updateDraftsPageSize,
  fetchDraftsSortStart,
  fetchDraftSearchStart
} from '../../redux/drafts/drafts.action'
import {
  selectDraftsItems,
  selectDraftsMetadata,
  isDraftsFetching,
  selectDraftsShowBigLoader,
  selectDraftsShowSmallLoader,
  selectDraftsPageNumber,
  selectDraftsPageSize,
  selectDraftsSortInfoData
} from '../../redux/drafts/drafts.selector'

const Drafts = () => {
  const type = 'Drafts'
  const dispatch = useDispatch()

  const results = useSelector(selectDraftsItems)
  const metadata = useSelector(selectDraftsMetadata)
  const [totalCount, setTotalCount] = useState(0)
  const isFetching = useSelector(isDraftsFetching)
  const showBigLoader = useSelector(selectDraftsShowBigLoader)
  const showSmallLoading = useSelector(selectDraftsShowSmallLoader)
  const getNotificationMessage = useSelector(selectNotificationMessage)
  const pageNumber = useSelector(selectDraftsPageNumber)
  const pageSize = useSelector(selectDraftsPageSize)
  const sortInfoData = useSelector(selectDraftsSortInfoData)
  const [age, setAge] = useState('action')
  const initialPayload = {
    pageSize,
    pageNumber
  }

  const [data, setData] = useState({
    allColumns: [],
    rows: [],
    paginationSizes: undefined,
    hasSortableColumns: false,
    initialSortColumnId: '',
    bulkActions: []
  })
  const [bulkActionsOptions, setBulkActionOptions] = useState({
    openModal: false,
    typeOfAction: null,
    bulkActionsData: []
  })
  // eslint-disable-next-line no-unused-vars
  const [search, setSearch] = useState('')

  const handleSearch = (searchData) => {
    localStorage.setItem('searchValue', searchData)
    dispatch(updateDraftsPageSize(10))
    dispatch(updateDraftsPageNumber(0))
    const payload = {
      searchIn: 'Drafts',
      searchInValue: 'true',
      searchFor: searchData,
      pageSize,
      pageNumber
    }
    dispatch(updateDraftsShowBigLoader(true))
    dispatch(fetchDraftSearchStart(payload))
  }

  const clearSearch = () => {
    localStorage.setItem('searchValue', '')
    dispatch(updateDraftsShowBigLoader(true))
    dispatch(updateDraftsPageNumber(0))
    dispatch(fetchDraftsItemsStart(initialPayload))
  }

  // const filteredItems = () => data.rows
  // Need to check on below code for search
  // if (search === '') return data.rows
  // return data?.rows?.filter((e) => e?.recipient?.toLowerCase().includes(search.toLowerCase()))

  const doAction = (action) => {
    const bulkData = []
    if (['delete'].includes(action)) {
      results.draftData.map((e) => {
        if (e.checked) {
          const data1 = {}
          data1.draftId = e.id
          data1.phaseId = e.phase
          bulkData.push(data1)
          e.action = action
        }
        return e
      })
    }

    if (['delete'].includes(action)) {
      setBulkActionOptions({
        openModal: true,
        typeOfAction: action,
        bulkActionsData: bulkData
      })
    }
    setAge('action')
  }

  const handleModal = (value) => {
    doAction(value)
  }

  const handleBulkActionsModal = (status) => {
    setBulkActionOptions({
      ...bulkActionsOptions,
      openModal: status
    })
  }

  const getActionModal = () => {
    switch (bulkActionsOptions.typeOfAction) {
      case 'delete':
        return (
          <BulkActions
            closeModal={handleBulkActionsModal}
            bulkActionsData={bulkActionsOptions.bulkActionsData}
            requestType="deleteDraftReq"
            onCallback={() => {}}
          />
        )

      default:
    }
    return true
  }

  useEffect(() => {
    localStorage.setItem('component', 'Drafts')
    const searchKey = localStorage.getItem('searchValue')
    if (![null, undefined, ''].includes(searchKey)) {
      const payload = {
        searchIn: 'Drafts',
        searchInValue: 'true',
        searchFor: localStorage.getItem('searchValue'),
        pageSize,
        pageNumber
      }
      dispatch(fetchDraftSearchStart(payload))
    } else if (pageNumber > 0) {
      if (sortInfoData.sortKey !== '') {
        let sortPayload = sortInfoData.payload
        sortPayload = {
          ...sortPayload,
          pageSize,
          pageNumber
        }
        dispatch(fetchDraftsSortStart(sortPayload))
      } else {
        dispatch(fetchDraftsItemsStart())
      }
    } else if (sortInfoData.sortKey !== '') {
      dispatch(fetchDraftsSortStart(sortInfoData.payload))
    } else {
      dispatch(fetchDraftsItemsStart(initialPayload))
    }
  }, [pageNumber, pageSize])

  useEffect(async () => {
    if (!!metadata && typeof results === 'object' && Object.keys(results).length !== 0) {
      const allColumns = defineColumns(metadata.columns)
      const rows = defineRows(metadata.columns, results.draftData, type)

      setTotalCount(results.total)
      setData({
        ...data,
        allColumns,
        rows,
        paginationSizes: metadata.paginationSizes,
        hasSortableColumns: metadata.hasSortableColumns,
        initialSortColumnId: metadata.initialSortColumnId,
        bulkActions: metadata.bulkActions
      })
    }
  }, [metadata, results, isFetching])

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
    dispatch(fetchDraftsMetadataStart())
    dispatch(updateDraftsShowBigLoader(true))
    localStorage.removeItem('searchValue')
    return () => {
      dispatch(updatePaginationKeys([]))
      dispatch(updateDraftsPageNumber(0))
      dispatch(updateDraftsPageSize(10))
      localStorage.removeItem('searchValue')
    }
  }, [])
  return (
    <>
      {bulkActionsOptions.openModal && (
        <GenericModal setOpen={handleBulkActionsModal}>{getActionModal()}</GenericModal>
      )}
      <Styled.BackButtonLink to="/dashboard">
        <Styled.BackButton>← {translate('review.back')}</Styled.BackButton>
      </Styled.BackButtonLink>
      <Breadcrumb
        path={[
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          { label: translate('drafts.header.title'), url: '' }
        ]}
      />

      <Styled.HeaderWrapper>
        <div style={{ display: 'flex' }}>
          <h1 style={{ fontWeight: 'normal', marginBottom: '10px' }}>
            {translate('drafts.header.title')}
          </h1>
          <div style={{ marginTop: '23px', marginLeft: '10px' }}>
            {showSmallLoading && (
              <CircularProgress
                size={23}
                sx={{ top: '5px', marginBottom: '10px', position: 'relative', color: blue[500] }}
              />
            )}
          </div>
        </div>
      </Styled.HeaderWrapper>

      <Styled.TableOptionsWrapper>
        <MSearchBox
          onSearchCallback={handleSearch}
          onClearCallback={clearSearch}
          onClickCallback={handleModal}
          placeholder={translate('draft.search.placeholder')}
          data={data.bulkActions}
          age={age}
          setAge={setAge}
          filterResultsOptions={data.filterResultsOptions}
          groupResultsOptions=""
          type={type}
        />
      </Styled.TableOptionsWrapper>

      {!!data.allColumns.length && (
        <MUITable
          pageSizes={data.paginationSizes}
          allColumns={data.allColumns}
          // data={filteredItems()}
          data={data.rows}
          bulkActions={data.bulkActions}
          type={type}
          totalCount={totalCount}
          hasSort={data.hasSortableColumns}
        />
      )}
      {showBigLoader && <Loading />}
      {data.rows.length === 0 && <Alert severity="info">{translate('draft.alert')}</Alert>}
    </>
  )
}

export default Drafts
