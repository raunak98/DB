import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from 'components/icon'
import * as Styled from './style'
import colors from '../../../styles/colors'

const Search = ({
  placeholder,
  clearText,
  large,
  onSearchCallback,
  onClearCallback,
  users,
  removeUser,
  value,
  setValue
}) => {
  // updates ui to show search box active/not-active state
  const onSearch = (event) => {
    setValue(event.currentTarget.value)
    if (onSearchCallback instanceof Function) {
      onSearchCallback(event.currentTarget.value)
    }
  }

  const onClear = () => {
    setValue('')
    if (onClearCallback instanceof Function) {
      onClearCallback()
    }
  }

  return (
    <Styled.Wrapper data-testid="search-box" active={!!value} large={large}>
      <Styled.SearchIcon data-testid="search-icon">
        <Icon name="search" size="xsmall" />
      </Styled.SearchIcon>
      <Styled.Users>
        {users.map((e) => (
          <Styled.User>
            <Styled.Name>`${e.name}`</Styled.Name>
            <FontAwesomeIcon
              icon="xmark"
              color={colors.primary}
              style={{ alignSelf: 'center' }}
              onClick={() => removeUser(e)}
            />
          </Styled.User>
        ))}
      </Styled.Users>
      <Styled.SearchInput
        onChange={onSearch}
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        type="text"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        maxLength="1024"
      />
      {!!value && (
        <Styled.ClearIcon type="button" onClick={onClear} aria-label={clearText} large={large}>
          <Icon name="cross" size="tiny" />
        </Styled.ClearIcon>
      )}
    </Styled.Wrapper>
  )
}

Search.defaultProps = {
  placeholder: '',
  clearText: '',
  large: false,
  onSearchCallback: undefined,
  onClearCallback: undefined
}

export default Search
