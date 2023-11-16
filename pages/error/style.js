import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'

export const BackButton = styled.span`
  ${({ theme }) => css`
    font-size: 14px;
    display: block;
    color: ${theme.colors.errorLink};
  `}
`

export const BackButtonLink = styled(Link)`
  ${({ theme }) => css`
    text-decoration: none;
    color: #999;
    ${theme.mixins.gridColumns(12)};
  `}
`
