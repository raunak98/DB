import * as React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import translate from 'translations/translate'
import {
  selectIsSemiAnnualCampaign,
  selectReviewMetadata,
  selectUpdateIsReviewerTabActive
} from 'redux/review/review.selector'
import FilterItem from './filterItme'
import {
  applyFilters,
  updateShowBigLoader,
  updateSortInfoData,
  updatePagenUmber,
  updateGroupPagenUmber,
  updatePageSize,
  updateGroupPageSize,
  updateExpandIndex
} from '../../redux/review/review.action'

import { selectUpdateIsMonitor } from '../../redux/review/review.selector'

import useTheme from '../../hooks/useTheme'

const TitleText = (props) => {
  const { children, onClose, ...other } = props
  return (
    <DialogTitle sx={{ m: 0, p: 2, background: '#fff' }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

TitleText.propTypes = {
  // children: PropTypes.node,
  onClose: PropTypes.func.isRequired
}

export default function filterPopUp({
  handleClose,
  filterResultsOptions,
  groupResultsOptions,
  onFilterCallback
}) {
  const dispatch = useDispatch()
  const [filters, setFilters] = React.useState([])
  const [groupBy, setGroupBy] = React.useState([])
  const [openValue, setOpenValue] = React.useState(-1)
  const [openGroupValue, setOpenGroupValue] = React.useState(-1)
  const isMonitor = useSelector(selectUpdateIsMonitor)
  const isSemiAnnualCampaign = useSelector(selectIsSemiAnnualCampaign)
  const isReviewerTabActiveSelector = useSelector(selectUpdateIsReviewerTabActive)
  const metadata = useSelector(selectReviewMetadata)

  const { theme } = useTheme()

  const checkIfGroup = (filterObj) => {
    if (filterObj.length > 0) {
      const hasMatch = groupResultsOptions.filter((v) => v.id.type === filterObj[0].id.type)
      return hasMatch.length > 0
    }
    return false
  }

  React.useEffect(() => {
    if (isSemiAnnualCampaign && !isReviewerTabActiveSelector) {
      const reviewerGroupBy = metadata?.groupBy.filter((group) => group?.label === 'Reviewer')
      setGroupBy([
        {
          id: {
            ...reviewerGroupBy[0]
          },
          type: 'groupBy'
        }
      ])
    }
  }, [])

  const applyFilterSubmit = () => {
    handleClose(false)
    if (filters.length) {
      localStorage.removeItem('searchValue')
      dispatch(updateExpandIndex(-1))
      dispatch(updateShowBigLoader(true))
      dispatch(
        updateSortInfoData({
          sortKey: '',
          isAscending: 'asc'
        })
      )
      const arrayWithNoDuplicates = Array.from(new Set(filters))
      const isGroup = checkIfGroup(arrayWithNoDuplicates)
      localStorage.setItem('isGroup', isGroup)
      onFilterCallback(openGroupValue !== -1 ? arrayWithNoDuplicates : 'All')
      dispatch(applyFilters(arrayWithNoDuplicates))
      dispatch(updatePagenUmber(0))
      dispatch(updateGroupPagenUmber(0))
      dispatch(updatePageSize(10))
      dispatch(updateGroupPageSize(10))
    }
  }

  const applyFilterAndGroupBySubmit = () => {
    handleClose(false)
    if (filters.length || groupBy.length) {
      localStorage.setItem('searchValue', '')
      dispatch(updateExpandIndex(-1))
      dispatch(updateShowBigLoader(true))
      dispatch(
        updateSortInfoData({
          sortKey: '',
          isAscending: 'asc'
        })
      )
      // Filter + GroupBy
      if (filters.length && groupBy.length) {
        localStorage.setItem('isGroup', true)
        onFilterCallback([...filters, ...groupBy])
        dispatch(applyFilters([...filters, ...groupBy]))
      }
      // Only Filter
      else if (filters.length) {
        localStorage.setItem('isGroup', false)
        onFilterCallback('All')
        dispatch(applyFilters(filters))
      }
      // Only GroupBy
      else {
        localStorage.setItem('isGroup', true)
        onFilterCallback(groupBy)
        dispatch(applyFilters(groupBy))
      }
      dispatch(updatePagenUmber(0))
      dispatch(updateGroupPagenUmber(0))
      dispatch(updatePageSize(10))
      dispatch(updateGroupPageSize(10))
    }
  }

  const addToApplyFilter = (val) => {
    setFilters(val)
  }

  const addToApplyFilterAndGroupBy = (val, type) => {
    if (type === 'filter') {
      setFilters([
        {
          ...val[0],
          type
        }
      ])
    } else {
      setGroupBy([
        {
          ...val[0],
          type
        }
      ])
    }
  }

  return (
    <div style={{ width: '100%', overflowY: 'none !important' }}>
      <Box
        sx={{
          flexGrow: 1,
          background: theme === 'dark' ? 'transparent' : '#fff',
          padding: '5px'
        }}
      >
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={6} md={6}>
              <Grid style={{ paddingBottom: '15px', fontWeight: 400, fontSize: 25 }}>
                {translate('popup.heading.filterBy')}
              </Grid>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                sx={{ marginLeft: '5px' }}
              >
                {filterResultsOptions.length > 0 ? (
                  filterResultsOptions.map((value, index) => (
                    <FilterItem
                      value={value.id}
                      index={index}
                      key={`${value.id}${index}`}
                      addToApplyFilter={(val) => {
                        if (!isSemiAnnualCampaign) {
                          setOpenGroupValue(-1)
                          addToApplyFilter(val ? [value] : [])
                        } else if (val) {
                          addToApplyFilterAndGroupBy([value], 'filter')
                        } else {
                          addToApplyFilterAndGroupBy([], 'filter')
                        }
                      }}
                      openValue={openValue}
                      setOpenValue={setOpenValue}
                    />
                  ))
                ) : (
                  <div style={{ paddingLeft: '12px' }}>{translate('popup.noFilterAvailable')}</div>
                )}
              </Grid>
            </Grid>
            {(!isSemiAnnualCampaign || isReviewerTabActiveSelector) && (
              <Grid item xs={6} md={6}>
                <Grid style={{ paddingBottom: '15px', fontWeight: 400, fontSize: '25px' }}>
                  {translate('popup.heading.groupBy')}
                </Grid>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  sx={{ marginLeft: '5px' }}
                >
                  {groupResultsOptions.length > 0 ? (
                    groupResultsOptions.map((value, index) => {
                      if (value.id.label === 'Reviewer' && (isSemiAnnualCampaign || !isMonitor)) {
                        return null
                      }
                      return (
                        <FilterItem
                          value={value.id}
                          index={index}
                          key={`${value.id}${index}`}
                          addToApplyFilter={(val) => {
                            if (!isSemiAnnualCampaign) {
                              setOpenValue(-1)
                              addToApplyFilter(val ? [value] : [])
                            } else if (val) {
                              addToApplyFilterAndGroupBy([value], 'groupBy')
                            } else {
                              addToApplyFilterAndGroupBy([], 'groupBy')
                            }
                          }}
                          openValue={openGroupValue}
                          setOpenValue={setOpenGroupValue}
                        />
                      )
                    })
                  ) : (
                    <div style={{ paddingLeft: '12px' }}>{translate('popup.noGroupAvailable')}</div>
                  )}
                </Grid>
              </Grid>
            )}
          </Grid>
        </Box>
        {groupResultsOptions.length > 0 || filterResultsOptions.length > 0 ? (
          <Button
            variant="outlined"
            sx={{
              float: 'right',
              marginTop: '10px',
              color: `${theme === 'dark' ? '#FFF' : '#000'}`,
              borderColor: ' 1px solid rgba(255, 255, 255, 0.4);'
            }}
            onClick={isSemiAnnualCampaign ? applyFilterAndGroupBySubmit : applyFilterSubmit}
          >
            {translate('popup.button.apply')}
          </Button>
        ) : null}
      </Box>
    </div>
  )
}
