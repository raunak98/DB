import styled, { css } from 'styled-components'

export const Label = styled.label`
  ${({ theme }) => css`
    margin: 10px 0;
    display: block;
    font-weight: lighter;
    font-size: 20px;
    line-height: 28px;
    color: ${theme.colors.textPrimary};
    font-family: Display Font, serif;
  `}
`

export const Textarea = styled.textarea`
  ${({ error }) => css`
    display: block;
    font-size: 13px;
    font-weight: initial;
    background-color: #ffffff;
    border: 1px solid #687782;
    border-radius: 2px;
    padding: 10px 16px;
    width: 100%;
    height: 48px;
    box-sizing: border-box;
    font-family: Display Font, serif;
    ${error &&
    css`
      border: 1px solid red;
    `}
  `}
`
