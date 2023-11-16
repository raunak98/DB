import styled, { css } from 'styled-components'

export const Select = styled.select`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)}
  `}
`
