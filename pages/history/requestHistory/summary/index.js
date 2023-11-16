import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Typography, Grid } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Breadcrumb from 'components/breadcrumb'
import translate from 'translations/translate'
import * as Styled from '../style'
import useTheme from '../../../../hooks/useTheme'
import * as approvalApi from '../../../../api/approvals'
import * as requestHistoryApi from '../../../../api/history'
import { fetchRequestHistoryItemsStart } from '../../../../redux/history/requestHistory/requestHistory.action'
import { updateReviewNotificationMessage } from '../../../../redux/review/review.action'
import { selectAssetsSelectedGroupName } from '../../../../redux/myAssets/myAssets.selector'
import { getFormattedDateTime } from '../../../../helpers/strings'

const Summary = () => {
  const [requestType, setRequestType] = useState('') // ALM2865
  const [summary, setSummary] = useState([])
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const [reqId, setReqId] = useState('')
  const [phaseName, setPhaseName] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)
  const { theme } = useTheme()
  const requestId = localStorage.getItem('requestHistoryId')
  const [open, setOpen] = useState(false)
  const history = useHistory()
  const componentType = localStorage.getItem('component')
  const myTeamSelectedUserId = localStorage.getItem('myTeam-userId')
  const cancelSuccess = translate('cancel.success')
  const cancelError = translate('cancel.error')
  const systemGenerated = translate('approval.SYSTEMGENERATED')
  const dispatch = useDispatch()
  const noComments = translate('approval.noComments')
  const [autoApprovalData, setAutoApprovalData] = useState([])
  const selectedGroupNameForBcrumb = useSelector(selectAssetsSelectedGroupName)
  const [isMemebrshipData, setisMemebrshipData] = useState(false)
  const optionalAttributes = ['dbagFileSystemFullPaths', 'dbagSupportGroup', 'dbagsupportGroup']

  console.log(autoApprovalData)

  const valueFinder = (adArray, fieldId) => {
    const targetIndex = adArray.findIndex((field) => field.id === fieldId)
    return adArray[targetIndex]?.value
  }

  const handleConfirm = () => {
    setOpen(false)
    // Call API when Clicked on Withdraw Button
    history.push(
      myTeamSelectedUserId ? `/my-team/${myTeamSelectedUserId}` : '/history/requestHistory'
    )
    requestHistoryApi
      .cancelRequest(requestId, phaseName)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            updateReviewNotificationMessage({
              type: 'Success',
              message: cancelSuccess
            })
          )
        } else {
          dispatch(
            updateReviewNotificationMessage({
              type: 'Error',
              message: cancelError
            })
          )
        }
        const initialPayload = {
          sortOn: 'RequestHistory',
          sortOnValue: 'false',
          sortBy: 'request.common.startDate',
          sortOrder: 'asc',
          pageSize: 10
        }
        dispatch(
          fetchRequestHistoryItemsStart(
            myTeamSelectedUserId
              ? {
                  ...initialPayload,
                  id: myTeamSelectedUserId
                }
              : initialPayload
          )
        )
      })
      .catch((error) => {
        console.error(error)
        dispatch(
          updateReviewNotificationMessage({
            type: 'Error',
            message: cancelError
          })
        )
      })
  }
  const handleClose = () => {
    setOpen(false)
  }
  const iff = (consition, then, otherise) => (consition ? then : otherise)

  const getSummaryStepsData = (res, responseData, accessioType = '', reqType) =>
    [...res.steps].map((step) => {
      const targetedChildern = step.children.map((child) => {
        const matchedData = responseData.filter((response) => response.id === child.id)
        if (matchedData.length) {
          if (child.id === 'providedComments') {
            if (matchedData[0].value.length > 0) {
              matchedData[0].value.forEach((commentData) => {
                if (commentData?.request?.common?.accessioApprovalLog) {
                  setAutoApprovalData(
                    commentData?.request?.common?.accessioApprovalLog?.LineManagerApproval
                  )
                }
              })
              const commentString = matchedData[0].value
                .filter((data) => data.comment)
                .map((commentData) => commentData)
              return { ...child, value: commentString }
            }
            return { ...child, value: noComments }
          }
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
            return {
              ...child,
              value: childValue
            }
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

  const getDisblecheck = (dataItems) => {
    let disableValue
    if (dataItems && dataItems.length > 0) {
      disableValue = dataItems.find(
        (data) =>
          data.phases &&
          (data.phases?.name === 'ThresholdBreach' ||
            data.phases?.name === 'dbUnityPhase' ||
            data.phases?.name === 'ProvisioningRetry')
      )
    }
    if (
      disableValue &&
      (disableValue.phases?.name === 'ThresholdBreach' ||
        disableValue.phases?.name === 'dbUnityPhase' ||
        disableValue.phases?.name === 'ProvisioningRetry')
    ) {
      return true
    }
    return false
  }

  useEffect(() => {
    if ([null, undefined, ''].includes(requestId)) {
      history.push('/history/requestHistory')
    } else {
      requestHistoryApi.getRequestHistorySummaryById(requestId).then((responseData) => {
        setIsDisabled(
          getDisblecheck(responseData?.filter((res1) => res1.id === 'phasesInfo')[0]?.value)
        )
        setStatus(responseData?.filter((res1) => res1.id === 'status')[0]?.value)
        setReqId(responseData?.filter((res1) => res1.id === 'requestNo')[0]?.value)
        setType(responseData[0].value)
        setPhaseName(
          responseData?.filter((res1) => res1.id === 'phase')[0]?.value
            ? responseData?.filter((res1) => res1.id === 'phase')[0]?.value
            : ''
        )
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
          requestHistoryApi.getGroupHistorySummaryStructure().then((res) => {
            const updatedResponse = {}
            const rType = responseData?.filter((res1) => res1.id === 'requestType')[0]?.value
            setRequestType(rType) // ALM2865
            if (rType === 'DELETE GROUP') {
              const ownerInfoIndex = res.steps.findIndex((x) => x.id === 'ownerInfo')
              const duplicateObj = res.steps
              if (ownerInfoIndex !== -1) {
                duplicateObj.splice(ownerInfoIndex, 1)
              }
              updatedResponse.steps = duplicateObj
              summarySteps = getSummaryStepsData(updatedResponse, responseData, accessioType)
            } else {
              summarySteps = getSummaryStepsData(res, responseData, accessioType, rType)
            }

            setSummary(summarySteps)
          })
        } else {
          requestHistoryApi.getEntitlementHistorySummaryStructure().then((res) => {
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
  if (status === 'cancelled') {
    backgroundColor = '#6A1A09'
  }
  const checkUserId = (element) => {
    if (element?.user?.givenName) {
      return ['etl', 'accessio', 'IGAdminUser'].includes(element.user.givenName)
        ? `${systemGenerated} ${getFormattedDateTime(element?.timeStamp)}`
        : `${element?.user?.givenName} ${element?.user?.sn} (${
            element?.user?.mail
          }) ${getFormattedDateTime(element?.timeStamp)}`
    }
    if (element?.user?.id) {
      return `${
        element?.user?.id === 'SYSTEM' ? `${systemGenerated}` : element?.user?.id
      } ${getFormattedDateTime(element?.timeStamp)}`
    }

    return `${element?.user?.givenName} ${element?.user?.sn} (${
      element?.user?.mail
    }) ${getFormattedDateTime(element?.timeStamp)}`
  }
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
  const getBreadcrumb = () => {
    if (componentType === 'Modify') {
      return (
        <Breadcrumb
          path={[
            { label: translate('navItem.label.dashboard'), url: '/dashboard' },
            { label: translate('navItem.label.myAsset'), url: '/my-asset' },
            { label: translate('navItem.label.myAssetGroups'), url: '' },
            { label: selectedGroupNameForBcrumb, url: '' },
            { label: reqId, url: '' }
          ]}
        />
      )
    }
    if (componentType === 'MyTeam') {
      return (
        <Breadcrumb
          path={[
            { label: translate('navItem.label.dashboard'), url: '/dashboard' },
            { label: translate('navItem.label.myTeam'), url: '/my-team' },
            { label: reqId, url: '' }
          ]}
        />
      )
    }
    if (componentType === 'Admin') {
      return (
        <Breadcrumb
          path={[
            { label: translate('navItem.label.dashboard'), url: '/dashboard' },
            { label: translate('admin.header.title'), url: '/admin' },
            { label: translate('serviceDeskAdmin.header'), url: '/admin/ServiceDeskAdmin' }
          ]}
        />
      )
    }
    return (
      <Breadcrumb
        path={[
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          { label: translate('navItem.label.history'), url: '/history' },
          { label: translate('navItem.label.requesthistory'), url: '/history/requestHistory' }
        ]}
      />
    )
  }
  const getBackButtonPath = () => {
    if (componentType === 'MyTeam') {
      return `/my-team/${myTeamSelectedUserId}`
    }
    if (componentType === 'Modify') {
      return '/my-asset'
    }
    if (componentType === 'Admin') {
      return '/admin/ServiceDeskAdmin'
    }
    return '/history/requestHistory'
  }
  return (
    <>
      <Styled.BackButtonLink to={getBackButtonPath()}>
        <Styled.BackButton>← {translate('review.back')}</Styled.BackButton>
      </Styled.BackButtonLink>
      {getBreadcrumb()}
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
            {status.toUpperCase()}
          </span>
        </Box>
        {summary &&
          summary.map((sitem, index) => (
            <Accordion key={`summary_${index}`} disableGutters defaultExpanded>
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
                key={`accordin_${sitem.heading}`}
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
                        (element.value === '' &&
                          (requestType !== 'DELETE GROUP'
                            ? !optionalAttributes.includes(element.id)
                            : true)) ? (
                          // Do not show optional Attributes for Delete Group ALM2865
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
                            {element.id !== 'providedComments' && (
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
                            )}
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
                  iff(
                    [2].includes(index),
                    <Grid container spacing={4} key={`grid_${sitem.heading}`}>
                      {sitem.children &&
                      Array.isArray(sitem.children[0].value) &&
                      sitem.children[0].value.length > 0 ? (
                        sitem.children[0].value.map((element, i) =>
                          element === false ||
                          element.comment === undefined ||
                          element.comment === '' ? (
                            <Grid key={i} />
                          ) : (
                            <Grid item xs={12} sx={{ display: 'flex' }} key={i}>
                              <Grid item xs={12} md={12} pl={5} key={element.value}>
                                {element.action === 'comment' ||
                                element.action === 'reassign' ||
                                element.action === 'updateStatus' ? (
                                  <div>
                                    <p>
                                      <strong>
                                        {/* {autoApprovalData && autoApprovalData?.approverL1Mail
                                          ? `${convertMailtoName(
                                              autoApprovalData?.approverL1Mail
                                            )} ${formattedDate(
                                              autoApprovalData?.autoApproval_date
                                            )}`
                                          : `${element.user.givenName} ${
                                              element.user.sn
                                            } ${formattedDate(element.timeStamp)} 
                                    ${element.timeStamp.split('T')[1]}`} */}
                                        {checkUserId(element)}
                                      </strong>
                                    </p>
                                    <p key={element}>{element.comment}</p>
                                  </div>
                                ) : null}
                              </Grid>
                            </Grid>
                          )
                        )
                      ) : (
                        <Grid item xs={12} sx={{ display: 'flex' }}>
                          <Grid item xs={12} md={12} pl={5}>
                            <Typography>{translate('comments.noComments')}</Typography>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>,
                    <Grid container spacing={4} key={`grid_${sitem.heading}`}>
                      {sitem.children &&
                        sitem.children.map((element, i) =>
                          Array.isArray(element.value) && element.value.length > 0 ? (
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
                                  {element.value ? (
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
                                          <strong>{translate(element.label)}</strong>
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
                                          <strong>{translate(element.label)}</strong>
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
                                    <Typography>
                                      {element?.value === '' || element?.value?.length === 0
                                        ? getNoInforMessage(element.id)
                                        : element.value}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              )}
                            </>
                          )
                        )}
                    </Grid>
                  )
                )}
              </AccordionDetails>
            </Accordion>
          ))}
      </div>
      {['cancelled', 'completed', ''].includes(status) ||
      ['Admin', 'Modify'].includes(componentType)
        ? null
        : iff(
            ['in-progress'].includes(status) && !isDisabled,
            <Styled.ButtonWrapper>
              <Button
                variant="outlined"
                sx={{
                  color: `${theme === 'dark' ? '#fff' : '#000'}`,
                  borderColor: `${theme === 'dark' ? '#fff' : '#000'}`
                }}
                onClick={() => setOpen(true)}
              >
                {translate('requestHistory.withdraw')}
              </Button>
            </Styled.ButtonWrapper>,
            null
          )}
      <div>
        <Dialog
          open={open}
          PaperProps={{
            style: {
              backgroundColor: theme === 'dark' ? '#1A2129' : '#FFF',
              boxShadow: 'none',
              width: '400px'
            }
          }}
        >
          <DialogTitle id="alert-dialog-title">{translate('cancel.confirmationTitle')}</DialogTitle>

          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {translate('cancel.confirmationMessage')}
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              {translate('create.ADAccount.cancel')}
            </Button>
            <Button onClick={handleConfirm}>{translate('create.ADAccount.confirm')}</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}

export default Summary
