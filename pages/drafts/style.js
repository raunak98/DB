import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'

export const HeaderWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
  `}
`

export const TableOptionsWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
    align-items: center;
    position: relative;
    padding: 9px 11px 6px 9px;

    display: flex;

    // > div {
    //   width: 65%;
    // }

    > button {
      position: absolute;
      right: 0;
      border: 3px solid;
    }
  `}
  ${({ theme }) => css`
    background: ${theme.colors.searchBarColor};
  `}
`

export const NotificationWrapper = styled.div`
  ${() => css`
    grid-column-end: span 12;
  `}
`
export const TableWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
  `}
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
export const TrobleShort = styled.div`
  font-size: 15px;
  display: inline-flex;
  font-weight: 400;
  margin-top: 65px;
`
