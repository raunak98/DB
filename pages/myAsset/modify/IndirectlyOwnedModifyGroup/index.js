import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
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
import { toCamelCase, findDomain } from 'helpers/strings'
import formGenerator from 'components/formGenerator'
import Breadcrumb from 'components/breadcrumb'
import translate from 'translations/translate'
import { Notification } from 'components/notification'
import {
  setAdGroupSummaryInitialState,
  setadAdGroupInitialState
} from '../../../../redux/requests/activeDirectory/activeDirectorySlice'
import Loading from '../../../../components/loading'
import { selectProfileDetailsSelector } from '../../../../redux/profile/profile.selector'
import {
  selectShowBigLoader,
  selectOwnedGroupAssetsItems
} from '../../../../redux/myAssets/myAssets.selector'
import { updateShowBigLoader } from '../../../../redux/myAssets/myAssets.action'
import * as Styled from '../../../requests/request/create/style'
import * as adGroupApi from '../../../../api/groupManagement'
import useTheme from '../../../../hooks/useTheme'
import axios from '../../../../axios'
import { applicationNamePrefix } from '../../../../helpers/utils'

const IndirectlyOwnedModifyGroup = () => {
  const typeModule = localStorage.getItem('component')
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
  const [adGroupType, setAdGroupType] = React.useState('')
  const [adGroupSubType, setAdGroupSubType] = React.useState('')
  const [samGroupName, setSamGroupName] = React.useState('')
  const [groupResponse, setGroupResponse] = React.useState([])
  const [accessioGroupType, setAccessioGroupType] = React.useState('')
  const [adGroupArray, setAdGroupArray] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [adGroupDataArray, setAdGroupDataArray] = useState([])
  const [categoryToLabel, setCategoryToLabel] = useState({})
  const [prefetchedOptions, setPrefetchedOptions] = useState([])
  const [notification, setNotification] = useState({ description: '', variant: '' })
  const [loader, setLoader] = useState(false)
  const [isUniqueRequest, setIsUniqueRequest] = useState(true)
  const [isUncategoriesFlow, setIsUncategoriesFlow] = useState(false)
  const [erroMessage, setErroMessage] = useState('')
  const { theme } = useTheme()
  const history = useHistory()
  const locationParams = useLocation()
  const lineItemData = locationParams?.state?.dataItem
  const [draftAutocompleteValues, setDraftAutocompleteValues] = useState([])
  const categoryAdGroupArray = []
  const responseGroupType = { adGroupType: '', adGroupSubType: '', accessioGroupType: '' }
  const adAccountInfo = useSelector((state) => state.adAccountInfo)
  const selectedIndirectlyOwnedGrpAssetItem = useSelector(selectOwnedGroupAssetsItems)
  const profile = useSelector(selectProfileDetailsSelector)
  const showBigLoader = useSelector(selectShowBigLoader)
  const dispatch = useDispatch()
  const mandatoryErrorMsg = translate('create.ADGroup.mandatoryErrorMessage')
  const uniqueErrorMessage = translate('request.unique.errormessage')
  const noModification = translate('group.error.noModification')
  const columnSX = 6
  const apiResultArr = []
  const initialOwner = [
    { id: 'dbagIMSAuthContact', value: '' },
    { id: 'dbagIMSAuthContactDelegate', value: '' }
  ]
  const [groupOwner, serGroupOwner] = useState(initialOwner)
  //   const queryParams = new URLSearchParams(window.location.search)
  //   const requestId = queryParams.get('id')

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
    setAccessioGroupType('')
    setAdGroupArray([])
    setOpen(false)
    setAdGroupDataArray([])
    setCategoryToLabel({})
  }
  const selectedGroup = selectedIndirectlyOwnedGrpAssetItem
  const valueFinder = (fieldId) => {
    const targetIndex = adGroupArray.findIndex((field) => field.id === fieldId)
    return adGroupArray[targetIndex]?.value
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

  const fieldChangeResetAdGroupForm = (
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
            hidden: false,
            error: false,
            helperText: ''
          }
        case 1:
          return {
            ...item,
            value: adGroupSubTypeValue,
            hidden: !adGroupTypeValue,
            error: false,
            helperText: ''
          }
        case 2:
          return {
            ...item,
            value: accessioGroupTypeValue,
            hidden: !adGroupSubTypeValue,
            error: false,
            helperText: ''
          }
        case 3:
          return {
            ...item,
            value: samGroupName,
            // hidden: false,
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

  const handlefieldChanges = (event, value, category, id, valueLabel, helperTextValue) => {
    const elementModified = event.target.id ? event.target.id.split('-')[0] : id
    const newValue = value
    if (['accessioGroupType', 'adGroupType', 'adGroupSubType'].includes(elementModified)) {
      let noActionRequired = false
      switch (elementModified) {
        case 'adGroupType':
          setAdGroupType(newValue)
          setAdGroupSubType('')
          setAccessioGroupType('')
          fieldChangeResetAdGroupForm(newValue)
          break
        case 'adGroupSubType':
          setAdGroupSubType(newValue)
          setAccessioGroupType('')
          fieldChangeResetAdGroupForm(adGroupType, newValue)
          break
        case 'accessioGroupType':
          if (adGroupArray[2].value === newValue) {
            noActionRequired = true
            break
          }
          setAccessioGroupType(newValue || '')
          fieldChangeResetAdGroupForm(adGroupType, adGroupSubType, newValue)
          break

        default:
          break
      }
      if (noActionRequired) {
        return
      }
      const stepData = []
      const blocks = []
      steps.forEach((step, index) => {
        if (
          !step.association ||
          step.association.matchingValue.includes(value && value.value ? value.value : '')
        ) {
          stepData.push({ title: step.title })
          blocks.push(index)
        }
      })
      setSteppersData(stepData)
      setBlockData(blocks)
    } else {
      if (elementModified === 'entitlement' && newValue === 'Other - please specify') {
        setAdGroupArray((updatedList) =>
          updatedList.map((item) => {
            if (item.id === 'entitlementOther') {
              return {
                ...item,
                hidden: false
              }
            }
            return item
          })
        )
      }
      if (elementModified === 'dbagDataPrivClass') {
        if (newValue === 'TRUE') {
          setAdGroupArray((updatedList) =>
            updatedList.map((item) => {
              if (['dwsPrivate', 'clientPrivate', 'dbPrivate'].includes(item.id)) {
                return {
                  ...item,
                  hidden: false
                }
              }
              return item
            })
          )
        } else {
          setAdGroupArray((updatedList) =>
            updatedList.map((item) => {
              if (['dwsPrivate', 'clientPrivate', 'dbPrivate'].includes(item.id)) {
                return {
                  ...item,
                  hidden: true
                }
              }
              return item
            })
          )
        }
      }
      if (['dbagIMSAuthContact', 'dbagIMSAuthContactDelegate'].includes(elementModified)) {
        let clonedOwnerArray = groupOwner
        clonedOwnerArray = clonedOwnerArray.map((owner) => {
          if (owner.id === elementModified) {
            return {
              ...owner,
              value: newValue
            }
          }
          return owner
        })
        serGroupOwner(clonedOwnerArray)
      }
      setAdGroupArray((updatedList) =>
        updatedList.map((item) => {
          if (item.id === elementModified) {
            return {
              ...item,
              value: newValue,
              displayLabel: valueLabel,
              error: false,
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
      isDisplay = relation.includes(accessioGroupType)
    } else {
      isDisplay = relation === accessioGroupType
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
    dispatch(setAdGroupSummaryInitialState({ data: result }))
  }

  const adGroupObjGenerator = (objRepo, adGroupObj, adGroupSummaryObj, adaccessioGroupTypeObj) => {
    objRepo.forEach((child) => {
      const providedDefaultValue = child.default && child.default !== '' ? child.default : ''
      adGroupSummaryObj.push(child.category)
      adGroupObj.push({
        id: child.id,
        label: child.label,
        value: child.isMultiple ? [] : providedDefaultValue,
        helperText: '',
        error: false,
        requiredField: child.requiredField,
        category: child.category,
        relatedTo: child.relatedTo ? child.relatedTo : '',
        displayLabel: '',
        name: child.name,
        type: child.type,
        hidden: child.displayType.hidden,
        readOnly: child.displayType.readOnly,
        disabled: child.displayType.disabled,
        options: child.options
      })
      if (child.type === 'autocomplete') {
        if (child.default !== '') {
          // Provision to make API call when any autocomplete comes with an value
        }
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
    displaySummary([...new Set(adGroupSummaryObj)])
  }

  const helperFinder = (fieldId) => {
    const targetIndex = adGroupArray.findIndex((field) => field.id === fieldId)
    return adGroupArray[targetIndex]?.helperText
  }

  const errorFinder = (fieldId) => {
    const targetIndex = adGroupArray.findIndex((field) => field.id === fieldId)
    return adGroupArray[targetIndex]?.error
  }

  const totalSteps = () => stepperData.length

  const completedSteps = () => Object.keys(completed).length

  const isLastStep = () => activeStep === totalSteps() - 1
  const hasFurtherSubsteps = () => activeSubStep < steps[blockData[activeStep]].substeps.length - 1

  const allStepsCompleted = () => completedSteps() === totalSteps()

  const validateForm = () => {
    let isValid = true
    // before validation any step clear the last step error state
    setAdGroupArray((updatedList) =>
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
    if (adGroupType === '' || adGroupSubType === '' || accessioGroupType === '') {
      isValid = false
    }
    if (activeSubStep !== false && steps[activeStep].substeps) {
      steps[activeStep].substeps[activeSubStep].children.forEach((child) => {
        if (child.requiredField) {
          adGroupArray.forEach((eleData) => {
            if (
              isValid &&
              child.id === eleData.id &&
              (eleData.value === undefined ||
                (typeof eleData.value === 'string' && eleData.value?.trim() === '') ||
                eleData.value === '' ||
                eleData.value.length === 0)
            ) {
              if (child.relatedTo && child.relatedTo.includes(adGroupArray[2].value)) {
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
          adGroupArray.forEach((eleData) => {
            if (
              isValid &&
              child.id === eleData.id &&
              eleData.value &&
              (eleData.value === undefined ||
                (typeof eleData.value === 'string' && eleData.value?.trim() === '') ||
                eleData.value === '' ||
                eleData.value.length === 0)
            ) {
              if (child.relatedTo && child.relatedTo.includes(adGroupArray[2].value)) {
                isValid = false
              } else if (!child.relatedTo) {
                isValid = false
              }
            }
          })
        }
      })
    }
    if (isValid === false) {
      setAdGroupArray((updatedList) =>
        updatedList.map((item) => {
          if (
            (item.value === undefined ||
              item.value === null ||
              (typeof item.value === 'string' && item.value?.trim() === '') ||
              item.value === '' ||
              item.value.length === 0) &&
            item.requiredField === true
          ) {
            return {
              ...item,
              error: true,
              helperText: mandatoryErrorMsg
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

  const checkUniqueRequest = () => {
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
              targetValue: 'Amend'
            }
          },
          {
            operator: 'EQUALS',
            operand: {
              targetName: 'request.common.category',
              targetValue: 'AD Group'
            }
          },
          {
            operator: 'EQUALS',
            operand: {
              targetName: 'request.common.applicationName',
              targetValue: `${applicationNamePrefix}${findDomain(valueFinder('distinguishedName'))}`
            }
          },
          {
            operator: 'OR',
            operand: [
              {
                operator: 'EQUALS',
                operand: {
                  targetName: 'request.common.groupDetails.sAMAccountName',
                  targetValue: `${valueFinder('samAccount')}`
                }
              },
              {
                operator: 'EQUALS',
                operand: {
                  targetName: 'request.common.sAMAccountName',
                  targetValue: `${valueFinder('samAccount')}`
                }
              }
            ]
          }
        ]
      }
    }
    adGroupApi.validateUniqueRequest('/v0/governance/checkRequest', payload).then((res) => {
      setIsUniqueRequest(res?.totalCount === 0)
    })
  }

  const clearExtraSpaces = () => {
    setAdGroupArray((updatedList) =>
      updatedList.map((item) => ({
        ...item,
        value: typeof item.value === 'string' ? item.value?.trim() : item.value,
        displayLabel:
          typeof item.displayLabel === 'string' ? item.displayLabel?.trim() : item.displayLabel
      }))
    )
  }

  const constructSummaryPage = () => {
    // check for the unique Record
    setErroMessage('')
    checkUniqueRequest()
    const updatedList1 = [...summaryData].map((item) => {
      const targetChildren = adGroupArray.filter((account) => {
        if (
          (!account.relatedTo || account.relatedTo.includes(accessioGroupType)) &&
          account.category === item.mapping
        ) {
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
    setSummaryData(updatedList1)
  }

  const handleNext = () => {
    clearExtraSpaces()
    // To check if it is a last step or not
    if (validateForm() && !steps[activeStep + 1].substeps && !steps[activeStep + 1].children) {
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
    // Logic to handle substeps. If sub steps are completed move to the next step
    if (validateForm()) {
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
  }
  const handleBack = () => {
    if (activeSubStep !== false && activeSubStep !== 0) {
      setActiveSubStep(activeSubStep - 1)
    } else {
      const newPrevStep = activeStep - 1
      setActiveStep(newPrevStep)
      setActiveBlock(blockData[newPrevStep])
      if (steps[blockData[newPrevStep]]?.substeps) {
        setActiveSubStep(
          steps[blockData[newPrevStep]].substeps
            ? steps[blockData[newPrevStep]].substeps.length - 1
            : false
        )
      }
    }
  }

  const editHandler = (eStep) => {
    const index = steps.findIndex((step) => toCamelCase(step.titleId) === eStep)
    setActiveStep(index)
    if (index === 0) {
      setActiveSubStep(false)
    }
    setActiveBlock(blockData[index])
  }

  const handleReset = () => {
    resetAllStates()
  }

  const handleConfirm = () => {
    resetAllStates()
    history.push('/my-asset')
  }

  const displayStepperBlock = (blocknumber) => blocknumber === activeBlock
  const displaySubStepperBlock = (subblocknumber, parentIndex) =>
    parentIndex === activeStep && subblocknumber === activeSubStep

  const responseValueFinder = (fieldId) => {
    const targetIndex = groupResponse.findIndex((field) => field.id === fieldId)
    return groupResponse[targetIndex]?.value
  }

  const responseLabelFinder = (fieldId) => {
    const targetIndex = groupResponse.findIndex((field) => field.id === fieldId)
    return groupResponse[targetIndex]?.label
  }

  const checkGroupRequestModified = () => {
    let isModified = false
    adGroupArray.forEach((item, i) => {
      if (isModified === false && item.value && ![0, 1, 2, 3, 24, 21, 22, 23].includes(i)) {
        isModified =
          typeof item.value === 'object'
            ? item.value.value !== responseValueFinder(item.id)
            : item.value !== responseValueFinder(item.id)
      }
    })
    return isModified
  }

  const checkModifiedElement = (element) => {
    let isModified = false
    if (Array.isArray(element.value)) {
      const modifiedData = element.value.map((itm) => itm.value)
      let prevData
      if (['dbagExternalProvider', 'dbagIMSDataSecCLass'].includes(element.id)) {
        prevData = responseLabelFinder(element.id)
      } else {
        prevData = responseValueFinder(element.id)
      }
      if (modifiedData.length === prevData.length) {
        isModified = modifiedData.every((ele) => {
          if (!prevData.includes(ele)) {
            return true
          }
          return false
        })
      } else {
        isModified = true
      }
    } else {
      isModified =
        typeof element.value === 'object'
          ? element.value.value !== responseValueFinder(element.id)
          : element.value !== responseValueFinder(element.id)
    }
    return isModified
  }

  const handleComplete = (draftValue) => {
    if (checkGroupRequestModified()) {
      if (isUniqueRequest) {
        const adGroupDetails = {}
        const commonObject = {
          applicationName: `${applicationNamePrefix}${findDomain(
            valueFinder('distinguishedName')
          )}`,
          groupDN: `${responseValueFinder('dn')}`,
          Accessio_Request_No: '',
          requestorMail: profile.mail,
          category: 'AD Group',
          operation: 'Amend',
          isDraft: draftValue,
          requestJustification: ''
        }
        const groupDetailsObject = {}
        const commonDataKeys = ['requestJustification']
        adGroupArray.forEach((o) => {
          if (
            o.value !== '' &&
            (o.relatedTo === '' || o.relatedTo.includes(adGroupArray[2]?.value))
          ) {
            if (commonDataKeys.includes(o.name)) {
              switch (o.name) {
                case 'requestJustification':
                  commonObject.requestJustification = o.value
                  break
                default:
                  break
              }
            } else {
              switch (o.name) {
                case 'dbagIMSApprovers':
                case 'description':
                case 'dbagApplicationID':
                case 'dbagInfrastructureID':
                  if (checkModifiedElement({ id: o.id, value: o.value })) {
                    if (Array.isArray(o.value)) {
                      groupDetailsObject[o.name] = o.value.map((itm) => itm.value)
                    } else {
                      groupDetailsObject[o.name] = [
                        typeof o.value === 'object' ? o.value.value : o.value
                      ]
                    }
                  }
                  break
                case 'dbagIMSAuthContact':
                case 'dbagIMSAuthContactDelegate':
                  if (checkModifiedElement({ id: o.id, value: o.value })) {
                    groupDetailsObject[o.name] =
                      typeof o.value === 'object' ? o.value.value : o.value
                  }
                  break
                case 'dbagEntitlement':
                  if (checkModifiedElement({ id: o.id, value: o.value })) {
                    groupDetailsObject[o.name] =
                      valueFinder('entitlement') === 'Other - please specify'
                        ? valueFinder('entitlementOther')
                        : valueFinder('entitlement')
                  }
                  break
                case 'dbagDataPrivClass':
                  if (checkModifiedElement({ id: o.id, value: o.value })) {
                    groupDetailsObject.dbagExtensionAttribute6 = `${valueFinder(
                      'dwsPrivate'
                    )}${valueFinder('clientPrivate')}${valueFinder('dbPrivate')}`
                    groupDetailsObject.dbagDataPrivClass = o.value
                  }
                  break
                case 'dwsPrivate':
                case 'clientPrivate':
                case 'dbPrivate':
                  break

                default:
                  if (checkModifiedElement({ id: o.id, value: o.value })) {
                    groupDetailsObject[o.name] =
                      typeof o.value === 'object' ? o.value.value : o.value
                  }
                  break
              }
            }
          }
        })
        adGroupDetails.common = commonObject
        adGroupDetails.common.groupDetails = groupDetailsObject
        setLoader(true)
        adGroupApi
          .modifyAdGroup(adGroupDetails)
          .then((res) => {
            if (res?.status === 200) {
              setNotification({
                description: 'request.success.message',
                variant: 'success',
                data: res.data
              })
            } else {
              setNotification({ description: 'request.error.message', variant: 'error' })
            }
          })
          .catch(() => {
            setNotification({ description: 'request.error.message', variant: 'error' })
          })
      } else {
        setErroMessage(uniqueErrorMessage)
      }
    } else {
      setErroMessage(noModification)
    }
  }

  const handleCancel = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
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

  const backButtonAction = () => {
    switch (typeModule) {
      case 'Drafts':
        return '/drafts'
      case 'Admin':
        return '/admin'
      default:
        return '/my-asset'
    }
  }

  const breadcrumbsAction = () => {
    switch (typeModule) {
      case 'Drafts':
        return [
          { label: translate('navItem.label.dashboard'), url: './dashboard' },
          { label: translate('drafts.header.title'), url: '/drafts' }
        ]
      case 'Admin':
        return [
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          { label: translate('admin.header.title'), url: '/admin' },
          { label: translate('groupAdmin.header'), url: '/admin/GroupAdmin' },
          { label: translate('modify.ADAccount.title'), url: '' }
        ]
      default:
        return [
          { label: translate('navItem.label.dashboard'), url: './dashboard' },
          { label: translate('myAssets.header'), url: '/my-asset' },
          { label: translate('modify.ADAccount.title'), url: '' }
        ]
    }
  }

  const resetAdGroupForm = (
    res,
    isUncategorized = false,
    adGroupTypeValue = null,
    adGroupSubTypeValue = null,
    accessioGroupTypeValue = null
  ) => {
    adGroupApi.getModifyADGroup().then((resultData) => {
      constructAdResponse(resultData.steps)
      setCategoryToLabel(resultData.labelToCategory)
      setSteps(resultData.steps)
      // Populate the stepper in separate state variable so that we can dynamically change it
      const stepData = []
      const blocks = []
      resultData.steps.forEach((step, index) => {
        if (!step.association) {
          stepData.push({ title: step.title, id: step.titleId })
          blocks.push(index)
        }
      })
      setSteppersData(stepData)
      setBlockData(blocks)
      // Set initial value of active substep so that it would be available to the next press handler
      if (resultData.steps[0].substeps) {
        setActiveSubStep(0)
        setTotalSubSteps(resultData.steps[0].substeps.length)
      }
      const autocompleteOptionValues = []
      const otherEntitlementValue = res.filter((i) => i.id === 'entitlement')[0]?.value
      const dbagDataPrivClassValue = res.filter((i) => i.id === 'dbagDataPrivClass')[0]?.value
      const dbagExtensionAttribute6Value = res.filter((i) => i.id === 'dbagExtensionAttribute6')[0]
        ?.value
      setAdGroupArray((updatedList) =>
        updatedList.map((item, j) => {
          const matchedResult = res.filter((i) => i.id === item.id)[0]
          if (matchedResult && item.id === matchedResult.id) {
            if (item.type === 'autocomplete' && matchedResult.value) {
              autocompleteOptionValues.push({
                id: item.name,
                index: j,
                value: matchedResult.value
              })
              return item
            }
            const otherProp = {
              disabled: !isUncategorized,
              error: false,
              helperText: ''
            }
            let selectedValue = ''
            switch (j) {
              case 0:
                return {
                  ...item,
                  value: isUncategorized ? adGroupTypeValue : matchedResult.value,
                  displayLabel: isUncategorized ? adGroupTypeValue : matchedResult.value,
                  hidden: false,
                  ...otherProp
                }
              case 1:
                return {
                  ...item,
                  value: isUncategorized ? adGroupSubTypeValue : matchedResult.value,
                  displayLabel: isUncategorized ? adGroupSubTypeValue : matchedResult.value,
                  hidden: !adGroupTypeValue,
                  ...otherProp
                }
              case 2:
                return {
                  ...item,
                  value: isUncategorized ? accessioGroupTypeValue : matchedResult.value,
                  displayLabel: isUncategorized ? accessioGroupTypeValue : matchedResult.value,
                  hidden: !adGroupSubTypeValue,
                  ...otherProp
                }

              default:
                if (
                  item.type === 'dropdown' &&
                  matchedResult.value &&
                  !['samLocation', 'endlocation', 'cyberarkregion', 'dlpou'].includes(item.id)
                ) {
                  let dropdownValue = {}
                  if (matchedResult.value && matchedResult.value !== '') {
                    dropdownValue = resultData.steps[0].children.filter((ele) => ele.id === item.id)
                  }

                  selectedValue =
                    dropdownValue[0]?.options.length > 0
                      ? dropdownValue[0]?.options.filter(
                          (data) => data.value === matchedResult.value
                        )[0]
                      : ''
                  if (selectedValue && ['', null].includes(selectedValue)) {
                    selectedValue =
                      dropdownValue[0]?.options.length > 0
                        ? dropdownValue[0]?.options.filter(
                            (data) => data.label === matchedResult.value
                          )[0]
                        : ''
                  }

                  return {
                    ...item,
                    value:
                      selectedValue && !['', null].includes(selectedValue)
                        ? selectedValue.value
                        : '',
                    displayLabel:
                      selectedValue && !['', null].includes(selectedValue)
                        ? selectedValue.label
                        : '',
                    error: false,
                    helperText: ''
                  }
                }
                if (
                  item.id === 'entitlement' &&
                  item.options.filter((data) => data.value === matchedResult.value).length === 0
                ) {
                  return {
                    ...item,
                    value: 'Other - please specify',
                    displayLabel: 'Other - please specify',
                    error: false,
                    helperText: ''
                  }
                }
                if (item.id === 'dwsPrivate' && dbagDataPrivClassValue === 'TRUE') {
                  return {
                    ...item,
                    value: dbagExtensionAttribute6Value ? dbagExtensionAttribute6Value[0] : '',
                    displayLabel:
                      dbagExtensionAttribute6Value && dbagExtensionAttribute6Value[0] === '1'
                        ? 'Yes'
                        : 'No',
                    error: false,
                    hidden: false,
                    helperText: ''
                  }
                }
                if (item.id === 'clientPrivate' && dbagDataPrivClassValue === 'TRUE') {
                  return {
                    ...item,
                    value: dbagExtensionAttribute6Value ? dbagExtensionAttribute6Value[1] : '',
                    displayLabel:
                      dbagExtensionAttribute6Value && dbagExtensionAttribute6Value[1] === '1'
                        ? 'Yes'
                        : 'No',
                    error: false,
                    hidden: false,
                    helperText: ''
                  }
                }
                if (item.id === 'dbPrivate' && dbagDataPrivClassValue === 'TRUE') {
                  return {
                    ...item,
                    value: dbagExtensionAttribute6Value ? dbagExtensionAttribute6Value[2] : '',
                    displayLabel:
                      dbagExtensionAttribute6Value && dbagExtensionAttribute6Value[2] === '1'
                        ? 'Yes'
                        : 'No',
                    error: false,
                    hidden: false,
                    helperText: ''
                  }
                }

                return {
                  ...item,
                  value: matchedResult.value,
                  displayLabel: matchedResult.value,
                  error: false,
                  helperText: ''
                }
            }
          }
          if (item.id === 'entitlementOther' && otherEntitlementValue) {
            return {
              ...item,
              value: otherEntitlementValue,
              displayLabel: otherEntitlementValue,
              error: false,
              helperText: '',
              hidden: false
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
    })
  }

  const validateUncategoriersRequest = (type) => {
    let targetInd
    let matchData
    switch (type) {
      case 'adGroupType':
        targetInd = categoryAdGroupArray.findIndex((field) => field.id === 'adGroupType')
        matchData = categoryAdGroupArray[targetInd].options.filter(
          (itm) => itm.value === responseGroupType.adGroupType
        )
        return !matchData.length
      case 'adGroupSubType':
        targetInd = categoryAdGroupArray.findIndex((field) => field.id === 'adGroupSubType')
        matchData = categoryAdGroupArray[targetInd].options.filter(
          (itm) => itm.value === responseGroupType.adGroupSubType
        )
        return !matchData.length
      case 'accessioGroupType':
        targetInd = categoryAdGroupArray.findIndex((field) => field.id === 'accessioGroupType')
        matchData = categoryAdGroupArray[targetInd].options.filter(
          (itm) => itm.value === responseGroupType.accessioGroupType
        )
        return !matchData.length
      default:
        return false
    }
  }

  useEffect(() => {
    if (notification.description && ['success', 'error'].includes(notification.variant)) {
      setTimeout(() => {
        // Set empty notification after timeout
        if (notification.variant === 'success') {
          setLoader(false)
          const newCompleted = completed
          newCompleted[activeStep] = true
          setCompleted(newCompleted)
          handleReset()
          history.push(`/history/requestHistory/${notification.data}`)
        } else {
          setLoader(false)
        }
        setNotification({ description: '', variant: '' })
      }, 5000)
    }
  }, [notification.variant])

  useEffect(() => {
    if (adGroupType !== '' && isUncategoriesFlow) {
      adGroupApi
        .getAdGroupType(`/v0/governance/getADGroupType?adGroupType=${adGroupType}`)
        .then((res) => {
          if (res && res.length > 0) {
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
              setAccessioGroupType(res[0].value)
            }
          }
        })
    }
    if (adGroupSubType !== '' && isUncategoriesFlow) {
      adGroupApi
        .getAdGroupType(
          `/v0/governance/getADGroupType?adGroupType=${adGroupType}&adGroupSubType=${adGroupSubType}`
        )
        .then((res) => {
          if (res && res.length > 0) {
            categoryAdGroupArray.push({ id: 'accessioGroupType', options: res })
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
            }
          }
        })
    }
  }, [adGroupType, isUncategoriesFlow, adGroupSubType])

  const setOptionsForGroupAndSubTypeAndAccessioType = (res) => {
    let groupNameText
    let groupDescription
    res.forEach((data) => {
      switch (data.id) {
        case 'adGroupType':
          setAdGroupType(data.value)
          responseGroupType.adGroupType = data.value
          break

        case 'adGroupSubType':
          setAdGroupSubType(data.value)
          responseGroupType.adGroupSubType = data.value
          break

        case 'accessioGroupType':
          setAccessioGroupType(data.value)
          responseGroupType.accessioGroupType = data.value
          break
        case 'samAccount':
          setSamGroupName(data.value)
          groupNameText = data.value
          break
        case 'description':
          groupDescription = data.value
          break
        default:
          break
      }
    })
    setMetadata([
      {
        label: 'Group Name',
        description: groupNameText
      },
      {
        label: 'Group Description',
        description: groupDescription
      }
    ])
  }

  const apiDataFetcher = async (index, apiUrl) => {
    const res = await axios({
      url: apiUrl,
      method: 'get'
    })

    if (res && res.data) {
      const result = res.data
      const existingData = apiResultArr?.filter((item) => item.id === index)[0]
      const resultData = Array.isArray(result) ? result[0] : result
      const newResult = existingData ? [...existingData.value, resultData] : [resultData]

      if (existingData) {
        existingData.value = newResult
        apiResultArr.map((data) => (data.id === index ? existingData : data))
      } else {
        apiResultArr.push({ id: index, value: newResult })
      }
    } else {
      const existingData = apiResultArr?.filter((item) => item.id === index)[0]
      if (existingData) {
        existingData.value = 'Error'
        apiResultArr.map((data) => (data.id === index ? existingData : data))
      } else {
        apiResultArr.push({ id: index, value: 'Error' })
      }
    }
    if (apiResultArr.length === draftAutocompleteValues.length) {
      const updatedList = adGroupArray.map((item) => {
        const apiData = apiResultArr?.filter((itm) => itm.id === item.id)[0]?.value
        if (Array.isArray(apiData) && apiData.length > 0) {
          let apiLabel = ''
          if (apiData.length > 1) {
            apiLabel = apiData.map((data) => data.label)
          }
          return {
            ...item,
            value: apiData.length > 1 ? apiData : apiData[0],
            displayLabel: apiData.length > 1 ? apiLabel.join(', ') : apiData[0].label
          }
        }
        return item
      })
      setAdGroupArray(updatedList)
      dispatch(updateShowBigLoader(false))
    }
  }

  useEffect(() => {
    if (draftAutocompleteValues.length > 0) {
      draftAutocompleteValues.forEach((item) => {
        switch (item.id) {
          case 'mAMs':
          case 'dbagApplicationID':
          case 'dbagInfrastructureID':
            apiDataFetcher(
              item.id,
              `/v0/application/getApplicationNarId?exactMatch=${true}&narId=${item.value}`
            )
            break
          case 'dbagCostcenter':
            apiDataFetcher(
              item.id,
              `/v0/governance/getCostCenter?exactMatch=${true}&costCenter=${item.value}`
            )
            break
          case 'department':
            apiDataFetcher(item.id, `/v0/governance/getDeptWithDeptId?departmentId=${item.value}`)
            break
          case 'dbagIMSAuthContact':
          case 'dbagIMSAuthContactDelegate':
            apiDataFetcher(
              item.id,
              `/v0/governance/getEmailAddress?exactMatch=${true}&emailId=${item.value}`
            )
            break
          case 'dbagIMSApprovers':
            item.value.forEach((approver) => {
              apiDataFetcher(
                item.id,
                `/v0/governance/getEmailAddress?exactMatch=${true}&emailId=${approver}`
              )
            })
            break
          case 'dbagSupportGroup':
            apiDataFetcher(
              'dbagsupportGroup',
              `/v0/governance/getdbUnityGroup?exactMatch=${true}&groupName=${item.value}`
            )
            break
          default:
            break
        }
      })
    }
  }, [draftAutocompleteValues])

  useEffect(() => {
    dispatch(updateShowBigLoader(true))
    let selected
    adGroupApi.getAdGroupType('/v0/governance/getADGroupType').then((response1) => {
      setAdGroupDataArray([{ id: 'adGroupType', options: response1 }])
      categoryAdGroupArray.push({ id: 'adGroupType', options: response1 })

      if (selectedGroup && Object.keys(selectedGroup).length !== 0) {
        selected = lineItemData
        localStorage.setItem('groupsData', JSON.stringify(selected[0]?.groupDetails))

        adGroupApi.setGroupRecord(lineItemData).then((res) => {
          setGroupResponse(res)
          if (res) {
            setOptionsForGroupAndSubTypeAndAccessioType(res)
            let isResetFlag = validateUncategoriersRequest('adGroupType')
            if (isResetFlag) {
              // reset form here with adGroupType
              resetAdGroupForm(res, true)
              setIsUncategoriesFlow(true)
              setAdGroupType('')
              setAdGroupSubType('')
              setAccessioGroupType('')
            } else {
              adGroupApi
                .getAdGroupType(
                  `/v0/governance/getADGroupType?adGroupType=${responseGroupType.adGroupType}`
                )
                .then((res1) => {
                  if (res1 && res1.length > 0) {
                    categoryAdGroupArray.push({ id: 'adGroupSubType', options: res1 })
                    setAdGroupDataArray(categoryAdGroupArray)
                    isResetFlag = validateUncategoriersRequest('adGroupSubType')
                    if (isResetFlag) {
                      // reset form here with adGroupSubType
                      resetAdGroupForm(res, true, responseGroupType.adGroupType)
                      setIsUncategoriesFlow(true)
                      setAdGroupSubType('')
                      setAccessioGroupType('')
                    } else {
                      adGroupApi
                        .getAdGroupType(
                          `/v0/governance/getADGroupType?adGroupType=${responseGroupType.adGroupType}&adGroupSubType=${responseGroupType.adGroupSubType}`
                        )
                        .then((res2) => {
                          if (res2 && res2.length > 0) {
                            categoryAdGroupArray.push({
                              id: 'accessioGroupType',
                              options: res2
                            })
                            setAdGroupDataArray(categoryAdGroupArray)
                            isResetFlag = validateUncategoriersRequest('accessioGroupType')
                            if (isResetFlag) {
                              // reset form here with accessioGroupType
                              setIsUncategoriesFlow(true)
                              resetAdGroupForm(
                                res,
                                true,
                                responseGroupType.adGroupType,
                                responseGroupType.adGroupSubType
                              )
                              setAccessioGroupType('')
                            } else {
                              resetAdGroupForm(
                                res,
                                false,
                                responseGroupType.adGroupType,
                                responseGroupType.adGroupSubType
                              )
                            }
                          }
                        })
                    }
                  }
                })
            }
          }
        })
      }
    })
  }, [])

  return (
    <>
      {(loader || showBigLoader) && <Loading index={299} />}
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
            {translate('modify.ADGroup.title')}
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
                  {label.title}
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
              <h2>{item.heading}</h2>
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
                            adGroupDataArray,
                            valueFinder,
                            errorFinder,
                            optionFinder,
                            optionReset,
                            disabledFlagFinder,
                            readOnlyFlagFinder,
                            hiddenFlagFinder,
                            index === 0 ? columnSX : 10,
                            groupOwner
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
                        <>
                          <Grid
                            item
                            key={`${subindex}_grid`}
                            xs={12}
                            sx={{
                              display: displaySubStepperBlock(subindex, index) ? 'block' : 'none'
                            }}
                          >
                            <h3>{substep.heading}</h3>
                            <Grid container spacing={{ xs: 2 }}>
                              {substep.children &&
                                substep.children.map((element) =>
                                  formGenerator(
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
                                    columnSX
                                  )
                                )}
                            </Grid>
                          </Grid>
                        </>
                      ))}
                  </Grid>
                )}
                {index === 0 && (
                  <Grid item xs={4}>
                    {metadata.length > 0 &&
                      metadata.map((info) => (
                        <React.Fragment key={info.label}>
                          <strong>{info.label}</strong>
                          <p>{info.description}</p>
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
              <h4 style={{ color: 'red' }}>{erroMessage}</h4>
              <h2>{item.heading}</h2>

              {summaryData &&
                summaryData.map((sitem, i) => (
                  <Accordion key={i} disableGutters defaultExpanded>
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
                      {i === 0 ? (
                        <Grid container spacing={4}>
                          {sitem.children &&
                            sitem.children.map(
                              (element, ind) =>
                                element.value && (
                                  <Grid
                                    item
                                    xs={i === 0 && ind === sitem.children.length - 1 ? 12 : 4}
                                    sx={{ display: 'flex' }}
                                    key={`${element.label}_container`}
                                  >
                                    <Grid
                                      item
                                      xs={i === 0 && ind === sitem.children.length - 1 ? 12 : 4}
                                      md={i === 0 && ind === sitem.children.length - 1 ? 1 : 4}
                                      pl={5}
                                    >
                                      <p>
                                        <strong>{element.label}</strong>
                                      </p>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={i === 0 && ind === sitem.children.length - 1 ? 12 : 4}
                                      md={i === 0 && ind === sitem.children.length - 1 ? 11 : 8}
                                    >
                                      {checkModifiedElement(element, ind) ? (
                                        <p>
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
                        <Grid container spacing={8}>
                          {sitem.children &&
                            sitem.children.map(
                              (element, ind) =>
                                element.value && (
                                  <Grid
                                    item
                                    xs={i === 1 && ind === sitem.children.length - 1 ? 12 : 8}
                                    sx={{ display: 'flex' }}
                                    key={`${element.label}_container`}
                                  >
                                    <Grid
                                      item
                                      xs={i === 1 && ind === sitem.children.length - 1 ? 12 : 8}
                                      md={i === 1 && ind === sitem.children.length - 1 ? 1 : 8}
                                      pl={5}
                                    >
                                      <p>
                                        <strong>{element.label}</strong>
                                      </p>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={i === 1 && ind === sitem.children.length - 1 ? 12 : 8}
                                      md={i === 1 && ind === sitem.children.length - 1 ? 11 : 12}
                                    >
                                      {checkModifiedElement(element, ind) ? (
                                        <p>
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
          <DialogTitle id="alert-dialog-title">
            {translate('create.ADGroup.confirmCancelationTitle')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {translate('create.ADGroup.confirmCancelationMsg')}
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

export default IndirectlyOwnedModifyGroup
