import * as React from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { green, red } from '@mui/material/colors'
import Fab from '@mui/material/Fab'
import Icon from 'components/icon'

const CircularIntegration = ({ name, loader, disabled, title, color }) => {
  const [loading, setLoading] = React.useState(false)
  const timer = React.useRef

  React.useEffect(() => clearTimeout(timer.current), [])

  const handleButtonClick = () => {
    if (!loading || loader) {
      setLoading(true)
      timer.current = window.setTimeout(() => {
        setLoading(false)
      }, 2000)
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ m: 1, position: 'relative', cursor: disabled ? 'not-allowed' : 'pointer' }}>
        <Fab
          aria-label="save"
          sx={{
            width: '20px',
            height: '20px',
            minHeight: '20px',
            background: 'transparent',
            position: 'initial'
          }}
          disabled={disabled}
          title={title}
          onClick={handleButtonClick}
        >
          <Icon name={name} />
        </Fab>
        {loading && (
          <CircularProgress
            size={26}
            sx={{
              color: color === 'red' ? red[500] : green[500],
              position: 'absolute',
              top: 0,
              left: -3,
              zIndex: 1
            }}
            disabled={disabled}
          />
        )}
      </Box>
    </Box>
  )
}

export default CircularIntegration
