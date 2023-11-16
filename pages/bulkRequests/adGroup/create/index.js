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
import formGenerator from 'components/formGenerator'
import {
  updateReviewNotificationMessage,
  updateShowBigLoader
} from '../../../../redux/review/review.action'
import {
  selectNotificationMessage,
  selectShowBigLoader
} from '../../../../redux/review/review.selector'
import { setadAdGroupInitialState } from '../../../../redux/requests/activeDirectory/activeDirectorySlice'
import useTheme from '../../../../hooks/useTheme'
import * as Styled from './style'
import Loading from '../../../../components/loading'
import * as profileAPI from '../../../../api/profile'
import * as adGroupApi from '../../../../api/groupManagement'
import axios from '../../../../axios'
import { randomNumber } from '../../../../helpers/strings'
import { applicationNamePrefix, isValidEmail } from '../../../../helpers/utils'

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

const csvExampleRow = {
  accessioIsGroupPrivileged: 'Yes',
  businessJustification: 'Here you can add business justification',
  dbagCostcenter: '6201126695',
  dbagExternalProvider: 'AZR',
  dbagIMSApprovers: 'IMS approver ',
  dbagIMSAuthContact: 'test',
  dbagIMSAuthContactDelegate: 'test',
  dbagIMSDataSecCLass: 'Internal',
  dbagInfrastructureID: '46965-1',
  description: 'Description for AD group',
  digitalIdentity: 'Group Name can contain server NAR-Id',
  domain: 'Domain',
  endlocation: 'Default group end Location',
  groupScope: 'universal',
  groupType: 'security',
  role: ' Role of group Level of Access Server Role',
  RobotBusinessDescription: 'Description for Robot business',
  dbagFileSystemFullPaths: 'test',
  department: 'Other Assets & Liabilities',
  entitlement: 'Author',
  mAMs: 'NAR ID MAMs',
  samLocation: 'Default group samLocation ',
  dbagApplicationID: '134425-1',
  accessioPlatformType: 'All Platforms',
  accessioPrerequisiteRMPRoles: 'Infrastructure Technology Lead/Manager',
  cyberarkregion: 'Americas',
  info: 'Information',
  safeName: 'CyberArk Safe Name',
  dbagSupportGroup: 'ServiceNow/dbUnity support group ',
  dbagProcessingdata: 'test',
  serverName: 'Server Name',
  enterpriseServices: 'test',
  accessioIsgMSAGroup: 'Yes',
  dbagDataPrivClass: 'No(Default)',
  dwsPrivate: 'No',
  clientPrivate: 'No',
  dbPrivate: 'No',
  approverLevel: 'Level 2',
  dbagExtensionAttribute3: 'Unrestricted(default)',
  groupNameText: 'Group Name',
  samDbagApplicationID: '134425-1',
  categoryReference: 'dbSRS-Approver ACL Group-Application Authorization',
  dbSRSApproverLevel: '2',
  dbagExtensionAttribute2: 'Unrestricted',
  dLPEnvironment: 'Application Name or NAR ID',
  dLPGroupRole: 'DLP Group-Application Authorization',
  dlpou: 'test',
  applicationName: 'Application Name',
  productionUATorDEV: 'DEV',
  projectName: 'Unique Project Name',
  vRMID: 'VRM ID by  Risk Management',
  versionIterationofGroup: '3',
  accessToPSI: 'test',
  groupRole: 'DEV',
  vendorteamName: 'Vendor or Team Name',
  accessioPrerequisiteRMPRolesText: 'Test'
}

const BulkCreateAdGroup = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [open, setOpen] = React.useState(false)
  const [steps, setSteps] = useState([])
  const [array, setArray] = useState([])
  const [userProfile, setUserProfile] = useState({})
  const [adGroupDataArray, setAdGroupDataArray] = useState([])
  const [adGroupType, setAdGroupType] = useState('')
  const [adGroupSubType, setAdGroupSubType] = useState('')
  const [accessioGroupType, setAccessioGroupType] = useState('')
  const [adGroupArray, setAdGroupArray] = React.useState([])
  const [prefetchedOptions, setPrefetchedOptions] = useState([])
  const adAccountInfo = useSelector((state) => state.adAccountInfo)
  const [samAccountDataStructure, setSamAccountDataStructure] = useState({})
  const [descriptionStructure, setDescriptionStructure] = useState({})
  const [samAccountObject, setSamAccountObject] = useState({})
  const [descriptiontObject, setDescriptionObject] = useState({})
  const columnSX = 4

  const [csvObj, setCsvObj] = useState()
  const [validationColumns, setValidationColumns] = useState()

  const [errors, setErrors] = useState([])
  const [successMessage, setSuccessMessage] = useState('')
  const [successCounter, setSuccessCounter] = useState(0)
  const [adAccountArray, setAdAccountArray] = useState([])
  const [errorEntries, setErrorEntries] = useState([])
  const showBigLoader = useSelector(selectShowBigLoader)
  const maxlengthError = translate('create.bulkerrormessage')
  const norecordsError = translate('create.bulknorecords')
  const formatError = translate('format.error')
  const history = useHistory()
  const inValidNarId = translate('create.inValidNarId')
  const inValidCostCenter = translate('create.inValidCostCenter')
  const inValidDep = translate('create.inValidDep')
  const inValidDBUnity = translate('create.inValidDBUnity')
  const inValidInfraID = translate('create.inValidInfraID')
  const inValidMAMs = translate('create.inValidMAMs')
  const inValidAuthContact = translate('create.inValidAuthContact')
  const inValidAuthContactDelegate = translate('create.inValidAuthContactDelegate')
  const inValidGroupOwner = translate('create.inValidGroupOwner')
  const inValidCsvHeader = translate('modify.invalidHeader')

  const inValidAccessioGroupName = translate('create.inValidAccessioGroupName')
  const inValidLocation = translate('create.inValidbulklocation')
  const inValidGroupDN = translate('create.inValidGroupDN')
  const emptyNarId = translate('create.emptyNarId')
  const inValidReqUniqueness = translate('create.inValidReqUniqueness')
  const alphaNumericValidation = translate('create.bulkrequest.alphaNumericValidationMessage')
  const justificationError = translate('form.alphaNumericValidationMessage')
  const alphaNumericWithHyphenValidation = translate(
    'form.alphaNumericWith_HyphenValidationMessage'
  )
  const csvNotification = translate('create.bulkrequest.csvNotification')
  const [successButtonName, setSuccessButtonName] = useState('upload')
  const [buttonReference, setButtonReference] = useState('')
  const [processRequest, setProcessRequest] = useState({ ongoingRequest: 0, totalRequest: 0 })
  let processRequest1 = 0
  const getNotificationMessage = useSelector(selectNotificationMessage)
  const minApprover = translate('form.approverMinVal')
  const duplicateApprover = translate('form.duplicateApproverVal')
  const invalidEmailFormat = translate('form.invalidEmailFormat')
  const invalidAuthContactAndDelegate = translate('form.invalidAuthContactAndDelegate')
  const mandatoryErrorMessage = translate('form.mandatoryErrorMessage')
  const invalidColumCount = translate('modify.invalidColumn')
  const invalidMissingHeaderName = translate('modify.invalidOrMissingColumn')
  const invalidValueOf = translate('create.inValidValueOf')
  const successSuffix = translate('create.bulkrequest.addRemove.successSuffix')
  const Errorheading = translate('comment.Errorheading')
  const Erroratline = translate('comment.Erroratline')
  const errorOccuredAtline = translate('modify.errorLine')
  const errorMessages = []

  const dispatch = useDispatch()

  const { theme } = useTheme()
  const clearFilters = () => {
    setErrors([])
    setErrorEntries([])
    setSuccessMessage('')
  }

  const clearFile = () => {
    setSelectedFile('')
    setSuccessButtonName('upload')
    clearFilters()
  }
  const movetoHistory = () => {
    history.push('/history/requestHistory')
  }

  const fileDetails = () => (
    <StyledTag label={selectedFile?.name ? selectedFile?.name : ''} onClick={() => clearFile()} />
  )
  const valueFinder = (fieldId) => {
    const targetIndex = adGroupArray.findIndex((field) => field.id === fieldId)
    return adGroupArray[targetIndex]?.value
  }
  const checkValuesFromMeta = async (type, value) => {
    let filteredValue = []
    if (type === 'domain') {
      const filteredType = adGroupArray?.filter(
        (eachChild) => eachChild.id.toLowerCase() === type.toLowerCase()
      )
      filteredValue = filteredType[0].options.filter((eachOption) => {
        if (eachOption?.belongsto?.length > 0) {
          if (
            eachOption?.belongsto.includes(accessioGroupType) &&
            eachOption?.label.toLowerCase() === value.toLowerCase()
          ) {
            return eachOption
          }
          return null
        }
        return null
      })
      return filteredValue
    }

    const filteredType = adGroupArray?.filter(
      (eachChild) => eachChild.id.toLowerCase() === type.toLowerCase()
    )
    if (Array.isArray(filteredType) && filteredType[0]?.options) {
      filteredValue = filteredType[0]?.options?.filter((eachOption) => {
        if (eachOption?.belongsto?.length > 0) {
          if (
            eachOption?.belongsto.includes(accessioGroupType) &&
            eachOption?.label.toLowerCase() === value.toLowerCase()
          ) {
            return eachOption
          }
          return null
        }
        if (eachOption?.label.toLowerCase() === value.toLowerCase()) {
          return eachOption
        }

        return null
      })
    }
    return filteredValue
  }
  const validateRow = async (rowData) => {
    const validationStatus = { error: false, errorMessage: '' }
    const errorMessge = []
    const mandetoryFailed = []
    let isSameAuthContactAndDelegate = false
    let isEntitlementOther = false
    // eslint-disable-next-line no-restricted-syntax
    for (const column of validationColumns) {
      // validationColumns.forEach((column) => {
      if (column.requiredField) {
        if (rowData[column.id].trim() === '') {
          validationStatus.error = true
          mandetoryFailed.push(column.label)
        }
      }
      if (
        column.alphanumericType &&
        !['dbagIMSAuthContact', 'dbagIMSAuthContactDelegate', 'dbagIMSApprovers'].includes(
          column.id
        ) &&
        rowData[column.id].trim()
      ) {
        if (
          !/^[a-zA-Z0-9_\-\\.@/ ]*$/.test(rowData[column.id]) &&
          ['description', 'dbagFileSystemFullPaths'].includes(column.id)
        ) {
          validationStatus.error = true
          errorMessge.push(`${column.label}: ${alphaNumericValidation}(${rowData[column.id]})`)
        } else if (
          !['description', 'dbagFileSystemFullPaths', 'businessJustification'].includes(
            column.id
          ) &&
          !rowData[column.id].match(/^([a-zA-Z0-9\u0600-\u06FF\u0660-\u0669\u06F0-\u06F9 _.-@]+)$/)
        ) {
          validationStatus.error = true
          errorMessge.push(`${column.label}: ${alphaNumericValidation}(${rowData[column.id]})`)
        }
      }
      if (
        column.alphanumericTypeWithHyphen &&
        !['dbagIMSAuthContact', 'dbagIMSAuthContactDelegate', 'dbagIMSApprovers'].includes(
          column.id
        ) &&
        rowData[column.id].trim()
      ) {
        if (
          !rowData[column.id].match(/^([a-zA-Z0-9\u0600-\u06FF\u0660-\u0669\u06F0-\u06F9\-_]+)$/)
        ) {
          validationStatus.error = true
          errorMessge.push(
            `${column.label}: ${alphaNumericWithHyphenValidation}(${rowData[column.id]})`
          )
        }
      }
      if (column.maxLength > 0 && rowData[column.id].trim()) {
        if (rowData[column.id].length > column.maxLength) {
          validationStatus.error = true
          errorMessge.push(
            `${column.label}: max Length is ${column.maxLength}(${rowData[column.id]})`
          )
        }
      }
      if (
        ['entitlementOther'].includes(column.id) &&
        isEntitlementOther &&
        rowData[column.id] === '' &&
        column.type === 'text'
      ) {
        validationStatus.error = true
        errorMessge.push(`${mandatoryErrorMessage} (${[column.id]})`)
        validationStatus.errorMessage = errorMessge
        return validationStatus
      }
      if (
        column.type === 'dropdown' &&
        rowData[column.id].trim() &&
        !['endlocation', 'samLocation', 'cyberarkregion', 'dlpou'].includes(column.id)
      ) {
        // eslint-disable-next-line no-await-in-loop
        const filteredValue = await checkValuesFromMeta(column.id, rowData[column.id])
        if (
          filteredValue?.length &&
          ['entitlement'].includes(column.id) &&
          filteredValue?.[0]?.label.toLowerCase() === 'other - please specify'
        ) {
          isEntitlementOther = true
        }
        if (filteredValue?.length === 0) {
          if (['domain', 'entitlement'].includes(column.id)) {
            validationStatus.error = true
            errorMessge.push(`${invalidValueOf} ${column.label} .(${rowData[column.id]})`)
            validationStatus.errorMessage = errorMessge
            return validationStatus
          }
          validationStatus.error = true
          errorMessge.push(`${invalidValueOf} ${column.label}. (${rowData[column.id]})`)
        }
      }
      if (column.id === 'dbagIMSApprovers' && rowData[column.id].trim()) {
        const approversArray = rowData[column.id].split(';')
        if (approversArray.length < 3 || approversArray.includes('')) {
          validationStatus.error = true
          errorMessge.push(`${column.label}: ${minApprover}`)
        } else {
          const approvers = rowData[column.id].split(';')
          if (approvers.filter((item, index) => index !== approvers.indexOf(item)).length > 0) {
            validationStatus.error = true
            errorMessge.push(`${column.label}: ${duplicateApprover}(${rowData[column.id]})`)
          } else {
            let isValid = true
            approvers.forEach((approver) => {
              if (isValid && !isValidEmail(approver)) {
                isValid = false
                validationStatus.error = true
                errorMessge.push(`${column.label}: ${invalidEmailFormat}(${rowData[column.id]})`)
              }
            })
          }
        }
      }
      if (
        column.id === 'businessJustification' &&
        rowData[column.id].trim() &&
        !/^[a-zA-Z0-9_\-\\.@ ]*$/.test(rowData[column.id].trim())
      ) {
        validationStatus.error = true
        errorMessge.push(`${column.label}: ${justificationError}(${rowData[column.id]})`)
      }
      if (
        ['dbagIMSAuthContact', 'dbagIMSAuthContactDelegate'].includes(column.id) &&
        rowData[column.id].trim()
      ) {
        if (
          !isSameAuthContactAndDelegate &&
          rowData.dbagIMSAuthContact === rowData.dbagIMSAuthContactDelegate
        ) {
          isSameAuthContactAndDelegate = true
          validationStatus.error = true
          errorMessge.push(`${column.label}: ${invalidAuthContactAndDelegate}`)
        }
        if (!isSameAuthContactAndDelegate && !isValidEmail(rowData[column.id])) {
          validationStatus.error = true
          errorMessge.push(`${column.label}: ${invalidEmailFormat}(${rowData[column.id]})`)
        }
      }
    }
    if (mandetoryFailed.length) {
      errorMessge.push(`${mandatoryErrorMessage}(${mandetoryFailed.join(',')})`)
    }
    validationStatus.errorMessage = errorMessge.join('; ')
    return validationStatus
  }
  const validateFileDetails = async (data) => {
    clearFilters()
    const errorMessagess = []
    dispatch(updateShowBigLoader(true))
    if (data.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [index, item] of data.entries()) {
        // eslint-disable-next-line no-await-in-loop
        const status = await validateRow(item)
        if (status.error) {
          errorMessagess.push(`${errorOccuredAtline}  ${index + 1} : ${status.errorMessage}`)
        }
      }
    }

    if (errorMessagess.length) {
      setErrors(errorMessagess)
      dispatch(
        updateReviewNotificationMessage({
          type: 'Error',
          message: `${errorMessagess.length} of ${data.length} entries contains error.`
        })
      )
      dispatch(updateShowBigLoader(false))
    } else {
      setOpen(true)
      dispatch(updateShowBigLoader(false))
    }
  }
  const prepareSamAccount = (data) => {
    const updatedArray = data
    const samAccountStructure = samAccountDataStructure.filter(
      (item) => item.category === accessioGroupType
    )
    updatedArray.forEach((v, i) => {
      const samAccountTextValues = []
      samAccountStructure[0].text.forEach((vl) => {
        if (updatedArray[i][vl] === undefined) {
          samAccountTextValues.push(vl)
        } else {
          samAccountTextValues.push(updatedArray[i][vl])
        }
      })
      updatedArray[i].samAccount = `${samAccountStructure[0].prefix}-${samAccountTextValues.join(
        '-'
      )}`
    })
    validateFileDetails(updatedArray)
  }

  const prepareGroupDescription = (data, AppNarIdLabel) => {
    const updatedArray = Array.isArray(data) ? data[0] : data
    const groupDescriptionStructure = descriptionStructure.filter(
      (item) => item.category === accessioGroupType
    )
    const groupDescriptionTextValues = []
    groupDescriptionStructure[0].text.forEach((vl) => {
      if (vl === 'approverLevel') {
        groupDescriptionTextValues.push(updatedArray[vl] ? `Approver ${updatedArray[vl]}` : vl)
      } else if (['dbagApplicationID', 'samDbagApplicationID'].includes(vl)) {
        groupDescriptionTextValues.push(AppNarIdLabel)
      } else {
        groupDescriptionTextValues.push(updatedArray[vl] ? updatedArray[vl] : vl)
      }
    })
    updatedArray.compiledGroupDescription = groupDescriptionStructure[0].prefix
      ? `${groupDescriptionStructure[0].prefix}, ${groupDescriptionTextValues.join(', ')}`
      : `${groupDescriptionTextValues.join(', ')}`

    return updatedArray.compiledGroupDescription
  }

  const csvFileToArray = (string) => {
    const expectedHeaders = adGroupArray
      .filter((data) => {
        if (
          (data.relatedTo.includes(accessioGroupType) &&
            data.displayType.hidden === false &&
            !['accessioPrerequisiteRMPRoles', 'pSIDescription'].includes(data.id)) ||
          data.id === 'businessJustification' ||
          ([
            'DLP Group - Application Authorization',
            'Identity Based Access Control (IBAC) - Application Group - Application Authorization'
          ].includes(accessioGroupType) &&
            data.id === 'entitlementOther')
        ) {
          return data
        }
        if (data.relatedTo.includes(accessioGroupType) && data.needBulkOperation === true) {
          return data
        }
        return null
      })
      ?.map((item) => item.label)
    adGroupArray.forEach((col) => {
      if (col.relatedTo.includes(accessioGroupType) && col.id === 'accessioPrerequisiteRMPRoles') {
        expectedHeaders.push(col.label)
      }
    })

    const csvString = string.trim()
    const headerInput = csvString.split('\n')[0].split(',')
    const csvHeaderInput = headerInput.map((value) => value.replace(/(\r\n|\n|\r)/gm, ''))
    const csvHeader = []
    const array1 = []
    const validationErrorMessages = []
    csvHeaderInput.forEach((item, index) => {
      const filterData = adGroupArray.filter(
        (data) =>
          ((data.relatedTo.includes(accessioGroupType) && data.displayType.hidden === false) ||
            (data.relatedTo.includes(accessioGroupType) && data.needBulkOperation === true) ||
            ([
              'DLP Group - Application Authorization',
              'Identity Based Access Control (IBAC) - Application Group - Application Authorization'
            ].includes(accessioGroupType) &&
              data.id === 'entitlementOther') ||
            data.id === 'businessJustification') &&
          data.label === item
      )
      if (filterData.length > 0) {
        csvHeader[index] = filterData[0].id
      }
    })
    const headerValidation = expectedHeaders.length === csvHeaderInput.length
    const missingHeaders = expectedHeaders.length > csvHeaderInput.length
    expectedHeaders.forEach((value) => {
      if (!csvHeaderInput.includes(value)) {
        array1.push(value)
      }
    })
    if (array1.length > 0) {
      if (missingHeaders) {
        validationErrorMessages.push(`${invalidMissingHeaderName} : ${array1.join(', ')}`)
        setErrors(validationErrorMessages)
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

      const newArray = csvRows.map((i) => {
        const values = i.trim().split(',')

        const obj = csvHeader.reduce((object, header, index) => {
          const inputObj = object
          if (header === 'accessioPrerequisiteRMPRoles') {
            const rmpValue = [...values]
            rmpValue.splice(0, index)
            inputObj[header] = rmpValue.join().replace(/"/g, '')
          } else {
            inputObj[header] = values[index].trim()
          }

          return inputObj
        }, {})
        obj.compiledGroupDescription = ''
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

    a.setAttribute('download', error ? `errors_${date}` : `${accessioGroupType}.csv`) //  // Setting the anchor tag attribute for downloading, and passing the download file name

    a.click() // Performing a download with click
  }
  const getHeader = (headers) => {
    const headerData = {
      adGroupType: 'AD Group Type',
      adGroupSubType: 'AD Group Sub-Type',
      accessioGroupType: 'Accessio Group Type',
      digitalIdentity: 'Digital Identity',
      domain: 'Group Domain',
      role: 'Role',
      approverLevel: 'Approver Level',
      categoryReference: 'Category Reference',
      versionIterationofGroup: 'Version / Iteration of Group',
      vRMID: 'VRM ID',
      groupNameText: 'Group Name Text',
      projectName: 'Project Name',
      productionUATorDEV: 'Production UAT or DEV',
      applicationName: 'Application Name',
      groupRole: 'Group Role',
      safeName: 'Safe Name',
      enterpriseServices: 'ES (Enterprise Services)',
      dLPEnvironment: 'DLP Environment',
      dLPGroupRole: 'DLP Group Role',
      serverName: 'Server Name',
      vendorteamName: 'Vendor/Team Name',
      samLocation: 'Location',
      samDbagApplicationID: 'Application NAR ID',
      RobotBusinessDescription: 'Robot Business Description',
      dbSRSApproverLevel: 'dbSRS Approver Level',
      samAccount: 'Group Name',
      dbagApplicationID: 'Application NAR ID',
      dbagCostcenter: 'Cost Center',
      description: 'Group Description',
      endlocation: 'End Location',
      dbagsupportGroup: 'dbUnity Support Group',
      accessioIsGroupPrivileged: 'Is This Group Privileged ?',
      dbagIMSDataSecCLass: 'Data Security class',
      groupType: 'Group Type',
      groupScope: 'Group Scope',
      dbagExternalProvider: 'Enable Cloud Sync',
      info: 'Comment',
      dbagExtensionAttribute2: 'Nesting Restriction',
      dbagProcessingdata: 'Processing Data',
      entitlement: 'Entitlement',
      entitlementOther: 'Entitlement Other',
      department: 'Department',
      dbagFileSystemFullPaths: 'Paths',
      accessioIsgMSAGroup: 'Accessio Is gMSAGroup?',
      dbagDataPrivClass: 'Provides access to Price Sensitive Information?',
      dwsPrivate: 'DWS Private',
      clientPrivate: 'Client Private',
      dbPrivate: 'DB Private',
      accessToPSI: 'Provides access to Price Sensitive Information?',
      cyberarkregion: 'CyberArk Region',
      accessioPlatformType: 'Accessio Platform Type',
      mAMs: 'MAMs',
      accessioPrerequisiteRMPRoles: 'Accessio Prerequisite RMP Roles',
      dbagInfrastructureID: 'Infra NAR ID',
      dbagSupportGroup: 'Support Group',
      dbagExtensionAttribute3: 'User Scope Restriction',
      dlpou: 'DLP OU',
      distinguishedName: 'Distinguished Name',
      compiledGroupDescription: 'Group Description',
      dbagIMSAuthContact: 'Group Authorization Contact',
      dbagIMSAuthContactDelegate: 'Group Authorization Delegate',
      dbagIMSApprovers: 'Group Approvers',
      businessJustification: 'Business Justification',
      accessioPrerequisiteRMPRolesText: 'Accessio Prerequisite RMP Roles'
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
  const getExampleRowGroup = (csvObject) => {
    const obj1 = csvObject
    Object.keys(obj1).forEach((key) => {
      obj1[key] = csvExampleRow[key]
    })
    return obj1
  }
  const generateCsvFileForDownload = () => {
    let columnsForCsv = []
    columnsForCsv = adGroupArray.filter(
      (col) =>
        (col.relatedTo.includes(accessioGroupType) &&
          !['accessioPrerequisiteRMPRoles', 'pSIDescription'].includes(col.id)) ||
        col.id === 'businessJustification'
    )
    adGroupArray.forEach((col) => {
      if (col.relatedTo.includes(accessioGroupType) && col.id === 'accessioPrerequisiteRMPRoles') {
        columnsForCsv.push(col)
      }
    })
    setValidationColumns(
      columnsForCsv.filter(
        (col) =>
          col.displayType.hidden === false ||
          (col.relatedTo.includes(accessioGroupType) &&
            [
              'DLP Group - Application Authorization',
              'Identity Based Access Control (IBAC) - Application Group - Application Authorization'
            ].includes(accessioGroupType) &&
            col.id === 'entitlementOther')
      )
    )
    const columnNames = columnsForCsv.filter(
      (val) =>
        val.displayType.hidden === false ||
        val.needBulkOperation === true ||
        (val.relatedTo.includes(accessioGroupType) &&
          [
            'DLP Group - Application Authorization',
            'Identity Based Access Control (IBAC) - Application Group - Application Authorization'
          ].includes(accessioGroupType) &&
          val.id === 'entitlementOther')
    )
    const csvObject = columnNames.reduce((acc, val) => ({ ...acc, [val.id]: '' }), {})
    const csvObjectExampleRow = getExampleRowGroup(csvObject)
    setCsvObj(csvObjectExampleRow)
  }
  const downloadCSV = async () => {
    // Headers For CSV file
    const csvdata = csvmaker(csvObj)
    download(csvdata)
  }

  const callSubmitAccount = async (result, payload, index) => {
    dispatch(updateShowBigLoader(true))
    if (result.status === 200) {
      await adGroupApi
        .submitAdGroup(payload)
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
            errorMessages.push(
              `${errorOccuredAtline}  ${index + 1} : ${res?.response?.data?.message}`
            )
          }
          setSuccessButtonName('finish')
        })
        .catch((err) => {
          console.error('err', err)
          setSuccessButtonName('finish')
        })
    } else {
      setErrorEntries((prevState) => [...prevState, array[index]])
      errorMessages.push(`${errorOccuredAtline}  ${index + 1} : ${result?.response?.data?.message}`)

      setSuccessButtonName('finish')
    }
  }

  const confirmBulkAction = () => {
    setOpen(false)
    const adAccountDetails = []
    setSuccessCounter(0)
    let unique = ''
    const checkUnique = async () => {
      const uniqueNum = randomNumber()
      const charsToModify = uniqueNum.slice(-4).toUpperCase()
      unique = uniqueNum.slice(0, -4) + charsToModify
      // unique = randomNumber()

      const uniquePayload = {
        targetFilter: {
          operator: 'EQUALS',
          operand: {
            targetName: 'request.common.AccessioBulkRequestNumber',
            targetValue: unique
          }
        }
      }
      const response = await axios({
        url: '/v0/governance/checkRequest',
        data: uniquePayload,
        method: 'post'
      })

      if (response?.data?.result?.length && response?.data?.result?.length !== 0) {
        checkUnique()
      } else {
        // eslint-disable-next-line no-restricted-syntax
        for (const singleArray of array) {
          adGroupArray.forEach((item) => {
            if (item.type === 'dropdown' && singleArray[item.id]) {
              if (
                ![
                  'accessioGroupType',
                  'adGroupType',
                  'adGroupSubType',
                  'endlocation',
                  'samLocation',
                  'cyberarkregion',
                  'dlpou'
                ].includes(item.id)
              ) {
                if (['approverLevel', 'dLPEnvironment'].includes(item.id)) {
                  singleArray[item.id] = item.options.filter(
                    (itm) => itm.label.toLowerCase() === singleArray[item.id].toLowerCase()
                  )[0]?.label
                } else {
                  singleArray[item.id] = item.options.filter(
                    (itm) => itm.label.toLowerCase() === singleArray[item.id].toLowerCase()
                  )[0]?.value
                }
              }
            }
          })

          const groupDetailsObject = {}
          adGroupArray.forEach((o) => {
            if (
              singleArray[o.id] &&
              singleArray[o.id] !== '' &&
              (o.relatedTo === '' || o.relatedTo.includes(adGroupArray[2]?.value))
            ) {
              switch (o.name) {
                case 'dbagApplicationID':
                case 'samdbagApplicationID':
                case 'dbagInfrastructureID':
                  if (Array.isArray(o.value)) {
                    groupDetailsObject[o.name] = singleArray[o.id]
                  } else {
                    groupDetailsObject[o.name] = [singleArray[o.id]]
                  }
                  break
                case 'dbagIMSAuthContact':
                case 'dbagIMSAuthContactDelegate':
                  groupDetailsObject[o.name] = singleArray[o.id]
                  break
                case 'dbagIMSApprovers':
                  groupDetailsObject[o.name] = singleArray[o.id].split(';')
                  break
                case 'endlocation':
                case 'approverLevel':
                case 'dLPEnvironment':
                case 'dbagExternalProvider':
                  if (singleArray[o.id].toLowerCase() === 'azr#gcp') {
                    groupDetailsObject[o.name] = singleArray[o.id].split('#')
                  } else {
                    groupDetailsObject[o.name] = [singleArray[o.id]]
                  }
                  break
                case 'groupScope':
                  groupDetailsObject[o.name] = singleArray[o.id]
                  break
                case 'compiledGroupDescription':
                  groupDetailsObject.description = [singleArray[o.id]]
                  break
                case 'description':
                  break
                case 'paths':
                  groupDetailsObject[o.id] = singleArray[o.id]
                  break
                case 'dbagEntitlement':
                  groupDetailsObject[o.name] = ['other - please specify'].includes(
                    singleArray.entitlement.toLowerCase()
                  )
                    ? singleArray.entitlementOther
                    : singleArray.entitlement
                  break
                case 'dbagDataPrivClass':
                  // eslint-disable-next-line no-lone-blocks
                  {
                    groupDetailsObject.dbagExtensionAttribute6 = `${singleArray.dwsPrivate}${singleArray.clientPrivate}${singleArray.dbPrivate}`
                    groupDetailsObject.dbagDataPrivClass = singleArray[o.id]
                  }

                  break
                default:
                  if (o.name === 'cn') {
                    groupDetailsObject[o.name] =
                      typeof o.value === 'object'
                        ? singleArray[o.id].value.toUpperCase()
                        : singleArray[o.id].toUpperCase()
                  } else {
                    if (o.id === 'dwsPrivate' || o.id === 'clientPrivate' || o.id === 'dbPrivate') {
                      break
                    }
                    groupDetailsObject[o.name] = singleArray[o.id]
                  }
                  break
              }
            }
          })
          /* eslint no-underscore-dangle: 0 */
          groupDetailsObject.dbagRecerttype = adGroupArray[0]?.value
          groupDetailsObject.dbagRecertSubtype = adGroupArray[1]?.value
          groupDetailsObject.accessioGroupType = adGroupArray[2]?.value
          groupDetailsObject.__NAME__ = ''
          groupDetailsObject.displayName = singleArray.samAccount.toUpperCase()
          groupDetailsObject.distinguishedName = ''
          const commonObj = {
            applicationName: `${applicationNamePrefix}${
              singleArray.domain ? singleArray.domain : ''
            }`,
            operation: 'Create',
            category: 'AD Group',
            requestorMail: userProfile.email,
            isDraft: false,
            requestJustification: singleArray.businessJustification,
            Accessio_Request_No: '',
            AccessioBulkRequestNumber: unique,
            groupDetails: {}
          }
          commonObj.groupDetails = groupDetailsObject
          if (commonObj.groupDetails?.requestJustification) {
            delete commonObj.groupDetails.requestJustification
          }
          adAccountDetails.push({ common: commonObj })
        }
        if (
          adAccountDetails[0]?.common?.groupDetails?.accessioGroupType ===
          'Robot Object - Infrastructure Other'
        ) {
          adAccountDetails[0].common.groupDetails.mAMs =
            adAccountDetails[0].common.groupDetails.dbagApplicationID
          adAccountDetails[0].common.groupDetails.dbagApplicationID = ''
        }
        if (adAccountDetails.length) {
          setAdAccountArray(adAccountDetails)
        }
        if (errorMessages.length) {
          setErrors(errorMessages)
        }
      }
    }

    checkUnique()
  }

  const resetAdGroupForm = (
    adGroupTypeValue = null,
    adGroupSubTypeValue = null,
    accessioGroupTypeValue = null
  ) => {
    // Logic to reset value in case of change of Account Category. Create a fresh clone of the source object and set appropriate category in value and then update the state
    const categoryDisplayValue = [...adAccountInfo.adGroup].map((item, index) => {
      switch (index) {
        case 0:
          return {
            ...item,
            value: adGroupTypeValue,
            error: false,
            helperText: ''
          }
        case 1:
          return {
            ...item,
            value: adGroupSubTypeValue,
            hidden: !adGroupSubTypeValue,
            error: false,
            helperText: ''
          }
        case 2:
          return {
            ...item,
            value: accessioGroupTypeValue,
            hidden: !accessioGroupTypeValue,
            error: false,
            helperText: ''
          }
        default:
          if (item.id === 'IsgMSAGroup') {
            if (accessioGroupType) {
              return {
                ...item,
                hidden: false
              }
            }
            return {
              ...item,
              hidden: true
            }
          }
          return item
      }
    })

    setAdGroupArray(categoryDisplayValue)
  }

  const handlefieldChanges = (event, value, category, id) => {
    const elementModified = event.target.id ? event.target.id.split('-')[0] : id
    const newValue = value
    if (['accessioGroupType', 'adGroupType', 'adGroupSubType'].includes(elementModified)) {
      let ObjectTemplateIndex
      let groupObjectTemplateIndex
      clearFilters()
      setSelectedFile('')
      switch (elementModified) {
        case 'adGroupType':
          setAdGroupType(newValue)
          setAdGroupSubType('')
          setAccessioGroupType('')
          resetAdGroupForm(newValue)
          break
        case 'adGroupSubType':
          setAdGroupSubType(newValue)
          setAccessioGroupType('')
          resetAdGroupForm(adGroupType, newValue)
          break
        case 'accessioGroupType':
          if (adGroupArray[2].value === newValue) {
            break
          }
          setAccessioGroupType(newValue || '')
          resetAdGroupForm(adGroupType, adGroupSubType, newValue)
          ObjectTemplateIndex = samAccountDataStructure.findIndex(
            (field) => field.category === newValue
          )
          setSamAccountObject(samAccountDataStructure[ObjectTemplateIndex])
          groupObjectTemplateIndex = descriptionStructure.findIndex(
            (field) => field.category === newValue
          )
          setDescriptionObject(descriptionStructure[groupObjectTemplateIndex])
          break

        default:
          break
      }
    }
  }
  const displayFields = (relation) => {
    let isDisplay = false
    if (Array.isArray(relation)) {
      isDisplay = relation.includes(accessioGroupType)
    } else {
      isDisplay = relation === accessioGroupType
    }
    return isDisplay
  }

  const handleDisplayValue = (displayData) => {
    const targetIndex = adGroupArray.findIndex((field) => field.id === displayData.id)
    const havingDepartmentField = adGroupArray[targetIndex].relatedTo.includes(accessioGroupType)
    setAdGroupArray((updatedList) =>
      updatedList.map((item) => {
        if (displayData.id === item.id && item.id === 'department' && havingDepartmentField) {
          // Set department option with default value
          const valueData = {
            label: displayData.displayLabel,
            value: displayData.value
          }
          return {
            ...item,
            value: valueData,
            options: [valueData],
            displayLabel: displayData.displayLabel
          }
        }
        return item
      })
    )
  }
  const helperFinder = (fieldId) => {
    const targetIndex = adGroupArray.findIndex((field) => field.id === fieldId)
    return adGroupArray[targetIndex]?.helperText
  }

  const errorFinder = (fieldId) => {
    const targetIndex = adGroupArray.findIndex((field) => field.id === fieldId)
    return adGroupArray[targetIndex]?.error
  }
  const optionFinder = (fieldId) => {
    const targetIndex = prefetchedOptions.findIndex((field) => field.id === fieldId)
    return prefetchedOptions[targetIndex]?.options
  }
  const optionReset = (fieldId) => {
    const updatedPrefetchedOptions = prefetchedOptions.map((field) => {
      if (field.id === fieldId) {
        return { ...field, options: [] }
      }
      return field
    })
    setPrefetchedOptions(updatedPrefetchedOptions)
  }
  const disabledFlagFinder = (fieldId) => {
    const targetIndex = adGroupArray.findIndex((field) => field.id === fieldId)
    return adGroupArray[targetIndex]?.disabled
  }

  const readOnlyFlagFinder = (fieldId) => {
    const targetIndex = adGroupArray.findIndex((field) => field.id === fieldId)
    return adGroupArray[targetIndex]?.readOnly
  }

  const hiddenFlagFinder = (fieldId) => {
    const targetIndex = adGroupArray.findIndex((field) => field.id === fieldId)
    return adGroupArray[targetIndex]?.hidden
  }
  const adGroupObjGenerator = (objRepo, adGroupObj, adGroupSummaryObj, adaccessioGroupTypeObj) => {
    objRepo.forEach((child) => {
      const providedDefaultValue = child.default && child.default !== '' ? child.default : ''
      adGroupSummaryObj.push(child.category)
      adGroupObj.push({
        id: child.id,
        label: child.title,
        value: child.isMultiple ? [] : providedDefaultValue,
        helperText: '',
        error: false,
        requiredField: child.requiredField,
        category: child.category,
        relatedTo: child.relatedTo ? child.relatedTo : '',
        displayLabel: '',
        name: child.name,
        hidden: child.displayType.hidden,
        readOnly: child.displayType.readOnly,
        disabled: child.displayType.disabled,
        alphanumericType: child.alphanumericType ? child.alphanumericType : '',
        alphanumericTypeWithHyphen: child.alphanumericTypeWithHyphen
          ? child.alphanumericTypeWithHyphen
          : '',
        maxLength: child.maxLength ? child.maxLength : '',
        type: child.type,
        options: child.options ? child.options : [],
        displayType: {
          hidden: child.displayType.hidden
        },
        needBulkOperation: child.needBulkOperation ? child.needBulkOperation : ''
      })
      if (child.type === 'autocomplete') {
        adaccessioGroupTypeObj.push({ id: child.id, options: [] })
      }
    })
  }

  const constructAdResponse = (obj) => {
    // Reset the account array to blank array before starting any operation
    setAdGroupArray([])
    const adGroupObj = []
    const adGroupSummaryObj = []
    const adaccessioGroupTypeObj = []
    // Logic for looping provided obj and setting Account, Summary and prefetched options
    obj.forEach((block) => {
      if (!block.children && !block.substeps) {
        return
      }
      if (block.children) {
        adGroupObjGenerator(block.children, adGroupObj, adGroupSummaryObj, adaccessioGroupTypeObj)
      }
      if (block.substeps) {
        block.substeps.forEach((child) => {
          adGroupObjGenerator(child.children, adGroupObj, adGroupSummaryObj, adaccessioGroupTypeObj)
        })
      }
    })
    // Logic to handle prepopulated default field
    const refinedADObj = adGroupObj.map((childEnt) => {
      // Set information about recepient. This defaults to current logged in user

      const updatedProfileName =
        userProfile.firstName && userProfile.lastName
          ? `${userProfile.firstName} ${userProfile.lastName}`
          : ''
      if (childEnt.id === 'recipient') {
        // Set receipient option with same value
        const targetIndex = adaccessioGroupTypeObj.findIndex((data) => data.id === 'recipient')
        adaccessioGroupTypeObj[targetIndex].options.push({
          label: updatedProfileName,
          value: userProfile.email
        })
        return {
          ...childEnt,
          value: {
            label: updatedProfileName,
            value: userProfile.email
          }
        }
      }
      if (childEnt.id === 'accountStatus') {
        return {
          ...childEnt,
          displayLabel: ['512', '66048'].includes(childEnt.value) ? 'Enabled' : 'Disabled'
        }
      }
      return childEnt
    })

    // Set account information object
    setAdGroupArray(refinedADObj)
    // Set prefetched autocomplete options
    setPrefetchedOptions(adaccessioGroupTypeObj)
    dispatch(setadAdGroupInitialState({ data: refinedADObj }))
  }

  const handleConfirm = () => {
    history.push('/dashboard')
  }
  const handleCancel = () => {
    setOpen(true)
    setButtonReference('cancel')
    dispatch(updateShowBigLoader(false))
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
      dispatch(updateShowBigLoader(true))

      const listofErrors = []
      clearFilters()
      const result = await axios({
        url: '/v0/group/create/bulkValidation',
        data: payload,
        method: 'post'
      })
        .then((res) => res)
        .catch((err) => {
          console.error(err)
          return null
        })
      if (result?.data?.Error) {
        if (result.data.RequestUniqueness !== 'Valid') {
          listofErrors.push(`${inValidReqUniqueness} `)
        } else {
          const isValidField = (value) =>
            validationColumns.filter(
              (val) => val.id === value && val.relatedTo.includes(accessioGroupType)
            ).length
          if (
            result.data.ApplicationNARId !== 'Valid' &&
            (isValidField('dbagApplicationID') || isValidField('samDbagApplicationID'))
          ) {
            if (adAccount.common.groupDetails.dbagApplicationID === '') {
              listofErrors.push(
                `${emptyNarId} (${adAccount.common.groupDetails.dbagApplicationID})`
              )
            } else {
              listofErrors.push(
                `${inValidNarId} (${adAccount.common.groupDetails.dbagApplicationID})`
              )
            }
          }
          if (result.data.CostCenter !== 'Valid' && isValidField('dbagCostcenter')) {
            listofErrors.push(
              `${inValidCostCenter} (${adAccount.common.groupDetails.dbagCostcenter})`
            )
          }
          if (result.data.Department !== 'Valid' && isValidField('department')) {
            listofErrors.push(`${inValidDep} (${adAccount.common.groupDetails.department})`)
          }
          if (result.data.AccessioGroupName !== 'Valid') {
            listofErrors.push(
              `${inValidAccessioGroupName} (${adAccount.common.groupDetails?.displayName})`
            )
          }
          if (result.data.Location !== 'Valid') {
            listofErrors.push(`${inValidLocation} (${adAccount.common.groupDetails?.location})`)
          }
          if (
            !result.data.GroupDN ||
            result.data.GroupDN.includes('Error') ||
            result.data.GroupDN.includes('Invalid') ||
            [null, 'null', 'NULL', '', undefined].includes(
              result.data.GroupDN.substring(1, result.data.GroupDN.length - 1)
            )
          ) {
            listofErrors.push(`${inValidGroupDN}`)
          }
          if (
            adAccount.common.groupDetails?.dbagSupportGroup &&
            result.data.DbUnitySupportGroup !== 'Valid' &&
            isValidField('dbagsupportGroup')
          ) {
            listofErrors.push(
              `${inValidDBUnity} (${
                adAccount.common.groupDetails?.dbagSupportGroup
                  ? adAccount.common.groupDetails?.dbagSupportGroup
                  : ''
              })`
            )
          }
          if (
            adAccount.common.groupDetails?.dbagInfrastructureID &&
            result.data.Infra_Nar_Id !== 'Valid' &&
            isValidField('dbagInfrastructureID')
          ) {
            listofErrors.push(
              `${inValidInfraID} (${
                adAccount.common.groupDetails?.dbagInfrastructureID
                  ? adAccount.common.groupDetails?.dbagInfrastructureID
                  : ''
              })`
            )
          }
          if (
            adAccount.common.groupDetails?.mAMs &&
            result.data.MAMs !== 'Valid' &&
            isValidField('mAMs')
          ) {
            listofErrors.push(
              `${inValidMAMs} (${
                adAccount.common.groupDetails?.mAMs ? adAccount.common.groupDetails?.mAMs : ''
              })`
            )
          }
          if (
            adAccount.common.groupDetails?.dbagIMSAuthContact &&
            result.data.AuthContact !== 'Valid' &&
            isValidField('dbagIMSAuthContact')
          ) {
            listofErrors.push(
              `${inValidAuthContact} (${
                adAccount.common.groupDetails?.dbagIMSAuthContact
                  ? adAccount.common.groupDetails?.dbagIMSAuthContact
                  : ''
              })`
            )
          }
          if (
            adAccount.common.groupDetails?.dbagIMSAuthContactDelegate &&
            result.data.AuthContactDelegate !== 'Valid' &&
            isValidField('dbagIMSAuthContactDelegate')
          ) {
            listofErrors.push(
              `${inValidAuthContactDelegate} (${
                adAccount.common.groupDetails?.dbagIMSAuthContactDelegate
                  ? adAccount.common.groupDetails?.dbagIMSAuthContactDelegate
                  : ''
              })`
            )
          }
          if (
            adAccount.common.groupDetails?.dbagIMSApprovers &&
            result.data.GroupOwner !== 'Valid' &&
            isValidField('dbagIMSApprovers')
          ) {
            listofErrors.push(
              `${inValidGroupOwner} (${
                adAccount.common.groupDetails?.dbagIMSApprovers
                  ? adAccount.common.groupDetails?.dbagIMSApprovers
                  : ''
              })`
            )
          }
        }
        if (listofErrors?.length) {
          validationStatus.errorMessage = listofErrors.join(', ')
          validationStatus.error = true
          errorMessages.push(`${Erroratline} ${index + 1} : ${validationStatus.errorMessage}`)
          setErrorEntries((prev) => [...prev, array[index]])
        }
      }
      processRequest1 += 1
      setProcessRequest({
        totalRequest: adAccountArray.length,
        ongoingRequest: processRequest1
      })

      if (listofErrors.length === 0) {
        const accountArray = array.filter(
          (item) => item.samAccount.toLowerCase() === adAccount.common.groupDetails.cn.toLowerCase()
        )
        const updateadGroup = adAccount
        const description = prepareGroupDescription(accountArray, result?.data?.AppNarIdLabel)
        updateadGroup.common.groupDetails.description = [description]
        updateadGroup.common.groupDetails.__NAME__ = result.data.GroupDN ? result.data.GroupDN : ''
        updateadGroup.common.groupDetails.distinguishedName = result.data.GroupDN
          ? result.data.GroupDN
          : ''

        await callSubmitAccount(result, updateadGroup, index)
      }
      if (processRequest1 === adAccountArray.length) {
        setErrors(errorMessages)
        dispatch(updateShowBigLoader(false))
        setProcessRequest({
          totalRequest: 0,
          ongoingRequest: 0
        })
      }
    }

    adAccountArray.forEach((adAccount, index) => {
      const validationPayload = {
        Application_NAR_Id: adAccount.common?.groupDetails?.dbagApplicationID
          ? adAccount.common.groupDetails.dbagApplicationID[0]
          : '',
        Infra_Nar_Id: adAccount.common?.groupDetails?.dbagInfrastructureID
          ? adAccount.common.groupDetails.dbagInfrastructureID[0]
          : '',
        MAMs: adAccount.common?.groupDetails?.mAMs ? adAccount.common.groupDetails.mAMs[0] : '',
        AuthContact: adAccount.common?.groupDetails?.dbagIMSAuthContact
          ? adAccount.common.groupDetails.dbagIMSAuthContact
          : '',
        AuthContactDelegate: adAccount.common?.groupDetails?.dbagIMSAuthContactDelegate
          ? adAccount.common.groupDetails.dbagIMSAuthContactDelegate
          : '',
        GroupOwner: adAccount.common?.groupDetails?.dbagIMSApprovers
          ? adAccount.common.groupDetails.dbagIMSApprovers
          : [],
        CostCenter: adAccount.common?.groupDetails?.dbagCostcenter
          ? adAccount.common.groupDetails.dbagCostcenter
          : '',
        Department: adAccount.common?.groupDetails?.department
          ? adAccount.common.groupDetails.department
          : '',
        DbUnitySupportGroup: adAccount.common?.groupDetails?.dbagSupportGroup
          ? adAccount.common?.groupDetails?.dbagSupportGroup
          : '',
        GroupCN: adAccount.common?.groupDetails?.displayName
          ? adAccount.common.groupDetails.displayName
          : '',
        Location: adAccount.common?.groupDetails?.location
          ? adAccount.common?.groupDetails?.location
          : '',
        ADGroupType: adAccount.common?.groupDetails?.accessioGroupType
          ? adAccount.common?.groupDetails?.accessioGroupType
          : '',
        Domain: adAccount.common?.groupDetails?.domain ? adAccount.common?.groupDetails?.domain : ''
      }
      validateAdAccount(validationPayload, adAccount, index)
    })
  }, [adAccountArray])

  useEffect(() => {
    if (successCounter > 0) {
      dispatch(
        updateReviewNotificationMessage({
          type: 'Success',
          message: `${successCounter} ${successCounter === 1 ? 'group' : 'groups'} ${successSuffix}`
        })
      )
      setSuccessMessage(
        `${successCounter} ${successCounter === 1 ? 'group' : 'groups'} ${successSuffix}`
      )
    }
  }, [successCounter])

  useEffect(() => {
    if (adGroupType !== '') {
      adGroupApi
        .getAdGroupType(`/v0/governance/getADGroupType?adGroupType=${adGroupType}`)
        .then((res) => {
          if (res && res.length > 0) {
            setAdGroupArray((updatedList) =>
              updatedList.map((item) => {
                if (item.id === 'adGroupSubType') {
                  return {
                    ...item,
                    hidden: false,
                    value: res.length === 1 ? res[0].value : '',
                    displayLabel: res.length === 1 ? res[0].label : ''
                  }
                }
                return item
              })
            )
            const targetIndex = adGroupDataArray.findIndex((field) => field.id === 'adGroupSubType')
            if (targetIndex > 0) {
              setAdGroupDataArray((updatedList) =>
                updatedList.map((item) => {
                  if (item.id === 'adGroupSubType') {
                    return {
                      ...item,
                      options: res
                    }
                  }
                  return item
                })
              )
            } else {
              setAdGroupDataArray([...adGroupDataArray, { id: 'adGroupSubType', options: res }])
            }
            if (res.length === 1) {
              setAdGroupSubType(res[0].value)
            }
          }
        })
    }
  }, [adGroupType])

  useEffect(() => {
    if (adGroupSubType !== '') {
      adGroupApi
        .getAdGroupType(
          `/v0/governance/getADGroupType?adGroupType=${adGroupType}&adGroupSubType=${adGroupSubType}`
        )
        .then((res) => {
          if (res && res.length > 0) {
            setAdGroupArray((updatedList) =>
              updatedList.map((item) => {
                if (item.id === 'accessioGroupType') {
                  return {
                    ...item,
                    hidden: false,
                    value: res.length === 1 ? res[0].value : '',
                    displayLabel: res.length === 1 ? res[0].label : ''
                  }
                }
                return item
              })
            )
            const targetIndex = adGroupDataArray.findIndex(
              (field) => field.id === 'accessioGroupType'
            )
            if (targetIndex > 0) {
              setAdGroupDataArray((updatedList) =>
                updatedList.map((item) => {
                  if (item.id === 'accessioGroupType') {
                    return {
                      ...item,
                      options: res
                    }
                  }
                  return item
                })
              )
            } else {
              setAdGroupDataArray([...adGroupDataArray, { id: 'accessioGroupType', options: res }])
            }
            if (res.length === 1) {
              setAccessioGroupType(res[0].value)
              const ObjectTemplateIndex = samAccountDataStructure.findIndex(
                (field) => field.category === res[0].value
              )
              setSamAccountObject(samAccountDataStructure[ObjectTemplateIndex])
              const groupObjectTemplateIndex = descriptionStructure.findIndex(
                (field) => field.category === res[0].value
              )
              setDescriptionObject(descriptionStructure[groupObjectTemplateIndex])
            }
          }
        })
    }
  }, [adGroupSubType])
  useEffect(() => {
    if (accessioGroupType !== '') {
      generateCsvFileForDownload()
    }
  }, [accessioGroupType])
  useEffect(() => {
    if (descriptiontObject && Object.keys(descriptiontObject).length > 0) {
      setAdGroupArray((updatedList) =>
        updatedList.map((item) => {
          if (item.id === 'compiledGroupDescription') {
            return {
              ...item,
              value:
                (descriptiontObject.prefix ? `${descriptiontObject.prefix}, ` : '') +
                descriptiontObject.text.filter(Boolean).join(', ') +
                (descriptiontObject.suffix ? `${descriptiontObject.suffix}, ` : ''),
              displayLabel:
                (descriptiontObject.prefix ? `${descriptiontObject.prefix}, ` : '') +
                descriptiontObject.text.filter(Boolean).join(', ') +
                (descriptiontObject.suffix ? `${descriptiontObject.suffix}, ` : ''),
              error: false,
              helperText: ''
            }
          }
          return item
        })
      )
    }
  }, [descriptiontObject])
  useEffect(() => {
    if (samAccountObject && Object.keys(samAccountObject).length > 0) {
      setAdGroupArray((updatedList) =>
        updatedList.map((item) => {
          if (item.id === 'samAccount') {
            return {
              ...item,
              value:
                (samAccountObject.prefix ? `${samAccountObject.prefix}-` : '') +
                samAccountObject.text.filter(Boolean).join('-') +
                (samAccountObject.suffix ? `${samAccountObject.suffix}-` : ''),
              displayLabel:
                (samAccountObject.prefix ? `${samAccountObject.prefix}-` : '') +
                samAccountObject.text.filter(Boolean).join('-') +
                (samAccountObject.suffix ? `${samAccountObject.suffix}-` : ''),
              error: false,
              helperText: ''
            }
          }
          return item
        })
      )
    }
  }, [samAccountObject])
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

    adGroupApi.getCreateADGroup().then((res) => {
      setSamAccountDataStructure(res.SAMAccountDataStucture)
      setDescriptionStructure(res.descriptionStructure)
      constructAdResponse(res.steps)
      setSteps(res.steps)
      // changes to load select when Ad group type is not selected
      const updatedStepZero = res.steps[0]?.children?.map((item) => {
        if (item.id === 'adGroupSubType') {
          const options = item.options.filter((option) => option.value.includes('Select'))
          const newItem = { ...item, options }
          return newItem
        }
        return item
      })

      setSteps((prevState) =>
        prevState.map((item, index) =>
          index === 0 ? { ...item, children: updatedStepZero } : item
        )
      )
    })
    adGroupApi.getAdGroupType('/v0/governance/getADGroupType').then((res) => {
      setAdGroupDataArray([
        { id: 'adGroupType', options: res?.sort((a, b) => a.value.localeCompare(b.value)) }
      ])
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
            label: translate('navItem.label.createBulkRequestsAdGroup'),
            url: ''
          }
        ]}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Styled.HeaderWrapper>
          <h1 style={{ fontWeight: 'normal', marginBottom: '10px' }}>
            {translate('create.bulkrequest.adGroup.title')}
          </h1>
        </Styled.HeaderWrapper>
      </div>

      <Styled.MainWrapper>
        <Box p={5}>
          <p>{csvNotification}</p>
          {steps.map((item, index) => (
            <div>
              {item.substeps &&
                item.substeps.map((substep) => (
                  <>
                    <Grid container spacing={{ xs: 2 }}>
                      {substep.children &&
                        substep.children.map((element) =>
                          element.id === 'adGroupType' ||
                          element.id === 'adGroupSubType' ||
                          element.id === 'accessioGroupType'
                            ? formGenerator(
                                element,
                                handlefieldChanges,
                                displayFields,
                                handleDisplayValue,
                                helperFinder,
                                adGroupDataArray,
                                valueFinder,
                                errorFinder,
                                optionFinder,
                                optionReset,
                                disabledFlagFinder,
                                readOnlyFlagFinder,
                                hiddenFlagFinder,
                                index === 1 ? 10 : columnSX
                              )
                            : ''
                        )}
                    </Grid>
                  </>
                ))}
            </div>
            /* </Box> */
          ))}
        </Box>
        {accessioGroupType !== '' ? (
          <Box pr={5} pl={5} pb={5}>
            <Button
              onClick={() => downloadCSV()}
              variant="outlined"
              component="label"
              disabled={accessioGroupType === ''}
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
          </Box>
        ) : (
          ''
        )}

        {accessioGroupType !== '' ? (
          <Box key="addcsv" pr={5} pl={5} pb={5}>
            <hr />
            <p>{translate('create.bulkuploadmessage')}</p>
            <div>
              {fileDetails()}
              <Button
                variant="outlined"
                component="label"
                disabled={accessioGroupType === ''}
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
            </div>
          </Box>
        ) : (
          ''
        )}

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
                    ${Errorheading}{' '}
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
                dispatch(updateShowBigLoader(false))
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

export default BulkCreateAdGroup
