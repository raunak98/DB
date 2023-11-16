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
import axios from '../../../../axios'
import { randomNumber } from '../../../../helpers/strings'
import { applicationNamePrefix, areEqualCaseInsensitive } from '../../../../helpers/utils'

function Tag(props) {
  const { label, onClick, ...other } = props
  return (
    <div
      {...other}
      style={{
        background: 'transparent',
        borderWidth: 1.5,
        borderColor: '#5A5A5A',
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

const BulkCreate = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [open, setOpen] = React.useState(false)
  const [array, setArray] = useState([])
  const [userProfile, setUserProfile] = useState({})
  const [errors, setErrors] = useState([])
  const [successMessage, setSuccessMessage] = useState('')
  const [successCounter, setSuccessCounter] = useState(0)
  const [adAccountArray, setAdAccountArray] = useState([])
  const [accountCategories, setAccountCategories] = useState([])
  const [adAccountMeta, setAdAccountMeta] = useState([])
  const [samAccountStructure, setSamAccountStructure] = useState([])
  const [errorEntries, setErrorEntries] = useState([])
  const showBigLoader = useSelector(selectShowBigLoader)
  const maxlengthError = translate('create.bulkerrormessage')
  const norecordsError = translate('create.bulknorecords')
  const formatError = translate('format.error')
  const history = useHistory()
  const inValidLocation = translate('create.inValidLocation')
  const inValidAccountNameSuffix = translate('create.inValidAccountNameSuffix')
  const inValidRegion = translate('create.inValidRegion')
  const inValidRecertPeriod = translate('create.inValidRecertPeriod')
  const inValidSerNoWLevel = translate('create.inValidSerNoWLevel')
  const inVlaidPlatform = translate('create.inVlaidPlatform')
  const inValidInfraNarId = translate('create.inValidInfrNarId')
  const inValidAccAssLevel = translate('create.inValidAccAssLevel')
  const inValidCategory = translate('create.inValidAccountCategory')
  const inValidNarId = translate('create.inValidNarId')
  const inValidCostCenter = translate('create.inValidCostCenter')
  const inValidDep = translate('create.inValidDep')
  const inValidPrmyAcc = translate('create.inValidPrmyAcc')
  const inValidRecp = translate('create.inValidRecp')
  const emptyNarId = translate('create.emptyNarId')
  const samAccExists = translate('create.samAccountValidation')
  const inValidCsvHeader = translate('modify.invalidHeader')
  const inValidReqUniqueness = translate('create.inValidReqUniqueness')
  const accountExists = translate('create.ADAccount.samErrorMessage')
  const [successButtonName, setSuccessButtonName] = useState('upload')
  const [buttonReference, setButtonReference] = useState('')
  const [releatedColumns, setReleatedColumns] = useState([])
  const justificationError = translate('form.alphaNumericValidationMessage')
  const noJustificationAvailable = translate('create.ADAccount.noJustification')
  const samLengthError = translate('create.ADAccount.samLengthMessage')
  const alphaNumericValidationMessage = translate('form.alphaNumericValidationMessage')
  const validatePassword = translate('form.validatePassword')
  const accountTypeErrorMessage = translate('create.bulkADAccount.accountTypeError')
  const duplicateRecords = translate('modify.duplicateRecords')
  const maxLengthJustificationError = translate('delete.bulkrequest.maxLengthJustificationError')
  const invalidColumCount = translate('modify.invalidColumn')
  const invalidMissingHeaderName = translate('modify.invalidOrMissingColumn')
  const invalidMissingInRow = translate('create.bulkCreate.invalidOrMissingInRow')
  const forTranslation = translate('create.bulkCreate.for')
  const errorAtLine = translate('delete.errorLine')
  const [expectedHeaders, setExpectedHeaders] = useState([])
  const [processRequest, setProcessRequest] = useState({ ongoingRequest: 0, totalRequest: 0 })
  const [categoryToLabel, setCategoryToLabel] = useState({})
  const errorArray = []
  let processRequest1 = 0
  let expressionIndex = 0
  const expressionValues = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  ]

  const getNotificationMessage = useSelector(selectNotificationMessage)
  const [apiAccountTypeItems, setApiAccountTypeItems] = useState([])

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

  const checkValuesFromMeta = (type, value) => {
    const filteredType = adAccountMeta[0]?.children?.filter(
      (eachChild) => eachChild.id.toLowerCase() === type.toLowerCase()
    )
    if (Array.isArray(filteredType) && filteredType.length > 0) {
      const filteredValue = filteredType[0]?.options?.filter(
        (eachOption) => eachOption?.label?.toLowerCase() === value.toLowerCase()
      )
      return filteredValue[0]
    }
    return ''
  }

  // 1. Helper Function for Personal Additional
  const validatePersonalAdditional = (data, category, criteria) => {
    const validationStatus = { error: false, errorMessage: '' }
    const errorMessage = []

    const locationRule = criteria.filter((item) => item.id === 'location')[0]
    const accountNameSuffixRule = criteria.filter((item) => item.id === 'accountNameSuffix')[0]

    // validating Location
    const doesLocationExist = locationRule.options.filter((item) =>
      areEqualCaseInsensitive(item.label, data.location)
    )
    const doesAccountNameSuffixExist = accountNameSuffixRule.options.filter(
      (item) => +item.value === +data.accountNameSuffix
    )

    // Checking Location
    if (doesLocationExist.length > 0) {
      if (!doesLocationExist[0].belongsto.includes(category[0].value)) {
        validationStatus.error = true
        errorMessage.push(`${inValidLocation} (${data.location})`)
      }
    } else {
      validationStatus.error = true
      errorMessage.push(`${inValidLocation} (${data.location})`)
    }

    // checking Account Name Suffix
    if (doesAccountNameSuffixExist.length === 0) {
      validationStatus.error = true
      errorMessage.push(`${inValidAccountNameSuffix} (${data.accountNameSuffix})`)
    }
    validationStatus.errorMessage = errorMessage.join(', ')
    return validationStatus
  }
  // 2. Helper function for CyberArk Named Account (Application)
  const validateCyberArkNamedAccountApp = (data, criteria) => {
    const validationStatus = { error: false, errorMessage: '' }
    const errorMessage = []
    const regionRule = criteria.filter((item) => item.id === 'region')[0]
    const recertificationPeriodRule = criteria.filter(
      (item) => item.id === 'recertificationPeriod'
    )[0]

    const doesRegionExist = regionRule.options.filter((item) =>
      areEqualCaseInsensitive(item.label, data.region)
    )
    const recertificationPeriodExist = recertificationPeriodRule.options.filter((item) =>
      areEqualCaseInsensitive(item.label, data.recertificationPeriod)
    )

    if (doesRegionExist.length === 0) {
      validationStatus.error = true
      errorMessage.push(`${inValidRegion} (${data.region})`)
    }
    if (recertificationPeriodExist.length === 0) {
      validationStatus.error = true
      errorMessage.push(`${inValidRecertPeriod} (${data.recertificationPeriod})`)
    }
    validationStatus.errorMessage = errorMessage.join(', ')
    return validationStatus
  }

  // 3. Helper function for CyberArk Named Account (Infrastructure)
  const validateCyberArkNamedAccountInfra = (data, criteria) => {
    const validationStatus = { error: false, errorMessage: '' }
    const errorMessage = []
    const regionRule = criteria.filter((item) => item.id === 'region')[0]
    const recertificationPeriodRule = criteria.filter(
      (item) => item.id === 'recertificationPeriod'
    )[0]

    const doesRegionExist = regionRule.options.filter((item) =>
      areEqualCaseInsensitive(item.label, data.region)
    )
    const recertificationPeriodExist = recertificationPeriodRule.options.filter((item) =>
      areEqualCaseInsensitive(item.label, data.recertificationPeriod)
    )

    if (doesRegionExist.length === 0) {
      validationStatus.error = true
      errorMessage.push(`${inValidRegion} (${data.region})`)
    }
    if (recertificationPeriodExist.length === 0) {
      validationStatus.error = true
      errorMessage.push(`${inValidRecertPeriod} (${data.recertificationPeriod})`)
    }
    validationStatus.errorMessage = errorMessage.join(', ')
    return validationStatus
  }

  // 4. Helper Function for CyberArk Role (shared) Account
  const validateCyberArkRolesharedAccount = (data, criteria) => {
    // TO DO  serviceNowlevel ,platformType,Account Access level
    const validationStatus = { error: false, errorMessage: '' }
    const errorMessage = []
    const regionRule = criteria.filter((item) => item.id === 'region')[0]
    const recertificationPeriodRule = criteria.filter(
      (item) => item.id === 'recertificationPeriod'
    )[0]
    const serviceNowLevelRule = criteria.filter((item) => item.id === 'serviceNowLevel')[0]
    const platformTypeRule = criteria.filter((item) => item.id === 'platformType')[0]
    const accountAcsLevelRule = criteria.filter((item) => item.id === 'accountAccessLevel')[0]

    const doesRegionExist = regionRule.options.filter((item) =>
      areEqualCaseInsensitive(item.label, data.region)
    )
    const recertificationPeriodExist = recertificationPeriodRule.options.filter((item) =>
      areEqualCaseInsensitive(item.label, data.recertificationPeriod)
    )
    const doesServiceNowLevelExist = serviceNowLevelRule.options.filter((item) =>
      areEqualCaseInsensitive(item.label, data.serviceNowLevel)
    )
    const platfromTypeExist = platformTypeRule.options.filter((item) =>
      areEqualCaseInsensitive(item.label, data.platformType)
    )
    const accountAcsExist = accountAcsLevelRule.options.filter((item) =>
      areEqualCaseInsensitive(item.label, data.accountAccessLevel)
    )

    if (doesRegionExist.length === 0) {
      validationStatus.error = true
      errorMessage.push(`${inValidRegion} (${data.region})`)
    }
    if (recertificationPeriodExist.length === 0) {
      validationStatus.error = true
      errorMessage.push(`${inValidRecertPeriod} (${data.recertificationPeriod})`)
    }
    if (doesServiceNowLevelExist.length === 0) {
      validationStatus.error = true
      errorMessage.push(`${inValidSerNoWLevel} (${data.serviceNowLevel})`)
    }
    if (platfromTypeExist.length === 0) {
      validationStatus.error = true
      errorMessage.push(`${inVlaidPlatform} (${data.platformType})`)
    }
    if (accountAcsExist.length === 0) {
      validationStatus.error = true
      errorMessage.push(`${inValidAccAssLevel} (${data.accountAccessLevel})`)
    }
    validationStatus.errorMessage = errorMessage.join(', ')
    return validationStatus
  }

  // 5. Personal Admin
  const validatePersonalAdmin = (data, category, criteria) => {
    const validationStatus = { error: false, errorMessage: '' }
    const errorMessage = []

    const locationRule = criteria.filter((item) => item.id === 'location')[0]

    // validating Location
    const doesLocationExist = locationRule.options.filter((item) =>
      areEqualCaseInsensitive(item.label, data.location)
    )

    if (doesLocationExist.length > 0) {
      if (!doesLocationExist[0].belongsto.includes(category[0].value)) {
        validationStatus.error = true
        errorMessage.push(`${inValidLocation} (${data.location})`)
      }
    } else {
      validationStatus.error = true
      errorMessage.push(`${inValidLocation} (${data.location})`)
    }

    validationStatus.errorMessage = errorMessage.join(', ')
    return validationStatus
  }

  // 6. Personal Desktop Admin
  const validatePersonalDesktopAdmin = (data, category, criteria) => {
    const validationStatus = { error: false, errorMessage: '' }
    const errorMessage = []

    const locationRule = criteria.filter((item) => item.id === 'location')[0]

    // validating Location
    const doesLocationExist = locationRule.options.filter((item) =>
      areEqualCaseInsensitive(item.label, data.location)
    )

    if (doesLocationExist.length > 0) {
      if (!doesLocationExist[0].belongsto.includes(category[0].value)) {
        validationStatus.error = true
        errorMessage.push(`${inValidLocation} (${data.location})`)
      }
    } else {
      validationStatus.error = true
      errorMessage.push(`${inValidLocation} (${data.location})`)
    }

    validationStatus.errorMessage = errorMessage.join(', ')
    return validationStatus
  }
  // 7. Personal Domain Support
  const validatePersonalDomain = (data, category, criteria) => {
    const validationStatus = { error: false, errorMessage: '' }
    const errorMessage = []

    const locationRule = criteria.filter((item) => item.id === 'location')[0]

    // validating Location
    const doesLocationExist = locationRule.options.filter((item) =>
      areEqualCaseInsensitive(item.label, data.location)
    )

    if (doesLocationExist.length > 0) {
      if (!doesLocationExist[0].belongsto.includes(category[0].value)) {
        validationStatus.error = true
        errorMessage.push(`${inValidLocation} (${data.location})`)
      }
    } else {
      validationStatus.error = true
      errorMessage.push(`${inValidLocation} (${data.location})`)
    }

    validationStatus.errorMessage = errorMessage.join(', ')
    return validationStatus
  }
  // 8. Shared Generic
  const validateSharedGeneric = (data, category, criteria) => {
    const validationStatus = { error: false, errorMessage: '' }
    const errorMessage = []

    const locationRule = criteria.filter((item) => item.id === 'location')[0]

    // validating Location
    const doesLocationExist = locationRule.options.filter((item) =>
      areEqualCaseInsensitive(item.label, data.location)
    )

    if (doesLocationExist.length > 0) {
      if (!doesLocationExist[0].belongsto.includes(category[0].value)) {
        validationStatus.error = true
        errorMessage.push(`${inValidLocation} (${data.location})`)
      }
    } else {
      validationStatus.error = true
      errorMessage.push(`${inValidLocation} (${data.location})`)
    }

    if (data.accountNameMiddle && !/^[a-zA-Z0-9\-_]*$/.test(data.accountNameMiddle)) {
      validationStatus.error = true
      errorMessage.push(
        `${alphaNumericValidationMessage} for accountNameMiddle (${data.accountNameMiddle})`
      )
    }

    validationStatus.errorMessage = errorMessage.join(', ')
    return validationStatus
  }

  // 9. Technical - Generic brokered

  const validateGenericBroker = (data, category, criteria) => {
    const validationStatus = { error: false, errorMessage: '' }
    const errorMessage = []

    const locationRule = criteria.filter((item) => item.id === 'location')[0]
    const infrNarIdRule = criteria.filter((item) => item.id === 'dbagInfrastructureID')[0]

    // validating Location
    const doesLocationExist = locationRule.options.filter((item) =>
      areEqualCaseInsensitive(item.label, data.location)
    )
    // Validating Infrstructure NarID
    const doesInfrNarIdExist = infrNarIdRule.options.filter((item) =>
      areEqualCaseInsensitive(item.value, data.dbagInfrastructureID)
    )

    if (doesLocationExist.length > 0) {
      if (!doesLocationExist[0].belongsto.includes(category[0].value)) {
        validationStatus.error = true
        errorMessage.push(`${inValidLocation} (${data.location})`)
      }
    } else {
      validationStatus.error = true
      errorMessage.push(`${inValidLocation} (${data.location})`)
    }
    if (data.accountNameMiddle && !/^[a-zA-Z0-9\-_]*$/.test(data.accountNameMiddle)) {
      validationStatus.error = true
      errorMessage.push(
        `${alphaNumericValidationMessage} for accountNameMiddle (${data.accountNameMiddle})`
      )
    }

    if (doesInfrNarIdExist.length === 0) {
      validationStatus.error = true
      errorMessage.push(`${inValidInfraNarId} (${data.dbagInfrastructureID})`)
    }

    validationStatus.errorMessage = errorMessage.join(', ')
    return validationStatus
  }

  // 10. Technical - Service/ Process

  const validateTechServiceProcess = (data, category, criteria) => {
    const validationStatus = { error: false, errorMessage: '' }
    const errorMessage = []

    const locationRule = criteria.filter((item) => item.id === 'location')[0]

    // validating Location
    const doesLocationExist = locationRule.options.filter((item) =>
      areEqualCaseInsensitive(item.label, data.location)
    )

    if (doesLocationExist.length > 0) {
      if (!doesLocationExist[0].belongsto.includes(category[0].value)) {
        validationStatus.error = true
        errorMessage.push(`${inValidLocation} (${data.location})`)
      }
    } else {
      validationStatus.error = true
      errorMessage.push(`${inValidLocation} (${data.location})`)
    }

    if (data.accountNameMiddle && !/^[a-zA-Z0-9\-_]*$/.test(data.accountNameMiddle)) {
      validationStatus.error = true
      errorMessage.push(
        `${alphaNumericValidationMessage} for accountNameMiddle (${data.accountNameMiddle})`
      )
    }
    if (!['true', 'false'].includes(data.passwordNeverExpires.toLowerCase())) {
      validationStatus.error = true
      errorMessage.push(`${validatePassword} (${data.passwordNeverExpires})`)
    }

    validationStatus.errorMessage = errorMessage.join(', ')
    return validationStatus
  }

  // 11. Technical - Test"

  const validateTechnicalTest = (data, category, criteria) => {
    const validationStatus = { error: false, errorMessage: '' }
    const errorMessage = []

    const locationRule = criteria.filter((item) => item.id === 'location')[0]

    // validating Location
    const doesLocationExist = locationRule.options.filter((item) =>
      areEqualCaseInsensitive(item.label, data.location)
    )

    if (doesLocationExist.length > 0) {
      if (!doesLocationExist[0].belongsto.includes(category[0].value)) {
        validationStatus.error = true
        errorMessage.push(`${inValidLocation} (${data.location})`)
      }
    } else {
      validationStatus.error = true
      errorMessage.push(`${inValidLocation} (${data.location})`)
    }
    if (data.accountNameMiddle && !/^[a-zA-Z0-9\-_ ]*$/.test(data.accountNameMiddle)) {
      validationStatus.error = true
      errorMessage.push(
        `${alphaNumericValidationMessage} for accountNameMiddle (${data.accountNameMiddle})`
      )
    }
    validationStatus.errorMessage = errorMessage.join(', ')
    return validationStatus
  }

  const validateFileDetails = async (data) => {
    clearFilters()
    const validationErrorMessages = []

    dispatch(updateShowBigLoader(true))
    data.forEach((item, index) => {
      const errorMessages = []
      const category = accountCategories.filter((Obj) => Obj.label === item.accountCategory)
      if (item?.businessJustification.trim().length === 0) {
        errorMessages.push(`${noJustificationAvailable}`)
      }
      if (!/^[a-zA-Z0-9_\-\\.@ ]*$/.test(item?.businessJustification)) {
        errorMessages.push(
          `${justificationError} for Business Justification (${item?.businessJustification})`
        )
      }
      if (item?.businessJustification.trim().length > 500) {
        errorMessages.push(`${maxLengthJustificationError} (${item?.businessJustification})`)
      }
      if (category[0]?.value === '' || category[0]?.value === undefined) {
        errorMessages.push(`${inValidCategory}`)
      } else {
        const validationColumns = adAccountMeta[0].children.filter(
          (obj) =>
            obj?.relatedTo?.includes(category[0].value) || !Object.keys(obj).includes('relatedTo')
        )
        if (category[0].value === 'PersonalAdditional') {
          const status = validatePersonalAdditional(item, category, validationColumns)
          if (status.error) {
            errorMessages.push(`${status.errorMessage}`)
          }
        }

        if (category[0].value === 'CyberArkNamedAccountApplication') {
          const status = validateCyberArkNamedAccountApp(item, validationColumns)
          if (status.error) {
            errorMessages.push(`${status.errorMessage}`)
          }
        }

        if (category[0].value === 'CyberArkNamedAccountInfrastructure') {
          const status = validateCyberArkNamedAccountInfra(item, validationColumns)
          if (status.error) {
            errorMessages.push(`${status.errorMessage}`)
          }
        }

        if (category[0].value === 'CyberArkRolesharedAccount') {
          const status = validateCyberArkRolesharedAccount(item, validationColumns) // validateCyberArkRolesharedAccount
          if (status.error) {
            errorMessages.push(`${status.errorMessage}`)
          }
        }

        if (category[0].value === 'PersonalAdmin') {
          const status = validatePersonalAdmin(item, category, validationColumns)
          if (status.error) {
            errorMessages.push(`${status.errorMessage}`)
          }
        }

        if (category[0].value === 'PersonalDesktopAdmin') {
          const status = validatePersonalDesktopAdmin(item, category, validationColumns)
          if (status.error) {
            errorMessages.push(`${status.errorMessage}`)
          }
        }

        if (category[0].value === 'PersonalDomainSupport') {
          const status = validatePersonalDomain(item, category, validationColumns)
          if (status.error) {
            errorMessages.push(`${status.errorMessage}`)
          }
        }

        if (category[0].value === 'SharedGeneric') {
          const status = validateSharedGeneric(item, category, validationColumns)
          if (status.error) {
            errorMessages.push(`${status.errorMessage}`)
          }
        }

        if (category[0].value === 'TechnicalGenericbrokered') {
          const status = validateGenericBroker(item, category, validationColumns)
          if (status.error) {
            errorMessages.push(`${status.errorMessage}`)
          }
        }

        if (category[0].value === 'TechnicalServiceProcess') {
          const status = validateTechServiceProcess(item, category, validationColumns)
          if (status.error) {
            errorMessages.push(`${status.errorMessage}`)
          }
        }

        if (category[0].value === 'TechnicalTest') {
          const status = validateTechnicalTest(item, category, validationColumns)
          if (status.error) {
            errorMessages.push(`${status.errorMessage}`)
          }
        }

        if (errorMessages.length === 0 && item?.samAccount.length > 20) {
          errorMessages.push(`${samLengthError} (${item.samAccount})`)
        }

        if (errorMessages.length) {
          const error = errorMessages.join(', ')
          validationErrorMessages.push(`${errorAtLine}  ${index + 1} : ${error}`)
        }

        dispatch(updateShowBigLoader(false))
      }
    })

    if (validationErrorMessages.length) {
      setErrors(validationErrorMessages)
      dispatch(
        updateReviewNotificationMessage({
          type: 'Error',
          message: `${validationErrorMessages.length} of ${data.length} entries contains error.`
        })
      )
    } else {
      setOpen(true)
      dispatch(updateShowBigLoader(false))
    }
  }

  const checkValidation = (eachObj) => {
    let columnsValidation = false
    const columns = Object.keys(eachObj).filter((k) => eachObj[k] !== '')
    const csvObj = { label: eachObj.accountCategory, columns }

    const matchedCategory = releatedColumns.filter((eachCategory) =>
      areEqualCaseInsensitive(eachCategory.label, csvObj.label)
    )
    if (matchedCategory[0]?.relatedColumns.length === csvObj?.columns?.length) {
      columnsValidation = csvObj?.columns?.every((value) =>
        matchedCategory[0]?.relatedColumns?.includes(value)
      )
      return columnsValidation
    }

    return columnsValidation
  }

  const checkAccountTypePermission = (category) => {
    let isValid = false

    if (apiAccountTypeItems) {
      const matchedType = apiAccountTypeItems.filter((typeItem) =>
        areEqualCaseInsensitive(typeItem.value, category)
      )[0]
      isValid = matchedType ? matchedType.availableForRequest : false
    }
    return isValid
  }

  const missingElement = (singleObj) => {
    let missingData = []
    const columns = Object.keys(singleObj).filter((k) => singleObj[k] !== '')
    const csvObj = { label: singleObj.accountCategory, columns }
    const matchedCategory = releatedColumns.filter((eachCategory) =>
      areEqualCaseInsensitive(eachCategory.label, csvObj.label)
    )
    missingData = matchedCategory[0]?.relatedColumns.filter((ele) => !csvObj?.columns.includes(ele))
    const invalidData = csvObj?.columns.filter(
      (ele) => !matchedCategory[0]?.relatedColumns.includes(ele)
    )
    missingData = missingData.concat(invalidData)
    const missingElementList = []

    missingData.forEach((item) => {
      const filterData = adAccountMeta[0].children.filter((data1) => data1.id === item)
      if (filterData.length > 0) {
        missingElementList.push(filterData[0].title)
      }
    })
    missingData.forEach((item) => {
      const filterData = adAccountMeta[1].children.filter((data1) => data1.id === item)
      if (filterData.length > 0) {
        missingElementList.push(filterData[0].title)
      }
    })
    return missingElementList
  }

  const prepareSamAccount = async (data) => {
    const updatedArray = data
    const inValidArray = []
    const validationStatus = { error: false, errorMessage: '' }

    data.forEach(async (singleObj, index) => {
      if (singleObj === 'duplicate') {
        inValidArray.push(`${errorAtLine}  ${index + 1} : ${duplicateRecords}`)
      } else if (!checkAccountTypePermission(singleObj.accountCategory)) {
        inValidArray.push(`${accountTypeErrorMessage} ${singleObj.accountCategory}`)
      } else if (!checkValidation(singleObj)) {
        const missingElementList = missingElement(singleObj)

        inValidArray.push(
          `${invalidMissingInRow} ${index + 1} ${forTranslation} ${
            singleObj.accountCategory
          } : ${missingElementList.join(',')} `
        )
      } else {
        const localAccountCategory = singleObj.accountCategory.trim()
        const accountStructure = samAccountStructure.filter((eachAccount) =>
          areEqualCaseInsensitive(eachAccount.label, localAccountCategory)
        )

        if (areEqualCaseInsensitive(localAccountCategory, 'CyberArk Named Account (Application)')) {
          updatedArray[
            index
          ].samAccount = `${singleObj.primaryAccount}${accountStructure[0]?.suffix}`
        }
        if (areEqualCaseInsensitive(localAccountCategory, 'Personal - Additional')) {
          updatedArray[
            index
          ].samAccount = `${singleObj.primaryAccount}-${singleObj.accountNameSuffix}`
        }
        if (
          areEqualCaseInsensitive(localAccountCategory, 'CyberArk Named Account (Infrastructure)')
        ) {
          updatedArray[
            index
          ].samAccount = `${singleObj.primaryAccount}${accountStructure[0]?.suffix}`
        }
        if (areEqualCaseInsensitive(localAccountCategory, 'Personal - Admin')) {
          updatedArray[
            index
          ].samAccount = `${singleObj.primaryAccount}${accountStructure[0]?.suffix}`
        }
        if (areEqualCaseInsensitive(localAccountCategory, 'Personal - Desktop Admin')) {
          updatedArray[
            index
          ].samAccount = `${singleObj.primaryAccount}${accountStructure[0]?.suffix}`
        }
        if (areEqualCaseInsensitive(localAccountCategory, 'Personal - Domain Support')) {
          updatedArray[
            index
          ].samAccount = `${singleObj.primaryAccount}${accountStructure[0]?.suffix}`
        }
        if (['Shared - Generic', 'Technical - Generic brokered'].includes(localAccountCategory)) {
          updatedArray[
            index
          ].samAccount = `${singleObj.accountNameMiddle}${accountStructure[0]?.suffix}`
        }
        if (areEqualCaseInsensitive(localAccountCategory, 'Technical - Service/ Process')) {
          updatedArray[
            index
          ].samAccount = `${accountStructure[0]?.prefix}${singleObj.accountNameMiddle}`
        }
        if (areEqualCaseInsensitive(localAccountCategory, 'Technical - Test')) {
          updatedArray[
            index
          ].samAccount = `${singleObj.accountNameMiddle}${accountStructure[0]?.suffix}`
        }
        if (areEqualCaseInsensitive(localAccountCategory, 'CyberArk Role (shared) Account')) {
          const acl = checkValuesFromMeta('accountAccessLevel', singleObj?.accountAccessLevel) // FOR Account Access Level
          const snl = checkValuesFromMeta('serviceNowLevel', singleObj?.serviceNowLevel) // FOR  Service Now Level
          const pt = checkValuesFromMeta('platformType', singleObj?.platformType) // FOR Platform Type
          const region = checkValuesFromMeta('region', singleObj?.region) // FOR Platform Type
          const value = `${accountStructure[0]?.prefix}${region?.value}${acl?.value}${snl?.value}${expressionValues[expressionIndex]}_${singleObj?.dbagApplicationID}_${pt?.value}${accountStructure[0]?.suffix}`

          updatedArray[index].samAccount = value
        }
      }
    })

    if (inValidArray.length === 0) {
      dispatch(updateShowBigLoader(false))
      validateFileDetails(updatedArray)
    } else {
      dispatch(updateShowBigLoader(false))
      validationStatus.errorMessage = inValidArray.join(', ')
      validationStatus.error = true
      setErrors(inValidArray)
    }
  }

  const csvFileToArray = (string) => {
    const csvString = string.trim()
    const headerInput = csvString.split('\n')[0].split(',')
    const csvHeaderInput = headerInput.map((value) => value.replace(/(\r\n|\n|\r)/gm, ''))
    const csvHeader = []
    const array1 = []
    csvHeaderInput.forEach((item, index) => {
      const filterData = adAccountMeta[0].children.filter((data) => data.title === item)
      if (filterData.length > 0) {
        csvHeader[index] = filterData[0].id
      }
    })
    csvHeaderInput.forEach((item, index) => {
      const filterData = adAccountMeta[1].children.filter((data) => data.title === item)
      if (filterData.length > 0) {
        csvHeader[index] = 'businessJustification'
      }
    })
    const headerValidation = expectedHeaders.length === csvHeaderInput.length
    const missingHeaders = expectedHeaders.length > csvHeaderInput.length
    expectedHeaders.forEach((value) => {
      if (!csvHeader.includes(value) && Object.keys(categoryToLabel).includes(value)) {
        array1.push(
          categoryToLabel[value] === 'Account Information'
            ? 'Account Category'
            : categoryToLabel[value]
        )
      }
    })
    if (array1.length > 0) {
      const validationErrorMessages = []
      if (missingHeaders) {
        validationErrorMessages.push(`${invalidMissingHeaderName} : ${array1.join(', ')}   `)
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

    a.setAttribute('download', error ? `errors_${date}` : 'createAdAccount.csv') //  // Setting the anchor tag attribute for downloading, and passing the download file name

    a.click() // Performing a download with click
  }

  const getHeader = (headers) => {
    const headerData = {
      accountCategory: 'Account Category',
      dbagApplicationID: 'Application NAR ID',
      recipient: 'Recipient',
      primaryAccount: 'Primary Account',
      dbagCostcenter: 'Cost Center',
      department: 'Department',
      region: 'Region',
      description: 'Description',
      recertificationPeriod: 'Recertification Period',
      serviceNowLevel: 'Service Now Level',
      platformType: 'Platform Type',
      accountAccessLevel: 'Account Access Level',
      location: 'Location',
      accountNameSuffix: 'Account Name (suffix)',
      accountNameMiddle: 'Account Name (middle)',
      dbagInfrastructureID: 'Infrastructure NAR ID',
      passwordNeverExpires: 'Password Never Expires',
      businessJustification: 'Business Justification'
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
      accountCategory: 'CyberArk Named Account (Application)',
      dbagApplicationID: '134425-1',
      recipient: 'owneremail@db.com',
      primaryAccount: 'DebarshiP',
      location: 'Default Location (Asia-Pacific)',
      dbagCostcenter: '6201126695',
      department: 'Other Assets & Liabilities',
      region: 'Americas',
      serviceNowLevel: 'Level-1 Support',
      dbagInfrastructureID: '46965-1',
      platformType: 'All platforms',
      description: 'Description for CyberArk account',
      recertificationPeriod: '02 Months',
      accountAccessLevel: 'Level 1',
      accountNameSuffix: '3',
      accountNameMiddle: 'kumar',
      passwordNeverExpires: true,
      businessJustification: 'Here you can add business justification'
    }

    const mapping = expectedHeaders.reduce((a, v) => ({ ...a, [v]: data[v] }), {})

    const csvdata = csvmaker(mapping)
    download(csvdata)
  }

  const callSubmitAccount = async (result, payload, index) => {
    dispatch(updateShowBigLoader(true))
    if (result.status === 200) {
      await accountApi
        .submitAdAccount(payload)
        .then((res) => {
          if (res.status === 200) {
            setSuccessCounter((prevState) => prevState + 1)
            setSuccessButtonName('finish')
          } else {
            dispatch(
              updateReviewNotificationMessage({
                type: 'Error',
                message: res?.response?.data?.message
              })
            )
            setErrorEntries((prevState) => [...prevState, array[index]])

            errorArray.push(`${errorAtLine}  ${index + 1} : ${res?.response?.data?.message}`)
            // setErrors((prevState) => [
            //   ...prevState,
            //   `Error occured at line  ${index + 1} : ${res?.response?.data?.message}`
            // ])
            setSuccessButtonName('upload')
          }
        })
        .catch((err) => {
          console.error('err', err)
          setSuccessButtonName('upload')
        })
    } else {
      setErrorEntries((prevState) => [...prevState, array[index]])
      setErrors((prevState) => [
        ...prevState,
        `${errorAtLine}  ${index + 1} : ${result?.response?.data?.message}`
      ])
      setSuccessButtonName('upload')
    }

    return true
  }

  const iff = (condition, value, other) => (condition ? value : other)

  const confirmBulkAction = () => {
    setOpen(false)
    const today = new Date()
    const adAccountDetails = []
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
        array.forEach((singleArray) => {
          const accType = apiAccountTypeItems.filter((apiAccType) =>
            areEqualCaseInsensitive(apiAccType.label, singleArray.accountCategory)
          )[0].label
          adAccountDetails.push({
            common: {
              applicationName: `${applicationNamePrefix}DBG`,
              operation: 'Create',
              category: 'AD Account',
              recepientMail: singleArray.recipient,
              requestorMail: userProfile.email,
              startDate: today.toISOString().split('T')[0],
              endDate: '9999-05-24',
              requestJustification: singleArray.businessJustification
                ? singleArray.businessJustification
                : '',
              isDraft: false,
              rFirstName: userProfile.firstName,
              rLastName: userProfile.lastName,
              accountDescription: `This request will Create ${singleArray.accountCategory}`,
              Accessio_Request_No: '',
              AccessioBulkRequestNumber: unique,
              accountDetails: {
                // accountType: singleArray.accountCategory,
                accountType: accType,
                accountNameSuffix: singleArray.accountNameSuffix
                  ? checkValuesFromMeta('accountNameSuffix', singleArray.accountNameSuffix).value
                  : '',
                middleName: singleArray.accountNameMiddle ? singleArray.accountNameMiddle : '',
                passwordNeverExpires: singleArray.passwordNeverExpires
                  ? iff(singleArray.passwordNeverExpires.toLowerCase() === 'true', true, false)
                  : '',
                dbagApplicationID: singleArray.dbagApplicationID
                  ? singleArray.dbagApplicationID
                  : '',
                dbagInfrastructureID: singleArray.dbagInfrastructureID
                  ? singleArray.dbagInfrastructureID
                  : '',
                primaryAccount: singleArray.primaryAccount,
                domain: 'DBG',
                l: singleArray?.location
                  ? iff(
                      singleArray?.location,
                      checkValuesFromMeta('location', singleArray?.location).label,
                      ''
                    )
                  : iff(
                      singleArray?.region,
                      checkValuesFromMeta('region', singleArray?.region).label,
                      ''
                    ),
                accountStatus: singleArray.accountStatus ? singleArray.accountStatus : '',
                description: singleArray.description,
                recertificationPeriod: singleArray.recertificationPeriod
                  ? checkValuesFromMeta('recertificationPeriod', singleArray.recertificationPeriod)
                      .value
                  : '',
                sAMAccountName: singleArray.samAccount,
                serviceNowLevel: singleArray.serviceNowLevel
                  ? checkValuesFromMeta('serviceNowLevel', singleArray?.serviceNowLevel).label
                  : '',
                platformType: singleArray.platformType
                  ? checkValuesFromMeta('platformType', singleArray?.platformType).label
                  : '',
                dbagCostcenter: singleArray.dbagCostcenter,
                department: singleArray.department,
                accountAccessLevel: singleArray.accountAccessLevel
                  ? checkValuesFromMeta('accountAccessLevel', singleArray?.accountAccessLevel).label
                  : '',
                userAccountControl:
                  singleArray.accountCategory === 'Technical - Service/ Process' ? '66048' : '512'
              }
            }
          })
        })

        setAdAccountArray(adAccountDetails)
      }
    }

    checkUnique()
  }
  const handleConfirm = () => {
    history.push('/dashboard')
  }
  const handleCancel = () => {
    setOpen(true)
    setButtonReference('cancel')
  }

  const getAccoutTypeData = async () => {
    await accountApi.getAccountCategory().then((res) => {
      setApiAccountTypeItems(res)
    })
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
    let validateAdAccount

    const validateAndSubmit = (index) => {
      if (index > adAccountArray.length - 1) {
        return
      }

      const validationPayload = {
        Application_NAR_Id: adAccountArray[index].common.accountDetails?.dbagApplicationID
          ? adAccountArray[index].common.accountDetails.dbagApplicationID
          : '',
        Recipient: adAccountArray[index].common.recepientMail
          ? adAccountArray[index].common.recepientMail
          : '',
        PrimaryAccount: adAccountArray[index].common.accountDetails.primaryAccount
          ? adAccountArray[index].common.accountDetails.primaryAccount
          : '',
        CostCenter: adAccountArray[index].common.accountDetails.dbagCostcenter
          ? adAccountArray[index].common.accountDetails.dbagCostcenter
          : '',
        Department: adAccountArray[index].common.accountDetails.department
          ? adAccountArray[index].common.accountDetails.department
          : '',
        sAMAccount: adAccountArray[index].common.accountDetails.sAMAccountName
          ? adAccountArray[index].common.accountDetails.sAMAccountName
          : '',
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
                  operator: 'EQUALS',
                  operand: {
                    targetName: 'request.common.operation',
                    targetValue: 'Create'
                  }
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
                        targetValue: adAccountArray[index]?.common?.accountDetails?.sAMAccountName
                          ? adAccountArray[index]?.common?.accountDetails?.sAMAccountName
                          : ''
                      }
                    },
                    {
                      operator: 'EQUALS',
                      operand: {
                        targetName: 'request.common.sAMAccountName',
                        targetValue: adAccountArray[index]?.common?.sAMAccountName
                          ? adAccountArray[index]?.common?.sAMAccountName
                          : ''
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
      validateAdAccount(validationPayload, adAccountArray[index], index, true)
    }

    validateAdAccount = async (payload, adAccount, index, isFreshRecords = true) => {
      const validationStatus = { error: false, errorMessage: '' }

      const listofErrors = []
      let iterationInProgress = false
      clearFilters()
      dispatch(updateShowBigLoader(true))

      await axios({
        url: '/v0/account/create/bulkValidation',
        data: payload,
        method: 'post'
      }).then((result) => {
        if (result?.data?.Error) {
          if (result.data.RequestUniqueness !== 'Valid') {
            if (
              adAccount.common.accountDetails.accountType === 'CyberArk Role (shared) Account' &&
              expressionIndex < expressionValues.length - 1
            ) {
              // TODO : For CyberArk Role(shared) Account Increament Expression Values till it gets Valid
              const accountStructure = samAccountStructure.filter(
                (eachAccount) => eachAccount.label === 'CyberArk Role (shared) Account'
              )
              const updateAdAccount = adAccount
              const updatedPayload = payload

              expressionIndex += 1
              // TODO :  Convert Region label to value  checkValuesFromMeta('region', singleObj?.region) // // serviceNowLevel, platformType, reegion,location, accountAccessLevel
              const region = checkValuesFromMeta('region', adAccount.common.accountDetails.l)
              const acl = checkValuesFromMeta(
                'accountAccessLevel',
                adAccount.common.accountDetails.accountAccessLevel
              ) // FOR Account Access Level
              const snl = checkValuesFromMeta(
                'serviceNowLevel',
                adAccount.common.accountDetails.serviceNowLevel
              ) // FOR  Service Now Level
              const pt = checkValuesFromMeta(
                'platformType',
                adAccount.common.accountDetails.platformType
              ) // FOR Platform Type

              // TODO : Generate samAccount

              const value = `${accountStructure[0]?.prefix}${region?.value}${acl?.value}${snl?.value}${expressionValues[expressionIndex]}_${adAccount.common.accountDetails.dbagApplicationID}_${pt?.value}${accountStructure[0]?.suffix}`
              updateAdAccount.common.accountDetails.sAMAccountName = value
              updatedPayload.Req_unique[0].targetFilter.operand[5].operand[0].operand.targetValue =
                value
              updatedPayload.Req_unique[0].targetFilter.operand[5].operand[1].operand.targetValue =
                value
              updatedPayload.sAMAccount = value

              iterationInProgress = true
              validateAdAccount(updatedPayload, updateAdAccount, index, false)
            } else {
              listofErrors.push(`${inValidReqUniqueness} `)
            }
          } else {
            if (
              result.data.ApplicationNARId !== 'Valid' &&
              [
                'CyberArk Named Account (Application)',
                'CyberArk Named Account (Infrastructure)',
                'CyberArk Role (shared) Account',
                'Shared - Generic',
                'Technical - Generic brokered',
                'Technical - Service/ Process'
              ].includes(adAccount.common.accountDetails.accountType)
            ) {
              if (adAccount.common.accountDetails.dbagApplicationID === '') {
                listofErrors.push(
                  `${emptyNarId} (${adAccount.common.accountDetails.dbagApplicationID})`
                )
              } else {
                listofErrors.push(
                  `${inValidNarId} (${adAccount.common.accountDetails.dbagApplicationID})`
                )
              }
            }
            if (
              result.data.CostCenter !== 'Valid' &&
              [
                'CyberArk Named Account (Application)',
                'CyberArk Named Account (Infrastructure)',
                'CyberArk Role (shared) Account'
              ].includes(adAccount.common.accountDetails.accountType)
            ) {
              listofErrors.push(
                `${inValidCostCenter} (${adAccount.common.accountDetails.dbagCostcenter})`
              )
            }
            if (
              result.data.Department !== 'Valid' &&
              [
                'CyberArk Named Account (Application)',
                'CyberArk Named Account (Infrastructure)',
                'CyberArk Role (shared) Account'
              ].includes(adAccount.common.accountDetails.accountType)
            ) {
              listofErrors.push(`${inValidDep} (${adAccount.common.accountDetails.department})`)
            }
            if (result.data.PrimaryAccount !== 'Valid') {
              listofErrors.push(
                `${inValidPrmyAcc} (${adAccount.common.accountDetails.primaryAccount})`
              )
            }
            if (result.data.Recipient !== 'Valid') {
              listofErrors.push(`${inValidRecp} (${adAccount.common.recepientMail})`)
            }

            if (result.data.sAMAccount !== 'Valid' && listofErrors.length === 0) {
              if (
                [
                  'Personal - Admin',
                  'Personal - Desktop Admin',
                  'Personal - Domain Support'
                ].includes(adAccount.common.accountDetails.accountType)
              ) {
                listofErrors.push(
                  `${samAccExists} (${adAccount.common.accountDetails.sAMAccountName})`
                )
              } else if (
                ['CyberArk Role (shared) Account'].includes(
                  adAccount.common.accountDetails.accountType
                ) &&
                expressionIndex < expressionValues.length - 1
              ) {
                // TODO : Increament Expression Value To get uniquness check

                const accountStructure = samAccountStructure.filter(
                  (eachAccount) => eachAccount.label === 'CyberArk Role (shared) Account'
                )
                const updateAdAccount = adAccount
                const updatedPayload = payload

                expressionIndex += 1
                // TODO :  Convert Region label to value  checkValuesFromMeta('region', singleObj?.region)
                const region = checkValuesFromMeta('region', adAccount.common.accountDetails.l)

                const acl = checkValuesFromMeta(
                  'accountAccessLevel',
                  adAccount.common.accountDetails.accountAccessLevel
                ) // FOR Account Access Level
                const snl = checkValuesFromMeta(
                  'serviceNowLevel',
                  adAccount.common.accountDetails.serviceNowLevel
                ) // FOR  Service Now Level
                const pt = checkValuesFromMeta(
                  'platformType',
                  adAccount.common.accountDetails.platformType
                ) // FOR Platform Type
                // TODO :  Generate samAccount
                const value = `${accountStructure[0]?.prefix}${region?.value}${acl?.value}${snl?.value}${expressionValues[expressionIndex]}_${adAccount.common.accountDetails.dbagApplicationID}_${pt?.value}${accountStructure[0]?.suffix}`

                updateAdAccount.common.accountDetails.sAMAccountName = value
                updatedPayload.Req_unique[0].targetFilter.operand[5].operand[0].operand.targetValue =
                  value
                updatedPayload.Req_unique[0].targetFilter.operand[5].operand[1].operand.targetValue =
                  value
                updatedPayload.sAMAccount = value

                iterationInProgress = true
                validateAdAccount(updatedPayload, updateAdAccount, index, false)
              } else {
                listofErrors.push(
                  `${accountExists} (${adAccount.common.accountDetails.sAMAccountName})`
                )
              }
            }
          }
          if (listofErrors.length && listofErrors.length > 0) {
            validationStatus.errorMessage = listofErrors.join(', ')
            validationStatus.error = true
            errorArray.push(`${errorAtLine} ${index + 1} : ${validationStatus.errorMessage}`)
            setErrorEntries((prev) => [...prev, array[index]])
          }
        }
        // For Cyberark
        if (listofErrors.length === 0 && !iterationInProgress) {
          const submissionResult = callSubmitAccount(result, adAccount, index)
          if (submissionResult) {
            validateAndSubmit(index + 1)
          }
        } else {
          validateAndSubmit(index + 1)
        }
        if (isFreshRecords) {
          processRequest1 += 1
          setProcessRequest({
            totalRequest: adAccountArray.length,
            ongoingRequest: processRequest1
          })
        }

        if (processRequest1 === adAccountArray.length) {
          setErrors(errorArray)
          dispatch(updateShowBigLoader(false))
          setProcessRequest({
            totalRequest: 0,
            ongoingRequest: 0
          })
        }
      })
    }

    validateAndSubmit(0)
  }, [adAccountArray])

  useEffect(() => {
    if (successCounter > 0) {
      dispatch(
        updateReviewNotificationMessage({
          type: 'Success',
          message: `${successCounter} ${
            successCounter === 1 ? 'account' : 'accounts'
          } has been submitted successfully`
        })
      )
      setSuccessMessage(
        `${successCounter} ${
          successCounter === 1 ? 'account' : 'accounts'
        } has been submitted successfully`
      )
    }
  }, [successCounter])

  useEffect(() => {
    getAccoutTypeData()
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
    accountApi.getAccountCategories().then((res) => {
      setAccountCategories(res)
    })

    accountApi.getCreateADAccount().then((res) => {
      setCategoryToLabel(res.labelToCategory)
      setAdAccountMeta(res.steps)
      setSamAccountStructure(res.SAMAccountDataStucture)
    })
  }, [])
  const checkDisplayType = (Obj) => !Obj.disabled && !Obj.hidden && !Obj.readOnly

  useEffect(() => {
    const categories = []
    const headers = []
    if (adAccountMeta.length && accountCategories.length) {
      let Obj = {}
      let releatedTo = []
      accountCategories.forEach((item) => {
        Obj = { label: item.label, value: item.value }
        adAccountMeta.forEach((account, index) => {
          if ([0].includes(index)) {
            releatedTo = adAccountMeta[0].children
              .filter(
                (eachChild) =>
                  (eachChild?.relatedTo?.includes(item.value) &&
                    ![
                      'iTAO',
                      'iTAODelegate',
                      'name',
                      'PrincipalsAllowedToRetrieveManagedPassword',
                      'ManagedPasswordIntervalInDays',
                      'KerberosEncryptionType1',
                      'KerberosEncryptionType2'
                    ].includes(eachChild.id) &&
                    checkDisplayType(eachChild?.displayType)) ||
                  ['primaryAccount', 'accountCategory'].includes(eachChild.id)
              )
              .map((singleItem) => singleItem.id)
            releatedTo.push('businessJustification')
            headers.push(...releatedTo)
            categories.push({ ...Obj, relatedColumns: releatedTo })
          }
        })
      })

      setReleatedColumns(categories)
      setExpectedHeaders([...new Set(headers)])
    }
  }, [adAccountMeta, accountCategories])

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
            label: translate('navItem.label.createBulkRequests'),
            url: ''
          }
        ]}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Styled.HeaderWrapper>
          <h1 style={{ fontWeight: 'normal', marginBottom: '10px' }}>
            {translate('create.bulkrequest.title')}
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
                <p style={{ color: '#F00' }}>{translate('modify.errorHeader')}</p>
                <Grid container spacing={4}>
                  <ul>
                    {errors &&
                      errors.map((error) => (
                        <Grid
                          item
                          xs={12}
                          sx={{ display: 'flex', color: '#F00', overflowWrap: 'anywhere' }}
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

export default BulkCreate
