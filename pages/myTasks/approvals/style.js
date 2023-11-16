import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'

export const ApproveButtonWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
    padding: 10px;
    height: 50px;
    button {
      float: right;
    }
  `}
`
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
export const NotificationWrapper = styled.div`
  ${() => css`
    grid-column-end: span 12;
  `}
`
