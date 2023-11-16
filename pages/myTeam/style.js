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

export const TableOptionsWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
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

export const Table = styled.table.attrs({
  className: 'p4'
})`
  ${({ theme: { colors } }) => css`
    background-color: ${colors.infoBackground};
    border-collapse: collapse;
    text-align: left;
    white-space: nowrap;
    width: 100%;
  `}
`

export const Row = styled.tr`
  ${() => css`
    border-bottom: 2px solid #e7e7e7;
  `}
`
export const LeftCell = styled.td`
  ${() => css`
    padding: 0px 10px;
    width: 25%;
  `}
`

export const Cell = styled.td`
  ${() => css`
    padding: 0px 10px;
    width: 75%;
  `}
`

export const CellLabel = styled.h4`
  ${() => css`
    font-family: 'Open Sans', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 26px;
    letter-spacing: 0.15px;
  `}
`
export const CellValue = styled.h4`
  ${() => css`
    font-family: 'Open Sans', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    text-indent: 15px;
  `}
`
