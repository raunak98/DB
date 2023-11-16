import * as React from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'

// this is Filter By and GroupBy popUp
const DialogText = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    background: 'white'
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
    background: 'white'
  }
}))
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary
}))

const TitleText = (props) => {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2, background: 'white' }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

TitleText.propTypes = {
  // children: PropTypes.node,
  onClose: PropTypes.func.isRequired
}

export default function FilterBy() {
  const [open, setOpen] = React.useState(false)
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div style={{ width: '100%' }}>
      <DialogText onClose={handleClose} open={open}>
        <Box sx={{ flexGrow: 1, background: 'white', padding: '10px' }}>
          <TitleText onClose={handleClose}>
            <span style={{ display: 'none' }}>Filter by</span>
          </TitleText>

          <Grid container spacing={2}>
            <h4 style={{ marginLeft: '10px' }}>Filter by</h4>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Item style={{ border: '1px solid', padding: '10px', marginLeft: '10px' }}>
                  placeholder
                </Item>
              </Grid>
              <Grid item xs={3}>
                <Item style={{ border: '1px solid', padding: '10px', marginLeft: '10px' }}>
                  placeholder
                </Item>
              </Grid>
              <Grid item xs={3}>
                <Item style={{ border: '1px solid', padding: '10px', marginLeft: '10px' }}>
                  placeholder
                </Item>
              </Grid>
              <Grid item xs={3}>
                <Item style={{ border: '1px solid', padding: '10px', marginLeft: '10px' }}>
                  placeholder
                </Item>
              </Grid>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            style={{
              float: 'right',
              marginTop: '10px',
              background: 'white',
              color: 'black',
              border: '2px solid rgb(208, 203, 203)'
            }}
          >
            Apply Filters
          </Button>
          <Button
            variant="contained"
            style={{
              float: 'right',
              marginTop: '10px',
              background: 'white',
              color: 'black',
              border: '2px solid rgb(208, 203, 203)'
            }}
          >
            Cancel
          </Button>
        </Box>
      </DialogText>
    </div>
  )
}
