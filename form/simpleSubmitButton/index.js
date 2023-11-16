import React from 'react'
import * as Styled from './style'

const SubmitButton = ({ text }) => <Styled.SubmitButton value={text} type="submit" />

SubmitButton.defaultProps = {
  text: 'Submit'
}

export default SubmitButton
