import * as React from 'react'
import Typography from '@mui/material/Typography'
import styled from 'styled-components/macro'

const CardWrapper = styled.div`
  width: 206px;
  height: 206px;
  color: #333333;
  border: 4px solid #c4c4c4;

  &:hover {
    border: 4px solid black;
  }
`
const CardTitle = styled.p`
  height: 50px;
  width: 117px;
  margin-left: 24px;
  margin-top: 25px;
  font-size: 16px;
  color: ${(props) => props.theme.palette.primary.text};
`
const TitleWrapper = styled.div`
  height: 50px;
  width: 117px;
  left: 24px;
  top: 24px;
`

const HighlightWrapper = styled.h1`
  height: 125px;
  width: 142px;
  margin-left: 28px;
  top: 50px;
  color: ${(props) => props.theme.palette.primary.text};
`
const HistoryCard = ({ title, highlight }) => (
  <CardWrapper>
    <TitleWrapper>
      <CardTitle>{title}</CardTitle>
    </TitleWrapper>
    <HighlightWrapper>
      <Typography
        sx={{
          display: 'inline',
          fontWeight: '400px',
          mx: 0.5,
          fontSize: '66px'
        }}
      >
        {highlight}
      </Typography>
      {/* <Typography sx={{ mx: 0.5 }} variant="subtitle2">
        {description}
      </Typography> */}
    </HighlightWrapper>
  </CardWrapper>
)

export default HistoryCard
HistoryCard.defaultProps = {
  title: '',
  highlight: '',
  description: ''
}
