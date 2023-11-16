import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/material/styles'
import translate from 'translations/translate'

import {
  selectApplyFilters,
  selectCertification,
  selectIsSemiAnnualCampaign,
  selectUpdateIsReviewerTabActive,
  selectReviewPageNumber,
  selectReviewPageSize,
  selectReviewTypeStatus
} from '../../redux/review/review.selector'
import { selectProfileDetailsSelector } from '../../redux/profile/profile.selector'
import {
  applyFilters,
  fetchReviewItemsStart,
  updateGroupPagenUmber,
  updateGroupPageSize,
  updateSortInfoData,
  updatePageSize,
  updatePagenUmber,
  setFilterData,
  updateExpandIndex,
  updateShowBigLoader,
  fetchReviewerdataStart
} from '../../redux/review/review.action'

const Label = styled('label')(
  () => `
  padding: 8px 8px 4px;
  line-height: 1.5;
  background-color: 'transparent';
`
)

const InputWrapper = styled('div')(
  ({ theme }) => `
  width: 100%;
  border: 0px solid ${theme.palette.mode === 'dark' ? '#434343' : 'transparent'};
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
  }

  &.focused {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#FFF'};
    color: ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,.85)'};
    height: 30px;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
    disabled:true;
  }
`
)

function Tag(props) {
  const { label, ...other } = props
  const reviewCertification = useSelector(selectCertification)
  const checkGovCampaignandLabel = (filterlabel) => {
    if (
      [
        'SECURITY_ADGROUP',
        'SECURITY_VDRGROUP',
        'DORMANT_AD_ACCS',
        'SECURITY_ADGROUP_MAIN',
        'SECURITY_VDRGROUP_MAIN'
      ].includes(reviewCertification)
    ) {
      if (filterlabel === 'Username') {
        return true
      }
      return false
    }
    if (
      [
        'AAA_ASA_DB',
        'AAA_ASA_UNIX',
        'AAA_ASA_WIN',
        'AAA_WIN_UNIX_DB_DBPASSPORT_FOBO',
        'AAA_WIN_UNIX_DB_DBPASSPORT_MOV',
        'ENDUSER_ACCS_DB',
        'ISA_WIN_UNIX_DB',
        'WIN_UNIX_DB_DBPASSPORT_FOBO'
      ].includes(reviewCertification)
    ) {
      if (label === 'Username') {
        return true
      }
      return false
    }
    return false
  }
  return (
    <div
      {...other}
      style={{ background: 'transparent', borderWidth: 1.5, borderColor: 'darkgray' }}
    >
      <span>
        {checkGovCampaignandLabel(label)
          ? translate(`popup.text.govUsername`)
          : translate(`popup.text.${label}`)}
      </span>
      <CloseIcon />
    </div>
  )
}

Tag.propTypes = {
  label: PropTypes.string.isRequired
}

const StyledTag = styled(Tag)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  height: 34px;
  margin: 10px;
  line-height: 22px;
  background-color: ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#fafafa'};
  border: 1px solid ${theme.palette.mode === 'dark' ? '#303030' : '#e8e8e8'};
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
    background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
    margin: 6px 5px 4px 6px
  }
`
)

export default function CustomizedHook({ reviewId, handleFilterByGroup }) {
  const dispatch = useDispatch()

  const filterArray = useSelector(selectApplyFilters)
  const isSemiAnnualCampaign = useSelector(selectIsSemiAnnualCampaign)
  const isReviewerTabActiveSelector = useSelector(selectUpdateIsReviewerTabActive)
  const profileDetails = useSelector(selectProfileDetailsSelector)
  const pageSize = useSelector(selectReviewPageSize)
  const pageNumber = useSelector(selectReviewPageNumber)
  const getReviewStatus = useSelector(selectReviewTypeStatus)

  const onClickItem = (val) => {
    const filtered2 = filterArray.filter((item) => item.id !== val.id)
    dispatch(applyFilters(filtered2))
    handleFilterByGroup('All')
    dispatch(
      setFilterData({
        currentFilter: 'All',
        default: false,
        data: []
      })
    )
    dispatch(updatePageSize(10))
    dispatch(updatePagenUmber(0))
    dispatch(fetchReviewItemsStart(reviewId))
    dispatch(updateGroupPagenUmber(0))
    dispatch(updateGroupPageSize(10))
    dispatch(
      updateSortInfoData({
        sortKey: '',
        isAscending: 'asc'
      })
    )
  }
  const onClickSemiAnnualItem = (val) => {
    const filtered2 = filterArray.filter((item) => item.id !== val.id)
    if (filtered2.length) {
      localStorage.setItem('searchValue', '')
      dispatch(updateExpandIndex(-1))
      dispatch(updateShowBigLoader(true))
      dispatch(
        updateSortInfoData({
          sortKey: '',
          isAscending: 'asc'
        })
      )
      if (filtered2[0].type === 'filter') {
        localStorage.setItem('isGroup', false)
        handleFilterByGroup('All')
        dispatch(applyFilters(filtered2))
      } else {
        localStorage.setItem('isGroup', true)
        handleFilterByGroup(filtered2)
        dispatch(applyFilters(filtered2))
      }
      dispatch(updatePagenUmber(0))
      dispatch(updateGroupPagenUmber(0))
      dispatch(updatePageSize(10))
      dispatch(updateGroupPageSize(10))
    } else {
      const loggedInUserEmail = localStorage.getItem('loggedInUserEmail')

      const reviewerPayload = {
        campaignId: reviewId,
        status: getReviewStatus,
        userEmail: loggedInUserEmail || profileDetails?.mail,
        userRole: 'reviewer',
        pageSize,
        pageNumber
      }
      dispatch(applyFilters(filtered2))
      handleFilterByGroup('All')
      dispatch(
        setFilterData({
          currentFilter: 'All',
          default: false,
          data: []
        })
      )
      dispatch(updatePageSize(10))
      dispatch(updatePagenUmber(0))

      if (isSemiAnnualCampaign && isReviewerTabActiveSelector) {
        dispatch(fetchReviewerdataStart(reviewerPayload))
      } else {
        dispatch(fetchReviewItemsStart(reviewId))
      }

      dispatch(updateGroupPagenUmber(0))
      dispatch(updateGroupPageSize(10))
      dispatch(
        updateSortInfoData({
          sortKey: '',
          isAscending: 'asc'
        })
      )
    }
  }
  const checkSemiAnnualReviewer = () => {
    if (!isSemiAnnualCampaign) {
      return true
    }
    if (isSemiAnnualCampaign) {
      if (filterArray[0].id.label === 'Reviewer') {
        return false
      }
    }
    return true
  }
  return (
    <div>
      {filterArray.length > 0 && checkSemiAnnualReviewer() ? (
        <div style={{ display: 'flex' }}>
          <Label style={{ width: 110, marginTop: '8px' }}>Applied Filter:</Label>
          <InputWrapper>
            {filterArray.map(
              (filterItem, index) =>
                (!isSemiAnnualCampaign || isReviewerTabActiveSelector || index === 0) && (
                  <StyledTag
                    key={index}
                    label={filterItem.id.label}
                    onClick={() =>
                      isSemiAnnualCampaign
                        ? onClickSemiAnnualItem(filterItem)
                        : onClickItem(filterItem)
                    }
                  />
                )
            )}
          </InputWrapper>
        </div>
      ) : null}
    </div>
  )
}
