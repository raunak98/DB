import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import translate from 'translations/translate'

const ITEM_HEIGHT = 48

const LongMenu = ({ options, onChangeCallback, disabled, certification }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const theme = useTheme()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (value) => {
    setAnchorEl(null)
    if (value) {
      onChangeCallback(value)
    }
  }
  const filteredItems = options.filter((val) => {
    if (!['SECURITY_ADGROUP_MAIN', 'SECURITY_VDRGROUP_MAIN'].includes(certification)) {
      return val.value !== 'forward'
    }
    return val
  })

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={disabled}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button'
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        PaperProps={{
          style: {
            background: theme.palette.mode === 'dark' ? '#808080' : '#fff',
            maxHeight: ITEM_HEIGHT * 6,
            fontSize: '14px',
            borderRadius: '0px',
            overflow: 'hidden'
          }
        }}
      >
        {filteredItems.map((option) => (
          <MenuItem
            key={option.label}
            onClick={() => handleClose(option.value)}
            divider
            sx={{
              borderBottomWidth: '1px',
              borderBottomColor: '#E7E7E7',
              ':hover': '#F5F5F7',
              fontSize: '14px',
              height: '32px'
            }}
          >
            {translate(`review.bulkActions.${option.value}`)}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default LongMenu
