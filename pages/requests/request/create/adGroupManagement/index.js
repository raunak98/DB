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
import { toCamelCase } from 'helpers/strings'
import Breadcrumb from 'components/breadcrumb'
import formGenerator from 'components/formGenerator'
import translate from 'translations/translate'
import { Notification } from 'components/notification'
import {
  setAdGroupSummaryInitialState,
  setadAdGroupInitialState
} from '../../../../../redux/requests/activeDirectory/activeDirectorySlice'
import Loading from '../../../../../components/loading'
import * as profileAPI from '../../../../../api/profile'
import * as draftsApi from '../../../../../api/drafts'
import * as Styled from '../style'
import * as adGroupApi from '../../../../../api/groupManagement'
import * as accountApi from '../../../../../api/accountManagement'
import useTheme from '../../../../../hooks/useTheme'
import { applicationNamePrefix, CheckAdmin } from '../../../../../helpers/utils'
import axios from '../../../../../axios'
import { selectDraftsItems } from '../../../../../redux/drafts/drafts.selector'
import { updateReviewNotificationMessage } from '../../../../../redux/review/review.action'
import {
  selectProfileDetailsSelector,
  selectProfileRole
} from '../../../../../redux/profile/profile.selector'

const CreateADGroup = () => {
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
  const [samAccountDataStructure, setSamAccountDataStructure] = useState({})
  const [descriptionStructure, setDescriptionStructure] = useState({})
  const [samAccountObject, setSamAccountObject] = useState({})
  const [descriptiontObject, setDescriptionObject] = useState({})
  const [samAccountObjectTemplateIndex, setsamAccountObjectTemplateIndex] = useState(0)
  const [descriptionTemplateIndex, setDescriptionTemplateIndex] = useState(0)
  const [accessioGroupType, setAccessioGroupType] = React.useState('')
  const [dnName, setDnName] = React.useState('')
  const [adGroupArray, setAdGroupArray] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [adGroupDataArray, setAdGroupDataArray] = useState([])
  const [categoryToLabel, setCategoryToLabel] = useState({})
  const [prefetchedOptions, setPrefetchedOptions] = useState([])
  const [userProfile, setUserProfile] = useState({})
  const [response, setResponse] = useState([])
  const [notification, setNotification] = useState({ description: '', variant: '' })
  const [loader, setLoader] = useState(false)
  const [isUniqueRequest, setIsUniqueRequest] = useState(true)
  // const [uniqueErroMessage, setUniqueErroMessage] = useState('')
  const { theme } = useTheme()
  const history = useHistory()
  const adAccountInfo = useSelector((state) => state.adAccountInfo)
  const dispatch = useDispatch()
  const groupNameErrorMsg = translate('create.ADGroup.groupValidationMessage')
  const groupNameLengthErrorMsg = translate('create.ADGroup.groupLengthMessage')
  const mandatoryErrorMsg = translate('create.ADGroup.mandatoryErrorMessage')
  const uniqueErrorMessage = translate('request.unique.errormessage')
  const columnSX = 4
  const initialOwner = [
    { id: 'dbagIMSAuthContact', value: [] },
    { id: 'dbagIMSAuthContactDelegate', value: [] },
    { id: 'domain', value: '' }
  ]
  const [groupOwner, serGroupOwner] = useState(initialOwner)
  const location = useLocation()
  const isDraft = location?.pathname?.includes('drafts')
  const [saveDraft, setSaveDraft] = useState('')
  const draftId = location && location?.pathname ? location?.pathname.split('/').pop() : ''
  const selectedGroup = isDraft ? useSelector(selectDraftsItems) : []
  const categoryAdGroupArray = []
  const apiResultArr = []
  const [draftAutocompleteValues, setDraftAutocompleteValues] = useState([])
  const responseGroupType = { adGroupType: '', adGroupSubType: '', accessioGroupType: '' }
  const [isUncategoriesFlow, setIsUncategoriesFlow] = useState(false)
  const typeModule = localStorage.getItem('component')
  let isValidSamAccount = true
  const profile = useSelector(selectProfileDetailsSelector)
  const role = useSelector(selectProfileRole)

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
    setSamAccountDataStructure({})
    setDescriptionStructure({})
    setSamAccountObject({})
    setDescriptionObject({})
    isValidSamAccount = true
  }

  const valueFinder = (fieldId) => {
    const targetIndex = adGroupArray.findIndex((field) => field.id === fieldId)
    return adGroupArray[targetIndex]?.value
  }

  const labelFinder = (fieldId) => {
    const targetIndex = adGroupArray.findIndex((field) => field.id === fieldId)
    return adGroupArray[targetIndex]?.displayLabel
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

  const validateGroupData = async () => {
    let payload = {}
    payload = {
      targetName: 'igaContent.cn.keyword',
      targetValue: `${valueFinder('samAccount')}`,
      accessioIsgMSAGroup: 'All',
      pageSize: 10,
      pageNumber: 0
    }
    await adGroupApi.validateGroupDetails('/v0/governance/groupDetails', payload).then((res) => {
      isValidSamAccount = !(res?.hits?.hits.length > 0)
    })
    return valueFinder('samAccount')
  }

  const iff = (consition, then, otherise) => (consition ? then : otherise)
  const generateDescription = (category, data) => {
    let textString = ''
    let keyTitle = ''
    let descdata = ''
    if (category) {
      const descStructure =
        descriptionStructure[
          data?.dataStructureIndex !== undefined
            ? data?.dataStructureIndex
            : descriptionTemplateIndex
        ]
      descdata = data?.dataStructureIndex !== undefined ? descStructure : descriptiontObject
      const descriptionObjectTemplate = descStructure
      if (descriptionObjectTemplate.text.includes(data.id)) {
        // "permissioning group for", "Active Directory", "group for","group","1"
        switch (data.id) {
          case 'adGroupType':
          case 'description':
          case 'role':
          case 'groupNameText':
          case 'RobotBusinessDescription':
          case 'serverName':
          case 'cyberarkregion':
          case 'dbSRSApproverLevel':
          case 'categoryReference':
          case 'samAccount':
          case 'versionIterationofGroup':
          case 'vendorteamName':
          case 'info':
          case 'projectName':
          case 'groupRole':
            textString = data.value ? data.value : valueFinder(data.id)
            keyTitle = 'text'
            break
          case 'dbagApplicationID':
          case 'samDbagApplicationID':
          case 'dbagInfrastructureID':
            textString = data.value ? data.value : labelFinder(data.id)
            keyTitle = 'text'
            break
          case 'approverLevel':
            textString = data.value
              ? `Approver Level ${data.value.slice(-1)}`
              : `Approver Level ${valueFinder(data.id).slice(-1)}`
            keyTitle = 'text'
            break
          default:
            break
        }
      }

      if (keyTitle === 'text') {
        const replacedString = descriptionObjectTemplate.text.map((value, index) =>
          value === data.id ? textString : descdata.text[index]
        )

        setDescriptionObject(() => ({
          ...descdata,
          text: replacedString
        }))
      } else if (keyTitle === 'suffix') {
        setDescriptionObject(() => ({
          ...descdata,
          suffix: textString
        }))
      }
    }
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
      const samAccountObjectTemplate = samAccountStructure
      if (samAccountObjectTemplate.text.includes(data.id)) {
        switch (data.id) {
          case 'digitalIdentity':
          case 'role':
          case 'safeName':
          case 'serverName':
          case 'groupNameText':
          case 'approverLevel':
          case 'categoryReference':
          case 'dLPEnvironment':
          case 'dLPGroupRole':
          case 'versionIterationofGroup':
          case 'vRMID':
          case 'productionUATorDEV':
          case 'applicationName':
          case 'groupRole':
          case 'projectName':
          case 'vendorteamName':
          case 'samLocation':
          case 'samDbagApplicationID':
          case 'RobotBusinessDescription':
          case 'dbSRSApproverLevel':
            textString = data.value ? data.value : valueFinder(data.id)
            keyTitle = 'text'
            break
          case 'enterpriseServices':
            textString = data.value ? data.value : valueFinder('enterpriseServices')
            textString = textString === 'NA' ? '' : textString
            keyTitle = 'text'
            break

          default:
            break
        }
      }

      if (keyTitle === 'text') {
        const replacedString = samAccountObjectTemplate.text.map((value, index) =>
          value === data.id ? textString : samAccountdata.text[index]
        )

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

  const getLocationValues = async (agType, domain) => {
    const locations = await axios
      .get(`/v0/governance/getAdGroupLocation?accessioADGroupType=${agType}&domain=${domain}`)
      .then((res) => res.data)

    if (locations.length) {
      const targetIndex = adGroupDataArray.findIndex((field) =>
        ['samLocation', 'endlocation', 'cyberarkregion', 'dlpou'].includes(field.id)
      )
      if (targetIndex > 0) {
        setAdGroupDataArray((updatedList) =>
          updatedList.map((item) => {
            if (['samLocation', 'endlocation', 'cyberarkregion', 'dlpou'].includes(item.id)) {
              return {
                ...item,
                options: locations?.sort((a, b) => a.label.localeCompare(b.label))
              }
            }
            return item
          })
        )
      } else if (isDraft) {
        categoryAdGroupArray.push(
          {
            id: 'endlocation',
            options: locations?.sort((a, b) => a.label.localeCompare(b.label))
          },
          {
            id: 'samLocation',
            options: locations?.sort((a, b) => a.label.localeCompare(b.label))
          },
          {
            id: 'cyberarkregion',
            options: locations?.sort((a, b) => a.label.localeCompare(b.label))
          },
          {
            id: 'dlpou',
            options: locations?.sort((a, b) => a.label.localeCompare(b.label))
          }
        )
        const result = categoryAdGroupArray.reduce((unique, o) => {
          if (!unique.some((obj) => obj.id === o.id && obj.value === o.value)) {
            unique.push(o)
          }
          return unique
        }, [])
        setAdGroupDataArray(result)
      } else {
        setAdGroupDataArray([
          ...adGroupDataArray,
          {
            id: 'endlocation',
            options: locations?.sort((a, b) => a.label.localeCompare(b.label))
          },
          {
            id: 'samLocation',
            options: locations?.sort((a, b) => a.label.localeCompare(b.label))
          },
          {
            id: 'cyberarkregion',
            options: locations?.sort((a, b) => a.label.localeCompare(b.label))
          },
          {
            id: 'dlpou',
            options: locations?.sort((a, b) => a.label.localeCompare(b.label))
          }
        ])
      }
    } else {
      const targetIndex = adGroupDataArray.findIndex((field) =>
        ['samLocation', 'endlocation', 'cyberarkregion', 'dlpou'].includes(field.id)
      )
      if (targetIndex > 0) {
        setAdGroupDataArray((updatedList) =>
          updatedList.map((item) => {
            if (['samLocation', 'endlocation', 'cyberarkregion', 'dlpou'].includes(item.id)) {
              return {
                ...item,
                options: []
              }
            }
            return item
          })
        )
      }
    }
  }

  const getDNValues = async (agType, elocation) => {
    let distinguishedValues = []
    // const res = await axios({
    //   url: '/api/metadata/getDN',
    //   baseURL: 'http://localhost:8081'
    // }).then((result) => result.data)

    const res = await adGroupApi
      .getDN(
        `/v0/governance/getDN?groupType=${agType}&location=${elocation}&domain=${valueFinder(
          'domain'
        )}&exactMatch=true`
      )
      .then((result) => result)

    if (res.length) {
      distinguishedValues = res
    }
    return distinguishedValues
  }

  const prepareSamAccountString = (data) => {
    if (samAccountDataStructure.length > 0) {
      const category = data?.category ? data?.category : accessioGroupType
      generateSamAccount(category, data)
    }
  }

  const prepareGroupDescriptionString = (data) => {
    // TODO : Prepeare Description Accoring to the structure.
    if (descriptionStructure.length > 0) {
      const category = data?.category ? data?.category : accessioGroupType
      generateDescription(category, data)
    }
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

  const setUpdatedProfileDetails = () => {
    setAdGroupArray((updatedList) =>
      updatedList.map((item) => {
        if (item.id === 'primaryAccount') {
          const updatedProfileName =
            userProfile.firstName && userProfile.lastName
              ? userProfile.firstName.slice(0, 1) + userProfile.lastName.slice(0, 1)
              : ''
          return {
            ...item,
            value: updatedProfileName,
            displayLabel: updatedProfileName,
            error: false,
            helperText: ''
          }
        }
        if (item.id === 'recipient') {
          const valueData = {
            label: `${userProfile.firstName} ${userProfile.lastName}`,
            value: userProfile.email
          }
          return {
            ...item,
            value: valueData,
            error: false,
            helperText: ''
          }
        }
        return item
      })
    )
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
      // const updatedList = adGroupArray.map((item) => {
      //   const apiData = apiResultArr?.filter((itm) => itm.id === item.id)[0]?.value
      //   if (Array.isArray(apiData) && apiData.length > 0) {
      //     let apiLabel = ''
      //     if (apiData.length > 1) {
      //       apiLabel = apiData.map((data) => data.label)
      //     }
      //     return {
      //       ...item,
      //       value: apiData.length > 1 ? apiData : apiData[0],
      //       displayLabel: apiData.length > 1 ? apiLabel.join(', ') : apiData[0].label
      //     }
      //   }
      //   return item
      // })
      // setAdGroupArray(updatedList)
      setAdGroupArray((updatedList) =>
        updatedList.map((item) => {
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
      )
      setLoader(false)
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
              item.id,
              `/v0/governance/getdbUnityGroup?exactMatch=${true}&groupName=${item.value}`
            )
            break
          default:
            break
        }
      })
    }
  }, [draftAutocompleteValues])

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

  const configureLocation = (categoryValue) => {
    if (!isDraft && adGroupArray[2].value === categoryValue) {
      return
    }
    const updatedStepZero = response[0]?.substeps?.map((substep) => {
      const updatedSubstep = substep?.children?.map((item) => {
        if (
          [
            'endlocation', // dlpou
            'domain',
            'dataSecurityClass',
            'groupType',
            'groupscope',
            'approverLevel',
            'entitlement',
            'accessToPSI',
            'cyberarkregion',
            'accessioPlatformType',
            'accessioPrerequisiteRMPRoles',
            'dbagExtensionAttribute3',
            'groupScope',
            'dbSRSApproverLevel'
          ].includes(item.id)
        ) {
          const options = item.options.filter((option) => option.belongsto.includes(categoryValue))
          if (item.id === 'domain' && options.length === 1) {
            getLocationValues(categoryValue, options[0].value)
            setAdGroupArray((updatedList) =>
              updatedList.map((itm) => {
                if (itm.id === 'domain') {
                  return {
                    ...itm,
                    value: options[0].value,
                    displayLabel: options[0].label,
                    readOnly: true
                  }
                }
                return itm
              })
            )
          }
          const newItem = { ...item, options }
          return newItem
        }
        return item
      })
      return { ...substep, children: updatedSubstep }
    })

    const localStep = steps.map((item, index) =>
      index === 0 ? { ...item, substeps: updatedStepZero } : item
    )

    setSteps(localStep)
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

  const constructAdResponse = (obj, isAdmin) => {
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

    const refinedADObj = adGroupObj.map((childEnt) => {
      if (['description1', 'distinguishedName1', 'groupName'].includes(childEnt.id) && isAdmin) {
        return {
          ...childEnt,
          hidden: false
        }
      }
      return childEnt
    })

    // Logic to handle prepopulated default field
    // const refinedADObj = adGroupObj.map((childEnt) => {
    //   // Set information about recepient. This defaults to current logged in user

    //   const updatedProfileName =
    //     userProfile.firstName && userProfile.lastName
    //       ? `${userProfile.firstName} ${userProfile.lastName}`
    //       : ''
    //   if (childEnt.id === 'recipient') {
    //     // Set receipient option with same value
    //     const targetIndex = adaccessioGroupTypeObj.findIndex((data) => data.id === 'recipient')
    //     adaccessioGroupTypeObj[targetIndex].options.push({
    //       label: updatedProfileName,
    //       value: userProfile.email
    //     })
    //     return {
    //       ...childEnt,
    //       value: {
    //         label: updatedProfileName,
    //         value: userProfile.email
    //       }
    //     }
    //   }
    //   if (childEnt.id === 'accountStatus') {
    //     return {
    //       ...childEnt,
    //       displayLabel: ['512', '66048'].includes(childEnt.value) ? 'Enabled' : 'Disabled'
    //     }
    //   }
    //   return childEnt
    // })

    setAdGroupArray((updatedList) =>
      updatedList.map((item) => {
        if (['description1', 'distinguishedName1', 'groupName'].includes(item.id) && isAdmin) {
          return {
            ...item,
            hidden: false
          }
        }
        return item
      })
    )

    // Set account information object
    setAdGroupArray(refinedADObj)
    // Set prefetched autocomplete options
    setPrefetchedOptions(adaccessioGroupTypeObj)
    dispatch(setadAdGroupInitialState({ data: refinedADObj }))
    displaySummary([...new Set(adGroupSummaryObj)])
  }

  const draftInitialGroupDesc = (groupDesc, accessioType) => {
    const ObjectdescriptionIndex = descriptionStructure.findIndex(
      (field) => field.category === accessioType
    )
    let description = ''
    const descStructure = descriptionStructure[ObjectdescriptionIndex]
    const data = groupDesc.split(',')
    if (descStructure?.prefix !== '') {
      data.shift()
    }
    if (descStructure?.suffix !== '') {
      data.pop()
    }
    if (descStructure?.text?.length === data.length) {
      description = data.filter((item, index) => descStructure?.text[index] === 'description')
    }
    setDescriptionObject(() => ({
      ...descStructure,
      text: data
    }))
    return description[0]
  }

  const resetAdGroupDraftForm = (
    res,
    isUncategorized = false,
    adGroupTypeValue = null,
    adGroupSubTypeValue = null,
    accessioGroupTypeValue = null
  ) => {
    // adGroupApi.getCreateADGroup().then((resp) => {
    const autocompleteOptionValues = []
    let accessioType = ''
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
          if (accessioType !== '') {
            const ObjectdescriptionIndex = descriptionStructure.findIndex(
              (field) => field.category === accessioType
            )
            setDescriptionTemplateIndex(ObjectdescriptionIndex)
            setSamAccountObject(descriptionStructure[ObjectdescriptionIndex])
          }
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
              accessioType = isUncategorized ? accessioGroupTypeValue : matchedResult.value
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

              setBlockData(blocks)
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
                if (item.id === 'domain' && accessioType !== '') {
                  getLocationValues(accessioType, matchedResult.value)
                }
                let dropdownValue = {}
                if (!['', undefined].includes(matchedResult.value)) {
                  dropdownValue = steps[0].substeps.map(
                    (data) => data.children.filter((ele) => ele.id === item.id)[0]
                  )
                }
                const dropdownOptions = dropdownValue.filter((data) => data !== undefined)[0]
                  .options
                selectedValue =
                  dropdownOptions.length > 0
                    ? dropdownOptions.filter((data) => data.value === matchedResult.value)[0]
                    : ''
                if (['', undefined, null].includes(selectedValue)) {
                  selectedValue =
                    dropdownOptions.length > 0
                      ? dropdownOptions.filter((data) => data.label === matchedResult.value)[0]
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
              if (item.id === 'description') {
                const desc = draftInitialGroupDesc(matchedResult.value, accessioType)
                return {
                  ...item,
                  value: desc,
                  displayLabel: desc,
                  error: false,
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
          return item
      }
    })

    setAdGroupArray(categoryDisplayValue)
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
            response[0]?.substeps?.forEach((child) => {
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
      let ObjectTemplateIndex
      let ObjectdescriptionIndex
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
          configureLocation(newValue)
          setDefaultOptionFromDropDown(newValue)
          ObjectTemplateIndex = samAccountDataStructure.findIndex(
            (field) => field.category === newValue
          )
          ObjectdescriptionIndex = descriptionStructure.findIndex(
            (field) => field.category === newValue
          )
          setsamAccountObjectTemplateIndex(ObjectTemplateIndex)
          setSamAccountObject(samAccountDataStructure[ObjectTemplateIndex])
          setDescriptionTemplateIndex(ObjectdescriptionIndex)
          setDescriptionObject(descriptionStructure[ObjectdescriptionIndex])
          break

        default:
          break
      }
      if (noActionRequired) {
        return
      }
      setUpdatedProfileDetails()
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
      if (
        [
          'digitalIdentity',
          'role',
          'safeName',
          'serverName',
          'enterpriseServices',
          'groupNameText',
          'categoryReference',
          'dLPEnvironment',
          'dLPGroupRole',
          'versionIterationofGroup',
          'vRMID',
          'projectName',
          'productionUATorDEV',
          'applicationName',
          'groupRole',
          'vendorteamName',
          'samLocation',
          'samDbagApplicationID',
          'RobotBusinessDescription',
          'dbSRSApproverLevel'
        ].includes(elementModified)
      ) {
        prepareSamAccountString({ id: elementModified, value: newValue, helperText: '' })
      }
      if (['approverLevel'].includes(elementModified)) {
        prepareSamAccountString({ id: elementModified, value: valueLabel, helperText: '' })
      }
      if (
        [
          'samDbagApplicationID',
          'role',
          'description',
          'dbagInfrastructureID',
          'dbagApplicationID',
          'groupNameText',
          'approverLevel',
          'RobotBusinessDescription',
          'serverName',
          'cyberarkregion',
          'dbSRSApproverLevel',
          'categoryReference',
          'samAccount',
          'versionIterationofGroup',
          'projectName',
          'group',
          'vendorteamName',
          'groupRole',
          'info',
          'RobotBusinessDescription'
        ].includes(elementModified)
      ) {
        prepareGroupDescriptionString({ id: elementModified, value: newValue, helperText: '' })
      }
      if (
        ['samDbagApplicationID', 'dbagInfrastructureID', 'dbagApplicationID'].includes(
          elementModified
        )
      ) {
        prepareGroupDescriptionString({
          id: elementModified,
          value: valueObj.label,
          helperText: ''
        })
      }
      if (elementModified === 'entitlement') {
        if (newValue === 'Other - please specify') {
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
        } else {
          setAdGroupArray((updatedList) =>
            updatedList.map((item) => {
              if (item.id === 'entitlementOther') {
                return {
                  ...item,
                  hidden: true,
                  error: false,
                  helperText: ''
                }
              }
              return item
            })
          )
        }
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
        const result = await itaoAndItaoDelegateResponse(newValue)
        const clonedOwnerArray = groupOwner.map((owner) => {
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
        serGroupOwner(clonedOwnerArray)
        setAdGroupArray((updatedList) =>
          updatedList.map((item) => {
            if (item.id === 'dbagIMSAuthContact') {
              return {
                ...item,
                value: result.itao[0] ? result.itao[0] : '',
                displayLabel: result.itao[0]?.label ? result.itao[0]?.label : '',
                error: false,
                helperText: ''
              }
            }
            if (item.id === 'dbagIMSAuthContactDelegate') {
              return {
                ...item,
                value: result.itaoDelegate[0] ? result.itaoDelegate[0] : '',
                displayLabel: result.itaoDelegate[0]?.label ? result.itaoDelegate[0]?.label : '',
                error: false,
                helperText: ''
              }
            }
            return item
          })
        )
      }
      if (['dbagIMSAuthContact', 'dbagIMSAuthContactDelegate'].includes(elementModified)) {
        const groupOwnerValue = []
        if (role && CheckAdmin(role)) {
          const adminUser = profile?.mail ? profile?.mail : ''
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
        serGroupOwner(clonedOwnerArray)
      }
      if (elementModified === 'domain') {
        getLocationValues(accessioGroupType, newValue)
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

      if (['samLocation', 'endlocation', 'cyberarkregion', 'dlpou'].includes(elementModified)) {
        const distName = await getDNValues(accessioGroupType, newValue)
        if (distName.length) {
          setAdGroupArray((updatedList) =>
            updatedList.map((item) => {
              if (item.id === 'distinguishedName1') {
                return {
                  ...item,
                  value: distName[0],
                  displayLabel: distName[0].label
                }
              }
              return item
            })
          )
        }
      }

      if (elementModified === 'groupName') {
        const updatedList = adGroupArray.map((data) => {
          if (data.id === 'samAccount') {
            return { ...data, value: newValue, displayLabel: valueLabel }
          }
          return data
        })
        setAdGroupArray(updatedList)
      }
      if (elementModified === 'description1') {
        const updatedList = adGroupArray.map((data) => {
          if (data.id === 'compiledGroupDescription') {
            return { ...data, value: newValue, displayLabel: valueLabel }
          }
          return data
        })
        setAdGroupArray(updatedList)
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

  const validateForm = async () => {
    let isValid = true
    let samAccount = ''
    isValidSamAccount = true
    if (activeSubStep === 0) {
      samAccount = await validateGroupData()
    }
    // before validation any step clear the last step error state
    const updatedAdGroupArray = adGroupArray.map((item) => {
      if (
        (typeof item.value === 'string' && item.value?.trim() === '') ||
        (Array.isArray(item.value) && item.value.length === 0)
      ) {
        return { ...item, error: false, helperText: '' }
      }
      if (item.id === 'samAccount') {
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
    if (
      activeSubStep === 0 &&
      isValid &&
      samAccount !== '' &&
      (!isValidSamAccount || samAccount.length > 64)
    ) {
      isValid = false
      let message = `${groupNameErrorMsg}`
      if (samAccount.length > 64) {
        message = `${groupNameLengthErrorMsg} (${samAccount})`
      }
      dispatch(
        updateReviewNotificationMessage({
          type: 'Error',
          message
        })
      )
    }
    if (activeSubStep !== false && steps[activeStep].substeps) {
      steps[activeStep].substeps[activeSubStep].children.forEach((child) => {
        if (child.requiredField) {
          adGroupArray.forEach((eleData) => {
            if (
              isValid &&
              child.id === eleData.id &&
              ((typeof eleData.value === 'string' && eleData.value?.trim() === '') ||
                (Array.isArray(eleData.value) && eleData.value.length === 0))
            ) {
              if (child.relatedTo && child.relatedTo.includes(adGroupArray[2].value)) {
                isValid = false
              } else if (!child.relatedTo) {
                isValid = false
              }
            } else if (
              child.id === eleData.id &&
              eleData.error &&
              child.relatedTo &&
              child.relatedTo.includes(adGroupArray[2].value)
            ) {
              isValid = false
            } else if (eleData.id === 'dbagProcessingdata' && eleData.error) {
              isValid = false
            }
          })
        } else if (
          child.id === 'entitlementOther' &&
          child.relatedTo &&
          child.relatedTo.includes(adGroupArray[2].value)
        ) {
          const dbagEntitlement = adGroupArray.filter((value) => value.id === 'entitlement')
          if (
            Array.isArray(dbagEntitlement) &&
            dbagEntitlement[0]?.value === 'Other - please specify'
          ) {
            setAdGroupArray((updatedList) =>
              updatedList.map((item) => {
                if (
                  item.id === 'entitlementOther' &&
                  (item.value === null || item.value?.trim() === '')
                ) {
                  isValid = false
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
        }
      })
    } else {
      steps[activeStep].children.forEach((child) => {
        if (child.requiredField) {
          adGroupArray.forEach((eleData) => {
            if (isValid && child.id === eleData.id) {
              // Following condition is for empty value check
              if (
                (Array.isArray(eleData.value) && eleData.value.length === 0) ||
                (typeof eleData.value === 'string' && eleData.value?.trim() === '')
              ) {
                if (child.relatedTo && child.relatedTo.includes(adGroupArray[2].value)) {
                  isValid = false
                } else if (!child.relatedTo) {
                  isValid = false
                }
              }
              // Following condition is for incorrect value eg. special characters in the Business Justification
              else if (eleData.error && eleData.value) {
                isValid = false
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
        } else if (
          child.id === 'entitlementOther' &&
          child.relatedTo &&
          child.relatedTo.includes(adGroupArray[2].value)
        ) {
          const dbagEntitlement = adGroupArray.filter((value) => value.id === 'entitlement')
          if (
            Array.isArray(dbagEntitlement) &&
            dbagEntitlement[0]?.value === 'Other - please specify'
          ) {
            setAdGroupArray((updatedList) =>
              updatedList.map((item) => {
                if (
                  item.id === 'entitlementOther' &&
                  (item.value === null || item.value?.trim() === '')
                ) {
                  isValid = false
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
        }
      })
    }
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

  // used this function to display recipient value in summary page
  const displaySummaryValue = (consition, then, otherise) => (consition ? then : otherise)

  const checkUniqueRequest = (dnValue) => {
    const distinguishedName = !['', undefined, null].includes(dnValue)
      ? `CN=${valueFinder('samAccount')},${dnValue}`.toUpperCase()
      : ''
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
                  targetValue: distinguishedName
                }
              },
              {
                operator: 'EQUALS',
                operand: {
                  targetName: 'request.common.distinguishedName',
                  targetValue: distinguishedName
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

  const constructSummaryPage = async () => {
    const updatedList = adGroupArray.map((item) => {
      if (item.id === 'compiledGroupDescription') {
        const data = item.value.split(',')
        const updateddata = data.map((element) => {
          if (['dbagInfrastructureID', 'samAccount', 'projectName'].includes(element.trim())) {
            return ' '
          }
          return element
        })
        return {
          ...item,
          value: updateddata.join(','),
          displayLabel: updateddata.join(',')
        }
      }
      return item
    })

    setAdGroupArray(updatedList)
    const encodedAccessioGroupType = encodeURIComponent(accessioGroupType)
    const encodedLocation = encodeURIComponent(
      valueFinder('endlocation') ||
        valueFinder('samLocation') ||
        valueFinder('cyberarkregion') ||
        valueFinder('dlpou')
    )
    const res = await adGroupApi.getDN(
      `/v0/governance/getDN?groupType=${encodedAccessioGroupType}&location=${encodedLocation}&domain=${valueFinder(
        'domain'
      )}&exactMatch=true`
    )
    setDnName(res[0]?.value ? res[0].value : '')
    // check for the unique Record
    // setUniqueErroMessage('')
    checkUniqueRequest(res[0]?.value ? res[0].value : '')
    const updatedList1 = [...summaryData].map((item) => {
      const targetChildren = updatedList.filter((account) => {
        if (
          (!account.relatedTo || account.relatedTo.includes(accessioGroupType)) &&
          account.category === item.mapping
        ) {
          if (
            account.id === 'description' ||
            account.id === 'dwsPrivate' ||
            account.id === 'clientPrivate' ||
            account.id === 'dbPrivate' ||
            account.id === 'groupName' || // ALM1923 Removed  account.id === 'distinguishedName1'
            account.id === 'description1' ||
            (account.id === 'distinguishedName1' && role && !CheckAdmin(role))
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
    setSummaryData(updatedList1)
  }

  const replaceSAMString = () => {
    const replacedString = samAccountObject.text.map((value) =>
      value === 'projectName' ? '' : value
    )

    setSamAccountObject((samAccountdata) => ({
      ...samAccountdata,
      text: replacedString
    }))
  }

  const handleNext = async () => {
    clearExtraSpaces()
    // check specific Acceccio type SAM account
    if (
      accessioGroupType ===
        'Identity Based Access Control (IBAC) - Application Group - Application Authorization' &&
      samAccountObject.text[2] === 'projectName'
    ) {
      replaceSAMString()
    }
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
        if (steps[blockData[newActiveStep]].substeps) {
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
    const index = steps.findIndex((step) => toCamelCase(step.titleId) === eStep)
    setActiveStep(index)
    if (index === 0) {
      setActiveSubStep(0)
    }
    setActiveBlock(blockData[index])
  }

  const handleReset = () => {
    resetAllStates()
  }

  const handleConfirm = () => {
    resetAllStates()
    history.push('/dashboard')
  }

  const displayStepperBlock = (blocknumber) => blocknumber === activeBlock
  const displaySubStepperBlock = (subblocknumber, parentIndex) =>
    parentIndex === activeStep && subblocknumber === activeSubStep

  const handleComplete = (draftValue) => {
    if (isUniqueRequest) {
      const adGroupDetails = {}
      setSaveDraft(draftValue)
      const commonObject = {
        applicationName: `${applicationNamePrefix}${valueFinder('domain')}`,
        operation: 'Create',
        category: 'AD Group',
        requestorMail: userProfile.email,
        isDraft: draftValue,
        requestJustification: '',
        Accessio_Request_No: ''
      }
      const groupDetailsObject = {}
      const distinguishedName = `CN=${valueFinder('samAccount')},${dnName}`.toUpperCase() // distinguished name of the group = 'CN= + SAM + API of DN'
      /* eslint no-underscore-dangle: 0 */
      groupDetailsObject.__NAME__ = distinguishedName
      groupDetailsObject.displayName = valueFinder('samAccount').toUpperCase()
      groupDetailsObject.accessioGroupType = accessioGroupType
      groupDetailsObject.distinguishedName = distinguishedName
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
              case 'dbagApplicationID':
              case 'samdbagApplicationID':
              case 'dbagInfrastructureID':
                if (Array.isArray(o.value)) {
                  groupDetailsObject[o.name] = o.value.map((itm) => itm.value)
                } else {
                  groupDetailsObject[o.name] = [
                    typeof o.value === 'object' ? o.value.value : o.value
                  ]
                }
                break
              case 'dbagIMSAuthContact':
              case 'dbagIMSAuthContactDelegate':
                groupDetailsObject[o.name] = typeof o.value === 'object' ? o.value.value : o.value
                break
              case 'endlocation':
              case 'approverLevel':
              case 'dLPEnvironment':
              case 'location':
                groupDetailsObject[o.name] = o.displayLabel
                break
              case 'compiledGroupDescription':
                groupDetailsObject.description = [
                  typeof o.value === 'object' ? o.value.value : o.value
                ]
                break
              case 'description':
                break
              case 'paths':
                groupDetailsObject[o.id] = o.value
                break
              case 'dbagEntitlement':
                groupDetailsObject[o.name] =
                  valueFinder('entitlement') === 'Other - please specify'
                    ? valueFinder('entitlementOther')
                    : valueFinder('entitlement')
                break
              case 'dbagDataPrivClass':
                groupDetailsObject.dbagExtensionAttribute6 = `${valueFinder(
                  'dwsPrivate'
                )}${valueFinder('clientPrivate')}${valueFinder('dbPrivate')}`
                groupDetailsObject.dbagDataPrivClass = o.value

                break
              case 'dbagExternalProvider':
                if (o.value === 'AZR') {
                  groupDetailsObject.dbagExternalProvider = [o.value]
                } else {
                  groupDetailsObject.dbagExternalProvider = o.value.split('#')
                }

                break
              default:
                if (o.name === 'cn') {
                  groupDetailsObject[o.name] =
                    typeof o.value === 'object'
                      ? o.value.value.toUpperCase()
                      : o.value.toUpperCase()
                } else {
                  if (
                    o.id === 'dwsPrivate' ||
                    o.id === 'clientPrivate' ||
                    o.id === 'dbPrivate' ||
                    o.id === 'description1' ||
                    o.id === 'distinguishedName1' ||
                    o.id === 'groupName'
                  ) {
                    break
                  }
                  groupDetailsObject[o.name] = typeof o.value === 'object' ? o.value.value : o.value
                }

                break
            }
          }
        }
      })
      adGroupDetails.common = commonObject

      adGroupDetails.common.groupDetails = groupDetailsObject
      setLoader(true)
      if (isDraft && draftId) {
        draftsApi
          .submitDraft(adGroupDetails, draftId)
          .then((res) => {
            if (res?.response?.status === 200 || res?.status === 200) {
              setNotification({
                description: 'drafts.submit.success',
                variant: 'success'
              })
            } else {
              setNotification({
                description: 'draft.error.message',
                variant: 'error'
              })
            }
          })
          .catch(() => {
            setNotification({
              description: 'draft.error.message',
              variant: 'error'
            })
          })
      } else {
        adGroupApi
          .submitAdGroup(adGroupDetails)
          .then((res) => {
            if (res?.status === 200) {
              setNotification({
                description: draftValue ? 'draft.success.message' : 'modify.group.success.message',
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
      }
    } else {
      // setUniqueErroMessage(uniqueErrorMessage)
      const message = uniqueErrorMessage
      dispatch(
        updateReviewNotificationMessage({
          type: 'Error',
          message
        })
      )
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
      default:
        return '/requests'
    }
  }

  const breadcrumbsAction = () => {
    switch (typeModule) {
      case 'Drafts':
        return [
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          { label: translate('drafts.header.title'), url: '/drafts' }
        ]
      default:
        return [
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          { label: translate('create.ADAccount.requests'), url: '/requests' },
          { label: translate('create.ADGroup.title'), url: '' }
        ]
    }
  }
  useEffect(() => {
    if (notification.description && ['success', 'error'].includes(notification.variant)) {
      setTimeout(() => {
        // Set empty notification after timeout
        if (notification.variant === 'success') {
          setLoader(false)
          history.push(saveDraft ? '/drafts' : `/history/requestHistory`)
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
    if ((adGroupType !== '' && !isDraft) || (adGroupType !== '' && isUncategoriesFlow && isDraft)) {
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
  }, [adGroupType, isUncategoriesFlow])

  useEffect(() => {
    if (
      (adGroupSubType !== '' && !isDraft) ||
      (adGroupSubType !== '' && isUncategoriesFlow && isDraft)
    ) {
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
              configureLocation(res[0].value)
              const ObjectTemplateIndex = samAccountDataStructure.findIndex(
                (field) => field.category === res[0].value
              )
              setsamAccountObjectTemplateIndex(ObjectTemplateIndex)
              setSamAccountObject(samAccountDataStructure[ObjectTemplateIndex])
              const ObjectdescriptionIndex = descriptionStructure.findIndex(
                (field) => field.category === res[0].value
              )
              setDescriptionTemplateIndex(ObjectdescriptionIndex)
              setDescriptionObject(descriptionStructure[ObjectdescriptionIndex])
            }
          }
        })
    }
  }, [adGroupSubType, isUncategoriesFlow])
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
          if (item.id === 'groupName') {
            return {
              ...item,
              value:
                (samAccountObject.prefix ? `${samAccountObject.prefix}-` : '') +
                samAccountObject.text.filter(Boolean).join('-') +
                (samAccountObject.suffix ? `${samAccountObject.suffix}-` : ''),
              displayLabel:
                (samAccountObject.prefix ? `${samAccountObject.prefix}-` : '') +
                samAccountObject.text.filter(Boolean).join('-') +
                (samAccountObject.suffix ? `${samAccountObject.suffix}-` : '')
            }
          }
          return item
        })
      )
    }
  }, [samAccountObject.prefix, samAccountObject.suffix, samAccountObject.text])

  // TODO :

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
          if (item.id === 'description1') {
            return {
              ...item,
              value:
                (descriptiontObject.prefix ? `${descriptiontObject.prefix}, ` : '') +
                descriptiontObject.text.filter(Boolean).join(', ') +
                (descriptiontObject.suffix ? `${descriptiontObject.suffix}, ` : ''),
              displayLabel:
                (descriptiontObject.prefix ? `${descriptiontObject.prefix}, ` : '') +
                descriptiontObject.text.filter(Boolean).join(', ') +
                (descriptiontObject.suffix ? `${descriptiontObject.suffix}, ` : '')
            }
          }
          return item
        })
      )
    }
  }, [descriptiontObject])

  useEffect(() => {
    if (!isDraft) {
      setUpdatedProfileDetails()
    }
  }, [userProfile])

  const setOptionsForGroupAndSubTypeAndAccessioType = (res) => {
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

        default:
          break
      }
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
    if (isDraft && steps.length > 0) {
      setLoader(true)
      let selected
      adGroupApi.getAdGroupType('/v0/governance/getADGroupType').then((response1) => {
        setAdGroupDataArray([{ id: 'adGroupType', options: response1 }])
        categoryAdGroupArray.push({ id: 'adGroupType', options: response1 })
        selected = selectedGroup?.draftData?.filter((resp) => resp.id === draftId)
        adGroupApi.setGroupRecord(selected[0]).then((res) => {
          if (res) {
            setOptionsForGroupAndSubTypeAndAccessioType(res)
            let isResetFlag = validateUncategoriersRequest('adGroupType')
            if (isResetFlag) {
              // reset form here with adGroupType
              resetAdGroupDraftForm(res)
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
                      resetAdGroupDraftForm(res, true, responseGroupType.adGroupType)
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
                            categoryAdGroupArray.push({ id: 'accessioGroupType', options: res2 })
                            setAdGroupDataArray(categoryAdGroupArray)
                            isResetFlag = validateUncategoriersRequest('accessioGroupType')
                            if (isResetFlag) {
                              // reset form here with accessioGroupType
                              setIsUncategoriesFlow(true)
                              resetAdGroupDraftForm(
                                res,
                                true,
                                responseGroupType.adGroupType,
                                responseGroupType.adGroupSubType
                              )
                              setAccessioGroupType('')
                            } else {
                              resetAdGroupDraftForm(
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
      })
    }
  }, [selectedGroup, steps])

  useEffect(() => {
    adGroupApi.getCreateADGroup().then((res) => {
      setSamAccountDataStructure(res.SAMAccountDataStucture)
      setDescriptionStructure(res.descriptionStructure)
      let isAdmin = false
      if (role && CheckAdmin(role)) {
        isAdmin = true
      }

      constructAdResponse(res.steps, isAdmin)
      setCategoryToLabel(res.labelToCategory)
      setSteps(res.steps)
      setResponse(res.steps)
      // changes to load select when Ad group type is not selected
      // const updatedStepZero = res.steps[0]?.children?.map((item) => {
      //   if (item.id === 'adGroupSubType') {
      //     const options = item.options.filter((option) => option.value.includes('Select'))
      //     const newItem = { ...item, options }
      //     return newItem
      //   }
      //   return item
      // })

      // const localStep = res.steps.map((item, index) =>
      //   index === 0 ? { ...item, substeps: updatedStepZero } : item
      // )

      // setSteps(localStep)

      // End of test2
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
    adGroupApi.getAdGroupType('/v0/governance/getADGroupType').then((res) => {
      if (res) {
        setAdGroupDataArray([
          { id: 'adGroupType', options: res?.sort((a, b) => a.value.localeCompare(b.value)) }
        ])
      }
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
    let clonedOwnerArray = initialOwner
    if (role && CheckAdmin(role)) {
      const adminUser = profile?.mail ? profile?.mail : ''
      if (adminUser !== '') {
        const groupOwnerArray = []
        groupOwnerArray.push(adminUser)
        clonedOwnerArray = clonedOwnerArray.map((owner) => ({
          ...owner,
          value: groupOwnerArray
        }))
        serGroupOwner(clonedOwnerArray)
      }
    }
  }, [])
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
            {translate('create.ADGroup.title')}
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
              <Grid container spacing={index === 1 ? 8 : 12}>
                {item.children && (
                  <Grid item xs={index === 1 ? 8 : 12}>
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
                            index === 1 ? 10 : columnSX,
                            groupOwner,
                            '',
                            '',
                            '',
                            '',
                            adGroupArray
                          )
                        )}
                    </Grid>
                  </Grid>
                )}
                {/* If sub stepper exist the above map will not generate any output. The sub stepper will get generated by the below code */}
                {item.substeps && (
                  <Grid item xs={12}>
                    {activeSubStep + 1} {translate('comment.of')} {totalSubSteps}{' '}
                    {translate('comment.steps')}
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
                            <h3>{translate(`${substep.heading}`)}</h3>
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
                                    index === 1 ? 10 : columnSX,
                                    groupOwner,
                                    '',
                                    '',
                                    '',
                                    '',
                                    adGroupArray
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
              {/* <h4 style={{ color: 'red' }}>{uniqueErroMessage}</h4> */}
              <h2>{translate(item.heading)}</h2>

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
                        {translate(categoryToLabel[sitem.heading])}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        backgroundColor: theme === 'dark' ? '#1A2129' : '#FFF',
                        padding: '10x 8px'
                      }}
                    >
                      <Grid container spacing={4} style={{ marginTop: i === 1 ? '3px' : '0px' }}>
                        {sitem.children &&
                          sitem.children.map((element) => (
                            <>
                              {element.value &&
                                [0].includes(i) &&
                                element.id !== 'pSIDescription' && (
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
                                      <p style={{ overflowWrap: ' break-word' }}>
                                        {element.displayLabel
                                          ? displaySummaryValue(
                                              element.label === 'Group Name',
                                              element.displayLabel.toUpperCase(),
                                              element.displayLabel
                                            )
                                          : displaySummaryValue(
                                              typeof element.value === 'object',
                                              element.value.value,
                                              element.value
                                            )}
                                      </p>
                                    </Grid>
                                  </Grid>
                                )}
                              {element.value &&
                                ([1].includes(i) ||
                                  ([0].includes(i) && element.id === 'pSIDescription')) && (
                                  /* eslint-disable */
                                  <div style={{ paddingLeft: '35px', width: '100%' }}>
                                    <p>
                                      <strong>{translate(element.label)} : </strong>
                                    </p>
                                    <p>
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: element.displayLabel
                                            ? element.displayLabel
                                            : displaySummaryValue(
                                                typeof element.value === 'object',
                                                element.value.value,
                                                element.value
                                              )
                                        }}
                                      />
                                    </p>
                                  </div>
                                )}
                            </>
                          ))}
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

export default CreateADGroup
