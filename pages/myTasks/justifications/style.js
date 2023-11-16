import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'

export const BackButton = styled.span`
  ${({ theme }) => css`
    font-size: 14px;
    color: ${theme.colors.textPrimary};
  `}
`

export const BackButtonLink = styled(Link)`
  ${({ theme }) => css`
    text-decoration: none;
    ${theme.mixins.gridColumns(12)};
  `}
`
