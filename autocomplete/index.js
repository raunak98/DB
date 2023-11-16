import * as React from 'react'
import { Box, Button } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import debounce from 'lodash/debounce'
import translate from 'translations/translate'
import {
  checkAppManagementValidation,
  checkProvisioningValidation,
  checkNoGroupApproversValidation,
  checkComplianceStatusValidation,
  checkOffBoardedValidation,
  checkNoDomainValidation,
  checkisGMSAGroup
} from 'helpers/utils'
import { convertMailtoNameTemp, findDomain } from 'helpers/strings'
import * as accountApi from '../../api/accountManagement'
import useTheme from '../../hooks/useTheme'

const AutocompleteWrapper = ({
  id,
  onChangeHandler,
  url,
  title,
  isMultiple,
  categoryInfo,
  error,
  helperText,
  queryparameters,
  required,
  autocompleteValue,
  optionFinder,
  optionReset,
  readOnly,
  disabled,
  groupOwner,
  placeholder,
  groupMembershipData,
  maxLimitValue,
  handleCallback,
  accounts,
  groups,
  toggleForm,
  toggleFormServer
}) => {
  const { theme } = useTheme()
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState([])
  const [autocompleteOpen, setAutocompleteOpen] = React.useState(false)
  const loading = open
  const [inputValue, setInputValue] = React.useState('')
  const [inputValueObj, setInputValueObj] = React.useState({ label: '', value: '' })
  const [isSelectedValue, setIsSelectedValue] = React.useState(false)
  const [selectValueObj, setSelectValueObj] = React.useState({ label: '', value: '' })
  const typeModule = localStorage.getItem('component')
  const maxLimit = typeModule === 'Drafts' ? 1 : maxLimitValue
  // used for multiple section
  const [inputValueObjArr, setInputValueObjArr] = React.useState([])
  const [disableValueObjArr, setDisableValueObjArr] = React.useState([])
  const [disableValueObjGrpArr, setDisableValueGrpObjArr] = React.useState([])

  const [selectValueObjArr, setSelectValueObjArr] = React.useState([])
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
  const checkedIcon = <CheckBoxIcon fontSize="small" />
  const type = localStorage.getItem('component')
  const appManagementValidationMessage = translate(
    'addGroupMembership.appManagementValidationMessage'
  )
  const appManagementValidationMessageRemove = translate(
    'addGroupMembership.appManagementValidationMessageRemove'
  )

  const addProvisionValidationMessage = translate(
    'addserverMembership.addProvisionValidationMessage'
  )
  const addProvisionValidationMessage1 = translate(
    'addGroupMembership.addProvisionValidationMessage1'
  )
  const addProvisionValidationMessage2 = translate(
    'addGroupMembership.addProvisionValidationMessage2'
  )
  const removalProvisionValidationMessage = translate(
    'addserverMembership.removalProvisionValidationMessage'
  )
  const removalProvisionValidationMessage1 = translate(
    'addGroupMembership.removalProvisionValidationMessage1'
  )
  const removalProvisionValidationMessage2 = translate(
    'addGroupMembership.removalProvisionValidationMessage2'
  )

  const addNoApproverValidationMessage = translate(
    'addserverMembership.addNoActiveApproverValidationMessage'
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
  const removalNoApproverValidationMessage = translate(
    'addserverMembership.removalNoActiveApproverValidationMessage'
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
  const addNoComplianceStatusValidationMessage1 = translate(
    'addGroupMembership.addNoComplianceStatusValidationMessage1'
  )
  const addNoComplianceStatusValidationMessage2 = translate(
    'addGroupMembership.addNoComplianceStatusValidationMessage2'
  )
  const removalNoComplianceStatusValidationMessage1 = translate(
    'addGroupMembership.removalNoComplianceStatusValidationMessage'
  )
  const removalNoComplianceStatusValidationMessage2 = translate(
    'addGroupMembership.removalNoComplianceStatusValidationMessage'
  )
  const addOffBoardedValidationMessage1 = translate(
    'addGroupMembership.addOffBoardedValidationMessage1'
  )
  const addOffBoardedValidationMessage2 = translate(
    'addGroupMembership.addOffBoardedValidationMessage2'
  )
  const removalOffBoardedValidationMessage1 = translate(
    'addGroupMembership.removalOffBoardedValidationMessage1'
  )
  const removalOffBoardedValidationMessage2 = translate(
    'addGroupMembership.removalOffBoardedValidationMessage2'
  )
  const addNoDomainValidationMessage = translate('addGroupMembership.addNoDomainValidationMessage')
  const removalNoDomainValidationMessage = translate(
    'addGroupMembership.removalNoDomainValidationMessage'
  )
  const autocompleteNoOptionText = translate('create.ADAccount.autocompleteNoOptionText')
  let index = 1
  const iff = (condition, then, other) => (condition ? then : other)

  const callMembershipOptionsApi = (urlApi, payload) => {
    accountApi.getOptions(urlApi, payload).then((res) => {
      if (res?.hits?.hits?.length > 0) {
        const optionsArray = []
        /* eslint no-underscore-dangle: 0 */
        if (id === 'accountType') {
          res.hits.hits.forEach((element) => {
            let localIsDisabled = false
            let localValidationMessage = ''
            // disabled the already seletced items
            if (
              groupMembershipData[0].value?.filter(
                (itm) => itm.dn === element?._source?.igaContent?.distinguishedName
              ).length > 0
            ) {
              localIsDisabled = true
            }
            // no distinguishedName in accounts
            if (
              !localIsDisabled &&
              checkNoDomainValidation(
                element?._source?.igaContent?.distinguishedName
                  ? element?._source?.igaContent?.distinguishedName
                  : ''
              )
            ) {
              localIsDisabled = true
              localValidationMessage =
                groupMembershipData[2].value === 'Add'
                  ? addNoDomainValidationMessage
                  : removalNoDomainValidationMessage
            }

            // 10.offBordedBy HR Validation
            if (groupMembershipData[2].value === 'Add') {
              if (
                !localIsDisabled &&
                checkOffBoardedValidation(
                  element?._source?.igaContent?.object?.info
                    ? element?._source?.igaContent?.object?.info
                    : ''
                )
              ) {
                localIsDisabled = true
                localValidationMessage =
                  groupMembershipData[2].value === 'Add'
                    ? `${addOffBoardedValidationMessage1} ${element?._source?.igaContent?.sAMAccountName} ${addOffBoardedValidationMessage2}`
                    : `${removalOffBoardedValidationMessage1} ${element?._source?.igaContent?.object?.cn} ${removalOffBoardedValidationMessage2} `
              }
            }

            const accountDomain = element?._source?.igaContent?.distinguishedName
              ? element?._source?.igaContent?.distinguishedName?.split(',')
              : ''

            const domainName = findDomain(element?._source?.igaContent?.distinguishedName)

            // account email in case of personal and primary account
            let mailId = ''
            if (
              element?._source?.igaContent?.employeeType &&
              element?._source?.igaContent?.sAMAccountName
            ) {
              if (
                ['perm', 'ext', 'secnd', 'dadmin', 'domspt'].includes(
                  element?._source?.igaContent?.employeeType?.toLowerCase()
                )
              ) {
                mailId = element?._source?.igaContent?.mail
                  ? element?._source?.igaContent?.mail
                  : ''
              } else if (
                element?._source?.igaContent?.employeeType?.toLowerCase() === 'admin' &&
                element._source.igaContent.sAMAccountName.endsWith('-a')
              ) {
                mailId = element?._source?.igaContent?.mail
                  ? element?._source?.igaContent?.mail
                  : ''
              }
            }

            optionsArray.push({
              label: `${domainName}\\${element?._source?.igaContent?.sAMAccountName} ${
                mailId ? `(${convertMailtoNameTemp(mailId)})` : ''
              }`,
              value: `${element?._source?.igaContent?.sAMAccountName}${
                mailId ? `(${mailId})` : ''
              }`,
              accountName: `${
                element?._source?.igaContent?.sAMAccountName
                  ? element?._source?.igaContent?.sAMAccountName
                  : ''
              }`,
              domain: accountDomain?.length > 0 ? accountDomain?.slice(-4)[0]?.split('=')[1] : '',
              dn: `${
                element?._source?.igaContent?.distinguishedName
                  ? element?._source?.igaContent?.distinguishedName
                  : ''
              }`,
              userRef: `${element?._source?.user?._ref ? element?._source?.user?._ref : ''}`,
              employeeType: `${
                element?._source?.igaContent?.employeeType
                  ? element?._source?.igaContent?.employeeType
                  : ''
              }`,
              emailId: mailId,
              disabledMessage: localValidationMessage,
              disabled: localIsDisabled,
              info: checkOffBoardedValidation(
                element?._source?.igaContent?.object?.info
                  ? element?._source?.igaContent?.object?.info
                  : ''
              )
            })
          })
        }
        if (['groupType', 'groupTypeForServer'].includes(id)) {
          // groupType - For AddOrRemoveGroup, groupTypeForServer- AddOrRemoveServer
          res?.hits?.hits?.forEach(async (element) => {
            // TODO : For Server Membership check accessioIsgMSAGroup = 'yes' condition
            if (
              checkisGMSAGroup(
                id,
                element?._source?.glossary?.idx &&
                  element?._source?.glossary?.idx['/'] &&
                  element?._source?.glossary?.idx['/']?.accessioIsgMSAGroup
                // element._source?.glossary?.kv?.filter(
                //   (gattrb) => gattrb?.key === 'accessioIsgMSAGroup'
                // )[0]?.value
              )
            ) {
              return
            }

            let localIsDisabled = false
            let localValidationMessage = ''

            // disabled the already selected items
            if (
              groupMembershipData[1].value?.filter(
                (itm) => itm.dn === element?._source?.igaContent?.object?.dn
              ).length > 0
            ) {
              localIsDisabled = true
            }
            // 3.App Management Validation
            if (
              !localIsDisabled &&
              checkAppManagementValidation(
                element?._source?.glossary?.idx &&
                  element?._source?.glossary?.idx['/'] &&
                  element?._source?.glossary?.idx['/']?.accessioAppRequest
              )

              // Temporarily commenting current mapping
              // checkAppManagementValidation(
              //   element._source?.glossary?.kv?.filter(
              //     (gattrb) => gattrb.key === 'accessioAppRequest'
              //   )[0]?.value
              // )
            ) {
              localIsDisabled = true
              localValidationMessage =
                groupMembershipData[2].value === 'Add'
                  ? `${element?._source?.igaContent?.cn} ${appManagementValidationMessage}`
                  : `${element?._source?.igaContent?.cn} ${appManagementValidationMessageRemove}`
            }
            // 4. Compliance Status validation
            if (groupMembershipData && groupMembershipData[2]?.value === 'Add') {
              if (
                !localIsDisabled &&
                checkComplianceStatusValidation(
                  element?._source?.igaContent?.dbagComplianceStatus
                    ? element?._source?.igaContent?.dbagComplianceStatus
                    : '0'
                )
              ) {
                localIsDisabled = true
                localValidationMessage =
                  groupMembershipData[2].value === 'Add'
                    ? `${addNoComplianceStatusValidationMessage1} ${element?._source?.igaContent?.cn} ${addNoComplianceStatusValidationMessage2}`
                    : `${removalNoComplianceStatusValidationMessage1} ${element?._source?.igaContent?.cn} ${removalNoComplianceStatusValidationMessage2}`
              }
            }

            // 5. no approver validation
            if (
              !localIsDisabled &&
              checkNoGroupApproversValidation(
                element?._source?.igaContent?.dbagIMSApprovers
                  ? element?._source?.igaContent?.dbagIMSApprovers
                  : []
              )
            ) {
              localIsDisabled = true
              localValidationMessage =
                groupMembershipData[2].value === 'Add'
                  ? iff(
                      type === 'AddOrRemoveServer',
                      addNoApproverValidationMessage,
                      `${addNoApproverValidationMessage1} ${
                        element?._source?.igaContent?.cn
                      } ${addNoApproverValidationMessage2} ${
                        element?._source?.igaContent?.dbagIMSAuthContact
                          ? element?._source?.igaContent?.dbagIMSAuthContact
                          : iff(
                              element?._source?.igaContent?.object?.dbagIMSAuthContact,
                              element?._source?.igaContent?.object?.dbagIMSAuthContact,
                              ''
                            )
                      } ${addNoApproverValidationMessage3}  ${
                        element?._source?.igaContent?.dbagIMSAuthContactDelegate
                          ? element?._source?.igaContent?.dbagIMSAuthContactDelegate
                          : iff(
                              element?._source?.igaContent?.object?.dbagIMSAuthContactDelegate,
                              element?._source?.igaContent?.object?.dbagIMSAuthContactDelegate,
                              ''
                            )
                      } ${addNoApproverValidationMessage4}`
                    )
                  : iff(
                      type === 'AddOrRemoveServer',
                      removalNoApproverValidationMessage,
                      `${removalNoApproverValidationMessage1} ${
                        element?._source?.igaContent?.cn
                      } ${removalNoApproverValidationMessage2} ${
                        element?._source?.igaContent?.dbagIMSAuthContact
                          ? element?._source?.igaContent?.dbagIMSAuthContact
                          : iff(
                              element?._source?.igaContent?.object?.dbagIMSAuthContact,
                              element?._source?.igaContent?.object?.dbagIMSAuthContact,
                              ''
                            )
                      } ${removalNoApproverValidationMessage3}  ${
                        element?._source?.igaContent?.dbagIMSAuthContactDelegate
                          ? element?._source?.igaContent?.dbagIMSAuthContactDelegate
                          : iff(
                              element?._source?.igaContent?.object?.dbagIMSAuthContactDelegate,
                              element?._source?.igaContent?.object?.dbagIMSAuthContactDelegate,
                              ''
                            )
                      } ${removalNoApproverValidationMessage4}`
                    )
            }
            // 7. Provisioning Validation
            if (
              !localIsDisabled &&
              !checkProvisioningValidation(
                element._source?.igaContent?.dbagProvisioningBy
                  ? element._source?.igaContent?.dbagProvisioningBy
                  : null
              )
            ) {
              localIsDisabled = true
              localValidationMessage =
                groupMembershipData[2].value === 'Add'
                  ? iff(
                      type === 'AddOrRemoveServer',
                      addProvisionValidationMessage,
                      `${addProvisionValidationMessage1} ${element?._source?.igaContent?.cn} ${addProvisionValidationMessage2}`
                    )
                  : iff(
                      type === 'AddOrRemoveServer',
                      removalProvisionValidationMessage,
                      `${removalProvisionValidationMessage1} ${element?._source?.igaContent?.cn} ${removalProvisionValidationMessage2}`
                    )
            }
            const accountDomain = element?._source?.igaContent?.distinguishedName
              ? element._source.igaContent.distinguishedName.split(',')
              : ''
            const domainName = findDomain(element?._source?.igaContent?.distinguishedName)
            const groupUrl = new URL(window.location.href)
            if (groupUrl?.href.includes('groupName')) {
              groupUrl.searchParams.set('groupName', element?._source?.igaContent?.cn)
            } else {
              groupUrl.searchParams.append('groupName', element?._source?.igaContent?.cn)
            }

            optionsArray.push({
              label: `${domainName}\\${element?._source?.igaContent?.cn}`,
              value: `${element?._source?.igaContent?.cn}`,
              dn: `${
                element?._source?.igaContent?.distinguishedName
                  ? element?._source?.igaContent?.distinguishedName
                  : ''
              }`,
              domain: accountDomain.length > 0 ? accountDomain.slice(-4)[0]?.split('=')[1] : '',
              approvers: element?._source?.igaContent?.dbagIMSApprovers?.join(', '),
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
              groupName: `${
                element?._source?.igaContent?.cn ? element?._source?.igaContent?.cn : ''
              }`,
              description: element?._source?.igaContent?.description[0],
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
              // Temporarily commenting current mapping
              // roleName: element?._source?.glossary?.kv?.filter(
              //   (gattrb) => gattrb.key === 'accessioPrerequisiteRMPRoles'
              // )[0]?.value,
              roleName:
                element?._source?.glossary?.idx &&
                element?._source?.glossary?.idx['/'] &&
                element?._source?.glossary?.idx['/']?.accessioPrerequisiteRMPRoles,
              disabledMessage: localValidationMessage,
              disabled: localIsDisabled,
              url: groupUrl?.href,
              // Temporarily commenting current mapping

              // acessionAppRequest: checkAppManagementValidation(
              //   element._source?.glossary?.kv?.filter(
              //     (gattrb) => gattrb.key === 'accessioAppRequest'
              //   )[0]?.value
              // ),
              acessionAppRequest: checkAppManagementValidation(
                element?._source?.glossary?.idx &&
                  element?._source?.glossary?.idx['/'] &&
                  element?._source?.glossary?.idx['/']?.accessioAppRequest
              ),
              provisioningBy: checkProvisioningValidation(
                element._source?.igaContent?.dbagProvisioningBy
                  ? element._source?.igaContent?.dbagProvisioningBy
                  : null
              )
            })
          })
        }
        if (id === 'PrincipalsAllowedToRetrieveManagedPassword') {
          res?.hits?.hits?.forEach(async (element) => {
            if (
              checkisGMSAGroup(
                id,
                element?._source?.glossary?.idx &&
                  element?._source?.glossary?.idx['/'] &&
                  element?._source?.glossary?.idx['/']?.accessioIsgMSAGroup
                // element._source?.glossary?.kv?.filter(
                //   (gattrb) => gattrb?.key === 'accessioIsgMSAGroup'
                // )[0]?.value
              )
            ) {
              return
            }

            optionsArray.push({
              label: `${element?._source?.igaContent?.cn ? element?._source?.igaContent?.cn : ''}`,
              value: `${
                element?._source?.igaContent?.distinguishedName
                  ? element?._source?.igaContent?.distinguishedName
                  : ''
              }`
            })
          })
        }
        if (id === 'servicePrincipalName') {
          res?.hits?.hits?.forEach(async (element) => {
            optionsArray.push({
              label: `${element?._source?.igaContent?.cn}`,
              value: `${element?._source?.igaContent?.cn}`,
              portNo: '',
              serviceclass: ''
            })
          })
        }
        if (id === 'serverType') {
          res?.hits?.hits?.forEach(async (element) => {
            let localIsDisabled = false
            const serverDomain = element?._source?.igaContent?.distinguishedName
              ? element._source.igaContent.distinguishedName.split(',')
              : ''
            const domainName = findDomain(element?._source?.igaContent?.distinguishedName)
            // disabled the already selected items
            if (
              groupMembershipData[0].value?.filter(
                (itm) => itm.dn === element?._source?.igaContent?.distinguishedName
              ).length > 0
            ) {
              localIsDisabled = true
            }

            optionsArray.push({
              label: `${domainName}\\${element?._source?.igaContent?.cn}`,
              value: `${element?._source?.igaContent?.cn}`,
              serverName: `${
                element?._source?.igaContent?.cn ? element?._source?.igaContent?.cn : ''
              }`,
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
              disabled: localIsDisabled,
              osVersion: `${
                element?._source?.igaContent?.object?.operatingSystem
                  ? element?._source?.igaContent?.object?.operatingSystem
                  : ''
              }`
            })
          })
        }

        setOptions(optionsArray)
      } else {
        setOptions([])
      }
    })
  }
  // TODO : Call a callback function to add the data to a table and resetting the options to empty
  const handleClick = (event, vaue, element) => {
    handleCallback(element.id, selectValueObjArr)
    setInputValue('')
    setOptions([])
    setInputValueObjArr([])
    // onChangeHandler(event, selectValueObj, categoryInfo)
  }

  const handleClose = (item) => {
    setAutocompleteOpen(false)
    if (
      !isSelectedValue &&
      isSelectedValue !== undefined &&
      !['department', 'dbagCostcenter', 'dbagApplicationID', 'samDbagApplicationID'].includes(item)
    ) {
      setInputValue('')
    }
  }
  const handleOpen = () => {
    if (inputValue.length > 2) {
      setAutocompleteOpen(true)
    }
  }

  const getOptionsDelayed = React.useCallback(
    debounce((text) => {
      setOptions([])
      setOpen(false)
      const data =
        queryparameters &&
        queryparameters.length &&
        queryparameters.filter((item) => item !== '').length
          ? queryparameters.reduce(
              (map, itm) => ({
                ...map,
                [itm]: iff(
                  itm === 'domain',
                  groupOwner && groupOwner[2]?.value,
                  itm === 'exactMatch' ? false : text
                )
              }),
              {}
            )
          : {}
      if (
        [
          'accountType',
          'groupType',
          'groupTypeForServer',
          'PrincipalsAllowedToRetrieveManagedPassword'
        ].includes(id)
      ) {
        if (text.length) {
          const payload = {
            searchValue: text,
            pageSize: 100,
            pageNumber: 0
          }
          callMembershipOptionsApi(url, payload)
        }
      } else if (['serverType', 'servicePrincipalName'].includes(id)) {
        if (text.length) {
          const payload = {
            serverCN: text,
            pageSize: 100,
            pageNumber: 0
          }
          callMembershipOptionsApi(url, payload)
        }
      } else {
        accountApi.getOptionsById(url, data).then((res) => {
          if (res && res.length > 0) {
            setOptions(res)
            setAutocompleteOpen(true)
          }
        })
      }
    }, 1000),
    []
  )

  React.useEffect(() => {
    let active = true
    if (active) {
      if (inputValue && inputValue.length > 2 && isSelectedValue && isMultiple) {
        setInputValueObjArr([...inputValueObjArr])

        setDisableValueObjArr([...disableValueObjArr, inputValue])
        setDisableValueGrpObjArr([...disableValueObjGrpArr, inputValue])
      }
      if (inputValue && inputValue.length > 2 && !isSelectedValue) {
        setDisableValueObjArr([...disableValueObjArr])
        setDisableValueGrpObjArr([...disableValueObjGrpArr])

        setInputValueObj(null)
        setOpen(true)
        getOptionsDelayed(inputValue, (filteredOptions) => {
          setOpen(false)
          if (filteredOptions && filteredOptions.length > 0) {
            setOptions(filteredOptions)
            setAutocompleteOpen(true)
          }
        })
      }
      if (inputValue && inputValue.length <= 2) {
        if (isMultiple && inputValueObjArr.length > 0) {
          setOptions([])
        }
      }
    }
    return () => {
      setIsSelectedValue(false)
      active = false
    }
  }, [inputValue])

  React.useEffect(() => {
    setIsSelectedValue(selectValueObj?.flag)
    setInputValue(selectValueObj?.label)
    if (
      selectValueObj &&
      [
        'accountType',
        'groupType',
        'serverType',
        'groupTypeForServer',
        'servicePrincipalName'
      ].includes(id)
    ) {
      setInputValue('')
    }
  }, [selectValueObj])

  React.useEffect(() => {
    setIsSelectedValue(selectValueObjArr?.flag)
  }, [selectValueObjArr])

  React.useEffect(() => {
    if (typeof accounts !== 'undefined' && accounts.length) {
      setDisableValueObjArr([...accounts])
    }
  }, [accounts])

  React.useEffect(() => {
    if (typeof groups !== 'undefined') {
      setDisableValueGrpObjArr([...groups])
    }
  }, [groups])

  React.useEffect(() => {
    if (typeof toggleForm !== 'undefined' && toggleForm) {
      setDisableValueObjArr([])
      setDisableValueGrpObjArr([])
    }
  }, [toggleForm])
  React.useEffect(() => {
    if (typeof toggleForm !== 'undefined' && toggleForm) {
      setDisableValueObjArr([])
      setDisableValueGrpObjArr([])
    }
  }, [toggleFormServer])

  React.useEffect(() => {
    if (Array.isArray(autocompleteValue) && autocompleteValue.length === 0) {
      // code for handling when autocompleteValue is reset
      setInputValue('')
      setOptions([])
    }
    if (autocompleteValue === '') {
      setInputValue(autocompleteValue)
      setOptions([])
    }
    if (!isMultiple && autocompleteValue && autocompleteValue.label) {
      // Set initial value object if available
      const selectedObject = {
        label: autocompleteValue.label,
        value: autocompleteValue.value,
        flag: true
      }
      setSelectValueObj(selectedObject)
    } else {
      // Set initial value object if available
      if (
        (inputValue && inputValue.length > 2 && inputValueObjArr.length > 0) ||
        (inputValue && inputValue.length > 2 && disableValueObjArr.length > 0)
      ) {
        setInputValueObjArr([...inputValueObjArr, autocompleteValue])
        setDisableValueObjArr([...disableValueObjArr, autocompleteValue])
        setDisableValueGrpObjArr([...disableValueObjGrpArr, autocompleteValue])
      } else if (typeof autocompleteValue === 'object') {
        setInputValueObjArr(autocompleteValue)
      }
      setSelectValueObjArr(autocompleteValue)
    }
  }, [autocompleteValue])

  const getDisableOption = (disableValueArray, optionValue) => {
    let filterArray
    if (disableValueArray.length > 0) {
      filterArray = disableValueArray.filter((item) => item.dn === optionValue.dn)
    }

    const disabledValue = !!(filterArray && filterArray !== undefined && filterArray.length > 0)
    return disabledValue
  }

  return isMultiple ? (
    <>
      <Autocomplete
        id={id}
        readOnly={readOnly}
        disabled={disabled}
        getOptionDisabled={(option) => {
          if (['accountType', 'serverType'].includes(id)) {
            if (
              disableValueObjArr.length >= maxLimit ||
              getDisableOption(disableValueObjArr, option)
            ) {
              return true
            }
            return false
          }
          if (['groupType', 'groupTypeForServer'].includes(id)) {
            if (
              disableValueObjGrpArr.length >= maxLimit ||
              getDisableOption(disableValueObjGrpArr, option)
            ) {
              return true
            }
            return false
          }

          if (inputValueObjArr.length >= maxLimit || inputValueObjArr.includes(option)) {
            return true
          }
          return false
        }}
        disableCloseOnSelect="true"
        clearOnBlur
        filterOptions={(x) => x} // This condition to filter values without condition
        noOptionsText={autocompleteNoOptionText}
        onChange={(e, v, reason) => {
          let filterValue

          setSelectValueObjArr(v)
          if (v && v.length > 0 && (v[0].serverName || v[0].accountName)) {
            setDisableValueObjArr(v)
          }
          if (v && v.length > 0 && v[0].groupName) {
            setDisableValueGrpObjArr(v[0])
          }
          // Reset the prefetch option
          optionReset(id)
          if (['accountType', 'groupType', 'groupTypeForServer', 'serverType'].includes(id)) {
            if (reason === 'removeOption') {
              const tempArray = JSON.parse(JSON.stringify(selectValueObjArr))
              const tempV = JSON.parse(JSON.stringify(v))
              filterValue = tempArray.filter(
                ({ label: id1 }) => !tempV.some(({ label: id2 }) => id2 === id1)
              )
            }
            if (reason === 'clear') {
              filterValue = JSON.parse(JSON.stringify(v))
            }
          }

          onChangeHandler(
            e,
            ['removeOption', 'clear'].includes(reason) ? filterValue : v,
            categoryInfo,
            reason,
            selectValueObjArr,
            v
          )
          onChangeHandler(e, v, categoryInfo) // Needs this twice piece of code to show labels in place holder for autocomplete

          // Clear input once selection is made
          if (v && v.length >= 0) {
            setInputValue('')
          }
        }}
        inputValue={inputValue}
        onInputChange={(e, newInputValue, reason) => {
          if (reason !== 'input') {
            return
          }
          if (newInputValue.length === 0) {
            onChangeHandler(e, newInputValue, categoryInfo)
          }
          if (newInputValue > 2) {
            setAutocompleteOpen(true)
            setOpen(true)
            setInputValueObjArr([])
          }
          setInputValue(newInputValue)
        }}
        sx={{
          background: `${theme === 'dark' ? 'transparent' : 'rgba(255,255,255,1) !important'}`,
          width: '95%'
        }}
        value={inputValueObjArr}
        multiple={isMultiple}
        isOptionEqualToValue={(option, value) => option.label === value.label}
        getOptionLabel={(option) => (option.label ? option.label : '')}
        options={optionFinder.length >= 1 && options.length === 0 ? optionFinder : options}
        loading={loading}
        required={required}
        renderInput={(params) => (
          <TextField
            error={error}
            required={required}
            helperText={helperText}
            {...params}
            label={title}
            InputProps={{
              ...params?.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params?.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
        renderOption={(props, option, { selected }) => (
          <Box
            sx={{
              borderStyle: 'solid',
              borderColor: `${theme === 'dark' ? '#4f545b' : '#E7E7E7'}`,
              borderWidth: '1.5px',
              borderRadius: 0.1,
              opacity: `${props['aria-disabled'] ? '1' : '1'}!important`,
              backgroundColor: `${theme === 'dark' ? '#1a2129' : '#FFF'} !important`,
              '&:hover,&:focus': {
                boxShadow: '1px -1px 1px #A9A9A9',
                backgroundColor: `${theme === 'dark' ? '#1a2129' : '#FFF'} !important`
              }
            }}
            {...props}
          >
            {/* eslint-disable no-plusplus */}
            <Checkbox
              key={index++}
              icon={icon}
              checkedIcon={checkedIcon}
              checked={selected}
              disabled={
                ['serverType', 'accountType'].includes(id)
                  ? !!(
                      disableValueObjArr.length >= maxLimit ||
                      getDisableOption(disableValueObjArr, option)
                    )
                  : !!(
                      disableValueObjGrpArr.length >= maxLimit ||
                      getDisableOption(disableValueObjGrpArr, option)
                    )
              }
            />
            {option.label}
          </Box>
        )}
      />
      {categoryInfo?.needButton ? (
        <Button
          variant="contained"
          sx={{ height: '50px', width: 'auto', marginLeft: '10px' }}
          name={categoryInfo?.buttonInfo?.id}
          onClick={(e, v) => handleClick(e, v, categoryInfo)}
        >
          {translate(categoryInfo?.buttonInfo?.label)}
        </Button>
      ) : null}
    </>
  ) : (
    <Autocomplete
      id={id}
      readOnly={readOnly}
      disabled={disabled}
      clearOnBlur
      filterOptions={(x) => x} // As autoCmplete feild is based on APi , we do not need other round of in-built filter
      getOptionDisabled={(option) => {
        if (groupOwner) {
          const targetIndex = groupOwner.findIndex((field) => field.id === id)
          if (
            (targetIndex === 0 &&
            Array.isArray(groupOwner[1].value) &&
            groupOwner[1]?.value.length > 0
              ? groupOwner[1]?.value.find((owner) => owner === option.value)
              : false) ||
            (targetIndex === 1 &&
            Array.isArray(groupOwner[0].value) &&
            groupOwner[0]?.value.length > 0
              ? groupOwner[0]?.value.find((owner) => owner === option.value)
              : false)
          ) {
            return true
          }
        }
        if (option.disabled) {
          return true
        }
        return false
      }}
      noOptionsText={autocompleteNoOptionText}
      onChange={(e, v) => {
        setSelectValueObj({ label: v && v.label ? v.label : '', flag: true }) // Commented as it is calling everytime on Autocomplete Selection. Need to confirm
        // Reset the prefetch option
        optionReset(id)
        onChangeHandler(e, v, categoryInfo)
      }}
      open={autocompleteOpen}
      onOpen={handleOpen}
      onClose={() => handleClose(id)}
      inputValue={inputValue}
      onInputChange={(e, newInputValue, reason) => {
        if (reason !== 'input') {
          return
        }
        onChangeHandler(e, newInputValue, categoryInfo)
        setInputValue(newInputValue)
      }}
      sx={{
        background: `${theme === 'dark' ? 'transparent' : '#FFF'}`,
        width: '100%'
      }}
      value={inputValueObj}
      isOptionEqualToValue={(option, value) => {
        console.log('option', option, 'value', value)
        return option.label === value.label
      }}
      getOptionLabel={(option) => (option.label ? option.label : '')}
      options={optionFinder.length >= 1 && options.length === 0 ? optionFinder : options}
      loading={loading}
      required={required}
      renderInput={(params) => (
        <TextField
          error={error}
          required={required}
          helperText={helperText}
          placeholder={placeholder}
          {...params}
          label={title}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
      renderOption={(props, option) => (
        <Tooltip title={option.disabled ? option.disabledMessage : ''}>
          <Box
            {...props}
            sx={{
              borderStyle: 'solid',
              borderColor: `${theme === 'dark' ? '#4f545b' : '#E7E7E7'}`,
              borderWidth: 'thin',
              borderRadius: 0.1,
              backgroundColor: `${theme === 'dark' ? '#1a2129' : '#FFFFFF'} !important`,
              '&:hover,&:focus': {
                boxShadow: '1px -1px 1px #A9A9A9',
                backgroundColor: `${theme === 'dark' ? '#1a2129' : '#FFFFFF'} !important`
              },
              '&:active': {
                pointerEvents: `${props['aria-disabled'] ? 'none' : 'inherit'}!important`
              },
              opacity: `${props['aria-disabled'] ? '0.90' : '1'}!important`,
              color: iff(
                theme === 'dark',
                `${props['aria-disabled'] ? '#a4a4a4' : '#FFFFFF'}`,
                `${props['aria-disabled'] ? '#a4a4a4' : '#565656'}`
              ),
              pointerEvents: `${props['aria-disabled'] ? 'inherit' : 'inherit'}!important`
            }}
          >
            {option.label}
          </Box>
        </Tooltip>
      )}
    />
  )
}

export default AutocompleteWrapper
