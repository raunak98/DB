import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Grid, Box, Tabs, Tab } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import { blue } from '@mui/material/colors'
import Breadcrumb from 'components/breadcrumb'
import translate from 'translations/translate'
import { selectNotificationMessage } from '../../redux/review/review.selector'
import MembershipTable from './MembershipTable'
import { updateReviewNotificationMessage } from '../../redux/review/review.action'
import { selectShowSmallAccessLoader } from '../../redux/myAccess/myAccess.selector'
import * as Styled from './style'

const MyAccess = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const getNotificationMessage = useSelector(selectNotificationMessage)
  const showSmallLoading = useSelector(selectShowSmallAccessLoader)

  const [value, setValue] = useState(0)

  const tabs = [
    {
      id: '1',
      label: `${translate('myAccessTab.groupMembership')}`
    }
  ]

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
    if (
      getNotificationMessage.message &&
      ['success', 'Success', 'info', 'Error', 'error'].includes(getNotificationMessage.type)
    ) {
      setTimeout(() => {
        // dispatch here
        dispatch(
          updateReviewNotificationMessage({
            type: '',
            message: '',
            action: ''
          })
        )
      }, 5000)
    }
  }, [getNotificationMessage])

  // To Get metadata and  api data on Initital Page
  useEffect(() => {
    localStorage.clear()
    localStorage.setItem('component', 'Modify')
  }, [])

  return (
    <>
      <Styled.BackButtonLink to="/dashboard">
        <Styled.BackButton>← {translate('review.back')}</Styled.BackButton>
      </Styled.BackButtonLink>
      <Breadcrumb
        path={[
          { label: translate('navItem.label.dashboard'), url: './dashboard' },
          { label: translate('myAccess.header'), url: '' }
        ]}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid container>
          <Grid item xs={12} style={{ display: 'flex' }}>
            <h1 style={{ fontWeight: 'normal', marginBottom: '10px' }}>
              {translate('myAccess.header')}
            </h1>
            <div style={{ marginTop: '22px', marginLeft: '5px' }}>
              {showSmallLoading && (
                <CircularProgress
                  size={23}
                  sx={{
                    top: '5px',
                    marginBottom: '10px',
                    position: 'relative',
                    color: blue[500]
                  }}
                />
              )}
            </div>
          </Grid>
        </Grid>
      </div>

      <Grid sx={{ padding: '9px 11px 6px 9px' }}>
        <Grid item xs={12}>
          <Box
            sx={{
              width: '100%',
              backgroundColor: `${theme.palette.mode === 'dark' ? '#1a2129' : '#FFF'}`
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="myAccess-tabs"
              >
                {tabs &&
                  tabs.map((tabDetails) => (
                    <Tab key={tabDetails.id} sx={{ fontSize: '16px' }} label={tabDetails.label} />
                  ))}
              </Tabs>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          {/* {renderTab(value)} */}
          {(() => {
            switch (value) {
              case 0:
                return (
                  <div
                    style={{
                      width: '100%',
                      backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#FFF'
                    }}
                    key={3}
                  >
                    <MembershipTable />
                  </div>
                )

              default:
                return <></>
            }
          })()}
        </Grid>
      </Grid>
    </>
  )
}
export default MyAccess
