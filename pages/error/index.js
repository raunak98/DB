import React from 'react'
import { Box } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import translate from 'translations/translate'
import useTheme from '../../hooks/useTheme'

import * as Styled from './style'

const Error = () => {
  const { theme } = useTheme()

  return (
    <>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <FontAwesomeIcon
          icon="fa-solid fa-triangle-exclamation"
          size="5x"
          color={theme === 'dark' ? '#FFF' : '#777'}
        />
        <Box style={{ margin: '20px', color: theme === 'dark' ? '#FFF' : '#777' }}>
          <h3>{translate('error.errorMsg')}</h3>
        </Box>
        <Styled.BackButtonLink
          to={{
            pathname: '/login'
          }}
        >
          <Styled.BackButton>← {translate('error.returnToApplication')}</Styled.BackButton>
        </Styled.BackButtonLink>
      </div>
    </>
  )
}

export default Error
