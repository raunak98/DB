/*eslint-disable*/
import React from 'react'
import PropTypes from 'prop-types'

import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import * as Styled from './ActionModal/style'
import CloseIcon from '@mui/icons-material/Close'

import Dialog from '@mui/material/Dialog'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { TextField, Typography } from '@mui/material'
import useTheme from '../../../hooks/useTheme'
import translate from 'translations/translate'

const DialogText = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    background: 'white'
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
    background: 'white'
  }
}))
function Tag(props) {
  const { label, ...other } = props
  return (
    <div
      {...other}
      style={{
        background: 'transparent',
        borderWidth: 1.5,
        borderColor: 'darkgray',
        justifyContent: 'space-between',
        padding: '3px',
        color: 'rgba(255,255,255,0.08)'
      }}
    >
      <div>{label}</div>
      {/* <CloseIcon /> */}
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
    margin: 2px;
    line-height: 22px;
    background-color: transparent;
    border: 2px solid ${theme.palette.mode === 'dark' ? '#303030' : '#e8e8e8'};
    border-radius: 2px;
    box-sizing: content-box;
    padding: 0 4px 0 10px;
    outline: 0;
    overflow: hidden;
  
    &:focus {
      border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
      background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
    }
  
    & div {
      overflow: hidden;
      text-overflow: clip;
      font-weight: 400;
      font-size: 12px;
      color:${theme.palette.mode === 'dark' ? '#FFF' : '#333'};
    }
  
    & svg {
      font-size: 12px;
      cursor: pointer;
      padding: 4px;
      margin: 6px 5px 4px 6px;
      color:${theme.palette.mode === 'dark' ? '#FFF' : '#333'};
    }
  `
)
const SummaryCard = ({
  selectedUser,
  closeModal,
  setConfirmedFalse,
  handleReassign,
  title,
  failedUsers,
  handleClose,
  modalType,
  reviewSelectedId
}) => {
  const { theme } = useTheme()

  return (
    <>
      {modalType !== 'transferownership' ? (
        <div>
          <div style={{ width: '100%', overflowY: 'initial' }}>
            <h3
              style={{
                fontWeight: 'normal',
                fontSize: '31px',
                color: `${theme === 'dark' ? '#FFF' : '#000'}`
              }}
            >
              {title} - Summary
            </h3>
            <p>
              You have selected {reviewSelectedId.length === 0 ? 1 : reviewSelectedId.length}{' '}
              item(s) to{' '}
              {selectedUser.map((item, index) =>
                selectedUser.length - index !== 1
                  ? `${item.givenName} ${item.sn}, `
                  : `${item.givenName} ${item.sn}`
              )}
              . Confirm to continue
            </p>
            <Styled.LabelWrapper>Account</Styled.LabelWrapper>
            <Box sx={{ flexGrow: 1, background: `${theme === 'dark' ? 'transparent' : '#FFF'}` }}>
              <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {selectedUser.map((item, index) => (
                  <Grid item xs={2} sm={2} md={4} key={index}>
                    <StyledTag key={index} label={item.mail} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </div>
          {failedUsers.length > 0 ? (
            <Styled.ForwardButtonWrapper>
              <Button
                onClick={handleClose()}
                sx={{
                  marginRight: '8px',
                  color: `${theme === 'dark' ? '#FFF' : '#000'}`,
                  fontWeight: 400
                }}
              >
                {translate('close.button')}
              </Button>
            </Styled.ForwardButtonWrapper>
          ) : (
            <Styled.ForwardButtonWrapper>
              <Button
                onClick={handleReassign()}
                variant="outlined"
                sx={{
                  color: `${theme === 'dark' ? '#FFF' : '#000'}`,
                  borderColor: ' 1px solid rgba(255, 255, 255, 0.4);',
                  fontWeight: 400
                }}
              >
                {translate('confirm.button')}
              </Button>

              <Button
                onClick={setConfirmedFalse}
                sx={{
                  marginRight: '8px',
                  color: `${theme === 'dark' ? '#FFF' : '#000'}`,
                  fontWeight: 400
                }}
              >
                {translate('cancel.button')}
              </Button>
            </Styled.ForwardButtonWrapper>
          )}
        </div>
      ) : (
        <div>
          <div style={{ width: '100%', overflowY: 'initial' }}>
            <h3
              style={{
                fontWeight: 'normal',
                fontSize: '31px',
                color: `${theme === 'dark' ? '#FFF' : '#000'}`
              }}
            >
              {title} - Summary
            </h3>
            <Grid
              container
              xs={12}
              sx={{ float: 'right', flexDirection: 'row' }}
              spacing={{ xs: 3 }}
            >
              {selectedUser.map((item, index) => (
                <Grid item={true} key={index} xs={index === 2 ? 12 : 6}>
                  {[0, 1].includes(index) ? (
                    <div style={{ display: 'flex', paddingBottom: '10px' }}>
                      {item?.value ? (
                        <>
                          <div>
                            <b>{item.label} : </b>
                          </div>
                          <div style={{ paddingLeft: '15px' }}>
                            {typeof item.value === 'object' ? item.value.value : item.value}
                          </div>
                        </>
                      ) : null}
                    </div>
                  ) : (
                    <Grid key={index} item={true} xs={12}>
                      <div>
                        <b>{item.label} : </b>
                        {typeof item.value === 'object' ? item.value.value : item.value}
                      </div>
                    </Grid>
                  )}
                </Grid>
              ))}
            </Grid>
          </div>
          {failedUsers.length > 0 ? (
            <Styled.ForwardButtonWrapper>
              <Button
                onClick={handleClose()}
                sx={{
                  marginRight: '8px',
                  color: `${theme === 'dark' ? '#FFF' : '#000'}`,
                  fontWeight: 400
                }}
              >
                {translate('close.button')}
              </Button>
            </Styled.ForwardButtonWrapper>
          ) : (
            <Styled.ForwardButtonWrapper>
              <Button
                onClick={handleReassign()}
                variant="outlined"
                sx={{
                  color: `${theme === 'dark' ? '#FFF' : '#000'}`,
                  borderColor: ' 1px solid rgba(255, 255, 255, 0.4);',
                  fontWeight: 400
                }}
              >
                {translate('confirm.button')}
              </Button>

              <Button
                onClick={setConfirmedFalse}
                sx={{
                  marginRight: '8px',
                  color: `${theme === 'dark' ? '#FFF' : '#000'}`,
                  fontWeight: 400
                }}
              >
                {translate('cancel.button')}
              </Button>
            </Styled.ForwardButtonWrapper>
          )}
        </div>
      )}
    </>
  )
}

export default SummaryCard
