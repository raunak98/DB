import React from 'react'
import styled from 'styled-components/macro'
import CssBaseline from '@mui/material/CssBaseline'
// import * as Styled from './style'

const HeaderTitle = styled.h1`
  font-size: 64px;
  display: flex;
  line-height: 56px;
  align-items: center;
  color: #333333;
  font-family: 'Open Sans', sans-serif;
  font-weight: 400;
  color: ${(props) => props.theme.palette.primary.text};
`
const HeaderDescription = styled.p`
  font-size: 16px;
  line-height: 20px;
  display: flex;
  align-items: center;
  color: #333333;
  font-family: 'Open Sans', sans-serif;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0em;
  text-align: left;
  color: ${(props) => props.theme.palette.primary.text};
`
const Wrapper = styled.div`
  width: 100%;
`
const DescriptionWrapper = styled.div`
  width: 264px;
  left: 393px;
  top: 245px;
  border-radius: 0px;
  margin-top: 46px;
`

const HeaderWrapper = styled.div`
  height: 56px;
  width: 896px;
  left: 387px;
  top: 166px;
  border-radius: nullpx;
`

const Header = ({ title, description }) => (
  <Wrapper data-testid="header">
    <CssBaseline />
    <HeaderWrapper>
      <HeaderTitle>{title}</HeaderTitle>
    </HeaderWrapper>

    <DescriptionWrapper>
      <HeaderDescription>{description}</HeaderDescription>
    </DescriptionWrapper>
  </Wrapper>
)

export default Header
Header.defaultProps = {
  title: '',
  description: ''
}
