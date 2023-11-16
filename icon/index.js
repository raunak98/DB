import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import * as svgs from './svg'
import * as Styled from './style'
import useTheme from '../../hooks/useTheme'

const Icon = ({ name, size, onClickCallback, disabled, title }) => {
  const theme = useTheme()
  const Svg = svgs[name]
  return !Svg ? null : (
    <Tooltip title={title || ''}>
      <Styled.Icon
        clickable={onClickCallback instanceof Function}
        onClick={onClickCallback}
        disabled={disabled}
      >
        <Svg size={size} themes={theme?.theme} />
      </Styled.Icon>
    </Tooltip>
  )
}

export default Icon
Icon.defaultProps = {
  name: '',
  size: 'medium',
  onClickCallback: undefined
}
