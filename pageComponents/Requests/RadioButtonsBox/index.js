import React from 'react'
import RadioButtons from '../../../components/radioButtons'
import * as Styled from './style'

const RadioButtonsBox = ({ title, subtitle, options, onSelectCallback }) => (
  <>
    <h3>{title}</h3>
    <Styled.Wrapper>
      <p>{subtitle}</p>
      <RadioButtons onSelectCallback={onSelectCallback} groupId="radiobuttons1" options={options} />
    </Styled.Wrapper>
  </>
)

export default RadioButtonsBox

RadioButtonsBox.defaultProps = {
  title: '',
  subtitle: '',
  options: [],
  onSelectCallback: undefined
}
