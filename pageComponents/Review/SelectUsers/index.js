import React, { useEffect, useState } from 'react'
import { debounce } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Styled from './styled'
import Button from '../../../components/button'
import Search from '../Search'
import colors from '../../../styles/colors'
import Error from '../../../components/error'
import * as usersAPI from '../../../api/users'

const SelectUsers = ({ id, getUsers, error, setError, clearErrors }) => {
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [value, setValue] = useState('')

  useEffect(() => {
    if (setError && selectedUsers.length <= 0) {
      setError(id, {
        type: 'manual',
        message: 'This field is required'
      })
    } else if (clearErrors && selectedUsers.length > 0) {
      clearErrors(id)
    }
  }, [selectedUsers.length])

  const handleSelectedUsers = (e) => {
    if (!selectedUsers.includes(e)) {
      setSelectedUsers([...selectedUsers, e])
      getUsers([...selectedUsers, e])
    }
    setUsers([])
    setValue('')
  }

  const handleRemovedUser = (removedUser) => {
    const updatedSelectedUsers = selectedUsers.filter((e) => removedUser.id !== e.id)
    setSelectedUsers(updatedSelectedUsers)
  }

  const handleSearch = (word) => {
    if (word.length >= 3) {
      // call api
      usersAPI
        .searchUsers(value)
        .then((res) => {
          setUsers(res)
        })
        .catch((err) => {
          console.error(err)
        })
    } else {
      setUsers([])
    }
  }

  return (
    <div>
      <Search
        value={value}
        setValue={setValue}
        onSearchCallback={debounce(handleSearch, 1000)}
        users={selectedUsers}
        removeUser={handleRemovedUser}
        placeholder="Email recipient"
      />
      <Styled.Options hidden={value.length < 3}>
        {!!users &&
          users.map((e) => (
            <Styled.Option key={e.id}>
              <Styled.OptionText>{`${e.name} - ${e.emailId}`}</Styled.OptionText>
              <Button
                primary={selectedUsers.includes(e)}
                size="tiny"
                text="Select"
                onClickCallback={() => handleSelectedUsers(e)}
              />
            </Styled.Option>
          ))}
        {!!users && users.length === 0 && (
          <Styled.Message>
            <FontAwesomeIcon size="1x" icon="exclamation-triangle" color={colors.primary} />
            <span> No user found</span>
          </Styled.Message>
        )}
      </Styled.Options>
      {error && <Error message={error.message} />}
    </div>
  )
}

export default SelectUsers
