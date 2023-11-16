import React, { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import {
  Button,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'
import {
  toCamelCase,
  capitalizeFirstLetter
  // , getFormattedDateTime
} from 'helpers/strings'
import translate from 'translations/translate'
import SummaryCard from 'components/summaryCard'
import Loading from 'components/loading'

import {
  // getLastLoginTime,
  getNotification
} from 'api/dashboard'
// import * as profileInfo from 'api/profile'
import * as Styled from './style'
import {
  fetchDashboardItemsStart,
  fetchAccountTypeItemsStart
} from '../../redux/dashboard/dashboard.action'
import { selectDashboardCards } from '../../redux/dashboard/dashboard.selector'
import { selectProfileSelector } from '../../redux/profile/profile.selector'

const Dashboard = () => {
  const theme = useTheme()
  // TODO : Hiding Last Logon functionality till it is handled from FR side

  // let userEmail
  // let lastLogin
  // const [loginDate, setLoginDate] = useState('')
  // const [loginTime, setLoginTime] = useState('')

  const items = useSelector(selectDashboardCards)

  const profile = useSelector(selectProfileSelector)

  const [isActionLableVisible, setIsActionLableVisible] = useState(false)

  const fName = profile && capitalizeFirstLetter(profile.firstName)
  const lName = profile && capitalizeFirstLetter(profile.lastName)
  const profileName = () => `${fName} ${lName}`.replaceAll('"', '')
  const lang = localStorage.getItem('language')

  // TODO : Hiding Last Logon functionality till it is handled from FR side

  // const getLoginDate = (loginDateconvert) => {
  //   const dateObj = new Date(loginDateconvert)

  //   const daysOfWeek = [
  //     'Sunday',
  //     'Monday',
  //     'Tuesday',
  //     'Wednesday',
  //     'Thursday',
  //     'Friday',
  //     'Saturday'
  //   ]
  //   const months = [
  //     'January',
  //     'February',
  //     'March',
  //     'April',
  //     'May',
  //     'June',
  //     'July',
  //     'August',
  //     'September',
  //     'October',
  //     'November',
  //     'December'
  //   ]

  //   const dayOfWeek = daysOfWeek[dateObj.getDay()]
  //   const day = dateObj.getDate()
  //   const month = months[dateObj.getMonth()]

  //   const formattedDate = `${dayOfWeek} ${day} ${month}`
  //   return formattedDate
  // }
  // const fullDateTIme = () => {
  //   const date = getLoginDate(loginDate)
  //   return `${date} at ${getFormattedDateTime(loginTime).split(' ')[1]}`
  // }
  const [linkClicked, setLinkClicked] = useState(false)
  const [notification, setNotification] = useState([false])

  // const handleKeyDown = () => {}

  // const handleIncorrectLogin = () => {
  //   setLinkClicked(true)
  // }

  const handledialogClose = () => setLinkClicked(false)

  useEffect(async () => {
    localStorage.removeItem('requestHistoryId')
    localStorage.removeItem('approvalId')
    localStorage.removeItem('approvalHistoryId')
    localStorage.removeItem('component')
    if (items.length > 0) {
      items.forEach((action) => {
        if (!isActionLableVisible && action.count > 0) {
          setIsActionLableVisible(true)
        }
      })
    }
  }, [items])

  const dispatch = useDispatch()
  useEffect(async () => {
    dispatch(fetchDashboardItemsStart())
    dispatch(fetchAccountTypeItemsStart())
    const notificationData = await getNotification()
    setNotification(notificationData)
  }, [])
  // TODO : Hiding Last Logon functionality till it is handled from FR side
  // useEffect(async () => {
  //   try {
  //     const res1 = await profileInfo.getUserProfileInfo()
  //     userEmail = res1?.mail
  //     lastLogin = await getLastLoginTime(userEmail)
  //     const dateTime = lastLogin.split('T')
  //     setLoginDate(dateTime[0])
  //     setLoginTime(dateTime)
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }, [])

  const getDisplayHeading = (data) => {
    const updateData = data && data.filter((item) => item.displayNotification === true)
    if (updateData.length > 0) {
      return true
    }
    return false
  }

  return (
    <>
      <Styled.HeaderWrapper>
        <Typography variant="h1" style={{ fontSize: '66px', paddingBottom: '25px' }}>
          {translate('dashboard.header.title', { username: profileName() })}
        </Typography>
        {/* <Typography variant="p" style={{ fontSize: '17px', display: 'block' }}>
          {translate('dashboard.last.login', { lastLoginTime: fullDateTIme() })}{' '}
          <span
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer', color: theme?.name === 'dark' ? '#16D8FF' : '#0018a8' }}
            onKeyDown={handleKeyDown}
            onClick={handleIncorrectLogin}
          >
            {translate('dashboard.incorrect.login')}
          </span>
        </Typography> */}
        {isActionLableVisible ? (
          <Typography variant="p" style={{ fontSize: '20px', display: 'block', marginTop: '15px' }}>
            {translate('dashboard.header.description')}
          </Typography>
        ) : null}
      </Styled.HeaderWrapper>

      {items.length ? (
        <Styled.GridWrapper>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3, md: 4 }}>
            {items.map((action) => {
              const id = toCamelCase(action.id)
              return (
                action.redirectTo &&
                ['reviews', 'approvals', 'justifications'].includes(action.id) &&
                action?.displayInMenu && (
                  <Tooltip title={translate(`dashboard.tooltip.${id}`)}>
                    <Styled.CardWrapper
                      key={`summary-card-${action.id}`}
                      style={{ paddingTop: '71px' }}
                    >
                      <Link
                        to={{
                          pathname: action.redirectTo,
                          state: {
                            type: 'Task'
                          }
                        }}
                      >
                        <SummaryCard
                          title={translate(`dashboard.${id}`)}
                          highlight={action.count}
                          description={translate(`dashboard.${id}.description`)}
                        />
                      </Link>
                    </Styled.CardWrapper>
                  </Tooltip>
                )
              )
            })}
          </Stack>
        </Styled.GridWrapper>
      ) : (
        <Loading />
      )}
      {notification?.notification && notification?.notification.length > 0 ? (
        <Styled.NotificationMainWrapper>
          <Box sx={{ width: '100%', paddingTop: '15px' }}>
            {notification?.title && getDisplayHeading(notification?.notification) && (
              <Styled.NotificationHeading>
                <strong>{translate('dashboard.notification')}</strong>
              </Styled.NotificationHeading>
            )}
            <div>
              {notification?.notification &&
                notification?.notification.map(
                  (data) =>
                    data?.displayNotification === true &&
                    (data?.priority && data?.priority === 'high' ? (
                      <div>
                        <Styled.NotificationLi>
                          <Styled.NotificationTDate>
                            <strong> {data.date}</strong>
                          </Styled.NotificationTDate>
                          <Styled.NotificationTitle>
                            {' '}
                            <strong>
                              {' '}
                              {['en-gb', null].includes(lang) ? data.title : data.germanTitle}
                            </strong>
                          </Styled.NotificationTitle>
                          <Styled.NotificationDescription>
                            {' '}
                            <strong>
                              {' '}
                              {['en-gb', null].includes(lang)
                                ? data.description
                                : data.germanDescription}
                            </strong>
                          </Styled.NotificationDescription>
                          {data?.link.map((item) => (
                            <div>
                              <a href={item.link} target="_blank" rel="noreferrer">
                                <strong>
                                  {['en-gb', null].includes(lang) ? item.text : item.germanText}
                                </strong>
                              </a>
                            </div>
                          ))}
                        </Styled.NotificationLi>
                      </div>
                    ) : (
                      <div>
                        <Styled.NotificationLi>
                          <Styled.NotificationTDate> {data.date}</Styled.NotificationTDate>
                          <Styled.NotificationTitle>
                            {' '}
                            {['en-gb', null].includes(lang) ? data.title : data.germanTitle}
                          </Styled.NotificationTitle>
                          <Styled.NotificationDescription>
                            {' '}
                            {['en-gb', null].includes(lang)
                              ? data.description
                              : data.germanDescription}
                          </Styled.NotificationDescription>
                          {data?.link.map((item) => (
                            <div>
                              <a href={item.link} target="_blank" rel="noreferrer">
                                {['en-gb', null].includes(lang) ? item.text : item.germanText}
                              </a>
                            </div>
                          ))}
                        </Styled.NotificationLi>
                      </div>
                    ))
                )}
            </div>
          </Box>
        </Styled.NotificationMainWrapper>
      ) : (
        ''
      )}

      {linkClicked && (
        <Dialog
          open={linkClicked}
          PaperProps={{
            style: {
              backgroundColor: theme.name === 'dark' ? '#1A2129' : '#FFF',
              boxShadow: 'none'
            }
          }}
        >
          <DialogTitle id="alert-dialog-title">{translate('dashboard.popup.title')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div>
                <p>{translate('dashboard.popup.content')}</p>
                <p>{translate('dashboard.popup.telephone')}</p>
                <p>{translate('dashboard.popup.email')}</p>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handledialogClose} autoFocus>
              {translate('dashboard.popup.okBtn')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {/* <Styled.TrobleShort>
        <Icon name="infos" size="small" />
        <span style={{ paddingLeft: '10px' }}>{translate('dashboard.troubleshooting')}</span>
      </Styled.TrobleShort> */}
    </>
  )
}

export default Dashboard
