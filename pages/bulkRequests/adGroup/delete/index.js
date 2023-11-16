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
import * as groupApi from '../../../../api/groupManagement'
import * as assetsApi from '../../../../api/assetsManagement'
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

const BulkDeleteAdGroup = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [open, setOpen] = React.useState(false)
  const [array, setArray] = useState([])
  const [userProfile, setUserProfile] = useState({})
  const [errors, setErrors] = useState([])
  const [successMessage, setSuccessMessage] = useState('')
  const [successCounter, setSuccessCounter] = useState(0)
  const [adGroupArray, setadGroupArray] = useState([])
  const [errorEntries, setErrorEntries] = useState([])
  const [successButtonName, setSuccessButtonName] = useState('upload')
  const history = useHistory()
  const showBigLoader = useSelector(selectShowBigLoader)
  const maxlengthError = translate('create.bulkerrormessage')
  const norecordsError = translate('create.bulknorecords')
  const noDN = translate('delete.noGroupDN')
  const noDNAPI = translate('delete.noGroupDNAPI')
  const inValidGroupDN = translate('delete.inValidGroupDN')
  const noJustification = translate('delete.noJustification')
  const noMemberCheckMessage = translate('delete.bulkrequest.NoMemberCheck')
  const justificationError = translate('form.alphaNumericValidationMessage')
  const duplicateRecords = translate('modify.duplicateRecords')
  const noDomain = translate('delete.noDomain')
  const notUnique = translate('delete.notUnique')
  const formatError = translate('format.error')
  const errorAtLine = translate('delete.errorLine')
  const entriescontainserror = translate('comment.entriescontainserror')
  const of = translate('comment.of')
  const forBusinessJustification = translate('comment.forBusinessJustification')
  const invalidMissingHeaderName = translate('modify.invalidOrMissingColumn')
  const invalidGroupName = translate('delete.inValidGroupName')
  const inValidCsvHeader = translate('delete.wrongHeader')
  const maxLengthJustificationError = translate('delete.bulkrequest.maxLengthJustificationError')
  const successSuffix = translate('create.bulkrequest.addRemove.successSuffix')
  const groupSingle = translate('history.requestHistory.group')
  const groupMultiple = translate('navItem.label.myAssetGroups')
  const getNotificationMessage = useSelector(selectNotificationMessage)
  const [buttonReference, setButtonReference] = useState('')
  const [processRequest, setProcessRequest] = useState({ ongoingRequest: 0, totalRequest: 0 })
  const metaData = [
    { id: 'groupName', label: 'Group Name' },
    {
      id: 'domain',
      label: 'Domain'
    },
    { id: 'justification', label: 'Business Justification' }
  ]

  let processRequest1 = 0
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
    if (data.groupName.trim().length === 0) {
      validationStatus.error = true
      errorMessage.push(`${noDN} (${data.groupName})`)
    }
    if (data.domain.trim().length === 0) {
      validationStatus.error = true
      errorMessage.push(`${noDomain} (${data.domain})`)
    }
    if (data.justification.trim().length === 0) {
      validationStatus.error = true
      errorMessage.push(`${noJustification} (${data.justification})`)
    }
    if (data.justification.trim().length > 500) {
      validationStatus.error = true
      errorMessage.push(`${maxLengthJustificationError} (${data.justification})`)
    }
    if (data.justification.trim() && !/^[a-zA-Z0-9_\-\\.@ ]*$/.test(data?.justification)) {
      validationStatus.error = true
      errorMessage.push(
        `${justificationError} ${forBusinessJustification} (${data?.justification})`
      )
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
        errorMessages.push(`${errorAtLine}   ${index + 1} : ${duplicateRecords}`)
      } else {
        const status = requiredValidation(item)
        if (status.error) {
          errorMessages.push(`${errorAtLine}  ${index + 1} : ${status.errorMessage}`)
        }
      }
      dispatch(updateShowBigLoader(false))
    })

    if (errorMessages.length) {
      setErrors(errorMessages)
      dispatch(
        updateReviewNotificationMessage({
          type: 'Error',
          message: `${errorMessages.length} ${of} ${data.length} ${entriescontainserror}.`
        })
      )
    } else {
      setOpen(true)
    }
  }

  const csvFileToArray = (string) => {
    const csvString = string.trim()
    const headerInput =
      csvString.split(',').length > 3
        ? csvString.slice(0, csvString.indexOf('\n')).trim().split(',')
        : csvString.trim().split(',')
    const csvHeaderInput = headerInput
      .map((value) => value.replace(/(\r\n|\n|\r)/gm, ''))
      .filter((value) => value.trim() !== '')
    const csvHeader = []
    const invalidMissingColumnArray = []
    const validationErrorMessages = []

    csvHeaderInput.forEach((item, index) => {
      const filterData = metaData.filter((data) => data.label === item)
      if (filterData.length > 0) {
        csvHeader[index] = filterData[0].id
      }
    })

    if (csvHeaderInput.length > metaData.length) {
      csvHeaderInput.forEach((value, index) => {
        if (index + 1 > metaData.length) {
          invalidMissingColumnArray.push(value)
        }
      })
    }

    metaData.forEach((value) => {
      if (!csvHeader.includes(value.id)) {
        invalidMissingColumnArray.push(value.label)
      }
    })

    if (invalidMissingColumnArray.length > 0) {
      validationErrorMessages.push(
        `${invalidMissingHeaderName} : ${invalidMissingColumnArray.join(', ')}. ${inValidCsvHeader}`
      )

      setErrors(validationErrorMessages)
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
        const errorMessage = `No ${headerInput.join(' available (), No ')} available ()`
        setErrors((prevState) => [...prevState, `${errorAtLine} 1: ${errorMessage}`])
      } else {
        validateFileDetails(newArray)
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

    a.setAttribute('download', error ? `errors_${date}` : 'deleteAdGroup.csv') //  // Setting the anchor tag attribute for downloading, and passing the download file name

    a.click() // Performing a download with click
  }

  const downloadMyGroups = (data) => {
    const blob = new Blob([data], { type: 'text/csv' }) // Creating a Blob for having a csv file format and passing the data with type

    const url = window.URL.createObjectURL(blob) // Creating an object for downloading url

    const a = document.createElement('a') // Creating an anchor(a) tag of HTML

    a.setAttribute('href', url) // Passing the blob downloading url

    a.setAttribute('download', 'GroupsIOwned.csv') // Setting the anchor tag attribute for downloading, and passing the download file name

    a.click() // Performing a download with click
  }

  const getHeader = (headers, isGroupCSV = false) => {
    const headerData = isGroupCSV
      ? {
          groupName: 'Group Name',
          domain: 'Domain'
        }
      : {
          groupName: 'Group Name',
          domain: 'Domain',
          justification: 'Business Justification'
        }
    const newData = headers.map((data) => headerData[data])
    return newData
  }
  const csvmaker = (data, isGroupCSV = false) => {
    const csvRows = [] // Empty array for storing the values
    const headers = Object.keys(isGroupCSV ? data[0] : data) // setting headers
    const header = isGroupCSV ? getHeader(headers, true) : getHeader(headers)
    csvRows.push(header.join(',')) // headers sperated by comma(',')
    if (isGroupCSV) {
      data?.forEach((itm) => {
        csvRows.push(`${itm.groupName},${itm.domain}`)
      })
      return csvRows.join('\n')
    }
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
    const csvdata = csverrormaker(errorEntries)
    download(csvdata, true)
  }

  const downloadCSV = async () => {
    // Headers For CSV file
    const data = {
      groupName: 'Group Name',
      domain: 'Domain',
      justification: 'Here you can add business justification'
    }
    const csvdata = csvmaker(data)
    download(csvdata)
  }

  const downloadMyGroupsCSV = async () => {
    // API call to fetch all Groups I Own
    const payload = {
      pageSize: 10000,
      pageNumber: 0
    }
    const result = await assetsApi.getGroupRequests(payload, '')
    const data = []
    /* eslint no-underscore-dangle: 0 */
    result?.groupData?.forEach((group) => {
      const groupObject = {}
      groupObject.groupName = group?.groupDetails?._source?.igaContent?.cn
        ? group?.groupDetails?._source?.igaContent?.cn
        : ''
      groupObject.domain = group?.groupDetails?._source?.igaContent?.distinguishedName
        ? group?.groupDetails?._source?.igaContent?.distinguishedName
            .split(',')
            .slice(-4)[0]
            ?.split('=')[1]
        : ''
      data.push(groupObject)
    })
    const csvdata = csvmaker(data, true)
    downloadMyGroups(csvdata)
  }

  const callSubmitGroup = (result, payload, index) => {
    dispatch(updateShowBigLoader(true))
    if (result.status === 200) {
      groupApi
        .deleteAdGroup(payload)
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
              `${errorAtLine}  ${index + 1} : ${res?.response?.data?.message}`
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
        `${errorAtLine}  ${index + 1} : ${result?.response?.data?.message}`
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
    const adGroupDetails = []
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
        const groupDetailsObject = {}
        groupDetailsObject.cn = singleArray.groupName
        groupDetailsObject.displayName = singleArray.groupName

        adGroupDetails.push({
          common: {
            groupName: singleArray.groupName,
            applicationName: `${applicationNamePrefix}${singleArray.domain}`,
            operation: 'Delete',
            category: 'AD Group',
            requestorMail: userProfile.email,
            requestJustification: singleArray.justification || 'Request to delete the group',
            groupDN: '',
            AccessioBulkRequestNumber: payload.targetFilter.operand.targetValue,
            Accessio_Request_No: '',
            groupDetails: groupDetailsObject
          },
          domain: singleArray.domain
        })
      })
      setadGroupArray(adGroupDetails)
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
      (errors.length && processRequest.ongoingRequest === adGroupArray.length) ||
      (successCounter > 0 && processRequest.ongoingRequest === adGroupArray.length)
    ) {
      dispatch(updateShowBigLoader(false))
    }
  }, [errors, processRequest, successCounter])

  useEffect(() => {
    const validateAdGroup = async (payload, adGroup, index) => {
      const validationStatus = { error: false, errorMessage: '' }

      const listofErrors = []
      clearFilters()
      const result = await axios({
        url: '/v0/group/delete/bulkValidation',
        data: payload,
        method: 'post'
      })
        .then((res) => res)
        .catch((err) => {
          console.error(err)
          return null
        })
      if (Object.keys(result).length === 0) {
        listofErrors.push(`${noDNAPI}`)
      } else if (result.data.RequestUniqueness !== 'Valid') {
        listofErrors.push(`${notUnique}`)
      } else if (result.data.AccessioGroupName !== 'Valid') {
        listofErrors.push(`${invalidGroupName}`)
      } else if (
        !result.data.GroupDN ||
        result.data.GroupDN.includes('Error') ||
        result.data.GroupDN.includes('Invalid') ||
        [null, 'null', 'NULL', '', undefined].includes(
          result.data.GroupDN.substring(1, result.data.GroupDN.length - 1)
        )
      ) {
        listofErrors.push(
          `${inValidGroupDN} of GroupName(${adGroup.common.groupName}) and domain(${adGroup.domain})`
        )
      } else if (result.data.NoMemberCheck !== 'Valid') {
        listofErrors.push(`${noMemberCheckMessage}`)
      }

      if (listofErrors.length) {
        validationStatus.errorMessage = listofErrors.join(', ')
        validationStatus.error = true
        setErrors((prevState) => [
          ...prevState,
          `${errorAtLine} ${index + 1} : ${validationStatus.errorMessage}`
        ])
        setErrorEntries((prevState) => [...prevState, array[index]])
      }
      processRequest1 += 1
      setProcessRequest({
        totalRequest: adGroupArray.length,
        ongoingRequest: processRequest1
      })
      if (listofErrors.length === 0) {
        const updateadGroup = adGroup
        updateadGroup.common.groupDN = result.data.GroupDN
          ? result.data.GroupDN.substring(1, result.data.GroupDN.length - 1)
          : ''
        delete updateadGroup.common.groupName
        delete updateadGroup.domain
        callSubmitGroup(result, updateadGroup, index)
      }

      if (processRequest1 === adGroupArray.length) {
        dispatch(updateShowBigLoader(false))
        setProcessRequest({
          totalRequest: 0,
          ongoingRequest: 0
        })
      }
    }

    adGroupArray.forEach((adGroup, index) => {
      dispatch(updateShowBigLoader(true))
      const validationPayload = {
        Recipient: adGroup.common.requestorMail,
        Group_Name: adGroup.common.groupName
      }
      validateAdGroup(validationPayload, adGroup, index)
    })
  }, [adGroupArray])

  useEffect(() => {
    if (successCounter > 0) {
      dispatch(
        updateReviewNotificationMessage({
          type: 'Success',
          message: `${successCounter} ${
            successCounter === 1 ? `${groupSingle}` : `${groupMultiple}`
          } ${successSuffix}`
        })
      )
      setSuccessMessage(
        `${successCounter} ${
          successCounter === 1 ? `${groupSingle}` : `${groupMultiple}`
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
    dispatch(updateShowBigLoader(false))
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
            {translate('delete.bulkrequest.adGroup.title')}
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
            <Button
              onClick={() => downloadMyGroupsCSV()}
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
              {translate('delete.downloadMyGroupCsv')}
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
            disabled={!selectedFile || errors.length > 0}
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

export default BulkDeleteAdGroup
