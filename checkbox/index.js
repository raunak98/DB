import React, { useState } from 'react'
import { useUID } from 'helpers/hooks'
import Icon from 'components/icon'
import Error from 'components/error'
import * as Styled from './style'

const Checkbox = ({
  defaultChecked,
  disabled,
  errorMessage,
  label,
  name,
  onChangeCallback,
  isChecked
}) => {
  const [checked, setChecked] = useState(defaultChecked)
  const id = useUID('checkbox-')

  const onChange = () => {
    setChecked(!checked)

    if (onChangeCallback instanceof Function) {
      onChangeCallback(!checked)
    }
  }

  return (
    <>
      <Styled.Input
        type="checkbox"
        id={id}
        name={name}
        disabled={disabled}
        checked={isChecked}
        onChange={onChange}
      />
      <Styled.Label htmlFor={id} disabled={disabled}>
        <Styled.CheckBox disabled={disabled} error={!!errorMessage} hasLabel={!!label}>
          {isChecked && <Icon name="tick" />}
        </Styled.CheckBox>
        {label}
      </Styled.Label>
      {errorMessage && <Error message={errorMessage} />}
    </>
  )
}

Checkbox.defaultProps = {
  isChecked: false,
  defaultChecked: false,
  disabled: false,
  errorMessage: '',
  label: '',
  name: '',
  onChangeCallback: undefined
}

export default Checkbox
