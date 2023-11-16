import React from 'react'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import translate from 'translations/translate'
import useTheme from '../../hooks/useTheme'

const DropdownFilter = ({ id, defaultOption, dropdownOptions, handleCallback, align }) => {
  const { theme } = useTheme()
  const handleSelect = (event) => {
    handleCallback(event.target.value)
  }

  return (
    <div style={{ float: align }}>
      <FormControl>
        <Select
          labelId={id}
          value={defaultOption}
          defaultValue={defaultOption}
          onChange={handleSelect}
          sx={{
            '.MuiSelect-select': {
              fontSize: '14px',
              color: theme === 'dark' ? '#FFF' : '#333'
            },

            '.MuiOutlinedInput-notchedOutline': {
              border: 'none',
              borderWidth: '0px',
              borderColor: 'transparent',
              '&:focus': {
                border: 'none !important',
                borderColor: 'tranparent !important'
              }
            }
          }}
        >
          {dropdownOptions.map((c) => (
            <MenuItem
              sx={{
                color: theme === 'dark' ? '#FFF' : '#333',
                fontSize: '13px',
                backgroundColor: theme === 'dark' ? '#333' : '#FFF',
                '&:hover': {
                  backgroundColor: theme === 'dark' ? '#565656 !important' : '#EFEFEF !important'
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(55, 111, 208, 1) !important',
                  color: '#FFF'
                },
                '.css-6hp17o-MuiList-root-MuiMenu-list': {
                  backgroundColor: theme === 'dark' ? '#333' : '#FFF !important'
                }
              }}
              key={c.value}
              value={c.value}
            >
              {translate(`dropdown.${c.text}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default DropdownFilter
