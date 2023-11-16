import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import TablePagination from '@mui/material/TablePagination'
import { Link } from 'react-router-dom'
import useTheme from '../../../hooks/useTheme'

function Row(props) {
  const { row } = props
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="left">{row.startDate}</TableCell>
        <TableCell align="left">{row.dueDate}</TableCell>
        <TableCell align="left">{row.completion}</TableCell>
        <TableCell>
          <Link
            to={row.redirect.props.to}
            style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
          >
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowRight /> : <KeyboardArrowRight />}
            </IconButton>
          </Link>
        </TableCell>
      </TableRow>
    </>
  )
}

export default function CollapsibleTable({ paginationSizes, data, items }) {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const { theme } = useTheme()
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)

    setPage(0)
  }

  return (
    <Paper>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              {data.map(
                (obj) =>
                  obj.header && (
                    <TableCell
                      sx={{
                        background: `${theme === 'dark' ? '#00A7F7' : '#B0DFF6'}`
                      }}
                      key={obj.id}
                    >
                      {obj.header}
                    </TableCell>
                  )
              )}
              <TableCell sx={{ background: `${theme === 'dark' ? '#00A7F7' : '#B0DFF6'}` }} />
            </TableRow>
          </TableHead>
          <TableBody sx={{ background: `${theme === 'dark' ? '#1A2129' : '#ffffff'}` }}>
            {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <Row key={row.name} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={paginationSizes}
        component="div"
        count={items.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}
