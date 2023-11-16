import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Button from '@mui/material/Button'
import { Typography, Grid } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { toCamelCase } from 'helpers/strings'
import Breadcrumb from 'components/breadcrumb'
import formGenerator from 'components/formGenerator'
import { Notification } from 'components/notification'
import translate from 'translations/translate'
import {
  setSummaryInitialState,
  setadAccountInitialState
} from '../../../redux/requests/activeDirectory/activeDirectorySlice'
import { selectNotificationMessage } from '../../../redux/review/review.selector'
import { selectMyAssetsItems } from '../../../redux/myAssets/myAssets.selector'
import { selectDraftsItems } from '../../../redux/drafts/drafts.selector'
import { updateShowBigLoader } from '../../../redux/myAssets/myAssets.action'
import { updateReviewNotificationMessage } from '../../../redux/review/review.action'
import * as profileAPI from '../../../api/profile'
import * as Styled from './style'
import * as accountApi from '../../../api/accountManagement'
import * as draftsApi from '../../../api/drafts'
import useTheme from '../../../hooks/useTheme'
import Loading from '../../../components/loading'
import axios from '../../../axios'
import { applicationNamePrefix, ternaryCheck } from '../../../helpers/utils'
import { selectMyTeamSearchItem } from '../../../redux/myTeam/myTeam.selector'
import { formatUTCDate } from '../../../helpers/strings'

const Modify = () => {
  const type = localStorage.getItem('component')
  const [steps, setSteps] = useState([])
  const [stepperData, setSteppersData] = useState([])
  const [blockData, setBlockData] = useState([])
  const [lineItem, setLineItem] = useState([])
  const [activeStep, setActiveStep] = React.useState(0)
  const [activeBlock, setActiveBlock] = React.useState(0)
  const [activeSubStep, setActiveSubStep] = React.useState(false)
  const [totalSubSteps, setTotalSubSteps] = React.useState(0)
  const [completed, setCompleted] = React.useState({})
  const [summaryData, setSummaryData] = useState([])
  const [accountCategory, setAccountCategory] = React.useState('')
  const [accountArray, setAccountArray] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [categoryData, setcategoryData] = useState({})
  const [categoryToLabel, setCategoryToLabel] = useState({})
  const [prefetchedOptions, setPrefetchedOptions] = useState([])
  const [draftAutocompleteValues, setDraftAutocompleteValues] = useState([])
  const [savedToDraft, setSavedToDraft] = useState(false)
  const [userProfile, setUserProfile] = useState({})
  const [notification, setNotification] = useState({ description: '', variant: '' })
  const [InfraId, setInfraId] = useState('')
  const [loader, setLoader] = useState(false)
  const [nextButton, setNextButton] = useState(false)
  const [approverValidate, setApproverValidate] = useState([])
  const { theme } = useTheme()
  const history = useHistory()
  const dispatch = useDispatch()
  const results =
    type === 'Drafts' ? useSelector(selectDraftsItems) : useSelector(selectMyAssetsItems)
  const getNotificationMessage = useSelector(selectNotificationMessage)
  const queryParams = new URLSearchParams(window.location.search)
  const requestId = queryParams.get('id')
  const columnSX = 4
  const noITAOInfo = translate('create.noITAOInfo')
  const noITAODelegateInfo = translate('create.noITAODelegateInfo')
  const noTISOInfo = translate('create.noTISOInfo')
  const noDiso = translate('create.noDISOInfo')
  const noTISODelegateInfo = translate('create.noTISODelegateInfo')
  const mandatoryErrorMessage = translate('create.ADAccount.mandatoryErrorMessage')
  const expiryValidationMessage = translate('modify.expiry.validationMessage')
  const autocompleteOptionValues = []
  const myTeamSearchItem = useSelector(selectMyTeamSearchItem)
  const myTeamSelectedUserId = localStorage.getItem('myTeam-userId')
  const myTeamSelectedUser = localStorage.getItem('myTeam-userName')
  const resetAllStates = () => {
    setSteps([])
    setSteppersData([])
    setBlockData([])
    setLineItem([])
    setActiveStep(0)
    setActiveBlock(0)
    setActiveSubStep(false)
    setTotalSubSteps(0)
    setCompleted({})
    setSummaryData([])
    setAccountCategory('')
    setAccountArray([])
    setOpen(false)
    setcategoryData({})
    setCategoryToLabel({})
  }

  const valueFinder = (fieldId) => {
    // let finalValue = ''
    // if (fieldId === 'kerberosEncryptionType') {
    //   const updatedArray = steps[0]?.children?.findIndex((item) => item.id === item)
    //   finalValue = steps[0]?.children[updatedArray]?.options
    // } else {
    //   const targetIndex = accountArray.findIndex((field) => field.id === fieldId)
    //   finalValue = accountArray[targetIndex].value
    // }
    // return finalValue
    const targetIndex = accountArray.findIndex((field) => field.id === fieldId)
    return accountArray[targetIndex].value
  }

  const optionFinder = (fieldId) => {
    const targetIndex = prefetchedOptions.findIndex((field) => field.id === fieldId)
    return prefetchedOptions[targetIndex].options
  }

  const disabledFlagFinder = (fieldId) => {
    const targetIndex = accountArray.findIndex((field) => field.id === fieldId)
    return accountArray[targetIndex].disabled
  }

  const readOnlyFlagFinder = (fieldId) => {
    const targetIndex = accountArray.findIndex((field) => field.id === fieldId)
    return accountArray[targetIndex].readOnly
  }

  const hiddenFlagFinder = (fieldId) => {
    const targetIndex = accountArray.findIndex((field) => field.id === fieldId)
    return accountArray[targetIndex].hidden
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

  const convertDateTimeToUTC = (value) => {
    if (![undefined, null, ''].includes(value)) {
      const data = new Date(value)
      return `${formatUTCDate(data.getUTCMonth() + 1)}/${formatUTCDate(
        data.getUTCDate()
      )}/${data.getUTCFullYear()} ${formatUTCDate(data.getUTCHours())}:${formatUTCDate(
        data.getUTCMinutes()
      )}`
    }

    return ''
  }
  const handlefieldChanges = (
    event,
    value,
    category,
    id,
    valueLabel,
    helperTextValue,
    eletype,
    valueObj,
    errorState
  ) => {
    const elementModified = event.target.id ? event.target.id.split('-')[0] : id
    const newValue = value
    setNextButton(false)
    if (eletype === 'autocomplete' && valueLabel === '') {
      setAccountArray((updatedList) =>
        updatedList.map((item) => {
          if (item.id === elementModified) {
            return {
              ...item,
              value: '',
              displayLabel: '',
              error: false,
              helperText: helperTextValue
            }
          }
          return item
        })
      )
      return
    }

    setAccountArray((updatedList) =>
      updatedList.map((item) => {
        if (item.id === elementModified) {
          if (item.id === 'expiry') {
            const maxDate = new Date(new Date().getTime() + 180 * 24 * 60 * 60 * 1000)
            const dateValidation = !['', undefined, null].includes(value)
              ? maxDate.getTime() > new Date(value).getTime()
              : true
            const date = `${new Date(value).toUTCString().split(',')[1]}`
            const newLabel = date.indexOf('GMT') > -1 ? date.replace('GMT', '') : date
            const helperText =
              dateValidation && !['', undefined, null].includes(value)
                ? `UTC value : ${convertDateTimeToUTC(value)}`
                : ''

            if (!dateValidation) {
              dispatch(
                updateReviewNotificationMessage({
                  type: 'Error',
                  message: expiryValidationMessage
                })
              )
            }
            return {
              ...item,
              value: dateValidation ? newValue : '',
              displayLabel: !['', undefined, null].includes(value) ? newLabel : 'Never',
              error: false,
              helperText
            }
          }
          return {
            ...item,
            value: newValue,
            displayLabel: valueLabel,
            error: errorState,
            helperText: helperTextValue
          }
        }
        return item
      })
    )
  }

  // Below Function to Set Service Principal Value on Selection of Service class and Port No

  const servicePrincipalValue = (data) => {
    if (data && data.length > 0) {
      const gmsaTableValue = []
      const gmsaTempArr = []

      data.forEach((item) => {
        const serviclass = item?.age || item?.serviclass
        const portNo = item?.portNo || item?.port

        const Obj = {
          label: item?.value,
          value: item?.value,
          portNo,
          serviclass
        }
        gmsaTempArr.push(Obj)

        gmsaTableValue.push(`${serviclass}/${item?.value}:${portNo}`)
      })

      setAccountArray((modifiedList) =>
        modifiedList.map((item) => {
          if (item.id === 'servicePrincipalName') {
            return {
              ...item,
              value: gmsaTempArr,
              displayLabel: gmsaTableValue.join(',')
            }
          }
          return item
        })
      )
    }
  }

  const displayFields = (relation) => {
    let isDisplay = false
    if (Array.isArray(relation)) {
      isDisplay = relation.includes(accountCategory)
    } else {
      isDisplay = relation === accountCategory
    }
    return isDisplay
  }

  const displaySummary = (fields) => {
    const updateFields = fields.filter((data) => data !== 'gmsaTable')
    const result = updateFields.map((field) => ({
      id: toCamelCase(field),
      title: field,
      heading: field,
      status: 'Completed',
      mapping: toCamelCase(field),
      children: []
    }))

    setSummaryData(result)
    dispatch(setSummaryInitialState({ data: result }))
  }

  const adAccountObjGenerator = (
    objRepo,
    adAccountObj,
    adAccountSummaryObj,
    adAccountCategoryObj
  ) => {
    objRepo.forEach((child) => {
      const providedDefaultValue = child.default && child.default !== '' ? child.default : ''
      adAccountSummaryObj.push(child.category)
      adAccountObj.push({
        id: child.id,
        label: child.label,
        value: providedDefaultValue,
        helperText: '',
        error: false,
        requiredField: child.requiredField,
        category: child.category,
        relatedTo: child.relatedTo ? child.relatedTo : '',
        displayLabel: '',
        name: child.name,
        hidden: child.displayType.hidden,
        readOnly: child.displayType.readOnly,
        disabled: child.displayType.disabled
      })
      if (child.type === 'autocomplete') {
        if (child.default !== '') {
          // Provision to make API call when any autocomplete comes with an value
        }
        adAccountCategoryObj.push({ id: child.id, options: [] })
      }
    })
  }

  const constructAdResponse = (obj) => {
    // Reset the account array to blank array before starting any operation
    setAccountArray([])
    const adAccountObj = []
    const adAccountSummaryObj = []
    const adAccountCategoryObj = []
    // Logic for looping provided obj and setting Account, Summary and prefetched options
    obj.forEach((block) => {
      if (!block.children && !block.substeps) {
        return
      }
      if (block.children) {
        adAccountObjGenerator(
          block.children,
          adAccountObj,
          adAccountSummaryObj,
          adAccountCategoryObj
        )
      }
      if (block.substeps) {
        block.substeps.forEach((child) => {
          adAccountObjGenerator(
            child.children,
            adAccountObj,
            adAccountSummaryObj,
            adAccountCategoryObj
          )
        })
      }
    })

    // Set account information object
    setAccountArray(adAccountObj)
    setPrefetchedOptions(adAccountCategoryObj)
    dispatch(setadAccountInitialState({ data: adAccountObj }))
    displaySummary([...new Set(adAccountSummaryObj)])
  }

  const helperFinder = (fieldId) => {
    const targetIndex = accountArray.findIndex((field) => field.id === fieldId)
    return accountArray[targetIndex].helperText
  }

  const errorFinder = (fieldId) => {
    const targetIndex = accountArray.findIndex((field) => field.id === fieldId)
    return accountArray[targetIndex].error
  }

  const totalSteps = () => stepperData.length

  const completedSteps = () => Object.keys(completed).length

  const isLastStep = () => activeStep === totalSteps() - 1
  const hasFurtherSubsteps = () => activeSubStep < steps[blockData[activeStep]].substeps.length - 1

  const allStepsCompleted = () => completedSteps() === totalSteps()

  const validateForm = () => {
    let isValid = true
    // before validation any step clear the last step error state
    setAccountArray((updatedList) =>
      updatedList.map((item) => {
        if (item.value === '') {
          return { ...item, error: false, helperText: '' }
        }
        return item
      })
    )
    if (activeSubStep !== false && steps[activeStep].substeps) {
      steps[activeStep].substeps[activeSubStep].children.forEach((child) => {
        if (child.requiredField) {
          accountArray.forEach((eleData) => {
            if (isValid === true && child.id === eleData.id && eleData.value === '') {
              if (child.relatedTo && child.relatedTo.includes(accountArray[0].value)) {
                isValid = false
              } else if (!child.relatedTo) {
                isValid = false
              }
            }
          })
        }
      })
    } else {
      steps[activeStep].children.forEach((child) => {
        if (child.requiredField) {
          accountArray.forEach((eleData) => {
            // Following condition is for empty value check
            if (
              isValid === true &&
              child.id === eleData.id &&
              ((typeof eleData.value === 'string' && eleData.value?.trim() === '') ||
                eleData.value === '' ||
                eleData.value === undefined ||
                (Array.isArray(eleData?.value) && eleData?.value?.length === 0))
            ) {
              if (
                (child.relatedTo && child.relatedTo.includes(accountArray[0].value)) ||
                eleData.id === 'businessJustification'
              ) {
                isValid = false
              } else if (!child.relatedTo) {
                isValid = false
              }
            }
            // Following condition is for incorrect value eg. special characters in the Business Justification
            else if (eleData.error && eleData.value) {
              isValid = false
            }
          })
        }
      })
    }
    if (isValid === false) {
      setAccountArray((updatedList) =>
        updatedList.map((item) => {
          if (
            ((typeof item.value === 'string' && item.value?.trim() === '') ||
              item.value === '' ||
              item.value === undefined ||
              (Array.isArray(item?.value) && item?.value?.length === 0)) &&
            item.requiredField === true
          ) {
            return {
              ...item,
              error: true,
              helperText: `${mandatoryErrorMessage}`
            }
          }
          return item
        })
      )
    }
    return isValid
  }

  // used this function to display recipient value in summary page
  const displaySummaryValue = (consition, then, otherise) => (consition ? then : otherise)

  const clearExtraSpaces = () => {
    setAccountArray((updatedList) =>
      updatedList.map((item) => ({
        ...item,
        value: typeof item.value === 'string' ? item.value?.trim() : item.value,
        displayLabel:
          typeof item.displayLabel === 'string' ? item.displayLabel?.trim() : item.displayLabel
      }))
    )
  }
  const constructSummaryPage = async () => {
    // get Approval Information
    setLoader(true)
    const summaryDetails = [JSON.parse(localStorage.getItem('assetsData'))]
    const category = summaryDetails[0]?.category
    let employeeType = summaryDetails[0]?.employeeType
    const sAMAccountName = summaryDetails[0]?.sAMAccountName
    let samAttribute = ''
    if (sAMAccountName && sAMAccountName.includes('_') && !sAMAccountName.includes('-')) {
      // eslint-disable-next-line prefer-destructuring
      samAttribute = sAMAccountName.split('_')[0]
    }
    if (sAMAccountName && sAMAccountName.includes('-')) {
      const checkForSamAcc = sAMAccountName.split('-')
      samAttribute = checkForSamAcc[checkForSamAcc.length - 1]
    }
    const receipient = accountArray.filter((item) => item.id === 'recipient')
    const narId = accountArray.filter((item) => item.id === 'dbagApplicationID')
    let delegateDetails
    let InfraIdDetails

    if (InfraId) {
      InfraIdDetails = await accountApi
        .getITAOandITAODelegate(InfraId)
        .then((res) => {
          const itaoDetails = `${res.itao ? res.itao : noITAOInfo}/${
            res?.itaoDelegate ? res?.itaoDelegate : noITAODelegateInfo
          }`
          return itaoDetails
        })
        .catch((err) => {
          console.error('err', err)
        })
    }
    if ((Array.isArray(narId[0]?.value) && narId[0]?.value.length > 0) || narId[0]?.value) {
      delegateDetails = await accountApi
        .getITAOandITAODelegate(
          typeof narId[0].value === 'object' ? narId[0].value?.value : narId[0].value
        )
        .then((res) => {
          const details = {}
          details.ITAODetails = `${res.itao ? res.itao : noITAOInfo}/${
            res?.itaoDelegate ? res?.itaoDelegate : noITAODelegateInfo
          }`

          details.tisoAndItao = `${res?.tiso ? res?.tiso : noTISOInfo}/${
            res?.tisoDelegate ? res?.tisoDelegate : noTISODelegateInfo
          }/${res?.itao ? res?.itao : noITAOInfo}/${
            res?.itaoDelegate ? res?.itaoDelegate : noITAODelegateInfo
          }`
          details.diso = res?.chiefBiso ? res.chiefBiso : noDiso
          return details
        })
        .catch((err) => {
          console.error('err', err)
        })
    }

    if (employeeType === undefined) {
      switch (category) {
        case 'Personal - Additional':
          employeeType = 'Secnd'
          break
        case 'Personal - Admin':
        case 'CyberArk Named Account (Application)':
        case 'CyberArk Named Account (Infrastructure)':
          employeeType = 'Admin'
          break
        case 'CyberArk Role (shared) Account':
        case 'Technical Generic Brokered':
          employeeType = 'GenB'
          break
        case 'Personal - Desktop Admin':
          employeeType = 'DAdmin'
          break
        case 'Personal - Domain Support':
          employeeType = 'Domspt'
          break
        case 'Technical - Test':
          employeeType = 'Test'
          break
        case 'Technical - Service/ Process':
          employeeType = 'Svc'
          break
        case 'Shared - Generic':
          employeeType = 'Gen'
          break
        case 'gMSA (Group Managed Service Account)':
          employeeType = 'gMSA_Account'
          break
        default:
          break
      }
    }

    accountApi
      .getApproverInformationForAmend(
        `${applicationNamePrefix}DBG`,
        'Amend',
        (samAttribute = valueFinder('accountCategory') === 'gMSA' ? '$' : samAttribute), // FOR GMSA samAccount is $ to get Approver information
        employeeType
      )
      .then(async (res) => {
        const getLabelValue = (label) => {
          if (['ITAO/ITAO Delegate Application'].includes(label)) {
            return delegateDetails && delegateDetails.ITAODetails ? delegateDetails.ITAODetails : ''
          }
          if (['TISO/TISO Delegate/ITAO/ITAO Delegate'].includes(label)) {
            return delegateDetails && delegateDetails.tisoAndItao ? delegateDetails.tisoAndItao : ''
          }
          if (['ITAO/ ITAO Delegate Infrastructure'].includes(label)) {
            return InfraIdDetails || ''
          }
          if (['D-ISO'].includes(label)) {
            return delegateDetails && delegateDetails.diso ? delegateDetails.diso : ''
          }
          if (['ITAO/ITAO Delegate'].includes(label)) {
            return delegateDetails && delegateDetails.ITAODetails ? delegateDetails.ITAODetails : ''
          }
          return ''
        }
        const getAPIData = async (delegateDetailsArrayy) => {
          let ress
          let count = 0
          // eslint-disable-next-line no-restricted-syntax
          for (const node of delegateDetailsArrayy) {
            try {
              // eslint-disable-next-line no-await-in-loop
              ress = await accountApi.getOptionsById('/v0/governance/getEmailAddress', {
                emailId: node,
                exactMatch: true
              })
              if (!ress) {
                count += 1
              }
            } catch (error) {
              console.log(error)
            }
          }
          return count
        }
        const approverChildren = []
        const errorArray = []
        if (typeof res === 'object') {
          if (!['null', ''].includes(res?.l1)) {
            approverChildren.push({
              id: 'L1',
              name: 'L1',
              label: 'L1',
              value: res?.l1 === 'LM' ? 'Line Manager Approval' : res?.l1,
              labelValue:
                res?.l1 === 'LM'
                  ? displaySummaryValue(receipient && receipient.length, receipient[0]?.manager, '')
                  : getLabelValue(res.l1)
            })
            if (res?.l1 === 'LM' && receipient && receipient.length) {
              let errorCount = 0
              await accountApi
                .getOptionsById('/v0/governance/getEmailAddress', {
                  emailId: receipient && receipient.length ? receipient[0]?.manager : '',
                  exactMatch: true
                })
                .then((result) => {
                  if (result.length === 0) {
                    errorCount += 1
                  }
                })
              if (errorCount > 0) {
                errorArray.push('L1')
              }
            } else {
              const delegateDetailsArray = getLabelValue(res.l1)?.split('/')
              const apiResult = await getAPIData(delegateDetailsArray)
              if (apiResult === delegateDetailsArray.length) {
                errorArray.push('L1')
              }
            }
          }
          if (!['null', ''].includes(res?.l2)) {
            approverChildren.push({
              id: 'L2',
              name: 'L2',
              label: 'L2',
              value: res.l2,
              labelValue: getLabelValue(res.l2)
            })
            const delegateDetailsArray = getLabelValue(res.l2)?.split('/')
            const apiResult = await getAPIData(delegateDetailsArray)
            if (apiResult === delegateDetailsArray.length) {
              errorArray.push('L2')
            }
          }
          setApproverValidate(errorArray)
          if (!['null', ''].includes(res?.l3)) {
            approverChildren.push({ id: 'L3', name: 'L3', label: 'L3', value: res.l3 })
          }
        }

        const updatedList1 = [...summaryData].map((item) => {
          const targetChildren = accountArray.filter((account) => {
            if (
              (!account.relatedTo || account.relatedTo.includes(accountCategory)) &&
              account.category === item.mapping
            ) {
              if (
                account.id === 'portno' ||
                account.id === 'serviceClass' ||
                account.id === 'gmsaTable'
              ) {
                return false
              }
              return {
                label: account.label,
                value: account.value,
                displayLabel: account.displayLabel
              }
            }
            return false
          })
          return { ...item, children: targetChildren }
        })

        if (approverChildren.length > 0) {
          const approver = {
            heading: 'approver',
            id: 'approver',
            title: 'approver',
            children: approverChildren
          }
          if (typeof updatedList1[2] !== 'undefined') {
            updatedList1.splice(2, 1)
          }
          updatedList1.push(approver)
        } else if (approverChildren.length === 0) {
          const approver = {
            heading: 'approver',
            id: 'approver',
            title: 'approver',
            children: ''
          }
          if (typeof updatedList1[2] !== 'undefined') {
            updatedList1.splice(2, 1)
          }
          updatedList1.push(approver)
        }
        setSummaryData(updatedList1)
        setLoader(false)
      })
      .catch((err) => {
        console.error('err', err)
        setLoader(false)
      })
  }
  const checkIfModified = () => {
    let isModified = false
    const validationKeys = [
      'dbagApplicationID',
      'accountExpires',
      'userAccountControl',
      'dbagCostcenter',
      'servicePrincipalName',
      'ManagedPasswordIntervalInDays',
      'PrincipalsAllowedToRetrieveManagedPassword',
      'name'
    ]
    const summaryDetails = [JSON.parse(localStorage.getItem('assetsData'))]
    accountArray.forEach((o) => {
      if (
        validationKeys.includes(o.name) &&
        isModified === false &&
        o.relatedTo &&
        o.relatedTo.includes(accountArray[0].value)
      ) {
        switch (o.name) {
          case 'dbagApplicationID':
            isModified =
              (typeof o.value === 'object' ? o.value.value : o.value) !==
              summaryDetails[0].dbagApplicationID
            break
          case 'dbagCostcenter':
          case 'PrincipalsAllowedToRetrieveManagedPassword':
            isModified =
              (typeof o?.value === 'object' ? o?.value?.value : o?.value) !==
              summaryDetails[0]?.dbagCostcenter
            break
          case 'ManagedPasswordIntervalInDays':
          case 'name':
            isModified = o?.value !== summaryDetails[0]?.ManagedPasswordIntervalInDays
            break
          case 'accountExpires':
            isModified = o.value !== summaryDetails[0].expiry.slice(0, 16)
            break
          case 'userAccountControl':
            isModified =
              (o.value !== '512' && summaryDetails[0]?.accountStatus === 'Enabled') ||
              (o.value !== '514' && summaryDetails[0]?.accountStatus === 'Disabled')
            break
          case 'servicePrincipalName':
            isModified = o?.value?.length !== summaryDetails[0]?.servicePrincipalName?.length
            break
          default:
            break
        }
      }
    })
    return isModified
  }
  // For KerbosEncyption Type
  const setKerbosEncryption = () => {
    setAccountArray((updatedList) =>
      updatedList.map((item) => {
        if (item.id === 'name') {
          return {
            ...item,
            displayLabel: `gM_${item?.value}`,
            label: 'metaData.gMSAName',
            error: false,
            helperText: ''
          }
        }
        if (['KerberosEncryptionType1', 'KerberosEncryptionType2'].includes(item.id)) {
          if (
            ['KerberosEncryptionType2', 'KerberosEncryptionType1'].includes(item.id) ||
            (valueFinder('KerberosEncryptionType1') === true &&
              valueFinder('KerberosEncryptionType2') === true)
          ) {
            return {
              ...item,
              displayLabel: 'AES128,AES256',
              label: 'metaData.kerbosEncryption',
              error: false,
              helperText: ''
            }
          }
          if (
            item.id === 'KerberosEncryptionType1' &&
            valueFinder('KerberosEncryptionType1') === true
          ) {
            return {
              ...item,

              displayLabel: 'AES128',
              label: 'metaData.kerbosEncryption',
              error: false,
              helperText: ''
            }
          }
          if (
            item.id === 'KerberosEncryptionType2' &&
            valueFinder('KerberosEncryptionType2') === true
          ) {
            return {
              ...item,
              displayLabel: 'AES256',
              label: 'metaData.kerbosEncryption',
              error: false,
              helperText: ''
            }
          }
        }

        return item
      })
    )
  }

  const handleNext = async () => {
    if (valueFinder('accountCategory') === 'gMSA') {
      setKerbosEncryption()
    }

    clearExtraSpaces()
    if (type === 'Drafts' || checkIfModified()) {
      if (await validateForm()) {
        if (!steps[activeStep + 1].substeps && !steps[activeStep + 1].children) {
          const newCompleted = completed
          newCompleted[activeStep] = true
          const newActiveStep =
            isLastStep() && !allStepsCompleted()
              ? steps.findIndex((step, i) => !(i in completed))
              : activeStep + 1
          setActiveStep(newActiveStep)
          setActiveBlock(blockData[newActiveStep])
          constructSummaryPage()
          return
        }
        if (activeSubStep !== false && hasFurtherSubsteps()) {
          setActiveSubStep(activeSubStep + 1)
        } else {
          const newCompleted = completed
          newCompleted[activeStep] = true
          const newActiveStep =
            isLastStep() && !allStepsCompleted()
              ? steps.findIndex((step, i) => !(i in completed))
              : activeStep + 1
          setActiveStep(newActiveStep)
          setActiveBlock(blockData[newActiveStep])
        }
      }
    } else {
      setNextButton(true)
      setNotification({
        description: 'modify.needModification',
        variant: 'error'
      })
    }
  }
  const handleBack = () => {
    if (activeSubStep !== false && activeSubStep !== 0) {
      setActiveSubStep(activeSubStep - 1)
    } else {
      const newPrevStep = activeStep - 1
      setActiveStep(newPrevStep)
      setActiveBlock(blockData[newPrevStep])
      if (steps[blockData[newPrevStep]].substeps) {
        setActiveSubStep(
          steps[blockData[newPrevStep]].substeps
            ? steps[blockData[newPrevStep]].substeps.length - 1
            : false
        )
      }
    }
  }

  const editHandler = (eStep) => {
    const index = steps.findIndex((step) => toCamelCase(step.heading) === eStep)
    setActiveStep(index)
    setActiveBlock(blockData[index])
  }

  const handleReset = () => {
    resetAllStates()
  }

  const handleConfirm = () => {
    resetAllStates()
    history.push(type === 'MyTeam' ? `/my-team/${myTeamSearchItem[0]?.id}` : '/my-asset')
  }

  const displayStepperBlock = (blocknumber) => blocknumber === activeBlock
  const displaySubStepperBlock = (subblocknumber, parentIndex) =>
    parentIndex === activeStep && subblocknumber === activeSubStep

  const checkUniqueRequest = async () => {
    const summaryDetails = [JSON.parse(localStorage.getItem('assetsData'))]
    const payload = {
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
                  targetValue: summaryDetails[0]?.sAMAccountName
                    ? summaryDetails[0]?.sAMAccountName
                    : ''
                }
              },
              {
                operator: 'EQUALS',
                operand: {
                  targetName: 'request.common.sAMAccountName',
                  targetValue: summaryDetails[0]?.sAMAccountName
                    ? summaryDetails[0]?.sAMAccountName
                    : ''
                }
              }
            ]
          }
        ]
      }
    }

    const resp = await accountApi.validateUniqueRequest(payload)
    if (resp?.result?.length > 0) {
      dispatch(updateShowBigLoader(false))
      return false
    }
    return true
  }
  const iff = (condition, then, other) => (condition ? then : other)
  const checkElementModified = (element) => {
    let isModified = false
    const summaryDetails = [JSON.parse(localStorage.getItem('assetsData'))]
    const expiryDate =
      summaryDetails[0]?.expiry && !['0', null, ''].includes(summaryDetails[0]?.expiry)
        ? summaryDetails[0]?.expiry?.slice(0, 16)
        : summaryDetails[0]?.expiry
    if (summaryDetails && summaryDetails[0]) {
      switch (element.id) {
        case 'dbagApplicationID':
          isModified =
            // for future use if needed
            (typeof element.value === 'object' ? element.value.value : element.value) !==
            iff(
              typeof summaryDetails[0]?.dbagApplicationID === 'object',
              summaryDetails[0]?.dbagApplicationID[0],
              summaryDetails[0]?.dbagApplicationID
            )
          // (element.value && element.value.value ? element.value.value : element.value) !==
          // summaryDetails[0]?.dbagApplicationID[0]
          break
        case 'dbagCostcenter':
          isModified =
            // for future use if needed
            (typeof element.value === 'object' ? element.value.value : element.value) !==
            iff(
              typeof summaryDetails[0]?.dbagCostcenter === 'object',
              summaryDetails[0]?.dbagCostcenter[0],
              summaryDetails[0]?.dbagCostcenter
            )

          break
        case 'ManagedPasswordIntervalInDays':
          isModified = element.value !== summaryDetails[0]?.ManagedPasswordIntervalInDays
          break
        case 'PrincipalsAllowedToRetrieveManagedPassword':
          isModified =
            (typeof element.value === 'object' ? element.value.value : element.value) !==
            summaryDetails[0]?.PrincipalsAllowedToRetrieveManagedPassword
          break
        case 'name':
          isModified = element.value !== summaryDetails[0]?.name
          break
        case 'servicePrincipalName':
          isModified = Array.isArray(element.displayLabel)
            ? element.displayLabel?.length !== summaryDetails[0]?.servicePrincipalName?.length
            : element.displayLabel !==
              iff(
                Array.isArray(summaryDetails[0]?.servicePrincipalName),
                summaryDetails[0]?.servicePrincipalName[0],
                summaryDetails[0]?.servicePrincipalName
              )
          break
        case 'expiry':
          isModified = element.value !== expiryDate
          break
        case 'accountStatus':
          isModified = element.displayLabel !== summaryDetails[0]?.accountStatus
          break

        default:
          break
      }
    }

    return isModified
  }

  const handleComplete = async (draftValue) => {
    setSavedToDraft(draftValue)
    if (checkIfModified() || type === 'Drafts') {
      const summaryDetails = [JSON.parse(localStorage.getItem('assetsData'))]
      // Call check uniqueness API
      if (await checkUniqueRequest()) {
        const adAccountDetails = {}
        const commonObject = {
          applicationName: `${applicationNamePrefix}DBG`,
          operation: 'Amend',
          category: 'AD Account',
          recepientMail: summaryDetails[0].recepientMail,
          requestorMail: userProfile.email,
          requestJustification: '',
          sAMAccountName: '',
          accountType: '',
          rFirstName: userProfile.firstName,
          rLastName: userProfile.lastName,
          Accessio_Request_No: '',
          isDraft: draftValue
        }

        // from where should i get this data
        const accountDetailsObject = {}

        const commonDataKeys = ['requestJustification', 'sAMAccountName', 'accountType']

        accountArray.forEach((o) => {
          if (
            o?.value !== '' &&
            (o?.relatedTo === '' || o?.relatedTo?.includes(accountArray[0]?.value))
          ) {
            const currElem = o
            if (o.value !== '' && o.name !== 'domain') {
              if (commonDataKeys.includes(o.name)) {
                switch (o.name) {
                  case 'requestJustification':
                    commonObject.requestJustification = o.value
                    break
                  case 'sAMAccountName':
                    commonObject.sAMAccountName = o.value
                    break
                  case 'accountType':
                    commonObject.accountType =
                      typeof o.value === 'object' ? o.value.displayLabel : o.displayLabel
                    commonObject.accountDescription =
                      typeof o.value === 'object'
                        ? `This request will modify ${o.value.displayLabel}`
                        : `This request will modify ${o.displayLabel}`
                    break
                  default:
                    break
                }
              } else {
                if (o.name === 'accountExpires' && ['0', ''].includes(o.value)) {
                  if (draftValue) {
                    accountDetailsObject[o.name] = o.value
                  }
                  return
                }
                switch (o.name) {
                  case 'name':
                  case 'ManagedPasswordIntervalInDays':
                    if (draftValue || checkElementModified({ id: o.id, value: o.value })) {
                      accountDetailsObject[currElem.name] = currElem?.value
                    } else if (type === 'Drafts') {
                      accountDetailsObject[currElem.name] = currElem?.value
                    }
                    break

                  case 'accountExpires':
                    if (draftValue || checkElementModified({ id: o.id, value: o.value })) {
                      accountDetailsObject[o.name] = new Date(o.value).toISOString()
                    } else if (type === 'Drafts') {
                      accountDetailsObject[o.name] = new Date(o.value).toISOString()
                    }
                    break
                  case 'dbagApplicationID':
                  case 'PrincipalsAllowedToRetrieveManagedPassword':
                  case 'dbagCostcenter':
                    if (draftValue || checkElementModified({ id: o.id, value: currElem.value })) {
                      accountDetailsObject[currElem.name] =
                        currElem && currElem?.value && currElem?.value?.value
                          ? currElem.value.value
                          : currElem.value
                    } else if (type === 'Drafts') {
                      accountDetailsObject[currElem.name] =
                        currElem && currElem?.value && currElem?.value?.value
                          ? currElem.value.value
                          : currElem.value
                    }
                    break
                  case 'servicePrincipalName': // Use DisplayValue for submiting the request
                    if (
                      draftValue ||
                      checkElementModified({ id: o.id, value: currElem.displayLabel })
                    ) {
                      accountDetailsObject[currElem.name] = currElem && [currElem?.displayLabel]
                    } else if (type === 'Drafts') {
                      accountDetailsObject[currElem.name] = currElem && [currElem?.displayLabel]
                    }
                    break
                  case 'userAccountControl':
                    // As we do not have provision to check password nerver expires in modify case, Enable account value should be 512
                    if (
                      draftValue ||
                      checkElementModified({ id: o.id, displayLabel: currElem.displayLabel })
                    ) {
                      accountDetailsObject[o.name] =
                        accountArray[0].displayLabel === 'Technical - Service/ Process' &&
                        o.value === '514'
                          ? '66050'
                          : o.value
                    } else if (type === 'Drafts') {
                      accountDetailsObject[o.name] =
                        accountArray[0].displayLabel === 'Technical - Service/ Process' &&
                        o.value === '514'
                          ? '66050'
                          : o.value
                    }
                    break
                  default:
                    break
                }
              }
            }
          }
        })
        adAccountDetails.common = commonObject
        adAccountDetails.common.accountDetails = accountDetailsObject
        setLoader(true)
        if (type === 'Drafts') {
          draftsApi
            .submitDraft(adAccountDetails, requestId)
            .then((res) => {
              if (res?.response?.status === 200 || res?.status === 200) {
                setNotification({
                  description:
                    type === 'Drafts' ? 'draft.success.message' : 'request.success.message',
                  variant: 'success'
                })
              } else {
                setNotification({
                  description: type === 'Drafts' ? 'draft.error.message' : 'request.error.message',
                  variant: 'error'
                })
              }
            })
            .catch(() => {
              setNotification({
                description: type === 'Drafts' ? 'draft.error.message' : 'request.error.message',
                variant: 'error'
              })
            })
        } else {
          accountApi
            .modifyAdAccount(adAccountDetails)
            .then((res) => {
              if (res?.response?.status === 500) {
                setNotification({ description: 'modify.error.message', variant: 'error' })
              }
              if (res.status === 200) {
                setNotification({
                  description:
                    draftValue === true ? 'draft.success.message' : 'modify.success.message',
                  variant: 'success'
                })
              }
            })
            .catch(() => {
              setNotification({ description: 'modify.error.message', variant: 'error' })
            })
        }
      } else {
        setLoader(false)
        setNotification({ description: 'modify.notUnique', variant: 'error' })
      }
    } else {
      setLoader(false)
      setNotification({ description: 'modify.error.noModification', variant: 'error' })
    }
  }

  const handleCancel = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

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

  const setApiResult = (index, result) => {
    setAccountArray((modifiedList) =>
      modifiedList.map((item, i) => {
        if (i === index) {
          const valueData = result
          const valueLabel = result && result.label ? result.label : ''
          let hiddenFlag = item.hidden
          let readOnlyFlag = item.readOnly
          let disabledFlag = item.disabled
          if (item.id === 'dbagApplicationID' && valueLabel !== '') {
            hiddenFlag = false
            readOnlyFlag = true
            disabledFlag = true
          }

          const updatedprefetchedOptions = prefetchedOptions

          updatedprefetchedOptions[0].options = [result]
          setPrefetchedOptions(updatedprefetchedOptions)
          if (item.id === 'recipient') {
            return {
              ...item,
              value: valueData,
              displayLabel: valueLabel,
              manager: result?.manager ? result?.manager : ''
            }
          }
          return {
            ...item,
            value: valueData,
            displayLabel: valueLabel,
            hidden: hiddenFlag,
            readOnly: readOnlyFlag,
            disabled: disabledFlag
          }
        }
        return item
      })
    )
  }

  const backButtonAction = () => {
    switch (type) {
      case 'MyTeam':
        return `/my-team/${myTeamSelectedUserId}`
      case 'Drafts':
        return '/drafts'
      case 'Admin':
        return 'admin'
      default:
        return '/my-asset'
    }
  }

  const breadcrumbsAction = () => {
    switch (type) {
      case 'MyTeam':
        return [
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          { label: translate('navItem.label.myTeam'), url: '/my-team' },
          { label: `${myTeamSelectedUser}`, url: `/my-team/${myTeamSelectedUserId}` },
          { label: translate('modify.ADAccount.title'), url: '' }
        ]
      case 'Drafts':
        return [
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          { label: translate('drafts.header.title'), url: '/drafts' },
          { label: translate('modify.ADAccount.title'), url: '' }
        ]
      case 'AccountAdmin':
        return [
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          { label: translate('admin.header.title'), url: '/admin' },
          { label: translate('accountAdmin.header'), url: '/admin/AccountAdmin' },
          { label: translate('modify.ADAccount.title'), url: '' }
        ]
      default:
        return [
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          { label: translate('myAssets.header'), url: '/my-asset' },
          { label: translate('modify.ADAccount.title'), url: '' }
        ]
    }
  }

  const updataTableData = (modifiedValues) => {
    const modifiedData = [...modifiedValues]
    if (modifiedValues !== undefined) {
      setAccountArray((updatedList) =>
        updatedList.map((item) => {
          if (item.id === 'gmsaTable') {
            // modifiedData[0]?.age = ''
            // modifiedData[0]?.portNo = ''
            return {
              ...item,
              error: false,
              helperText: '',
              value: modifiedData
            }
          }
          return item
        })
      )
    }
    setLoader(false)
  }

  useEffect(() => {
    let selectedSummaryDetails
    if (results && Object.keys(results).length !== 0) {
      selectedSummaryDetails =
        type === 'Drafts'
          ? results?.draftData?.filter((response) => response.id === requestId)
          : results?.assetsData?.filter((response) => response.id === requestId)
      localStorage.setItem('assetsData', JSON.stringify(selectedSummaryDetails[0]))
      const lineItemObj = [
        {
          label: 'modify.label.accountName',
          description: selectedSummaryDetails[0].sAMAccountName
        },
        { label: 'modify.label.accountCategory', description: selectedSummaryDetails[0].category }
      ]
      setLineItem(lineItemObj)
    } else {
      selectedSummaryDetails = [JSON.parse(localStorage.getItem('assetsData'))]
    }
    if (steps.length > 0 && selectedSummaryDetails.length > 0) {
      let selectedCategory = ''
      const label = selectedSummaryDetails[0].sAMAccountName.includes('_')
        ? 'CyberArkRolesharedAccount'
        : 'TechnicalGenericbrokered'
      if (
        selectedSummaryDetails[0].category === 'CyberArk Role (shared) Account' ||
        selectedSummaryDetails[0].category === 'Technical Generic Brokered'
      ) {
        selectedCategory = categoryData?.options?.filter((fitem) => fitem?.value === label)
        setAccountCategory(label)
      } else {
        selectedCategory = categoryData?.options?.filter(
          (fitem) => fitem?.label === selectedSummaryDetails[0]?.category
        )
        setAccountCategory(selectedCategory ? selectedCategory[0]?.value : '')
      }

      const stepData = []
      const blocks = []
      steps.forEach((step, index) => {
        if (!step.association || step.association.matchingValue.includes(accountCategory || '')) {
          stepData.push({ title: step.title })
          blocks.push(index)
        }
      })
      setSteppersData(stepData)
      setBlockData(blocks)

      const adAccountData = selectedSummaryDetails[0]
      Object.keys(adAccountData).forEach((key) => {
        switch (key) {
          case 'dbagApplicationID':
            if (adAccountData[key] && adAccountData[key] !== '') {
              autocompleteOptionValues.push({
                id: key,
                index: 1,
                value: Array.isArray(adAccountData[key])
                  ? adAccountData[key][0]
                  : adAccountData[key]
              })
            }

            break
          case 'dbagCostcenter':
            if (adAccountData[key] && adAccountData[key] !== '') {
              autocompleteOptionValues.push({
                id: key,
                index: 2,
                value: Array.isArray(adAccountData[key])
                  ? adAccountData[key][0]
                  : adAccountData[key]
              })
            }
            break
          case 'PrincipalsAllowedToRetrieveManagedPassword':
            if (adAccountData[key] && adAccountData[key] !== '') {
              autocompleteOptionValues.push({
                id: key,
                index: 9,
                value: adAccountData[key]
              })
            }
            break
          case 'KerberosEncryptionType1':
            if (adAccountData[key] && adAccountData[key] !== '') {
              autocompleteOptionValues.push({
                id: key,
                index: 11,
                value: adAccountData[key] === true
              })
            }
            break
          case 'KerberosEncryptionType2':
            if (adAccountData[key] && adAccountData[key] !== '') {
              autocompleteOptionValues.push({
                id: key,
                index: 12,
                value: adAccountData[key] === true
              })
            }
            break
          case 'servicePrincipalName':
            if (adAccountData[key] && adAccountData[key] !== '') {
              autocompleteOptionValues.push({
                id: key,
                index: 13,
                value: adAccountData[key] // To capture the value LONINENGRDS25 from [HTTP/LONINENGRDS25:83]  adAccountData[key]?.map((item) => item?.split(':')[0]?.split('/')[1])
              })
            }
            break
          case 'recipient':
            if (adAccountData[key] && adAccountData[key] !== '') {
              autocompleteOptionValues.push({
                id: key,
                index: 6,
                value: adAccountData[key]
              })
            }
            break
          case 'dbagInfrastructureID':
            setInfraId(
              Array.isArray(adAccountData[key]) ? adAccountData[key][0] : adAccountData[key]
            )
            break

          default:
            break
        }
      })

      setAccountArray((updatedList) =>
        updatedList.map((item) => {
          const resItem = adAccountData[item.id]
          if (adAccountData[item.id] !== '' && adAccountData[item.id]) {
            let valueData = ''
            let displayValueLabel = ''
            let helperText = ''
            let itemLabel = item.label
            if (item.id === 'KerberosEncryptionType2' && adAccountData[item.id] === true) {
              valueData = true
            }

            if (item.id === 'accountStatus') {
              if (adAccountData[item.id] === 'Enabled') {
                valueData = '512'
              } else if (adAccountData[item.id] === 'Disabled') {
                valueData = '514'
              }

              displayValueLabel = adAccountData[item.id]
              helperText = item.helperText
            } else if (item.id === 'expiry') {
              const date = `${new Date(adAccountData[item.id]).toUTCString().split(',')[1]}`

              valueData = adAccountData[item.id].slice(0, 16)
              displayValueLabel =
                adAccountData[item.id] !== '' && date.indexOf('GMT') > -1
                  ? date.replace('GMT', '')
                  : 'Never'
              helperText = `UTC value : ${convertDateTimeToUTC(adAccountData[item.id])}`
              itemLabel = 'modify.ADAccount.expiryinUTC'
            } else {
              valueData = adAccountData[item.id]
              displayValueLabel = adAccountData[item.id]
              if (resItem.id === 'accountCategory') {
                setAccountCategory(valueData)
              }
              helperText = item.helperText
            }
            return {
              ...item,
              value: valueData,
              displayLabel: displayValueLabel,
              helperText,
              label: itemLabel
            }
          }
          if (item.id === 'expiry' && adAccountData[item.id] === '') {
            return {
              ...item,
              displayLabel: 'Never',
              label: 'modify.ADAccount.expiryinUTC'
            }
          }

          if (item.id === 'accountCategory') {
            if (selectedCategory) {
              return {
                ...item,
                value: selectedCategory[0]?.value,
                displayLabel: selectedSummaryDetails[0].category
              }
            }
          }
          if (item.id === 'businessJustification') {
            return {
              ...item,
              value: adAccountData?.detailedInfo,
              displayLabel: adAccountData?.detailedInfo
            }
          }
          return item
        })
      )
      if (autocompleteOptionValues.length > 0) {
        const result = autocompleteOptionValues.reduce((unique, o) => {
          if (!unique.some((obj) => obj.id === o.id && obj.value === o.value)) {
            unique.push(o)
          }
          return unique
        }, [])
        setDraftAutocompleteValues(result)
      }
    }
  }, [categoryData, steps, results])

  const setItaoAndItaoDelegate = (applicationId) => {
    accountApi
      .getITAOandITAODelegate(applicationId)
      .then((res) => {
        setAccountArray((updatedList) =>
          updatedList.map((obj) => {
            if (['iTAODelegate', 'iTAO'].includes(obj?.id)) {
              return {
                ...obj,
                value:
                  obj?.id === 'iTAO'
                    ? ternaryCheck(res?.itao, res?.itao, '')
                    : ternaryCheck(res?.itaoDelegate, res?.itaoDelegate, ''),
                displayLabel:
                  obj?.id === 'iTAO'
                    ? ternaryCheck(res?.itao, res?.itao, '')
                    : ternaryCheck(res?.itaoDelegate, res?.itaoDelegate, '')
              }
            }
            return obj
          })
        )
      })
      .catch((err) => {
        console.error('err', err)
      })
  }

  useEffect(() => {
    if (draftAutocompleteValues.length > 0) {
      const apiDataFetcher = async (index, apiUrl) => {
        const response = await axios({
          url: apiUrl,
          method: 'get'
        })
        if (response && response.data && response.data.length > 0) {
          setApiResult(index, response.data[0])
        }
      }

      const apiDataFetcherWithPayload = async (keyToPoint, index, apiUrl, payload) => {
        const options = []
        if (Array.isArray(payload?.searchValue)) {
          // eslint-disable-next-line no-restricted-syntax
          for (const eachValue of payload?.searchValue) {
            // eslint-disable-next-line no-await-in-loop
            const response = await accountApi.getOptions(apiUrl, {
              serverCN: eachValue?.split(':')[0]?.split('/')[1], // To capture the value Server Name : LONINENGRDS25 From 'HTTP/LONINENGRDS25:83',
              pageSize: 100,
              pageNumber: 0
            })
            if (response.hits.hits.length > 0 && keyToPoint === 'servicePrincipalName') {
              /* eslint no-underscore-dangle: 0 */
              options.push({
                label: `${response?.hits?.hits[0]?._source?.igaContent?.cn}`,
                value: `${response?.hits?.hits[0]?._source?.igaContent?.cn}`,
                serviclass: eachValue?.split(':')[0]?.split('/')[0], // // To capture the serviceClass : HTTP From 'HTTP/LONINENGRDS25:83'
                portNo: eachValue?.split(':')[1] // To capture the Port No  : 83 From 'HTTP/LONINENGRDS25:83'
              })
            }
          }

          updataTableData(options)
          setApiResult(index, options)
        } else {
          const response = await accountApi.getOptions(apiUrl, payload)

          if (
            response.hits.hits.length > 0 &&
            keyToPoint === 'PrincipalsAllowedToRetrieveManagedPassword'
          ) {
            response.hits.hits.forEach((element) => {
              /* eslint no-underscore-dangle: 0 */
              options.push({
                label: `${element?._source?.igaContent?.cn}`,
                value: `${element?._source?.igaContent?.cn}`
              })
            })
            setApiResult(index, options[0])
          }
        }
      }

      draftAutocompleteValues.forEach((item) => {
        const payload = {
          searchValue: item?.value,
          pageSize: 100,
          pageNumber: 0
        }
        switch (item.id) {
          case 'dbagApplicationID':
            apiDataFetcher(
              item.index,
              `/v0/application/getApplicationNarId?exactMatch=${true}&narId=${item.value}`
            )
            if (valueFinder('accountCategory') === 'gMSA') {
              setItaoAndItaoDelegate(item?.value)
            }
            break
          case 'recipient':
            apiDataFetcher(
              item.index,
              `/v0/governance/getEmailAddress?exactMatch=${true}&emailId=${item.value}`
            )
            break
          case 'dbagCostcenter':
            apiDataFetcher(
              item.index,
              `/v0/governance/getCostCenter?exactMatch=${true}&costCenter=${item.value}`
            )
            break
          case 'PrincipalsAllowedToRetrieveManagedPassword':
            apiDataFetcherWithPayload(
              'PrincipalsAllowedToRetrieveManagedPassword',
              item.index,
              `/v0/governance/searchGroups`,
              payload
            )
            break
          case 'servicePrincipalName':
            apiDataFetcherWithPayload(
              'servicePrincipalName',
              item.index,
              `/v0/server/getServer`,
              payload
            )
            break
          default:
            break
        }
      })
    }
  }, [draftAutocompleteValues])

  useEffect(() => {
    if (notification.description && ['success', 'error'].includes(notification.variant)) {
      setTimeout(() => {
        // Set empty notification after timeout
        if (notification.variant === 'success') {
          setLoader(false)
          if (!savedToDraft) {
            history.push('/history/requestHistory')
          } else {
            history.push('/drafts')
          }
          const newCompleted = completed
          newCompleted[activeStep] = true
          setCompleted(newCompleted)
          handleReset()
        } else {
          setLoader(false)
        }
        setNotification({ description: '', variant: '' })
      }, 5000)
    }
  }, [notification.variant])

  useEffect(() => {
    dispatch(updateShowBigLoader(true))
    accountApi.getModifyADAccount().then((res) => {
      constructAdResponse(res.steps)
      setCategoryToLabel(res.labelToCategory)
      setSteps(res.steps)
      // Populate the stepper in separate state variable so that we can dynamically change it
      const stepData = []
      res.steps.forEach((step) => {
        if (!step.association) {
          stepData.push({ title: step.title })
        }
      })
      setSteppersData(stepData)
      // Set initial value of active substep so that it would be available to the next press handler
      if (res.steps[0].substeps) {
        setActiveSubStep(0)
        setTotalSubSteps(res.steps[0].substeps.length)
      }
    })
    accountApi.getAccountCategories().then((res) => {
      setcategoryData({ id: 'accountCategory', options: res })
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

    return () => {
      localStorage.removeItem('assetsData')
    }
  }, [])

  const handleDisplayValue = () => {}
  // TODO : Update table when ADD Button is clicked
  const handleCallback = (modifyedElement, selectValueObjArr) => {
    console.log(modifyedElement, selectValueObjArr)
    updataTableData(selectValueObjArr, modifyedElement)
  }
  // Remove Selected Items from GMSA Table
  const removeItems = (id, row) => {
    console.log(id, row)
    const ItemToRemove = accountArray.filter((account) => account?.id === 'servicePrincipalName')
    const filteredRow =
      ItemToRemove[0]?.value?.length &&
      ItemToRemove[0]?.value?.filter((item) => item?.label !== row)

    updataTableData(filteredRow)
    setAccountArray((updatedList) =>
      updatedList.map((item) => {
        if (item?.id === 'servicePrincipalName') {
          return {
            ...item,
            value: filteredRow.length ? filteredRow : [],
            error: false
          }
        }
        return item
      })
    )
    // alert(id, row)
  }
  return (
    <>
      {loader && <Loading index={299} />}
      <Styled.BackButtonLink to={backButtonAction()}>
        <Styled.BackButton>← {translate('create.ADAccount.back')}</Styled.BackButton>
      </Styled.BackButtonLink>
      <Breadcrumb path={breadcrumbsAction()} />
      {notification.description && (
        <div
          id="main"
          style={{ position: 'relative', top: 0, right: 0, zIndex: 300, minWidth: '8%' }}
        >
          <div
            id="a1"
            style={{
              position: 'absolute',
              right: 0,
              top: '70px'
            }}
          >
            <Styled.NotificationWrapper type={notification.variant}>
              <Notification
                description={translate(notification.description)}
                variant={notification.variant}
                sx={{ zIndex: 503 }}
              />
            </Styled.NotificationWrapper>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Styled.HeaderWrapper>
          <h1 style={{ fontWeight: 'normal', marginBottom: '10px' }}>
            {translate('modify.ADAccount.title')}
          </h1>
        </Styled.HeaderWrapper>
        <Box sx={{ width: '30%', paddingTop: '15px' }}>
          <Stepper nonLinear activeStep={activeStep}>
            {stepperData.map((label, index) => (
              <Step
                sx={{
                  '& .MuiStepIcon-root': {
                    color: theme === 'dark' ? '#B7B7B7' : '#8E8E8E'
                  },
                  '& .MuiStepIcon-root.Mui-active': {
                    color: '#00A7F7'
                  },
                  '& .MuiStepIcon-root.Mui-completed': {
                    color: '#00A7F7'
                  }
                }}
                key={index}
                completed={completed[index]}
              >
                <StepButton color="inherit" sx={{ cursor: 'default' }}>
                  {translate(`${label.title}`)}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Box>
      </div>
      <Styled.MainWrapper>
        {steps.map((item, index) =>
          index !== steps.length - 1 ? (
            <Box
              key={`${item.id}_container`}
              sx={{ display: displayStepperBlock(index) ? 'block' : 'none' }}
              p={5}
            >
              <h2>{translate(`${item.heading}`)}</h2>
              <Grid container spacing={8}>
                {item.children && (
                  <Grid item xs={8}>
                    <Grid container spacing={{ xs: 2 }}>
                      {item.children &&
                        item.children.map((element) =>
                          formGenerator(
                            element,
                            handlefieldChanges,
                            displayFields,
                            handleDisplayValue,
                            helperFinder,
                            categoryData,
                            valueFinder,
                            errorFinder,
                            optionFinder,
                            optionReset,
                            disabledFlagFinder,
                            readOnlyFlagFinder,
                            hiddenFlagFinder,
                            columnSX,
                            '',
                            removeItems,
                            '',
                            '',
                            '',
                            handleCallback,
                            '',
                            '',
                            servicePrincipalValue
                          )
                        )}
                    </Grid>
                  </Grid>
                )}
                {/* If sub stepper exist the above map will not generate any output. The sub stepper will get generated by the below code */}
                {item.substeps && (
                  <Grid item xs={8}>
                    {activeSubStep + 1} of {totalSubSteps} steps
                    {item.substeps &&
                      item.substeps.map((substep, subindex) => (
                        <Grid
                          item
                          key={`${subindex}_grid`}
                          xs={12}
                          sx={{
                            display: displaySubStepperBlock(subindex, index) ? 'block' : 'none'
                          }}
                        >
                          <Grid container spacing={{ xs: 2 }}>
                            {substep.children &&
                              substep.children.map((element) =>
                                formGenerator(
                                  element,
                                  handlefieldChanges,
                                  displayFields,
                                  null,
                                  helperFinder,
                                  categoryData,
                                  valueFinder,
                                  errorFinder,
                                  optionFinder,
                                  optionReset,
                                  disabledFlagFinder,
                                  readOnlyFlagFinder,
                                  hiddenFlagFinder,
                                  columnSX,
                                  '',
                                  '',
                                  '',
                                  '',
                                  '',
                                  handleCallback,
                                  servicePrincipalValue
                                )
                              )}
                          </Grid>
                        </Grid>
                      ))}
                  </Grid>
                )}
                {index <= 1 && (
                  <Grid item xs={4}>
                    {lineItem.length > 0 &&
                      lineItem.map((info) => (
                        <React.Fragment key={info.label}>
                          <strong>{translate(info.label)}</strong>
                          <p>{info.description}</p>
                          <br />
                        </React.Fragment>
                      ))}
                  </Grid>
                )}
              </Grid>
            </Box>
          ) : (
            <Box
              key={`${item.id}_container`}
              sx={{ display: displayStepperBlock(index) ? 'block' : 'none' }}
              p={5}
            >
              <h2>{item.heading}</h2>

              {summaryData &&
                summaryData.map((sitem, i) => (
                  <Accordion key={categoryToLabel[sitem.heading]} disableGutters defaultExpanded>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="`{sitem.heading}_summary`}"
                      sx={{
                        backgroundColor: theme === 'dark' ? '#3C485A' : '#EFF9FC'
                      }}
                    >
                      <Typography sx={{ fontSize: '16px' }}>
                        {categoryToLabel[sitem.heading]}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        backgroundColor: theme === 'dark' ? '#1A2129' : '#FFF',
                        padding: '10x 8px'
                      }}
                    >
                      {[0, 1].includes(i) ? (
                        <Grid container spacing={4}>
                          {sitem.children &&
                            sitem.children.map((element) => (
                              <Grid
                                key={element.id}
                                item
                                sm={12}
                                md={6}
                                lg={4}
                                sx={{ display: 'flex' }}
                              >
                                <Grid item xs={4} md={5} pl={5}>
                                  <p>
                                    <strong>{translate(element.label)} : </strong>
                                  </p>
                                </Grid>
                                <Grid item xs={4} md={8}>
                                  {checkElementModified(element) ? (
                                    <p style={{ wordBreak: 'break-word' }}>
                                      <strong>
                                        {element.displayLabel
                                          ? element.displayLabel
                                          : displaySummaryValue(
                                              typeof element.value === 'object',
                                              element.value.value,
                                              element.value
                                            )}
                                      </strong>
                                    </p>
                                  ) : (
                                    <p>
                                      {element.displayLabel
                                        ? element.displayLabel
                                        : displaySummaryValue(
                                            typeof element.value === 'object',
                                            element.value.value,
                                            element.value
                                          )}
                                    </p>
                                  )}
                                </Grid>
                              </Grid>
                            ))}
                          <Grid item xs={12} sx={{ paddingTop: '10px !important' }}>
                            <Button
                              variant="outlined"
                              sx={{
                                float: 'right',
                                color: `${theme === 'dark' ? '#FFF' : '#000'}`,
                                borderColor: `${theme === 'dark' ? '#FFF' : '#000'}`,
                                borderRadius: 0,
                                mr: 1
                              }}
                              onClick={() => {
                                editHandler(sitem.title)
                              }}
                            >
                              {translate('create.ADAccount.edit')}
                            </Button>
                          </Grid>
                        </Grid>
                      ) : (
                        <Grid container spacing={3}>
                          {sitem.children &&
                            sitem.children.map((element) => (
                              <Grid
                                item
                                xs={12}
                                sx={{ display: 'flex' }}
                                key={`${element.label}_container`}
                              >
                                <Grid item xs={4} md={5} pl={5}>
                                  <p>
                                    <strong>{translate(element.label)} : </strong>
                                  </p>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <p>
                                    {element?.displayLabel
                                      ? element.displayLabel
                                      : displaySummaryValue(
                                          typeof element?.value === 'object',
                                          element?.value?.value,
                                          element?.value
                                        )}
                                  </p>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <p>{element.labelValue}</p>
                                </Grid>
                              </Grid>
                            ))}
                          {approverValidate.length > 0 && (
                            <Grid
                              xs={12}
                              sx={{ display: 'flex' }}
                              key={`${sitem.heading.label}_container`}
                            >
                              <div
                                style={{
                                  textAlign: 'center',
                                  padding: '10px',
                                  backgroundColor: '#FFF',
                                  fontSize: '16px',
                                  width: '100%'
                                }}
                              >
                                <p>{`Cannot process no active ${approverValidate.join(
                                  ','
                                )} approver`}</p>
                              </div>
                            </Grid>
                          )}
                          {sitem.children.length === 0 && (
                            <Grid
                              xs={12}
                              sx={{ display: 'flex' }}
                              key={`${sitem.heading.label}_container`}
                            >
                              <div
                                style={{
                                  textAlign: 'center',
                                  padding: '10px',
                                  backgroundColor: '#FFF',
                                  fontSize: '16px',
                                  width: '100%'
                                }}
                              >
                                {translate('create.ADAccount.noapprovers')}
                              </div>
                            </Grid>
                          )}
                          {i !== 2 ? (
                            <Grid item xs={12} sx={{ paddingTop: '10px !important' }}>
                              <Button
                                variant="outlined"
                                sx={{
                                  float: 'right',
                                  color: `${theme === 'dark' ? '#FFF' : '#000'}`,
                                  borderColor: `${theme === 'dark' ? '#FFF' : '#000'}`,
                                  borderRadius: 0,
                                  mr: 1
                                }}
                                onClick={() => {
                                  editHandler(sitem.title)
                                }}
                              >
                                {translate('create.ADAccount.edit')}
                              </Button>
                            </Grid>
                          ) : null}
                        </Grid>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
            </Box>
          )
        )}
      </Styled.MainWrapper>
      <div>
        {allStepsCompleted() ? (
          <>
            <Typography sx={{ mt: 2, mb: 1 }}>All steps completed</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>{translate('create.ADAccount.reset')}</Button>
            </Box>
          </>
        ) : (
          <>
            {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography> */}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              {!isLastStep() && (
                <Button
                  color="inherit"
                  disabled={
                    !activeSubStep ? activeStep === 0 : activeStep === 0 && activeSubStep === 0
                  }
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  {translate('create.ADAccount.back')}
                </Button>
              )}
              <Box sx={{ flex: '1 1 auto' }} />
              <Button
                sx={{ color: `${theme === 'dark' ? '#F2F3F4' : '#333'}` }}
                onClick={handleCancel}
              >
                {translate('create.ADAccount.cancel')}
              </Button>
              {!isLastStep() ? (
                <Button
                  variant="outlined"
                  sx={{
                    color: `${theme === 'dark' ? '#F2F3F4' : '#333'}`,
                    borderColor: `${theme === 'dark' ? '#F2F3F4' : '#333'}`,
                    borderRadius: 0,
                    mr: 1,
                    ':hover': {
                      bgcolor: `${theme === 'dark' ? '#00A7F7' : '#F5F5F7'}`
                    }
                  }}
                  onClick={handleNext}
                  disabled={nextButton}
                >
                  {translate('create.ADAccount.next')}
                </Button>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    sx={{
                      color: `${theme === 'dark' ? '#FFF' : '#000'}`,
                      borderColor: `${theme === 'dark' ? '#FFF' : '#000'}`,
                      borderRadius: 0,
                      mr: 1
                    }}
                    onClick={() => handleComplete(true)}
                    disabled={summaryData[2]?.children?.length === 0 || approverValidate.length > 0}
                  >
                    {translate('create.ADAccount.saveforLater')}
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      color: `${theme === 'dark' ? '#FFF' : '#000'}`,
                      borderColor: `${theme === 'dark' ? '#FFF' : '#000'}`,
                      borderRadius: 0,
                      mr: 1
                    }}
                    onClick={() => handleComplete(false)}
                    disabled={summaryData[2]?.children?.length === 0 || approverValidate.length > 0}
                  >
                    {translate('create.ADAccount.submitRequest')}
                  </Button>
                </>
              )}
            </Box>
          </>
        )}
      </div>
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
          <DialogTitle id="alert-dialog-title">Confirm cancellation</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to cancel? The data filled would be discarded.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirm}>{translate('create.ADAccount.confirm')}</Button>
            <Button onClick={handleClose} autoFocus>
              {translate('create.ADAccount.cancel')}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}

export default Modify
