import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import FormHelperText from '@mui/material/FormHelperText'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Grid, FormControl } from '@mui/material'
import { isEqual } from 'lodash'
import Breadcrumb from 'components/breadcrumb'
import formGenerator from 'components/formGenerator'
import translate from 'translations/translate'
import {
  checkActiveApproverValidation,
  applicationNamePrefix,
  checkUniqueRequestForMembership,
  checkComplianceStatusValidation,
  checkProvisioningValidation
} from 'helpers/utils'
import * as Styled from '../../create/style'
import { updateReviewNotificationMessage } from '../../../../../redux/review/review.action'
import { selectprofileDetails } from '../../../../../redux/profile/profile.selector'
import { selectDraftsItems } from '../../../../../redux/drafts/drafts.selector'
import Loading from '../../../../../components/loading'

import * as accountAPI from '../../../../../api/accountManagement'
import * as draftsApi from '../../../../../api/drafts'

const AddOrRemoveServer = () => {
  const theme = useTheme()

  const [activeStep, setActiveStep] = useState(0)
  const [activeBlock, setActiveBlock] = useState(0)
  const [completed, setCompleted] = useState({})
  const [stepperMeta, setStepperMeta] = useState([])
  const [accounts, setSelectedAccounts] = useState([])
  const [groups, setSelectedGroups] = useState([])
  const [accountArray, setAccountArray] = useState([])
  const [summaryArray, setSummaryArray] = useState([])
  const [justification, setJustification] = useState('')
  const [errors, setErrors] = useState([])
  const [isDisabled, setIsDisbaled] = useState(false)
  const [summaryError, setSummaryError] = useState('')
  const [notification, setNotification] = useState({ description: '', variant: '' })
  const [saveDraft, setSaveDraft] = useState(false)
  const [toggleFormServer, setToggleFormServer] = useState(false)

  const [loader, setLoader] = useState(false)
  const [open, setOpen] = useState(false)
  const [justificationError, setJustificationError] = useState(false)
  const [apiResponse, setApiResponse] = useState([])
  const location = useLocation()
  const typeModule = localStorage.getItem('component')
  const selectedGroup = typeModule === 'Drafts' ? useSelector(selectDraftsItems) : []
  const draftId = location && location?.search ? location?.search.split('=').pop() : ''
  const [draftAutocompleteValues, setDraftAutocompleteValues] = useState([])

  const dispatch = useDispatch()
  const history = useHistory()
  const userInfo = useSelector(selectprofileDetails)

  const clickedAddArray = useRef([])
  const clickedAddGroupArray = useRef([])
  const groupName =
    location && location?.search && location?.search.includes('groupName')
      ? location?.search.split('=').pop()
      : ''

  const initialGroupMembershipData = [
    { id: 'accounts', value: [] },
    { id: 'groups', value: [] },
    { id: 'requestType', value: 'Add' }
  ]
  const [groupMembershipData, setGroupMembershipData] = useState(initialGroupMembershipData)
  const validationErrorMessages = []
  const mandatoryErrorMsg = translate('create.ADGroup.mandatoryErrorMessage')
  const maxLimitAccountErrorMessage = translate('addGroupMembership.maxLimitServertErrorMessage')
  const maxLimitGroupErrorMessage = translate('addGroupMembership.maxLimitGroupErrorMessage')
  const maxLimitDraftError = translate('addGroupServer.drafts.maxLimit')
  const addNoGroupAndAccountError = translate('addserverMembership.addNoGroupAndServerError')
  const removalNoGroupAndAccountError = translate(
    'addserverMembership.removalNoGroupAndServerError'
  )
  const failedNotification = translate('serverMembership.failureNotification')
  const addSuccessNotification = translate('serverMembership.successNotificationforAdd')
  const removeSuccessNotification = translate('serverMembership.successNotificationforRemove')
  const draftSuccessNotification = translate('draft.success.message')
  const draftErrorNotification = translate('draft.error.message')
  const draftSomeErrorNotification = translate('draft.server.error.Success.message')

  const uniqueReqError = translate('request.unique.errormessage')

  const addNoComplianceStatusValidationMessage1 = translate(
    'addGroupMembership.addNoComplianceStatusValidationMessage1'
  )
  const addNoComplianceStatusValidationMessage2 = translate(
    'addGroupMembership.addNoComplianceStatusValidationMessage2'
  )
  const removalNoComplianceStatusValidationMessage1 = translate(
    'addGroupMembership.removalNoComplianceStatusValidationMessage1'
  )
  const removalNoComplianceStatusValidationMessage2 = translate(
    'addGroupMembership.removalNoComplianceStatusValidationMessage2'
  )
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
  const isActiveApprover1 = translate('addGroupMembership.isActiveApprover1')
  const isActiveApprover2 = translate('addGroupMembership.isActiveApprover2')

  const isActiveApprover3 = translate('addGroupMembership.isActiveApprover3')

  const isActiveApprover4 = translate('addGroupMembership.isActiveApprover4')

  const RemoveisActiveApprover1 = translate('addGroupMembership.RemoveisActiveApprover1')
  const RemoveisActiveApprover2 = translate('addGroupMembership.RemoveisActiveApprover2')

  const RemoveisActiveApprover3 = translate('addGroupMembership.RemoveisActiveApprover3')

  const RemoveisActiveApprover4 = translate('addGroupMembership.RemoveisActiveApprover4')

  const addProvisionValidationMessage1 = translate(
    'addGroupMembership.addProvisionValidationMessage1'
  )
  const addProvisionValidationMessage2 = translate(
    'addGroupMembership.addProvisionValidationMessage2'
  )
  const removalProvisionValidationMessage1 = translate(
    'addGroupMembership.removalProvisionValidationMessage1'
  )
  const removalProvisionValidationMessage2 = translate(
    'addGroupMembership.removalProvisionValidationMessage2'
  )

  const resetAllStates = () => {
    setActiveStep(0)
    setActiveBlock(0)
    setCompleted({})
    setStepperMeta([])
    setSelectedAccounts([])
    setSelectedGroups([])
    setAccountArray([])
    setSummaryArray([])
    setJustification('')
    setErrors([])
    setIsDisbaled(false)
    setSummaryError('')
    setNotification({ description: '', variant: '' })
    setSaveDraft(false)
    setLoader(false)
    setOpen(false)
    setJustificationError(false)
    setApiResponse([])
  }

  const totalSteps = () => stepperMeta.length
  const isLastStep = () => activeStep === totalSteps() - 1
  const completedSteps = () => Object.keys(completed).length
  const displayStepperBlock = (blocknumber) => blocknumber === activeBlock
  const allStepsCompleted = () => completedSteps() === totalSteps()

  const handleReset = () => {
    resetAllStates()
  }
  const handleCancel = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleConfirm = () => {
    resetAllStates()
    history.push('/dashboard')
  }
  const handleBack = () => {
    const newPrevStep = activeStep - 1
    setActiveStep(newPrevStep)
    setActiveBlock(newPrevStep)
  }
  const valueFinder = (fieldId) => {
    const targetIndex = accountArray.findIndex((field) => field.id === fieldId)
    return accountArray[targetIndex]?.value ? accountArray[targetIndex]?.value : []
  }

  const validateForm = () => {
    let isValid = true
    if (activeStep === 0) {
      const updatedList = accountArray.map((item) => {
        if (item.requiredField === true) {
          switch (item.id) {
            case 'serverType':
              if (
                [null, undefined, ''].includes(valueFinder('serverTable')) ||
                valueFinder('serverTable').length === 0
              ) {
                setToggleFormServer(true)

                isValid = false
                return {
                  ...item,
                  error: true,
                  helperText: mandatoryErrorMsg
                }
              }
              if (valueFinder('serverTable').length > 7) {
                isValid = false
                return {
                  ...item,
                  error: true,
                  helperText: maxLimitAccountErrorMessage
                }
              }
              return item
            case 'groupTypeForServer':
              if (
                [null, undefined, ''].includes(valueFinder('groupTable')) ||
                valueFinder('groupTable').length === 0
              ) {
                setToggleFormServer(true)

                isValid = false
                return {
                  ...item,
                  error: true,
                  helperText: mandatoryErrorMsg
                }
              }
              if (valueFinder('groupTable').length > 7) {
                isValid = false
                return {
                  ...item,
                  error: true,
                  helperText: maxLimitGroupErrorMessage
                }
              }
              return item

            default:
              return item
          }
        }
        return item
      })
      setAccountArray(updatedList)
    }
    return isValid
  }

  const constructSummaryPage = () => {
    const summaryResp = []

    groups.forEach((singleGroup) => {
      let Obj = {}
      Obj = {
        groupName: singleGroup.groupName,
        groupDomain: singleGroup.domain,
        dn: singleGroup.dn,
        members: accounts
      }
      summaryResp.push(Obj)
    })
    setSummaryArray(summaryResp)
  }

  const apiValidation = async () => {
    let isValid = true
    // const selectedAccounts = valueFinder('serverTable')
    const selectedGroups = valueFinder('groupTable')

    // eslint-disable-next-line no-restricted-syntax
    for (const group of selectedGroups) {
      const groupValidationErrorMessage = []
      //  1. Compliance Status validation
      if (!group?.grpComplaint) {
        isValid = false
        groupValidationErrorMessage.push(
          valueFinder('requestType') === 'Add'
            ? `${addNoComplianceStatusValidationMessage1} ${group?.label} ${addNoComplianceStatusValidationMessage2} ${group?.dbagIMSAuthContact} ${addNoApproverValidationMessage3} :  ${group?.dbagIMSAuthContactDelegate} ${addNoApproverValidationMessage4}`
            : `${removalNoComplianceStatusValidationMessage1} ${group?.label} ${removalNoComplianceStatusValidationMessage2} ${group?.dbagIMSAuthContact} ${removalNoApproverValidationMessage3} : ${group?.dbagIMSAuthContactDelegate} ${removalNoApproverValidationMessage4}`
        )
      }

      let isActiveApprover = false
      const approvers =
        group?.approvers && group?.approvers.split(',').length > 0 ? group.approvers.split(',') : []

      // 2.No approver validation
      if (approvers?.length === 0) {
        isValid = false
        groupValidationErrorMessage.push(
          valueFinder('requestType') === 'Add'
            ? `${addNoApproverValidationMessage1} ${
                group?.label
              } ${addNoApproverValidationMessage2} ${
                group?.dbagIMSAuthContact && group?.dbagIMSAuthContact !== '' && ':'
              }  ${group?.dbagIMSAuthContact} ${addNoApproverValidationMessage3} ${
                group?.dbagIMSAuthContactDelegate && group?.dbagIMSAuthContactDelegate !== '' && ':'
              } ${group?.dbagIMSAuthContactDelegate} ${addNoApproverValidationMessage4}`
            : `${removalNoApproverValidationMessage1} ${
                group?.label
              } ${removalNoApproverValidationMessage2} ${
                group?.dbagIMSAuthContact && group?.dbagIMSAuthContact !== '' && ':'
              } ${group?.dbagIMSAuthContact} ${removalNoApproverValidationMessage3} ${
                group?.dbagIMSAuthContactDelegate && group?.dbagIMSAuthContactDelegate !== '' && ':'
              } ${group?.dbagIMSAuthContactDelegate} ${removalNoApproverValidationMessage4}`
        )
      }
      // 3. Valid approvers API check

      if (approvers?.length > 0) {
        // eslint-disable-next-line no-restricted-syntax
        for (const approver of approvers) {
          if (!isActiveApprover) {
            // eslint-disable-next-line no-await-in-loop
            isActiveApprover = await checkActiveApproverValidation(approver)
          }
        }
        if (!isActiveApprover) {
          isValid = false
          groupValidationErrorMessage.push(
            valueFinder('requestType') === 'Add'
              ? `${isActiveApprover1} ${group?.groupName} ${isActiveApprover2} ${
                  group?.dbagIMSAuthContact && group?.dbagIMSAuthContact !== '' && ':'
                } ${group?.dbagIMSAuthContact} ${isActiveApprover3}  ${
                  group?.dbagIMSAuthContactDelegate &&
                  group?.dbagIMSAuthContactDelegate !== '' &&
                  ':'
                } ${group?.dbagIMSAuthContactDelegate} ${isActiveApprover4}`
              : `${RemoveisActiveApprover1} ${group?.groupName} ${RemoveisActiveApprover2} ${
                  group?.dbagIMSAuthContact && group?.dbagIMSAuthContact !== '' && ':'
                } ${group?.dbagIMSAuthContact} ${RemoveisActiveApprover3}  ${
                  group?.dbagIMSAuthContactDelegate &&
                  group?.dbagIMSAuthContactDelegate !== '' &&
                  ':'
                } ${group?.dbagIMSAuthContactDelegate} ${RemoveisActiveApprover4}`
          )
        }
      }
      // 4. Provisioning Validation
      if (!group?.provisioningBy) {
        isValid = false
        groupValidationErrorMessage.push(
          valueFinder('requestType') === 'Add'
            ? `${addProvisionValidationMessage1} ${group?.label} ${addProvisionValidationMessage2}`
            : `${removalProvisionValidationMessage1} ${group?.label} ${removalProvisionValidationMessage2}`
        )
      }

      // all api errors of single group
      if (groupValidationErrorMessage.length > 0)
        validationErrorMessages.push({
          groupLabel: group.label,
          messages: groupValidationErrorMessage
        })
    }

    return isValid
  }
  const iff = (condition, then, other) => (condition ? then : other)

  const handleNext = async () => {
    setLoader(true)
    setIsDisbaled(false)
    setSummaryError('')
    setJustificationError(false)
    setApiResponse([])
    if (validateForm()) {
      if (await apiValidation()) {
        if (!stepperMeta[activeStep + 1].children) {
          const newCompleted = completed
          newCompleted[activeStep] = true
          const newActiveStep =
            isLastStep() && !allStepsCompleted()
              ? stepperMeta.findIndex((step, i) => !(i in completed))
              : activeStep + 1
          setActiveStep(newActiveStep)
          setActiveBlock(newActiveStep)
          constructSummaryPage()
        }

        const newCompleted = completed
        newCompleted[activeStep] = true
        const newActiveStep =
          isLastStep() && !allStepsCompleted()
            ? stepperMeta.findIndex((step, i) => !(i in completed))
            : activeStep + 1
        setActiveStep(newActiveStep)
        setActiveBlock(newActiveStep)
      }
      if (validationErrorMessages.length > 0) setErrors(validationErrorMessages)
    }
    setLoader(false)
  }

  const submitMembershipData = async (eachPayload) => {
    const uniqueRequest = await checkUniqueRequestForMembership(eachPayload?.common?.groupDN, {
      serverDN: eachPayload?.common?.serverDN
    })
    let response
    if (uniqueRequest) {
      if (typeModule === 'Drafts' && draftId) {
        const result = await draftsApi
          .submitDraft(eachPayload, draftId)
          .then((res) => res)
          .catch((error) => error)
        response = result
      } else {
        const result = await accountAPI
          .addMemberShip(eachPayload)
          .then((res) => res)
          .catch((error) => error)
        response = result
      }
    } else {
      response = uniqueReqError
    }
    return response
  }

  const displayServerMessage = (message) => {
    let updatedResponse = message

    if (message && message?.toLowerCase() === 'requested entity is already a part of the group!') {
      updatedResponse = translate('addServerMembership.entityAlreadyExists')
    } else if (
      message &&
      message?.toLowerCase() === 'requested entity is not a part of the group!'
    ) {
      updatedResponse = translate('addServerMembership.entityNotExists')
    }
    return updatedResponse
  }

  const handleComplete = async (draftValue) => {
    if (!justification) {
      setJustificationError(true)
    } else {
      setLoader(true)
      setJustificationError(false)
      setSaveDraft(draftValue)

      const finalPayloads = []
      let successCounter = 0
      let errorCounter = 0
      const localApiResponse = []

      summaryArray.forEach((item) => {
        item.members.forEach((user) => {
          const payload = {
            common: {
              applicationName: `${applicationNamePrefix}${item.groupDomain}`,
              category: 'AD Group',
              operation: `${valueFinder('requestType')} Membership`,
              requestorMail: userInfo.mail,
              groupDN: item.dn,
              serverDN: user.dn,
              isDraft: draftValue,
              requestJustification: justification,
              Accessio_Request_No: ''
            }
          }
          localApiResponse.push({
            groupName: item.groupName,
            serverName: user.serverName,
            response: null
          })
          finalPayloads.push(payload)
        })
      })

      // eslint-disable-next-line no-restricted-syntax
      for (const [index, eachPayload] of finalPayloads.entries()) {
        // eslint-disable-next-line no-await-in-loop
        const result = await submitMembershipData(eachPayload)
        localApiResponse[index].response = result
      }
      let draftnotificationMessage
      // 8. user not in group validation checked it in response

      localApiResponse.forEach((result) => {
        if (result?.response?.status === 200 && !result?.response?.data?.Response) {
          // ALM 2190 : handled for showing error message when status code is 200
          if (draftValue) {
            draftnotificationMessage = draftSuccessNotification

            history.push('/drafts')
          }
          successCounter += 1
        } else {
          if (draftValue) {
            draftnotificationMessage = draftErrorNotification
          }
          errorCounter += 1
        }
      })

      setApiResponse(localApiResponse)

      let notificationMessage
      if (successCounter === localApiResponse?.length) {
        if (successCounter > 0) {
          notificationMessage =
            valueFinder('requestType') === 'Add'
              ? addSuccessNotification
              : removeSuccessNotification
          dispatch(
            updateReviewNotificationMessage({
              type: 'Success',
              message: draftValue ? `${draftnotificationMessage}` : `${notificationMessage}`
            })
          )
        }
      } else if (errorCounter > 0) {
        notificationMessage = draftValue ? draftSomeErrorNotification : failedNotification
        dispatch(
          updateReviewNotificationMessage({
            type: 'Error',
            message: `${notificationMessage}`
          })
        )
      }

      setLoader(false)
    }
  }

  const updataTableData = (modifiedValues, modifyedElement, updateTableData) => {
    if (modifiedValues?.length > 0) {
      setAccountArray((updatedList) =>
        updatedList.map((item) => {
          if (item.id === modifyedElement) {
            if (updateTableData === false) {
              return {
                ...item,
                error: true,
                helperText: maxLimitDraftError
              }
            }
            return {
              ...item,
              error: false,
              helperText: '',
              value: modifiedValues
            }
          }
          return item
        })
      )
    }
    setLoader(false)
  }
  // TODO : Update table when ADD Button is clicked
  const handleCallback = (buttonHandler) => {
    let updateTable = ''
    if (buttonHandler === 'serverType') {
      let finalAccount = []
      if (clickedAddArray.current.length > 0) {
        const unique = [...accounts, ...clickedAddArray.current]
        finalAccount = unique.filter(
          (obj, index) => index === unique.findIndex((o) => obj.dn === o.dn)
        )
      } else {
        finalAccount = [...accounts]
      }
      updateTable = typeModule !== 'Drafts' || typeModule === 'Drafts'
      setSelectedAccounts([...new Set(finalAccount)])
      updataTableData(finalAccount, 'serverTable', updateTable)
      clickedAddArray.current = []
    }

    if (buttonHandler === 'groupTypeForServer') {
      let finalGroup = []
      if (clickedAddGroupArray.current.length > 0) {
        const unique = [...groups, ...clickedAddGroupArray.current]
        finalGroup = unique.filter(
          (obj, index) => index === unique.findIndex((o) => obj.dn === o.dn)
        )
      } else {
        finalGroup = [...groups]
      }
      updateTable = typeModule !== 'Drafts' || typeModule === 'Drafts'
      setSelectedGroups(finalGroup)
      updataTableData(finalGroup, 'groupTable', updateTable)
      clickedAddGroupArray.current = []
    }
  }
  const checkObjectAlreadyExists = (obj, list) => {
    let isValid = false
    list.forEach((item) => {
      if (!isValid) {
        isValid = isEqual(item, obj)
      }
    })

    return isValid
  }

  // For resetting form values
  const resetServerGroupValue = () => {
    groupMembershipData[0].value = []
    groupMembershipData[1].value = []
    setGroupMembershipData(groupMembershipData)
    setSelectedAccounts([])
    setSelectedGroups([])
    setAccountArray((updatedList) =>
      updatedList.map((item) => {
        if (['groupTypeForServer', 'serverType'].includes(item.id)) {
          return {
            ...item,
            value: '',
            displayLabel: '',
            error: false,
            helperText: ''
          }
        }
        if (['groupTable', 'serverTable'].includes(item.id)) {
          return {
            ...item,
            value: [],
            error: false,
            helperText: ''
          }
        }
        return item
      })
    )
    setToggleFormServer(true)
  }

  const handlefieldChanges = (
    event,
    value,
    category,
    id,
    valueLabel,
    helperTextValue,
    reason,
    selectValueObjArr,
    selectedField
  ) => {
    const newValue = value
    const elementModified = event.target.id ? event.target.id.split('-')[0] : id
    if (selectedField && selectedField.length > 0) {
      if (selectedField && selectedField.length > 0 && selectedField[0].serverName) {
        clickedAddArray.current = [...selectedField]
      }
      if (selectedField && selectedField.length > 0 && selectedField[0].groupName) {
        clickedAddGroupArray.current = [...selectedField]
      }
    }
    if (['serverType', 'groupTypeForServer', 'businessJustification'].includes(elementModified)) {
      if (elementModified === 'serverType' && value) {
        if (!checkObjectAlreadyExists(value, accounts)) {
          if (selectedField?.length === 0) {
            clickedAddArray.current = []
          }
          const updateTable =
            typeModule !== 'Drafts' || (typeModule === 'Drafts' && accounts.length === 0)
          let selectedAcountsArray = accounts
          // This changes when you remove some options from autocomplete
          if (reason === 'removeOption') {
            const UniqueAccounts1 = selectedAcountsArray.filter(
              ({ label: id1 }) => !value.some(({ label: id2 }) => id2 === id1)
            )

            setSelectedAccounts(UniqueAccounts1)
            groupMembershipData[0].value = UniqueAccounts1
            setGroupMembershipData(groupMembershipData)
          } else if (reason === 'selectOption') {
            if (updateTable) {
              selectedAcountsArray = [...selectedAcountsArray, ...value]

              const UniqueAccounts = [
                // TODO : This code will remove duplicates Accounts
                ...new Map(selectedAcountsArray.map((item) => [item.label, item])).values()
              ]
              setSelectedAccounts(UniqueAccounts)

              groupMembershipData[0].value = UniqueAccounts
              setGroupMembershipData(groupMembershipData)
            }
          } else if (reason === 'clear') {
            const UniqueAccounts = selectedAcountsArray.filter(
              ({ label: id1 }) => !selectValueObjArr.some(({ label: id2 }) => id2 === id1)
            )
            setSelectedAccounts(UniqueAccounts)
            groupMembershipData[0].value = UniqueAccounts
            setGroupMembershipData(groupMembershipData)

            if (
              selectValueObjArr &&
              selectValueObjArr.length > 0 &&
              selectValueObjArr[0].serverName
            ) {
              clickedAddArray.current = []
            }
          }
        }
      }
      if (elementModified === 'groupTypeForServer' && value) {
        if (!checkObjectAlreadyExists(value, groups)) {
          if (selectedField?.length === 0) {
            clickedAddGroupArray.current = []
          }
          const updateTable =
            typeModule !== 'Drafts' || (typeModule === 'Drafts' && groups.length === 0)
          let selectedGroupsArray = groups
          if (reason === 'removeOption') {
            const UniqueAccounts1 = selectedGroupsArray.filter(
              ({ label: id1 }) => !value.some(({ label: id2 }) => id2 === id1)
            )

            setSelectedGroups(UniqueAccounts1)
            groupMembershipData[1].value = UniqueAccounts1
            setGroupMembershipData(groupMembershipData)
          } else if (reason === 'selectOption') {
            if (updateTable) {
              selectedGroupsArray = [...selectedGroupsArray, ...value]

              const UniqueGroups = [
                // TODO : This code will remove duplicates Groups
                ...new Map(selectedGroupsArray.map((item) => [item.label, item])).values()
              ]
              setSelectedGroups(UniqueGroups)
              groupMembershipData[1].value = UniqueGroups
              setGroupMembershipData(groupMembershipData)
            }
          } else if (reason === 'clear') {
            const UniqueGroups = selectedGroupsArray.filter(
              ({ label: id1 }) => !selectValueObjArr.some(({ label: id2 }) => id2 === id1)
            )
            setSelectedGroups(UniqueGroups)
            groupMembershipData[0].value = UniqueGroups
            setGroupMembershipData(groupMembershipData)
            if (
              selectValueObjArr &&
              selectValueObjArr.length > 0 &&
              selectValueObjArr[0].groupName
            ) {
              clickedAddGroupArray.current = []
            }
          }
        }
      }

      setAccountArray((updatedList) =>
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
    } else {
      if (elementModified === 'requestType') {
        groupMembershipData[2].value = newValue
        setGroupMembershipData(groupMembershipData)
        resetServerGroupValue()
        setErrors([])
      }
      setAccountArray((updatedList) =>
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

  const helperFinder = (fieldId) => {
    const targetIndex = accountArray.findIndex((field) => field.id === fieldId)
    return accountArray[targetIndex]?.helperText
  }
  const handleDisplayValue = () => {}
  const displayFields = () => {}
  const errorFinder = (fieldId) => {
    const targetIndex = accountArray.findIndex((field) => field.id === fieldId)
    return accountArray[targetIndex]?.error
  }
  const optionFinder = () => []
  const optionReset = () => {}
  const disabledFlagFinder = () => {}
  const readOnlyFlagFinder = () => {}
  const hiddenFlagFinder = () => false

  const groupObjGenerator = (
    objRepo,
    groupMembershipObj,
    groupMembershipSummaryObj,
    groupMembershiptCategoryObj
  ) => {
    objRepo.forEach((child) => {
      const providedDefaultValue = child.default && child.default !== '' ? child.default : ''
      groupMembershipSummaryObj.push(child.category)
      groupMembershipObj.push({
        id: child.id,
        label: child.label,
        value: child.type === 'table' ? [] : providedDefaultValue,
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
        disabled: child.displayType.disabled
      })
      if (child.type === 'autocomplete') {
        if (child.default !== '') {
          // Provision to make API call when any autocomplete comes with an value
        }
        groupMembershiptCategoryObj.push({ id: child.id, options: [] })
      }
    })
    setAccountArray(groupMembershipObj)
  }

  // TODO: Construct Summary Response Object for Displaying summary page
  const constructResponse = (obj) => {
    const groupMembershipObj = []
    const groupMembershipSummaryObj = []
    const groupMembershiptCategoryObj = []
    obj.forEach((block) => {
      if (!block.children && !block.substeps) {
        return
      }
      if (block.children) {
        groupObjGenerator(
          block.children,
          groupMembershipObj,
          groupMembershipSummaryObj,
          groupMembershiptCategoryObj
        )
      }
    })
  }

  // TODO: Remove selected Groups OR Accounts based on id and Domain
  const removeItems = (id, dn) => {
    if (id === 'serverTable') {
      let filteredAccounts = []
      if (clickedAddArray.current.length > 0) {
        const UniqueAccounts = accounts.filter(
          ({ label: id1 }) => !clickedAddArray.current.some(({ label: id2 }) => id2 === id1)
        )
        filteredAccounts = UniqueAccounts.filter((account) => account.dn !== dn)
      } else {
        filteredAccounts = accounts.filter((account) => account.dn !== dn)
      }

      setSelectedAccounts(filteredAccounts)
      groupMembershipData[0].value = filteredAccounts
      setGroupMembershipData(groupMembershipData)
      setAccountArray((updatedList) =>
        updatedList.map((item) => {
          if (item.id === 'serverTable') {
            if (filteredAccounts.length === 0 && typeModule === 'Drafts') {
              return {
                ...item,
                value: filteredAccounts,
                error: false,
                helperText: ''
              }
            }
            return {
              ...item,
              value: filteredAccounts
            }
          }
          return item
        })
      )
    } else {
      let filteredGroups = []
      if (clickedAddGroupArray.current.length > 0) {
        const UniqueGroup = groups.filter(
          ({ label: id1 }) => !clickedAddGroupArray.current.some(({ label: id2 }) => id2 === id1)
        )
        filteredGroups = UniqueGroup.filter((group) => group.dn !== dn)
      } else {
        filteredGroups = groups.filter((group) => group.dn !== dn)
      }

      setSelectedGroups(filteredGroups)
      groupMembershipData[1].value = filteredGroups
      setGroupMembershipData(groupMembershipData)
      setAccountArray((updatedList) =>
        updatedList.map((item) => {
          if (item.id === 'groupTable') {
            if (filteredGroups.length === 0 && typeModule === 'Drafts') {
              return {
                ...item,
                value: filteredGroups,
                error: false,
                helperText: ''
              }
            }
            return {
              ...item,
              value: filteredGroups
            }
          }
          return item
        })
      )
    }
  }

  // TODO : Remove Accounts from Summary Page
  const removeAccountFromSummary = (grpDn, dn) => {
    let memberAccountCount = 0
    let groupCount = summaryArray.length
    const updatedArray = [...summaryArray].map((singleArray) => {
      if (singleArray.dn === grpDn) {
        const filtered = [...singleArray.members].filter((member) => member.dn !== dn)
        memberAccountCount = filtered.length
        return { ...singleArray, members: filtered }
      }
      return singleArray
    })
    groupMembershipData[0].value = updatedArray
    setGroupMembershipData(groupMembershipData)
    setSummaryArray(updatedArray)

    // case 1. if all the accounts in group is removed then remove the group
    if (memberAccountCount === 0) {
      const updatedArray2 = summaryArray.filter((member) => member.dn !== grpDn)
      groupMembershipData[1].value = updatedArray2
      setGroupMembershipData(groupMembershipData)
      groupCount = updatedArray2.length
      setSummaryArray(updatedArray2)
    }

    // case 2. while removing all accounts all groups also removed then disbale the submit button and give error message on summary page
    if (groupCount === 0) {
      setIsDisbaled(true)
      setSummaryError(
        valueFinder('requestType') === 'Add'
          ? addNoGroupAndAccountError
          : removalNoGroupAndAccountError
      )
    }
  }

  // TODO : Remove Accounts from Summary Page
  const removeGroupFromSummary = (dn) => {
    let groupCount = summaryArray.length
    const updatedArray = summaryArray.filter((member) => member.dn !== dn)
    groupMembershipData[1].value = updatedArray
    setGroupMembershipData(groupMembershipData)
    groupCount = updatedArray.length
    setSummaryArray(updatedArray)

    // case 1. if remove all groups then disbale the submit button and give error message on summary page
    if (groupCount === 0) {
      setIsDisbaled(true)
      setSummaryError(
        valueFinder('requestType') === 'Add'
          ? addNoGroupAndAccountError
          : removalNoGroupAndAccountError
      )
    }
  }

  // TODO : Handle Justification
  const handleJustification = (event) => {
    if (event.target.value) {
      setJustificationError(false)
    } else {
      setJustificationError(true)
    }
    setJustification(event.target.value)
  }

  const CloseIcon = () => (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
      <path
        d="M12.8404 12.0004L18.9604 5.88035C19.2003 5.64035 19.2003 5.25597 18.9604 5.04035C18.7204 4.82474 18.336 4.80035 18.1204 5.04035L12.0004 11.1604L5.88035 5.04035C5.64035 4.80035 5.25597 4.80035 5.04035 5.04035C4.80035 5.28035 4.80035 5.66474 5.04035 5.88035L11.1604 12.0004L5.04035 18.1204C4.80035 18.3604 4.80035 18.7447 5.04035 18.9604C5.28035 19.2003 5.66474 19.2003 5.88035 18.9604L12.0004 12.8404L18.1204 18.9604C18.3604 19.2003 18.7447 19.2003 18.9604 18.9604C19.2003 18.7204 19.2003 18.336 18.9604 18.1204L12.8404 12.0004Z"
        fill={theme === 'dark' ? '#FFF' : '#333'}
      />
    </svg>
  )

  const handleFinish = () => history.push(saveDraft ? '/drafts' : `/history/requestHistory`)

  const displaySummaryValue = (consition, then, otherise) => (consition ? then : otherise)

  const apiDataFetcher = async (id, apiUrl, payload, dn) => {
    accountAPI.getOptions(apiUrl, payload).then((res) => {
      if (res.hits.hits.length > 0) {
        /* eslint no-underscore-dangle: 0 */
        if (id === 'serverType') {
          const tableObj = []
          const element = res.hits.hits.filter(
            (data) => data._source?.igaContent?.distinguishedName === dn
          )[0]
          const serverDomain = element?._source?.igaContent?.distinguishedName
            ? element._source.igaContent.distinguishedName.split(',')
            : ''

          tableObj.push({
            label: `${element?._source?.igaContent?.cn}`,
            value: `${element?._source?.igaContent?.cn}`,
            serverName: `${element?._source?.igaContent?.cn}`,
            domain: serverDomain.length > 0 ? serverDomain.slice(-4)[0]?.split('=')[1] : '',
            hostName: `${
              element?._source?.igaContent?.object?.dNSHostName
                ? element?._source?.igaContent?.object?.dNSHostName
                : ''
            }`,
            dn: `${
              element?._source?.igaContent?.distinguishedName
                ? element?._source?.igaContent?.distinguishedName
                : ''
            }`,
            osVersion: `${
              element?._source?.igaContent?.object?.operatingSystem
                ? element?._source?.igaContent?.object?.operatingSystem
                : ''
            }`
          })
          if (!checkObjectAlreadyExists(tableObj, accounts)) {
            let selectedAcountsArray = accounts
            selectedAcountsArray = tableObj
            setSelectedAccounts(selectedAcountsArray)
            updataTableData(tableObj, 'serverTable', true)
            groupMembershipData[0].value = selectedAcountsArray
          }
        }
        if (id === 'groupTypeForServer') {
          const tableObj = []
          const element = res.hits.hits[0]
          const accountDomain = element?._source?.igaContent?.distinguishedName
            ? element._source.igaContent.distinguishedName.split(',')
            : ''
          const groupUrl = new URL(window.location.href)
          if (groupUrl.href.includes('groupName')) {
            groupUrl.searchParams.set('groupName', element?._source?.igaContent?.cn)
          } else {
            groupUrl.searchParams.append('groupName', element?._source?.igaContent?.cn)
          }
          tableObj.push({
            label: `${element?._source?.igaContent?.cn}`,
            value: `${element?._source?.igaContent?.cn}`,
            dn: `${
              element?._source?.igaContent?.distinguishedName
                ? element?._source?.igaContent?.distinguishedName
                : ''
            }`,
            domain: accountDomain.length > 0 ? accountDomain.slice(-4)[0]?.split('=')[1] : '',
            approvers: element?._source?.igaContent?.dbagIMSApprovers?.join(', '),
            groupName: element?._source?.igaContent?.cn ? element?._source?.igaContent?.cn : '',
            description: element?._source?.igaContent?.description[0],
            dbagIMSAuthContact: element?._source?.igaContent?.dbagIMSAuthContact
              ? element?._source?.igaContent?.dbagIMSAuthContact
              : iff(
                  element?._source?.igaContent?.object?.dbagIMSAuthContact,
                  element?._source?.igaContent?.object?.dbagIMSAuthContact,
                  ''
                ),
            dbagIMSAuthContactDelegate: element?._source?.igaContent?.dbagIMSAuthContactDelegate
              ? element?._source?.igaContent?.dbagIMSAuthContactDelegate
              : iff(
                  element?._source?.igaContent?.object?.dbagIMSAuthContactDelegate,
                  element?._source?.igaContent?.object?.dbagIMSAuthContactDelegate,
                  ''
                ),
            groupScope: `${
              element?._source?.igaContent?.object?.groupScope
                ? element?._source?.igaContent?.object?.groupScope
                : ''
            }`,
            grpComplaint: checkComplianceStatusValidation(
              element?._source?.igaContent?.dbagComplianceStatus
                ? element?._source?.igaContent?.dbagComplianceStatus
                : '0'
            ),
            provisioningBy: checkProvisioningValidation(
              element._source?.igaContent?.dbagProvisioningBy
                ? element._source?.igaContent?.dbagProvisioningBy
                : null
            ),
            // Temporarily commenting current mapping
            // roleName: element?._source?.glossary?.kv?.filter(
            //   (gattrb) => gattrb.key === 'accessioPrerequisiteRMPRoles'
            // )[0]?.value,
            roleName:
              element?._source?.glossary?.idx &&
              element?._source?.glossary?.idx['/'] &&
              element?._source?.glossary?.idx['/']?.accessioPrerequisiteRMPRoles,
            url: groupUrl?.href
          })
          if (!checkObjectAlreadyExists(tableObj, groups)) {
            let selectedGroupsArray = groups
            selectedGroupsArray = tableObj
            setSelectedGroups(selectedGroupsArray)
            updataTableData(tableObj, 'groupTable', true)
            groupMembershipData[1].value = selectedGroupsArray
            setGroupMembershipData(groupMembershipData)
          }
        }
      }
    })
  }

  const breadcrumbsAction = () => {
    switch (typeModule) {
      case 'Drafts':
        return [
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          { label: translate('drafts.header.title'), url: '/drafts' },
          { label: translate('draft.navItem.addOrRemoveServers'), url: '' }
        ]
      default:
        return [
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          { label: translate('create.ADAccount.requests'), url: '/requests' },
          { label: translate('draft.navItem.addOrRemoveServers'), url: '' }
        ]
    }
  }

  useEffect(() => {
    if (draftAutocompleteValues.length > 0) {
      draftAutocompleteValues.forEach((item) => {
        let payload
        if (item.id === 'serverType') {
          payload = {
            serverCN: item?.value,
            pageSize: 100,
            pageNumber: 0
          }
        } else {
          payload = {
            searchValue: item?.value,
            pageSize: 100,
            pageNumber: 0
          }
        }

        switch (item.id) {
          case 'serverType':
            apiDataFetcher(item.id, `/v0/server/getServer`, payload, item?.dn)
            break
          case 'groupTypeForServer':
            apiDataFetcher(item.id, `/v0/governance/searchGroups`, payload)
            break
          default:
            break
        }
      })
    }
  }, [draftAutocompleteValues])

  useEffect(() => {
    if (typeModule === 'Drafts' && selectedGroup?.draftData?.length > 0) {
      setLoader(true)
      const selected = selectedGroup?.draftData?.filter((resp) => resp.id === draftId)
      const autocompleteValues = []
      accountAPI.getserverMembershipMeta().then((resp) => {
        accountAPI.setServerMembershipRecord(selected[0]).then((res) => {
          if (res) {
            const response = resp.steps[0].children.map((item) => {
              const matchedResult = res.filter((i) => i.id === 'requestType')[0]
              let labelValue = item.label
              let placeholderValue = item.placeholder
              switch (item.id) {
                case 'serverType':
                  labelValue = 'addOrRemoveServers.serverFieldMessage'
                  placeholderValue = labelValue
                  break
                case 'groupTypeForServer':
                  labelValue = 'addOrRemoveServers.groupFieldMessage'
                  placeholderValue = labelValue
                  break
                default:
                  break
              }

              if (item.id === 'requestType') {
                return {
                  ...item,
                  default: matchedResult.value,
                  label: labelValue,
                  placeholder: placeholderValue
                }
              }
              return { ...item, label: labelValue, placeholder: placeholderValue }
            })
            const updatedSteps = { ...resp.steps[0], children: response }
            const updatedResponse = { ...resp, steps: [updatedSteps, resp.steps[1]] }
            setStepperMeta(updatedResponse.steps)
            constructResponse(updatedResponse.steps)
            const justificationData = res.filter((i) => i.id === 'businessJustification')[0]
            const filterDN = res.filter((i) => i.id === 'memberServerDN')[0]?.value
            setJustification(justificationData?.value)
            const updatedList = resp?.steps[0]?.children.map((item) => {
              const matchedResult = res.filter((i) => i.id === item.id)[0]
              if (matchedResult && item.id === matchedResult.id) {
                if (item.type === 'autocomplete') {
                  if (item.id === 'serverType') {
                    autocompleteValues.push({
                      id: item.id,
                      value: matchedResult?.value,
                      dn: filterDN
                    })
                  } else {
                    autocompleteValues.push({
                      id: item.id,
                      value: matchedResult?.value
                    })
                  }
                }

                if (item.id === 'requestType') {
                  groupMembershipData[2].value = matchedResult?.value
                  setGroupMembershipData(groupMembershipData)
                }
              }

              return {
                ...item,
                value: matchedResult?.value,
                displayLabel: matchedResult?.value
              }
            })

            setAccountArray(updatedList)
            setDraftAutocompleteValues(autocompleteValues)
          }
        })
      })
    }
  }, [selectedGroup])

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
        } else {
          setLoader(false)
        }
        setNotification({ description: '', variant: '' })
      }, 5000)
    }
  }, [notification.variant])

  useEffect(() => {
    if (typeModule !== 'Drafts') {
      accountAPI.getserverMembershipMeta().then((res) => {
        setStepperMeta(res.steps)
        constructResponse(res.steps)
        if (groupName !== '') {
          const autocompleteValue = {
            id: 'groupTypeForServer',
            value: groupName
          }
          setDraftAutocompleteValues((prevState) => [...prevState, autocompleteValue])
        }
      })
    }
  }, [])

  return (
    <>
      {loader && <Loading />}
      <Breadcrumb path={breadcrumbsAction()} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Styled.HeaderWrapper>
          <h1 style={{ fontWeight: 'normal', marginBottom: '10px' }}>
            {translate('serverMembership.mainHeading')}
          </h1>
        </Styled.HeaderWrapper>
        <Box sx={{ width: '30%', paddingTop: '15px' }}>
          <Stepper nonLinear activeStep={activeStep}>
            {stepperMeta.length &&
              stepperMeta.map((label, index) => (
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
                    {translate(label.title)}
                  </StepButton>
                </Step>
              ))}
          </Stepper>
        </Box>
      </div>
      <Styled.MainWrapper>
        {stepperMeta.map((item, index) =>
          index !== stepperMeta.length - 1 ? (
            <Box
              key={`${item.id}_container`}
              sx={{ display: displayStepperBlock(index) ? 'block' : 'none' }}
              p={5}
            >
              <h2 key={`${item.id}_header`}>
                {/* {translate(`create.ADAccount.${item.headingId ? item.headingId : item.titleId}`)} */}
                {translate(item.headerId) ? translate(item.headerId) : translate(item.title)}
              </h2>
              <Grid container spacing={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                {item.children && (
                  <Grid item xs={12} key={`${item.id}_gridItem`}>
                    <Grid
                      container
                      spacing={{ xs: 4 }}
                      sx={{ flexDirection: 'column !important', display: 'flex' }}
                      key={`${item.id}_gridcontainer`}
                    >
                      {item.children &&
                        item.children.map((element) =>
                          formGenerator(
                            element,
                            handlefieldChanges,
                            displayFields,
                            handleDisplayValue,
                            helperFinder,
                            '',
                            valueFinder,
                            errorFinder,
                            optionFinder,
                            optionReset,
                            disabledFlagFinder,
                            readOnlyFlagFinder,
                            hiddenFlagFinder,
                            12,
                            '',
                            removeItems,
                            groupMembershipData,
                            resetServerGroupValue,
                            '',
                            handleCallback,
                            accounts,
                            groups,
                            '',
                            '',
                            toggleFormServer
                          )
                        )}
                    </Grid>
                  </Grid>
                )}
                {index === 0 && (
                  <>
                    <Grid item xs={4} key={index}>
                      {stepperMeta.length > 0 &&
                        stepperMeta.map((info) => (
                          <React.Fragment key={info.label}>
                            <strong>{info.label}</strong>
                            {/* <p>{info.description}</p> */}
                          </React.Fragment>
                        ))}
                    </Grid>
                    {errors.length > 0 ? (
                      <div style={{ paddingTop: '20px', paddingLeft: '40px' }}>
                        <p style={{ color: '#F00' }}>{translate('groupMembership.errorHeading')}</p>
                        <Grid container spacing={4}>
                          <ul>
                            {errors &&
                              errors.map((error) => (
                                <>
                                  <p style={{ color: '#F00' }}>
                                    <strong>{error.groupLabel} :</strong>
                                  </p>
                                  {error.messages &&
                                    error.messages.length > 0 &&
                                    error.messages.map((singleGoupError) => (
                                      <Grid
                                        item
                                        xs={12}
                                        sx={{ display: 'flex', color: '#F00', paddingLeft: '20px' }}
                                        key={`${singleGoupError}_container`}
                                      >
                                        <li> {singleGoupError}</li>
                                      </Grid>
                                    ))}
                                </>
                              ))}
                          </ul>
                        </Grid>
                      </div>
                    ) : (
                      ''
                    )}
                  </>
                )}
              </Grid>
            </Box>
          ) : (
            isLastStep() && (
              <>
                <Box sx={{ width: '100%', padding: '15px' }}>
                  <h3>
                    {apiResponse.length > 0
                      ? translate('addGroupMembership.submissionSummary')
                      : translate('addGroupMembership.summary')}
                  </h3>
                  {apiResponse.length === 0 ? (
                    <div style={{ display: 'flex' }}>
                      <div style={{ paddingRight: '60px', width: '100%' }}>
                        <div style={{ display: 'flex' }}>
                          <h4>{translate('groupMembership.RequestType')}</h4>
                          <p style={{ paddingLeft: '10px', paddingTop: '4px' }}>
                            {valueFinder('requestType') === 'Add'
                              ? translate('serverMembership.add')
                              : translate('serverMembership.remove')}{' '}
                            {translate('groupMembership.Membership')}
                          </p>
                        </div>
                        {summaryArray.map((singleObj) => (
                          <>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <div>
                                <h4>{singleObj.groupName}</h4>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button onClick={() => removeGroupFromSummary(singleObj.dn)}>
                                  <CloseIcon />
                                </Button>
                              </div>
                            </div>
                            <TableContainer component={Paper}>
                              <Table sx={{ minWidth: 550 }} size="small" aria-label="simple table">
                                <TableHead>
                                  <TableRow>
                                    {[
                                      translate('serverMembership.serverName'),
                                      translate('serverMembership.domain'),
                                      translate('serverMembership.hostname'),
                                      translate('serverMembership.actions')
                                    ].map((eachColumn) => (
                                      <TableCell>{eachColumn}</TableCell>
                                    ))}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {singleObj.members?.map((row) => (
                                    <TableRow
                                      key={row.serverName}
                                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                      <TableCell component="th" scope="row">
                                        {row.serverName}
                                      </TableCell>
                                      <TableCell align="left">{row.domain}</TableCell>
                                      <TableCell align="left">{row.hostName}</TableCell>

                                      <TableCell align="left">
                                        <Button
                                          onClick={() =>
                                            removeAccountFromSummary(singleObj.dn, row.dn)
                                          }
                                        >
                                          {translate('groupMembership.Remove')}
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </>
                        ))}
                        {summaryError ? (
                          <Box>
                            <h4 style={{ color: 'red' }}>{summaryError}</h4>
                          </Box>
                        ) : null}
                      </div>
                      <div style={{ width: '35%' }}>
                        <Box>
                          <h4>{translate('groupMembership.BusinessJustification')}</h4>
                          <FormControl sx={{ width: '94%' }} margin="normal" key="business" xs={6}>
                            <TextField
                              onChange={(e, v) => handleJustification(e, v)}
                              helperText={() => {}}
                              value={justification}
                              multiline
                              rows={4}
                              fullWidth
                              error={justificationError}
                            />
                          </FormControl>
                          {justificationError ? (
                            <FormHelperText error={justificationError}>
                              {mandatoryErrorMsg}
                            </FormHelperText>
                          ) : null}
                        </Box>
                      </div>
                    </div>
                  ) : null}
                  {apiResponse.length > 0 ? (
                    <div style={{ paddingRight: '60px', width: '100%' }}>
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>{translate('addGroupMembership.groupName')}</TableCell>
                              <TableCell>{translate('addserverMembership.serverName')}</TableCell>
                              <TableCell>{translate('addGroupMembership.response')}</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {apiResponse.map((row) => (
                              <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell>{row.groupName}</TableCell>
                                <TableCell>{row.serverName}</TableCell>
                                <TableCell>
                                  {row?.response?.status && row.response.status === 200
                                    ? displaySummaryValue(
                                        row?.response?.data?.Response,
                                        displayServerMessage(row?.response?.data?.Response),
                                        `${valueFinder('requestType')} ${translate(
                                          'addServerMembership.singleRequestSuccessMsg' // TODO : To Display Add Or Remove Success message on Summary Response
                                        )}`
                                      )
                                    : displaySummaryValue(
                                        row?.response?.status,
                                        `${valueFinder('requestType')} ${translate(
                                          'addServerMembership.singleRequestFailuerMsg' // TODO : To Display Add Or Remove Failure message on Summary Response
                                        )}`,
                                        row?.response
                                      )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  ) : null}
                </Box>
              </>
            )
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
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              {apiResponse.length === 0 ? (
                <>
                  {isLastStep() && (
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      {translate('create.ADAccount.back')}
                    </Button>
                  )}
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button
                    sx={{ color: `${theme.palette.mode === 'dark' ? '#F2F3F4' : '#333'}` }}
                    onClick={handleCancel}
                  >
                    {translate('create.ADAccount.cancel')}
                  </Button>
                </>
              ) : null}
              {!isLastStep() ? (
                <Button
                  variant="outlined"
                  sx={{
                    color: `${theme.palette.mode === 'dark' ? '#F2F3F4' : '#333'}`,
                    borderColor: `${theme.palette.mode === 'dark' ? '#F2F3F4' : '#333'}`,
                    borderRadius: 0,
                    mr: 1,
                    ':hover': {
                      bgcolor: `${theme.palette.mode === 'dark' ? '#00A7F7' : '#F5F5F7'}`
                    }
                  }}
                  onClick={handleNext}
                >
                  {translate('create.ADAccount.next')}
                </Button>
              ) : (
                <>
                  {apiResponse.length === 0 ? (
                    <>
                      <Button
                        variant="outlined"
                        sx={{
                          color: `${theme.palette.mode === 'dark' ? '#FFF' : '#000'}`,
                          borderColor: `${theme.palette.mode === 'dark' ? '#FFF' : '#000'}`,
                          borderRadius: 0,
                          mr: 1
                        }}
                        disabled={isDisabled}
                        onClick={() => handleComplete(true)}
                      >
                        {translate('create.ADAccount.saveforLater')}
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{
                          color: `${theme.palette.mode === 'dark' ? '#FFF' : '#000'}`,
                          borderColor: `${theme.palette.mode === 'dark' ? '#FFF' : '#000'}`,
                          borderRadius: 0,
                          mr: 1
                        }}
                        disabled={isDisabled}
                        onClick={() => handleComplete(false)}
                      >
                        {translate('create.ADAccount.submitRequest')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Box sx={{ flex: '1 1 auto' }} />
                      <Button
                        variant="outlined"
                        sx={{
                          color: `${theme.palette.mode === 'dark' ? '#FFF' : '#000'}`,
                          borderColor: `${theme.palette.mode === 'dark' ? '#FFF' : '#000'}`,
                          borderRadius: 0,
                          mr: 1
                        }}
                        onClick={() => handleFinish(false)}
                      >
                        {translate('create.finish')}
                      </Button>
                    </>
                  )}
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
              backgroundColor: theme.palette.mode === 'dark' ? '#1A2129' : '#FFF',
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

export default AddOrRemoveServer
