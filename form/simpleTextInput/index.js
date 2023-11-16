import React from 'react'
import { useUID } from '../../../helpers/hooks'
import Error from '../../error'
import * as Styled from './style'

const SimpleInput = ({ id, label, register, required, error }) => {
  const inputId = () => useUID('text-input-') + id
  console.log(error)
  return (
    <>
      <Styled.Label htmlFor={inputId()}>{label}</Styled.Label>
      <Styled.Input
        name={inputId()}
        error={error}
        // TODO: Add internationalized error messages
        {...register(id, { required: { value: required, message: 'This field is required.' } })}
      />
      {error && <Error message={error.message} />}
    </>
  )
}

export default SimpleInput
