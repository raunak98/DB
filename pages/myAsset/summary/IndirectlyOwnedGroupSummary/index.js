import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Button from '@mui/material/Button'
import { Typography, Grid, Link } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Breadcrumb from 'components/breadcrumb'
import translate from 'translations/translate'
import * as groupApi from '../../../../api/groupManagement'
import * as accountApi from '../../../../api/accountManagement'
import useTheme from '../../../../hooks/useTheme'
import { updateReviewNotificationMessage } from '../../../../redux/review/review.action'

const IndirectlyOwnedGroupSummary = () => {
  const [summary, setSummary] = useState([])
  const [groupName, setGroupName] = useState('')
  const { theme } = useTheme()
  const queryParams = new URLSearchParams(window.location.search)
  const requestId = queryParams.get('id')
  const noComments = translate('approval.noComments')
  const noDataAvailable = translate('viewDetails.group.error')
  const type = localStorage.getItem('component')
  const dispatch = useDispatch()

  const valueFinder = (adArray, fieldId) => {
    const targetIndex = adArray.findIndex((field) => field.id === fieldId)
    return adArray[targetIndex]?.value
  }

  const getSummaryStepsData = (res, responseData, accessioType = '') =>
    [...res.steps]?.map((step) => {
      const targetedChildern = step.children?.map((child) => {
        const matchedData = responseData.filter((response) => response.id === child.id)
        if (matchedData.length) {
          if (child.id === 'providedComments') {
            if (matchedData[0].value.length > 0) {
              const commentString = matchedData[0].value
                .map((commentData) => commentData.comment)
                .join(', ')
              return { ...child, value: commentString }
            }
            return { ...child, value: noComments }
          }
          if ('relatedTo' in child) {
            if (child.relatedTo.includes(accessioType)) {
              if (
                [
                  'dbagIMSDataSecCLass',
                  'dbagExternalProvider',
                  'groupType',
                  'groupScope',
                  'dbagDataPrivClass',
                  'dwsPrivate',
                  'enterpriseServices',
                  'clientPrivate',
                  'dbPrivate',
                  'dLPEnvironment'
                ].includes(child.id) &&
                matchedData[0].value !== ''
              ) {
                let filterData = child.options.filter((data) => data.value === matchedData[0].value)
                if (Array.isArray(filterData) && filterData.length === 0) {
                  filterData = child.options.filter((data) => data.label === matchedData[0].value)
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
          if (child.id === 'dbagIMSApprovers') {
            if (Array.isArray(matchedData[0].value) && matchedData[0].value.length > 0) {
              return { ...child, value: matchedData[0].value.join(', ') }
            }
            return { ...child, value: '' }
          }

          return { ...child, value: matchedData[0].value }
        }
        return false
      })
      return { ...step, children: targetedChildern }
    })

  useEffect(() => {
    const payload = {
      searchValue: requestId,
      pageSize: 100,
      pageNumber: 0
    }
    accountApi.getOptions(`/v0/governance/searchGroups`, payload).then((res) => {
      if (res?.hits?.hits?.length > 0) {
        const item = res?.hits?.hits[0]
        groupApi.setGroupRecord(item).then((responseData) => {
          const accessioType = valueFinder(responseData, 'accessioGroupType')
          const groupNameData = valueFinder(responseData, 'samAccount')
          if (!['', undefined, null].includes(groupNameData)) {
            setGroupName(groupNameData)
          }
          groupApi.getGroupSummaryStructure().then((resp) => {
            const summarySteps = getSummaryStepsData(resp, responseData, accessioType)
            setSummary(summarySteps)
          })
        })
      } else {
        dispatch(
          updateReviewNotificationMessage({
            type: 'Error',
            message: noDataAvailable
          })
        )
      }
    })
  }, [])

  const iff = (condition, then, otherwise) => (condition ? then : otherwise)

  const getNoInforMessage = (id) =>
    id === 'providedComments'
      ? translate('approval.noComments')
      : translate('approver.noInformation')

  const breadcrumbsAction = () => {
    switch (type) {
      case 'Admin':
        return [
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          { label: translate('admin.header.title'), url: '/admin' },
          { label: translate('groupAdmin.header'), url: '/admin/GroupAdmin' },
          { label: ` ${groupName}`, url: '' }
        ]
      default:
        return [
          { label: translate('navItem.label.dashboard'), url: '/dashboard' },
          { label: translate('myAssets.header'), url: '/my-asset' },
          { label: requestId, url: '' }
        ]
    }
  }

  const backButtonAction = () => {
    switch (type) {
      case 'Admin':
        return '/admin/GroupAdmin'
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <h1>{translate('group.summary.title')}</h1>
        </Box>
        {summary &&
          summary.map((sitem, index) => (
            <Accordion key={`summary_${index}`} disableGutters defaultExpanded>
              <AccordionSummary
                key={index}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id={`${sitem.heading}_summary`}
                sx={{
                  backgroundColor: theme === 'dark' ? '#3C485A' : '#EFF9FC'
                }}
              >
                <Typography key={sitem.heading} sx={{ fontSize: '16px' }}>
                  {sitem.heading}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                key={`accordin_${sitem.heading}`}
                sx={{
                  backgroundColor: theme === 'dark' ? '#1A2129' : '#FFF',
                  padding: '10x 8px'
                }}
              >
                <Grid container spacing={4} key={`grid_${sitem.id}`}>
                  {sitem.children &&
                    sitem.children.map((element, i) =>
                      element === false || element.value === undefined || element.value === '' ? (
                        <Grid key={i} />
                      ) : (
                        <Grid
                          item
                          xs={iff(
                            (index === 0 && i === sitem.children.length - 1) || index === 1,
                            12,
                            4
                          )}
                          sx={{ display: 'flex' }}
                          key={i}
                        >
                          <Grid
                            item
                            xs={iff(
                              (index === 0 && i === sitem.children.length - 1) || index === 1,
                              12,
                              4
                            )}
                            md={iff(
                              (index === 0 && i === sitem.children.length - 1) || index === 1,
                              1,
                              4
                            )}
                            pl={5}
                            key={element.label}
                          >
                            <p>
                              <strong>{element.label} : </strong>
                            </p>
                          </Grid>
                          <Grid
                            item
                            xs={iff(
                              (index === 0 && i === sitem.children.length - 1) || index === 1,
                              12,
                              4
                            )}
                            md={iff(
                              (index === 0 && i === sitem.children.length - 1) || index === 1,
                              11,
                              8
                            )}
                            key={element.value}
                          >
                            <p>
                              {element.value === '' ? getNoInforMessage(element.id) : element.value}
                            </p>
                          </Grid>
                        </Grid>
                      )
                    )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
      </div>
    </>
  )
}

export default IndirectlyOwnedGroupSummary
