import React, { useState } from 'react'
import { Tooltip, Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import CircularIntegration from 'components/circularIntegration'
import useTheme from '../../../hooks/useTheme'
import * as historyAPI from '../../../api/history'
import translate from '../../../translations/translate'
import { updateReviewNotificationMessage } from '../../../redux/review/review.action'
import {
  selectJustificationsPageNumber,
  selectJustificationsPageSize,
  selectJustificationsPaginationKeys
} from '../../../redux/justifications/justifications.selector'
import {
  selectRequestHistoryPageNumber,
  selectRequestHistoryPageSize,
  selectRequestHistoryPaginationKeys,
  selectRequestHistoryItems
} from '../../../redux/history/requestHistory/requestHistory.selector'
import {
  selectDraftsPageNumber,
  selectDraftsPageSize,
  selectPaginationKeys
} from '../../../redux/drafts/drafts.selector'
import { fetchJustificationsItemsStart } from '../../../redux/justifications/justifications.action'
import { fetchRequestHistoryItemsStart } from '../../../redux/history/requestHistory/requestHistory.action'
import { fetchDraftsItemsStart } from '../../../redux/drafts/drafts.action'

const WithdrawIcon = ({ type, permission = true, isDisabled, title, reviewId, phaseId }) => {
  const [loader, setLoader] = useState(false)
  const { theme } = useTheme()
  const [open, setOpen] = React.useState(false)
  const cancelSuccess = translate('cancel.success')
  const cancelError = translate('cancel.error')
  const myTeamSelectedUserId = localStorage.getItem('myTeam-userId')
  const dispatch = useDispatch()
  let pageNumber
  let pageSize
  let paginationKeysArray
  let resultItems
  switch (type) {
    case 'Justifications':
      pageNumber = useSelector(selectJustificationsPageNumber)
      pageSize = useSelector(selectJustificationsPageSize)
      paginationKeysArray = useSelector(selectJustificationsPaginationKeys)
      break
    case 'Drafts':
      pageNumber = useSelector(selectDraftsPageNumber)
      pageSize = useSelector(selectDraftsPageSize)
      paginationKeysArray = useSelector(selectPaginationKeys)
      break
    default:
      pageNumber = useSelector(selectRequestHistoryPageNumber)
      pageSize = useSelector(selectRequestHistoryPageSize)
      paginationKeysArray = useSelector(selectRequestHistoryPaginationKeys)
      resultItems = useSelector(selectRequestHistoryItems)
      break
  }

  const handleConfirm = () => {
    setOpen(false)
    setLoader(true)
    // Call API when Clicked on Withdraw Button
    historyAPI
      .cancelRequest(reviewId, phaseId)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            updateReviewNotificationMessage({
              type: 'Success',
              message: cancelSuccess
            })
          )

          setLoader(false)
        } else {
          dispatch(
            updateReviewNotificationMessage({
              type: 'Error',
              message: cancelError
            })
          )

          setLoader(false)
        }
        switch (type) {
          case 'Justifications':
            dispatch(fetchJustificationsItemsStart(pageSize, pageNumber))
            break
          case 'Drafts':
            dispatch(
              fetchDraftsItemsStart({
                saKeyWord: null,
                saprimaryKey: null
              })
            )
            break
          default:
            dispatch(
              fetchRequestHistoryItemsStart(
                myTeamSelectedUserId
                  ? {
                      sortOn: 'RequestHistory',
                      sortOnValue: 'false',
                      sortBy: 'request.common.startDate',
                      sortOrder: 'asc',
                      id: myTeamSelectedUserId,
                      pageSize: 10
                    }
                  : {
                      saKeyWord:
                        pageNumber > 0 ? resultItems?.historyData.slice(-1)[0]?.sortKeyword : null,
                      saprimaryKey: pageNumber > 0 ? paginationKeysArray.slice(-1)[0] : null
                    }
              )
            )
            break
        }
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

  const onChange = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Tooltip title={title}>
        <Button
          onClick={onChange}
          sx={{
            padding: '3px 0',
            color: `${theme === 'dark' ? '#FFF' : '#000'}`
          }}
        >
          <CircularIntegration
            name="delete"
            onClick={onChange}
            loader={loader}
            disabled={!permission || isDisabled}
            style={{ background: 'transparent' }}
          />
        </Button>
      </Tooltip>
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

WithdrawIcon.defaultProps = {
  defaultChecked: false,
  disabled: false,
  errorMessage: '',
  label: '',
  name: '',
  onChangeCallback: undefined
}

export default WithdrawIcon
