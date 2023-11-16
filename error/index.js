import React from 'react'
import Icon from 'components/icon'
import * as Styled from './style'

const Error = ({ message }) => (
  <Styled.Wrapper>
    <Icon name="error" size="tiny" />
    {message}
  </Styled.Wrapper>
)

export default Error
Error.defaultProps = {
  message: ''
}
