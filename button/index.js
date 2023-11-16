import React from 'react'
import Icon from 'components/icon'
import * as Styled from './style'

const Button = ({ text, primary, size, disabled, iconName, iconSize, onClickCallback, fluid }) => (
  <Styled.Button
    primary={primary}
    size={size}
    disabled={disabled}
    onClick={onClickCallback}
    fluid={fluid}
  >
    <span>{text}</span>
    {iconName && <Icon name={iconName} size={iconSize} />}
  </Styled.Button>
)

Button.defaultProps = {
  text: '',
  primary: true,
  size: 'medium',
  disabled: false,
  iconName: '',
  iconSize: 'tiny',
  onClickCallback: null
}

export default Button
