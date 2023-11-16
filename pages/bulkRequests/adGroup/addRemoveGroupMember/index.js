import React, { useState, useEffect } from 'react'

import Box from '@mui/material/Box'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button, Typography, Grid } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import CloseIcon from '@mui/icons-material/Close'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { styled } from '@mui/material/styles'
import Link from '@mui/material/Link'
import Breadcrumb from 'components/breadcrumb'
import translate from 'translations/translate'
import { applicationNamePrefix } from 'helpers/utils'
import axios from '../../../../axios'
import * as profileAPI from '../../../../api/profile'
import * as accountApi from '../../../../api/accountManagement'

import {
  capitalizeFirstLetter,
  randomNumber,
  seperateWordsBasedOnCapitalLetters
} from '../../../../helpers/strings'
import useTheme from '../../../../hooks/useTheme'
import * as Styled from './style'
import Loading from '../../../../components/loading'
import {
  updateReviewNotificationMessage,
  updateShowBigLoader
} from '../../../../redux/review/review.action'
import {
  // selectNotificationMessage,
  selectShowBigLoader
} from '../../../../redux/review/review.selector'

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

const BulkAddRemoveGroupMember = () => {
  const [errors, setErrors] = useState([])
  const [successButtonName, setSuccessButtonName] = useState('upload')
  const [selectedFile, setSelectedFile] = useState(null)
  const [open, setOpen] = React.useState(false)
  const [buttonReference, setButtonReference] = useState('')
  const [array, setArray] = useState([])
  const [successMessage, setSuccessMessage] = useState('')
  const [successCounter, setSuccessCounter] = useState(0)
  const [groupArray, setGroupArray] = useState([])
  const [errorEntries, setErrorEntries] = useState([])
  const [userProfile, setUserProfile] = useState({})
  const [processRequest, setProcessRequest] = useState({ ongoingRequest: 0, totalRequest: 0 })

  const history = useHistory()

  const dispatch = useDispatch()
  const showBigLoader = useSelector(selectShowBigLoader)
  const formatError = translate('format.error')
  const missingColumns = translate('modify.missingColumns')
  const missingColumn = translate('modify.missingColumn')
  const maxlengthError = translate('create.bulkerrormessage')
  const norecordsError = translate('create.bulknorecords')
  const invalidHeaderNames = translate('modify.invalidHeaderNames')
  const invalidHeaderName = translate('modify.invalidHeaderName')
  const justificationError = translate('form.alphaNumericValidationMessage')
  const forBusinessJustification = translate('comment.forBusinessJustification')
  const of = translate('comment.of')

  const entriescontainserror = translate('comment.entriescontainserror')
  const Erroratline = translate('comment.Erroratline')
  const Errorheading = translate('comment.Errorheading')

  const noJustificationAvailable = translate('create.ADAccount.noJustification')
  const noAccountDomain = translate('create.bulkrequest.addRemove.noAccountDomain')
  const noAccountName = translate('create.bulkrequest.addRemove.noAccountName')
  const noAction = translate('create.bulkrequest.addRemove.noAction')
  const noGroupDomain = translate('create.bulkrequest.addRemove.noGroupDomain')
  const noGroupName = translate('create.bulkrequest.addRemove.noGroupName')
  const inValidAction = translate('create.bulkrequest.addRemove.inValidAction')

  const invalidRequestUniqueness = translate('create.bulkrequest.addRemove.unique.errormessage')
  const invalidAccount = translate('create.bulkrequest.addRemove.invalidAccountCheck')
  const invalidGroupCheck = translate('create.bulkrequest.addRemove.invalidGroupCheck')
  const invalidGroupDn = translate('create.bulkrequest.addRemove.invalidGroupDn')
  const invalidAccountDN = translate('create.bulkrequest.addRemove.invalidAccountDN')
  const invalidEMPRole = translate('create.bulkrequest.addRemove.invalidEMPRole')
  const invalidEMPRoleMembership = translate(
    'create.bulkrequest.addRemove.invalidEMPRoleMembership'
  )
  const invalidDomainTrust1 = translate('create.bulkrequest.addRemove.invalidDomainTrust1')
  const invalidDomainTrust2 = translate('create.bulkrequest.addRemove.invalidDomainTrust2')

  const addDomainTrustErrorMessageUniversal1 = translate(
    'addGroupMembership.addDomainTrustErrorMessageUniversal1'
  )
  const addDomainTrustErrorMessageUniversal2 = translate(
    'addGroupMembership.addDomainTrustErrorMessageUniversal2'
  )

  const addDomainTrustErrorMessageUniversal3 = translate(
    'addGroupMembership.addDomainTrustErrorMessageUniversal3'
  )

  const addDomainTrustErrorMessageGlobalError1 = translate(
    'addGroupMembership.addDomainTrustErrorMessageGlobalError1'
  )

  const addDomainTrustErrorMessageGlobalError2 = translate(
    'addGroupMembership.addDomainTrustErrorMessageGlobalError2'
  )

  const addDomainTrustErrorMessageGlobalError3 = translate(
    'addGroupMembership.addDomainTrustErrorMessageGlobalError3'
  )

  const inactiveUserErrorMessage = translate('groupMembership.inactiveUser') // Inactive Account Error message

  // ApplicationAccessMgt ADD
  const invalidAppAccessMgtAdd = translate('addGroupMembership.appManagementValidationMessage')

  // ApplicationAccessMgt REMOVE
  const invalidAppAccessMgtRemove = translate(
    'addGroupMembership.appManagementValidationMessageRemove'
  )
  const invaliddbAGComplianceStatus1 = translate(
    'create.bulkrequest.addRemove.invaliddbAGComplianceStatus1'
  )
  const invaliddbAGComplianceStatus2 = translate(
    'create.bulkrequest.addRemove.invaliddbAGComplianceStatus2'
  )

  const invaliddbAGComplianceStatus3 = translate(
    'create.bulkrequest.addRemove.invaliddbAGComplianceStatus3'
  )

  const invaliddbAGComplianceStatus4 = translate(
    'create.bulkrequest.addRemove.invaliddbAGComplianceStatus4'
  )

  const invaliddbAGComplianceStatus5 = translate(
    'create.bulkrequest.addRemove.invaliddbAGComplianceStatus5'
  )

  // dbagProvisionedBy ADD
  const invaliddbagprovisionedByMsgAdd1 = translate(
    'addGroupMembership.addProvisionValidationMessage1'
  )
  const invaliddbagprovisionedByMsgAdd2 = translate(
    'addGroupMembership.addProvisionValidationMessage2'
  )
  // dbagProvisionedBy REMOVE
  const invaliddbagprovisionedByMsgRemove1 = translate(
    'addGroupMembership.removalProvisionValidationMessage1'
  )
  const invaliddbagprovisionedByMsgRemove2 = translate(
    'addGroupMembership.removalProvisionValidationMessage2'
  )
  const invalidDisabledBydbAccessGateMsg1 = translate(
    'create.bulkrequest.addRemove.invalidDisabledBydbAccessGateMsg1'
  )
  const invalidDisabledBydbAccessGateMsg2 = translate(
    'create.bulkrequest.addRemove.invalidDisabledBydbAccessGateMsg2'
  )
  const invalidDisabledBydbAccessGateMsg3 = translate(
    'create.bulkrequest.addRemove.invalidDisabledBydbAccessGateMsg3'
  )
  const invalidMemberOfGroupForAdd = translate('create.bulkrequest.add.invalidMemberOfGroup')
  const invalidMemberOfGroup = translate('create.bulkrequest.Remove.invalidMemberOfGroup')

  const isActiveApprover1 = translate('addGroupMembership.isActiveApprover1')
  const isActiveApprover2 = translate('addGroupMembership.isActiveApprover2')

  const isActiveApprover3 = translate('addGroupMembership.isActiveApprover3')

  const isActiveApprover4 = translate('addGroupMembership.isActiveApprover4')

  const RemoveisActiveApprover1 = translate('addGroupMembership.RemoveisActiveApprover1')
  const RemoveisActiveApprover2 = translate('addGroupMembership.RemoveisActiveApprover2')

  const RemoveisActiveApprover3 = translate('addGroupMembership.RemoveisActiveApprover3')

  const RemoveisActiveApprover4 = translate('addGroupMembership.RemoveisActiveApprover4')
  const addNoApproverValidationMessage2 = translate(
    'addGroupMembership.addNoApproverValidationMessage2'
  )

  const addNoApproverValidationMessage3 = translate(
    'addGroupMembership.addNoApproverValidationMessage3'
  )

  const addNoApproverValidationMessage4 = translate(
    'addGroupMembership.addNoApproverValidationMessage4'
  )

  const addNoApproverValidationMessage1 = translate(
    'addGroupMembership.addNoApproverValidationMessage1'
  )

  const removalNoApproverValidationMessage1 = translate(
    'addGroupMembership.removalNoApproverValidationMessage1'
  )
  const removalNoApproverValidationMessage2 = translate(
    'addGroupMembership.removalNoApproverValidationMessage2'
  )
  const removalNoApproverValidationMessage3 = translate(
    'addGroupMembership.removalNoApproverValidationMessage3'
  )
  const removalNoApproverValidationMessage4 = translate(
    'addGroupMembership.removalNoApproverValidationMessage4'
  )

  const invalidgroup = translate('create.bulkrequest.addRemove.invalidgroup')
  const errorAtLine = translate('create.bulkrequest.addRemove.errorAtLine')
  const successSuffix = translate('create.bulkrequest.addRemove.successSuffix')

  let processRequest1 = 0

  const csvHeaderData = {
    GroupName: 'GroupName',
    GroupDomain: 'DBG',
    AccountName: 'AccountName',
    AccountDomain: 'DBG',
    Action: 'Join or Leave',
    BusinessJustification: 'Enter Justification'
  }
  const expectedHeaders = Object.keys(csvHeaderData).map((data) =>
    seperateWordsBasedOnCapitalLetters(data).trim()
  )

  const clearFilters = () => {
    setErrors([])
  }
  const clearFile = () => {
    setSelectedFile('')
    setSuccessButtonName('upload')
    clearFilters()
  }
  const { theme } = useTheme()
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
    if (successCounter > 0) {
      dispatch(
        updateReviewNotificationMessage({
          type: 'Success',
          message: `${successCounter} ${
            successCounter === 1 ? 'account' : 'accounts'
          } ${successSuffix}`
        })
      )
      setSuccessMessage(
        `${successCounter} ${successCounter === 1 ? 'account' : 'accounts'} ${successSuffix}`
      )
    }
  }, [successCounter])
  const fileDetails = () => (
    <StyledTag label={selectedFile?.name ? selectedFile?.name : ''} onClick={() => clearFile()} />
  )
  const requiredValidation = (data) => {
    const validationStatus = { error: false, errorMessage: '' }
    const errorMessage = []
    if (!/^[a-zA-Z0-9_\-\\.@ ]*$/.test(data?.BusinessJustification)) {
      validationStatus.error = true
      errorMessage.push(`${justificationError} ${forBusinessJustification}`)
    }
    if (data.AccountDomain.trim().length === 0) {
      validationStatus.error = true
      errorMessage.push(`${noAccountDomain}`)
    }
    if (data.AccountName.trim().length === 0) {
      validationStatus.error = true
      errorMessage.push(`${noAccountName}`)
    }
    if (data.Action.trim().length === 0) {
      validationStatus.error = true
      errorMessage.push(`${noAction}`)
    }
    if (data.GroupDomain.trim().length === 0) {
      validationStatus.error = true
      errorMessage.push(`${noGroupDomain}`)
    }
    if (data.GroupName.trim().length === 0) {
      validationStatus.error = true
      errorMessage.push(`${noGroupName}`)
    }
    if (data?.BusinessJustification.trim().length === 0) {
      validationStatus.error = true
      errorMessage.push(`${noJustificationAvailable}`)
    }
    if (
      data?.Action.trim().length !== 0 &&
      !['join', 'leave'].includes(data?.Action.toLowerCase()) // ALM 2193 - check casing and convert
    ) {
      validationStatus.error = true
      errorMessage.push(`${inValidAction}`)
    }
    validationStatus.errorMessage = errorMessage.join(', ')
    return validationStatus
  }
  const validateFileDetails = async (data) => {
    clearFilters()
    dispatch(updateShowBigLoader(true))
    const errorMessages = []
    data.forEach((item, index) => {
      const status = requiredValidation(item)
      if (status.error) {
        errorMessages.push(`${errorAtLine} ${index + 1} : ${status.errorMessage}`)
      }
      dispatch(updateShowBigLoader(false))
    })
    if (errorMessages.length) {
      setErrors(errorMessages)
      dispatch(
        updateReviewNotificationMessage({
          type: 'Error',
          message: `${errorMessages.length} ${of} ${data.length} ${entriescontainserror}`
        })
      )
    } else {
      setOpen(true)
    }
  }
  const csvFileToArray = (string) => {
    const csvString = string.trim()
    const headerInput = csvString.split('\n')[0].split(',')
    const csvHeaderInput = headerInput.map((value) => value.replace(/(\r\n|\n|\r)/gm, ''))
    const csvHeader = []
    csvHeaderInput.forEach((item, index) => {
      const filterData = expectedHeaders.filter((data) => data === item)
      if (filterData.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        csvHeader[index] = filterData[0]
      }
    })

    const headerValidation = expectedHeaders.length === csvHeader.filter((itm) => itm !== '').length
    const errorArray = expectedHeaders.filter((value) => !csvHeader.includes(value))
    // const headerValidation = true
    if (!headerValidation) {
      const errorMessage = `${
        errorArray.length > 1 ? missingColumns : missingColumn
      } : ${capitalizeFirstLetter(errorArray.join(','))}`
      setErrors([errorMessage])
    } else if (errorArray.length > 0) {
      dispatch(
        updateReviewNotificationMessage({
          type: 'Error',
          message: `${
            errorArray.length > 1 ? invalidHeaderNames : invalidHeaderName
          }  ${capitalizeFirstLetter(errorArray.join(','))}`
        })
      )
    } else {
      const csvRows = csvString.split('\n').splice(1)
      const newArray = csvRows.map((i) => {
        const values = i.trim().split(',')
        const obj = csvHeader.reduce((object, headerData, index) => {
          const inputObj = object
          const header = headerData.replace(' ', '')
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
        validateFileDetails(newArray)
      }
      setArray(newArray)
    }
  }
  const onFileUpload = (e) => {
    dispatch(updateShowBigLoader(false))
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
      clearFilters()
      setSelectedFile(event.target.files[0])
    }
    setErrorEntries([])
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

    a.setAttribute('download', error ? `errors_${date}` : 'GroupMembershipsBulkRequests.csv') //  // Setting the anchor tag attribute for downloading, and passing the download file name

    a.click() // Performing a download with click
  }
  const csvmaker = (data) => {
    const csvRows = [] // Empty array for storing the values

    const headers = Object.keys(csvHeaderData).map((item) =>
      seperateWordsBasedOnCapitalLetters(item).trim()
    )
    // setting headers
    // const header = getHeader(headers)
    const header = headers
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
    const newArr = errorEntries.map(({ ...rest }) => rest)
    const sortArray = newArr.sort((a, b) => a.slno - b.slno)

    const csvdata = csverrormaker(sortArray)
    download(csvdata, true)
  }
  const downloadCSV = async () => {
    // Headers For CSV file
    const mapping = expectedHeaders.reduce((a, v) => {
      const val = v.replace(' ', '')
      return { ...a, [v]: csvHeaderData[val] }
    }, {})
    const csvdata = csvmaker(mapping)
    download(csvdata)
  }
  const callSubmitAccount = (result, payload, index) => {
    dispatch(updateShowBigLoader(true))
    const updatedPayload = payload
    if (result.status === 200) {
      updatedPayload.common.groupDN = result?.data?.GroupDN.replace('[', '').replace(']', '')
      updatedPayload.common.accountDN = result?.data.AccountDN.replace('[', '').replace(']', '')
      updatedPayload.common.recepientMail =
        result?.data?.EmployeeMail && result?.data?.EmployeeMail !== 'N/A'
          ? result?.data?.EmployeeMail
          : ''
      accountApi
        .addMemberShip(updatedPayload)
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
  useEffect(() => {
    const validateGroupMembership = async (payload, group, index) => {
      const validationStatus = { error: false, errorMessage: '' }

      const listofErrors = []
      let result = ''
      clearFilters()
      dispatch(updateShowBigLoader(true))
      result = await axios({
        url:
          group?.common?.action?.toLowerCase() === 'join'
            ? '/v0/group/addMembers/bulkValidation'
            : '/v0/group/removeMembers/bulkValidation',
        data: payload,
        method: 'post'
      })
      if (result?.data?.Error === 'true') {
        const authContact = result?.data?.AuthContact
          ? result?.data?.AuthContact.replace('[', '').replace(']', '')
          : ''
        const authContactDelegate = result?.data?.AuthContactDelegate
          ? result?.data?.AuthContactDelegate.replace('[', '').replace(']', '')
          : ''
        // Add group bulk validation
        // TODO : Add Validation for inactive user in bulk Group Membership
        if (result?.data?.active === 'false' || result?.data?.temporary_inactive === 'true') {
          listofErrors.push(`${inactiveUserErrorMessage} (${payload?.sAMAccount}).`)
        }

        if (['Not Unique', 'Invalid'].includes(result?.data?.GroupCheck)) {
          listofErrors.push(`${invalidGroupCheck} ${payload?.GroupCN}`) // ALM2191
        }
        if (['Not Unique', 'Invalid'].includes(result?.data?.AccountCheck)) {
          listofErrors.push(`${invalidAccount} ${payload?.sAMAccount}`) // ALM2191
        }
        if (listofErrors.length === 0) {
          if (['Not Unique', 'Invalid'].includes(result?.data?.RequestUniqueness)) {
            listofErrors.push(`${invalidRequestUniqueness}`)
          }
          if (['Not Unique', 'Invalid'].includes(result?.data?.Account)) {
            listofErrors.push(`${invalidAccount}`)
          }

          if (['Not Unique', 'Invalid', ''].includes(result?.data?.GroupDN)) {
            listofErrors.push(`${invalidGroupDn}`)
          }

          if (['Not Unique', 'Invalid', ''].includes(result?.data?.AccountDN)) {
            listofErrors.push(`${invalidAccountDN}`)
          }
          if (['Error', 'Invalid'].includes(result?.data?.EMPRole)) {
            listofErrors.push(
              `${payload?.sAMAccount} ${invalidEMPRole} ${payload?.GroupCN} ${invalidEMPRoleMembership}`
            )
          }
          if (['Error', 'Invalid'].includes(result?.data?.DomainTrust)) {
            if (result?.data?.Scope === 'global') {
              listofErrors.push(
                `${addDomainTrustErrorMessageGlobalError1}  ${payload?.sAMAccount} ${addDomainTrustErrorMessageGlobalError2} ${payload?.GroupCN} ${addDomainTrustErrorMessageGlobalError3}`
              )
            } else {
              listofErrors.push(
                `${invalidDomainTrust1} ${payload?.sAMAccount} ${invalidDomainTrust2} ${payload?.GroupCN}.`
              )
            }
          }
          if (['false'].includes(result?.data?.SameForest)) {
            listofErrors.push(
              `${addDomainTrustErrorMessageUniversal1} ${payload?.sAMAccount} ${addDomainTrustErrorMessageUniversal2} ${payload?.GroupCN} ${addDomainTrustErrorMessageUniversal3} .`
            )
          }
          if (['Not Unique', 'Invalid'].includes(result?.data?.AccessioAppRequest)) {
            listofErrors.push(
              group?.common?.action?.toLowerCase() === 'join'
                ? `${payload?.GroupCN} ${invalidAppAccessMgtAdd}`
                : `${payload?.GroupCN} ${invalidAppAccessMgtRemove}`
            )
          }
          if (['Not Unique', 'Invalid'].includes(result?.data?.dbAGComplianceStatus)) {
            listofErrors.push(
              `${invaliddbAGComplianceStatus1} ${
                payload?.GroupCN
              } ${invaliddbAGComplianceStatus2} ${invaliddbAGComplianceStatus3} ${
                authContact && authContact !== '' && ':'
              } ${authContact} ${invaliddbAGComplianceStatus4} ${
                authContactDelegate && authContactDelegate !== '' && ':'
              } ${authContactDelegate} ${invaliddbAGComplianceStatus5}`
            )
          }
          if (['Not Unique', 'Invalid'].includes(result?.data?.dbagprovisioningby)) {
            listofErrors.push(
              group?.common?.action?.toLowerCase() === 'join'
                ? `${invaliddbagprovisionedByMsgAdd1} ${payload?.GroupCN} ${invaliddbagprovisionedByMsgAdd2}`
                : `${invaliddbagprovisionedByMsgRemove1} ${payload?.GroupCN} ${invaliddbagprovisionedByMsgRemove2}`
            )
          }
          if (['Not Unique', 'Invalid'].includes(result?.data?.DisabledBydbAccessGate)) {
            listofErrors.push(
              `${invalidDisabledBydbAccessGateMsg1} ${payload?.GroupCN} ${invalidDisabledBydbAccessGateMsg2} ${payload?.sAMAccount} ${invalidDisabledBydbAccessGateMsg3}`
            )
          }
          if (['Not Unique', 'Invalid'].includes(result?.data?.dbAGIMSApprovers)) {
            listofErrors.push(
              group?.common?.action?.toLowerCase() === 'join'
                ? `${addNoApproverValidationMessage1} ${
                    payload?.GroupCN
                  } ${addNoApproverValidationMessage2} ${
                    authContact && authContact !== '' && ':'
                  } ${authContact} ${addNoApproverValidationMessage3} ${
                    authContactDelegate && authContactDelegate !== '' && ':'
                  } ${authContactDelegate} ${addNoApproverValidationMessage4}`
                : `${removalNoApproverValidationMessage1} ${
                    payload?.GroupCN
                  } ${removalNoApproverValidationMessage2} ${
                    authContact && authContact !== '' && ':'
                  } ${authContact} ${removalNoApproverValidationMessage3} ${
                    authContactDelegate && authContactDelegate !== '' && ':'
                  } ${authContactDelegate} ${removalNoApproverValidationMessage4}`
            )
          } else if (['Not Unique', 'Invalid'].includes(result?.data?.ActiveApprover)) {
            listofErrors.push(
              group?.common?.action?.toLowerCase() === 'join'
                ? `${isActiveApprover1} ${payload?.GroupCN} ${isActiveApprover2} ${
                    authContact && authContact !== '' && ':'
                  } ${authContact} ${isActiveApprover3} ${
                    authContactDelegate && authContactDelegate !== '' && ':'
                  } ${authContactDelegate} ${isActiveApprover4}`
                : `${RemoveisActiveApprover1} ${payload?.GroupCN} ${RemoveisActiveApprover2} ${
                    authContact && authContact !== '' && ':'
                  } ${authContact} ${RemoveisActiveApprover3} ${
                    authContactDelegate && authContactDelegate !== '' && ':'
                  } ${authContactDelegate} ${RemoveisActiveApprover4}`
            )
          }
          if (['Not Unique', 'Invalid'].includes(result?.data?.MemberOfGroup)) {
            listofErrors.push(
              group?.common?.action?.toLowerCase() === 'join'
                ? `${payload?.sAMAccount} ${invalidMemberOfGroupForAdd} ${payload?.GroupCN}`
                : `${payload?.sAMAccount} ${invalidMemberOfGroup} ${payload?.GroupCN}`
            )
          }
          // Remove group bulk validation(most of them are hadled above)
          if (['Not Unique', 'Invalid'].includes(result?.data?.Group)) {
            listofErrors.push(`${invalidgroup}`)
          }
        }
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
        totalRequest: groupArray.length,
        ongoingRequest: processRequest1
      })
      if (listofErrors.length === 0) {
        callSubmitAccount(result, group, index)
      }

      if (processRequest1 === groupArray.length) {
        dispatch(updateShowBigLoader(false))
        setProcessRequest({
          totalRequest: 0,
          ongoingRequest: 0
        })
      }
    }

    groupArray.forEach((group, index) => {
      let validationPayload = {}
      if (group?.common?.action.toLowerCase() === 'join') {
        validationPayload = {
          GroupDomain: group?.common?.groupDomain,
          GroupCN: group?.common?.groupName,
          AccDomain: group?.common?.accountDomain,
          AccDN: '',
          GroupDN: '',
          email: userProfile.email,
          sAMAccount: group?.common?.accountName
        }
      } else {
        validationPayload = {
          GroupDomain: group?.common?.groupDomain,
          GroupCN: group?.common?.groupName,
          AccDomain: group?.common?.accountDomain,
          AccDN: '',
          GroupDN: '',
          sAMAccount: group?.common?.accountName
        }
      }

      validateGroupMembership(validationPayload, group, index)
    })
  }, [groupArray])

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
    const groupDetails = []
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
        if (singleArray.Action.toLowerCase() === 'join') {
          groupDetails.push({
            common: {
              applicationName: `${applicationNamePrefix}${singleArray.GroupDomain}`,
              category: 'AD Group',
              operation: 'Add Membership',
              requestorMail: userProfile.email,
              groupDN: '',
              accountDN: '',
              requestJustification: singleArray.BusinessJustification,
              Accessio_Request_No: '',
              AccessioBulkRequestNumber: unique,
              action: singleArray.Action,
              groupDomain: singleArray.GroupDomain,
              groupName: singleArray.GroupName,
              accountDomain: singleArray.AccountDomain,
              accountName: singleArray.AccountName
            }
          })
        } else if (singleArray.Action.toLowerCase() === 'leave') {
          groupDetails.push({
            common: {
              applicationName: `${applicationNamePrefix}${singleArray.GroupDomain}`,
              category: 'AD Group',
              operation: 'Remove Membership',
              requestorMail: userProfile.email,
              groupDN: '',
              accountDN: '',
              requestJustification: singleArray.BusinessJustification,
              Accessio_Request_No: '',
              AccessioBulkRequestNumber: unique,
              action: singleArray.Action,
              groupDomain: singleArray.GroupDomain,
              groupName: singleArray.GroupName,
              accountDomain: singleArray.AccountDomain,
              accountName: singleArray.AccountName
            }
          })
        }
      })
      setGroupArray(groupDetails)
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
  const movetoHistory = () => {
    history.push('/history/requestHistory')
  }
  const handleConfirm = () => {
    history.push('/dashboard')
  }
  const handleCancel = () => {
    setOpen(true)
    setButtonReference('cancel')
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
            label: translate('navItem.label.addRemoveBulkGroupMember'),
            url: ''
          }
        ]}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Styled.HeaderWrapper>
          <h1 style={{ fontWeight: 'normal', marginBottom: '10px' }}>
            {translate('create.bulkrequest.addRemove.title')}
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
                    {Errorheading}{' '}
                    <Link
                      to="/"
                      onClick={() => onErrorFileDownload()}
                      style={{ cursor: 'pointer' }}
                    >
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
            variant="outlined"
            onClick={(e) => onFileUpload(e)}
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
        {/* {successButtonName !== 'finish' && (
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
        )} */}
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
          )}{' '}
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
export default BulkAddRemoveGroupMember
