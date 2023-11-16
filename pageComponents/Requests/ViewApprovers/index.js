import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
// import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import translate from 'translations/translate'
import useTheme from '../../../hooks/useTheme'
import { selectReviewItems } from '../../../redux/review/review.selector'

const ViewApprovers = ({ id, actions }) => {
  const [open, setOpen] = useState(false)
  const [approvers, setApprovers] = useState([])
  const { theme } = useTheme()
  const membershipDetails = useSelector(selectReviewItems)

  const handleClick = (membershipId) => {
    const approversList = membershipDetails.filter(
      (singleMember) => singleMember.id === membershipId
    )
    setApprovers(approversList[0].approvers)
    console.log('approverList', approversList[0].approvers)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  return (
    <>
      <Button
        key={id}
        sx={{ marginLeft: '5px' }}
        variant="outlined"
        onClick={() => handleClick(id)}
      >
        {actions.text}
      </Button>
      <div>
        <Dialog
          open={open}
          PaperProps={{
            style: {
              backgroundColor: theme === 'dark' ? '#1A2129' : '#FFF',
              boxShadow: 'none'
            }
          }}
        >
          <DialogTitle id="alert-dialog-title">Approvers</DialogTitle>
          <DialogContent>
            {approvers.length ? (
              <ul>
                {approvers.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              'No Approvers'
            )}
            {/* {approvers.length ? approvers.join(', ') : 'No Approvers'} */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              {translate('create.ADAccount.cancel')}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}

export default ViewApprovers
