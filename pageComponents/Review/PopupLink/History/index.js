import React, { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import Icon from 'components/icon'
import translate from 'translations/translate'
import useTheme from '../../../../hooks/useTheme'
import * as reviewApi from '../../../../api/review'
import * as Styled from './style'

const ViewHistory = ({ dataItem }) => {
  const [history, setHistory] = useState({ items: [], error: undefined, loading: false })
  const { theme } = useTheme()

  useEffect(() => {
    setHistory({ ...history, loading: true })
    reviewApi
      .getItemHistory(dataItem.id)
      .then((response) => setHistory({ ...history, items: response, loading: false }))
      .catch(() => {
        setHistory({ ...history, error: `Can't fetch item history`, loading: false })
      })
  }, [])
  const formatDate = (date) => {
    const dateString = new Date(date)
    return dateString.toLocaleString()
  }

  const getDecision = () => {
    if (dataItem.decision.decision === 'certify') {
      return 'Maintain'
    }
    return dataItem.decision.decision
  }

  return (
    <div style={{ marginTop: '-45px' }}>
      <h5 style={{ fontSize: '2rem' }}>View History List</h5>
      {dataItem.decision && dataItem.decision.decisionBy ? (
        <Styled.Wrapper>
          <div style={{ justifyContent: 'space-between' }}>
            <div style={{ alignItems: 'center', marginBottom: '25px' }}>
              <div
                style={{
                  background: theme === 'dark' ? 'transparent' : '#fff',
                  borderRadius: '40px',
                  margin: '0px',
                  height: '50px',
                  width: '5%',
                  display: 'flex',
                  position: 'absolute',
                  fontSize: '16px'
                }}
              >
                <Icon name="requests" size="large" />
              </div>
              <Typography
                color={theme === 'dark' ? '#fff' : '#333'}
                variant="body1"
                style={{
                  position: 'relative',
                  marginLeft: '56px',
                  marginBottom: '11px',
                  fontSize: '16px'
                }}
              >
                {dataItem.decision.decisionBy.givenName
                  ? dataItem.decision.decisionBy.givenName
                  : ''}
              </Typography>
              <Typography
                color={theme === 'dark' ? '#fff' : '#8e8e8e'}
                variant="body1"
                style={{
                  position: 'relative',
                  marginLeft: '118px',
                  marginTop: '-35px',
                  fontSize: '16px'
                }}
              >
                {dataItem.decision.decisionBy.mail ? dataItem.decision.decisionBy.mail : ''}
              </Typography>
              <Typography
                color={theme === 'dark' ? '#fff' : '#000000'}
                variant="body1"
                style={{ marginLeft: '57px', fontSize: '16px' }}
              >
                Decision: {dataItem.decision.decision ? getDecision() : ''}
              </Typography>
              <Typography
                color={theme === 'dark' ? '#fff' : '#000000'}
                variant="body1"
                style={{ marginLeft: '57px', fontSize: '16px' }}
              >
                Date of decision:{' '}
                {dataItem.decision.decisionDate ? formatDate(dataItem.decision.decisionDate) : ''}
              </Typography>
            </div>
          </div>
          <Styled.Date>
            {dataItem.decision.decisionDate ? formatDate(dataItem.decision.decisionDate) : ''}
          </Styled.Date>
        </Styled.Wrapper>
      ) : (
        <Styled.NoHistory>
          <div>
            <p>{translate('popup.noHistory')}</p>
          </div>
        </Styled.NoHistory>
      )}
    </div>
  )
}

export default ViewHistory
