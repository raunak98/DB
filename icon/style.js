import styled, { css } from 'styled-components'

export const Icon = styled.span`
  ${({ clickable, disabled }) => css`
    display: flex;
    justify-content: center;

    ${clickable &&
    css`
      cursor: pointer;
    `}

    ${disabled &&
    css`
      filter: grayscale(100%);
      cursor: not-allowed;
    `}
  `}
`
