import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import { Button, Grid, Box } from '@mui/material'
import Breadcrumb from 'components/breadcrumb'
import { Notification } from 'components/notification'
import MSearchBox from 'components/mSearchBox'
import {
  fetchServiceDeskAdminSearchStart,
  fetchServiceDeskAdminMetadataStart,
  updateSDadminPaginationKeys,
  updateShowBigLoader,
  fetchServiceDeskAdminSortStart
} from 'redux/admin/serviceDeskAdmin/serviceDeskAdmin.action'
import {
  selectServiceDeskAdminItems,
  selectServiceDeskAdminMetadata,
  selectServiceDeskAdminPageNumber,
  selectServiceDeskAdminPageSize,
  selectIsGoingForwardFlag,
  selectServiceDeskAdminPaginationKeys,
  selectServiceDeskAdminSortInfoData
} from 'redux/admin/serviceDeskAdmin/serviceDeskAdmin.selector'

import translate from 'translations/translate'
import { defineColumns, defineRows } from 'helpers/arrays'
import MUITable from 'components/MUITable'
import * as Styled from './style'

const ServiceDeskAdmin = () => {
  const type = 'ServiceDeskAdmin'
  const theme = useTheme()
  const dispatch = useDispatch()
  const serviceDeskMeta = useSelector(selectServiceDeskAdminMetadata)
  const serviceDeskResults = useSelector(selectServiceDeskAdminItems)
  const pageSize = useSelector(selectServiceDeskAdminPageSize)
  const pageNumber = useSelector(selectServiceDeskAdminPageNumber)
  const isGoingForward = useSelector(selectIsGoingForwardFlag)
  const paginationKeys = useSelector(selectServiceDeskAdminPaginationKeys)
  const sortInfoData = useSelector(selectServiceDeskAdminSortInfoData)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [notification, setNotification] = useState({ description: '', variant: '' })
  const [initialData, setInitialData] = useState({
    columns: [],
    rows: [],
    paginationSizes: undefined,
    hasSortableColumns: false,
    initialSortColumnId: '',
    bulkActions: [],
    // Search
    search: ''
  })

  const handleSearch = (payload) => {
    if (payload && Object.values(payload).some((val) => val !== '')) {
      const { startDate, endDate } = payload
      if ((startDate === '' && endDate === '') || (startDate && endDate)) {
        setSearchKeyword(payload)
        localStorage.setItem('serviceDeskAdmin-searchKey', JSON.stringify(payload))
        if (searchKeyword) {
          const payloadToPass = {
            ...payload,
            pageSize: 10,
            pageNumber: 0
          }
          dispatch(fetchServiceDeskAdminSearchStart(payloadToPass))
        }
      } else {
        setNotification({
          description: 'serviceDesk.dateError',
          variant: 'error'
        })
      }
    } else if (Object.values(payload).every((val) => val === '')) {
      setNotification({
        description: 'serviceDesk.emptyValues',
        variant: 'error'
      })
    }
  }

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

  // useEffects
  useEffect(() => {
    if (serviceDeskMeta && serviceDeskResults && Object.keys(serviceDeskResults).length > 0) {
      dispatch(updateShowBigLoader(false))
      const columns = defineColumns(serviceDeskMeta.columns, false, type)
      const rows = defineRows(serviceDeskMeta.columns, serviceDeskResults.serviceDeskData, type)

      setInitialData({
        ...initialData,
        columns,
        rows,
        paginationSizes: serviceDeskMeta.paginationSizes,
        hasSortableColumns: serviceDeskMeta.hasSortableColumns,
        initialSortColumnId: serviceDeskMeta.initialSortColumnId,
        bulkActions: serviceDeskMeta.bulkActions
      })
    }
  }, [serviceDeskMeta, serviceDeskResults])

  useEffect(() => {
    setSearchKeyword(localStorage.getItem('serviceDeskAdmin-searchKey'))
    dispatch(updateShowBigLoader(true))
    dispatch(fetchServiceDeskAdminMetadataStart())
    dispatch(updateShowBigLoader(false))
  }, [])

  useEffect(
    () => () => {
      localStorage.removeItem('serviceDeskAdmin-searchKey')
    },
    []
  )

  useEffect(() => {
    if (!isGoingForward && paginationKeys.length > 0) {
      paginationKeys.pop()
      dispatch(updateSDadminPaginationKeys(paginationKeys))
    }
    if (pageNumber > 0) {
      if (sortInfoData.sortKey !== '') {
        // const sortPaginationKeyWord = getPaginationKeyword()
        let sortPayload = sortInfoData.payload
        sortPayload = {
          ...sortPayload,
          ...searchKeyword,
          pageSize,
          pageNumber
        }
        dispatch(fetchServiceDeskAdminSortStart(sortPayload))
      } else {
        dispatch(
          fetchServiceDeskAdminSearchStart({
            ...searchKeyword,
            pageSize,
            pageNumber
          })
        )
      }
    } else if (sortInfoData.sortKey !== '') {
      const payload = localStorage.getItem('serviceDeskAdmin-searchKey')
      const sortPayload = { ...sortInfoData.payload, payload }
      dispatch(fetchServiceDeskAdminSortStart(sortPayload))
    } else if (pageNumber === 0 && Object.values(searchKeyword).length > 0) {
      dispatch(
        fetchServiceDeskAdminSearchStart({
          ...searchKeyword,
          pageSize,
          pageNumber
        })
      )
    }
  }, [pageSize, pageNumber])

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
          { label: translate('serviceDeskAdmin.header'), url: '' }
        ]}
      />

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

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid container>
          <Grid item xs={12} style={{ display: 'flex' }}>
            <h1 style={{ fontWeight: 'normal', marginBottom: '10px' }}>
              {translate('serviceDeskAdmin.header')}
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
            onSearchCallback={handleSearch}
            onClearCallback=""
            placeholder={translate('sda.search.placeholder')}
            data=""
            filterResultsOptions=""
            groupResultsOptions=""
            isManageColumnRequired={false}
            type="ServiceDeskAdmin"
            setSearchVisible
          />
        </Grid>
        {serviceDeskMeta && serviceDeskResults && Object.keys(serviceDeskResults).length > 0 ? (
          <Grid item xs={12}>
            <Box
              sx={{
                width: '100%',
                backgroundColor: `${theme.palette.mode === 'dark' ? '#1a2129' : '#FFF'}`
              }}
            >
              <MUITable
                pageSizes={initialData.paginationSizes}
                allColumns={initialData.columns}
                type={type}
                data={initialData.rows}
                totalCount={serviceDeskResults.total}
                hasSort={initialData.hasSortableColumns}
              />
            </Box>
          </Grid>
        ) : null}
      </Grid>
    </>
  )
}
export default ServiceDeskAdmin
