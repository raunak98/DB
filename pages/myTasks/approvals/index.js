import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useParams } from 'react-router-dom' // useLocation
import { Button, Grid, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import { blue } from '@mui/material/colors'
import Breadcrumb from 'components/breadcrumb'
import { Notification } from 'components/notification'
import GenericModal from 'components/genericModal'
import MSearchBox from 'components/mSearchBox'
import translate from 'translations/translate'
import { defineColumns, defineRows } from 'helpers/arrays'
import { generateOptions } from 'helpers/table'
import { isParsable } from 'helpers/utils'
import BulkActions from './BulkActions'
import ApprovalsTable from '../../../pageComponents/Approvals/ApprovalsTable'
import Loading from '../../../components/loading'
import { selectMyTeamSearchItem } from '../../../redux/myTeam/myTeam.selector'
import {
  fetchApprovalsMetadataStart,
  fetchApprovalsItemsStart,
  updateShowBigLoader,
  // updateApprovalsPaginationKeys,
  fetchApprovalSearchStart,
  fetchApprovalSortStart,
  updateApprovalsNotificationMessage,
  updateApprovalsSearchAfterKeys,
  updateApprovalsPageNumber,
  updateApprovalsPageSize
} from '../../../redux/approvals/approvals.action'
import {
  selectApprovalsItems,
  selectApprovalsMetadata,
  isApprovalsFetching,
  selectShowBigLoader,
  selectShowSmallLoader,
  selectApprovalsPageNumber,
  selectApprovalsPageSize,
  selectApprovalsSortInfoData,
  selectNotificationMessage
} from '../../../redux/approvals/approvals.selector'
import * as Styled from './style'

const Approvals = ({ userId, userEmail }) => {
  const theme = useTheme()
  const { id } = useParams()
  const dispatch = useDispatch()
  const [age, setAge] = React.useState('action')
  const history = useHistory()

  const getNotificationMessage = useSelector(selectNotificationMessage)
  // Get My Assets records from redux
  const results = useSelector(selectApprovalsItems)
  const approvalMeta = useSelector(selectApprovalsMetadata)
  const isFetching = useSelector(isApprovalsFetching)
  const showBigLoader = useSelector(selectShowBigLoader)
  const showSmallLoading = useSelector(selectShowSmallLoader)
  const pageNumber = useSelector(selectApprovalsPageNumber)
  const pageSize = useSelector(selectApprovalsPageSize)
  const sortInfoData = useSelector(selectApprovalsSortInfoData)
  const myTeamDetails = useSelector(selectMyTeamSearchItem)
  const [notification, setNotification] = useState({ description: '', variant: '' })

  const [bulkActionsOptions, setBulkActionOptions] = useState({
    openModal: false,
    typeOfAction: null,
    bulkActionsData: []
  })

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
    let payload
    if (search && Object.values(search).some((val) => val !== '')) {
      const { startDate, endDate } = search
      if ((startDate === '' && endDate === '') || (startDate && endDate)) {
        localStorage.setItem('searchValue', JSON.stringify(search))
        dispatch(updateApprovalsPageNumber(0))
        dispatch(updateApprovalsPageSize(10))
        payload = {
          ...search,
          searchIn: 'Approvals',
          searchInValue: 'in-progress',
          pageSize,
          pageNumber
        }
        if (userId && userEmail) {
          payload = {
            ...payload,
            reporteeId: userId,
            reporteeMail: userEmail
          }
        }
        dispatch(fetchApprovalSearchStart(payload))
      } else {
        setNotification({
          description: 'serviceDesk.dateError',
          variant: 'error'
        })
      }
    } else if (Object.values(search).every((val) => val === '')) {
      setNotification({
        description: 'serviceDesk.emptyValues',
        variant: 'error'
      })
    }
  }
  const clearSearch = () => {
    dispatch(updateApprovalsPageNumber(0))
    dispatch(updateApprovalsPageSize(10))
    dispatch(updateShowBigLoader(true))
    dispatch(fetchApprovalsItemsStart(null))
  }
  const handleConfirm = () => {}

  // const iff = (consition, then, otherise) => (consition ? then : otherise)

  const doAction = (action) => {
    const bulkData = []
    if (['approve', 'reject'].includes(action)) {
      results.approvalData.map((e) => {
        if (e.checked) {
          const data = {}
          data.approveId = e.id
          data.phaseId = e.phase
          bulkData.push(data)
          e.action = action
        }
        return e
      })
    }

    if (['approve', 'reject'].includes(action)) {
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
      case 'approve':
        return (
          <BulkActions
            closeModal={handleBulkActionsModal}
            bulkActionsData={bulkActionsOptions.bulkActionsData}
            requestType="approveReq"
            onCallback={() => {}}
          />
        )

      case 'reject':
        return (
          <BulkActions
            closeModal={handleBulkActionsModal}
            bulkActionsData={bulkActionsOptions.bulkActionsData}
            requestType="RejectReq"
            onCallback={() => {}}
          />
        )

      default:
    }
    return true
  }

  // To Get metadata and  api data on Initital Page
  useEffect(() => {
    localStorage.removeItem('approvalId')
    dispatch(fetchApprovalsMetadataStart())
    dispatch(updateShowBigLoader(true))
    dispatch(updateApprovalsPageNumber(0))
    dispatch(updateApprovalsPageSize(10))
    updateApprovalsSearchAfterKeys([])
    localStorage.setItem('component', id ? 'MyTeam' : 'Approvals')
    localStorage.removeItem('searchValue')
  }, [])

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

  useEffect(() => {
    dispatch(updateShowBigLoader(true))
    const searchDetails = localStorage.getItem('searchValue')
    const searchKey = isParsable(searchDetails) ? JSON.parse(searchDetails) : searchDetails
    if (![null, undefined, ''].includes(searchKey) && sortInfoData.sortKey === '') {
      let payload
      if (typeof searchKey === 'object') {
        payload = {
          ...searchKey,
          searchIn: 'Approvals',
          searchInValue: 'in-progress',
          pageSize,
          pageNumber
        }
      } else {
        payload = {
          searchIn: 'Approvals',
          searchFor: searchKey,
          searchInValue: 'in-progress',
          pageSize,
          pageNumber
        }
      }
      dispatch(fetchApprovalSearchStart(payload))
    } else if (pageNumber > 0) {
      if (sortInfoData.sortKey !== '') {
        let sortPayload = sortInfoData.payload
        sortPayload = {
          ...sortPayload,
          pageSize,
          pageNumber
        }
        dispatch(fetchApprovalSortStart(sortPayload))
      } else {
        dispatch(
          fetchApprovalsItemsStart(
            userId
              ? {
                  id: userId,
                  recipientMail: myTeamDetails[0].email
                }
              : {
                  pageSize,
                  pageNumber
                }
          )
        )
      }
    } else if (sortInfoData.sortKey !== '') {
      let sortPayload = sortInfoData.payload
      sortPayload = {
        ...sortPayload,
        pageSize,
        pageNumber
      }
      dispatch(fetchApprovalSortStart(sortPayload))
    } else {
      const payload = {
        id: userId,
        recipientMail: userId ? myTeamDetails[0]?.email : ''
      }
      dispatch(fetchApprovalsItemsStart(userId ? payload : null))
    }
  }, [pageNumber, pageSize])

  // To render the table when data is available
  useEffect(async () => {
    if (approvalMeta && Object.keys(results).length !== 0) {
      const columns = defineColumns(approvalMeta.columns, false, 'Approvals')
      const rows = defineRows(approvalMeta.columns, results.approvalData, 'Approvals')

      const filterResultsOptions = generateOptions(
        approvalMeta.filterBy,
        approvalMeta.initialFilterBy
      )

      const groupResultsOptions = generateOptions(approvalMeta.groupBy, approvalMeta.initialGroupBy)

      setInitialData({
        ...initialData,
        columns,
        rows,
        paginationSizes: approvalMeta.paginationSizes,
        hasSortableColumns: approvalMeta.hasSortableColumns,
        initialSortColumnId: approvalMeta.initialSortColumnId,
        bulkActions: approvalMeta.bulkActions,
        filterResultsOptions: filterResultsOptions.options,
        defaultFilterResultsId: filterResultsOptions.defaultOptionId,
        groupResultsOptions: groupResultsOptions.options,
        defaultGroupResultsId: groupResultsOptions.defaultOptionId
      })
    }
  }, [approvalMeta, results, isFetching])

  useEffect(() => {
    if (
      getNotificationMessage.message &&
      ['success', 'Success', 'info', 'Error', 'error', 'Mixed'].includes(
        getNotificationMessage.type
      )
    ) {
      setTimeout(() => {
        // dispatch here
        dispatch(
          updateApprovalsNotificationMessage({
            type: '',
            message: '',
            action: ''
          })
        )
      }, 10000)
    }
  }, [getNotificationMessage])
  useEffect(
    () => () => {
      localStorage.removeItem('searchValue')
    },
    []
  )
  const movetoHistory = () => {
    history.push('/history/approvalHistory')
  }

  return (
    <>
      {bulkActionsOptions.openModal && (
        <GenericModal setOpen={handleBulkActionsModal}>{getActionModal()}</GenericModal>
      )}
      {!userId && (
        <div>
          <Link to="/tasks" style={{ textDecoration: 'none' }}>
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
              { label: translate('myTasks.header.title'), url: '/tasks' },
              { label: translate('myTasks.approvals.ApprovalsList'), url: '' }
            ]}
          />
        </div>
      )}
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
      {getNotificationMessage.message && (
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
            <div
              style={{ gridColumnEnd: 'span 12', marginBottom: '10px' }}
              type={getNotificationMessage.type}
            >
              {getNotificationMessage.type === 'Mixed' ? (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'relative', marginBottom: '30px', marginTop: '-40px' }}>
                      <Notification
                        description={getNotificationMessage?.message[0]}
                        variant="Success"
                        actionCallback={handleConfirm}
                      />
                    </div>
                    <div style={{ position: 'relative' }}>
                      <Notification
                        description={getNotificationMessage?.message[1]}
                        variant="Error"
                        actionCallback={handleConfirm}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <Notification
                  description={getNotificationMessage.message}
                  variant={getNotificationMessage.type}
                  action={getNotificationMessage.type === 'info' ? 'confirm' : ''}
                  actionCallback={handleConfirm}
                />
              )}
            </div>
          </div>
        </div>
      )}
      {!userId && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Grid container>
            <Grid item xs={12} style={{ display: 'flex' }}>
              <h1 style={{ fontWeight: 'normal', marginBottom: '10px' }}>
                {' '}
                {translate('myTasks.approvals')}
              </h1>
              <div style={{ marginTop: '22px', marginLeft: '5px' }}>
                {showSmallLoading && (
                  <CircularProgress
                    size={23}
                    sx={{
                      top: '5px',
                      marginBottom: '10px',
                      position: 'relative',
                      color: blue[500]
                    }}
                  />
                )}
              </div>
            </Grid>
          </Grid>
          <Grid container style={{ marginRight: '8px' }}>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={movetoHistory}
                style={{
                  fontSize: '14px',
                  width: 'fit-content',
                  color: `${theme.palette.mode === 'dark' ? '#FFF' : '#000'}`,
                  borderColor: `${theme.palette.mode === 'dark' ? '#FFF' : '#000'}`,
                  borderWidth: '1px',
                  height: '45px'
                }}
              >
                {translate(`approval.visit.hostory`)}
              </Button>
            </Grid>
          </Grid>
        </div>
      )}
      <Grid>
        <Grid
          item
          xs={12}
          sx={{ background: theme.palette.mode === 'dark' ? '#182B44' : '#FFF', display: 'flex' }}
        >
          <MSearchBox
            onSearchCallback={handleSearch}
            onClearCallback={clearSearch}
            placeholder={translate('approval.search.placeholder')}
            age={age}
            setAge={setAge}
            onClickCallback={handleModal}
            data={initialData.bulkActions}
            filterResultsOptions=""
            groupResultsOptions=""
            type="Approvals"
            isManageColumnRequired={false}
          />
        </Grid>
        {showBigLoader && <Loading />}
        <Grid item xs={12}>
          <Box>
            {results && (
              <ApprovalsTable
                rows={results.approvalData}
                search={initialData.search}
                columns={initialData.columns}
                paginationSizes={initialData.paginationSizes}
                hasSortableColumns={initialData.hasSortableColumns}
                initialSortColumnId={initialData.initialSortColumnId}
                bulkActions={initialData.bulkActions}
                metadata={approvalMeta}
                type="Approvals"
                total={results?.total ? results?.total : 0}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default Approvals
