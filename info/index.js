import React, { useState } from 'react'
import Icon from 'components/icon'
import * as Styled from './style'

const Info = ({ text }) => {
  const [showText, setShowText] = useState(false)

  const onIconClick = () => setShowText(!showText)

  return (
    <Styled.Wrapper>
      <span role="button" tabIndex="0" onClick={onIconClick} onKeyPress={onIconClick}>
        <Icon name="infoOutline" size="small" aria-label="info-icon" />
      </span>
      {showText && <Styled.Text>{text}</Styled.Text>}
    </Styled.Wrapper>
  )
}

export default Info
Info.defaultProps = {
  text: ''
}
