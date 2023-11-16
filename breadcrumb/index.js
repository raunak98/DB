import React from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs, Typography } from '@mui/material'
import useTheme from '../../hooks/useTheme'

function Breadcrumb({ path }) {
  const { theme } = useTheme()

  return (
    <Breadcrumbs style={{ margin: '25px 0' }} aria-label="breadcrumb">
      {path &&
        path.map((item) =>
          item.url ? (
            <Link
              key={item.label}
              style={{ textDecoration: 'underline', color: theme === 'dark' ? '#FFF' : '#333' }}
              to={item.url}
            >
              {item.label}
            </Link>
          ) : (
            <Typography
              color="text.primary"
              style={{ fontWeight: '600', color: '#C4C4C4' }}
              key={item.label}
            >
              {item.label}
            </Typography>
          )
        )}
    </Breadcrumbs>
  )
}

export default Breadcrumb
