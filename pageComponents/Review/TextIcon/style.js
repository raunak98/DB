import styled, { css } from 'styled-components'

export const InfoWrapper = styled.div`
  ${() => css`
    width: 424px;
    top: 17px;
    left: 26px;
  `}
`

export const HeaderWrapper = styled.h1`
  ${() => css`
    font-size: 16px;
    font-weight: 600;
    text-align: left;
    font-style: normal;
    letterspacing: '0em';
  `}
`

export const ListWrapper = styled.div`
  ${() => css`
    height: 52px;
    width: 458px;
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

export const Cell = styled.td`
  ${() => css`
    left: 15px;
    top: 13px;
  `}
`
export const CellLabel = styled.h1`
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
