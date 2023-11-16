import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Button, Typography, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import Link from '@mui/material/Link'
import Breadcrumb from 'components/breadcrumb'
import translate from 'translations/translate'
import axios from '../../../../axios'
import {
  updateReviewNotificationMessage,
  updateShowBigLoader
} from '../../../../redux/review/review.action'
import {
  selectNotificationMessage,
  selectShowBigLoader
} from '../../../../redux/review/review.selector'
import useTheme from '../../../../hooks/useTheme'
import * as Styled from './style'
import Loading from '../../../../components/loading'
import * as accountApi from '../../../../api/accountManagement'
import * as profileAPI from '../../../../api/profile'
import { applicationNamePrefix } from '../../../../helpers/utils'
import { randomNumber } from '../../../../helpers/strings'

function Tag(props) {
  const { label, onClick, ...other } = props
  return (
    <div
      {...other}
      style={{
        background: 'transparent',
        borderWidth: 1.5,
        borderColor: '#a9a9a9',
        justifyContent: 'space-between'
      }}
    >
      <span>{label}</span>
      {label ? <CloseIcon onClick={() => onClick()} /> : ''}
    </div>
  )
}

Tag.propTypes = {
  label: PropTypes.string.isRequired
}
const StyledTag = styled(Tag)(
  ({ theme }) => `
  display: inline-flex;
  align-items: center;
  height: 34px;
  width:240px; 
  margin-top:10px;
  line-height: 22px;
  background-color: ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#fafafa'};
  border: 1px solid ${theme.palette.mode === 'dark' ? '#303030' : '#e8e8e8'};
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
    background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
    margin: 6px 5px 4px 6px
  }
`
)

const BulkDelete = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [open, setOpen] = React.useState(false)
  const [array, setArray] = useState([])
  const [userProfile, setUserProfile] = useState({})
  const [errors, setErrors] = useState([])
  const [successMessage, setSuccessMessage] = useState('')
  const [successCounter, setSuccessCounter] = useState(0)
  const [adAccountArray, setAdAccountArray] = useState([])
  const [errorEntries, setErrorEntries] = useState([])
  const [successButtonName, setSuccessButtonName] = useState('upload')
  const history = useHistory()
  const showBigLoader = useSelector(selectShowBigLoader)
  const inValidCsvHeader = translate('modify.invalidHeader')
  const maxlengthError = translate('create.bulkerrormessage')
  const duplicateRecords = translate('modify.duplicateRecords')
  const norecordsError = translate('create.bulknorecords')
  const noSamAcc = translate('delete.noSamAccount')
  const inValidSamAcc = translate('create.inValidSamAcc')
  const noJustification = translate('delete.noJustification')
  const maxLengthJustificationError = translate('delete.bulkrequest.maxLengthJustificationError')
  const justificationError = translate('form.alphaNumericValidationMessage')
  const notUnique = translate('delete.notUnique')
  const Erroratline = translate('comment.Erroratline')
  const formatError = translate('format.error')
  const invalidColumCount = translate('modify.invalidColumn')
  const successSuffix = translate('create.bulkrequest.addRemove.successSuffix')
  const accountSingle = translate('modify.ADAccount.account')
  const accountMultiple = translate('modify.ADAccount.accounts')
  const activeAccount = translate('delete.activeAccount')
  const cannotDelete = translate('delete.cannotDelete')
  const deleteErrorLine = translate('delete.errorLine')
  const containsError = translate('comment.entriescontainserror')
  const invalidMissingHeaderName = translate('modify.invalidOrMissingColumn')
  const getNotificationMessage = useSelector(selectNotificationMessage)
  const expectedHeaders = ['sAMAccountName', 'justification']
  const [processRequest, setProcessRequest] = useState({ ongoingRequest: 0, totalRequest: 0 })
  let processRequest1 = 0
  const [buttonReference, setButtonReference] = useState('')

  const dispatch = useDispatch()

  const { theme } = useTheme()
  const clearFilters = () => {
    setErrors([])
    setErrorEntries([])
    setSuccessMessage('')
  }

  const clearFile = () => {
    setSelectedFile('')
    clearFilters()
  }
  const movetoHistory = () => {
    history.push('/history/requestHistory')
  }

  const fileDetails = () => (
    <StyledTag label={selectedFile?.name ? selectedFile?.name : ''} onClick={() => clearFile()} />
  )
  const requiredValidation = (data) => {
    const validationStatus = { error: false, errorMessage: '' }
    const errorMessage = []
    if (data.sAMAccountName.trim().length === 0) {
      validationStatus.error = true
      errorMessage.push(`${noSamAcc} (${data.sAMAccountName})`)
    }
    if (data.justification.trim().length === 0) {
      validationStatus.error = true
      errorMessage.push(`${noJustification} (${data.justification})`)
    }
    if (data.justification.trim().length > 500) {
      validationStatus.error = true
      errorMessage.push(`${maxLengthJustificationError} (${data.justification})`)
    }
    if (!/^[a-zA-Z0-9_\-\\.@ ]*$/.test(data.justification)) {
      validationStatus.error = true
      errorMessage.push(`${justificationError} for Business Justification (${data?.justification})`)
    }
    validationStatus.errorMessage = errorMessage.join(', ')
    return validationStatus
  }
  const validateFileDetails = async (data) => {
    clearFilters()
    const errorMessages = []
    dispatch(updateShowBigLoader(true))
    data.forEach((item, index) => {
      if (item === 'duplicate') {
        errorMessages.push(`${deleteErrorLine}  ${index + 1} : ${duplicateRecords}`)
      } else {
        const status = requiredValidation(item)
        if (status.error) {
          errorMessages.push(`${deleteErrorLine}  ${index + 1} : ${status.errorMessage}`)
        }
      }
      dispatch(updateShowBigLoader(false))
    })

    if (errorMessages.length) {
      setErrors(errorMessages)
      dispatch(
        updateReviewNotificationMessage({
          type: 'Error',
          message: `${errorMessages.length} of ${data.length} ${containsError}`
        })
      )
    } else {
      setOpen(true)
    }
  }

  const prepareSamAccount = (data) => {
    const updatedArray = data
    validateFileDetails(updatedArray)
  }

  const csvFileToArray = (string) => {
    const csvString = string.trim()

    const csvHeaderInput =
      csvString.indexOf('\n') !== -1
        ? csvString.slice(0, csvString.indexOf('\n')).trim().split(',')
        : csvString.trim().split(',')

    const csvHeader = []
    const adDeleteAccountMeta = [
      {
        id: 'sAMAccountName',
        label: 'Account Name'
      },
      {
        id: 'justification',
        label: 'Business Justification'
      }
    ]
    csvHeaderInput.forEach((item, index) => {
      const filterData = adDeleteAccountMeta.filter((data) => data.label === item)
      if (filterData.length > 0) {
        csvHeader[index] = filterData[0].id
      }
    })
    const headerValidation = expectedHeaders.length === csvHeaderInput.length
    const missingHeaders = expectedHeaders.length > csvHeaderInput.length
    const errorArray = expectedHeaders.filter((value) => !csvHeader.includes(value))
    let errorArrayLabels = adDeleteAccountMeta.map((value) => {
      if (errorArray.includes(value.id)) {
        return value.label
      }
      return null
    })
    errorArrayLabels = errorArrayLabels.filter((value) => value !== null)

    if (errorArray.length > 0) {
      if (missingHeaders) {
        dispatch(
          updateReviewNotificationMessage({
            type: 'Error',
            message: `${invalidMissingHeaderName} : ${errorArrayLabels.join(',')}`
          })
        )
      } else {
        dispatch(
          updateReviewNotificationMessage({
            type: 'Error',
            message: inValidCsvHeader
          })
        )
      }
    } else if (!headerValidation) {
      dispatch(
        updateReviewNotificationMessage({
          type: 'Error',
          message: invalidColumCount
        })
      )
    } else {
      const csvRows = csvString.split('\n').splice(1)
      const refrenceArray = []
      const newArray = csvRows.map((i) => {
        if (refrenceArray.includes(i.replace('\r', ''))) {
          return 'duplicate'
        }
        refrenceArray.push(i.replace('\r', ''))
        const values = i.trim().split(',')

        const obj = csvHeader.reduce((object, header, index) => {
          const inputObj = object
          inputObj[header] = values[index]
          return inputObj
        }, {})
        return obj
      })

      setProcessRequest({
        totalRequest: newArray.length,
        ongoingRequest: 0
      })
      if (newArray.length > 100) {
        dispatch(
          updateReviewNotificationMessage({
            type: 'Error',
            message: maxlengthError
          })
        )
      } else if (!newArray.length) {
        dispatch(
          updateReviewNotificationMessage({
            type: 'Error',
            message: norecordsError
          })
        )
      } else {
        prepareSamAccount(newArray)
      }

      setArray(newArray)
    }
  }

  const onFileUpload = (e) => {
    setOpen(false)
    e.preventDefault()
    const fileReader = new FileReader()
    if (selectedFile) {
      fileReader.onload = (event) => {
        const csvOutput = event.target.result
        csvFileToArray(csvOutput)
      }

      fileReader.readAsText(selectedFile)
    }
  }

  const onFileChange = (event) => {
    if (event.target.files[0].type !== 'text/csv') {
      setErrors([formatError])
    } else {
      setSuccessButtonName('upload')
      setSelectedFile('')
      clearFilters()
      setSelectedFile(event.target.files[0])
    }
  }

  const getCurrentDate = () => {
    const padto2Digits = (num) => num.toString().padStart(2, '0')
    const date = new Date()
    const currentDate = `${padto2Digits(date.getDate())}${padto2Digits(date.getMonth() + 1)}${date
      .getFullYear()
      .toString()
      .substr(-2)}${padto2Digits(date.getHours())}${padto2Digits(date.getMinutes())}`
    return currentDate
  }

  const download = (data, error) => {
    const blob = new Blob([data], { type: 'text/csv' }) // Creating a Blob for having a csv file format and passing the data with type

    const url = window.URL.createObjectURL(blob) // Creating an object for downloading url

    const a = document.createElement('a') // Creating an anchor(a) tag of HTML

    a.setAttribute('href', url) // Passing the blob downloading url

    const date = getCurrentDate()

    a.setAttribute('download', error ? `errors_${date}` : 'deleteAdAccount.csv') //  // Setting the anchor tag attribute for downloading, and passing the download file name

    a.click() // Performing a download with click
  }
  const getHeader = (headers) => {
    const headerData = {
      sAMAccountName: 'Account Name',
      justification: 'Business Justification'
    }
    const newData = headers.map((data) => headerData[data])
    return newData
  }

  const csvmaker = (data) => {
    const csvRows = [] // Empty array for storing the values

    const headers = Object.keys(data) // setting headers
    const header = getHeader(headers)
    csvRows.push(header.join(',')) // headers sperated by comma(',')
    const values = Object.values(data).join(',')
    csvRows.push(values)
    return csvRows.join('\n') // // Returning the array joining with new line
  }

  const csverrormaker = (data) => {
    const csvRows = []
    const headers = Object.keys(data[0])
    csvRows.push(headers.join(','))
    data.forEach((errorData) => {
      const values = Object.values(errorData).join(',')
      csvRows.push(values)
    })
    return csvRows.join('\n')
  }

  const onErrorFileDownload = () => {
    const newArr = errorEntries.map(({ samAccount, ...rest }) => rest)
    const sortArray = newArr.sort((a, b) => a.slno - b.slno)

    const csvdata = csverrormaker(sortArray)
    download(csvdata, true)
  }

  const downloadCSV = async () => {
    // Headers For CSV file
    const data = {
      sAMAccountName: 'User account name',
      justification: 'Here you can add business justification'
    }
    const csvdata = csvmaker(data)
    download(csvdata)
  }

  const callSubmitAccount = (result, payload, index) => {
    dispatch(updateShowBigLoader(true))
    const updatedPayload = payload
    updatedPayload.common.accountName = ''
    updatedPayload.common.recepientMail = ''
    updatedPayload.common.accountType = ''
    if (result.status === 200) {
      accountApi
        .deleteAdAccount(updatedPayload)
        .then((res) => {
          if (res.status === 200) {
            setSuccessCounter((prevState) => prevState + 1)
          } else {
            dispatch(
              updateReviewNotificationMessage({
                type: 'Error',
                message: res?.response?.data?.message
              })
            )
            setErrorEntries((prevState) => [...prevState, array[index]])
            setErrors((prevState) => [
              ...prevState,
              `${deleteErrorLine}  ${index + 1} : ${res?.response?.data?.message}`
            ])
          }
          setSuccessButtonName('finish')
        })
        .catch((err) => {
          console.error('err', err)
          setSuccessButtonName('finish')
        })
    } else {
      setErrorEntries((prevState) => [...prevState, array[index]])
      setErrors((prevState) => [
        ...prevState,
        `${deleteErrorLine}  ${index + 1} : ${result?.response?.data?.message}`
      ])
      setSuccessButtonName('finish')
    }
  }
  const checkRequestUniqueness = async (payload) => {
    const response = await axios({
      url: '/v0/governance/checkRequest',
      data: payload,
      method: 'post'
    }).then((res) => res.data)
    return response
  }
  const confirmBulkAction = async () => {
    setOpen(false)
    const adAccountDetails = []
    setSuccessCounter(0)
    let unique = ''
    const uniqueNum = randomNumber()
    const charsToModify = uniqueNum.slice(-4).toUpperCase()
    unique = uniqueNum.slice(0, -4) + charsToModify
    let payload = {
      targetFilter: {
        operator: 'EQUALS',
        operand: {
          targetName: 'request.common.AccessioBulkRequestNumber',
          targetValue: unique
        }
      }
    }
    const result = await checkRequestUniqueness(payload)
    if (result.result?.length === 0) {
      array.forEach((singleArray) => {
        adAccountDetails.push({
          common: {
            applicationName: `${applicationNamePrefix}DBG`,
            operation: 'Delete',
            category: 'AD Account',
            requestorMail: userProfile.email,
            requestJustification: singleArray.justification || 'Request to delete the group',
            sAMAccountName: singleArray.sAMAccountName,
            accountDescription: `This request will delete record`,
            rFirstName: '',
            rLastName: '',
            AccessioBulkRequestNumber: payload.targetFilter.operand.targetValue,
            Accessio_Request_No: ''
          }
        })
      })
      setAdAccountArray(adAccountDetails)
    } else {
      let unique1 = ''
      const uniqueNum1 = randomNumber()
      const charsToModify1 = uniqueNum1.slice(-4).toUpperCase()
      unique1 = uniqueNum1.slice(0, -4) + charsToModify1
      payload = {
        targetFilter: {
          operator: 'EQUALS',
          operand: {
            targetName: 'request.common.AccessioBulkRequestNumber',
            targetValue: unique1
          }
        }
      }
      checkRequestUniqueness(payload)
    }
  }

  useEffect(() => {
    if (
      (errors.length && processRequest.ongoingRequest === adAccountArray.length) ||
      (successCounter > 0 && processRequest.ongoingRequest === adAccountArray.length)
    ) {
      dispatch(updateShowBigLoader(false))
    }
  }, [errors, processRequest, successCounter])

  useEffect(() => {
    const validateAdAccount = async (payload, adAccount, index) => {
      const validationStatus = { error: false, errorMessage: '' }

      const listofErrors = []
      clearFilters()
      dispatch(updateShowBigLoader(true))

      const result = await axios({
        url: '/v0/account/delete/bulkValidation',
        data: payload,
        method: 'post'
      })

      if (['Not Unique', 'Invalid'].includes(result.data.RequestUniqueness)) {
        listofErrors.push(`${notUnique}`)
      } else if (['Invalid', 'Error'].includes(result.data.sAMAccount)) {
        listofErrors.push(`${inValidSamAcc} (${payload?.sAMAccount})`)
      } else if (['512', '66048'].includes(result.data.userAccountControl)) {
        const errorMsg = `${activeAccount} ${payload?.sAMAccount} ${cannotDelete}`
        listofErrors.push(`${errorMsg}`)
      }

      if (listofErrors.length) {
        validationStatus.errorMessage = listofErrors.join(', ')
        validationStatus.error = true
        setErrors((prevState) => [
          ...prevState,
          `${Erroratline} ${index + 1} : ${validationStatus.errorMessage}`
        ])
        setErrorEntries((prevState) => [...prevState, array[index]])
      }
      processRequest1 += 1
      setProcessRequest({
        totalRequest: adAccountArray.length,
        ongoingRequest: processRequest1
      })
      if (listofErrors.length === 0) {
        callSubmitAccount(result, adAccount, index)
      }

      if (processRequest1 === adAccountArray.length) {
        dispatch(updateShowBigLoader(false))
        setProcessRequest({
          totalRequest: 0,
          ongoingRequest: 0
        })
      }
    }

    adAccountArray.forEach((adAccount, index) => {
      const validationPayload = {
        sAMAccount: `${adAccount.common.sAMAccountName}`,
        Req_unique: [
          {
            targetFilter: {
              operator: 'AND',
              operand: [
                {
                  operator: 'EQUALS',
                  operand: {
                    targetName: 'decision.status',
                    targetValue: 'in-progress'
                  }
                },
                {
                  operator: 'EQUALS',
                  operand: {
                    targetName: 'request.common.isDraft',
                    targetValue: false
                  }
                },
                {
                  operator: 'OR',
                  operand: [
                    {
                      operator: 'EQUALS',
                      operand: {
                        targetName: 'request.common.operation',
                        targetValue: 'Amend'
                      }
                    },
                    {
                      operator: 'EQUALS',
                      operand: {
                        targetName: 'request.common.operation',
                        targetValue: 'Delete'
                      }
                    }
                  ]
                },
                {
                  operator: 'EQUALS',
                  operand: {
                    targetName: 'request.common.category',
                    targetValue: 'AD Account'
                  }
                },
                {
                  operator: 'EQUALS',
                  operand: {
                    targetName: 'request.common.applicationName',
                    targetValue: `${applicationNamePrefix}DBG`
                  }
                },
                {
                  operator: 'OR',
                  operand: [
                    {
                      operator: 'EQUALS',
                      operand: {
                        targetName: 'request.common.accountDetails.sAMAccountName',
                        targetValue: adAccount.common.accountDetails?.sAMAccountName
                          ? adAccount.common.accountDetails.sAMAccountName
                          : ''
                      }
                    },
                    {
                      operator: 'EQUALS',
                      operand: {
                        targetName: 'request.common.sAMAccountName',
                        targetValue: adAccount.common.sAMAccountName
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
      validateAdAccount(validationPayload, adAccount, index)
    })
  }, [adAccountArray])

  useEffect(() => {
    if (successCounter > 0) {
      dispatch(
        updateReviewNotificationMessage({
          type: 'Success',
          message: `${successCounter} ${
            successCounter === 1 ? accountSingle : accountMultiple
          } ${successSuffix}`
        })
      )
      setSuccessMessage(
        `${successCounter} ${
          successCounter === 1 ? accountSingle : accountMultiple
        } ${successSuffix}`
      )
    }
  }, [successCounter])

  useEffect(() => {
    profileAPI
      .getUserInfo()
      .then((res) => {
        profileAPI.getUserProfileInfo(res?.id).then((res1) => {
          setUserProfile({ firstName: res1?.userName, lastName: res1?.sn, email: res1?.mail })
        })
      })
      .catch((err) => {
        console.error(err)
      })
    // accountApi.getAccountCategories().then((res) => {
    //   setAccountCategories(res)
    // })
  }, [])

  useEffect(() => {
    if (
      getNotificationMessage.message &&
      ['success', 'Success', 'info', 'Error', 'error'].includes(getNotificationMessage.type)
    ) {
      setTimeout(() => {
        // dispatch here
        dispatch(
          updateReviewNotificationMessage({
            type: '',
            message: '',
            action: ''
          })
        )
      }, 5000)
    }
  }, [getNotificationMessage])

  const handleCancel = () => {
    setOpen(true)
    setButtonReference('cancel')
  }
  const handleConfirm = () => {
    history.push('/dashboard')
  }

  return (
    <>
      {showBigLoader && <Loading processRequest={processRequest} />}
      <Styled.BackButtonLink to="/bulk-requests">
        <Styled.BackButton>← {translate('create.ADAccount.back')}</Styled.BackButton>
      </Styled.BackButtonLink>
      <Breadcrumb
        path={[
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          {
            label: translate('navItem.label.bulkRequests'),
            url: '/bulk-requests'
          },
          {
            label: translate('navItem.label.deleteBulkRequests'),
            url: ''
          }
        ]}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Styled.HeaderWrapper>
          <h1 style={{ fontWeight: 'normal', marginBottom: '10px' }}>
            {translate('delete.bulkrequest.title')}
          </h1>
        </Styled.HeaderWrapper>
      </div>

      <Styled.MainWrapper>
        <Box key="addcsv" p={5}>
          <h2>{translate('create.addCsv')}</h2>
          <p>{translate('create.bulkuploadmessage')}</p>
          <div>
            {fileDetails()}
            <Button
              variant="outlined"
              component="label"
              sx={{
                color: `${theme === 'dark' ? '#FFF' : '#000'}`,
                borderColor: `${theme === 'dark' ? '#FFF' : '#000'}`,
                borderRadius: '1px',
                padding: '5px 25px',
                marginLeft: '10px'
              }}
            >
              {translate('create.addCsv')}
              <input
                hidden
                accept=".csv"
                multiple
                type="file"
                onChange={(e) => onFileChange(e)}
                onClick={(event) => {
                  // eslint-disable-next-line no-param-reassign
                  event.target.value = null
                }}
              />
            </Button>

            <Button
              onClick={() => downloadCSV()}
              variant="outlined"
              component="label"
              sx={{
                color: `${theme === 'dark' ? '#FFF' : '#000'}`,
                borderColor: `${theme === 'dark' ? '#FFF' : '#000'}`,
                borderRadius: '1px',
                padding: '5px 25px',
                marginLeft: '10px'
              }}
            >
              {translate('create.downloadCsv')}
            </Button>
          </div>
        </Box>
        {successMessage && (
          <div style={{ padding: '10px 20px', color: '#008000' }}>{successMessage}</div>
        )}
        {errors.length > 0 ? (
          <div style={{ padding: '20px' }}>
            <Accordion disableGutters defaultExpanded p={5}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="`{sitem.heading}_summary`}"
                sx={{
                  backgroundColor: theme === 'dark' ? '#3C485A' : '#EFF9FC'
                }}
              >
                <Typography sx={{ fontSize: '16px' }}>
                  {translate('create.errors')} ({errors.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  backgroundColor: theme === 'dark' ? '#1A2129' : '#FFF',
                  padding: '10x 8px'
                }}
              >
                <p style={{ color: '#F00' }}>{translate('delete.errorHeader')}</p>
                <Grid container spacing={4}>
                  <ul>
                    {errors &&
                      errors.map((error) => (
                        <Grid
                          item
                          xs={12}
                          sx={{ display: 'flex', color: '#F00' }}
                          key={`${error}_container`}
                        >
                          <li> {error}</li>
                        </Grid>
                      ))}
                  </ul>
                </Grid>
                {errorEntries.length > 0 ? (
                  <p style={{ color: '#F00' }}>
                    {translate('delete.downloadErrorPrefix')} :{' '}
                    <Link to="/" onClick={() => onErrorFileDownload()}>
                      {translate('create.downloadErrorFile')}
                    </Link>
                  </p>
                ) : null}
              </AccordionDetails>
            </Accordion>
          </div>
        ) : (
          ''
        )}
      </Styled.MainWrapper>
      <Styled.ButtonWrapper>
        {successButtonName === 'finish' ? (
          <Button
            variant="outlined"
            disabled={!selectedFile}
            onClick={movetoHistory}
            sx={{
              color: `${theme === 'dark' ? '#FFF' : '#000'}`,
              borderColor: `${theme === 'dark' ? '#FFF' : '#000'}`,
              borderRadius: '1px',
              padding: '5px 25px'
            }}
          >
            {translate(`create.${successButtonName}`)}
          </Button>
        ) : (
          <Button
            onClick={(e) => onFileUpload(e)}
            variant="outlined"
            disabled={!selectedFile}
            sx={{
              color: `${theme === 'dark' ? '#FFF' : '#000'}`,
              borderColor: `${theme === 'dark' ? '#FFF' : '#000'}`,
              borderRadius: '1px',
              padding: '5px 25px'
            }}
          >
            {translate(`create.${successButtonName}`)}
          </Button>
        )}
        {successButtonName !== 'finish' && (
          <Button
            onClick={handleCancel}
            sx={{
              marginRight: '8px',
              color: `${theme === 'dark' ? '#FFF' : '#000'}`,
              padding: '5px 25px'
            }}
          >
            {translate('create.ADAccount.cancel')}
          </Button>
        )}
      </Styled.ButtonWrapper>

      <div>
        <Dialog
          open={open}
          PaperProps={{
            style: {
              backgroundColor: theme === 'dark' ? '#1A2129' : '#FFF',
              boxShadow: 'none'
            }
          }}
        >
          {buttonReference === 'cancel' ? (
            <DialogTitle id="alert-dialog-title">
              {translate('create.cancelbulkrequest')}
            </DialogTitle>
          ) : (
            <DialogTitle id="alert-dialog-title">
              {translate('create.uploadbulkrequest')}
            </DialogTitle>
          )}
          <DialogContent>
            {buttonReference === 'cancel' ? (
              <DialogContentText id="alert-dialog-description">
                {translate('create.ADGroup.confirmCancelationMsg')}
              </DialogContentText>
            ) : (
              <DialogContentText id="alert-dialog-description">
                {translate('create.bulksubheader')}
              </DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={() => {
                setOpen(false)
                setButtonReference('')
              }}
            >
              {translate('create.ADAccount.cancel')}
            </Button>
            {buttonReference === 'cancel' ? (
              <Button onClick={handleConfirm}>{translate('create.ADAccount.confirm')}</Button>
            ) : (
              <Button onClick={() => confirmBulkAction()}>
                {translate('create.ADAccount.confirm')}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}

export default BulkDelete
