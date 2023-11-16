import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'

export const BackButtonLink = styled(Link)`
  ${({ theme }) => css`
    text-decoration: none;
    ${theme.mixins.gridColumns(12)};
  `}
`
export const BackButton = styled.span`
  ${({ theme }) => css`
    font-size: 20px;
    color: ${theme.colors.textPrimary};
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
    min-height: 250px;
    background-color: ${theme.palette.mode === 'dark' ? '#1A2129' : '#FFFFFF'};
  `}
`
export const ButtonWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
    padding-top: 10px;
    height: 50px;
    button {
      float: right;
    }
  `}
`

export const NotificationWrapper = styled.div`
  ${() => css`
    grid-column-end: span 12;
  `}
`

export const LinkButton = styled.a`
  ${({ theme }) => css`
    text-decoration: none;

    > button {
      background: ${theme.colors.logo};
    }
  `}
`
