import React, { useEffect, useState } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'
import Stack from '@mui/material/Stack'
import translate from 'translations/translate'
import SummaryCard from 'components/summaryCard'
import Loading from 'components/loading'
// import Icon from 'components/icon'
import * as historyAPI from '../../api/history'
import * as profileAPI from '../../api/profile'
import * as Styled from './style'

const History = () => {
  const [items, setItems] = useState([])
  useEffect(async () => {
    localStorage.removeItem('requestHistoryId')
    localStorage.removeItem('approvalId')
    localStorage.removeItem('approvalHistoryId')
    const userInfo = await profileAPI.getUserInfo()
    historyAPI
      .getHistoryMeta(userInfo?.authenticationId)
      .then((res) => {
        setItems(res)
      })

      .catch(() => {
        // TODO: Notification top-right corner
      })
  }, [])

  return (
    <>
      <Styled.HeaderWrapper style={{ paddingTop: '71px' }}>
        <Typography variant="h1" style={{ fontSize: '66px', paddingBottom: '25px' }}>
          {translate('history.header.title')}
        </Typography>
        <Typography variant="p" style={{ fontSize: '20px' }}>
          {translate('history.header.description')}
        </Typography>
      </Styled.HeaderWrapper>
      <Styled.GridWrapper>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3, md: 4 }}>
          {items?.map(
            (task) =>
              task.redirectTo && (
                <Styled.CardWrapper
                  key={`my-tasks-${task.id}`}
                  style={{ paddingTop: '59px', paddingRight: '16px' }}
                >
                  {task?.displayInMenu && (
                    <Link
                      to={{
                        pathname: task.redirectTo ? task.redirectTo : task.redirectTo[0],
                        state: {
                          type: 'History'
                        }
                      }}
                    >
                      <SummaryCard
                        title={translate(`history.${task.id}`)}
                        highlight={task.count}
                        description=""
                        type="history"
                      />
                    </Link>
                  )}
                </Styled.CardWrapper>
              )
          )}
        </Stack>
        {items?.length === 0 && <Loading />}
      </Styled.GridWrapper>
      {/* <Styled.TrobleShort>
        <Icon name="infos" size="small" />
        <span style={{ paddingLeft: '10px' }}>{translate('dashboard.troubleshooting')}</span>
      </Styled.TrobleShort> */}
    </>
  )
}

export default History
