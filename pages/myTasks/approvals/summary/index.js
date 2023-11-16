import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Button from '@mui/material/Button'
import { Typography, Grid, Box } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import translate from 'translations/translate'
import Breadcrumb from 'components/breadcrumb'
import { selectMyTeamSearchItem } from 'redux/myTeam/myTeam.selector'
import Loading from '../../../../components/loading'
import {
  updateShowBigLoader,
  fetchApprovalsItemsStart,
  updateApprovalsNotificationMessage
} from '../../../../redux/approvals/approvals.action'
import {
  selectApprovalsPageNumber,
  selectApprovalsPaginationKeys,
  selectApprovalsSearchAfterKeyword,
  selectApprovalsItems,
  selectShowBigLoader
} from '../../../../redux/approvals/approvals.selector'
import { selectprofileDetails } from '../../../../redux/profile/profile.selector'
import * as approvalApi from '../../../../api/approvals'
import useTheme from '../../../../hooks/useTheme'
import * as justificationApi from '../../../../api/justifications'
import { getFormattedDateTime } from '../../../../helpers/strings'
import * as Styled from '../style'

const Summary = () => {
  const [summary, setSummary] = useState([])
  const [phaseId, setPhaseId] = useState('')
  const [status, setStatus] = useState('')
  const [open, setOpen] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const [isError, setIsError] = React.useState(false)
  const [accessioRequestNo, setAccessioRequestNo] = React.useState('')
  const [isVipApprover, setIsVipApprover] = React.useState(false)
  const [requestType, setRequestType] = React.useState('')
  const [type, setType] = useState('')
  const { theme } = useTheme()
  const dispatch = useDispatch()
  const history = useHistory()
  const requestId = localStorage.getItem('approvalId')
  const approvalSucessMsg = `${translate('approval.success')} ${translate(
    'approval.forRequestNo'
  )} ${accessioRequestNo}`
  const approvalErrMsg = `${translate('approval.errorMsg')} ${translate(
    'approval.forRequestNo'
  )} ${accessioRequestNo}`
  const rejectSucessMsg = `${translate('approval.reject.success')} ${translate(
    'approval.forRequestNo'
  )} ${accessioRequestNo}`
  const rejectErrMsg = `${translate('approval.reject.errorMsg')} ${translate(
    'approval.forRequestNo'
  )} ${accessioRequestNo}`
  const pageNumber = useSelector(selectApprovalsPageNumber)
  const paginationKeysArray = useSelector(selectApprovalsPaginationKeys)
  const searchAfterKeywords = useSelector(selectApprovalsSearchAfterKeyword)
  const myTeamDetails = useSelector(selectMyTeamSearchItem)
  const results = useSelector(selectApprovalsItems)
  const showBigLoader = useSelector(selectShowBigLoader)
  const profileDetails = useSelector(selectprofileDetails)
  const successMessage = translate('justification.approver.successMsg')
  const commentErrorMessage = translate('justification.requestInfo.comment.errorMsg')
  const requestErrorMessage = translate('justification.requestInfo.request.errorMsg')
  const component = localStorage.getItem('component')
  const [isMemebrshipData, setisMemebrshipData] = useState(false)

  const optionalAttributes = ['dbagFileSystemFullPaths', 'dbagSupportGroup', 'dbagsupportGroup']
  const handleJustification = (e) => {
    setMessage(e.target.value)
    setIsError(e.target.value === '')
  }

  const dispatchApprovalsData = () => {
    let payload = {}
    if (pageNumber > 0) {
      if (component === 'MyTeam') {
        payload = {
          id: myTeamDetails[0].id,
          recipientMail: myTeamDetails[0].email,
          search_after_primaryKey: paginationKeysArray ? paginationKeysArray.slice(-1)[0] : null,
          search_after_keyword: searchAfterKeywords ? searchAfterKeywords.slice(-1)[0] : null
        }
      } else {
        payload = {
          search_after_primaryKey: paginationKeysArray ? paginationKeysArray.slice(-1)[0] : null,
          search_after_keyword: searchAfterKeywords ? searchAfterKeywords.slice(-1)[0] : null
        }
      }

      dispatch(fetchApprovalsItemsStart(payload))
    } else {
      if (component === 'MyTeam') {
        payload = {
          id: myTeamDetails[0].id,
          recipientMail: myTeamDetails[0].email
        }
      }
      dispatch(fetchApprovalsItemsStart(component === 'MyTeam' ? payload : null))
    }
  }

  const showNotificationMessage = (statusCode) => {
    if (statusCode === 200) {
      dispatch(updateShowBigLoader(false))
      history.push(component === 'MyTeam' ? `/my-team/${myTeamDetails[0]?.id}` : '/tasks/approvals')
      dispatch(
        updateApprovalsNotificationMessage({
          type: 'Success',
          message: requestType === 'approveReq' ? approvalSucessMsg : rejectSucessMsg,
          action: 'confirm',
          actionType: 'Approve'
        })
      )
      dispatchApprovalsData()
    } else {
      dispatch(updateShowBigLoader(false))
      dispatch(
        updateApprovalsNotificationMessage({
          type: 'Error',
          message: requestType === 'approveReq' ? approvalErrMsg : rejectErrMsg
        })
      )
    }
  }

  const handleConfirm = (defaultMessage, request) => {
    let payload = {}
    if (message.trim() === '') {
      setIsError(true)
      return false
    }
    setOpen(false)

    // TODO : CALL APPROVE/REJECT based on Component
    if (component === 'MyTeam' || isVipApprover) {
      payload = {
        LMMail: profileDetails.mail,
        decision: request === 'approveReq' ? 'approve' : 'reject',
        requestId,
        Decision_Comment: {
          comment: message || defaultMessage
        },
        phaseName: phaseId
      }

      approvalApi
        .approveRejectLM(payload)
        .then((res) => {
          showNotificationMessage(res?.status)
        })
        .catch((err) => {
          console.error(err)
          dispatch(
            updateApprovalsNotificationMessage({
              type: 'Error',
              message: approvalErrMsg
            })
          )
          dispatchApprovalsData()
        })
    } else {
      payload = {
        comment: message || defaultMessage
      }
      dispatch(updateShowBigLoader(true))
      // API call to approve or reject the request
      approvalApi
        .approvalComment('commentReq', requestId, payload, phaseId)
        .then((resp) => {
          if (resp?.response?.status === 200 || resp?.status === 200) {
            approvalApi
              .approvalActions(request, requestId, phaseId, payload)
              .then((res) => {
                showNotificationMessage(res?.status)
              })
              .catch((err) => {
                console.error(err)
                dispatch(
                  updateApprovalsNotificationMessage({
                    type: 'Error',
                    message: request === 'approveReq' ? approvalErrMsg : rejectErrMsg
                  })
                )
                dispatchApprovalsData()
              })
          } else {
            dispatch(updateShowBigLoader(false))
            dispatch(
              updateApprovalsNotificationMessage({
                type: 'Error',
                message: commentErrorMessage
              })
            )
          }
        })
        .catch((error) => {
          console.error(error)
          dispatch(
            updateApprovalsNotificationMessage({
              type: 'error',
              message: commentErrorMessage
            })
          )
        })
    }

    return true
  }
  const handleRequestInfo = () => {
    setOpen(true)
    setRequestType('requestInfoReq')
  }
  const valueFinder = (adArray, fieldId) => {
    const targetIndex = adArray.findIndex((field) => field.id === fieldId)
    return adArray[targetIndex]?.value
  }

  const handleRequestSubmit = () => {
    dispatch(updateShowBigLoader(true))
    if (message.trim() === '') {
      setIsError(true)
    } else {
      setOpen(false)
      const respData = results?.approvalData?.filter((response) => response.id === requestId)

      const payloadComments = {
        comment: message
      }

      approvalApi
        .approvalComment('commentReq', requestId, payloadComments, phaseId)
        .then((res) => {
          if (res?.status === 200) {
            const commonDetails = respData[0].common
            commonDetails.pendingJustification = true
            let requestorIDdNew = respData[0].requestorID
            if (respData[0].requestorID.indexOf('managed/user/') > -1) {
              requestorIDdNew = respData[0].requestorID.replace('managed/user/', '')
            }

            const payload = {
              requestID: respData[0].requestID,
              requestorID: requestorIDdNew,
              approverID: respData[0].approverID,
              phaseName: phaseId,
              requestDetails: {
                common: commonDetails
              }
            }

            justificationApi.reassignItem(payload).then((resp) => {
              history.push('/tasks/approvals')
              if (resp?.status === 200) {
                dispatch(
                  updateApprovalsNotificationMessage({
                    type: 'Success',
                    message: successMessage
                  })
                )
                dispatchApprovalsData()
              } else if (resp?.response?.status !== 200) {
                dispatch(
                  updateApprovalsNotificationMessage({
                    type: 'error',
                    message: requestErrorMessage
                  })
                )
                dispatchApprovalsData()
              }
            })
          } else if (res?.response?.status !== 200) {
            dispatch(
              updateApprovalsNotificationMessage({
                type: 'error',
                message: commentErrorMessage
              })
            )
            dispatchApprovalsData()
          }
        })
        .catch(() => {
          dispatch(
            updateApprovalsNotificationMessage({
              type: 'error',
              message: commentErrorMessage
            })
          )
        })
    }
  }
  const handleApprove = () => {
    setOpen(true)
    setRequestType('approveReq')
  }

  const handleReject = () => {
    setOpen(true)
    setRequestType('rejectReq')
  }
  const iff = (consition, then, otherise) => (consition ? then : otherise)

  const getSummaryStepsData = (res, responseData, accessioType = '', reqType) =>
    [...res.steps].map((step) => {
      const targetedChildern = step.children.map((child) => {
        const matchedData = responseData.filter((response) => response.id === child.id)
        if (matchedData.length) {
          if (reqType && reqType === 'MODIFY GROUP') {
            if (child.type === 'dropdown' && matchedData[0].value !== '') {
              let filterData
              if (child.id === 'dbagExternalProvider') {
                let newValue
                if (matchedData[0].value.length > 1) {
                  newValue = Array.isArray(matchedData[0].value)
                    ? matchedData[0].value.join('&')
                    : matchedData[0].value
                } else {
                  ;[newValue] = matchedData[0].value
                }
                filterData = child.options.filter(
                  (data) => data?.value?.toLowerCase() === newValue?.toLowerCase()
                )
                if (Array.isArray(filterData) && filterData.length === 0) {
                  filterData = child.options.filter(
                    (data) => data?.label?.toLowerCase() === newValue?.toLowerCase()
                  )
                }
              } else {
                filterData = child.options.filter(
                  (data) => data?.value?.toLowerCase() === matchedData[0]?.value?.toLowerCase()
                )
                if (Array.isArray(filterData) && filterData.length === 0) {
                  filterData = child.options.filter(
                    (data) => data?.label?.toLowerCase() === matchedData[0]?.value?.toLowerCase()
                  )
                }
              }
              return {
                ...child,
                value: filterData[0]?.label
              }
            }
            if (child.id !== 'dbagsupportGroup') {
              return { ...child, value: matchedData[0].value }
            }
          }
          if (reqType && reqType.trim() === 'MODIFY ACCOUNT') {
            if (['expiry', 'dbagApplicationID'].includes(child.id)) {
              if (
                (typeof matchedData[0]?.value === 'string' && matchedData[0].value !== '') ||
                (Array.isArray(matchedData[0]?.value) && matchedData[0].value?.length > 0)
              ) {
                return {
                  ...child,
                  value: matchedData[0].value
                }
              }
            }
          }
          if ('relatedTo' in child) {
            if (child.relatedTo.includes(accessioType)) {
              if (child.id === 'recertificationPeriod' && matchedData[0].value !== '') {
                return { ...child, value: `${matchedData[0].value} Month(s)` }
              }
              if (child.id === 'passwordNeverExpires') {
                if ([true, false].includes(matchedData[0].value)) {
                  return { ...child, value: matchedData[0].value ? 'Yes' : 'No' }
                }
                return { ...child, value: '' }
              }
              if (child.type === 'dropdown' && matchedData[0].value !== '') {
                let filterData
                if (child.id === 'dbagExternalProvider') {
                  let newValue
                  if (matchedData[0].value.length > 1) {
                    newValue = Array.isArray(matchedData[0].value)
                      ? matchedData[0].value.join('&')
                      : matchedData[0].value
                  } else {
                    ;[newValue] = matchedData[0].value
                  }
                  filterData = child.options.filter(
                    (data) => data?.value?.toLowerCase() === newValue?.toLowerCase()
                  )
                  if (Array.isArray(filterData) && filterData.length === 0) {
                    filterData = child.options.filter(
                      (data) => data?.label?.toLowerCase() === newValue?.toLowerCase()
                    )
                  }
                } else {
                  filterData = child.options.filter(
                    (data) => data?.value?.toLowerCase() === matchedData[0]?.value?.toLowerCase()
                  )
                  if (Array.isArray(filterData) && filterData.length === 0) {
                    filterData = child.options.filter(
                      (data) => data?.label?.toLowerCase() === matchedData[0]?.value?.toLowerCase()
                    )
                  }
                }
                return {
                  ...child,
                  value: filterData[0]?.label
                }
              }
              return { ...child, value: matchedData[0].value }
            }
            return { ...child, value: '' }
          }
          if (child.id === 'accountStatus' && matchedData[0].value !== '') {
            let childValue = ''
            if (['512', '66048'].includes(matchedData[0].value)) {
              childValue = 'Enabled'
            } else if (['514', '66050'].includes(matchedData[0].value)) {
              childValue = 'Disabled'
            }
            return { ...child, value: childValue }
          }

          return {
            ...child,
            value: matchedData[0].value
          }
        }
        return false
      })
      return { ...step, children: targetedChildern }
    })

  useEffect(() => {
    if ([null, undefined, ''].includes(requestId)) {
      history.push('/tasks/approvals')
    } else {
      approvalApi.getApprovalSummary(requestId).then((responseData) => {
        setStatus(responseData?.filter((res1) => res1.id === 'status')[0]?.value)
        setPhaseId(responseData.filter((response) => response.id === 'phase')[0]?.value)
        setType(responseData[0].value)
        setAccessioRequestNo(responseData?.filter((res1) => res1.id === 'requestNo')[0]?.value)
        setIsVipApprover(
          profileDetails?.mail ===
            responseData?.filter((res1) => res1.id === 'vipApprover')[0]?.value
        )
        const reqType = responseData?.filter((res1) => res1.id === 'requestType')[0]?.value
          ? responseData?.filter((res1) => res1.id === 'requestType')[0]?.value
          : ''

        let summarySteps
        if (responseData[0].value === 'Account') {
          const accountType = valueFinder(responseData, 'accountType')
          const rType = responseData?.filter((res1) => res1.id === 'requestType')[0]?.value
          approvalApi.getApprovalSummaryStructure().then((res) => {
            summarySteps = getSummaryStepsData(res, responseData, accountType, rType)
            setSummary(summarySteps)
          })
        } else if (responseData[0].value === 'Group') {
          const accessioType = valueFinder(responseData, 'accessioGroupType')
          approvalApi.getGroupApprovalSummaryStructure().then((res) => {
            summarySteps = getSummaryStepsData(res, responseData, accessioType, reqType)
            setSummary(summarySteps)
          })
        } else {
          approvalApi.getEntitlementSummaryStructure().then((res) => {
            const filterDataResponse = responseData.filter((data) => data.id === 'requestError')
            if (filterDataResponse[0].value === '') {
              const requestErrorInfoIndex = res.steps.findIndex((x) => x.id === 'requestErrorInfo')
              if (requestErrorInfoIndex !== -1) {
                res.steps.splice(requestErrorInfoIndex, 1)
              }
            }
            summarySteps = getSummaryStepsData(res, responseData)
            setSummary(summarySteps)
            const filterData = summarySteps.filter((data) => data.id === 'accountCategory')
            if (
              filterData &&
              filterData.length > 0 &&
              filterData[0].title === 'Entitlement Grant Details'
            ) {
              setisMemebrshipData(true)
            }
          })
        }
      })
      let payload = {}
      if (pageNumber > 0) {
        if (component === 'MyTeam') {
          payload = {
            id: myTeamDetails[0].id,
            recipientMail: myTeamDetails[0].email,
            search_after_primaryKey: paginationKeysArray ? paginationKeysArray.slice(-1)[0] : null,
            search_after_keyword: searchAfterKeywords ? searchAfterKeywords.slice(-1)[0] : null
          }
        } else {
          payload = {
            search_after_primaryKey: paginationKeysArray ? paginationKeysArray.slice(-1)[0] : null,
            search_after_keyword: searchAfterKeywords ? searchAfterKeywords.slice(-1)[0] : null
          }
        }

        dispatch(fetchApprovalsItemsStart(payload))
      } else {
        if (component === 'MyTeam') {
          payload = {
            id: myTeamDetails[0].id,
            recipientMail: myTeamDetails[0].email
          }
        }
        dispatch(fetchApprovalsItemsStart(component === 'MyTeam' ? payload : null))
      }
    }
  }, [])

  let backgroundColor = ''
  if (status === 'todo') {
    backgroundColor = '#949494'
  }
  if (status === 'completed') {
    backgroundColor = '#43A047'
  }
  if (status === 'deleted') {
    backgroundColor = '#333'
  }
  if (status === 'overdue') {
    backgroundColor = '#FA6543'
  }
  if (status === 'in-progress') {
    backgroundColor = '#1565C0'
  }
  const getCommentDeatils = (element) =>
    element.id === 'providedComments' && Array.isArray(element?.value) ? (
      <div>
        {element?.value.map((ele) =>
          (ele?.user?.id === 'SYSTEM' ||
            ['etl', 'accessio', 'IGAdminUser'].includes(ele?.user?.givenName)) &&
          ![undefined, '', null].includes(ele?.comment) ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <strong key={ele}>
                {translate('approval.SYSTEMGENERATED')} `${getFormattedDateTime(ele.timeStamp)}`
              </strong>
              <p key={ele}>{ele.comment}</p>
            </div>
          ) : (
            iff(
              ['reassign', 'updateStatus', 'comment'].includes(ele.action) &&
                ![undefined, '', null].includes(ele?.comment),
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <strong key={ele}>
                  {`${ele.user.givenName} ${ele.user.sn} (${ele.user.mail}) ${getFormattedDateTime(
                    ele.timeStamp
                  )}`}
                </strong>
                <p key={ele}>{ele.comment}</p>
              </div>,
              null
            )
          )
        )}
      </div>
    ) : (
      <p>{element.value}</p>
    )
  const getNoInforMessage = (id) =>
    id === 'providedComments'
      ? translate('approval.noComments')
      : iff(
          optionalAttributes.includes(id),
          <em>{translate('summary.notSet')}</em>,
          translate('approver.noInformation')
        )

  const headingHidden = (sitem) => {
    let count = 0
    sitem.forEach((data) => {
      if (data.value !== '' || data.value !== undefined || data.value !== null) {
        count += 1
      }
    })
    if (count > 0) {
      return true
    }
    return false
  }
  return (
    <>
      <Styled.BackButtonLink
        to={component === 'MyTeam' ? `/my-team/${myTeamDetails[0]?.id}` : '/tasks/approvals'}
      >
        <Styled.BackButton>← {translate('create.ADAccount.back')}</Styled.BackButton>
      </Styled.BackButtonLink>

      {component === 'MyTeam' ? (
        <Breadcrumb
          path={[
            { label: translate('navItem.label.dashboard'), url: './dashboard' },
            { label: translate('navItem.label.myTeam'), url: '/my-team' },
            {
              label: `${myTeamDetails[0]?.firstName} ${myTeamDetails[0]?.lastName}`,
              url: `/my-team/${myTeamDetails[0]?.id}`
            },
            { label: accessioRequestNo, url: '' }
          ]}
        />
      ) : (
        <Breadcrumb
          path={[
            { label: translate('navItem.label.dashboard'), url: './dashboard' },
            { label: translate('myTasks.header.title'), url: '/tasks' },
            { label: translate('myTasks.approvals.pendingApprovals'), url: '/tasks/approvals' },
            { label: accessioRequestNo, url: '' }
          ]}
        />
      )}

      <div>
        <Dialog
          open={open}
          PaperProps={{
            style: {
              backgroundColor: theme === 'dark' ? '#1A2129' : '#FFF',
              boxShadow: 'none',
              width: '1000px',
              height: '300px'
            }
          }}
        >
          <DialogTitle id="alert-dialog-title">
            {translate(
              requestType === 'requestInfoReq' ? 'justification.title' : 'approval.confirmText'
            )}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {translate(
                requestType === 'approveReq'
                  ? 'approval.confirm.approval'
                  : iff(
                      requestType === 'rejectReq',
                      'approval.confirm.reject',
                      'justification.submit.request'
                    )
              )}
            </DialogContentText>
          </DialogContent>
          <TextField
            onChange={(e) => handleJustification(e)}
            sx={{ margin: '0 15px' }}
            required
            multiline
            rows={6}
            id="outlined-required"
            label={
              requestType === 'requestInfoReq'
                ? translate('justification.requestLabel')
                : translate('approval.commentBtnLabel')
            }
            placeholder={
              requestType === 'requestInfoReq'
                ? translate('justification.requestPlaceholder')
                : translate('approval.commentPlaceholder')
            }
            error={isError}
            helperText={iff(
              isError === true,
              requestType === 'requestInfoReq'
                ? translate('justification.error.message')
                : translate('approval.summary.errorComment'),
              ''
            )}
          />
          <DialogActions>
            <Button
              onClick={() =>
                requestType === 'requestInfoReq'
                  ? handleRequestSubmit()
                  : handleConfirm(
                      requestType === 'approveReq' ? 'Approved' : 'Rejected',
                      requestType === 'approveReq' ? 'approveReq' : 'rejectReq'
                    )
              }
            >
              {translate(
                requestType === 'approveReq'
                  ? 'review.approve'
                  : iff(requestType === 'rejectReq', 'review.reject', 'justification.requestBtn')
              )}
            </Button>
            <Button onClick={() => setOpen(false)} autoFocus>
              {translate('approval.cancel')}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div
        style={{
          backgroundColor: theme === 'dark' ? '#1A2129' : '#FFF',
          padding: '5px 10px 5px 15px'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <h1>{translate('approval.summary.title')}</h1>
          <span
            style={{
              background: backgroundColor,
              display: 'flex',
              justifyContent: 'center',
              borderRadius: '3px',
              width: '131px',
              padding: '2px 8px',
              color: '#FFF',
              fontSize: '12px',
              fontWeight: '600',
              height: '25px',
              margin: '25px 2px'
            }}
          >
            {status ? status.toUpperCase() : ''}
          </span>
        </Box>
        {showBigLoader && <Loading />}
        {summary &&
          summary.map((sitem, index) => (
            <Accordion key={sitem.heading} disableGutters defaultExpanded>
              {type === 'Group' ? (
                headingHidden(sitem.children) && (
                  <AccordionSummary
                    key={index}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="`{sitem.heading}_summary`}"
                    sx={{
                      backgroundColor: theme === 'dark' ? '#3C485A' : '#EFF9FC'
                    }}
                  >
                    <Typography key={sitem.heading} sx={{ fontSize: '16px' }}>
                      {isMemebrshipData ? translate(sitem.heading) : translate(sitem.heading)}
                    </Typography>
                  </AccordionSummary>
                )
              ) : (
                <AccordionSummary
                  key={index}
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="`{sitem.heading}_summary`}"
                  sx={{
                    backgroundColor: theme === 'dark' ? '#3C485A' : '#EFF9FC'
                  }}
                >
                  <Typography key={sitem.heading} sx={{ fontSize: '16px' }}>
                    {isMemebrshipData ? translate(sitem.heading) : translate(sitem.heading)}
                  </Typography>
                </AccordionSummary>
              )}
              <AccordionDetails
                sx={{
                  backgroundColor: theme === 'dark' ? '#1A2129' : '#FFF',
                  padding: '10x 8px'
                }}
              >
                {[0, 1].includes(index) ? (
                  <Grid container spacing={4} key={`grid_${sitem.heading}`}>
                    {sitem.children &&
                      sitem.children.map((element, i) =>
                        !element ||
                        element.value === undefined ||
                        (element.value === '' && !optionalAttributes.includes(element.id)) ? (
                          <Grid key={i} />
                        ) : (
                          <Grid
                            item
                            xs={
                              type === 'Group'
                                ? iff(index === 0 && i === sitem.children.length - 1, 12, 4)
                                : 4
                            }
                            sx={{ display: 'flex' }}
                            key={i}
                          >
                            <Grid
                              item
                              xs={
                                type === 'Group'
                                  ? iff(index === 0 && i === sitem.children.length - 1, 12, 4)
                                  : 4
                              }
                              md={
                                type === 'Group'
                                  ? iff(index === 0 && i === sitem.children.length - 1, 1, 4)
                                  : 3
                              }
                              pl={5}
                              key={element.label}
                            >
                              <p>
                                <strong>{translate(element.label)} : </strong>
                              </p>
                            </Grid>
                            <Grid
                              item
                              xs={
                                type === 'Group'
                                  ? iff(index === 0 && i === sitem.children.length - 1, 12, 4)
                                  : 6
                              }
                              md={
                                type === 'Group'
                                  ? iff(index === 0 && i === sitem.children.length - 1, 11, 8)
                                  : 9
                              }
                              key={element.value}
                            >
                              {element.id === 'pSIDescription' ? (
                                /* eslint-disable */
                                <p>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: element.value
                                    }}
                                  />
                                </p>
                              ) : (
                                <p>
                                  {element.value === ''
                                    ? getNoInforMessage(element.id)
                                    : element.value}
                                </p>
                              )}
                            </Grid>
                          </Grid>
                        )
                      )}
                  </Grid>
                ) : (
                  <Grid container spacing={4}>
                    {sitem.children &&
                      sitem.children.map((element, i) =>
                        element.id !== 'providedComments' &&
                        element.value &&
                        Array.isArray(element.value) ? (
                          <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                              <TableHead>
                                <TableRow>
                                  <TableCell>{translate('approver.phase')}</TableCell>
                                  <TableCell>{translate('approver.approver')}</TableCell>
                                  <TableCell>{translate('approver.startDate')}</TableCell>
                                  <TableCell>{translate('approver.decision')}</TableCell>
                                  <TableCell>{translate('approver.completionDate')}</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {element.value.map((row) => (
                                  <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >
                                    <TableCell>{row.phaseId}</TableCell>
                                    <TableCell>{row.approverInfo}</TableCell>
                                    <TableCell>{row.startDate}</TableCell>
                                    <TableCell>{row.decision}</TableCell>
                                    <TableCell>{row.completionDate}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : (
                          <>
                            {index === 4 ? (
                              <>
                                {element.value.length > 0 ? (
                                  <Grid
                                    item
                                    xs={type === 'Group' ? 24 : 6}
                                    sx={{ display: 'flex' }}
                                    key={i}
                                  >
                                    <Grid
                                      item
                                      xs={type === 'Group' ? 24 : 6}
                                      md={type === 'Group' ? 2 : 3}
                                      pl={5}
                                      key={element.label}
                                    >
                                      <p>
                                        <strong>{element.label}</strong>
                                      </p>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={type === 'Group' ? 24 : 6}
                                      md={9}
                                      key={element.value}
                                    >
                                      <p>
                                        {element.value === ''
                                          ? getNoInforMessage(element.id)
                                          : element.value}
                                      </p>
                                    </Grid>
                                  </Grid>
                                ) : iff(index === 5 && element.value && element.value !== '') ? (
                                  <Grid
                                    item
                                    xs={type === 'Group' ? 24 : 6}
                                    sx={{ display: 'flex' }}
                                    key={i}
                                  >
                                    <Grid
                                      item
                                      xs={type === 'Group' ? 24 : 6}
                                      md={type === 'Group' ? 2 : 3}
                                      pl={5}
                                      key={element.label}
                                    >
                                      <p>
                                        <strong>{element.label}</strong>
                                      </p>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={type === 'Group' ? 24 : 6}
                                      md={9}
                                      key={element.value}
                                    >
                                      <p>
                                        {['', null, undefined].includes(element.value)
                                          ? getNoInforMessage(element.id)
                                          : element.value}
                                      </p>
                                    </Grid>
                                  </Grid>
                                ) : (
                                  ''
                                )}
                              </>
                            ) : (
                              <Grid item xs={12} sx={{ display: 'flex' }} key={i}>
                                <Grid item xs={12} md={12} pl={5} key={element.value}>
                                  {element.value === '' && element.id === 'providedComments' ? (
                                    <Typography>{translate('approval.noComments')} </Typography>
                                  ) : (
                                    getCommentDeatils(element)
                                  )}
                                </Grid>
                              </Grid>
                            )}
                          </>
                        )
                      )}
                  </Grid>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
      </div>
      <Box sx={{ pt: '2' }}>
        <Grid item xs={12} pt={2}>
          <Button
            variant="outlined"
            sx={{
              float: 'right',
              color: `${theme === 'dark' ? '#FFF' : '#000'}`,
              borderColor: `${theme === 'dark' ? '#FFF' : '#000'}`,
              borderRadius: 0,
              mr: 1
            }}
            onClick={() => handleReject()}
          >
            {translate('approval.rejectBtn')}
          </Button>
          <Button
            variant="outlined"
            sx={{
              float: 'right',
              color: `${theme === 'dark' ? '#FFF' : '#000'}`,
              borderColor: `${theme === 'dark' ? '#FFF' : '#000'}`,
              borderRadius: 0,
              mr: 1
            }}
            onClick={() => handleApprove()}
          >
            {translate('approval.approveBtn')}
          </Button>
          <Button
            variant="outlined"
            sx={{
              float: 'right',
              color: `${theme === 'dark' ? '#FFF' : '#000'}`,
              borderColor: `${theme === 'dark' ? '#FFF' : '#000'}`,
              borderRadius: 0,
              mr: 1
            }}
            onClick={() => handleRequestInfo()}
          >
            {translate('approval.requestInfoBtn')}
          </Button>
        </Grid>
      </Box>
    </>
  )
}

export default Summary
