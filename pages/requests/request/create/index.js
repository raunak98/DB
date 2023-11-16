import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation, Prompt } from 'react-router-dom'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Button from '@mui/material/Button'
import { Typography, Grid, Tooltip } from '@mui/material'
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
// import AddedNotification from 'components/notification'
import formGenerator from 'components/formGenerator'
import translate from 'translations/translate'
import { Notification } from 'components/notification'
import Loading from '../../../../components/loading'
import axios from '../../../../axios'

import {
  setSummaryInitialState,
  setadAccountInitialState
} from '../../../../redux/requests/activeDirectory/activeDirectorySlice'
import * as profileAPI from '../../../../api/profile'

import * as Styled from './style'
import * as accountApi from '../../../../api/accountManagement'
import useTheme from '../../../../hooks/useTheme'
import * as draftsApi from '../../../../api/drafts'
import { selectNotificationMessage } from '../../../../redux/review/review.selector'
import { selectAccountTypeItems } from '../../../../redux/dashboard/dashboard.selector'
import { updateReviewNotificationMessage } from '../../../../redux/review/review.action'
import { applicationNamePrefix, ternaryCheck } from '../../../../helpers/utils'

const create = () => {
  const [steps, setSteps] = useState([])
  const [stepperData, setSteppersData] = useState([])
  const [blockData, setBlockData] = useState([])
  const [metadata, setMetadata] = useState([])
  const [activeStep, setActiveStep] = React.useState(0)
  const [activeBlock, setActiveBlock] = React.useState(0)
  const [activeSubStep, setActiveSubStep] = React.useState(false)
  const [totalSubSteps, setTotalSubSteps] = React.useState(0)
  const [completed, setCompleted] = React.useState({})
  const [summaryData, setSummaryData] = useState([])
  const [accountCategory, setAccountCategory] = React.useState('')
  const [accountArray, setAccountArray] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [categoryData, setcategoryData] = useState([])
  const [categoryToLabel, setCategoryToLabel] = useState({})
  const [accCategoryData, setAccCategoryData] = useState({})
  const [samAccountDataStructure, setSamAccountDataStructure] = useState({})
  const [samAccountObjectTemplateIndex, setsamAccountObjectTemplateIndex] = useState(0)
  const [samAccountObject, setSamAccountObject] = useState({})
  const [prefetchedOptions, setPrefetchedOptions] = useState([])
  const [userProfile, setUserProfile] = useState({})
  const [response, setResponse] = useState([])
  const [recipientData, setReceipientData] = useState({})
  const [notification, setNotification] = useState({ description: '', variant: '' })
  const [loader, setLoader] = useState(false)
  const [receipientDetails, setReceipientDetails] = useState({})
  const { theme } = useTheme()
  const history = useHistory()
  const adAccountInfo = useSelector((state) => state.adAccountInfo)
  const dispatch = useDispatch()
  const location = useLocation()
  const [isDraft, setIsDraft] = React.useState(!!location?.pathname?.includes('drafts'))
  const [draftAutocompleteValues, setDraftAutocompleteValues] = useState([])
  const [isFormIncomplete, setIsFormIncomplete] = useState(false)
  const [saveDraft, setSaveDraft] = useState('')
  const [isAccountTypeError, setIsAccountTypeError] = useState(false)
  const noManagerAvailable = translate('create.noManager')
  const notAvailable = translate('create.notAvailable')
  const getNotificationMessage = useSelector(selectNotificationMessage)
  const accountTypeItems = useSelector(selectAccountTypeItems)
  let expressionIndex = 0
  const columnSX = 6
  const isAccountCreated = useRef(false)
  let title = ''
  if (summaryData[2]?.children?.length === 0) {
    title = translate('create.ADAccount.noapprovers')
  }
  const noITAOInfo = translate('create.noITAOInfo')
  const noITAODelegateInfo = translate('create.noITAODelegateInfo')
  const noTISOInfo = translate('create.noTISOInfo')
  const noTISODelegateInfo = translate('create.noTISODelegateInfo')
  const noDISOInfo = translate('create.noDISOInfo')
  const draftId = location && location?.pathname ? location?.pathname.split('/').pop() : ''
  let isValidSamAccount = true
  const [isValidAccount, setIsValidAccount] = useState(false)
  const [approverValidate, setApproverValidate] = useState([])

  const resetAllStates = () => {
    setSteps([])
    setSteppersData([])
    setBlockData([])
    setMetadata([])
    setActiveStep(0)
    setActiveBlock(0)
    setActiveSubStep(false)
    setTotalSubSteps(0)
    setCompleted({})
    setSummaryData([])
    setAccountCategory('')
    setAccountArray([])
    setOpen(false)
    setcategoryData([])
    setCategoryToLabel({})
    setAccCategoryData({})
    setSamAccountDataStructure({})
    setSamAccountObject({})
    isValidSamAccount = true
  }

  const valueFinder = (fieldId) => {
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

  const validateSamAccount = async () => {
    let payload = {}

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

    if (accountCategory === 'CyberArkRolesharedAccount') {
      const value = `${valueFinder('samAccount')}`.replace(
        'expression',
        expressionValues[expressionIndex]
      )
      payload = {
        targetName: 'sAMAccountName',
        targetValue: `${value}`,
        pageSize: 10,
        pageNumber: 0
      }
      await accountApi
        .validateSAMAccount('/v0/account/accountDetails', payload)
        .then((res) => {
          if (res?.hits?.hits?.length > 0 && expressionIndex < expressionValues.length) {
            expressionIndex += 1
            isValidSamAccount = false
            validateSamAccount()
          }
          isValidSamAccount = true
          const replacedString = [...samAccountObject?.text].map((data) =>
            data === 'expression' ? expressionValues[expressionIndex] : data
          )

          setSamAccountObject((prevState) => ({
            ...prevState,
            text: replacedString
          }))
        })
        .catch((error) => {
          console.error(error)
        })
      return value
    }
    payload = {
      targetName: 'sAMAccountName',
      targetValue: `${valueFinder('samAccount')}`,
      pageSize: 10,
      pageNumber: 0
    }

    await accountApi
      .validateSAMAccount('/v0/account/accountDetails', payload)
      .then((res) => {
        isValidSamAccount = !(res?.hits?.total?.value > 0)
      })
      .catch((error) => {
        console.error(error)
      })
    return valueFinder('samAccount')
  }

  const generateSamAccount = (category, data) => {
    let textString = ''
    let keyTitle = ''
    let samAccountdata = ''
    if (category) {
      const samAccountStructure =
        samAccountDataStructure[
          data?.dataStructureIndex !== undefined
            ? data?.dataStructureIndex
            : samAccountObjectTemplateIndex
        ]
      samAccountdata =
        data?.dataStructureIndex !== undefined ? samAccountStructure : samAccountObject
      if (isDraft && Object.keys(samAccountObject).length === 0) {
        samAccountdata = samAccountStructure
      }
      const samAccountObjectTemplate = samAccountStructure
      if (samAccountObjectTemplate.text.includes(data.id)) {
        switch (data.id) {
          case 'primaryAccount':
            textString = data.value
            keyTitle = 'text'
            break
          case 'accountNameMiddle':
            textString = data.value ? data.value : valueFinder('accountNameMiddle')
            keyTitle = 'text'
            break
          case 'region':
            textString = data.value ? data.value : valueFinder('region')
            keyTitle = 'text'
            break
          case 'accountAccessLevel':
            textString = data.value ? data.value : valueFinder('accountAccessLevel')
            keyTitle = 'text'
            break
          case 'serviceNowLevel':
            textString = data.value ? data.value : valueFinder('serviceNowLevel')
            keyTitle = 'text'
            break
          case 'dbagApplicationID':
            textString = data.value ? data.value : valueFinder('dbagApplicationID')
            keyTitle = 'text'
            break
          case 'platformType':
            textString = data.value ? data.value : valueFinder('platformType')
            keyTitle = 'text'
            break
          case 'expression':
            textString = 'expression'
            keyTitle = 'text'
            break
          case 'name':
            textString = data.value ? data.value : valueFinder('name')
            keyTitle = 'text'
            break
          default:
            break
        }
      } else if (data.id === samAccountObjectTemplate.suffix) {
        textString = data.value ? `-${data.value}` : valueFinder('accountNameSuffix')
        keyTitle = 'suffix'
      }

      if (keyTitle === 'text') {
        let replacedString
        if (['name', 'accountNameMiddle'].includes(data.id)) {
          replacedString = samAccountObjectTemplate.text.map((value) =>
            value === data.id ? textString : value
          )
        } else {
          const index = samAccountObjectTemplate.text.findIndex((value) => value === data.id)
          replacedString = samAccountdata.text.map((value, ix) =>
            ix === index ? textString : value
          )
        }

        setSamAccountObject(() => ({
          ...samAccountdata,
          text: replacedString
        }))
      } else if (keyTitle === 'suffix') {
        setSamAccountObject(() => ({
          ...samAccountdata,
          suffix: textString
        }))
      }
    }
  }

  const prepareSamAccountString = (data) => {
    if (samAccountDataStructure.length > 0) {
      const category = data?.category ? data?.category : accountCategory
      generateSamAccount(category, data)
    }
  }

  const handleDisplayValue = (displayData) => {
    if (displayData.id === 'primaryAccount') {
      setIsValidAccount(displayData.isValidAccount)
      const recpDetails = {
        firstName: displayData.firstName,
        lastName: displayData.lastName
      }
      setReceipientDetails(recpDetails)
      prepareSamAccountString(displayData)
    }
    setAccountArray((updatedList) =>
      updatedList.map((item) => {
        if (displayData.id === item.id && item.id === 'primaryAccount') {
          return {
            ...item,
            value: displayData.value,
            displayLabel: displayData.displayLabel
          }
        }
        if (displayData.id === item.id && item.id === 'department') {
          // Set department option with default value
          const valueData = {
            label: displayData.displayLabel,
            value: displayData.value
          }
          return {
            ...item,
            value: valueData,
            options: [valueData],
            displayLabel: displayData.displayLabel,
            error: false,
            helperText: ''
          }
        }
        return item
      })
    )

    const updatedStep = steps.map((step, index) => {
      let data = step
      if (index === 0) {
        const children = step.children.map((item) => {
          if (displayData.id === item.id && item.id === 'department') {
            return {
              ...item,
              error: false,
              helperText: ''
            }
          }
          return item
        })
        data = { ...step, children }
      }
      return data
    })
    setSteps(updatedStep)
  }

  const checkRecipentData = () => Object.keys(recipientData).length > 0

  const setUpdatedProfileDetails = () => {
    setAccountArray((updatedList) =>
      updatedList.map((item) => {
        if (item.id === 'primaryAccount') {
          return {
            ...item,
            value: userProfile?.accountName,
            displayLabel: userProfile?.accountName,
            error: false,
            helperText: ''
          }
        }
        if (item.id === 'recipient') {
          const valueData = checkRecipentData()
            ? recipientData
            : {
                label: `${
                  typeof userProfile.firstName === 'undefined' ? '' : userProfile.firstName
                },${typeof userProfile.lastName === 'undefined' ? '' : userProfile.lastName}(${
                  typeof userProfile.email === 'undefined' ? '' : userProfile.email
                })`,
                value: userProfile.email === 'undefined' ? '' : userProfile.email
              }
          return {
            ...item,
            value: valueData,
            displayLabel: valueData.label,
            error: false,
            manager: checkRecipentData() ? recipientData.manager : noManagerAvailable,
            helperText:
              checkRecipentData() && recipientData.manager
                ? `Manager: ${recipientData.manager}`
                : `Manager: ${notAvailable}`
          }
        }
        return item
      })
    )
  }
  const configureLocation = (categoryValue) => {
    let defaultOptions = [{ value: '', label: '' }]
    if (!isDraft && accountArray[0].value === categoryValue) {
      return false
    }
    const updatedStepZero = response[0]?.children.map((item) => {
      if (item.id === 'location') {
        const options = item.options.filter((option) => option.belongsto.includes(categoryValue))
        if (options.length === 1) {
          defaultOptions = options
        }
        if (categoryValue === 'TechnicalServiceProcess') {
          const optionsData = item.options.filter(
            (option) => option.value === 'Default Location (Global)'
          )
          defaultOptions = optionsData
        }
        const newItem = { ...item, options }
        return newItem
      }

      return { ...item, error: false, helperText: '' }
    })

    setSteps((prevState) =>
      prevState.map((item, index) => (index === 0 ? { ...item, children: updatedStepZero } : item))
    )
    return defaultOptions
  }

  const handlefieldChanges = (
    event,
    value,
    category,
    id,
    valueLabel,
    helperTextValue,
    type,
    valueObj,
    errorState
  ) => {
    const elementModified = event.target.id
      ? ternaryCheck(
          event?.target?.id !== 'ManagedPasswordIntervalInDays',
          event?.target?.id?.split('-')[0],
          event?.target?.id
        )
      : id
    let newValue = value
    if (elementModified === 'accountCategory') {
      const defaultOption = configureLocation(newValue)
      if (accountArray[0].value === newValue) {
        return
      }
      setAccountCategory(newValue || '')
      // Filter the metadata from all the values
      const selectAccCat = accCategoryData.filter(
        (individualCat) => individualCat.value === newValue
      )[0]
      setMetadata(selectAccCat && selectAccCat.metaData ? selectAccCat.metaData : [])
      // Logic to reset value in case of change of Account Category. Create a fresh clone of the source object and set appropriate category in value and then update the state
      const ObjectTemplateIndex = samAccountDataStructure.findIndex(
        (field) => field.category === newValue
      )
      setsamAccountObjectTemplateIndex(ObjectTemplateIndex)
      setSamAccountObject(samAccountDataStructure[ObjectTemplateIndex])
      const categoryDisplayValue = [...adAccountInfo.adAccount].map((item, index) => {
        if (index === 0) {
          return {
            ...item,
            value: newValue,
            displayLabel: selectAccCat.label,
            error: false,
            helperText: ''
          }
        }
        if (item.id === 'region') {
          prepareSamAccountString({
            id: 'region',
            value: item.value,
            category: newValue,
            dataStructureIndex: ObjectTemplateIndex
          })
          return item
        }
        if (item.id === 'location') {
          return {
            ...item,
            value: defaultOption[0]?.value,
            displayLabel: defaultOption[0]?.label
          }
        }
        if (item.id === 'dbagInfrastructureID') {
          const infraData = response[0].children.filter((itm) => itm.id === item.id)
          return {
            ...item,
            value: infraData[0]?.options[0]?.value,
            displayLabel: infraData[0]?.options[0]?.label
          }
        }

        if (item.id === 'passwordNeverExpires') {
          return {
            ...item,
            value: false,
            displayLabel: 'No'
          }
        }

        return { ...item, error: false, helperText: '' }
      })
      setAccountArray(categoryDisplayValue)

      setUpdatedProfileDetails()
      const stepData = []
      const blocks = []
      steps.forEach((step, index) => {
        if (
          !step.association ||
          step.association.matchingValue.includes(value && value.value ? value.value : '')
        ) {
          stepData.push({ title: step.title, id: step.titleId })
          blocks.push(index)
        }
      })
      setSteppersData(stepData)
      setBlockData(blocks)

      if (userProfile?.accountName) {
        prepareSamAccountString({
          id: 'primaryAccount',
          value: userProfile?.accountName,
          category: newValue,
          dataStructureIndex: ObjectTemplateIndex
        })
      }
      setIsFormIncomplete(true)
    } else {
      if (
        elementModified === 'dbagApplicationID' &&
        valueFinder('accountCategory') === 'gMSA' &&
        typeof valueObj === 'object'
      ) {
        accountApi
          .getITAOandITAODelegate(value)
          .then((res) => {
            setAccountArray((updatedList) =>
              updatedList.map((item) => {
                if (['iTAODelegate', 'iTAO'].includes(item?.id)) {
                  return {
                    ...item,
                    value: item?.id === 'iTAO' ? res?.itao : res?.itaoDelegate,
                    displayLabel: item?.id === 'iTAO' ? res?.itao : res?.itaoDelegate
                  }
                }
                return item
              })
            )
          })
          .catch((err) => {
            console.error('err', err)
          })
      }
      if (elementModified === 'accountNameMiddle') {
        newValue = newValue.trim()
      }

      if (
        [
          'accountNameSuffix',
          'accountNameMiddle',
          'region',
          'accountAccessLevel',
          'serviceNowLevel',
          'dbagApplicationID',
          'platformType',
          'name'
        ].includes(elementModified)
      ) {
        prepareSamAccountString({ id: elementModified, value: newValue, helperText: '' })
      }
      if (type === 'autocomplete' && valueLabel === '') {
        setAccountArray((updatedList) =>
          updatedList.map((item) => {
            if (item.id === elementModified) {
              return {
                ...item,
                value: '',
                displayLabel: '',
                error: false,
                helperText: ''
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
            if (item.id === 'recipient') {
              return {
                ...item,
                value: newValue,
                displayLabel: valueLabel,
                error: false,
                helperText: helperTextValue,
                manager: helperTextValue
                  ? helperTextValue?.split(':')[1]?.trim()
                  : noManagerAvailable
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
    const result = fields.map((field) => ({
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
      let providedDefaultLabel = ''
      let providedDefaultValue = child.default && child.default !== '' ? child.default : ''
      adAccountSummaryObj.push(child.category)
      // Setting Default Values For Kerberos Encryption type
      if (child.id === 'KerberosEncryptionType') {
        const checkedOption = {
          labels: [],
          values: []
        }
        const checkedValues = child?.options?.map((option) => {
          if (option.checked === true) {
            checkedOption.values.push(option.value)
            checkedOption.labels.push(option.label)
          }
          return checkedOption
        })

        providedDefaultValue =
          checkedValues[0]?.values?.toString() === '8,16'
            ? '24'
            : checkedValues[0]?.values?.toString()
        providedDefaultLabel = checkedValues[0]?.labels?.toString()
      }

      adAccountObj.push({
        id: child.id,
        label: child.label,
        value: providedDefaultValue,
        helperText: '',
        error: false,
        requiredField: child.requiredField,
        category: child.category,
        relatedTo: child.relatedTo ? child.relatedTo : '',
        displayLabel: providedDefaultLabel,
        name: child.name,
        type: child.type,
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
    // Logic to handle prepopulated default field
    const refinedADObj = adAccountObj.map((childEnt) => {
      // Set information about recepient. This defaults to current logged in user
      const updatedPrimaryAccount =
        userProfile.firstName && userProfile.lastName
          ? userProfile.firstName.slice(0, 1) + userProfile.lastName.slice(0, 1)
          : ''
      const updatedProfileName =
        userProfile.firstName && userProfile.lastName
          ? `${userProfile.firstName} ${userProfile.lastName}`
          : ''
      if (childEnt.id === 'recipient') {
        // Set receipient option with same value
        const targetIndex = adAccountCategoryObj.findIndex((data) => data.id === 'recipient')
        if (checkRecipentData()) {
          adAccountCategoryObj[targetIndex].options.push(recipientData)
        } else {
          adAccountCategoryObj[targetIndex].options.push({
            label: updatedProfileName,
            value: userProfile.email
          })
        }

        return {
          ...childEnt,
          value: {
            label:
              checkRecipentData() && recipientData.label ? recipientData.label : updatedProfileName,
            value:
              checkRecipentData() && recipientData.value ? recipientData.value : userProfile.email,
            manager: checkRecipentData() ? recipientData.manager : noManagerAvailable,
            helperText:
              checkRecipentData() && recipientData.manager
                ? `Manager: ${recipientData.manager}`
                : `Manager: ${notAvailable}`
          }
        }
      }
      // Set information about primary account. This defaults to current logged in user
      if (childEnt.id === 'primaryAccount') {
        if (updatedPrimaryAccount !== '') {
          prepareSamAccountString({ id: 'primaryAccount', value: updatedPrimaryAccount })
        }
        return { ...childEnt, value: updatedPrimaryAccount }
      }
      if (childEnt.id === 'accountStatus') {
        return {
          ...childEnt,
          displayLabel: ['512', '66048'].includes(childEnt.value) ? 'Enabled' : 'Disabled'
        }
      }
      if (childEnt.id === 'region') {
        return { ...childEnt, displayLabel: childEnt.value === 'gl' ? 'Global' : childEnt.value }
      }
      return childEnt
    })

    // Set account information object
    setAccountArray(refinedADObj)
    // Set prefetched autocomplete options
    setPrefetchedOptions(adAccountCategoryObj)
    dispatch(setadAccountInitialState({ data: refinedADObj }))
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

  const getChangingFieldForSAMAccount = () => {
    const targetIndex = samAccountDataStructure.findIndex(
      (field) => field.category === accountArray[0].value
    )
    const samAccountdata = samAccountDataStructure[targetIndex]
    const changingField = []
    if (samAccountdata.text === 'primaryAccount') {
      changingField.push('primaryAccount')
    }
    if (samAccountdata.text === 'accountNameMiddle') {
      changingField.push('accountNameMiddle')
    }
    if (samAccountdata.suffix === 'accountNameSuffix') {
      changingField.push('accountNameSuffix')
    }
    return changingField
  }

  const checkUniqueRequest = async () => {
    const accountName = valueFinder('samAccount')
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
                  targetValue: accountName.toLowerCase()
                }
              },
              {
                operator: 'EQUALS',
                operand: {
                  targetName: 'request.common.sAMAccountName',
                  targetValue: accountName.toLowerCase()
                }
              }
            ]
          }
        ]
      }
    }
    const resp = await accountApi.validateUniqueRequest(payload)
    if (resp?.result?.length > 0) {
      return false
    }
    return true
  }

  const validateForm = async () => {
    let isValid = true
    isValidSamAccount = true
    const samAccount = await validateSamAccount()
    // before validation any step clear the last step error state
    setAccountArray((updatedList) =>
      updatedList.map((item) => {
        if (item.value === '') {
          return { ...item, error: false, helperText: '' }
        }
        if (item.id === 'samAccount') {
          return { ...item, error: false, helperText: '' }
        }
        return item
      })
    )
    if (activeSubStep !== false && steps[activeStep].substeps) {
      steps[activeStep].substeps[activeSubStep].children.forEach((child) => {
        // validate SAM Account
        if (
          isValid === true &&
          child.id === 'samAccount' &&
          samAccount !== '' &&
          (!isValidSamAccount || samAccount.length > 20)
        ) {
          const changingField = getChangingFieldForSAMAccount()
          isValid = false
          const any = changingField.length === 1 ? '' : 'either'
          setAccountArray((updatedList) =>
            updatedList.map((item) => {
              if (item.id === 'samAccount') {
                let message = `${translate(
                  'create.ADAccount.samValidationMessage'
                )} ${any} in ${changingField.join(' or ')}`
                if (
                  ['PersonalAdmin', 'PersonalDesktopAdmin', 'PersonalDomainSupport'].includes(
                    accountCategory
                  )
                ) {
                  message = translate('create.samAccountValidation')
                }
                if (valueFinder('samAccount').length > 20) {
                  message = `${translate('create.ADAccount.samLengthMessage')}(${valueFinder(
                    'samAccount'
                  )})`
                }
                return {
                  ...item,
                  error: true,
                  helperText: message
                }
              }
              return item
            })
          )
        }
        if (child.requiredField) {
          accountArray.forEach((eleData) => {
            if (isValid === true && child.id === eleData.id && eleData.value === '') {
              if (child.relatedTo && child.relatedTo.includes(accountArray[0].value)) {
                isValid = false
              } else if (!child.relatedTo) {
                isValid = false
              }
            } else if (
              child.id === eleData.id &&
              eleData.error &&
              child.relatedTo &&
              child.relatedTo.includes(accountArray[0].value)
            ) {
              isValid = false
            }
          })
        }
      })
    } else {
      steps[activeStep].children.forEach((child) => {
        let message = ''

        // Name Validation only for GMSA
        if (
          valueFinder('accountCategory') === 'gMSA' &&
          child.id === 'name' &&
          valueFinder('name').length > 12
        ) {
          setAccountArray((updatedList) =>
            updatedList.map((item) => {
              if (item?.id === 'name') {
                if (valueFinder('name').length > 12) {
                  isValid = false
                  message = `${translate('create.ADAccount.nameLengthMessage')}(${valueFinder(
                    'name'
                  )})`
                }
                return {
                  ...item,
                  error: true,
                  helperText: message
                }
              }

              return item
            })
          )
        }

        if (child.requiredField) {
          if (accountArray[0].displayLabel === '') {
            isValid = false
          } else {
            accountArray.forEach((eleData) => {
              // Following condition is for empty value check
              if (
                isValid &&
                child.id === eleData.id &&
                ((typeof eleData.value === 'string' && eleData.value?.trim() === '') ||
                  eleData.value === '')
              ) {
                if (
                  (child.relatedTo && child.relatedTo.includes(accountArray[0].value)) ||
                  eleData.id === 'businessJustification'
                ) {
                  isValid = false
                }
              } else if (
                child.id === eleData.id &&
                eleData.error &&
                child.relatedTo &&
                child.relatedTo.includes(accountArray[0].value)
              ) {
                isValid = false
              }
              // Following condition is for incorrect value eg. special characters in the Business Justification
              else if (child.id === eleData.id && eleData.error && eleData.value) {
                isValid = false
              }
            })
          }
        } else {
          accountArray.forEach((eleData) => {
            if (
              isValid &&
              child.id === eleData.id &&
              eleData.id === 'samAccount' &&
              samAccount !== '' &&
              (!isValidSamAccount || samAccount.length > 20)
            ) {
              const changingField = getChangingFieldForSAMAccount()
              isValid = false
              const any = changingField.length === 1 ? '' : 'either'
              setAccountArray((updatedList) =>
                updatedList.map((item) => {
                  if (item.id === 'samAccount') {
                    message = translate('create.ADAccount.samErrorMessage')
                    let helperTextMessage = `${translate(
                      'create.ADAccount.samValidationMessage'
                    )} ${any} in ${changingField.join(' or ')}`
                    if (
                      ['PersonalAdmin', 'PersonalDesktopAdmin', 'PersonalDomainSupport'].includes(
                        accountCategory
                      )
                    ) {
                      message = translate('create.samAccountValidation')
                      helperTextMessage = translate('create.samAccountValidation')
                    }
                    if (valueFinder('samAccount').length > 20) {
                      message = `${translate('create.ADAccount.samLengthMessage')}(${valueFinder(
                        'samAccount'
                      )})`
                      helperTextMessage = translate('create.ADAccount.samLengthMessage')
                    }
                    dispatch(
                      updateReviewNotificationMessage({
                        type: 'Error',
                        message
                      })
                    )
                    return {
                      ...item,
                      error: true,
                      helperText: helperTextMessage
                    }
                  }
                  return item
                })
              )
            }
          })
        }
      })
    }
    if (isValid === false) {
      setAccountArray((updatedList) =>
        updatedList.map((item) => {
          if (
            ((typeof item.value === 'string' && item.value?.trim() === '') || item.value === '') &&
            item.requiredField === true
          ) {
            return {
              ...item,
              error: true,
              helperText: `${translate('create.ADAccount.mandatoryErrorMessage')}`
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
    const category = `AD Account-${accountArray[0].displayLabel}`
    const receipient = accountArray.filter((item) => item.id === 'recipient')
    const narId = accountArray.filter((item) => item.id === 'dbagApplicationID')
    const InfraId =
      accountCategory === 'TechnicalGenericbrokered'
        ? accountArray.filter((item) => item.id === 'dbagInfrastructureID')
        : []
    let delegateDetails
    let InfraIdDetails

    if (InfraId[0]?.value) {
      InfraIdDetails = await accountApi
        .getITAOandITAODelegate(
          typeof InfraId[0].value === 'object' ? InfraId[0].value?.value : InfraId[0].value
        )
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
    if (narId[0]?.value) {
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
          details.diso = res.chiefBiso ? res.chiefBiso : noDISOInfo
          return details
        })
        .catch((err) => {
          console.error('err', err)
        })
    }

    accountApi
      .getApproverInformation(`${applicationNamePrefix}DBG`, category, 'Create')
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
          if (res?.l1 !== 'null') {
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
          if (res?.l2 !== 'null') {
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

          if (res?.l3 !== 'null') {
            approverChildren.push({ id: 'L3', name: 'L3', label: 'L3', value: res.l3 })
          }
        }

        const updatedList1 = [...summaryData].map((item) => {
          const targetChildren = accountArray.filter((account) => {
            if (
              (!account.relatedTo || account.relatedTo.includes(accountCategory)) &&
              account.category === item.mapping
            ) {
              if (accountCategory === 'gMSA' && account?.id === 'primaryAccount') {
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

        return item
      })
    )
  }
  const handleNext = async () => {
    if (valueFinder('accountCategory') === 'gMSA') {
      setKerbosEncryption()
    }

    if (isValidAccount) {
      clearExtraSpaces()
      // To check if it is a last step or not
      if (
        (await validateForm()) &&
        !steps[activeStep + 1].substeps &&
        !steps[activeStep + 1].children
      ) {
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
      // In case of default primary account value sets before Sam account object
      if (samAccountObject.text === 'primaryAccount') {
        setSamAccountObject((prevSamAccountObject) => ({
          ...prevSamAccountObject,
          text: valueFinder('primaryAccount')
        }))
      }
      // Logic to handle substeps. If sub steps are completed move to the next step
      if (await validateForm()) {
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
          // Evaluate if the next step is having substep. Set the value of substeps accordingly
          if (steps[blockData[newActiveStep]]?.substeps) {
            setActiveSubStep(steps[blockData[newActiveStep]].substeps ? 0 : false)
          }
        }
      }
    } else {
      setNotification({
        description: 'create.account.inValidErrorMessage',
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
  const checkIsAccountCreated = () =>
    isAccountCreated.current ? '/history/requestHistory' : '/dashboard'
  const handleConfirm = () => {
    setIsFormIncomplete(false)
    resetAllStates()
    history.push(isDraft ? '/drafts' : checkIsAccountCreated())
  }

  const displayStepperBlock = (blocknumber) => blocknumber === activeBlock
  const displaySubStepperBlock = (subblocknumber, parentIndex) =>
    parentIndex === activeStep && subblocknumber === activeSubStep

  const handleComplete = async (draftValue) => {
    if (await checkUniqueRequest()) {
      setSaveDraft(draftValue)
      setIsFormIncomplete(false)
      setIsDraft(draftId !== '')
      const today = new Date()
      const adAccountDetails = {}
      const commonObject = {
        applicationName: `${applicationNamePrefix}DBG`,
        operation: 'Create',
        category: 'AD Account',
        recepientMail: '',
        requestorMail: userProfile.email,
        startDate: today.toISOString().split('T')[0],
        endDate: '9999-05-24',
        requestJustification: '',
        isDraft: draftValue,
        rFirstName: receipientDetails.firstName
          ? receipientDetails.firstName
          : userProfile.firstName,
        rLastName: receipientDetails.lastName ? receipientDetails.lastName : userProfile.lastName,
        accountDescription: '',
        Accessio_Request_No: '',
        AccessioBulkRequestNumber: '',
        accountDetails: ''
      }
      const accountDetailsObject = {}
      const commonDataKeys = ['recipient', 'requestJustification']
      accountArray.forEach((o) => {
        if (
          o.value !== '' &&
          (o.relatedTo === '' || o.relatedTo.includes(accountArray[0]?.value))
        ) {
          if (commonDataKeys.includes(o.name)) {
            switch (o.name) {
              case 'recipient':
                commonObject.recepientMail = typeof o.value === 'object' ? o.value.value : o.value
                break
              case 'requestJustification':
                commonObject.requestJustification = o.value
                break
              default:
                break
            }
          } else {
            switch (o.name) {
              case 'accountType':
                accountDetailsObject[o.name] = o.displayLabel
                commonObject.accountDescription = `This request will Create ${o.displayLabel}`
                break
              case 'dbagApplicationID':
                accountDetailsObject[o.name] =
                  typeof o.value === 'object' ? [o.value.value] : [o.value]
                break
              case 'dbagCostcenter':
              case 'department':
                accountDetailsObject[o.name] = typeof o.value === 'object' ? o.value.value : o.value
                break

              case 'userAccountControl':
                accountDetailsObject[o.name] =
                  accountArray[0].displayLabel === 'Technical - Service/ Process' &&
                  valueFinder('passwordNeverExpires') === true
                    ? '66048'
                    : '512'
                break
              case 'l':
                if (
                  o.id === 'region' &&
                  o.relatedTo &&
                  o.relatedTo.includes(accountArray[0].value)
                ) {
                  accountDetailsObject[o.name] = o.displayLabel
                } else if (
                  o.id === 'location' &&
                  o.relatedTo &&
                  o.relatedTo.includes(accountArray[0].value)
                ) {
                  accountDetailsObject[o.name] = o.value
                }
                break
              case 'serviceNowLevel':
              case 'accountAccessLevel':
              case 'platformType':
                accountDetailsObject[o.name] = o.displayLabel
                break
              case 'name':
                accountDetailsObject[o.name] = `gM_${o.value}`
                break
              case 'KerberosEncryptionType':
                accountDetailsObject[o.name] = o.value

                break
              default:
                accountDetailsObject[o.name] = o.value
                break
            }
          }
        }
      })
      commonObject.accountDetails = accountDetailsObject
      adAccountDetails.common = commonObject
      setLoader(true)
      if (isDraft && isDraft === true) {
        draftsApi
          .submitDraft(adAccountDetails, draftId)
          .then((res) => {
            if (res?.response?.status === 200 || res?.status === 200) {
              setNotification({
                description: isDraft ? 'draft.success.message' : 'request.success.message',
                variant: 'success'
              })
              isAccountCreated.current = true
            } else {
              setNotification({
                description: isDraft ? 'draft.error.message' : 'request.error.message',
                variant: 'error'
              })
            }
          })
          .catch(() => {
            setNotification({
              description: isDraft ? 'draft.error.message' : 'request.error.message',
              variant: 'error'
            })
          })
      } else {
        accountApi
          .submitAdAccount(adAccountDetails)
          .then((res) => {
            if (res?.response?.status === 200 || res?.status === 200) {
              setNotification({
                description:
                  draftValue === true ? 'draft.success.message' : 'request.success.message',
                variant: 'success'
              })
              isAccountCreated.current = true
            } else {
              setNotification({ description: 'request.error.message', variant: 'error' })
            }
          })
          .catch(() => {
            setNotification({ description: 'request.error.message', variant: 'error' })
          })
      }
    } else {
      setNotification({ description: 'request.unique.errormessage', variant: 'error' })
    }
  }

  const handleCancel = () => {
    setIsFormIncomplete(false)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const setAccountTypeData = (categoryDataRes, accountTypeItemsRes) => {
    const accountTypes =
      accountTypeItems.length === 0 ? accountTypeItemsRes : accountTypeItems.accountTypeItems
    const permissionedCategory = accountTypes
      ?.filter((typeItem) => typeItem.availableForRequest)
      .map((item) => item.value)
    const filterSortedData = categoryDataRes.filter((item) =>
      permissionedCategory.includes(item.label)
    )
    setcategoryData([{ id: 'accountCategory', options: filterSortedData }])
    // Retain data for meta data retrieval. Required as future dropdowns might have api based option fetch the options
    setAccCategoryData(filterSortedData)
  }

  const getAccoutTypeData = async (categoryDataRes) => {
    await accountApi
      .getAccountCategory()
      .then((res) => {
        setAccountTypeData(categoryDataRes, res)
      })
      .catch((err) => {
        console.error(err)
        setIsAccountTypeError(true)
      })
  }

  useEffect(() => {
    if (notification.description && ['success', 'error'].includes(notification.variant)) {
      setTimeout(() => {
        // Set empty notification after timeout
        if (notification.variant === 'success') {
          setLoader(false)
          history.push(saveDraft ? '/drafts' : checkIsAccountCreated())
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
    setAccountArray((updatedList) =>
      updatedList.map((item) => {
        if (item.id === 'samAccount') {
          return {
            ...item,
            value:
              (samAccountObject.prefix ? samAccountObject.prefix : '') +
              samAccountObject.text.join('') +
              (samAccountObject.suffix ? samAccountObject.suffix : ''),
            displayLabel:
              (samAccountObject.prefix ? samAccountObject.prefix : '') +
              samAccountObject.text.join('') +
              (samAccountObject.suffix ? samAccountObject.suffix : ''),
            error: false,
            helperText: ''
          }
        }
        return item
      })
    )
  }, [samAccountObject])

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

  useEffect(() => {
    if (isDraft === false) {
      setUpdatedProfileDetails()
    }
  }, [userProfile])

  useEffect(() => {
    setLoader(true)
    profileAPI
      .getUserInfo()
      .then((res3) => {
        profileAPI.getUserProfileInfo(res3?.id).then((res1) => {
          accountApi
            .getOptionsById('/v0/governance/getEmailAddress', {
              emailId: res1?.mail,
              exactMatch: false
            })
            .then((res) => {
              if (res) {
                setReceipientData(res[0])
              }
            })
          accountApi.getCreateADAccount().then((res) => {
            setSamAccountDataStructure(res.SAMAccountDataStucture)
            constructAdResponse(res.steps)
            setCategoryToLabel(res.labelToCategory)
            setSteps(res.steps)
            setResponse(res.steps)
            // Populate the stepper in separate state variable so that we can dynamically change it
            const stepData = []
            res.steps.forEach((step) => {
              if (!step.association) {
                stepData.push({ title: step.title, id: step.titleId })
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
            if (accountTypeItems.length === 0) {
              getAccoutTypeData(res)
            } else {
              setAccountTypeData(res)
            }
          })

          const payload = {
            targetName: 'mail',
            targetValue: res1?.mail,
            pageSize: 10,
            pageNumber: 0
          }
          accountApi
            .getPrimaryAccountDetails('/v0/account/accountDetails', payload)
            .then((res2) => {
              if (res2 && res2?.hits && res2?.hits?.total?.value !== 0) {
                setIsValidAccount(true)
              }
              if (res2) {
                /* eslint no-underscore-dangle: 0 */
                setUserProfile({
                  firstName: res2?.hits?.hits[0]?._source?.igaContent?.givenName
                    ? res2?.hits?.hits[0]?._source?.igaContent?.givenName
                    : '',
                  lastName: res2?.hits?.hits[0]?._source?.igaContent?.sn
                    ? res2?.hits?.hits[0]?._source?.igaContent?.sn
                    : '',
                  accountName: res2?.hits?.hits[0]?._source?.igaContent?.sAMAccountName
                    ? res2?.hits?.hits[0]?._source?.igaContent?.sAMAccountName
                    : '',
                  email: res1?.mail
                })
              }
            })
        })
      })
      .catch((err) => {
        console.error(err)
      })
    setLoader(false)
    return () => {
      if (isFormIncomplete) {
        window.onbeforeunload = () => true
      } else {
        window.onbeforeunload = undefined
      }
    }
  }, [])

  const getSelectedOptionFromDropDown = (value, eleId) => {
    const option = {}
    if (value === '' || value === undefined) {
      return option
    }
    const dropdownData = response[0]?.children.filter((ele) => ele.id === eleId)[0].options
    switch (eleId) {
      case 'region':
        return dropdownData?.filter((ele) => ele.label === value)[0]

      case 'location':
      case 'accountNameSuffix':
      case 'accountStatus':
      case 'serviceNowLevel':
      case 'dbagInfrastructureID':
      case 'platformType':
      case 'recertificationPeriod':
      case 'accountAccessLevel':
        return dropdownData?.filter((ele) => ele.value === value)[0]

      default:
        return option
    }
  }

  const updateSamAccountObject = (data, ObjectTemplateIndex) => {
    let draftText = ''
    let samAccountObjectData = {}
    const draftSuffix = data?.accountNameSuffix !== undefined ? `-${data.accountNameSuffix}` : ''
    const samAccountStructure = samAccountDataStructure[ObjectTemplateIndex]
    draftText = samAccountStructure.text.map((item) => {
      if (data[item]) {
        return data[item]
      }
      if (item === 'region' && data.l) {
        return data.l
      }
      if (item === 'accountNameMiddle' && data.middleName) {
        return data.middleName
      }
      return item
    })
    if (draftSuffix !== '' && draftText !== '') {
      samAccountObjectData = {
        ...samAccountStructure,
        text: draftText,
        suffix: draftSuffix
      }
    } else {
      samAccountObjectData = {
        ...samAccountStructure,
        text: draftText
      }
    }
    setSamAccountObject(samAccountObjectData)
  }

  useEffect(() => {
    if (isDraft && accCategoryData.length > 0 && samAccountDataStructure.length > 0) {
      setLoader(true)
      draftsApi.getDraftRequestDetailsById(draftId).then((res) => {
        if (res && Object.keys(res).length > 0) {
          const selectedCategory = accCategoryData.find(
            (fitem) => fitem.label === res?.common?.accountDetails?.accountType
          )
          setAccountCategory(selectedCategory.value)
          const ObjectTemplateIndex = samAccountDataStructure.findIndex(
            (field) => field.category === selectedCategory.value
          )
          setsamAccountObjectTemplateIndex(ObjectTemplateIndex)
          const draftsData = res?.common?.accountDetails

          // function for creating initial samAccount Object for drafts
          updateSamAccountObject(draftsData, ObjectTemplateIndex)

          const commonDetails = res?.common
          const resItem = Object.keys(draftsData)
          resItem.push('requestJustification')
          resItem.push('recipient')
          if (
            [
              'CyberArkNamedAccountApplication',
              'CyberArkNamedAccountInfrastructure',
              'CyberArkRolesharedAccount'
            ].includes(selectedCategory.value)
          ) {
            resItem.push('region')
          }
          const autocompleteOptionValues = []
          setAccountArray((modifiedList) =>
            modifiedList.map((item, i) => {
              if (resItem.includes(item.name) === true) {
                let valueData = ''
                let valueLabel = ''
                if (item.name === 'accountType') {
                  valueData = selectedCategory.value
                  valueLabel = draftsData[item.name]
                  setMetadata(
                    selectedCategory && selectedCategory.metaData ? selectedCategory.metaData : []
                  )
                  configureLocation(selectedCategory.value)
                } else if (item.type === 'autocomplete') {
                  if (item.name === 'recipient') {
                    autocompleteOptionValues.push({
                      id: item.name,
                      index: i,
                      value: commonDetails?.recepientMail
                    })
                  } else {
                    autocompleteOptionValues.push({
                      id: item.name,
                      index: i,
                      value: draftsData[item.name]
                    })
                  }
                } else if (item.name === 'requestJustification') {
                  valueData = commonDetails.requestJustification
                  valueLabel = commonDetails.requestJustification
                } else if (item.name === 'userAccountControl') {
                  valueData = draftsData[item.name]
                  valueLabel =
                    draftsData[item.name] && ['512', '66048'].includes(draftsData[item.name])
                      ? 'Enabled'
                      : 'Disabled'
                } else if (item.type === 'dropdown' && item.name !== 'accountType') {
                  if (item.relatedTo && item.relatedTo.includes(selectedCategory.value)) {
                    const selectedData = getSelectedOptionFromDropDown(
                      draftsData[item.name],
                      item.id
                    )
                    valueData = selectedData ? selectedData.value : ''
                    valueLabel = selectedData ? selectedData.label : ''
                  }
                } else if (item.name === 'passwordNeverExpires') {
                  valueData = draftsData[item.name]
                  valueLabel = draftsData[item.name] ? 'Yes' : 'No'
                } else {
                  valueData = draftsData[item.name]
                  valueLabel = draftsData[item.name]
                }
                return {
                  ...item,
                  value: valueData,
                  displayLabel: valueLabel
                }
              }
              return item
            })
          )
          const result = autocompleteOptionValues.reduce((unique, o) => {
            if (!unique.some((obj) => obj.id === o.id && obj.value === o.value)) {
              unique.push(o)
            }
            return unique
          }, [])
          setDraftAutocompleteValues(result)
        }
        const stepData = []
        const blocks = []
        steps.forEach((step, index) => {
          if (!step.association || step.association.matchingValue.includes(accountCategory || '')) {
            stepData.push({ title: step.title, id: step.titleId })
            blocks.push(index)
          }
        })
        setSteppersData(stepData)
        setBlockData(blocks)
        setLoader(false)
      })
    }
  }, [accCategoryData, samAccountDataStructure, response])

  const setApiResult = (index, result) => {
    setAccountArray((modifiedList) =>
      modifiedList.map((item, i) => {
        if (i === index) {
          const valueData = result
          const valueLabel = result && result.label ? result.label : ''
          const targetIndex = prefetchedOptions.findIndex(
            (data) => data.id === accountArray[index].id
          )
          const updatedprefetchedOptions = prefetchedOptions
          updatedprefetchedOptions[targetIndex].options = [result]
          setPrefetchedOptions(updatedprefetchedOptions)
          if (item.id === 'recipient') {
            return {
              ...item,
              value: valueData,
              displayLabel: valueLabel,
              manager: result?.manager ? result?.manager : noManagerAvailable,
              helperText: result?.manager
                ? `Manager: ${result?.manager}`
                : `Manager: ${notAvailable}`
            }
          }
          return {
            ...item,
            value: valueData,
            displayLabel: valueLabel
          }
        }
        return item
      })
    )
  }

  useEffect(() => {
    if (draftAutocompleteValues.length > 0) {
      const apiDataFetcher = async (index, apiUrl) => {
        const result = await axios({
          url: apiUrl,
          method: 'get'
        })
        if (result && result.data && result.data.length > 0) {
          if (
            accountArray[index].id === 'recipient' &&
            result &&
            result.data &&
            result.data[0] &&
            result.data[0].value
          ) {
            const payload = {
              targetName: 'mail',
              targetValue: result.data[0].value,
              pageSize: 10,
              pageNumber: 0
            }
            setIsValidAccount(false)
            accountApi
              .getPrimaryAccountDetails('/v0/account/accountDetails', payload)
              .then((res) => {
                if (res && res?.hits && res?.hits?.total?.value !== 0) {
                  setIsValidAccount(true)
                }
                if (res) {
                  /* eslint no-underscore-dangle: 0 */
                  handleDisplayValue({
                    id: 'primaryAccount',
                    value: res?.hits?.hits[0]?._source?.igaContent?.sAMAccountName
                      ? res?.hits?.hits[0]?._source?.igaContent?.sAMAccountName
                      : '',
                    displayLabel: res?.hits?.hits[0]?._source?.igaContent?.sAMAccountName
                      ? res?.hits?.hits[0]?._source?.igaContent?.sAMAccountName
                      : '',
                    firstName: res?.hits?.hits[0]?._source?.userId?.givenName
                      ? res?.hits?.hits[0]?._source?.userId?.givenName
                      : '',
                    lastName: res?.hits?.hits[0]?._source?.userId?.sn
                      ? res?.hits?.hits[0]?._source?.userId?.sn
                      : '',
                    isValidAccount: Boolean(res && res?.hits && res?.hits?.total?.value !== 0)
                  })
                }
              })
          }
          setApiResult(index, result.data[0])
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
            break
          case 'dbagCostcenter':
            apiDataFetcher(
              item.index,
              `/v0/governance/getCostCenter?exactMatch=${true}&costCenter=${item.value}`
            )
            break
          case 'department':
            apiDataFetcher(
              item.index,
              `/v0/governance/getDeptWithDeptId?departmentId=${item.value}`
            )
            break
          case 'recipient':
            apiDataFetcher(
              item.index,
              `/v0/governance/getEmailAddress?exactMatch=${true}&emailId=${item.value}`
            )
            break
          case 'PrincipalsAllowedToRetrieveManagedPassword':
            apiDataFetcher(item.index, `/v0/governance/searchGroups`, payload)
            break
          default:
            break
        }
      })
    }
  }, [draftAutocompleteValues])

  return (
    <>
      {loader && <Loading index={299} />}
      <Styled.BackButtonLink to={isDraft ? '/drafts' : '/requests'}>
        <Styled.BackButton>← {translate('create.ADAccount.back')}</Styled.BackButton>
      </Styled.BackButtonLink>

      <Breadcrumb
        path={
          isDraft
            ? [
                { label: translate('navItem.label.dashboard'), url: '/dashboard' },
                {
                  label: translate('drafts.header.title'),
                  url: '/drafts'
                }
              ]
            : [
                { label: translate('navItem.label.dashboard'), url: '/dashboard' },
                {
                  label: translate('create.ADAccount.requests'),
                  url: '/requests'
                },
                { label: translate('create.ADAccount.title'), url: '' }
              ]
        }
      />
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
      <Prompt when={isFormIncomplete} message={translate('create.ADAccount.promptMessage')} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Styled.HeaderWrapper>
          <h1 style={{ fontWeight: 'normal', marginBottom: '10px' }}>
            {translate('create.ADAccount.title')}
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
                  {translate(`create.ADAccount.${label.id}`)}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Box>
      </div>
      <Styled.MainWrapper>
        {isAccountTypeError ? (
          <h4
            style={{ paddingTop: '15px', paddingLeft: '20px', marginBottom: '-20px', color: 'red' }}
          >
            {translate('create.ADAccount.accountTypeError')}
          </h4>
        ) : null}
        {steps.map((item, index) =>
          index !== steps.length - 1 ? (
            <Box
              key={`${item.id}_container`}
              sx={{ display: displayStepperBlock(index) ? 'block' : 'none' }}
              p={5}
            >
              <h2>
                {translate(`create.ADAccount.${item.headingId ? item.headingId : item.titleId}`)}
              </h2>
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
                            columnSX
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
                                  columnSX
                                )
                              )}
                          </Grid>
                        </Grid>
                      ))}
                  </Grid>
                )}
                {index === 0 && (
                  <Grid item xs={4}>
                    {metadata.length > 0 &&
                      metadata.map((info) => (
                        <React.Fragment key={translate(`${info.label}`)}>
                          <strong>{translate(`${info.label}`)}</strong>
                          {/* eslint-disable */}
                          <p>
                            {info.description.split('\n').map((i, key) => (
                              <div
                                key={key}
                                style={{ marginBottom: '10px' }}
                                dangerouslySetInnerHTML={{ __html: i }}
                              />
                            ))}
                          </p>
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
                            sitem.children.map((element) =>
                              element.id !== 'businessJustification' ? (
                                <Grid
                                  item
                                  sm={12}
                                  md={6}
                                  lg={4}
                                  sx={{ display: 'flex' }}
                                  key={`${element.label}_container`}
                                >
                                  <Grid item xs={4} md={5} pl={5}>
                                    <p>
                                      <strong>{translate(element.label)} : </strong>
                                    </p>
                                  </Grid>
                                  <Grid item xs={4} md={8}>
                                    {element.id !== 'recertificationPeriod' ? (
                                      <p style={{ wordBreak: 'break-word' }}>
                                        {element.displayLabel
                                          ? element.displayLabel
                                          : displaySummaryValue(
                                              element?.value && typeof element?.value === 'object',
                                              element?.value?.value,
                                              element?.value
                                            )}
                                      </p>
                                    ) : (
                                      <p>
                                        {`${displaySummaryValue(
                                          element?.value && typeof element?.value === 'object',
                                          element?.value?.value,
                                          element?.value
                                        )} Month(s)`}
                                      </p>
                                    )}
                                  </Grid>
                                </Grid>
                              ) : (
                                <Grid
                                  item
                                  xs={4}
                                  sx={{ display: 'flex' }}
                                  key={`${element.label}_container`}
                                >
                                  <Grid item xs={4} md={4} pl={5}>
                                    <p>
                                      <strong>{translate(element.label)} : </strong>
                                    </p>
                                  </Grid>
                                  <Grid item xs={6} md={10}>
                                    <p style={{ wordBreak: 'break-word' }}>
                                      {element.displayLabel
                                        ? element.displayLabel
                                        : displaySummaryValue(
                                            element?.value && typeof element?.value === 'object',
                                            element?.value?.value,
                                            element?.value
                                          )}
                                    </p>
                                  </Grid>
                                </Grid>
                              )
                            )}
                          {[0, 1].includes(i) ? (
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
                      ) : (
                        <Grid container spacing={3}>
                          {sitem.children &&
                            sitem.children.map((element) => (
                              <Grid
                                item
                                xs={12}
                                sx={{ display: 'flex' }}
                                key={`${element?.label}_container`}
                              >
                                <Grid item xs={12} md={3} pl={5}>
                                  <p>
                                    <strong>{translate(element.label)} : </strong>
                                  </p>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <p>
                                    {element?.displayLabel
                                      ? element?.displayLabel
                                      : displaySummaryValue(
                                          typeof element?.value === 'object',
                                          element?.value?.value,
                                          element?.value
                                        )}
                                  </p>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <p>{element?.labelValue}</p>
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
        {allStepsCompleted() && !isDraft ? (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>{translate('create.ADAccount.reset')}</Button>
            </Box>
          </>
        ) : (
          <>
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
                  <Tooltip title={title}>
                    <div>
                      <Button
                        variant="outlined"
                        sx={{
                          color: `${theme === 'dark' ? '#FFF' : '#000'}`,
                          borderColor: `${theme === 'dark' ? '#FFF' : '#000'}`,
                          borderRadius: 0,
                          mr: 1
                        }}
                        onClick={() => handleComplete(false)}
                        disabled={
                          summaryData[2]?.children?.length === 0 || approverValidate.length > 0
                        }
                      >
                        {translate('create.ADAccount.submitRequest')}
                      </Button>
                    </div>
                  </Tooltip>
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

export default create
