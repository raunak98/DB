import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, TextField, Typography } from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import translate from 'translations/translate'
import * as profileAPI from 'api/profile'
import useTheme from '../../../../hooks/useTheme'
import * as Styled from './style'
import Loading from '../../../../components/loading'
import {
  fetchReviewItemsStart,
  updateReviewNotificationMessage,
  updateShowSmallLoader,
  updateShowBigLoader,
  fetchReviewSortStart,
  fetchReviewerSortStart,
  fetchMonitorSortStart,
  fetchReviewFilterStart,
  updatePageSize,
  updatePagenUmber,
  fetchReviewItemsSuccess,
  updatePaginationKeys,
  getReviewItemTotalCount
} from '../../../../redux/review/review.action'
import {
  selectProfileDetailsSelector,
  selectProfileSelector,
  selectProvisioningRoles
} from '../../../../redux/profile/profile.selector'
import {
  selectSortInfoData,
  selectFilterData,
  selectApplyFilters,
  selectReviewPageSize,
  selectSeach,
  selectReviewPageNumber,
  selectIsGoingForwardFlag,
  selectPaginationKeys,
  selectUpdateIsReviewerTabActive,
  selectIsSemiAnnualCampaign
} from '../../../../redux/review/review.selector'
import * as reviewApi from '../../../../api/review'
import { getFormattedDateTime } from '../../../../helpers/strings'

const ReviewComments = ({
  reviewId,
  comments,
  handleClose,
  type,
  status,
  onCallback,
  disabled
}) => {
  const [comm, setComment] = useState('')
  const [error, setError] = useState('')
  const [leaveComment, setLeaveComment] = useState(false)
  const [loader, setLoader] = useState(false)
  const dispatch = useDispatch()
  const profile = useSelector(selectProfileSelector)
  const sortInfoData = useSelector(selectSortInfoData)
  const filterData = useSelector(selectFilterData)
  const appliedFilter = useSelector(selectApplyFilters)
  const pageSize = useSelector(selectReviewPageSize)
  const search = useSelector(selectSeach)
  const pageNumber = useSelector(selectReviewPageNumber)
  const isGoingForward = useSelector(selectIsGoingForwardFlag)
  const paginationKeysArray = useSelector(selectPaginationKeys)
  const isReviewerTabActiveSelector = useSelector(selectUpdateIsReviewerTabActive)
  const isSemiAnnualCampaign = useSelector(selectIsSemiAnnualCampaign)
  const profileDetails = useSelector(selectProfileDetailsSelector)
  const provisioningRoles = useSelector(selectProvisioningRoles)
  // const { id } = useParams()
  const location = useLocation()
  const id = location?.state?.id
  const { theme } = useTheme()

  const getStatus = () =>
    localStorage.getItem('historyStatus') === 'complete'
      ? 'signed-off,expired,cancelled'
      : 'expired'

  const checkFOrFIlter = async () => {
    const userInfo = await profileAPI.getUserInfo()
    const certification = await reviewApi.getCampaignInfo(id)
    if (appliedFilter.length > 0) {
      let payload1 = {
        campaignId: id,
        filter: appliedFilter[0].id.type,
        filterValue: appliedFilter[0].id.value,
        pageSize,
        pageNumber,
        status: type === 'History' ? getStatus() : 'in-progress'
      }
      if (pageNumber > 0) {
        if (!isGoingForward && paginationKeysArray.length > 0) {
          paginationKeysArray.pop()
          dispatch(updatePaginationKeys(paginationKeysArray))
        }
        // const paginationKey = paginationKeysArray.slice(-1)[0]
        payload1 = {
          ...payload1
          // search_after_primaryKey: paginationKey
        }
      }
      if (appliedFilter.length === 2) {
        if (isReviewerTabActiveSelector) {
          const filterAndGroupByForReviewer = {
            campaignId: id,
            status: type === 'History' ? getStatus() : 'in-progress',
            pageSize,
            pageNumber,
            filterBy: appliedFilter[0].id.type,
            filterByValue: appliedFilter[0].id.value,
            userRole: 'reviewer',
            userEmail: profileDetails?.mail,
            group: appliedFilter[1].id.type,
            groupedValue: filterData.groupByValue
          }
          reviewApi
            .postFilterAndGroupByDataSa(
              filterAndGroupByForReviewer,
              userInfo?.id,
              certification,
              provisioningRoles
            )
            .then((response) => {
              dispatch(
                fetchReviewItemsSuccess({
                  reviewItems: response?.normalizedData
                })
              )
              dispatch(
                getReviewItemTotalCount(
                  response?.normalizedData?.length > 0 &&
                    response?.normalizedData[0]?.total !== undefined
                    ? response.normalizedData[0]?.total
                    : 0
                )
              )
            })
            .catch((issue) => {
              console.error(issue)
              dispatch(updateShowBigLoader(false))
            })
        } else {
          const filterAndGroupByForMonitor = {
            campaignId: id,
            status: type === 'History' ? getStatus() : 'in-progress',
            pageSize,
            pageNumber,
            filterBy: appliedFilter[0].id.type,
            filterByValue: appliedFilter[0].id.value,
            userRole: 'reviewer',
            userEmail: filterData.groupByValue
          }
          reviewApi
            .postFilterAndGroupByMonitorDataSa(
              filterAndGroupByForMonitor,
              userInfo?.id,
              certification,
              provisioningRoles
            )
            .then((response) => {
              dispatch(
                fetchReviewItemsSuccess({
                  reviewItems: response?.normalizedData
                })
              )
              dispatch(
                getReviewItemTotalCount(
                  response?.normalizedData?.length > 0 &&
                    response?.normalizedData[0]?.total !== undefined
                    ? response.normalizedData[0]?.total
                    : 0
                )
              )
            })
            .catch((issue) => {
              console.error(issue)
              dispatch(updateShowBigLoader(false))
            })
        }
      } else if (filterData.currentFilter === 'All') {
        dispatch(fetchReviewFilterStart(payload1))
      }
    } else if (search !== '') {
      const payload = {
        campaignId: id,
        searchItem: search,
        pageSize,
        pageNumber,
        status: type === 'History' ? getStatus() : 'in-progress',
        certType: certification
      }
      const semiAnnualSearchPayload = {
        campaignId: id,
        searchItem: search,
        status: type === 'History' ? getStatus() : 'in-progress',
        pageSize,
        pageNumber,
        certType: certification,
        userEmail: profileDetails?.mail,
        userRole: 'reviewer'
      }
      let resp
      if (isSemiAnnualCampaign) {
        resp = await reviewApi.searchByReviewerSa(
          semiAnnualSearchPayload,
          userInfo.id,
          certification,
          provisioningRoles
        )
      } else {
        resp = await reviewApi.searchBy(payload, userInfo.id, certification)
      }

      dispatch(updatePageSize(10))
      dispatch(updatePagenUmber(0))
      dispatch(
        fetchReviewItemsSuccess({
          reviewItems: resp
        })
      )
    } else {
      dispatch(fetchReviewItemsStart(id))
    }
  }
  if (status === 'revoke' && type === 'revoke') {
    onCallback()
    handleClose(false)
    const reviewData = []
    reviewId.map((Id) =>
      reviewData.push({
        id: Id,
        comments: [{ action: 'comment', comment: comm }],
        decision: 'reset'
      })
    )
    const payload = {
      items: reviewData
    }
    dispatch(updateShowSmallLoader(true))
    reviewApi.reviewActions('revoke', id, payload) // Need to change to .reviewAction('comment', id, payload)
    if (sortInfoData.sortKey !== '') {
      if (isSemiAnnualCampaign) {
        if (isReviewerTabActiveSelector) {
          dispatch(fetchReviewerSortStart(sortInfoData.payload))
        } else {
          dispatch(fetchMonitorSortStart(sortInfoData.payload))
        }
      } else {
        dispatch(fetchReviewSortStart(sortInfoData.payload))
      }
    } else {
      checkFOrFIlter(id)
    }
  }
  const containsSpecialChars = (str) => {
    // eslint-disable-next-line no-useless-escape
    const specialChars = /[`\{}\\<>\/]/
    return specialChars.test(str)
  }

  const handleComment = () => {
    if (comm !== 'ISA' && comm !== 'ASA' && !containsSpecialChars(comm)) {
      handleClose(false)
      if (type === 'revoke') {
        onCallback()
        const reviewData = []
        reviewId.map((Id) =>
          reviewData.push({
            id: Id,
            comments: [{ action: 'comment', comment: comm }],
            decision: 'revoke'
          })
        )
        const payload = {
          items: reviewData
        }
        if (payload.items.length > 1) {
          dispatch(updateShowBigLoader(true))
        } else {
          dispatch(updateShowSmallLoader(true))
        }
        reviewApi
          .reviewActions('revoke', id, payload) // Need to change to .reviewAction('comment', id, payload)
          .then((res) => {
            if (sortInfoData.sortKey !== '') {
              if (isSemiAnnualCampaign) {
                if (isReviewerTabActiveSelector) {
                  dispatch(fetchReviewerSortStart(sortInfoData.payload))
                } else {
                  dispatch(fetchMonitorSortStart(sortInfoData.payload))
                }
              } else {
                dispatch(fetchReviewSortStart(sortInfoData.payload))
              }
            } else {
              checkFOrFIlter(id)
            }
            if (res.status === 200) {
              dispatch(
                updateReviewNotificationMessage({
                  type: 'Success',
                  message: 'accessrevoke.success'
                })
              )
            }
          })
          .catch((err) => {
            setLoader(false)
            dispatch(
              updateReviewNotificationMessage({
                type: 'Error',
                message: `${err}`
              })
            )
          })
      } else {
        setLoader(true)
        const payload = {
          items: [
            {
              id: reviewId[0],
              comments: [
                {
                  action: 'comment',
                  comment: comm,
                  user: {
                    _id: profile.userId
                  }
                }
              ]
            }
          ]
        }
        reviewApi
          .reviewComment('addcomment', id, payload) // this API will add comments on revoke
          .then(() => {
            setLoader(false)
            handleClose(false)
            if (sortInfoData.sortKey !== '') {
              if (isSemiAnnualCampaign) {
                if (isReviewerTabActiveSelector) {
                  dispatch(fetchReviewerSortStart(sortInfoData.payload))
                } else {
                  dispatch(fetchMonitorSortStart(sortInfoData.payload))
                }
              } else {
                dispatch(fetchReviewSortStart(sortInfoData.payload))
              }
            } else {
              checkFOrFIlter(id)
            }
            dispatch(
              updateReviewNotificationMessage({
                type: 'Success',
                message: 'comment.success'
              })
            )
          })
          .catch((err) => {
            console.error(err)
            setLoader(false)
            handleClose(false)
            dispatch(
              updateReviewNotificationMessage({
                type: 'error',
                message: 'comment.error'
              })
            )
          })
      }
    } else {
      containsSpecialChars(comm)
      setError(
        containsSpecialChars(comm)
          ? '"<>{}/\\"characters are not allowed'
          : 'Please type different comment'
      )
    }
  }

  return (
    <>
      {loader && <Loading />}
      {type !== 'revoke' && (
        <>
          {!leaveComment ? (
            <>
              <Typography variant="h1" style={{ fontWeight: '300', marginBottom: '30px' }}>
                {translate('comments.heading.title')}
              </Typography>
              {comments?.length > 0 ? (
                <>
                  {comments.map((e) => (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div
                            style={{
                              background: theme === 'dark' ? 'transparent' : '#eff9fc',
                              borderRadius: '40px',
                              margin: '5px 5px 0 4px'
                            }}
                          >
                            <ChatBubbleOutlineIcon
                              style={{ margin: '11px 10px 7px 10px', opacity: '0.5' }}
                            />
                          </div>
                          <Box display="flex" flexDirection="column">
                            <Typography color={theme === 'dark' ? '#fff' : '#333'} variant="body1">
                              {e.user.givenName} {e.user.sn}
                            </Typography>
                            <Typography
                              color={theme === 'dark' ? '#fff' : '#EFF9FC'}
                              variant="body1"
                            >
                              {e.user.mail}
                            </Typography>
                          </Box>
                        </div>
                        <div style={{ alignSelf: 'center' }}>
                          <Typography variant="body1">
                            {e.timeStamp ? getFormattedDateTime(e.timeStamp) : ''}
                          </Typography>
                        </div>
                      </div>
                      <div style={{ marginLeft: '50px' }}>
                        <Typography variant="body1">{e.comment}</Typography>
                      </div>
                    </>
                  ))}
                </>
              ) : (
                <p>{translate('comments.noComments')}</p>
              )}
              {disabled ? (
                ''
              ) : (
                <Button
                  variant="contained"
                  style={{ width: '100%', marginTop: '15px' }}
                  onClick={() => setLeaveComment(true)}
                >
                  {translate('comments.leaveAComment')}
                </Button>
              )}
            </>
          ) : (
            <>
              <p>{translate('comments.leaveComments')}</p>
              <TextField
                id="outlined-multiline-static"
                label={translate('comments.addNewcomment')}
                multiline
                rows={4}
                sx={{ marginTop: 5, width: '100%' }}
                value={comm}
                onChange={(event) => {
                  setComment(event.target.value)
                  setError('')
                }}
              />
              {/* This is to avoid user to input existing keyword as comment */}
              {error && <div style={{ color: 'red', fontSize: '12px' }}>{error}</div>}
              <Styled.CommentButtonWrapper>
                <Button
                  variant="outlined"
                  sx={{
                    color: `${theme === 'dark' ? '#fff' : '#000'}`,
                    borderColor: '#000'
                  }}
                  disabled={!comm?.length > 0}
                  onClick={handleComment}
                >
                  {translate('comment.button')}
                </Button>
                <Button
                  onClick={() => handleClose(false)}
                  sx={{ marginRight: '8px', color: '#000' }}
                >
                  {translate('cancel.button')}
                </Button>
              </Styled.CommentButtonWrapper>
            </>
          )}
        </>
      )}

      {type === 'revoke' && (
        <>
          <Typography variant="h3">Revoke Access</Typography>
          <p style={{ margin: '20px 0' }}>Revoke access for this user to the requested resource</p>
          <TextField
            style={{ width: '100%' }}
            id="outlined-basic"
            label={translate('comments.addNewcomment')}
            variant="outlined"
            onChange={(cmt) => {
              setComment(cmt.target.value)
            }}
          />
          <Styled.CommentButtonWrapper>
            <Button
              style={{ marginLeft: '10px' }}
              disabled={!(comm && comm.length > 0)}
              onClick={handleComment}
              primary
              variant="outlined"
              sx={{ color: `${theme === 'dark' ? '#ffffff' : '#000000'}`, borderColor: '#000000' }}
            >
              Confirm
            </Button>
            <Button
              variant="text"
              sx={{ marginRight: '8px', color: `${theme === 'dark' ? '#ffffff' : '#000000'}` }}
              onClick={() => handleClose(false)}
            >
              Cancel
            </Button>
          </Styled.CommentButtonWrapper>
        </>
      )}
    </>
  )
}

export default ReviewComments
