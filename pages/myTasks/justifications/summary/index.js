import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import { Typography, Grid, Link } from '@mui/material'
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
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import translate from 'translations/translate'
import Breadcrumb from 'components/breadcrumb'
import GenericModal from '../../../../components/genericModal'
import { getFormattedDateTime } from '../../../../helpers/strings'
import useTheme from '../../../../hooks/useTheme'
import * as justificationApi from '../../../../api/justifications'
import * as requestHistoryApi from '../../../../api/history'
import { updateReviewNotificationMessage } from '../../../../redux/review/review.action'
import { fetchJustificationsItemsStart } from '../../../../redux/justifications/justifications.action'
import {
  selectJustificationsPageSize,
  selectJustificationsItems
} from '../../../../redux/justifications/justifications.selector'
import JustificationComments from '../../../../pageComponents/Justifications/JustificationComments'

const Summary = () => {
  const [summary, setSummary] = useState([])
  const [status, setStatus] = useState('')
  const { theme } = useTheme()
  const [accessioRequestNo, setAccessioRequestNo] = React.useState('')
  const [type, setType] = useState('')
  const [open, setOpen] = useState(false)
  const [openWithdraw, setOpenWithdraw] = useState(false)
  const [phaseName, setPhaseName] = useState('')
  const history = useHistory()
  const dispatch = useDispatch()
  const cancelSuccess = translate('cancel.success')
  const cancelError = translate('cancel.error')
  const pageSize = useSelector(selectJustificationsPageSize)
  const results = useSelector(selectJustificationsItems)
  const params = new URLSearchParams(window.location.search)
  const requestId = params.get('id')
  // eslint-disable-next-line no-unused-vars
  const noComments = translate('approval.noComments')
  const [isMemebrshipData, setisMemebrshipData] = useState(false)
  const optionalAttributes = ['dbagFileSystemFullPaths', 'dbagSupportGroup', 'dbagsupportGroup']

  const valueFinder = (adArray, fieldId) => {
    const targetIndex = adArray.findIndex((field) => field.id === fieldId)
    return adArray[targetIndex]?.value
  }

  const iff = (consition, then, otherise) => (consition ? then : otherise)

  const getCommentDeatils = (element) =>
    element.id === 'providedComments' && Array.isArray(element?.value) ? (
      <div>
        {element?.value.map((ele) =>
          ['reassign', 'updateStatus', 'comment'].includes(ele.action) &&
          ![undefined, '', null].includes(ele?.comment) ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <strong key={ele}>
                {`${ele.user.givenName} ${ele.user.sn} (${ele.user.mail}) ${getFormattedDateTime(
                  ele.timeStamp
                )}`}
              </strong>
              <p key={ele}>{ele.comment}</p>
            </div>
          ) : null
        )}
      </div>
    ) : (
      <p>{element.value}</p>
    )

  const handleClose = () => {
    setOpenWithdraw(false)
  }
  const handleConfirm = () => {
    setOpenWithdraw(false)
    // Call API when Clicked on Withdraw Button

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
        history.push('/tasks/justifications')
        dispatch(fetchJustificationsItemsStart(pageSize, 0))
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
            return { ...child, value: matchedData[0].value }
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
    justificationApi.getJustificationSummary(requestId).then((responseData) => {
      setStatus(responseData?.filter((res1) => res1.id === 'status')[0]?.value)
      setType(responseData[0].value)
      setPhaseName(responseData?.filter((res1) => res1.id === 'phase')[0]?.value)
      setAccessioRequestNo(responseData?.filter((res1) => res1.id === 'requestNo')[0]?.value)
      const reqType = responseData?.filter((res1) => res1.id === 'requestType')[0]?.value
        ? responseData?.filter((res1) => res1.id === 'requestType')[0]?.value
        : ''

      let summarySteps
      if (responseData[0].value === 'Account') {
        const accountType = valueFinder(responseData, 'accountType')
        const rType = responseData?.filter((res1) => res1.id === 'requestType')[0]?.value
        justificationApi.getJustificationAccountSummaryStructure().then((res) => {
          summarySteps = getSummaryStepsData(res, responseData, accountType, rType)
          setSummary(summarySteps)
        })
      } else if (responseData[0].value === 'Group') {
        const accessioType = valueFinder(responseData, 'accessioGroupType')
        justificationApi.getJustificationGroupSummaryStructure().then((res) => {
          summarySteps = getSummaryStepsData(res, responseData, accessioType, reqType)
          setSummary(summarySteps)
        })
      } else {
        justificationApi.getJustificationEntitlementSummaryStructure().then((res) => {
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
    // eslint-disable-next-line no-unused-vars
    backgroundColor = '#FF7714'
  }
  const getNoInforMessage = (id) =>
    id === 'providedComments'
      ? translate('approval.noComments')
      : iff(
          optionalAttributes.includes(id),
          <em>{translate('summary.notSet')}</em>,
          translate('approver.noInformation')
        )

  const filterViewJustificationData = () => {
    const allData = results.justificationData
    const dataItem = allData && allData.find((data) => data.id === requestId)
    return dataItem
  }

  const handleDataItem = () => {
    const dataItem = filterViewJustificationData()
    return dataItem
  }

  const handlePhaseID = () => {
    const dataItem = filterViewJustificationData()
    return dataItem.phase
  }

  const handleComment = () => {
    const dataItem = filterViewJustificationData()
    return dataItem.comment
  }

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
      <Link to="/history/approvalHistory" style={{ textDecoration: 'none' }}>
        <Button
          variant="text"
          sx={{ fontSize: '14px', color: theme === 'dark' ? '#FFF' : '#0A1C33' }}
        >
          ← {translate('review.back')}
        </Button>
      </Link>
      <Breadcrumb
        path={[
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          { label: translate('myTasks.header.title'), url: '/tasks' },
          { label: translate('myTasks.justifications'), url: '/tasks/justifications' },
          { label: accessioRequestNo, url: '' }
        ]}
      />
      <div
        style={{
          backgroundColor: theme === 'dark' ? '#1A2129' : '#FFF',
          padding: '5px 10px 5px 15px'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <h1>{translate('approval.summary.title')}</h1>
        </Box>
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
            onClick={() => setOpenWithdraw(true)}
          >
            {translate('requestHistory.withdraw')}
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
            onClick={() => {
              setOpen(true)
            }}
          >
            {translate('justification.provideJustification')}
          </Button>
        </Grid>
      </Box>
      <div>
        <Dialog
          open={openWithdraw}
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
      {open && (
        <GenericModal setOpen={setOpen}>
          {' '}
          <JustificationComments
            handleClose={setOpen}
            reviewId={[requestId]}
            comments={handleComment()}
            phaseId={handlePhaseID()}
            title="Justiffication List"
            dataItem={handleDataItem()}
            type="justificationSummary"
          />
        </GenericModal>
      )}
    </>
  )
}

export default Summary
