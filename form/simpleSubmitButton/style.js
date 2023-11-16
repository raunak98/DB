import styled, { css } from 'styled-components'

export const SubmitButton = styled.input`
  ${({ theme }) => css`
    box-sizing: border-box;
    border-radius: 2px;
    padding: 14px 24px;
    color: ${theme.colors.light};
    cursor: pointer;
    box-shadow: none;
    background-color: ${theme.colors.primary};
    font-size: ${theme.fontSizes.tiny};
    border: none;
    display: flex;
    align-items: center;
  `}
`
