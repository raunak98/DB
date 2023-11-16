import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Button from '@mui/material/Button'
import { Link, useHistory } from 'react-router-dom'
import { Typography, Grid, Tooltip } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Breadcrumb from 'components/breadcrumb'
import translate from 'translations/translate'
import { getPersonalAssetsByMail } from 'helpers/utils'
import * as assetsApi from '../../../api/assetsManagement'
import {
  selectMyAssetsItems,
  selectAssetsPageSize,
  selectAssetsPageNumber
} from '../../../redux/myAssets/myAssets.selector'
import { selectMyTeamSearchItem } from '../../../redux/myTeam/myTeam.selector'
import { selectAccountTypeItems } from '../../../redux/dashboard/dashboard.selector'

import {
  updateShowBigLoader,
  fetchMyAssetsItemsStart
} from '../../../redux/myAssets/myAssets.action'
import useTheme from '../../../hooks/useTheme'
import * as Styled from '../style'
import * as accountApi from '../../../api/accountManagement'
import { updateReviewNotificationMessage } from '../../../redux/review/review.action'
import { fetchAccountTypeItemsSuccess } from '../../../redux/dashboard/dashboard.action'
import { selectprofileDetails } from '../../../redux/profile/profile.selector'
import { applicationNamePrefix } from '../../../helpers/utils'

const AccountSummary = () => {
  const [summary, setSummary] = useState([])
  const history = useHistory()
  const [accountName, setAccountName] = useState('')
  const { theme } = useTheme()
  const results = useSelector(selectMyAssetsItems)
  const [modifySummaryStrucutre, setModifySummaryStructure] = useState({})
  const params = new URLSearchParams(window.location.search)
  const requestId = params.get('id')
  const dispatch = useDispatch()
  const type = localStorage.getItem('component')
  const myTeamSelectedUserId = localStorage.getItem('myTeam-userId')
  const myTeamSelectedUser = localStorage.getItem('myTeam-userName')
  const [isDisabled, setIsDisabled] = useState(false)
  const profileDetails = useSelector(selectprofileDetails)
  const myTeamAssetProfile = useSelector(selectMyTeamSearchItem)
  const accountTypeItems = useSelector(selectAccountTypeItems)
  const pageSize = useSelector(selectAssetsPageSize)
  const pageNumber = useSelector(selectAssetsPageNumber)
  const uinqueReqError = translate('request.unique.errormessage')
  const deleteSuccess = translate('delete.success')
  const deleteError = translate('delete.error')
  const [isStatusDisabled, setIsStatusDisabled] = useState(false)
  const [isDeleteAccTypeDisabled, setIsDeleteAccTypeDisabled] = useState(false)

  useEffect(async () => {
    if (!accountTypeItems?.accountTypeItems && accountTypeItems?.length === 0) {
      dispatch(updateShowBigLoader(true))
      const resp = await accountApi.getAccountCategory()
      dispatch(fetchAccountTypeItemsSuccess({ accountTypeItems: resp }))
      if (resp) {
        assetsApi.getAssetsSummaryStructure().then((res) => {
          setModifySummaryStructure(res)
          dispatch(updateShowBigLoader(false))
        })
      } else {
        dispatch(updateShowBigLoader(false))
      }
    } else {
      dispatch(updateShowBigLoader(true))
      assetsApi.getAssetsSummaryStructure().then((res) => {
        setModifySummaryStructure(res)
        dispatch(updateShowBigLoader(false))
      })
    }

    return () => {
      localStorage.removeItem('assetsData')
    }
  }, [])

  const handleConfirm = () => {
    let selectedObj
    if (results && Object.keys(results).length !== 0) {
      selectedObj = results?.assetsData?.filter((response) => response.id === requestId)
      // call delete API
    }
    if (selectedObj) {
      dispatch(updateShowBigLoader(true))
      const payload = {
        common: {
          applicationName: `${applicationNamePrefix}DBG`,
          accountName: selectedObj[0].sAMAccountName ? selectedObj[0].sAMAccountName : '',
          operation: 'Delete',
          category: 'AD Account',
          recepientMail: selectedObj[0].recipientId ? selectedObj[0].recipientId : '',
          requestorMail: profileDetails?.mail ? profileDetails?.mail : '',
          requestJustification: '',
          sAMAccountName: selectedObj[0].sAMAccountName ? selectedObj[0].sAMAccountName : '',
          accountType: selectedObj[0].category ? selectedObj[0].category : '',
          accountDescription:
            typeof selectedObj[0].description === 'string' ? selectedObj[0].description : '',
          rFirstName: profileDetails?.givenName ? profileDetails?.givenName : '',
          rLastName: profileDetails?.sn ? profileDetails?.sn : ''
        }
      }

      accountApi.deleteAdAccount(payload).then((res) => {
        /* eslint no-underscore-dangle: 0 */
        const userId = type === 'MyTeam' ? myTeamAssetProfile[0].id : profileDetails?._id
        if (res.status === 200) {
          dispatch(
            updateReviewNotificationMessage({
              type: 'Success',
              message: deleteSuccess
            })
          )
          dispatch(
            fetchMyAssetsItemsStart(getPersonalAssetsByMail(userId, pageSize, pageNumber)) // TODO : check the pagination value.
          )

          dispatch(updateShowBigLoader(false))
        } else {
          dispatch(
            updateReviewNotificationMessage({
              type: 'Error',
              message: deleteError
            })
          )
          dispatch(
            fetchMyAssetsItemsStart(getPersonalAssetsByMail(userId, pageSize, pageNumber)) // TODO : check the pagination value.
          )
          dispatch(updateShowBigLoader(false))
        }
      })
    }
  }
  const getAccountTypePermissions = (category) => {
    const catPermissions = accountTypeItems?.accountTypeItems?.filter(
      (acc) => acc.label === category
    )[0]
    return catPermissions ? !catPermissions.availableForAmend : false
  }
  const checkAccountTypeModifyPermission = (dItem) => getAccountTypePermissions(dItem.category)
  const getAccountTypeDeletePermissions = (category) => {
    const catPermissions = accountTypeItems?.accountTypeItems?.filter(
      (acc) => acc.label === category
    )[0]
    return catPermissions ? !catPermissions.availableForDelete : false
  }
  const checkAccountTypeDeletePermissions = (dItem) => {
    const accTypePermissions = getAccountTypeDeletePermissions(dItem.category)
    return accTypePermissions
  }
  useEffect(() => {
    dispatch(updateShowBigLoader(true))
    let selectedSummaryDetails
    if (results && Object.keys(results).length !== 0) {
      selectedSummaryDetails = results?.assetsData?.filter((response) => response.id === requestId)
      localStorage.setItem('assetsData', JSON.stringify(selectedSummaryDetails[0]))
    } else {
      selectedSummaryDetails = [JSON.parse(localStorage.getItem('assetsData'))]
    }
    if (!['', undefined, null].includes(selectedSummaryDetails[0]?.sAMAccountName)) {
      setAccountName(selectedSummaryDetails[0]?.sAMAccountName)
    }
    setIsDisabled(
      !!selectedSummaryDetails[0]?.accountStatusValidationString?.includes(
        'Disabled By dbAccessGate' || checkAccountTypeModifyPermission(selectedSummaryDetails[0])
      )
    )
    setIsStatusDisabled(
      selectedSummaryDetails[0]?.accountStatus &&
        selectedSummaryDetails[0]?.accountStatus === 'Disabled'
    )
    setIsDeleteAccTypeDisabled(checkAccountTypeDeletePermissions(selectedSummaryDetails[0]))
    if (
      modifySummaryStrucutre &&
      Object.keys(modifySummaryStrucutre).length !== 0 &&
      selectedSummaryDetails.length !== 0
    ) {
      const summarySteps = [...modifySummaryStrucutre.steps].map((step) => {
        const targetedChildern = step.children.map((child) => {
          if (
            child?.relatedTo
              ? child.relatedTo.includes(selectedSummaryDetails[0].category)
              : true && selectedSummaryDetails[0][child.id]
          ) {
            if (
              (typeof selectedSummaryDetails[0][child.id] === 'object' &&
                selectedSummaryDetails[0][child.id].length > 0) ||
              (typeof selectedSummaryDetails[0][child.id] === 'string' &&
                selectedSummaryDetails[0][child.id] !== '')
            ) {
              return { ...child, value: selectedSummaryDetails[0][child.id] }
            }
            return false
          }
          return false
        })
        return { ...step, children: targetedChildern }
      })
      setSummary(summarySteps)
    }
    dispatch(updateShowBigLoader(false))
  }, [results, modifySummaryStrucutre])

  const checkUniqueRequest = async () => {
    dispatch(updateShowBigLoader(true))
    const selectedObj = results?.assetsData?.filter((response) => response.id === requestId)
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
                  targetValue: selectedObj[0]?.sAMAccountName ? selectedObj[0]?.sAMAccountName : ''
                }
              },
              {
                operator: 'EQUALS',
                operand: {
                  targetName: 'request.common.sAMAccountName',
                  targetValue: selectedObj[0]?.sAMAccountName ? selectedObj[0]?.sAMAccountName : ''
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

  const handleDelete = async () => {
    if (await checkUniqueRequest()) {
      handleConfirm()
    } else {
      dispatch(
        updateReviewNotificationMessage({
          type: 'Error',
          message: uinqueReqError
        })
      )
    }
  }
  const handleModify = async () => {
    const uniqueRequest = await checkUniqueRequest()
    if (uniqueRequest) {
      history.push(`/my-asset/modify?id=${requestId}`)
    } else {
      dispatch(
        updateReviewNotificationMessage({
          type: 'Error',
          message: uinqueReqError
        })
      )
    }
  }

  const breadcrumbsAction = () => {
    switch (type) {
      case 'MyTeam':
        return [
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          { label: translate('navItem.label.myTeam'), url: '/my-team' },
          { label: `${myTeamSelectedUser}`, url: `/my-team/${myTeamSelectedUserId}` },
          { label: ` ${accountName}`, url: '' }
        ]
      case 'Drafts':
        return [
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          { label: translate('drafts.header.title'), url: '/drafts' },
          { label: ` ${accountName}`, url: '' }
        ]
      case 'AccountAdmin':
        return [
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          { label: translate('admin.header.title'), url: '/admin' },
          { label: translate('accountAdmin.header'), url: '/admin/AccountAdmin' },
          { label: ` ${accountName}`, url: '' }
        ]
      default:
        return [
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          { label: translate('myAssets.header'), url: '/my-asset' },
          { label: ` ${accountName}`, url: '' }
        ]
    }
  }

  const backButtonAction = () => {
    switch (type) {
      case 'MyTeam':
        return `/my-team/${myTeamSelectedUserId}`
      case 'Drafts':
        return '/drafts'
      case 'Admin':
        return '/admin/AccountAdmin'
      default:
        return '/my-asset'
    }
  }

  return (
    <>
      <Link to={backButtonAction()} style={{ textDecoration: 'none' }}>
        <Button
          variant="text"
          sx={{ fontSize: '14px', color: theme === 'dark' ? '#FFF' : '#0A1C33' }}
        >
          ← {translate('review.back')}
        </Button>
      </Link>
      <Breadcrumb path={breadcrumbsAction()} />

      <div
        style={{
          backgroundColor: theme === 'dark' ? '#1A2129' : '#FFF',
          padding: '5px 10px 5px 15px'
        }}
      >
        <h1>{translate('metaData.accountDetails')}</h1>
        {summary &&
          summary.map((sitem, index) => (
            <Accordion key={sitem.heading} disableGutters defaultExpanded>
              <AccordionSummary
                key={index}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="`{sitem.heading}_summary`}"
                sx={{
                  backgroundColor: theme === 'dark' ? '#3C485A' : '#EFF9FC'
                }}
              >
                <Typography sx={{ fontSize: '16px' }}>{translate(`${sitem.heading}`)}</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  backgroundColor: theme === 'dark' ? '#1A2129' : '#FFF',
                  padding: '10x 8px'
                }}
              >
                <Grid container spacing={4}>
                  {sitem.children &&
                    sitem.children.map((element, i) =>
                      typeof element === 'object' ? (
                        <Grid item xs={6} sx={{ display: 'flex' }} key={i}>
                          <Grid item xs={6} md={3} pl={5} key={element.label}>
                            <p>
                              <strong>{translate(`${element.label}`)} : </strong>
                            </p>
                          </Grid>
                          <Grid item xs={6} md={9} key={element.value}>
                            <p>{element.value}</p>
                          </Grid>
                        </Grid>
                      ) : null
                    )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        <Styled.SubmitButtonWrapper>
          {isDisabled ? (
            <Tooltip title={translate('action.notAllowed.message')}>
              <span>
                <Button
                  onClick={() => {
                    handleModify()
                  }}
                  variant="outlined"
                  sx={{
                    marginRight: '8px',
                    color: `${theme === 'dark' ? '#fff' : '#000'}`,
                    borderColor: `${theme === 'dark' ? '#fff' : '#000'}`
                  }}
                  disabled={isDisabled}
                >
                  {translate('myAssets.modify')}
                </Button>
              </span>
            </Tooltip>
          ) : (
            <Button
              onClick={() => {
                handleModify()
              }}
              variant="outlined"
              sx={{
                marginRight: '8px',
                color: `${theme === 'dark' ? '#fff' : '#000'}`,
                borderColor: `${theme === 'dark' ? '#fff' : '#000'}`
              }}
              disabled={isDisabled}
            >
              {translate('myAssets.modify')}
            </Button>
          )}
          {isStatusDisabled && !isDeleteAccTypeDisabled ? (
            <Button
              variant="outlined"
              sx={{
                color: `${theme === 'dark' ? '#fff' : '#000'}`,
                borderColor: `${theme === 'dark' ? '#fff' : '#000'}`
              }}
              onClick={() => handleDelete()}
            >
              {translate('review.delete')}
            </Button>
          ) : null}
        </Styled.SubmitButtonWrapper>
      </div>
    </>
  )
}

export default AccountSummary
