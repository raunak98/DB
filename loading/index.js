import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import styled, { css } from 'styled-components/macro'
import { Typography } from '@mui/material'

const LoaderWrapper = styled.div`
  left: 0;
  top: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: ${(props) => (props.stackIndex ? props.stackIndex : 500)};
  ${({ theme }) => css`
    background-color: ${theme.colors.loaderBackgroundColor};
  `}
`

const Loading = ({ index, processRequest }) => (
  <>
    <LoaderWrapper stackIndex={index}>
      <CircularProgress
        sx={{ top: '50%', left: '50%', position: 'absolute', zIndex: index + 1 || 501 }}
        mode="determinate"
        value={75}
        size={100}
      />
      {processRequest && processRequest.ongoingRequest && (
        <Typography
          sx={{
            top: '65%',
            left: '44%',
            position: 'absolute',
            zIndex: index + 1 || 501,
            fontSize: '20px',
            align: 'center'
          }}
        >
          {`Processing ${processRequest.ongoingRequest} of ${processRequest.totalRequest} Records`}
        </Typography>
      )}
    </LoaderWrapper>
  </>
)

export default Loading
