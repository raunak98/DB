import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import useTheme from '../../../../hooks/useTheme'

const ViewJustification = () => {
  const { theme } = useTheme()
  return (
    <Box sx={{ margin: '10px' }}>
      <Typography variant="h6" component="h2">
        {' '}
        Justification
      </Typography>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Typography variant="subtitle2" sx={{ margin: '12px 10px 0 0' }}>
          Request ID:
        </Typography>
        <p>12948BNSM00921</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Typography variant="subtitle2" sx={{ margin: '12px 10px 0 0' }}>
          Decision:
        </Typography>
        <p>1200987765</p>
      </div>
      <div>
        <Typography variant="subtitle2" sx={{ margin: '12px 10px 0 0' }}>
          Request justification
        </Typography>
        <p>
          Access to this system is needed to complete all daily task in a pracise manor. All
          employees with this job role has access to this system to do their job role
        </p>
      </div>
      <div style={{ float: 'right' }}>
        <Button
          variant="outlined"
          sx={{
            color: `${theme === 'dark' ? '#FFF' : '#000'}`,
            borderColor: `${theme === 'dark' ? '#FFF' : '#000'}`
          }}
        >
          Close
        </Button>
      </div>
    </Box>
  )
}

export default ViewJustification
