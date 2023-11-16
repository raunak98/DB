import React, { useState, useEffect, useRef } from 'react'
import { Grid, Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
// import { generateOptions } from 'helpers/table'
import { useSelector, useDispatch } from 'react-redux'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import TablePagination from '@mui/material/TablePagination'
import { defineColumns, defineRows } from 'helpers/arrays'
import translate from 'translations/translate'
import MSearchBox from 'components/mSearchBox'
import Loading from '../../components/loading'
import MyAccessTable from '../../pageComponents/Access/MyAccessTable'
import { selectNotificationMessage } from '../../redux/review/review.selector'
import { updateReviewNotificationMessage } from '../../redux/review/review.action'
import {
  selectShowBigAccessLoader,
  selectMyAccessGroupItems,
  selectGroupAccessMetadata,
  // isMyAccessFetching,
  // selectAccessIsGoingForwardFlag,
  // selectAccessPaginationKeys,
  selectAccessPageNumber,
  selectAccessPageSize
  // selectGroupAccessSortInfoData
} from '../../redux/myAccess/myAccess.selector'
import {
  fetchMyAccessGroupItemsStart,
  updateShowBigAccessLoader,
  updateGroupAccessIsGoingForwardFlag,
  updateGroupAccessPaginationKeys,
  // fetchMyAccessGroupItemsSuccess,
  fetchMyAccessGroupMetadataStart,
  // fetchMyAccessGroupSortStart,
  fetchMyAccessGroupSearchStart,
  updateAccessPageNumber,
  updateAccessPageSize
} from '../../redux/myAccess/myAccess.action'

const MembershipTable = ({ userId, userEmail }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const groupResults = useSelector(selectMyAccessGroupItems)
  const getNotificationMessage = useSelector(selectNotificationMessage)
  const groupMeta = useSelector(selectGroupAccessMetadata)
  // const isFetching = useSelector(isMyAccessFetching)
  const showBigLoader = useSelector(selectShowBigAccessLoader)
  const pageNumber = useSelector(selectAccessPageNumber)
  const pageSize = useSelector(selectAccessPageSize)
  // const isGoingForward = useSelector(selectAccessIsGoingForwardFlag)
  // const paginationKeysArray = useSelector(selectAccessPaginationKeys)
  // const sortInfoData = useSelector(selectGroupAccessSortInfoData)
  // const [sortPaginationKeyword, setSortPaginationKeyword] = useState([])
  const [clickedItem, setClickedItem] = useState(-1)
  const [accountName, setAccountName] = useState([])
  const [selectedGroupData, setSelectedGroupData] = useState([])
  const component = localStorage.getItem('component')
  const myTeamSelectedUserId = localStorage.getItem('myTeam-userId')
  const myTeamSelectedUserEmail = localStorage.getItem('myTeam-userEmail')
  const serachRef = useRef()

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

  const [pages, setPage] = React.useState(0)
  const [rowsPerPageSize, setRowsPerPage] = React.useState(10)

  const handleChangePage = (event, newPage) => {
    if (serachRef.current && serachRef.current !== undefined && serachRef.current !== '') {
      let payload = {
        pageSize: rowsPerPageSize,
        pageNumber: newPage,
        searchItem: serachRef.current
      }
      if (userId && userEmail) {
        payload = {
          pageSize: rowsPerPageSize,
          pageNumber: newPage,
          mail: userEmail,
          id: userId,
          searchItem: serachRef.current
        }
        dispatch(updateAccessPageNumber(newPage))
        dispatch(updateAccessPageSize(rowsPerPageSize))
      }
      dispatch(fetchMyAccessGroupSearchStart(payload))
    } else {
      let payload = {
        pageSize: rowsPerPageSize,
        pageNumber: newPage
      }
      if (userId && userEmail) {
        payload = {
          pageSize: rowsPerPageSize,
          pageNumber: newPage,
          mail: userEmail,
          id: userId
        }
        dispatch(updateAccessPageNumber(newPage))
        dispatch(updateAccessPageSize(rowsPerPageSize))
      }
      dispatch(fetchMyAccessGroupItemsStart(payload))
    }

    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    if (serachRef.current && serachRef.current !== undefined && serachRef.current !== '') {
      let payload = {
        pageSize: event.target.value,
        pageNumber: 0,
        searchItem: serachRef.current
      }
      if (userId && userEmail) {
        payload = {
          pageSize: event.target.value,
          pageNumber: 0,
          mail: userEmail,
          id: userId,
          searchItem: serachRef.current
        }
      }
      dispatch(updateAccessPageNumber(0))
      dispatch(updateAccessPageSize(event.target.value))
      dispatch(fetchMyAccessGroupSearchStart(payload))
    } else {
      let payload = {
        pageSize: event.target.value,
        pageNumber: 0
      }
      if (userId && userEmail) {
        payload = {
          pageSize: event.target.value,
          pageNumber: 0,
          mail: userEmail,
          id: userId
        }
      }
      dispatch(updateAccessPageNumber(0))
      dispatch(updateAccessPageSize(event.target.value))
      dispatch(fetchMyAccessGroupItemsStart(payload))
    }

    setPage(0)
    setRowsPerPage(parseInt(event.target.value, 10))
  }
  const TablePaginationActions = (props) => {
    const { count, page, rowsPerPage, onPageChange } = props
    const noOfPages = [...Array(Math.ceil(count / rowsPerPage)).keys()]
    const loadPaginationData = () => {
      let displayPageValues = []
      if (noOfPages.length === 1) {
        displayPageValues.push(0)
      } else if (noOfPages.length <= 3) {
        const val = Array(noOfPages.length).keys()
        displayPageValues = [...val]
      } else if (page > 0) {
        if (page !== noOfPages.length - 1) {
          displayPageValues.push(page - 1, page, page + 1)
        } else {
          displayPageValues.push(page - 2, page - 1, page)
        }
      } else {
        displayPageValues.push(page, page + 1, page + 2)
      }
      return displayPageValues
    }

    const handleFirstPageButtonClick = (event) => {
      setAccountName([])
      onPageChange(event, 0)
    }

    const handleBackButtonClick = (event) => {
      setAccountName([])
      onPageChange(event, page - 1)
    }

    const handleNextButtonClick = (event) => {
      setAccountName([])
      onPageChange(event, page + 1)
    }
    const handleButtonClick = (event, v) => {
      setAccountName([])
      onPageChange(event, v)
    }
    const handleLastPageButtonClick = (event) => {
      setAccountName([])
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
    }

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          <span style={{ fontSize: '13px', fontWeight: 400 }}>{translate('table.first')}</span>
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          <KeyboardArrowLeft />
        </IconButton>
        {loadPaginationData().map((v, i) => (
          <IconButton
            key={i}
            style={{
              fontSize: '13px'
            }}
            onClick={(e) => handleButtonClick(e, v)}
          >
            {v + 1}
          </IconButton>
        ))}
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          <span style={{ fontSize: '13px', fontWeight: 400 }}>{translate('table.last')}</span>
        </IconButton>
      </Box>
    )
  }
  const useStyles = makeStyles({
    selectDropdown: {
      color: `${theme?.theme === 'dark' ? '#fff' : '#000'}`,
      backgroundColor: `${theme?.theme === 'dark' ? '#000' : '#fff'}`
    },
    menuItem: {
      '&:hover': {
        backgroundColor: `${theme?.theme === 'dark' ? '#3C485A' : '#aaa1a'}`
      }
    }
  })
  const classes = useStyles()

  const handleSearch = (searchData) => {
    const filterBySearch = []
    selectedGroupData[0].memberOf.filter((item) => {
      if (item.toLowerCase().includes(searchData.toLowerCase())) {
        return filterBySearch.push({
          memberOf: item
        })
      }
      return ''
    })
    const columns = defineColumns(groupMeta.columns, false, 'AccessGroup')
    const rows = defineRows(groupMeta.columns, filterBySearch, 'AccessGroup')

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
  const clearSearch = () => {
    let mappedArr = []
    if (selectedGroupData.length > 0) {
      selectedGroupData[0].memberOf.forEach((value) => {
        if (value !== '') {
          mappedArr.push({
            memberOf: value
          })
        } else {
          mappedArr = []
        }
      })
      const columns = defineColumns(groupMeta.columns, false, 'AccessGroup')
      const rows = defineRows(groupMeta.columns, mappedArr, 'AccessGroup')
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
  }

  const handleSearchAccount = (searchData) => {
    dispatch(updateShowBigAccessLoader(true))
    serachRef.current = searchData
    let payload = {
      searchItem: searchData,
      pageSize,
      pageNumber
    }
    if (component === 'MyTeam') {
      payload = {
        searchItem: searchData,
        pageSize,
        pageNumber,
        mail: myTeamSelectedUserEmail,
        id: myTeamSelectedUserId
      }
    }
    dispatch(fetchMyAccessGroupSearchStart(payload))
  }
  const clearSearchAccount = () => {
    dispatch(updateShowBigAccessLoader(true))
    setAccountName([])
    let payload = {
      pageSize: 10,
      pageNumber: 0
    }
    if (component === 'MyTeam') {
      payload = {
        pageSize: 10,
        pageNumber: 0,
        mail: myTeamSelectedUserEmail,
        id: myTeamSelectedUserId
      }
    }
    setPage(0)
    setRowsPerPage(10)
    dispatch(fetchMyAccessGroupItemsStart(payload))
    serachRef.current = ''
  }

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

  // const iff = (consition, then, otherise) => (consition ? then : otherise)

  // const getPaginationKeyword = () =>
  //   isGoingForward
  //     ? iff(
  //         Object.keys(groupResults.assetsData).length > 0 &&
  //           groupResults?.assetsData[0]?.sortKeyword,
  //         groupResults?.assetsData[0]?.sortKeyword,
  //         null
  //       )
  //     : iff(sortPaginationKeyword, sortPaginationKeyword.slice(-1)[0], '')

  // useEffect(() => {
  //   if (!isGoingForward && paginationKeysArray.length > 0) {
  //     paginationKeysArray.pop()
  //     dispatch(updateGroupAccessPaginationKeys(paginationKeysArray))
  //     if (sortInfoData.sortKey !== '' && sortPaginationKeyword.length > 0) {
  //       sortPaginationKeyword.pop()
  //       setSortPaginationKeyword(sortPaginationKeyword)
  //     }
  //   }
  //   if (isGoingForward && sortInfoData.sortKey !== '') {
  //     // setSortPaginationKeyword([...sortPaginationKeyword, getPaginationKeyword()])
  //   }

  //   let payload = {
  //     pageSize: 10,
  //     pageNumber
  //   }
  //   if (userId) {
  //     payload = {
  //       ...payload,
  //       reporteeMail: userEmail,
  //       reporteeId: userId
  //     }
  //   }
  //   if (pageNumber > 0) {
  //     // let paginationKey
  //     if (sortInfoData.sortKey !== '') {
  //       // paginationKey = isGoingForward
  //       //   ? iff(
  //       //       Object.keys(groupResults.assetsData).length > 0,
  //       //       groupResults?.assetsData[0]?.id,
  //       //       null
  //       //     )
  //       //   : iff(
  //       //       paginationKeysArray && paginationKeysArray?.length > 0,
  //       //       paginationKeysArray?.slice(-1)[0],
  //       //       null
  //       //     )
  //     } else {
  //       // paginationKey = isGoingForward
  //       //   ? iff(
  //       //       Object.keys(groupResults.assetsData).length > 0,
  //       //       groupResults?.assetsData?.slice(-1)[0]?.id,
  //       //       null
  //       //     )
  //       //   : iff(
  //       //       paginationKeysArray && paginationKeysArray?.length > 0,
  //       //       paginationKeysArray?.slice(-1)[0],
  //       //       null
  //       //     )
  //     }
  //     payload = {
  //       ...payload
  //       // search_after_primaryKey: `${paginationKey}`
  //     }
  //     if (sortInfoData.sortKey !== '') {
  //       // const sortPaginationKeyWord = getPaginationKeyword()
  //       let sortPayload = sortInfoData.payload
  //       if (userId) {
  //         sortPayload = {
  //           ...sortPayload,
  //           reporteeMail: userEmail,
  //           reporteeId: userId,
  //           pageSize,
  //           pageNumber
  //         }
  //       }
  //       sortPayload = {
  //         ...sortPayload
  //         // search_after_primaryKey: paginationKey,
  //         // search_after_keyWord: sortPaginationKeyWord
  //       }
  //       dispatch(fetchMyAccessGroupSortStart(sortPayload))
  //     } else {
  //       dispatch(fetchMyAccessGroupItemsStart(payload))
  //     }
  //   } else if (sortInfoData.sortKey !== '') {
  //     // const sortPaginationKeyWord = getPaginationKeyword()
  //     let sortPayload = sortInfoData.payload
  //     sortPayload = {
  //       ...sortPayload
  //       // search_after_keyWord: sortPaginationKeyWord
  //     }
  //     dispatch(fetchMyAccessGroupSortStart(sortPayload))
  //   } else {
  //     dispatch(fetchMyAccessGroupItemsStart(payload))
  //   }
  // }, [pageNumber, pageSize])

  useEffect(() => {
    if (groupMeta && groupResults && Object.keys(groupResults).length > 0) {
      const accountNamearray = []
      groupResults.groupData.map((data) => {
        if (data.accountName !== '') {
          accountNamearray.push(data.accountName)
        }
        return accountNamearray
      })
      setAccountName(accountNamearray)
      dispatch(updateShowBigAccessLoader(false))
      let mappedArr = []
      if (
        selectedGroupData &&
        selectedGroupData.length !== 0 &&
        selectedGroupData[0].memberOf &&
        selectedGroupData[0].memberOf.length > 0
      ) {
        selectedGroupData[0].memberOf.forEach((value) => {
          if (value !== '') {
            mappedArr.push({
              memberOf: value,
              mail: selectedGroupData[0].mail
            })
          } else {
            mappedArr = []
          }
        })
      }
      const columns = defineColumns(groupMeta.columns, false, 'AccessGroup')
      const rows = defineRows(groupMeta.columns, mappedArr, 'AccessGroup')

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

  useEffect(async () => {
    dispatch(updateShowBigAccessLoader(true))
    dispatch(fetchMyAccessGroupMetadataStart())
    dispatch(updateGroupAccessIsGoingForwardFlag(true))
    dispatch(updateGroupAccessPaginationKeys([]))
    if (!userId) {
      localStorage.removeItem('component')
      localStorage.removeItem('myTeam-userId')
      localStorage.removeItem('myTeam-userEmail')
      localStorage.removeItem('myTeam-selectedTab')
    }

    let payload = {
      pageSize: 10,
      pageNumber: 0
    }
    if (userEmail && userId) {
      payload = {
        pageSize: 10,
        pageNumber: 0,
        mail: userEmail,
        id: userId
      }
    }

    dispatch(fetchMyAccessGroupItemsStart(payload))
  }, [])

  useEffect(
    () => () => {
      setInitialData({})
      localStorage.clear()
    },
    []
  )

  const setExpandedData = (samAccountName, index) => {
    const totalAccessGroupData = groupResults.groupData
    const selectedGroup =
      totalAccessGroupData &&
      totalAccessGroupData.length > 0 &&
      totalAccessGroupData.filter((group) => group.accountName === samAccountName)
    setSelectedGroupData(selectedGroup)
    let mappedArr = []

    if (selectedGroup[0].memberOf && selectedGroup[0].memberOf.length > 0) {
      selectedGroup[0].memberOf.forEach((value) => {
        if (value !== '') {
          mappedArr.push({
            memberOf: value,
            id: selectedGroup[0].id,
            mail: selectedGroup[0].mail
          })
        } else {
          mappedArr = []
        }
      })
    }

    const columns = defineColumns(groupMeta.columns, false, 'AccessGroup')

    const rows = defineRows(groupMeta.columns, mappedArr, 'AccessGroup')
    setInitialData({
      ...initialData,
      columns,
      rows,
      paginationSizes: groupMeta.paginationSizes,
      hasSortableColumns: groupMeta.hasSortableColumns,
      initialSortColumnId: groupMeta.initialSortColumnId,
      bulkActions: groupMeta.bulkActions
    })
    if (clickedItem === index) {
      setClickedItem(-1)
    } else {
      setClickedItem(index)
    }
  }
  return (
    <>
      <Grid
        item
        xs={12}
        sx={{
          background: theme.palette.mode === 'dark' ? '#182B44' : '#FFF',
          display: 'flex'
        }}
      >
        <MSearchBox
          onSearchCallback={handleSearchAccount}
          onClearCallback={clearSearchAccount}
          placeholder={translate('myAccess.search.placeholder')}
          data=""
          filterResultsOptions=""
          groupResultsOptions=""
          isManageColumnRequired={false}
        />
      </Grid>
      {accountName && accountName.length > 0 ? (
        accountName.map((groupData, index) => (
          <Accordion
            key={`accordian${groupData}`}
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
              id={`accordianSummary${groupData}`}
              onClick={() => setExpandedData(groupData, index)}
            >
              <Typography sx={{ fontSize: '16px' }}>{groupData}</Typography>
            </AccordionSummary>
            <AccordionDetails id={`accordianDetails${groupData}`}>
              {groupResults && (
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
                        placeholder="Search"
                        data=""
                        filterResultsOptions=""
                        groupResultsOptions=""
                        isManageColumnRequired={false}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          width: '100%',
                          backgroundColor: `${theme.palette.mode === 'dark' ? '#1a2129' : '#FFF'}`
                        }}
                      >
                        {clickedItem === index && (
                          <MyAccessTable
                            rows={initialData.rows}
                            search={initialData.search}
                            columns={initialData.columns}
                            paginationSizes={initialData.paginationSizes}
                            hasSortableColumns={initialData.hasSortableColumns}
                            initialSortColumnId={initialData.initialSortColumnId}
                            bulkActions={initialData.bulkActions}
                            metadata={groupMeta}
                            type="AccessGroup"
                            total={groupResults?.total ? groupResults?.total : 0}
                            selectedUserDetails={{ id: userId, email: userEmail }}
                            selectedGroupData={selectedGroupData}
                          />
                        )}
                      </Box>
                    </Grid>
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
      {groupResults && Object.keys(groupResults).length > 0 && (
        <TablePagination
          style={{
            padding: '0px',
            marginTop: '1px',
            backgroundColor: theme?.palette.mode === 'dark' ? '#3C485A' : '#FFF',
            fontSize: '12px',
            width: '100%'
          }}
          SelectProps={{
            MenuProps: { classes: { paper: classes.selectDropdown } }
          }}
          classes={{ menuItem: classes.menuItem }}
          component="div"
          page={pages}
          labelRowsPerPage={translate('table.pagination')}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
          count={groupResults?.total}
          ActionsComponent={TablePaginationActions}
        />
      )}
      {showBigLoader && <Loading />}
    </>
  )
}
export default MembershipTable
