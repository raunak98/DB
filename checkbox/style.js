import styled, { css } from 'styled-components'

export const Input = styled.input`
  display: none;
`

export const Label = styled.label.attrs({
  className: 'p3'
})`
  ${({ theme, disabled }) => css`
    display: flex;
    align-items: center;
    cursor: pointer;

    ${disabled &&
    css`
      color: ${theme.colors.disabledPrimary};
      cursor: not-allowed;
    `}
  `}
`

export const CheckBox = styled.span`
  ${({ theme, disabled, error, hasLabel }) => css`
    box-sizing: border-box;
    height: 24px;
    border-radius: 2px;
    width: 24px;
    color: ${theme.colors.primary};
    background-color: ${theme.colors.light};
    border: 1px solid ${theme.colors.secondaryBorder};
    display: flex;
    justify-content: center;
    align-items: center;

    ${disabled &&
    css`
      border-color: ${theme.colors.disabledPrimary};
      background-color: ${theme.colors.disabledSecondary};
    `}

    ${error &&
    css`
      border-color: ${theme.colors.error};
    `}

    ${hasLabel &&
    css`
      margin: 0 10px 0 0;
    `}
  `}
`
