import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableSortLabel from '@mui/material/TableSortLabel'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import TablePagination from '@mui/material/TablePagination'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@mui/styles'
import Icon from 'components/icon'
import translate from 'translations/translate'
import useTheme from '../../../hooks/useTheme'
import {
  updatePageSizeReviews,
  updatePageNumberReviews,
  updateSortData,
  fetchReviewsSortingStart,
  updateShowSmallLoader
} from '../../../redux/reviews/reviews.action'
import { getReviewItemTotalCount } from '../../../redux/review/review.action'
import {
  selectReviewsPageNumber,
  selectReviewsPageSize,
  selectSortData
} from '../../../redux/reviews/reviews.selector'

function Row(props) {
  const { row, type, showColumns } = props
  const dispatch = useDispatch()
  const [open, setOpen] = React.useState(false)
  let backgroundColor = '#e65100'
  let grayColor = ''
  if (row.status.toLowerCase() === 'todo') {
    backgroundColor = '#949494'
  }
  if (row.status.toLowerCase() === 'in-progress') {
    backgroundColor = '#1565C0'
  }
  if (row.status.toLowerCase() === 'completed') {
    backgroundColor = '#1b5e20'
  }
  if (row.status.toLowerCase() === 'overdue') {
    backgroundColor = '#FA6543'
  }
  if (row.status.toLowerCase() === 'expired') {
    backgroundColor = '#e65100'
  }
  if (row.status.toLowerCase() === 'cancelled') {
    backgroundColor = '#F7685B'
    grayColor = '#e5e4e4'
  }
  // if (row.startDate === '' && row.dueDate === '') {
  //   grayColor = '#e5e4e4'
  // }
  const onNavigationClick = () => {
    setOpen(!open)
    dispatch(
      getReviewItemTotalCount(
        type === 'History' ? row.completion.split('/')[0] : row.completion.split('/')[1]
      )
    )
  }

  return (
    <>
      <TableRow
        sx={{
          '& > *': {
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
            padding: '13px 16px',
            background: grayColor.length > 0 ? grayColor : ''
          }
        }}
        style={{
          textDecoration: 'none'
        }}
        component={Link}
        to={{
          pathname: row.name.props.to.pathname,
          state: {
            id: row.name.props.to.state.id,
            name: row.name.props.to.state.name,
            type,
            total: type === 'History' ? row.completion.split('/')[0] : row.completion.split('/')[1],
            completionStatus: row.completion
          }
        }}
      >
        {Object.keys(row).map((obj) => {
          let tableCell = ''
          if (obj === 'status' && showColumns?.includes(obj)) {
            tableCell = (
              <TableCell align="left" background="#D52B1" key={obj.id}>
                <span
                  style={{
                    background: backgroundColor,
                    display: 'flex',
                    justifyContent: 'center',
                    borderRadius: '3px',
                    width: '90px',
                    padding: '1px 8px',
                    color: '#FFF',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}
                >
                  {row.status.toUpperCase()}
                </span>
              </TableCell>
            )
          }
          if (obj === 'name' && showColumns?.includes(obj)) {
            tableCell = (
              <TableCell key={row.name}>
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: '400px',
                    pointerEvents: row.status.toLowerCase() === 'cancelled' ? 'none' : 'initial'
                  }}
                >
                  {row[obj]}
                </span>
              </TableCell>
            )
          }
          if (['completion', 'startDate', 'dueDate'].includes(obj) && showColumns?.includes(obj))
            tableCell = (
              <TableCell align="left" key={row[obj]}>
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: '400'
                  }}
                >
                  {row[obj]}
                </span>
              </TableCell>
            )
          if (obj === 'redirect')
            tableCell = (
              <TableCell key={row[obj]}>
                <Link
                  to={{
                    pathname: row.redirect.props.to.pathname,
                    state: {
                      id: row.redirect.props.to.state.id,
                      name: row.redirect.props.to.state.name,
                      type,
                      total:
                        type === 'History'
                          ? row.completion.split('/')[0]
                          : row.completion.split('/')[1],
                      completionStatus: row.completion
                    }
                  }}
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    pointerEvents: row.status.toLowerCase() === 'cancelled' ? 'none' : 'initial'
                  }}
                >
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => onNavigationClick()}
                  >
                    {open ? <KeyboardArrowRight /> : <KeyboardArrowRight />}
                  </IconButton>
                </Link>
              </TableCell>
            )
          return tableCell
        })}
      </TableRow>
    </>
  )
}

export default function CollapsibleTable({
  paginationSizes,
  data,
  items,
  type,
  totalItemCount = 0,
  handlePageChange
}) {
  const dispatch = useDispatch()
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const { theme } = useTheme()
  const showColumns = data.map((item) => (item.display ? item.id : ''))
  const pageNumber = useSelector(selectReviewsPageNumber)
  const pageSize = useSelector(selectReviewsPageSize)
  const sortInfoData = useSelector(selectSortData)
  const useStyles = makeStyles({
    selectDropdown: {
      color: `${theme === 'dark' ? '#fff' : '#000'}`,
      backgroundColor: `${theme === 'dark' ? '#000' : '#fff'}`
    },
    menuItem: {
      '&:hover': {
        backgroundColor: `${theme === 'dark' ? '#3C485A' : '#aaa1a'}`
      }
    }
  })
  const classes = useStyles()

  const handleChangePage = (event, newPage) => {
    dispatch(updatePageNumberReviews(newPage))
    handlePageChange()
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    dispatch(updatePageSizeReviews(event.target.value))
    handlePageChange()
  }

  React.useEffect(async () => {
    handlePageChange()
    if (sortInfoData.sortBy !== '') {
      const sortPayload = {
        status: type === 'History' ? 'closed' : 'active',
        pageSize,
        pageNumber,
        sortBy: sortInfoData.sortBy,
        sortDesc: sortInfoData.sortDesc
      }

      dispatch(updateShowSmallLoader(true))
      dispatch(fetchReviewsSortingStart(sortPayload))
      dispatch(updateShowSmallLoader(false))
    } else {
      const payload = {
        status: type === 'History' ? 'closed' : 'active',
        pageSize,
        pageNumber
      }

      dispatch(updateShowSmallLoader(true))
      dispatch(fetchReviewsSortingStart(payload))
      dispatch(updateShowSmallLoader(false))
    }
  }, [pageNumber, rowsPerPage])

  return (
    <Paper>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead sx={{ justifyContent: 'space-between' }}>
            <TableRow>
              {data.map((obj) => {
                const [order, setOrder] = React.useState(true)
                const onColumnClicked = (column) => {
                  let sortBy = ''
                  switch (column) {
                    case 'name':
                      sortBy = 'campaignName'
                      break
                    case 'dueDate':
                      sortBy = 'deadline'
                      break
                    default:
                      sortBy = column
                  }
                  const sortPayload = {
                    status: type === 'History' ? 'closed' : 'active',
                    pageSize,
                    pageNumber: 0,
                    sortBy,
                    sortDesc: !order
                  }
                  if (pageNumber) {
                    dispatch(updatePageNumberReviews(0))
                  }

                  dispatch(
                    updateSortData({
                      sortBy,
                      sortDesc: !order,
                      payload: sortPayload
                    })
                  )
                  dispatch(fetchReviewsSortingStart(sortPayload))
                  setOrder(!order)
                }
                return (
                  obj.header &&
                  obj.display && (
                    <TableCell
                      sx={{
                        background: `${theme === 'dark' ? '#3C485A' : '#B0DFF6'}`,
                        fontSize: '16px',
                        fontWeight: 600,
                        borderTopLeftRadius: '0px'
                      }}
                      key={obj.id}
                    >
                      {typeof obj.header === 'string'
                        ? translate(`review.columnHeader.${obj.header}`)
                        : obj.header}
                      {obj.sortable ? (
                        <TableSortLabel
                          hideSortIcon
                          sx={{ paddingLeft: '25px' }}
                          onClick={() => {
                            onColumnClicked(obj.id)
                          }}
                        >
                          <Icon name={order ? 'chevronDown' : 'chevronUp'} size="xxtiny" />
                        </TableSortLabel>
                      ) : null}
                    </TableCell>
                  )
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody sx={{ background: `${theme === 'dark' ? '#1A2129' : '#FFF'}` }}>
            {items.map((row) => (
              <Row key={row.id} row={row} type={type} showColumns={showColumns} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        style={{
          padding: '0px',
          background: theme === 'dark' ? '#3C485A' : '#FFF',
          width: '100%',
          fontSize: '12px'
        }}
        SelectProps={{
          MenuProps: { classes: { paper: classes.selectDropdown } }
        }}
        classes={{ menuItem: classes.menuItem }}
        labelRowsPerPage={translate('table.pagination')}
        rowsPerPageOptions={paginationSizes}
        component="div"
        count={Number(totalItemCount)}
        rowsPerPage={rowsPerPage}
        page={pageNumber || 0}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}
