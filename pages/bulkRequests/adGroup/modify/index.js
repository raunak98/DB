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
import { Button, Typography, Grid, FormControl, FormControlLabel, Checkbox } from '@mui/material'
import { styled } from '@mui/material/styles'
import Link from '@mui/material/Link'
import Breadcrumb from 'components/breadcrumb'
import translate from 'translations/translate'
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
import * as adGroupApi from '../../../../api/groupManagement'
import * as assetsApi from '../../../../api/assetsManagement'

import * as profileAPI from '../../../../api/profile'
import axios from '../../../../axios'
import { applicationNamePrefix, isValidEmail } from '../../../../helpers/utils'
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

// This code is commented as Download Template button is hidden. Once get approval from Harish will use this code or remove this
// const csvExampleRow = {
//   groupName: 'Group Name',
//   domain: 'DBG',
//   RobotBusinessDescription: 'Description for Robot business',
//   accessioGroupType: 'Accessio Group Type',
//   accessioPrerequisiteRMPRoles: '"Application Operations Internal(L1,L2,L3)"',
//   accessioPrerequisiteRMPRolesText: '"Application Operations Internal(L1,L2,L3)"',
//   dbagIMSDataSecCLass: 'Confidential',
//   adGroupSubType: 'Ad Group SubType',
//   adGroupType: 'Ad Group Type',
//   businessJustification: 'Here you can add business justification',
//   compiledGroupDescription: 'Group Description',
//   dbagsupportGroup: 'test',
//   dbagApplicationID: '134425-1',
//   dbagCostcenter: '6201126695',
//   dbagExternalProvider: 'test',
//   dbagFileSystemFullPaths: 'test',
//   dbagIMSApprovers: 'IMS approver ',
//   dbagIMSAuthContact: 'test',
//   dbagIMSAuthContactDelegate: 'test',
//   dbagInfrastructureID: '46965-1',
//   dbagProcessingdata: 'test',
//   department: 'Other Assets & Liabilities',
//   description: 'Description for AD group',
//   distinguishedName: 'Distinguished Name',
//   entitlement: 'test',
//   entitlementOther: 'test',
//   info: 'Comment',
//   mAMs: 'NAR ID MAMs',
//   samAccount: 'test',
//   dbagSupportGroup: 'Support Group',
//   dbagDataPrivClass: 'No(Default)',
//   dwsPrivate: 'No',
//   clientPrivate: 'No',
//   dbPrivate: 'No'
// }

const BulkModifyAdGroup = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [open, setOpen] = React.useState(false)
  const [array, setArray] = useState([])
  const [userProfile, setUserProfile] = useState({})
  const [errors, setErrors] = useState([])
  const [successMessage, setSuccessMessage] = useState('')
  const [successCounter, setSuccessCounter] = useState(0)
  const [adGroupArray, setAdGroupArray] = useState([])
  const [errorEntries, setErrorEntries] = useState([])
  const [successButtonName, setSuccessButtonName] = useState('upload')
  const [selectedColumns, setSelectedColumns] = useState([])
  const [columns, setColumns] = useState([])
  const [validationColumns, setValidationColumns] = useState([])
  const [buttonReference, setButtonReference] = useState('')
  const [processRequest, setProcessRequest] = useState({ ongoingRequest: 0, totalRequest: 0 })
  const [adGroupPayloadArray, setAdGroupPayloadArray] = useState([])
  const [columnNamesForBulkValidation, setColumnNamesForBulkValidation] = useState([])
  const [samAccountStructure, setSamAccountStructure] = useState({})
  const [modifyGroupArray, setModifyGroupArray] = useState({})
  // const [descriptionStructure, setDescriptionStructure] = useState({})

  const showBigLoader = useSelector(selectShowBigLoader)
  const history = useHistory()
  const maxlengthError = translate('create.bulkerrormessage')
  const norecordsError = translate('create.bulknorecords')
  const formatError = translate('format.error')
  const csvNotification = translate('modify.bulkrequest.csvNotification')
  const invalidEmailFormat = translate('form.invalidEmailFormat')
  const invalidAuthContactAndDelegate = translate('form.invalidAuthContactAndDelegate')
  const minApprover = translate('form.approverMinVal')
  const duplicateApprover = translate('form.duplicateApproverVal')
  const alphaNumericValidation = translate('create.bulkrequest.alphaNumericValidationMessage')
  const mandatoryErrorMessage = translate('form.mandatoryErrorMessage')
  const inValidDBUnity = translate('create.inValidDBUnity')
  const inValidAuthContact = translate('create.inValidAuthContact')
  const inValidAuthContactDelegate = translate('create.inValidAuthContactDelegate')
  const inValidGroupOwner = translate('create.inValidGroupOwner')
  const inValidGroupDN = translate('create.inValidGroupDN')
  // const inValidLocation = translate('create.inValidbulklocation')
  const inValidAccessioGroupName = translate('create.inValidAccessioGroupName')
  const inValidDep = translate('create.inValidDep')
  const inValidCostCenter = translate('create.inValidCostCenter')
  const emptyNarId = translate('create.emptyNarId')
  const emptyInfraId = translate('create.emptyInfraId')
  const inValidNarId = translate('modify.inValidNarId')
  const inValidInfraId = translate('modify.inValidInfraId')
  const inValidReqUniqueness = translate('create.inValidReqUniqueness')
  const apiError = translate('modify.apiError')
  const justificationError = translate('form.alphaNumericValidationMessage')
  const groupDescriptionError = translate('  form.groupDescriptionValidation')
  const inValidMAMs = translate('create.inValidMAMs')
  const successSuffix = translate('create.bulkrequest.addRemove.successSuffix')
  const businessJustificationLength = translate('delete.bulkrequest.maxLengthJustificationError')
  const invalidMissingHeaders = translate('modify.invalidOrMissingColumn')
  const csvHeaderSuffix = translate('delete.wrongHeader')
  const errorAtLine = translate('modify.errorLine')
  const Erroratline = translate('comment.Erroratline')
  const of = translate('comment.of')
  const entriesContainError = translate('comment.entriescontainserror')

  let processRequest1 = 0
  const errorMessagesData = []

  const getNotificationMessage = useSelector(selectNotificationMessage)

  const dispatch = useDispatch()

  const { theme } = useTheme()

  const handleChange = (event, value) => {
    if (value) {
      const newSelectedColumn = [...selectedColumns, event.target.name]
      setSelectedColumns(newSelectedColumn)
    } else {
      const newSelectedColumn = [...selectedColumns] // make a separate copy of the array
      const index = newSelectedColumn.indexOf(event.target.name)
      if (index !== -1) {
        newSelectedColumn.splice(index, 1)
        setSelectedColumns(newSelectedColumn)
      }
    }
  }

  const clearFilters = () => {
    setErrors([])
    setErrorEntries([])
    setSuccessMessage('')
  }

  const clearFile = () => {
    setSuccessButtonName('upload')
    setSelectedFile('')
    clearFilters()
  }

  const movetoHistory = () => {
    history.push('/history/requestHistory')
  }

  const fileDetails = () => (
    <StyledTag label={selectedFile?.name ? selectedFile?.name : ''} onClick={() => clearFile()} />
  )

  const checkValuesFromMeta = async (type, value, accessioGroupType) => {
    let filteredValue = []

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

  const getLabelFromValue = (id, value) => {
    let filteredValue = []

    const filteredType = adGroupArray?.filter(
      (eachchild) => eachchild?.id?.toLowerCase() === id?.toLowerCase()
    )
    filteredValue = filteredType[0]?.options?.filter(
      (eachOption) =>
        eachOption?.value?.toLowerCase() ===
        (Array.isArray(value) ? value[0]?.toLowerCase() : value?.toLowerCase())
    )
    return filteredValue?.length > 0 ? filteredValue[0]?.label : filteredValue
  }

  const validateRow = async (rowData) => {
    const validationStatus = { error: false, errorMessage: '' }
    const errorMessge = []
    const mandetoryFailed = []
    let matchedCategory = []
    let isSameAuthContactAndDelegate = false
    if (rowData.samAccount) {
      const samAccountName = rowData.samAccount
      const samAccountNameString = samAccountName.split('-').join('')
      const cateogoryName = samAccountStructure.map((item) => {
        const prefixString = item?.prefix.split('-')
        const arrString = item?.prefix.length > 0 && prefixString.join('')
        return {
          matchedstring: typeof arrString === 'string' ? arrString.toLowerCase() : arrString,
          category: item?.category
        }
      })

      matchedCategory = cateogoryName.filter((item) =>
        samAccountNameString.toLowerCase().includes(item?.matchedstring)
      )?.[0]?.category
    }

    const columnsForValidation = modifyGroupArray.filter(
      (col) => col.relatedTo.includes(matchedCategory) || col.id === 'businessJustification'
    )

    // eslint-disable-next-line no-restricted-syntax
    for (const column of validationColumns) {
      // validationColumns.forEach((column) => {
      const applicableColumn = columnsForValidation.filter((item) => item?.id === column?.id)
      if (
        applicableColumn.length > 0 ||
        ['samAccount', 'domain', 'businessJustification'].includes(column.id)
      ) {
        if (column.requiredField) {
          if (rowData[column?.id] !== undefined && rowData[column?.id]?.trim() === '') {
            validationStatus.error = true
            mandetoryFailed.push(column.label)
          }
        }
        if (
          rowData[column.id] &&
          column.alphanumericType &&
          ![
            'dbagIMSAuthContact',
            'dbagIMSAuthContactDelegate',
            'dbagIMSApprovers',
            'description'
          ].includes(column.id) &&
          rowData[column.id].trim()
        ) {
          if (
            !/^[a-zA-Z0-9_\-\\.@/ ]*$/.test(rowData[column.id]) &&
            ['dbagFileSystemFullPaths'].includes(column.id)
          ) {
            validationStatus.error = true
            errorMessge.push(`${column.label}: ${alphaNumericValidation}(${rowData[column.id]})`)
          } else if (
            !['dbagFileSystemFullPaths', 'businessJustification'].includes(column.id) &&
            !rowData[column.id].match(
              /^([a-zA-Z0-9\u0600-\u06FF\u0660-\u0669\u06F0-\u06F9 _.-@]+)$/
            )
          ) {
            validationStatus.error = true
            errorMessge.push(`${column.label}: ${alphaNumericValidation}(${rowData[column.id]})`)
          }
        }
        if (rowData[column.id] && column.maxLength > 0 && rowData[column.id].trim()) {
          if (rowData[column.id].length > column.maxLength) {
            validationStatus.error = true
            if (column?.id === 'businessJustification') {
              errorMessge.push(businessJustificationLength)
            } else {
              errorMessge.push(
                `${column.label}: max Length is ${column.maxLength}(${rowData[column.id]})`
              )
            }
          }
        }
        if (
          rowData[column.id] &&
          column.type === 'dropdown' &&
          rowData[column.id].trim() &&
          column.id !== 'domain'
        ) {
          // eslint-disable-next-line no-await-in-loop
          const filteredValue = await checkValuesFromMeta(
            column.id,
            rowData[column.id],
            matchedCategory
          )
          if (filteredValue.length === 0) {
            if (['endlocation', 'samLocation', 'cyberarkregion', 'dlpou'].includes(column.id)) {
              validationStatus.error = true
              errorMessge.push(
                `Invalid value of ${column.label} for the provided domain.(${rowData[column.id]})`
              )
            } else {
              validationStatus.error = true
              errorMessge.push(`Invalid value of ${column.label}. (${rowData[column.id]})`)
            }
          }
        }
        if (
          column?.id === 'businessJustification' &&
          rowData[column?.id]?.trim() &&
          !/^[a-zA-Z0-9_\-\\.@ ]*$/.test(rowData[column.id].trim())
        ) {
          validationStatus.error = true
          errorMessge.push(`${column.label}: ${justificationError}(${rowData[column.id]})`)
        }
        if (
          column?.id === 'description' &&
          rowData[column?.id]?.trim() &&
          !/^[a-zA-Z0-9_\-\\; ]*$/.test(rowData[column.id].trim())
        ) {
          validationStatus.error = true
          errorMessge.push(`${column.label}: ${groupDescriptionError}(${rowData[column.id]})`)
        }
        if (rowData[column.id] && column.id === 'dbagIMSApprovers' && rowData[column.id].trim()) {
          if (rowData[column.id].split(';').length < 3) {
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
          rowData[column.id] &&
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
    }
    if (mandetoryFailed.length) {
      errorMessge.push(`${mandatoryErrorMessage}(${mandetoryFailed.join(',')})`)
    }
    validationStatus.errorMessage = errorMessge.join('; ')
    return validationStatus
  }

  const validateFileDetails = async (data) => {
    clearFilters()
    const errorMessages = []
    dispatch(updateShowBigLoader(true))
    if (data.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [index, item] of data.entries()) {
        // eslint-disable-next-line no-await-in-loop
        const status = await validateRow(item)
        if (status.error) {
          errorMessages.push(`${errorAtLine}  ${index + 1} : ${status.errorMessage}`)
        }
      }
    }

    if (errorMessages.length) {
      setErrors(errorMessages)
      dispatch(
        updateReviewNotificationMessage({
          type: 'Error',
          message: `${errorMessages.length} ${of} ${data.length} ${entriesContainError}`
        })
      )
    } else {
      setOpen(true)
    }
    dispatch(updateShowBigLoader(false))
  }

  // const prepareGroupDescription = (data) => {
  //   const updatedArray = data
  //   const groupDescriptionStructure = descriptionStructure.filter(
  //     (item) => item.category === accessioGroupType
  //   )
  //   updatedArray.forEach((v, i) => {
  //     const groupDescriptionTextValues = []
  //     groupDescriptionStructure[0].text.forEach((vl) => {
  //       groupDescriptionTextValues.push(updatedArray[i][vl] ? updatedArray[i][vl] : vl)
  //     })
  //     updatedArray[i].compiledGroupDescription = groupDescriptionStructure[0].prefix
  //       ? `${groupDescriptionStructure[0].prefix}, ${groupDescriptionTextValues.join(', ')}`
  //       : `${groupDescriptionTextValues.join(', ')}`
  //   })
  // }

  const csvFileToArray = (string) => {
    const csvString = string?.trim()
    const headerInput = csvString.split('\n')[0].split(',')
    const csvHeaderInput = headerInput.map((value) => value.replace(/(\r\n|\n|\r)/gm, ''))
    const csvHeader = []
    const validationErrorMessages = []
    const columnNamesForBulkValidationcsv = []
    const mandatoryHeaders = ['Group Name', 'Group Domain', 'Business Justification']
    const mandatoryHeadersValidation = []
    const invalidHeaders = []
    mandatoryHeaders.forEach((header) => {
      if (!csvHeaderInput.includes(header)) {
        mandatoryHeadersValidation.push(header)
      }
    })
    if (mandatoryHeadersValidation.length === 0) {
      csvHeaderInput.forEach((item, index) => {
        const filterData = adGroupArray.filter(
          (data) =>
            (!data?.displayType?.hidden ||
              data?.needBulkOperation ||
              ['businessJustification', 'samAccount', 'entitlementOther'].includes(data?.id)) &&
            (data?.label === item ||
              (data?.id === 'accessioPrerequisiteRMPRolesText' &&
                data?.labelForBulk &&
                data?.labelForBulk === item))
        )
        if (filterData.length > 0) {
          csvHeader[index] = filterData[0].id
          columnNamesForBulkValidationcsv.push(filterData[0].id)
        } else if (item !== 'Group Domain') {
          invalidHeaders.push(item)
        }
      })

      csvHeader.splice(1, 1, 'domain') // ALM1991 : Added this Explictly,As we are not getting domain from Metadata

      if (invalidHeaders.length > 0) {
        validationErrorMessages.push(
          `${invalidMissingHeaders} : ${invalidHeaders.join(', ')}. ${csvHeaderSuffix}`
        )
        setErrors(validationErrorMessages)
      } else {
        const csvRows = csvString.split('\n').splice(1)

        const newArray = csvRows.map((i) => {
          const values = i.trim().split(',')

          const obj = csvHeader.reduce((object, header, index) => {
            const inputObj = object
            inputObj[header] =
              header === 'accessioPrerequisiteRMPRoles' &&
              values[index] &&
              values[index].includes(';')
                ? values[index].replaceAll(';', ',')
                : values[index]
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
          // Below function is commented because we do not have accessio group type we can not identify the rule for group description
          // prepareGroupDescription(newArray)
          validateFileDetails(newArray)
        }
        setArray(newArray)
        setColumnNamesForBulkValidation(columnNamesForBulkValidationcsv)
      }
    } else {
      validationErrorMessages.push(
        `${invalidMissingHeaders} : ${mandatoryHeadersValidation.join(', ')}. ${csvHeaderSuffix}`
      )
      setErrors(validationErrorMessages)
    }
  }

  const getHeader = (headers) => {
    const headerData = {
      // samAccount: 'Group Name',
      groupName: 'Group Name',
      domain: 'Group Domain',
      dbagApplicationID: 'Application NAR ID',
      info: 'Comment',
      dbagCostcenter: 'Cost Center',
      department: 'Department',
      dbagExternalProvider: 'Enable Cloud Sync',
      dbagIMSApprovers: 'Group Approvers',
      dbagIMSAuthContact: 'Group Authorization Contact',
      dbagIMSAuthContactDelegate: 'Group Authorization Delegate',
      description: 'Group Description',
      dbagIMSDataSecCLass: 'Data Security class',
      dbagInfrastructureID: 'Infra NAR ID',
      mAMs: 'MAMs',
      dbagFileSystemFullPaths: 'Paths',
      dbagProcessingdata: 'Processing Data',
      dbagDataPrivClass: 'Provides access to Price Sensitive Information?',
      entitlement: 'Entitlement',
      entitlementOther: 'Entitlement Other',
      RobotBusinessDescription: 'Robot Business Description',
      dbagSupportGroup: 'Support Group',
      // distinguishedName: 'Distinguished Name',
      dwsPrivate: 'DWS Private',
      clientPrivate: 'Client Private',
      dbPrivate: 'DB Private',
      businessJustification: 'Business Justification',
      accessioPrerequisiteRMPRoles: 'Accessio Prerequisite RMP Roles',
      accessioPrerequisiteRMPRolesText: 'Accessio Prerequisite RMP Roles(Custom)',
      groupScope: 'Group Scope',
      groupType: 'Group Type'
    }
    const newData = headers.map((data) => headerData[data])
    return newData
  }

  const responseValueFinder = (res, fieldId) => {
    const targetIndex = res.findIndex((field) => field.id === fieldId)
    return res[targetIndex]?.value
  }

  const iff = (consition, then, otherise) => (consition ? then : otherise)

  const setGroupRecord = (result) => {
    let privateData
    let privateDataValues
    if (result?._source?.igaContent?.object?.dbagExtensionAttribute6?.length > 0) {
      const input = result?._source?.igaContent?.object?.dbagExtensionAttribute6
      privateData = Array.isArray(input) ? input[0]?.split('') : input?.split('')
      privateDataValues = privateData.map((item) => (item === '0' ? 'No' : 'Yes'))
    }
    let matchedCategory = []
    if (result?._source?.igaContent?.cn) {
      const samAccountName = result?._source?.igaContent?.cn
      const samAccountNameString = samAccountName.split('-').join('')
      const cateogoryName = samAccountStructure.map((item) => {
        const prefixString = item?.prefix.split('-')
        const arrString = item?.prefix.length > 0 && prefixString.join('')
        return {
          matchedstring: typeof arrString === 'string' ? arrString.toLowerCase() : arrString,
          category: item?.category
        }
      })

      matchedCategory = cateogoryName.filter((item) =>
        samAccountNameString.toLowerCase().includes(item?.matchedstring)
      )?.[0]?.category
    }

    const applicationID =
      result?._source?.igaContent?.dbagApplicationID &&
      Array.isArray(result?._source?.igaContent?.dbagApplicationID)
        ? result?._source?.igaContent?.dbagApplicationID[0]
        : iff(
            result?._source?.igaContent?.dbagApplicationID,
            result?._source?.igaContent?.dbagApplicationID,
            ''
          )
    const description =
      Array.isArray(result?._source?.igaContent?.description) &&
      result?._source?.igaContent?.description.length > 0
        ? result?._source?.igaContent?.description[0]
        : iff(
            result?._source?.igaContent?.description,
            result?._source?.igaContent?.description,
            ''
          )
    const dbagInfraId =
      result?._source?.igaContent?.dbagInfrastructureID &&
      Array.isArray(result?._source?.igaContent?.dbagInfrastructureID)
        ? result?._source?.igaContent?.dbagInfrastructureID[0]
        : iff(
            result?._source?.igaContent?.dbagInfrastructureID,
            result?._source?.igaContent?.dbagInfrastructureID,
            ''
          )
    return result
      ? [
          {
            id: 'groupName',
            value: result?._source?.igaContent?.cn ? result?._source?.igaContent?.cn : ''
          },
          {
            id: 'dbagApplicationID',
            value: matchedCategory !== 'Robot Object - Infrastructure Other' ? applicationID : ''
          },
          {
            id: 'domain',
            value:
              result?._source?.igaContent?.distinguishedName &&
              !['', undefined, null].includes(result?._source?.igaContent?.distinguishedName)
                ? result?._source?.igaContent?.distinguishedName
                    .split(',')
                    .slice(-4)[0]
                    ?.split('=')[1]
                : ''
          },
          {
            id: 'dbagCostcenter',
            value: !['', undefined, null].includes(result?._source?.igaContent?.dbagCostcenter)
              ? result?._source?.igaContent?.dbagCostcenter
              : ''
          },
          {
            id: 'department',
            value: !['', undefined, null].includes(result?._source?.igaContent?.object?.department)
              ? result?._source?.igaContent?.object?.department
              : ''
          },
          {
            id: 'description',
            value: description
          },
          {
            id: 'dbagInfrastructureID',
            value: dbagInfraId
          },
          { id: 'id', value: result?._source?.id ? result?._source?.id : '' },

          {
            id: 'dbagIMSDataSecCLass',
            value: result?._source?.igaContent?.dbagIMSDataSecCLass
              ? getLabelFromValue(
                  'dbagIMSDataSecCLass',
                  result?._source?.igaContent?.dbagIMSDataSecCLass
                )
              : ''
          },
          {
            id: 'dbagExternalProvider',
            value: result?._source?.igaContent?.dbagExternalProvider
              ? result?._source?.igaContent?.dbagExternalProvider
              : iff(result?.dbagExternalProvider, result?.dbagExternalProvider, '')
          },
          {
            id: 'info',
            value: result?._source?.igaContent?.object?.info
              ? result?._source?.igaContent?.object?.info
              : iff(result?.info, result?.info, '')
          },

          {
            id: 'dbagProcessingdata',
            value: result?._source?.igaContent?.dbagProcessingdata
              ? result?._source?.igaContent?.dbagProcessingdata
              : ''
          },
          {
            id: 'entitlement',
            value: result?._source?.igaContent?.dbagEntitlement
              ? result?._source?.igaContent?.dbagEntitlement
              : ''
          },
          {
            id: 'entitlementOther',
            value: result?._source?.igaContent?.entitlementOther
              ? result?._source?.igaContent?.entitlementOther
              : ''
          },

          {
            id: 'dbagFileSystemFullPaths',
            value: result?._source?.igaContent?.dbagFileSystemFullPaths
              ? result?._source?.igaContent?.dbagFileSystemFullPaths
              : ''
          },

          {
            id: 'RobotBusinessDescription',
            value: result?._source?.igaContent?.object?.RobotBusinessDescription
              ? result?._source?.igaContent?.object?.RobotBusinessDescription
              : ''
          },
          {
            id: 'mAMs',
            value: matchedCategory === 'Robot Object - Infrastructure Other' ? applicationID : ''
          },
          {
            id: 'accessioPrerequisiteRMPRoles',
            value:
              result?._source?.glossary?.idx &&
              result?._source?.glossary?.idx['/'] &&
              result?._source?.glossary?.idx['/']?.accessioPrerequisiteRMPRoles
                ? result?._source?.glossary?.idx['/']?.accessioPrerequisiteRMPRoles
                : ''
          },
          {
            id: 'dbagSupportGroup',
            value: result?._source?.igaContent?.dbagSupportGroup
              ? result?._source?.igaContent?.dbagSupportGroup
              : ''
          },
          {
            id: 'dbagIMSAuthContact',
            value: result?._source?.igaContent?.object?.dbagIMSAuthContact
              ? result?._source?.igaContent?.object?.dbagIMSAuthContact
              : ''
          },
          {
            id: 'dbagIMSAuthContactDelegate',
            value: result?._source?.igaContent?.object?.dbagIMSAuthContactDelegate
              ? result?._source?.igaContent?.object?.dbagIMSAuthContactDelegate
              : ''
          },
          {
            id: 'groupScope',
            value: result?._source?.igaContent?.object?.groupScope
              ? result?._source?.igaContent?.object?.groupScope
              : ''
          },
          {
            id: 'groupType',
            value: result?._source?.igaContent?.object?.groupType
              ? result?._source?.igaContent?.object?.groupType
              : ''
          },
          {
            id: 'dbagIMSApprovers',
            value:
              result?._source?.igaContent?.dbagIMSApprovers &&
              result?._source?.igaContent?.dbagIMSApprovers.length > 0
                ? result?._source?.igaContent?.dbagIMSApprovers.join(';')
                : ''
          },
          {
            id: 'dbagDataPrivClass',
            value: result?._source?.igaContent?.object?.dbagDataPrivClass
              ? iff(result?._source?.igaContent?.object?.dbagDataPrivClass === 'TRUE', 'Yes', 'No')
              : ''
          },
          {
            id: 'accessioPrerequisiteRMPRolesText',
            value:
              result?._source?.glossary?.idx &&
              result?._source?.glossary?.idx['/'] &&
              result?._source?.glossary?.idx['/']?.accessioPrerequisiteRMPRoles
                ? result?._source?.glossary?.idx['/']?.accessioPrerequisiteRMPRoles
                : ''
          },
          {
            id: 'dwsPrivate',
            value:
              result?._source?.igaContent?.object?.dbagExtensionAttribute6 &&
              result?._source?.igaContent?.object?.dbagExtensionAttribute6?.length > 0 &&
              Array.isArray(privateDataValues)
                ? privateDataValues[0]
                : ''
          },
          {
            id: 'clientPrivate',
            value:
              result?._source?.igaContent?.object?.dbagExtensionAttribute6 &&
              result?._source?.igaContent?.object?.dbagExtensionAttribute6?.length > 0 &&
              Array.isArray(privateDataValues)
                ? privateDataValues[1]
                : ''
          },
          {
            id: 'dbPrivate',
            value:
              result?._source?.igaContent?.object?.dbagExtensionAttribute6 &&
              result?._source?.igaContent?.object?.dbagExtensionAttribute6?.length > 0 &&
              Array.isArray(privateDataValues)
                ? privateDataValues[2]
                : ''
          },
          {
            id: 'businessJustification',
            value: result?._source?.igaContent?.object?.requestJustification
              ? result?._source?.igaContent?.object?.requestJustification
              : ''
          }
        ]
      : []
  }

  const downloadMyGroups = (data) => {
    const blob = new Blob([data], { type: 'text/csv' }) // Creating a Blob for having a csv file format and passing the data with type

    const url = window.URL.createObjectURL(blob) // Creating an object for downloading url

    const a = document.createElement('a') // Creating an anchor(a) tag of HTML

    a.setAttribute('href', url) // Passing the blob downloading url

    a.setAttribute('download', 'myGroups.csv') // Setting the anchor tag attribute for downloading, and passing the download file name

    a.click() // Performing a download with click
  }
  const csvmaker = (data, isGroupCSV = false) => {
    const csvRows = [] // Empty array for storing the values
    const headers = Object.keys(isGroupCSV ? data[0] : data) // setting headers
    const header = isGroupCSV ? getHeader(headers, true) : getHeader(headers)
    csvRows.push(header.join(',')) // headers sperated by comma(',')
    if (isGroupCSV) {
      data?.forEach((itm) => {
        csvRows.push(Object.values(itm).join(','))
      })
      return csvRows.join('\n')
    }
    const values = Object.values(data).join(',')
    csvRows.push(values)
    return csvRows.join('\n') // // Returning the array joining with new line
  }

  const downloadMyGroupCSV = async (ACLObject) => {
    let dataForFile = {}
    dataForFile.groupName = ''
    dataForFile.domain = ''
    dataForFile.businessJustification = ''

    const childArray = adGroupArray.filter(
      (col) =>
        selectedColumns.includes(col.id) &&
        !['accessioPrerequisiteRMPRoles', 'accessioPrerequisiteRMPRolesText'].includes(col.id)
    )
    childArray?.map((item1) => {
      dataForFile = { ...dataForFile, ...{ [item1.id]: '' } }
      return null
    })
    if (selectedColumns.includes('accessioPrerequisiteRMPRoles')) {
      dataForFile.accessioPrerequisiteRMPRoles = ''
      dataForFile.accessioPrerequisiteRMPRolesText = ''
    }

    const payload = {
      pageSize: 10000,
      pageNumber: 0
    }
    const result = await assetsApi.getGroupRequests(payload, '')
    let finalResult = result?.groupData
    if (ACLObject?.arrayData) {
      const ACLresult = result?.groupData?.filter((item) => ACLObject?.arrayData.includes(item.cn))
      finalResult = ACLresult
    }

    const keyValues = Object?.entries(dataForFile) // convert object to keyValues ALM1955
    const index = keyValues?.findIndex((x) => x[0] === 'entitlement') // Find the index of Entitlement
    if (index > 1) {
      keyValues?.splice(index + 1, 0, ['entitlementOther', '']) // SET entitimentother if you find the entitlement
    }
    const entitleMentUpdateObject = Object.fromEntries(keyValues)

    let keystoIterate = {}
    if (index > 1) {
      keystoIterate = { ...entitleMentUpdateObject }
    } else {
      keystoIterate = { ...dataForFile }
    }

    const data = []
    /* eslint no-underscore-dangle: 0 */
    finalResult?.forEach((group) => {
      const groupObject = {}
      const res = setGroupRecord(group?.groupDetails)
      Object.keys(keystoIterate).forEach((key) => {
        if (
          [
            'accessioPrerequisiteRMPRoles',
            'accessioPrerequisiteRMPRolesText',
            'description'
          ].includes(key)
        ) {
          const rpmRole = responseValueFinder(res, key)
          groupObject[key] =
            rpmRole && rpmRole.includes(',') ? rpmRole.replaceAll(',', ';') : rpmRole
        } else if (['dbagExternalProvider', 'groupScope'].includes(key)) {
          const cloudValue = responseValueFinder(res, key)
          groupObject[key] = getLabelFromValue(key, cloudValue)
        } else {
          groupObject[key] = responseValueFinder(res, key)
        }
      })
      data.push(groupObject)
    })
    const csvdata = csvmaker(
      data.length === 0 ? iff(index > 1, [entitleMentUpdateObject], [dataForFile]) : data,
      true
    )
    downloadMyGroups(csvdata)
  }

  const uploadACL = (string) => {
    dispatch(updateShowBigLoader(true))
    const csvString = string?.trim()
    dispatch(updateShowBigLoader(false))
    const csvRows = csvString.split('\n').splice(1)

    const newArray = csvRows.map((i) => {
      const values = i.trim().split(',')[0]
      return values
    })
    downloadMyGroupCSV({ arrayData: newArray })
  }

  const onFileUpload = (e, ACLupload) => {
    dispatch(updateShowBigLoader(false))
    e.preventDefault()
    const fileReader = new FileReader()
    const selectedFileDetails = ACLupload ? e?.target?.files[0] : selectedFile
    if (selectedFileDetails) {
      fileReader.onload = (event) => {
        const csvOutput = event.target.result
        if (ACLupload) {
          uploadACL(csvOutput)
        } else {
          csvFileToArray(csvOutput)
        }
      }
      fileReader.readAsText(selectedFileDetails)
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

    a.setAttribute('download', error ? `errors_${date}` : 'modifyAdGroup.csv') //  // Setting the anchor tag attribute for downloading, and passing the download file name

    a.click() // Performing a download with click
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

  // This code is commented as Download Template button is hidden. Once get approval from Harish will use this code or remove this
  // const getExampleRowGroup = (csvObject) => {
  //   const obj1 = csvObject
  //   Object.keys(obj1).forEach((key) => {
  //     obj1[key] = csvExampleRow[key]
  //   })
  //   return obj1
  // }

  // const downloadCSV = async () => {
  //   let dataForFile = {}
  //   dataForFile.groupName = ''
  //   dataForFile.domain = ''
  //   const childArray = adGroupArray.filter((col) => selectedColumns.includes(col.label))
  //   childArray?.map((item1) => {
  //     dataForFile = { ...dataForFile, ...{ [item1.id]: '' } }
  //     return null
  //   })

  //   const csvObjectExampleRow = getExampleRowGroup(dataForFile)
  //   const csvdata = csvmaker(csvObjectExampleRow)

  //   download(csvdata)
  // }

  const callSubmitAccount = async (result, payload, index) => {
    dispatch(updateShowBigLoader(true))
    if (result.status === 200) {
      await adGroupApi
        .modifyAdGroup(payload)
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
        `${errorAtLine} ${index + 1} : ${result?.response?.data?.message}`
      ])
      setSuccessButtonName('finish')
    }
  }

  const confirmBulkAction = async () => {
    setOpen(false)
    const adGroupPayloadDetails = []
    const errorMessages = []
    setSuccessCounter(0)
    let unique = ''
    const checkUnique = async () => {
      const uniqueNum = randomNumber()
      const charsToModify = uniqueNum.slice(-4).toUpperCase()
      unique = uniqueNum.slice(0, -4) + charsToModify

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
        array.forEach((tempSingleArray) => {
          const singleArray = tempSingleArray
          adGroupArray?.forEach((item) => {
            if (item?.type === 'dropdown') {
              if (item?.id === 'dbagDataPrivClass') {
                singleArray[item?.id] = item?.options?.filter(
                  (itm) => itm?.label?.toLowerCase() === singleArray[item?.id]?.toLowerCase() // ALM1955
                )[0]?.label
              } else {
                singleArray[item?.id] = item?.options?.filter(
                  (itm) => itm?.label?.toLowerCase() === singleArray[item?.id]?.toLowerCase() // ALM1955
                )[0]?.value
              }
            }
          })

          const groupDetailsObject = {}
          adGroupArray.forEach((o) => {
            if (singleArray[o.id] && singleArray[o.id] !== '') {
              switch (o.name) {
                case 'dbagApplicationID':
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
                // case 'compiledGroupDescription':
                //   groupDetailsObject.description = [singleArray[o.id]]
                //   break
                case 'description':
                  groupDetailsObject.description = [singleArray[o.id]]
                  break
                case 'paths':
                  groupDetailsObject[o.id] = singleArray[o.id]
                  break
                case 'dbagExternalProvider':
                  if (singleArray[o.id].toLowerCase() === 'azr#gcp') {
                    groupDetailsObject[o.name] = singleArray[o.id].split('#')
                  } else {
                    groupDetailsObject[o.name] = [singleArray[o.id]]
                  }
                  break
                case 'dbagEntitlement':
                  groupDetailsObject[o.name] =
                    (singleArray[o.id]?.toLowerCase() === o?.id) === 'entitlement' &&
                    singleArray[o?.id]?.toLowerCase().includes('other - please specify') // ALM1955
                      ? singleArray?.entitlementOther
                      : singleArray[o?.id]

                  break
                case 'dbagDataPrivClass':
                  if (singleArray[o.id] === 'Yes') {
                    groupDetailsObject.dbagExtensionAttribute6 = `${singleArray.dwsPrivate}${singleArray.clientPrivate}${singleArray.dbPrivate}`
                  }
                  groupDetailsObject[o.id] = singleArray[o.id] === 'Yes' ? 'TRUE' : 'FALSE'
                  break

                case 'dwsPrivate':
                case 'clientPrivate':
                case 'dbPrivate':
                  break

                default:
                  groupDetailsObject[o.name] = singleArray[o.id]
                  break
              }
            }
          })
          const commonObj = {
            applicationName: `${applicationNamePrefix}${
              singleArray.domain ? singleArray.domain : ''
            }`,
            groupName: singleArray.samAccount,
            groupDN: '',
            operation: 'Amend',
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
          adGroupPayloadDetails.push({ common: commonObj })
        })
        if (adGroupPayloadDetails.length) {
          setAdGroupPayloadArray(adGroupPayloadDetails)
        }
        if (errorMessages.length) {
          setErrors(errorMessages)
        }
      }
    }
    checkUnique()
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
        needBulkOperation: child.needBulkOperation,
        labelForBulk: child.labelForBulk
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
    // Set account information object
    setAdGroupArray(adGroupObj)
    return adGroupObj
  }

  const handleCancel = () => {
    setOpen(true)
    setButtonReference('cancel')
    dispatch(updateShowBigLoader(false))
  }

  const handleConfirm = () => {
    history.push('/dashboard')
  }

  useEffect(() => {
    if (
      (errors.length && processRequest.ongoingRequest === adGroupArray.length) ||
      (successCounter > 0 && processRequest.ongoingRequest === adGroupArray.length)
    ) {
      dispatch(updateShowBigLoader(false))
    }
  }, [errors, processRequest, successCounter])

  useEffect(async () => {
    const validateAdAccount = async (payload, adGroup, index) => {
      const validationStatus = { error: false, errorMessage: '' }
      dispatch(updateShowBigLoader(true))

      const listofErrors = []
      clearFilters()
      const result = await axios({
        url: '/v0/group/modify/bulkValidation',
        data: payload,
        method: 'post'
      })
        .then((res) => res)
        .catch((err) => {
          console.error(err)
          return null
        })
      if (
        result &&
        (typeof result === 'object' && !Object.keys(result).includes('data')
          ? result.toString().includes('Error')
          : result?.data?.Error)
      ) {
        if (
          typeof result === 'object' &&
          !Object.keys(result).includes('data') &&
          result.toString().includes('Error')
        )
          listofErrors.push(`${apiError} `)
        else if (result.data.RequestUniqueness !== 'Valid') {
          listofErrors.push(`${inValidReqUniqueness} `)
        } else if (
          !result.data.GroupDN ||
          result.data.GroupDN.includes('Error') ||
          result.data.GroupDN.includes('Invalid') ||
          [null, 'null', 'NULL', '', undefined].includes(
            result.data.GroupDN.substring(1, result.data.GroupDN.length - 1)
          )
        ) {
          listofErrors.push(`${inValidGroupDN}`)
        } else {
          // This code is commented because no Accessio Group Type so can not able to check weather this field is applicable for given group name
          // const isValidField = (value) =>
          //   validationColumns.filter(
          //     (val) => val.id === value && val.relatedTo.includes(accessioGroupType)
          //   ).length
          if (
            adGroup.common.groupDetails.dbagInfrastructureID &&
            result.data.Infra_Nar_Id !== 'Valid' &&
            columnNamesForBulkValidation.includes('dbagInfrastructureID')
          ) {
            if (adGroup.common.groupDetails.dbagApplicationID === '') {
              listofErrors.push(
                `${emptyInfraId} (${adGroup.common.groupDetails.dbagInfrastructureID})`
              )
            } else {
              listofErrors.push(
                `${inValidInfraId} (${adGroup.common.groupDetails.dbagInfrastructureID})`
              )
            }
          }
          if (
            adGroup.common.groupDetails.dbagApplicationID &&
            result.data.ApplicationNARId !== 'Valid' &&
            columnNamesForBulkValidation.includes('dbagApplicationID')
          ) {
            if (adGroup.common.groupDetails.dbagApplicationID === '') {
              listofErrors.push(`${emptyNarId} (${adGroup.common.groupDetails.dbagApplicationID})`)
            } else {
              listofErrors.push(
                `${inValidNarId} (${adGroup.common.groupDetails.dbagApplicationID})`
              )
            }
          }
          if (
            adGroup.common.groupDetails.dbagCostcenter &&
            result.data.CostCenter !== 'Valid' &&
            columnNamesForBulkValidation.includes('dbagCostcenter')
          ) {
            listofErrors.push(
              `${inValidCostCenter} (${adGroup.common.groupDetails.dbagCostcenter})`
            )
          }
          if (
            adGroup.common.groupDetails.department &&
            result.data.Department !== 'Valid' &&
            columnNamesForBulkValidation.includes('department')
          ) {
            listofErrors.push(`${inValidDep} (${adGroup.common.groupDetails.department})`)
          }
          if (result.data.AccessioGroupName !== 'Valid') {
            listofErrors.push(`${inValidAccessioGroupName} (${adGroup.common?.groupName})`)
          }
          // if (
          //   adGroup.common.groupDetails?.location &&
          //   result.data.Location !== 'Valid' &&
          //   ['location'].includes(columnNamesForBulkValidation) // need to check this
          // ) {
          //   listofErrors.push(`${inValidLocation} (${adGroup.common.groupDetails?.location})`)
          // }
          if (
            adGroup.common.groupDetails?.dbagSupportGroup &&
            result.data.DbUnitySupportGroup !== 'Valid' &&
            columnNamesForBulkValidation.includes('dbagSupportGroup')
          ) {
            listofErrors.push(
              `${inValidDBUnity} (${
                adGroup.common.groupDetails?.dbagSupportGroup
                  ? adGroup.common.groupDetails?.dbagSupportGroup
                  : ''
              })`
            )
          }
          if (
            adGroup.common.groupDetails?.dbagApplicationID &&
            result.data.ApplicationNARId !== 'Valid' &&
            columnNamesForBulkValidation.includes('mAMs')
          ) {
            listofErrors.push(
              `${inValidMAMs} (${
                adGroup.common.groupDetails?.dbagApplicationID
                  ? adGroup.common.groupDetails?.dbagApplicationID
                  : ''
              })`
            )
          }
          if (
            adGroup.common.groupDetails?.dbagIMSAuthContact &&
            result.data.AuthContact !== 'Valid' &&
            columnNamesForBulkValidation.includes('dbagIMSAuthContact')
          ) {
            listofErrors.push(
              `${inValidAuthContact} (${
                adGroup.common.groupDetails?.dbagIMSAuthContact
                  ? adGroup.common.groupDetails?.dbagIMSAuthContact
                  : ''
              })`
            )
          }
          if (
            adGroup.common.groupDetails?.dbagIMSAuthContactDelegate &&
            result.data.AuthContactDelegate !== 'Valid' &&
            columnNamesForBulkValidation.includes('dbagIMSAuthContactDelegate')
          ) {
            listofErrors.push(
              `${inValidAuthContactDelegate} (${
                adGroup.common.groupDetails?.dbagIMSAuthContactDelegate
                  ? adGroup.common.groupDetails?.dbagIMSAuthContactDelegate
                  : ''
              })`
            )
          }
          if (
            adGroup.common.groupDetails?.dbagIMSApprovers &&
            result.data.GroupOwner !== 'Valid' &&
            columnNamesForBulkValidation.includes('dbagIMSApprovers')
          ) {
            listofErrors.push(
              `${inValidGroupOwner} (${
                adGroup.common.groupDetails?.dbagIMSApprovers
                  ? adGroup.common.groupDetails?.dbagIMSApprovers
                  : ''
              })`
            )
          }
        }

        if (listofErrors.length) {
          validationStatus.errorMessage = listofErrors.join(', ')
          validationStatus.error = true
          errorMessagesData.push(`${Erroratline} ${index + 1} : ${validationStatus.errorMessage}`)

          setErrorEntries((prev) => [...prev, array[index]])
        }
      }
      processRequest1 += 1
      setProcessRequest({
        totalRequest: adGroupPayloadArray.length,
        ongoingRequest: processRequest1
      })
      if (listofErrors.length === 0) {
        const updateadGroup = adGroup
        updateadGroup.common.groupDN = result.data.GroupDN
          ? result.data.GroupDN.substring(1, result.data.GroupDN.length - 1)
          : ''
        delete updateadGroup.common.groupName
        // eslint-disable-next-line no-await-in-loop
        await callSubmitAccount(result, updateadGroup, index)
      }

      if (processRequest1 === adGroupPayloadArray.length) {
        setErrors(errorMessagesData)
        dispatch(updateShowBigLoader(false))
        setProcessRequest({
          totalRequest: 0,
          ongoingRequest: 0
        })
      }
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const [index, adGroup] of adGroupPayloadArray.entries()) {
      const validationPayload = {
        Application_NAR_Id: adGroup.common?.groupDetails?.dbagApplicationID
          ? adGroup.common.groupDetails.dbagApplicationID[0]
          : '',
        AuthContact: adGroup.common?.groupDetails?.dbagIMSAuthContact
          ? adGroup.common.groupDetails.dbagIMSAuthContact
          : '',
        AuthContactDelegate: adGroup.common?.groupDetails?.dbagIMSAuthContactDelegate
          ? adGroup.common.groupDetails.dbagIMSAuthContactDelegate
          : '',
        GroupOwner: adGroup.common?.groupDetails?.dbagIMSApprovers
          ? adGroup.common.groupDetails.dbagIMSApprovers
          : [],
        Group_Name: adGroup.common.groupName ? adGroup.common.groupName : '',
        CostCenter: adGroup.common?.groupDetails?.dbagCostcenter
          ? adGroup.common.groupDetails.dbagCostcenter
          : '',
        Department: adGroup.common?.groupDetails?.department
          ? adGroup.common.groupDetails.department
          : '',
        DbUnitySupportGroup: adGroup.common?.groupDetails?.dbagSupportGroup
          ? adGroup.common?.groupDetails?.dbagSupportGroup
          : '',
        Infra_Nar_Id: adGroup?.common?.groupDetails?.dbagInfrastructureID
          ? adGroup.common.groupDetails?.dbagInfrastructureID[0]
          : ''
      }
      // eslint-disable-next-line no-await-in-loop
      await validateAdAccount(validationPayload, adGroup, index)
    }
  }, [adGroupPayloadArray])

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
  const groupDomainObject = [
    {
      title: 'Group Domain',
      type: 'dropdown',
      id: 'domain',
      label: 'Group Domain',
      name: 'domain',
      category: 'adAccessioGroupType',
      requiredField: true,
      displayType: {
        hidden: false,
        readOnly: false,
        disabled: false
      }
    },
    {
      title: 'Group Name',
      type: 'displayvalue',
      id: 'samAccount',
      label: 'Group Name',
      name: 'cn',
      category: 'adAccessioGroupType',
      requiredField: true,
      displayType: {
        hidden: true,
        readOnly: false,
        disabled: false
      },
      maxLength: 64
    }
  ]

  useEffect(() => {
    adGroupApi.getModifyADGroup().then((res) => {
      setSamAccountStructure(res.SAMAccountDataStucture)
      // setDescriptionStructure(res.descriptionStructure)
      const groupArray = constructAdResponse(res.steps)
      setModifyGroupArray(groupArray)
      const columnsForDropdown = groupArray.filter(
        (col) =>
          (col.displayType.hidden === false || col.needBulkOperation === true) &&
          col.label !== 'dbUnity Support Group'
      )
      setValidationColumns([...columnsForDropdown, ...groupDomainObject])
      const dropdownCol = columnsForDropdown.filter(
        (item) => item.label !== 'Business Justification'
      )
      setColumns(dropdownCol.map((data) => data.id))
    })
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
            label: translate('navItem.label.modifyBulkRequests'),
            url: ''
          }
        ]}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Styled.HeaderWrapper>
          <h1 style={{ fontWeight: 'normal', marginBottom: '10px' }}>
            {translate('modify.bulkrequest.adGroup.title')}
          </h1>
        </Styled.HeaderWrapper>
      </div>

      <Styled.MainWrapper>
        <Box p={5}>
          <p>{csvNotification}</p>
          <div
            style={{
              paddingLeft: '40px',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, auto)',
              width: '100%'
            }}
          >
            {columns.map((name) => (
              <FormControl sx={{ width: '70%' }} margin="normal" xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id={name}
                      onChange={(e, v) => handleChange(e, v)}
                      name={name}
                      checked={selectedColumns.indexOf(name) > -1}
                    />
                  }
                  label={translate(`metaData.${name}`)}
                />
              </FormControl>
            ))}
          </div>
          {selectedColumns.length > 0 ? (
            <Box>
              {/* <Button
                onClick={() => downloadCSV()}
                variant="outlined"
                component="label"
                sx={{
                  color: `${theme === 'dark' ? '#FFF' : '#000'}`,
                  borderColor: `${theme === 'dark' ? '#FFF' : '#000'}`,
                  borderRadius: '1px',
                  marginTop: '10px'
                }}
              >
                {translate('create.downloadCsv')}
              </Button> */}
              <Button
                onClick={() => downloadMyGroupCSV()}
                variant="outlined"
                component="label"
                sx={{
                  color: `${theme === 'dark' ? '#FFF' : '#000'}`,
                  borderColor: `${theme === 'dark' ? '#FFF' : '#000'}`,
                  borderRadius: '1px',
                  marginTop: '10px',
                  marginLeft: '30px'
                }}
              >
                {translate('modify.downloadMyGroupCsv')}
              </Button>

              <Button
                variant="outlined"
                component="label"
                sx={{
                  color: `${theme === 'dark' ? '#FFF' : '#000'}`,
                  borderColor: `${theme === 'dark' ? '#FFF' : '#000'}`,
                  borderRadius: '1px',
                  marginTop: '10px',
                  marginLeft: '15px'
                }}
              >
                {translate('modify.uploadACL')}
                <input
                  hidden
                  accept=".csv"
                  multiple
                  type="file"
                  onChange={(e) => {
                    onFileUpload(e, true)
                  }}
                  onClick={(event) => {
                    // eslint-disable-next-line no-param-reassign
                    event.target.value = null
                  }}
                />
              </Button>
            </Box>
          ) : (
            ''
          )}
        </Box>

        <Box key="addcsv" pr={5} pl={5} pb={5}>
          <hr />
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
                <p style={{ color: '#F00' }}>{translate('modify.errorHeader')}</p>
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
                    {translate('modify.downloadErrorPrefix')} :{' '}
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
            onClick={(e) => onFileUpload(e, false)}
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

export default BulkModifyAdGroup
