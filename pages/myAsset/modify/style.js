import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'

export const BackButton = styled.span`
  ${({ theme }) => css`
    font-size: 20px;
    color: ${theme.colors.textPrimary};
  `}
`
export const BackButtonLink = styled(Link)`
  ${({ theme }) => css`
    text-decoration: none;
    ${theme.mixins.gridColumns(12)};
  `}
`
export const HeaderWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
  `}
`

export const MainWrapper = styled.div`
  ${({ theme }) => css`
    width: 100%;
    min-height: 520px;
    background-color: ${theme.palette.mode === 'dark' ? '#1A2129' : '#FFF'};
  `}
`
export const SubHeader = styled.div`
  ${() => css`
    height: 28px;
    width: 440px;
    left: 23px;
    top: 29px;
  `}
`
export const NotificationWrapper = styled.div`
  ${() => css`
    grid-column-end: span 12;
  `}
`
