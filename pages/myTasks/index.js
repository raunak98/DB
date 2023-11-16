import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouteMatch, Link } from 'react-router-dom'
import { Typography, Tooltip } from '@mui/material'
import Stack from '@mui/material/Stack'
import MCard from 'components/mCard'
import Loading from 'components/loading'
import translate from 'translations/translate'
import * as Styled from './style'
import { selectDashboardCards } from '../../redux/dashboard/dashboard.selector'
import { fetchDashboardItemsStart } from '../../redux/dashboard/dashboard.action'

const MyTasks = () => {
  const items = useSelector(selectDashboardCards)
  const match = useRouteMatch()

  const { path } = match

  const dispatch = useDispatch()
  useEffect(async () => {
    localStorage.removeItem('requestHistoryId')
    localStorage.removeItem('approvalId')
    localStorage.removeItem('approvalHistoryId')
    dispatch(fetchDashboardItemsStart())
  }, [])

  return (
    <>
      <Styled.HeaderWrapper>
        <Typography variant="h1" style={{ fontSize: '66px', paddingBottom: '25px' }}>
          {translate('myTasks.header.title')}
        </Typography>
        <Typography variant="p" style={{ fontSize: '20px' }}>
          {translate('myTasks.header.description')}
        </Typography>
      </Styled.HeaderWrapper>
      <Styled.GridWrapper>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3, md: 4 }}>
          {items.map(
            (task) =>
              ['reviews', 'approvals', 'justifications'].includes(task.id) &&
              task?.displayInMenu && (
                <Tooltip title={translate(`dashboard.tooltip.${task.id}`)}>
                  <Styled.CardWrapper
                    key={`my-tasks-${task.id}`}
                    style={{ paddingTop: '59px', paddingRight: '16px' }}
                  >
                    <Link to={`${path}/${task.id}`}>
                      <MCard
                        textOnly
                        title={translate(`myTasks.${task.id}`)}
                        highlight={task.count}
                      />
                    </Link>
                  </Styled.CardWrapper>
                </Tooltip>
              )
          )}
          {items.length === 0 && <Loading />}
        </Stack>
      </Styled.GridWrapper>
      {/* <Styled.TrobleShort>
        <Icon name="infos" size="small" />
        <span style={{ paddingLeft: '10px' }}>{translate('dashboard.troubleshooting')}</span>
      </Styled.TrobleShort> */}
    </>
  )
}

export default MyTasks
