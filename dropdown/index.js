import React, { useState } from 'react'
import Select from 'react-select'
import { useUID } from 'helpers/hooks'
import Icon from 'components/icon'
import Info from 'components/info'
import Error from 'components/error'
import * as Styled from './style'

const Dropdown = ({
  disabled,
  errorMessage,
  info,
  initialOption,
  label,
  placeholder,
  onChangeCallback,
  options
}) => {
  const id = useUID('dropdown-')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(initialOption)

  const onMenuOpen = () => setIsMenuOpen(true)
  const onMenuClose = () => setIsMenuOpen(false)

  const onChange = (option) => {
    setSelectedOption(option.value)
    if (onChangeCallback instanceof Function) {
      onChangeCallback(option.value)
    }
  }

  return (
    <Styled.Wrapper>
      <Styled.InnerWrapper>
        <Styled.SelectWrapper disabled={disabled} error={!!errorMessage}>
          {label && selectedOption && (
            <Styled.Label htmlFor={id} error={!!errorMessage}>
              {label}
            </Styled.Label>
          )}
          <Select
            id={id}
            classNamePrefix="select"
            isClearable={false}
            isDisabled={disabled}
            isSearchable={false}
            options={options}
            placeholder={placeholder}
            defaultValue={initialOption}
            onChange={onChange}
            onMenuOpen={onMenuOpen}
            onMenuClose={onMenuClose}
          />
          <Icon name={isMenuOpen ? 'chevronUp' : 'chevronDown'} size="small" />
        </Styled.SelectWrapper>

        {info && <Info text={info} />}
      </Styled.InnerWrapper>
      {errorMessage && <Error message={errorMessage} />}
    </Styled.Wrapper>
  )
}

export default Dropdown
Dropdown.defaultProps = {
  disabled: false,
  errorMessage: '',
  info: '',
  initialOption: undefined,
  label: '',
  placeholder: '',
  onChangeCallback: undefined,
  options: []
}
