import styled, { css } from 'styled-components'

export const PaginationWrapper = styled.div`
  ${() => css`
    display: flex;
    flex-direction: column;
  `}
`
export const TableOptionsWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
    display: flex;
    align-items: center;
    padding: 3px 0px 8px 13px;
  `}
  ${({ theme }) => css`
    background: ${theme.colors.searchBarColor};
  `}
`
