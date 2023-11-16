import styled, { css } from 'styled-components'

export const Filter = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;
`

export const FilterLabel = styled.h6`
  margin: 0;
  padding: 0 19px 0 0;
`

export const FilterButton = styled.button`
  ${({ theme, selected }) => css`
    color: ${theme.colors.textPrimary};
    background-color: ${theme.colors.light};
    border: 1px solid ${theme.colors.secondaryBorder};
    border-radius: 100px;
    font-size: ${theme.fontSizes.xtiny};
    line-height: ${theme.lineHeights.xtiny};
    margin-right: 4px;
    padding: 4px 8px;
    cursor: pointer;

    &:last-child {
      margin-right: 0;
    }

    ${selected &&
    css`
      color: ${theme.colors.light};
      background-color: ${theme.colors.filterButtonBackgroundSelected};
      border: none;
    `}
  `}
`
