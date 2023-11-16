import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'

export const TableWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
  `}
`

export const TrobleShort = styled.div`
  font-size: 15px;
  display: inline-flex;
  font-weight: 400;
  margin-top: 65px;
`

export const SubmitButtonWrapper = styled.span`
  float: right;
  padding-top: 48px;
`

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
