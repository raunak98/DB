import React from 'react'
import Icon from 'components/icon'
import * as Styled from './style'

const LinkButton = ({ text, iconName, onClickCallback, disabled = false }) => (
  <Styled.Wrapper onClick={onClickCallback} disabled={disabled}>
    {iconName && <Icon name={iconName} size="small" />}
    <Styled.Button disabled={disabled}>{text}</Styled.Button>
  </Styled.Wrapper>
)

export default LinkButton
LinkButton.defaultProps = {
  text: '',
  iconName: '',
  onClickCallback: undefined
}
