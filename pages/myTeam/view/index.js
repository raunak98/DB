import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components/macro'
import Button from '@mui/material/Button'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Box, Tabs, Tab } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import translate from 'translations/translate'
import Loading from 'components/loading'
import { fetchMyTeamSearchStart, updateShowBigLoader } from 'redux/myTeam/myTeam.action'
import { selectMyTeamSearchItem } from 'redux/myTeam/myTeam.selector'
import Breadcrumb from 'components/breadcrumb'
import { getPersonalAssetsByMail } from 'helpers/utils'
import { defineColumns, defineRows } from 'helpers/arrays'
import { generateOptions } from 'helpers/table'
import AssetTable from '../../../pageComponents/Assets/MyAssetTable'
import RequestHistory from '../../history/requestHistory'

import Approvals from '../../myTasks/approvals'
import * as Styled from '../style'
import * as myTeamApi from '../../../api/myTeam'
import {
  fetchMyAssetsItemsStart,
  fetchMyAssetsItemsSuccess,
  fetchPersonalAssetsMetadataStart,
  updateAssetsIsGoingForwardFlag,
  updateAssetsPaginationKeys,
  updateAssetsPageSize,
  updateAssetsPageNumber,
  fetchMyAssetsSearchStart,
  fetchNarIdInfoStart,
  fetchMyAssetsSortStart
} from '../../../redux/myAssets/myAssets.action'
import {
  selectShowBigLoader,
  selectMyAssetsItems,
  selectPerosnalAssetsMetadata,
  selectAssetsIsGoingForwardFlag,
  selectAssetsPaginationKeys,
  selectAssetsPageNumber,
  selectAssetsPageSize,
  selectMyAssetsSortInfoData,
  selectAssetsNarId
} from '../../../redux/myAssets/myAssets.selector'
import GRIDTable from '../../myAsset/GRIDTable'
import MembershipTable from '../../myAccess/MembershipTable'

const MyTeamViewDetails = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { id } = useParams()
  localStorage.setItem('MyteamUserId', id)
  const [value, setValue] = useState(0)
  const [selectedObj, setSelectedObj] = useState({})
  const narId = useSelector(selectAssetsNarId)
  const result = useSelector(selectMyTeamSearchItem)
  const myAssetData = useSelector(selectMyAssetsItems)
  const myAssetMeta = useSelector(selectPerosnalAssetsMetadata)
  const showBigLoader = useSelector(selectShowBigLoader)
  const myassetpageNumber = useSelector(selectAssetsPageNumber)
  const myassetpageSize = useSelector(selectAssetsPageSize)
  const isGoingForward = useSelector(selectAssetsIsGoingForwardFlag)
  const paginationKeysArray = useSelector(selectAssetsPaginationKeys)
  const sortInfoData = useSelector(selectMyAssetsSortInfoData)
  const [showSearch, setShowSearch] = React.useState(true)
  const tabInfo = [
    'Gernal',
    'PersonalAccounts',
    'NonPersonalAccounts',
    'Line Manager Approval',
    'Request History'
  ]
  const [searchInputeValue, setSearchInputeValue] = useState('')

  const CLoseIconWrapper = styled('div')(() => ({
    padding: theme.spacing(0, 2),
    position: 'absolute',
    height: '100%',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 3,
    zIndex: 1
  }))
  const RightSideIcon = styled.div`
    float: right;
    margin-left: 60%;
    display: flex;
    width: '50%';
  `
  const RightIconOverBG = styled.div`
    margin-top: 12px;
    :hover {
      background: transparent;
    }
  `
  function SearchIcon() {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M20.1 19.4L14.4 13.7C15.4 12.6 16 11.1 16 9.5C16 5.9 13.1 3 9.5 3C5.9 3 3 5.9 3 9.5C3 13.1 5.9 16 9.5 16C11.1 16 12.6 15.4 13.7 14.4L19.4 20.1L20.1 19.4ZM9.5 15C6.5 15 4 12.5 4 9.5C4 6.5 6.5 4 9.5 4C12.5 4 15 6.5 15 9.5C15 10.8 14.5 12.1 13.7 13.1L13.1 13.7C12.1 14.5 10.8 15 9.5 15Z"
          fill={theme.palette.mode === 'dark' ? '#FFF' : '#333'}
        />
      </svg>
    )
  }

  function CloseIcon() {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12.8404 12.0004L18.9604 5.88035C19.2003 5.64035 19.2003 5.25597 18.9604 5.04035C18.7204 4.82474 18.336 4.80035 18.1204 5.04035L12.0004 11.1604L5.88035 5.04035C5.64035 4.80035 5.25597 4.80035 5.04035 5.04035C4.80035 5.28035 4.80035 5.66474 5.04035 5.88035L11.1604 12.0004L5.04035 18.1204C4.80035 18.3604 4.80035 18.7447 5.04035 18.9604C5.28035 19.2003 5.66474 19.2003 5.88035 18.9604L12.0004 12.8404L18.1204 18.9604C18.3604 19.2003 18.7447 19.2003 18.9604 18.9604C19.2003 18.7204 19.2003 18.336 18.9604 18.1204L12.8404 12.0004Z"
          fill={theme.palette.mode === 'dark' ? '#FFF' : '#333'}
        />
      </svg>
    )
  }

  const handleSearch = (search) => {
    localStorage.setItem('searchValue', search)
    if (selectedObj && selectedObj.length) {
      let searchInValue
      switch (value) {
        case 1:
          searchInValue = '_id'
          break
        case 2:
          searchInValue = `${narId}`
          break
        default:
          break
      }
      dispatch(updateAssetsPageSize(10))
      dispatch(updateAssetsPageNumber(0))
      const payload = {
        searchIn: `MyAssets-${tabInfo[value]}`,
        searchFor: search,
        searchInValue,
        pageSize: myassetpageSize,
        reporteeId: id,
        reporteeMail: selectedObj[0]?.email,
        pageNumber: myassetpageNumber
      }
      dispatch(updateShowBigLoader(true))
      dispatch(fetchMyAssetsSearchStart(payload))
    }
  }
  const onClearSearch = () => {
    localStorage.setItem('searchValue', '')
    dispatch(updateAssetsPageSize(10))
    dispatch(updateAssetsPageNumber(0))
    if (selectedObj && selectedObj.length) {
      if (value === 2) {
        dispatch(fetchNarIdInfoStart(selectedObj[0]?.email))
      } else {
        const pageNumber = myassetpageNumber
        dispatch(
          fetchMyAssetsItemsStart(getPersonalAssetsByMail(selectedObj[0]?.id, 10, pageNumber))
        )
      }
    }
    setSearchInputeValue('')
    setShowSearch(false)
  }
  const onSearch = () => {
    if (showSearch) {
      onClearSearch()
    }
    setShowSearch(!showSearch)
  }

  const onSearchHandle = (e) => {
    if (e?.target?.value) {
      setSearchInputeValue(e.target.value)
      handleSearch(e.target.value)
    } else {
      setSearchInputeValue('')
    }
  }

  const tabs = [
    {
      id: '1',
      label: `${translate('myTeamsTab.general')}`
    },
    {
      id: '2',
      label: `${translate('myTeamsTab.personalAccounts')}`
    },
    {
      id: '3',
      label: `${translate('myTeamsTab.nonPersonalAccounts')}`
    },
    {
      id: '4',
      label: `${translate('myTeamsTab.approvals')}`
    },
    {
      id: '5',
      label: `${translate('myTeamsTab.requestHistory')}`
    },
    {
      id: '6',
      label: `${translate('myTeamsTab.groupMembership')}`
    }
  ]

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

  const handleChange = (event, newValue) => {
    localStorage.setItem('myTeam-selectedTab', newValue)
    setValue(newValue)
    setShowSearch(false)
    setSearchInputeValue('')
    if (newValue === 0) {
      dispatch(fetchPersonalAssetsMetadataStart())
      dispatch(updateAssetsPaginationKeys([]))
      dispatch(updateAssetsIsGoingForwardFlag(true))
      dispatch(updateAssetsPageSize(10))
      dispatch(updateAssetsPageNumber(0))
    }
  }

  useEffect(async () => {
    const payload = {
      searchItem: id,
      pageSize: myassetpageSize,
      pageNumber: myassetpageNumber
    }
    dispatch(updateShowBigLoader(true))
    dispatch(fetchMyTeamSearchStart(payload))
    dispatch(fetchPersonalAssetsMetadataStart())
    localStorage.setItem('myTeam-userId', id)
    setValue(
      localStorage.getItem('myTeam-selectedTab')
        ? parseInt(localStorage.getItem('myTeam-selectedTab'), 10)
        : 0
    )
  }, [])

  useEffect(() => {
    if (result) {
      const payload = {
        reporteeId: id,
        reporteeMail: result[0]?.email
      }
      myTeamApi.getDisoResponse(payload).then((response) => {
        if (response) {
          setSelectedObj(response)
        }
      })
    }
    return () => {
      dispatch(updateAssetsIsGoingForwardFlag(true))
      dispatch(updateAssetsPaginationKeys([]))
    }
  }, [result])

  useEffect(() => {
    if (Object.keys(selectedObj).length > 0) {
      dispatch(updateShowBigLoader(false))
    }
  }, [selectedObj])

  // TODO : Add changes for My Assets table pagination
  useEffect(() => {
    if (localStorage.getItem('myTeam-selectedTab') === '1') {
      dispatch(updateShowBigLoader(true))
      dispatch(fetchMyAssetsItemsSuccess({ myAssetsItems: {} }))
    }
    if (!isGoingForward && paginationKeysArray.length > 0) {
      paginationKeysArray.pop()
      dispatch(updateAssetsPaginationKeys(paginationKeysArray))
    }
    if (selectedObj !== undefined) {
      const searchDetails = localStorage.getItem('searchValue')
      if (![null, undefined, ''].includes(searchDetails)) {
        let searchInValue
        switch (value) {
          case 1:
            searchInValue = '_id'
            break
          case 2:
            searchInValue = `${narId}`
            break
          default:
            break
        }
        const payload = {
          searchIn: `MyAssets-${tabInfo[value]}`,
          searchFor: searchDetails,
          searchInValue,
          pageSize: myassetpageSize,
          pageNumber: myassetpageNumber,
          reporteeId: id,
          reporteeMail: selectedObj[0]?.email
        }
        dispatch(updateShowBigLoader(true))
        dispatch(fetchMyAssetsSearchStart(payload))
      } else if (sortInfoData.sortKey !== '') {
        let sortPayload = sortInfoData.payload
        sortPayload = {
          ...sortPayload,
          pageSize: myassetpageSize,
          pageNumber: myassetpageNumber,
          reporteeId: id,
          reporteeMail: selectedObj[0]?.email
        }
        dispatch(fetchMyAssetsSortStart(sortPayload))
      } else {
        const params = {
          ...getPersonalAssetsByMail(
            selectedObj[0]?.id,
            myassetpageNumber > 0 ? myassetpageSize : 10,
            myassetpageNumber
          ),
          isMyTeamRequest: true
        }
        dispatch(fetchMyAssetsItemsStart(params))
      }
      localStorage.setItem(
        'myTeam-userName',
        `${selectedObj[0]?.firstName} ${selectedObj[0]?.lastName}`
      )
      localStorage.setItem('myTeam-userEmail', selectedObj[0]?.email)
    }
  }, [myassetpageNumber, myassetpageSize, selectedObj])

  // TODO :  ADD changes to display My Assets Table
  useEffect(() => {
    if (myAssetMeta && Object.keys(myAssetData).length !== 0) {
      const columns = defineColumns(myAssetMeta.columns, false, 'Modify')
      const rows = defineRows(myAssetMeta.columns, myAssetData.assetsData, 'Modify')

      const filterResultsOptions = generateOptions(
        myAssetMeta.filterBy,
        myAssetMeta.initialFilterBy
      )

      const groupResultsOptions = generateOptions(myAssetMeta.groupBy, myAssetMeta.initialGroupBy)

      setInitialData({
        ...initialData,
        columns,
        rows,
        paginationSizes: myAssetMeta.paginationSizes,
        hasSortableColumns: myAssetMeta.hasSortableColumns,
        initialSortColumnId: myAssetMeta.initialSortColumnId,
        bulkActions: myAssetMeta.bulkActions,
        filterResultsOptions: filterResultsOptions.options,
        defaultFilterResultsId: filterResultsOptions.defaultOptionId,
        groupResultsOptions: groupResultsOptions.options,
        defaultGroupResultsId: groupResultsOptions.defaultOptionId
      })
    }
  }, [myAssetMeta, myAssetData])

  const getSearchView = (placeholder) => (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', width: '50%' }}>
        {showSearch && (
          <div style={{ display: 'flex' }}>
            <div
              style={{
                width: '100%',
                height: '32px',
                position: 'relative',
                paddingTop: 1,
                margin: 15,
                marginLeft: '30px',
                display: 'flex',
                fontSize: '15px'
              }}
            >
              <CLoseIconWrapper onClick={() => onSearch()}>
                <SearchIcon />
              </CLoseIconWrapper>

              <input
                type="text"
                placeholder={placeholder || translate('myAsset.search.placeholder')}
                style={{
                  width: '400px',
                  height: '35px',
                  padding: 8,
                  paddingLeft: 34,
                  background: theme.palette.mode === 'dark' ? 'transparent' : '#FFF',
                  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                  border: theme.palette.mode === 'dark' ? '1px solid #fff' : '1px solid #000'
                }}
                onChange={onSearchHandle}
                value={searchInputeValue}
              />

              <Button
                style={{ left: '-52px', top: '4px' }}
                onClick={() => onClearSearch()}
                aria-label="Search Input"
              >
                <CloseIcon />
              </Button>
            </div>
            <div
              style={{
                width: '116px',
                paddingTop: '23px',
                marginLeft: '0px',
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#0018a8',
                cursor: 'pointer',
                zIndex: 10
              }}
              onClick={() => onClearSearch()}
              aria-hidden="true"
            >
              {translate('review.cancelSearch')}
            </div>
          </div>
        )}
      </div>
      <RightSideIcon>
        <Button onClick={() => onSearch()}>
          <RightIconOverBG>
            <SearchIcon />
          </RightIconOverBG>
        </Button>
      </RightSideIcon>
    </div>
  )

  return (
    <>
      {showBigLoader && <Loading />}
      <Styled.BackButtonLink to="/my-team">
        <Styled.BackButton>← {translate('create.ADAccount.back')}</Styled.BackButton>
      </Styled.BackButtonLink>
      <Breadcrumb
        path={[
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          { label: translate('navItem.label.myTeam'), url: '/my-team' },
          {
            label: `${
              Object.keys(selectedObj).length > 0
                ? `${selectedObj[0]?.firstName} ${selectedObj[0]?.lastName}`
                : ''
            }`,
            url: ''
          }
        ]}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Styled.HeaderWrapper>
          <h1 style={{ fontWeight: 'normal', marginBottom: '10px' }}>
            {selectedObj[0]?.firstName} {selectedObj[0]?.lastName}
          </h1>
        </Styled.HeaderWrapper>
      </div>
      <Grid item xs={12}>
        <Box
          sx={{
            width: '100%',
            backgroundColor: `${theme.palette.mode === 'dark' ? '#1a2129' : '#FFF'}`
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="myAssets-tabs"
            >
              {tabs &&
                tabs.map((Obj) => <Tab key={Obj.id} sx={{ fontSize: '16px' }} label={Obj.label} />)}
            </Tabs>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        {/* {renderTab(value)} */}
        {(() => {
          switch (value) {
            case 0:
              return (
                <Styled.Table>
                  <Box>
                    <Grid container spacing={1} sx={{ borderBottom: '2px solid #eee' }}>
                      <Grid item xs={4} sx={{ flex: 1, display: 'flex' }}>
                        <Styled.LeftCell>
                          <Styled.CellLabel> {translate('profile.firstname')}</Styled.CellLabel>
                        </Styled.LeftCell>
                        <Styled.Cell>
                          <Styled.CellValue>{selectedObj[0]?.firstName}</Styled.CellValue>
                        </Styled.Cell>
                      </Grid>
                      <Grid item xs={4} sx={{ flex: 1, display: 'flex' }}>
                        <Styled.LeftCell>
                          <Styled.CellLabel> {translate('profile.lastname')}</Styled.CellLabel>
                        </Styled.LeftCell>
                        <Styled.Cell>
                          <Styled.CellValue>{selectedObj[0]?.lastName}</Styled.CellValue>
                        </Styled.Cell>
                      </Grid>
                      <Grid item xs={4} sx={{ flex: 1, display: 'flex' }}>
                        <Styled.LeftCell>
                          <Styled.CellLabel>
                            {translate('review.columnHeader.email')}
                          </Styled.CellLabel>
                        </Styled.LeftCell>
                        <Styled.Cell>
                          <Styled.CellValue>{selectedObj[0]?.email}</Styled.CellValue>
                        </Styled.Cell>
                      </Grid>
                    </Grid>

                    <Grid container spacing={1} sx={{ borderBottom: '2px solid #eee' }}>
                      <Grid item xs={4} sx={{ flex: 1, display: 'flex' }}>
                        <Styled.LeftCell>
                          <Styled.CellLabel>
                            {translate('review.columnHeader.personalNumber')}
                          </Styled.CellLabel>
                        </Styled.LeftCell>
                        <Styled.Cell>
                          <Styled.CellValue>{selectedObj[0]?.personalNumber}</Styled.CellValue>
                        </Styled.Cell>
                      </Grid>
                      <Grid item xs={4} sx={{ flex: 1, display: 'flex' }}>
                        <Styled.LeftCell>
                          <Styled.CellLabel>
                            {translate('review.columnHeader.department')}
                          </Styled.CellLabel>
                        </Styled.LeftCell>
                        <Styled.Cell>
                          <Styled.CellValue>{selectedObj[0]?.department}</Styled.CellValue>
                        </Styled.Cell>
                      </Grid>
                      <Grid item xs={4} sx={{ flex: 1, display: 'flex' }}>
                        <Styled.LeftCell>
                          <Styled.CellLabel> {translate('profile.lineManager')}</Styled.CellLabel>
                        </Styled.LeftCell>
                        <Styled.Cell>
                          <Styled.CellValue>{selectedObj[0]?.lineManager}</Styled.CellValue>
                        </Styled.Cell>
                      </Grid>
                    </Grid>

                    <Grid container spacing={1} sx={{ borderBottom: '2px solid #eee' }}>
                      <Grid item xs={4} sx={{ flex: 1, display: 'flex' }}>
                        <Styled.LeftCell>
                          <Styled.CellLabel>{translate('myteam.diso')}</Styled.CellLabel>
                        </Styled.LeftCell>
                        <Styled.Cell>
                          <Styled.CellValue>{selectedObj[0]?.cbiso}</Styled.CellValue>
                        </Styled.Cell>
                      </Grid>
                      <Grid item xs={4} sx={{ flex: 1, display: 'flex' }}>
                        <Styled.LeftCell>
                          <Styled.CellLabel>
                            {translate('review.columnHeader.costCenter')}
                          </Styled.CellLabel>
                        </Styled.LeftCell>
                        <Styled.Cell>
                          <Styled.CellValue>{selectedObj[0]?.costCenter}</Styled.CellValue>
                        </Styled.Cell>
                      </Grid>
                      <Grid item xs={4} sx={{ flex: 1, display: 'flex' }}>
                        <Styled.LeftCell>
                          <Styled.CellLabel>{translate('profile.country')}</Styled.CellLabel>
                        </Styled.LeftCell>
                        <Styled.Cell>
                          <Styled.CellValue>{selectedObj[0]?.country}</Styled.CellValue>
                        </Styled.Cell>
                      </Grid>
                    </Grid>

                    <Grid container spacing={1} sx={{ borderBottom: '2px solid #eee' }}>
                      <Grid item xs={4} sx={{ flex: 1, display: 'flex' }}>
                        <Styled.LeftCell>
                          <Styled.CellLabel>{translate('myteam.terminationDate')}</Styled.CellLabel>
                        </Styled.LeftCell>
                        <Styled.Cell>
                          <Styled.CellValue>{selectedObj[0]?.terminationDate}</Styled.CellValue>
                        </Styled.Cell>
                      </Grid>
                      <Grid item xs={4} sx={{ flex: 1, display: 'flex' }}>
                        <Styled.LeftCell>
                          <Styled.CellLabel>
                            {translate('myteam.revokeAccessDate')}
                          </Styled.CellLabel>
                        </Styled.LeftCell>
                        <Styled.Cell>
                          <Styled.CellValue>{selectedObj[0]?.revokeAccessDate}</Styled.CellValue>
                        </Styled.Cell>
                      </Grid>
                    </Grid>
                  </Box>
                  {/* <tbody>
                    <Styled.Row key="firstName">
                      <Styled.LeftCell>
                        <Styled.CellLabel> First Name</Styled.CellLabel>
                      </Styled.LeftCell>
                      <Styled.Cell>
                        <Styled.CellValue>{selectedObj[0]?.firstName}</Styled.CellValue>
                      </Styled.Cell>

                      <div>
                        <Styled.LeftCell>
                          <Styled.CellLabel> Last Name</Styled.CellLabel>
                        </Styled.LeftCell>
                        <Styled.Cell>
                          <Styled.CellValue>{selectedObj[0]?.lastName}</Styled.CellValue>
                        </Styled.Cell>
                      </div>
                      <div>
                        <Styled.LeftCell>
                          <Styled.CellLabel> Email</Styled.CellLabel>
                        </Styled.LeftCell>
                        <Styled.Cell>
                          <Styled.CellValue>{selectedObj[0]?.email}</Styled.CellValue>
                        </Styled.Cell>
                      </div>
                    </Styled.Row>

                    <Styled.Row key="lastName">
                      <Styled.LeftCell>
                        <Styled.CellLabel> Last Name</Styled.CellLabel>
                      </Styled.LeftCell>
                      <Styled.Cell>
                        <Styled.CellValue>{selectedObj[0]?.lastName}</Styled.CellValue>
                      </Styled.Cell>
                    </Styled.Row>
                    <Styled.Row key="email">
                      <Styled.LeftCell>
                        <Styled.CellLabel> Email</Styled.CellLabel>
                      </Styled.LeftCell>
                      <Styled.Cell>
                        <Styled.CellValue>{selectedObj[0]?.email}</Styled.CellValue>
                      </Styled.Cell>
                    </Styled.Row>
                    <Styled.Row>
                      <Styled.LeftCell>
                        <Styled.CellLabel> Personal Number</Styled.CellLabel>
                      </Styled.LeftCell>
                      <Styled.Cell>
                        <Styled.CellValue>&nbsp;</Styled.CellValue>
                      </Styled.Cell>
                    </Styled.Row>
                    <Styled.Row key="depart">
                      <Styled.LeftCell>
                        <Styled.CellLabel> Department</Styled.CellLabel>
                      </Styled.LeftCell>
                      <Styled.Cell>
                        <Styled.CellValue>{selectedObj[0]?.department}</Styled.CellValue>
                      </Styled.Cell>
                    </Styled.Row>
                    <Styled.Row key="mang">
                      <Styled.LeftCell>
                        <Styled.CellLabel> Line Manager</Styled.CellLabel>
                      </Styled.LeftCell>
                      <Styled.Cell>
                        <Styled.CellValue>{selectedObj[0]?.lineManager}</Styled.CellValue>
                      </Styled.Cell>
                    </Styled.Row>
                    <Styled.Row key="cbiso">
                      <Styled.LeftCell>
                        <Styled.CellLabel> DISO</Styled.CellLabel>
                      </Styled.LeftCell>
                      <Styled.Cell>
                        <Styled.CellValue>{selectedObj[0]?.cbiso}</Styled.CellValue>
                      </Styled.Cell>
                    </Styled.Row>
                    <Styled.Row key="costCenter">
                      <Styled.LeftCell>
                        <Styled.CellLabel> Cost Center</Styled.CellLabel>
                      </Styled.LeftCell>
                      <Styled.Cell>
                        <Styled.CellValue>{selectedObj[0]?.costCenter}</Styled.CellValue>
                      </Styled.Cell>
                    </Styled.Row>
                    <Styled.Row key="city">
                      <Styled.LeftCell>
                        <Styled.CellLabel> City</Styled.CellLabel>
                      </Styled.LeftCell>
                      <Styled.Cell>
                        <Styled.CellValue>{selectedObj[0]?.city}</Styled.CellValue>
                      </Styled.Cell>
                    </Styled.Row>
                    <Styled.Row key="country">
                      <Styled.LeftCell>
                        <Styled.CellLabel> Country</Styled.CellLabel>
                      </Styled.LeftCell>
                      <Styled.Cell>
                        <Styled.CellValue>{selectedObj[0]?.country}</Styled.CellValue>
                      </Styled.Cell>
                    </Styled.Row>
                    <Styled.Row key="hireDate">
                      <Styled.LeftCell>
                        <Styled.CellLabel> Hire Date</Styled.CellLabel>
                      </Styled.LeftCell>
                      <Styled.Cell>
                        <Styled.CellValue>{selectedObj[0]?.hireDate}</Styled.CellValue>
                      </Styled.Cell>
                    </Styled.Row>
                    <Styled.Row key="terminationDate">
                      <Styled.LeftCell>
                        <Styled.CellLabel> Termination Date</Styled.CellLabel>
                      </Styled.LeftCell>
                      <Styled.Cell>
                        <Styled.CellValue>{selectedObj[0]?.terminationDate}</Styled.CellValue>
                      </Styled.Cell>
                    </Styled.Row>
                    <Styled.Row key="createAccessDate">
                      <Styled.LeftCell>
                        <Styled.CellLabel> Create Access Date</Styled.CellLabel>
                      </Styled.LeftCell>
                      <Styled.Cell>
                        <Styled.CellValue>{selectedObj[0]?.createAccessDate}</Styled.CellValue>
                      </Styled.Cell>
                    </Styled.Row>
                    <Styled.Row key="revokeAccessDate">
                      <Styled.LeftCell>
                        <Styled.CellLabel> Revoke Access Date</Styled.CellLabel>
                      </Styled.LeftCell>
                      <Styled.Cell>
                        <Styled.CellValue>{selectedObj[0]?.revokeAccessDate}</Styled.CellValue>
                      </Styled.Cell>
                    </Styled.Row>
                  </tbody> */}
                </Styled.Table>
              )

            case 1:
              return (
                <div
                  style={{
                    width: '100%',
                    backgroundColor: theme.palette.mode === 'dark' ? '#182B44' : '#FFF'
                  }}
                  key={3}
                >
                  {getSearchView('')}
                  <AssetTable
                    rows={myAssetData.assetsData}
                    search={initialData.search}
                    columns={initialData.columns}
                    paginationSizes={initialData.paginationSizes}
                    hasSortableColumns={initialData.hasSortableColumns}
                    initialSortColumnId={initialData.initialSortColumnId}
                    bulkActions={initialData.bulkActions}
                    metadata={myAssetMeta}
                    type="Modify"
                    myAssetType="Personal"
                    total={myAssetData?.total ? myAssetData?.total : 0}
                  />
                </div>
              )
            case 2:
              return (
                <div
                  style={{
                    width: '100%',
                    backgroundColor: theme.palette.mode === 'dark' ? '#182B44' : '#FFF'
                  }}
                  key={3}
                >
                  {getSearchView('Enter Nar Id')}
                  <GRIDTable userId={id} email={selectedObj[0]?.email} />
                </div>
              )

            case 3:
              return (
                <div
                  style={{
                    width: '100%',
                    backgroundColor: theme.palette.mode === 'dark' ? '#182B44' : '#FFF'
                  }}
                  key={3}
                >
                  <Approvals userId={id} userEmail={selectedObj[0]?.email} />
                </div>
              )

            case 4:
              return (
                <div
                  style={{
                    width: '100%',
                    backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#FFF'
                  }}
                  key={3}
                >
                  <RequestHistory userId={id} userEmail={selectedObj[0]?.email} />
                </div>
              )
            case 5:
              return (
                <div
                  style={{
                    width: '100%',
                    backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#FFF'
                  }}
                  key={3}
                >
                  <MembershipTable userId={id} userEmail={selectedObj[0]?.email} />
                </div>
              )

            default:
              return <></>
          }
        })()}
      </Grid>
    </>
  )
}

export default React.memo(MyTeamViewDetails)
