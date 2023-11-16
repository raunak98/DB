/* eslint-disable */

import React, { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import * as Styled from './style'
import { numberToWord, toCapitalize } from '../../../helpers/strings'
import {
  selectReviewItems,
  selectSortInfoData,
  selectFilterData,
  selectApplyFilters,
  selectReviewPageSize,
  selectReviewPageNumber,
  selectIsGoingForwardFlag,
  selectPaginationKeys,
  selectReviewTypeStatus,
  selectSeach,
  selectCertification,
  selectSelectedReviewItems,
  selectIsSemiAnnualCampaign
} from '../../../redux/review/review.selector'
import {
  fetchReviewItemsStart,
  signOffItems,
  updateReviewNotificationMessage,
  updateShowBigLoader,
  fetchReviewSortStart,
  fetchReviewFilterStart,
  updatePaginationKeys,
  fetchReviewItemsSuccess,
  updatePagenUmber,
  updatePageSize,
  updateSelectedReviewItems
} from '../../../redux/review/review.action'
import allowExceptions from '../Dropbox/AllowExceptions'
import * as reviewApi from '../../../api/review'
import {
  selectProfileDetailsSelector,
  selectProfileSelector,
  selectProvisioningRoles
} from '../../../redux/profile/profile.selector'
import useTheme from '../../../hooks/useTheme'
import translate from 'translations/translate'
import * as profileAPI from 'api/profile'

const ReviewSummary = ({
  id,
  closeModal,
  generalActions = ['revoke', 'maintain', 'allowExceptions'],
  actionCount,
  signOffItems,
  signOffCallback
}) => {
  const [count, setCount] = React.useState({
    mCount: 0,
    rCount: 0,
    eCount: 0,
    aaCount: 0,
    asCount: 0,
    iCount: 0,
    gCount: 0,
    notApplicable: 0,
    yesCount: 0
  })
  const [signOffId, setSignOffId] = React.useState('')

  const dispatch = useDispatch()
  const profile = useSelector(selectProfileSelector)
  const sortInfoData = useSelector(selectSortInfoData)
  const filterData = useSelector(selectFilterData)
  const appliedFilter = useSelector(selectApplyFilters)
  const pageSize = useSelector(selectReviewPageSize)
  const pageNumber = useSelector(selectReviewPageNumber)
  const isGoingForward = useSelector(selectIsGoingForwardFlag)
  const paginationKeysArray = useSelector(selectPaginationKeys)
  const getReviewStatus = useSelector(selectReviewTypeStatus)
  const search = useSelector(selectSeach)
  const reviewCertification = useSelector(selectCertification)
  const selectedReviewItems = useSelector(selectSelectedReviewItems)
  const profileDetails = useSelector(selectProfileDetailsSelector)
  const isSemiAnnualCampaign = useSelector(selectIsSemiAnnualCampaign)
  const provisioningRoles = useSelector(selectProvisioningRoles)
  // const reviewItemsList = useSelector(selectReviewItems)
  const { theme } = useTheme()
  const successMessage = translate('review.summary.successMessage')
  const location = useLocation()
  const type1 = location?.state?.type || 'active'
  const getStatus = () =>
    localStorage.getItem('historyStatus') === 'complete'
      ? 'signed-off,expired,cancelled'
      : 'expired'

  useEffect(() => {
    const signOffIds = []
    let maintainCount = 0
    let revokeCount = 0
    let exceptionCount = 0
    let aaaCount = 0
    let asaCount = 0
    let guaCount = 0
    let isaCount = 0
    let notApplicableCount = 0
    let yesCount = 0

    signOffItems.map((item) => {
      signOffIds.push(item.id)
      if (item?.comment && item?.comment.length) {
        if (item.comment?.slice(-1)[0].comment === 'AAA' && item.status === 'certify') {
          aaaCount++
        }
        if (item.comment?.slice(-1)[0].comment === 'ASA' && item.status === 'certify') {
          asaCount++
        }
        if (
          item.comment?.slice(-1)[0].comment === 'End-User Account' &&
          item.status === 'certify'
        ) {
          guaCount++
        }
        if (item.comment?.slice(-1)[0].comment === 'ISA' && item.status === 'certify') {
          isaCount++
        }
        if (
          item.comment?.length > 1 &&
          item.comment?.slice(-2, -1)[0].comment === 'Not-Applicable' &&
          item.status === 'revoke'
        ) {
          notApplicableCount++
        } else if (item.status === 'revoke') {
          revokeCount++
        }
        if (item.comment?.slice(-1)[0].comment === 'YES' && item.status === 'certify') {
          yesCount++
        }

        if (
          item.status === 'certify' &&
          !['End-User Account', 'AAA', 'ASA', 'ISA', 'YES'].includes(
            item.comment?.slice(-1)[0].comment
          )
        ) {
          maintainCount++
        }
        // if (
        //   item.status === 'revoke' &&
        //   !['Not-Applicable'].includes(
        //     item.comment?.length > 1 && item.comment.slice(-2, -1)[0].comment
        //   )
        // ) {
        //   revokeCount++
        // }
        if (item.status === 'exception') {
          exceptionCount++
        }
      } else if (item.status === 'certify') {
        maintainCount++
      } else if (item.status === 'revoke') {
        revokeCount++
      }
    })
    setSignOffId(signOffIds)
    setCount({
      mCount: maintainCount,
      rCount: revokeCount,
      eCount: exceptionCount,
      aaCount: aaaCount,
      asCount: asaCount,
      iCount: isaCount,
      gCount: guaCount,
      notApplicable: notApplicableCount,
      yesCount: yesCount
    })
  }, [signOffItems])

  const saveDecision = async () => {
    closeModal(false)
    dispatch(updateShowBigLoader(true))
    for (const val of signOffId) {
      const signedOffItem = selectedReviewItems.filter((item) => item.id === val)
      const payload1 = {
        items: [
          {
            id: val,
            comments: [
              {
                action: 'comment',
                comment:
                  signedOffItem[0].status === 'revoke'
                    ? `${profileDetails?.givenName} ${profileDetails?.sn} confirmed the decision as Revoke`
                    : `${profileDetails?.givenName} ${profileDetails?.sn} confirmed the decision as Maintain`,
                user: {
                  _id: profile.userId
                }
              }
            ]
          }
        ]
      }
      await reviewApi.reviewComment('addcomment', id, payload1)
    }

    reviewApi
      .signOffReview(id, {
        ids: signOffId,

        // TODO: actorId needs to be provided by IG
        actorId: `managed/user/${profile.userId}`
      })
      .then(async () => {
        // Clearing the selected review items
        dispatch(updateSelectedReviewItems([]))
        if (sortInfoData.sortKey !== '') {
          dispatch(fetchReviewSortStart(sortInfoData.payload))
        } else if (filterData.currentFilter !== 'All') {
          signOffCallback()
        } else if (appliedFilter.length > 0) {
          let payload = {
            campaignId: id,
            filter: appliedFilter[0].id.type,
            filterValue: appliedFilter[0].id.value,
            pageSize,
            pageNumber,
            status: type1 === 'History' ? getStatus() : getReviewStatus
          }
          if (pageNumber > 0) {
            if (!isGoingForward && paginationKeysArray.length > 0) {
              paginationKeysArray.pop()
              dispatch(updatePaginationKeys(paginationKeysArray))
            }
            // const paginationKey = paginationKeysArray.slice(-1)[0]
            payload = {
              ...payload
              // search_after_primaryKey: paginationKey
            }
          }
          if (filterData.currentFilter === 'All') {
            dispatch(fetchReviewFilterStart(payload))
          }
        } else if (search !== '') {
          const userInfo = await profileAPI.getUserInfo()
          let payload = {
            campaignId: id,
            searchItem: search,
            pageSize,
            pageNumber,
            status: type1 === 'History' ? getStatus() : getReviewStatus,
            certType: reviewCertification
          }
          const semiAnnualSearchPayload = {
            campaignId: id,
            searchItem: search,
            status: type1 === 'History' ? getStatus() : getReviewStatus,
            pageSize,
            pageNumber,
            certType: reviewCertification,
            userEmail: profileDetails?.mail,
            userRole: 'reviewer'
          }
          let resp
          if (isSemiAnnualCampaign) {
            resp = await reviewApi.searchByReviewerSa(
              semiAnnualSearchPayload,
              userInfo.id,
              reviewCertification,
              provisioningRoles
            )
          } else {
            resp = await reviewApi.searchBy(payload, userInfo.id, reviewCertification)
          }
          dispatch(
            fetchReviewItemsSuccess({
              reviewItems: resp
            })
          )
          dispatch(updatePageSize(10))
          dispatch(updatePagenUmber(0))
        } else {
          dispatch(fetchReviewItemsStart(id))
        }

        dispatch(
          updateReviewNotificationMessage({
            type: 'Success',
            message: `${signOffItems.length} ${successMessage}`
          })
        )
      })
      .catch(() => {
        closeModal(false)
        dispatch(
          updateReviewNotificationMessage({
            type: 'error',
            message: `error.generic`
          })
        )
      })
  }

  return (
    <div>
      {/* {loader && <Loading />} */}
      {signOffItems.length > 0 ? (
        <p>
          You are confirming the following number of Review entries:
          <ul>
            {count.aaCount > 0 && <li> {count.aaCount + ' AAA'}</li>}
            {count.asCount > 0 && <li> {count.asCount + ' ASA'}</li>}
            {count.eCount > 0 && <li> {count.eCount + ' Exception'}</li>}
            {count.gCount > 0 && <li> {count.gCount + ' End-User Account'}</li>}
            {count.iCount > 0 && <li> {count.iCount + ' ISA'}</li>}
            {count.mCount > 0 && <li> {count.mCount + ' Maintain'}</li>}
            {count.notApplicable > 0 && <li> {count.notApplicable + ' Not Applicable'}</li>}
            {count.rCount > 0 && <li> {count.rCount + ' Revoke'}</li>}
            {count.yesCount > 0 && <li> {count.yesCount + ' YES'}</li>}
          </ul>
        </p>
      ) : (
        <p>You do not have permissions to sign off the selected Items</p>
      )}
      <Styled.ButtonWrapper>
        <Button
          onClick={saveDecision}
          variant="outlined"
          disabled={signOffItems.length === 0}
          sx={{
            color: `${theme === 'dark' ? '#ffffff' : '#000000'}`,
            borderColor: ' 1px solid rgba(255, 255, 255, 0.4);'
          }}
        >
          Confirm
        </Button>
        <Button
          onClick={() => closeModal(false)}
          sx={{ marginRight: '8px', color: `${theme === 'dark' ? '#ffffff' : '#000000'}` }}
        >
          Cancel
        </Button>
      </Styled.ButtonWrapper>
    </div>
  )
}

export default ReviewSummary
