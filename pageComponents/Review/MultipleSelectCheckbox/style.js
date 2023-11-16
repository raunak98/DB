import styled, { css } from 'styled-components'

export const CheckboxWrapper = styled.div`
  ${({ theme, disabled }) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${theme.colors.primary};

    ${disabled &&
    css`
      cursor: not-allowed;
    `}
  `}
`
