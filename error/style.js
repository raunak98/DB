import styled, { css } from 'styled-components'

export const Wrapper = styled.span.attrs({
  className: 'p4'
})`
  ${({ theme: { colors } }) => css`
    color: ${colors.error};
    display: flex;
    align-items: center;
    padding-top: 4px;

    > :first-child {
      padding-right: 4px;
    }
  `}
`
