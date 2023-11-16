import React, { useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SearchBox from '../../../../components/searchBox'
import * as Styled from '../Forward/style'
import Button from '../../../../components/button'
import RadioButtons from '../../../../components/radioButtons'
import {
  selectReviewItems,
  selectSelectedReviewItems
} from '../../../../redux/review/review.selector'
import { storeReviewActionItems } from '../../../../redux/review/reassign/reviewAction.action'
import { updateReviewNotificationMessage } from '../../../../redux/review/review.action'
import * as usersAPI from '../../../../api/users'
import Error from '../../../../components/error'

const ReviewReassign = ({ closeModal }) => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [error, setError] = useState({ isError: false, errMessage: '' })
  const dispatch = useDispatch()
  const reviewItems = useSelector(selectReviewItems)

  // Get selected review items
  const selectedReviewItems = useSelector(selectSelectedReviewItems)

  const [updatedReviewItems, setUpdatedReviewItems] = useState([])
  const seletedItems = updatedReviewItems.filter((e) => e.checked === true)

  useEffect(() => {
    if (selectedReviewItems?.length !== 0) {
      const updatedItems = reviewItems.map((reviewItem) => {
        // Checking if we have already selected item
        const checkedItem = selectedReviewItems.find(
          (selectedReviewItem) => selectedReviewItem.id === reviewItem.id
        )
        return checkedItem ? { ...reviewItem, checked: true } : reviewItem
      })
      setUpdatedReviewItems([...updatedItems])
    } else {
      setUpdatedReviewItems([...reviewItems])
    }
  }, [reviewItems])

  // debounce calls every 500 seconds
  const debounce = (func) => {
    let timer
    return (...args) => {
      const context = this
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        func.apply(context, args)
      }, 500)
    }
  }
  const handleSearch = (value) => {
    if (value.length > 3) {
      setError({ isError: false, errMessage: '' })
      usersAPI
        .searchUsers(value)
        .then((res) => {
          if (res.length > 0) {
            setUsers(res)
            setError({ isError: false, errMessage: '' })
          } else {
            setUsers([])
            setError({ isError: true, errMessage: 'No users found' })
          }
        })
        .catch((err) => {
          console.error(err)
          setUsers([])
        })
    } else {
      setUsers([])
      setError({ isError: true, errMessage: 'Enter more than 3 characters' })
    }
  }

  const clearSearch = () => {
    setUsers([])
    setError({ isError: false, errMessage: 'No user selected' })
  }

  const handleUser = (userId) => {
    const selectedUsers = users.filter((user) => user.id === userId)
    setSelectedUser(selectedUsers)
  }

  // useCallback provides us the memoized function
  const callDebounce = useCallback(debounce(handleSearch))
  // const userDetails = users.map((user) => <RadioButtons options={users} />)

  const handleReassign = () => {
    if (selectedUser) {
      const selectedIds = seletedItems.map((item) => item.id)
      const payload = {
        reviewIds: selectedIds,
        emailId: selectedUser[0].emailId,
        name: selectedUser[0].name,
        action: 'Reassign'
      }
      dispatch(storeReviewActionItems(payload))
      dispatch(
        updateReviewNotificationMessage({
          type: 'info',
          message: `You have selected to Reassign ${
            payload.reviewIds.length === 0 ? 1 : payload.reviewIds.length
          } items for  ${payload.name}`,
          action: 'confirm'
        })
      )
      closeModal(false)
    } else if (users.length === 0) {
      setError({ isError: true, errMessage: 'Search users' })
    } else {
      setError({ isError: true, errMessage: 'No user selected' })
    }
  }

  return (
    <div>
      {seletedItems.length > 0 && (
        <>
          <h2>Reassign</h2>
          <Styled.ListWrapper>
            <ul>
              {seletedItems.map((item) => (
                <li key={item.id}>Account name:{item.accountName}</li>
              ))}
            </ul>
          </Styled.ListWrapper>
        </>
      )}
      <Styled.LabelWrapper>Choose user</Styled.LabelWrapper>

      <p>Enter the employees name that you are reassigning access to</p>

      <SearchBox
        onSearchCallback={callDebounce}
        onClearCallback={clearSearch}
        placeholder="Search user"
      />
      {error.isError === true && <Error message={error.errMessage} />}
      {users.length > 0 && <p>Select an employee from the list below</p>}
      <Styled.RadiobuttonsWrapper>
        <RadioButtons options={users} onSelectCallback={handleUser} />
        {/* {userDetails} */}
      </Styled.RadiobuttonsWrapper>

      <Styled.ForwardButtonWrapper>
        <Button text="Reassign" onClickCallback={handleReassign} primary />
      </Styled.ForwardButtonWrapper>
    </div>
  )
}

export default ReviewReassign
