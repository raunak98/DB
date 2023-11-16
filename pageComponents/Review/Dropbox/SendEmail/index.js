/* eslint-disable */
import React, { useState, useCallback } from 'react'
import TextInput from 'components/textInput'
import { useDispatch, useSelector } from 'react-redux'
// import { useForm } from 'react-hook-form'
import Button from '@mui/material/Button'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import * as Styled from './style'
import {
  selectReviewItems,
  selectSelectedReviewItems
} from '../../../../redux/review/review.selector'
import {
  updateReviewItemsStart,
  updateReviewNotificationMessage
} from '../../../../redux/review/review.action'
import * as reviewApi from '../../../../api/review'
import SelectUsers from '../../SelectUsers'
import SimpleInput from '../../../../components/form/simpleTextInput'
import SimpleTextArea from '../../../../components/form/simpleTextArea'
import SimpleSubmitButton from '../../../../components/form/simpleSubmitButton'
import * as usersAPI from '../../../../api/users'
import useTheme from '../../../../hooks/useTheme'

const ReviewSendEmail = ({ closeModal }) => {
  // const {
  //   register,
  //   handleSubmit,
  //   setError,
  //   clearErrors,
  //   formState: { errors }
  // } = useForm({
  //   defaultValues: {
  //     subject: '',
  //     body: ''
  //   }
  // })

  const [payload, setPayload] = useState({
    to: [],
    cc: []
  })
  const reviewItems = useSelector(selectReviewItems)

  // Get selected review items
  const selectedReviewItems = useSelector(selectSelectedReviewItems)

  const [updatedReviewItems, setUpdatedReviewItems] = useState([])
  const dispatch = useDispatch()
  const [users, setUsers] = useState([])
  const [subject, setSubject] = useState('')
  const [emailText, setEmailText] = useState('')
  const { theme } = useTheme()

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

  // const handleUsersTo = (users) => {
  //   setPayload({ ...payload, to: users })
  // }

  // const handleUsersCc = (users) => {
  //   setPayload({ ...payload, cc: users })
  // }

  const handleAction = (data) => {
    reviewApi
      .takeAction('sendEmail', { ...payload, ...data })
      .then(() => {
        const reviews = updatedReviewItems.map((e) => {
          if (e.checked === true) {
            e.action = null
            e.checked = false
          }
          return e
        })
        dispatch(updateReviewItemsStart([...reviews]))
        dispatch(
          updateReviewNotificationMessage({
            type: 'success',
            message: 'email.success'
          })
        )
      })
      // eslint-disable-next-line no-unused-vars
      .catch((_) => {
        dispatch(
          updateReviewNotificationMessage({
            type: 'error',
            message: 'email.error'
          })
        )
      })
    closeModal(false)
  }
  const handleSearch = (value) => {
    if (value.length > 3) {
      // setError({ isError: false, errMessage: '' })
      usersAPI
        .searchUsers(value)
        .then((res) => {
          if (res?.length > 0) {
            setUsers(res)
            // setError({ isError: false, errMessage: '' })
          } else {
            setUsers([])
            // setError()
          }
        })
        .catch((err) => {
          console.error(err)
          setUsers([])
        })
    } else {
      setUsers([])
      // setError()
    }
  }

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
  const callDebounce = useCallback(debounce(handleSearch))
  return (
    <form>
      <h3
        style={{
          fontWeight: 'normal',
          fontSize: '31px',
          color: `${theme === 'dark' ? '#ffffff' : '#000000'}`
        }}
      >
        Email To be sent
      </h3>
      {/* We need to add account name later from API */}
      {/* <Styled.LabelWrapper>Account Name </Styled.LabelWrapper> */}
      <Autocomplete
        disablePortal
        multiple
        id="tags-outlined"
        options={users}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.mail)}
        filterSelectedOptions
        clearOnBlur={false}
        noOptionsText={null}
        renderInput={(params) => <TextField {...params} label="To" placeholder="To:" />}
        onInputChange={(event, newInputValue) => {
          if (newInputValue !== '') {
            callDebounce(newInputValue)
          }
        }}
        renderOption={(props, option) => (
          <Box
            {...props}
            sx={{
              background: `${theme === 'dark' ? 'tranfparent' : '#FFFFFF'}`,
              boxShadow: '1px -1px 1px #E7E7E7'
            }}
          >
            {option.mail}
          </Box>
        )}
      />
      <Autocomplete
        disablePortal
        multiple
        id="tags-outlined"
        options={users}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.mail)}
        filterSelectedOptions
        clearOnBlur={false}
        noOptionsText={null}
        renderInput={(params) => <TextField {...params} label="CC" placeholder="CC:" />}
        onInputChange={(event, newInputValue) => {
          if (newInputValue !== '') {
            callDebounce(newInputValue)
          }
        }}
        renderOption={(props, option) => (
          <Box
            {...props}
            sx={{
              background: `${theme === 'dark' ? 'tranfparent' : '#FFFFFF'}`,
              boxShadow: '1px -1px 1px #E7E7E7'
            }}
          >
            {option.mail}
          </Box>
        )}
        sx={{ marginTop: 10 }}
      />

      <TextField
        id="outlined-basic"
        label="Subject"
        variant="outlined"
        sx={{ width: '100%', marginTop: 10 }}
        value={subject}
        onChange={(event) => setSubject(event.target.value)}
      />
      <TextField
        id="outlined-multiline-static"
        label="Email Text"
        multiline
        rows={4}
        sx={{ marginTop: 10, width: '100%' }}
        value={emailText}
        onChange={(event) => setEmailText(event.target.value)}
      />

      <Styled.ForwardButtonWrapper>
        <Button
          variant="outlined"
          sx={{ color: `${theme === 'dark' ? '#ffffff' : '#000000'}`, borderColor: '#000000' }}
          onClick={handleAction}
          disabled={!(subject !== '' && emailText !== '' && users.length > 0)}
        >
          Send
        </Button>
        <Button
          onClick={() => closeModal(false)}
          sx={{ marginRight: '8px', color: `${theme === 'dark' ? '#ffffff' : '#000000'}` }}
        >
          Cancel
        </Button>
      </Styled.ForwardButtonWrapper>
    </form>
  )
}

export default ReviewSendEmail
