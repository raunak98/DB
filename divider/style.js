import styled, { css } from 'styled-components'

export const Divider = styled.hr`
  ${({ theme }) => css`
    border-top: 1px solid ${theme.colors.primaryBorder};
    width: inherit;
    margin-top: 30px;
    ${theme.mixins.gridColumns(12)};
  `}
`
