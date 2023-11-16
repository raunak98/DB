import React, { useEffect, useState } from 'react'
import {
  Tooltip,
  Button,
  Box,
  Grid // , FormControl, FormControlLabel, Checkbox
} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import StarsIcon from '@mui/icons-material/Stars'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { findDomain } from 'helpers/strings'
import formGenerator from 'components/formGenerator'
import { applicationNamePrefix, CheckAdmin } from 'helpers/utils'
import useTheme from '../../../hooks/useTheme'
import translate from '../../../translations/translate'
import * as accountApi from '../../../api/accountManagement'
import * as groupApi from '../../../api/groupManagement'
import axios from '../../../axios'
import { setadAdGroupInitialState } from '../../../redux/requests/activeDirectory/activeDirectorySlice'
import { updateShowBigLoader } from '../../../redux/myAssets/myAssets.action'
import { selectGroupAssetsItems } from '../../../redux/myAssets/myAssets.selector'
import { selectprofileDetails, selectProfileRole } from '../../../redux/profile/profile.selector'
import { updateReviewNotificationMessage } from '../../../redux/review/review.action'

const ReviewMetadataIcon = ({ itemId, isDisabled, status }) => {
  const columnSX = 12
  const initialOwner = [
    { id: 'dbagIMSAuthContact', value: [] },
    { id: 'dbagIMSAuthContactDelegate', value: [] }
  ]
  const responseGroupType = { adGroupType: '', adGroupSubType: '', accessioGroupType: '' }
  const categoryAdGroupArray = []
  const apiResultArr = []
  let localSteps = []
  const mandatoryErrorMsg = translate('create.ADGroup.mandatoryErrorMessage')
  const uniqueErrorMessage = translate('request.unique.errormessage')
  const noModification = translate('modify.needModification')

  const [steps, setSteps] = useState([])
  const [adGroupArray, setAdGroupArray] = useState([])
  const [open, setOpen] = useState(false)
  const [adGroupDataArray, setAdGroupDataArray] = useState([])
  const [prefetchedOptions, setPrefetchedOptions] = useState([])
  const [accessioGroupType, setAccessioGroupType] = useState('')
  const [adGroupType, setAdGroupType] = useState('')
  const [adGroupSubType, setAdGroupSubType] = useState('')
  const [draftAutocompleteValues, setDraftAutocompleteValues] = useState([])
  const [groupOwner, setGroupOwner] = useState(initialOwner)
  const [notification, setNotification] = useState({ description: '', variant: '' })
  const [groupResponse, setGroupResponse] = React.useState([])
  const [erroMessage, setErroMessage] = useState('')
  const role = useSelector(selectProfileRole)
  const successMessage = translate('modify.group.success.message')
  const errorMessage = translate('modify.error.message')
  // const [openCompliant, setOpenCompliant] = useState(false)
  // const [iAgree, setIAgree] = useState(false)

  const { theme } = useTheme()
  const dispatch = useDispatch()
  const history = useHistory()

  // const pageSizeGroup = useSelector(selectAssetsGroupPageSize)
  // const pageNumberGroup = useSelector(selectAssetsGroupPageNumber)
  const profileDetails = useSelector(selectprofileDetails)
  const selectedGroup = useSelector(selectGroupAssetsItems)

  const getIconColor = () => {
    switch (status) {
      case 'Pending Review':
        return '#1565c0'
      case 'No Pending Review':
        return '#808080'
      case 'Overdue Review':
        return '#ffba3b'
      case 'Overdue Review and Members Removed':
        return '#ff0000'
      default:
        return ''
    }
  }

  const valueFinder = (fieldId) => {
    const targetIndex = adGroupArray.findIndex((field) => field.id === fieldId)
    return adGroupArray[targetIndex]?.value
  }

  const responseValueFinder = (fieldId) => {
    const targetIndex = groupResponse.findIndex((field) => field.id === fieldId)
    return groupResponse[targetIndex]?.value
  }

  const responseLabelFinder = (fieldId) => {
    const targetIndex = groupResponse.findIndex((field) => field.id === fieldId)
    return groupResponse[targetIndex]?.label
  }

  const iff = (consition, then, otherise) => (consition ? then : otherise)

  const resetAdGroupDraftForm = (
    res,
    isUncategorized = false,
    adGroupTypeValue = null,
    adGroupSubTypeValue = null,
    accessioGroupTypeValue = null
  ) => {
    const autocompleteOptionValues = []
    const dbagDataPrivClassValue = res.filter((i) => i.id === 'dbagDataPrivClass')[0]?.value
    const dbagExtensionAttribute6ValueData = res.filter(
      (i) => i.id === 'dbagExtensionAttribute6'
    )[0]?.value
    const dbagExtensionAttribute6Value = Array.isArray(dbagExtensionAttribute6ValueData)
      ? dbagExtensionAttribute6ValueData[0]?.split('')
      : dbagExtensionAttribute6ValueData.split('')
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
          const blocks = []
          let selectedValue = ''
          let defaultMatchValue = ''
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
              steps.forEach((step, index) => {
                if (
                  !step.association ||
                  step.association.matchingValue.includes(
                    isUncategorized ? accessioGroupTypeValue : matchedResult.value
                  )
                ) {
                  blocks.push(index)
                }
              })
              return {
                ...item,
                value: isUncategorized ? accessioGroupTypeValue : matchedResult.value,
                displayLabel: isUncategorized ? accessioGroupTypeValue : matchedResult.value,
                hidden: !adGroupSubTypeValue,
                ...otherProp
              }

            default:
              if (
                item.id === 'entitlement' &&
                res.filter((i) => i.id === 'accessioPermissionType')[0].value === ''
              ) {
                return {
                  ...item,
                  hidden: true
                }
              }
              defaultMatchValue =
                ['', undefined, null].includes(matchedResult.value) && item.value
                  ? item.value
                  : matchedResult.value
              if (
                item.type === 'dropdown' &&
                defaultMatchValue &&
                !['dbPrivate', 'clientPrivate', 'dwsPrivate'].includes(item.id)
              ) {
                let dropdownValue = []
                if (!['', undefined].includes(defaultMatchValue)) {
                  dropdownValue = localSteps[0]?.children?.filter((ele) => ele.id === item.id)
                }
                const dropdownOptions = dropdownValue.filter((data) => data !== undefined)[0]
                  .options
                selectedValue =
                  dropdownOptions.length > 0
                    ? dropdownOptions.filter((data) => data.value === defaultMatchValue)[0]
                    : ''
                if (['', undefined, null].includes(selectedValue)) {
                  selectedValue =
                    dropdownOptions.length > 0
                      ? dropdownOptions.filter((data) => data.label === defaultMatchValue)[0]
                      : ''
                }

                return {
                  ...item,
                  value: !['', undefined, null].includes(selectedValue) ? selectedValue.value : '',
                  displayLabel: !['', undefined, null].includes(selectedValue)
                    ? selectedValue.label
                    : '',
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
              if (
                dbagDataPrivClassValue === 'FALSE' &&
                ['dbPrivate', 'clientPrivate', 'dwsPrivate'].includes(item.id)
              ) {
                return item
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
    // })
  }

  const resetAdGroupForm = (
    adGroupTypeValue = null,
    adGroupSubTypeValue = null,
    accessioGroupTypeValue = null
  ) => {
    // Logic to reset value in case of change of Account Category. Create a fresh clone of the source object and set appropriate category in value and then update the state
    setAdGroupArray((updatedList) =>
      updatedList.map((item, index) => {
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
            return item
        }
      })
    )
  }

  const setDefaultOptionFromDropDown = (categoryValue) => {
    setAdGroupArray((updatedList) =>
      updatedList.map((item) => {
        if (
          item.type === 'dropdown' &&
          !['adGroupType', 'adGroupSubType', 'accessioGroupType'].includes(item.id)
        ) {
          if (
            item.value !== undefined &&
            item.value.length > 0 &&
            item.relatedTo.includes(categoryValue)
          ) {
            let dropdownData = []
            steps[0]?.children?.forEach((child) => {
              if (dropdownData === undefined || dropdownData.length === 0) {
                dropdownData = child?.children?.filter((ele) => ele.id === item.id)
                dropdownData =
                  dropdownData && dropdownData[0]?.options ? dropdownData[0].options : []
              }
            })
            const matchedOption = dropdownData?.filter((data) => {
              if (
                data.value === item.value &&
                (data?.belongsto?.includes(categoryValue) || data.belongsto === undefined)
              ) {
                return true
              }
              return false
            })
            return {
              ...item,
              value:
                matchedOption && matchedOption.length > 0 && matchedOption[0].value
                  ? matchedOption[0].value
                  : '',
              displayLabel:
                matchedOption && matchedOption.length > 0 && matchedOption[0].label
                  ? matchedOption[0].label
                  : ''
            }
          }
          return {
            ...item,
            value: '',
            displayLabel: ''
          }
        }
        return item
      })
    )
  }

  const getEmailAddress = async (email) => {
    const itaoObj = await accountApi
      .getOptionsById('/v0/governance/getEmailAddress', {
        emailId: email,
        exactMatch: true
      })
      .then((res) => (res && res.length > 0 ? res : ''))
    return itaoObj
  }

  const itaoAndItaoDelegateResponse = async (newValue) => {
    const result = {}
    const responseData = await accountApi.getITAOandITAODelegate(newValue).then(async (res) => res)
    result.itao = responseData && responseData.itao ? await getEmailAddress(responseData.itao) : ''
    result.itaoDelegate =
      responseData && responseData.itaoDelegate
        ? await getEmailAddress(responseData.itaoDelegate)
        : ''
    return result
  }

  const handlefieldChanges = async (
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
    const elementModified = event.target.id ? event.target.id.split('-')[0] : id
    const newValue = value
    if (['accessioGroupType', 'adGroupType', 'adGroupSubType'].includes(elementModified)) {
      let noActionRequired = false
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
            noActionRequired = true
            break
          }
          setAccessioGroupType(newValue || '')
          resetAdGroupForm(adGroupType, adGroupSubType, newValue)
          setDefaultOptionFromDropDown(newValue)
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
    } else {
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
                  value: '0',
                  hidden: true
                }
              }
              return item
            })
          )
        }
      }
      if (type === 'autocomplete' && valueLabel === '') {
        setAdGroupArray((updatedList) =>
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
      if (
        ['dbagApplicationID', 'dbAGApplicationID', 'samDbagApplicationID'].includes(elementModified)
      ) {
        let clonedOwnerArray = initialOwner
        const result = await itaoAndItaoDelegateResponse(newValue)
        clonedOwnerArray = clonedOwnerArray.map((owner) => {
          if (owner.id === 'dbagIMSAuthContact') {
            return {
              ...owner,
              value: [...owner.value, result.itao[0]?.value && result.itao[0]?.value]
            }
          }
          if (owner.id === 'dbagIMSAuthContactDelegate') {
            return {
              ...owner,
              value: [
                ...owner.value,
                result.itaoDelegate[0]?.value && result.itaoDelegate[0]?.value
              ]
            }
          }
          return owner
        })
        setGroupOwner(clonedOwnerArray)
        const updatedAdGroupArray = adGroupArray.map((itm) => {
          if (['dbagIMSAuthContact'].includes(itm.id)) {
            return {
              ...itm,
              value: result.itao[0] ? result.itao[0] : '',
              displayLabel: result.itao[0]?.label ? result.itao[0]?.label : '',
              error: false,
              helperText: ''
            }
          }
          if (['dbagIMSAuthContactDelegate'].includes(itm.id)) {
            return {
              ...itm,
              value: result.itaoDelegate[0] ? result.itaoDelegate[0] : '',
              displayLabel: result.itaoDelegate[0]?.label ? result.itaoDelegate[0]?.label : '',
              error: false,
              helperText: ''
            }
          }
          return itm
        })
        setAdGroupArray(updatedAdGroupArray)
      }
      if (['dbagIMSAuthContact', 'dbagIMSAuthContactDelegate'].includes(elementModified)) {
        const groupOwnerValue = []
        if (role && CheckAdmin(role)) {
          const adminUser = profileDetails?.mail ? profileDetails?.mail : ''
          if (adminUser !== '') {
            groupOwnerValue.push(adminUser)
          }
        }
        groupOwnerValue.push(newValue)
        let clonedOwnerArray = groupOwner
        clonedOwnerArray = clonedOwnerArray.map((owner) => {
          if (owner.id === elementModified) {
            return {
              ...owner,
              value: groupOwnerValue
            }
          }
          return owner
        })
        setGroupOwner(clonedOwnerArray)
      }

      setAdGroupArray((updatedList) =>
        updatedList.map((item) => {
          if (item.id === elementModified) {
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
    // accessioGroupType
    if (Array.isArray(relation)) {
      isDisplay = relation.includes(accessioGroupType)
    } else {
      isDisplay = relation === accessioGroupType
    }
    // isDisplay = true
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
            displayLabel: displayData.displayLabel,
            error: false,
            helperText: ''
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

  const validateForm = async () => {
    let isValid = true
    // before validation any step clear the last step error state
    const updatedAdGroupArray = adGroupArray.map((item) => {
      if (
        (typeof item.value === 'string' && item.value?.trim() === '') ||
        (Array.isArray(item.value) && item.value.length === 0)
      ) {
        return { ...item, error: false, helperText: '' }
      }
      if (item.id === 'dbagIMSApprovers' && item.value.length < 3) {
        return { ...item, error: true, helperText: '' }
      }
      return item
    })
    setAdGroupArray(updatedAdGroupArray)
    if (adGroupType === '' || adGroupSubType === '' || accessioGroupType === '') {
      isValid = false
    }
    steps[0].children.forEach((child) => {
      if (child.requiredField) {
        adGroupArray.forEach((eleData) => {
          if (isValid && child.id === eleData.id) {
            if (
              (Array.isArray(eleData.value) && eleData.value.length === 0) ||
              (typeof eleData.value === 'string' && eleData.value?.trim() === '')
            ) {
              if (
                child.relatedTo &&
                child.relatedTo.includes(adGroupArray[2].value) &&
                eleData.hidden === false
              ) {
                isValid = false
              } else if (!child.relatedTo && eleData.hidden === false) {
                isValid = false
              }
            }
          } else if (
            child.id === eleData.id &&
            eleData.error &&
            child.relatedTo &&
            child.relatedTo.includes(adGroupArray[2].value)
          ) {
            isValid = false
          } else if (eleData.id === 'dbagIMSApprovers' && eleData.value.length < 3) {
            isValid = false
          }
        })
      }
    })

    if (isValid === false) {
      setAdGroupArray((updatedList) =>
        updatedList.map((item) => {
          if (
            item.requiredField === true &&
            (item.value === null ||
              (typeof item.value === 'string' && item.value?.trim() === '') ||
              (Array.isArray(item.value) && item.value.length === 0))
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

  const checkUniqueRequest = async () => {
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
              },
              {
                operator: 'EQUALS',
                operand: {
                  targetName: 'request.common.operation',
                  targetValue: 'Add Membership'
                }
              },
              {
                operator: 'EQUALS',
                operand: {
                  targetName: 'request.common.operation',
                  targetValue: 'Remove Membership'
                }
              }
            ]
          },
          {
            operator: 'EQUALS',
            operand: {
              targetName: 'request.common.category',
              targetValue: 'AD Group'
            }
          },
          {
            operator: 'OR',
            operand: [
              {
                operator: 'EQUALS',
                operand: {
                  targetName: 'request.common.groupDetails.distinguishedName',
                  targetValue: `${responseValueFinder('distinguishedName')}`
                }
              },
              {
                operator: 'EQUALS',
                operand: {
                  targetName: 'request.common.distinguishedName',
                  targetValue: `${responseValueFinder('distinguishedName')}`
                }
              }
            ]
          }
        ]
      }
    }
    const isUnique = groupApi
      .validateUniqueRequest('/v0/governance/checkRequest', payload)
      .then((res) => res?.totalCount === 0)
      .catch((err) => {
        console.error(err)
        return false
      })

    return isUnique
  }

  const handleClose = () => {
    setOpen(false)
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

  const checkGroupRequestModified = () => {
    let isModified = false
    adGroupArray.forEach((item) => {
      if (
        isModified === false &&
        item.relatedTo.includes(accessioGroupType) &&
        item.hidden === false &&
        item.id !== 'businessJustification'
      ) {
        if (isModified === false && item.id === 'dbagIMSApprovers') {
          item.value.forEach((approver) => {
            isModified =
              typeof approver.value === 'object'
                ? !responseValueFinder(item.id).includes(approver.value.value)
                : !responseValueFinder(item.id).includes(approver.value)
          })
        } else {
          isModified =
            typeof item.value === 'object'
              ? iff(
                  Array.isArray(responseValueFinder(item.id)),
                  item.value.value !== responseValueFinder(item.id)[0],
                  item.value.value !== responseValueFinder(item.id)
                )
              : item.value !== responseValueFinder(item.id)
        }
      }
    })
    return isModified
  }

  const handleConfirm = async () => {
    setErroMessage('')
    // validate the form reqired fields
    clearExtraSpaces()
    if (await validateForm()) {
      if (checkGroupRequestModified()) {
        if (await checkUniqueRequest()) {
          setOpen(false)
          dispatch(updateShowBigLoader(true))
          const adGroupDetails = {}
          const commonObject = {
            applicationName: `${applicationNamePrefix}${findDomain(
              responseValueFinder('distinguishedName')
            )}`,
            groupDN: `${responseValueFinder('distinguishedName')}`,
            Accessio_Request_No: '',
            requestorMail: profileDetails?.mail,
            category: 'AD Group',
            operation: 'Amend',
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
                  case 'dbagIMSAuthContact':
                  case 'dbagIMSAuthContactDelegate':
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
                  case 'dbagEntitlement':
                    if (checkModifiedElement({ id: o.id, value: o.value })) {
                      groupDetailsObject[o.name] = valueFinder('entitlement')
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
          groupApi
            .modifyAdGroup(adGroupDetails)
            .then((res) => {
              if (res?.status === 200) {
                dispatch(
                  updateReviewNotificationMessage({
                    type: 'Success',
                    message: successMessage
                  })
                )
                history.push(`/history/requestHistory`)
                dispatch(updateShowBigLoader(false))
              } else {
                dispatch(
                  updateReviewNotificationMessage({
                    type: 'Error',
                    message: errorMessage
                  })
                )
                dispatch(updateShowBigLoader(false))
              }
            })
            .catch(() => {
              dispatch(
                updateReviewNotificationMessage({
                  type: 'Error',
                  message: errorMessage
                })
              )
              dispatch(updateShowBigLoader(false))
            })
        } else {
          setErroMessage(uniqueErrorMessage)
        }
      } else {
        setErroMessage(noModification)
      }
    }
  }

  const adGroupObjGenerator = (objRepo, adGroupObj, adGroupSummaryObj, adaccessioGroupTypeObj) => {
    objRepo.forEach((child) => {
      let displayLabel = {}
      const providedDefaultValue = child.default && child.default !== '' ? child.default : ''
      if (providedDefaultValue !== '' && child?.options && child.options.length > 0) {
        displayLabel = child?.options.find((data) => data.value === providedDefaultValue)
      }
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
        displayLabel: iff(
          Object.keys(displayLabel).length > 0 && displayLabel?.label !== '',
          displayLabel?.label,
          ''
        ),
        name: child.name,
        hidden: child.displayType.hidden,
        readOnly: child.displayType.readOnly,
        disabled: child.displayType.disabled,
        type: child.type
      })
      if (child.type === 'autocomplete') {
        if (child.default !== '') {
          // Provision to make API call when any autocomplete comes with an value
        }
        adaccessioGroupTypeObj.push({ id: child.id, options: [] })
      }
    })
  }

  const constructAdResponse = (obj, result) => {
    // Reset the account array to blank array before starting any operation
    setAdGroupArray([])
    const adGroupObj = []
    const adGroupSummaryObj = []
    const adaccessioGroupTypeObj = []
    // Logic for looping provided obj and setting Account, Summary and prefetched options
    obj?.forEach((block) => {
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
    const dbagDataPrivClassValue = result.filter((item) => item.id === 'dbagDataPrivClass')
    const refinedADObj = adGroupObj.map((childEnt) => {
      if (childEnt.id === 'dbagDataPrivClass' && dbagDataPrivClassValue[0].value === '') {
        return {
          ...childEnt,
          value: dbagDataPrivClassValue[0].value,
          displayLabel: dbagDataPrivClassValue[0].value
        }
      }
      return childEnt
    })

    // Set account information object
    setAdGroupArray(refinedADObj)
    // Set prefetched autocomplete options
    setPrefetchedOptions(adaccessioGroupTypeObj)
    dispatch(setadAdGroupInitialState({ data: adGroupObj }))
    return adGroupObj
  }

  const setOptionsForGroupAndSubTypeAndAccessioType = (res) => {
    res.forEach((data) => {
      switch (data.id) {
        case 'adGroupType':
          // setAdGroupType(data.value)
          responseGroupType.adGroupType = data.value
          break

        case 'adGroupSubType':
          // setAdGroupSubType(data.value)
          responseGroupType.adGroupSubType = data.value
          break

        case 'accessioGroupType':
          // setAccessioGroupType(data.value)
          responseGroupType.accessioGroupType = data.value
          break

        default:
          break
      }
    })
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
      setOpen(true)
    }
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

  const handleReviewMetadata = () => {
    if (status !== '' && status !== 'No Pending Review') {
      dispatch(updateShowBigLoader(true))
      if (selectedGroup?.total > 0) {
        const selected = selectedGroup?.groupData?.filter((resp) => resp.id === itemId)
        groupApi.setGroupRecord(selected[0]?.groupDetails).then((res) => {
          if (res) {
            setGroupResponse(res)
            groupApi.getReviewGroupMetadata().then((metaRes) => {
              constructAdResponse(metaRes.steps, res)
              setSteps(metaRes.steps)
              localSteps = metaRes.steps
              if (metaRes?.steps?.length > 0) {
                let clonedOwnerArray = initialOwner
                if (role && CheckAdmin(role)) {
                  const adminUser = profileDetails?.mail ? profileDetails?.mail : ''
                  if (adminUser !== '') {
                    const groupOwnerArray = []
                    groupOwnerArray.push(adminUser)
                    clonedOwnerArray = clonedOwnerArray.map((owner) => ({
                      ...owner,
                      value: groupOwnerArray
                    }))
                    setGroupOwner(clonedOwnerArray)
                  }
                }
                groupApi.getAdGroupType('/v0/governance/getADGroupType').then((response1) => {
                  if (response1 && response1.length) {
                    setAdGroupDataArray([{ id: 'adGroupType', options: response1 }])
                    categoryAdGroupArray.push({ id: 'adGroupType', options: response1 })
                    setOptionsForGroupAndSubTypeAndAccessioType(res)
                    let isResetFlag = validateUncategoriersRequest('adGroupType')
                    if (isResetFlag) {
                      // reset form here with adGroupType
                      resetAdGroupForm()
                      setAdGroupType('')
                      setAdGroupSubType('')
                      setAccessioGroupType('')
                      dispatch(updateShowBigLoader(false))
                      setOpen(true)
                    } else {
                      groupApi
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
                              resetAdGroupForm(responseGroupType.adGroupType)
                              setAdGroupType(responseGroupType.adGroupType)
                              setAdGroupSubType('')
                              setAccessioGroupType('')
                              dispatch(updateShowBigLoader(false))
                              setOpen(true)
                            } else {
                              setAdGroupType(responseGroupType.adGroupType)
                              groupApi
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
                                      resetAdGroupForm(
                                        responseGroupType.adGroupType,
                                        responseGroupType.adGroupSubType
                                      )
                                      setAdGroupSubType(responseGroupType.adGroupSubType)
                                      setAccessioGroupType('')
                                      resetAdGroupDraftForm(
                                        res,
                                        true,
                                        responseGroupType.adGroupType,
                                        responseGroupType.adGroupSubType,
                                        responseGroupType.accessioGroupType
                                      )
                                      dispatch(updateShowBigLoader(false))
                                      setOpen(true)
                                    } else {
                                      setAdGroupSubType(responseGroupType.adGroupSubType)
                                      setAccessioGroupType(responseGroupType.accessioGroupType)
                                      resetAdGroupDraftForm(
                                        res,
                                        true,
                                        responseGroupType.adGroupType,
                                        responseGroupType.adGroupSubType,
                                        responseGroupType.accessioGroupType
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
          }
        })
      } else {
        dispatch(updateShowBigLoader(false))
      }
    }
  }

  // const handleChange = (event, value) => {
  //   console.log(event)
  //   setIAgree(value)
  // }

  // const handleConfirmComplianceGroup = () => {}

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
    if (adGroupType !== '') {
      groupApi
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
                      options: res?.sort((a, b) => a.value.localeCompare(b.value))
                    }
                  }
                  return item
                })
              )
            } else {
              setAdGroupDataArray([
                ...adGroupDataArray,
                {
                  id: 'adGroupSubType',
                  options: res?.sort((a, b) => a.value.localeCompare(b.value))
                }
              ])
            }
            if (res.length === 1) {
              setAccessioGroupType(res[0].value)
            }
          }
        })
    }
  }, [adGroupType])

  useEffect(() => {
    if (adGroupSubType !== '') {
      groupApi
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
                    value:
                      res.length === 1
                        ? res[0].value
                        : iff(
                            res.length >= 1 &&
                              adGroupSubType === 'Other' &&
                              adGroupType === 'Infrastructure',
                            res[0].value,
                            ''
                          ),

                    displayLabel:
                      res.length === 1
                        ? res[0].label
                        : iff(
                            res.length >= 1 &&
                              adGroupSubType === 'Other' &&
                              adGroupType === 'Infrastructure',
                            res[0].label,
                            ''
                          )
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
                      options: res?.sort((a, b) => a.value.localeCompare(b.value))
                    }
                  }
                  return item
                })
              )
            } else {
              setAdGroupDataArray([
                ...adGroupDataArray,
                {
                  id: 'accessioGroupType',
                  options: res?.sort((a, b) => a.value.localeCompare(b.value))
                }
              ])
            }
            if (
              res.length === 1 ||
              (res.length !== 0 && adGroupSubType === 'Other' && adGroupType === 'Infrastructure')
            ) {
              setAccessioGroupType(res[0].value)
            }
          }
        })
    }
  }, [adGroupSubType])

  useEffect(() => {
    if (notification.description && ['success', 'error'].includes(notification.variant)) {
      setTimeout(() => {
        // Set empty notification after timeout
        if (notification.variant === 'success') {
          history.push(`/history/requestHistory/${notification.data}`)
        }
        dispatch(updateShowBigLoader(false))
        setNotification({ description: '', variant: '' })
      }, 5000)
    }
  }, [notification.variant])

  return (
    <>
      {status && (
        <Tooltip title={translate(`myAssets.${status.toLowerCase().replace(/\s/g, '')}`)}>
          <Button
            onClick={() => {
              handleReviewMetadata()
            }}
            sx={{
              padding: '3px 0',
              marginLeft: '-16px',
              color: `${theme === 'dark' ? '#FFF' : '#000'}`
            }}
            disabled={isDisabled}
          >
            <StarsIcon
              style={{ color: `${getIconColor()}` }}
              onClick={() => {
                handleReviewMetadata()
              }}
              disabled={isDisabled}
            />
          </Button>
        </Tooltip>
      )}

      <div>
        <Dialog
          open={open}
          PaperProps={{
            style: {
              backgroundColor: theme === 'dark' ? '#1A2129' : '#FFF',
              boxShadow: 'none',
              width: '800px',
              height: '80%'
            }
          }}
        >
          <DialogTitle id="alert-dialog-title">{translate('metaData.adGroupDetails')}</DialogTitle>
          {erroMessage && (
            <h4 style={{ color: 'red', paddingLeft: '23px', margin: '2px' }}>{erroMessage}</h4>
          )}
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {translate('metaData.pendingCertification')}
            </DialogContentText>
            {steps.map((item) => (
              <Box key={`${item.id}_container`} p={5}>
                <Grid container spacing={12}>
                  {item.children && (
                    <Grid item xs={11}>
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
                            columnSX,
                            groupOwner
                          )
                        )}
                    </Grid>
                  )}
                </Grid>
              </Box>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              {translate('create.ADAccount.cancel')}
            </Button>
            <Button onClick={handleConfirm}>{translate('justification.button.submit')}</Button>
          </DialogActions>
        </Dialog>
      </div>
      {/* <div>
        <Dialog
          open={openCompliant}
          PaperProps={{
            style: {
              backgroundColor: theme === 'dark' ? '#1A2129' : '#FFF',
              boxShadow: 'none',
              width: '800px'
            }
          }}
        >
          <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
          <DialogContent>
            <Grid item xs={columnSX} key="non_compliance_container">
              <FormControl sx={{ width: '94%' }} margin="normal" key="formControlCompliance" xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="checkBoxCompliance"
                     onChange={(e, v) => handleChange(e, v)}
                      required="true"
                      name="checkBoxCompliance"
                      checked={iAgree}
                    />
                  }
                  label="By Submiting this form, I agree that all the AD attribute information is up to date/correct."
                />
              </FormControl>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              {translate('create.ADAccount.cancel')}
            </Button>
            <Button onClick={handleConfirmComplianceGroup}>Submit</Button>
          </DialogActions>
        </Dialog>
      </div> */}
    </>
  )
}

ReviewMetadataIcon.defaultProps = {
  defaultChecked: false,
  disabled: false,
  errorMessage: '',
  label: '',
  name: '',
  onChangeCallback: undefined
}

export default ReviewMetadataIcon
