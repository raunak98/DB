import styled, { css } from 'styled-components'

export const Button = styled.button`
  ${({ theme, size, primary, fluid }) => css`
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

    :active:enabled {
      background-color: ${theme.colors.buttonBackgroundActive};
    }

    :hover:enabled {
      background-color: ${theme.colors.buttonBackgroundHover};
    }

    :focus:enabled {
      box-shadow: 0px 0px 2px 0px ${theme.colors.buttonBorderFocus};
    }

    ${size === 'tiny' &&
    css`
      padding: 8px 16px;
    `}

    ${size === 'small' &&
    css`
      padding: 10px 16px;
    `}

    ${size === 'medium' &&
    css`
      padding: 14px 24px;
    `}

    ${size === 'large' &&
    css`
      padding: 16px 32px;
      font-size: ${theme.fontSizes.xsmall};
    `}

    ${primary &&
    css`
      :disabled {
        background-color: ${theme.colors.buttonDisabled};
        color: ${theme.colors.disabledPrimary};
        cursor: not-allowed;
      }
    `}

    ${!primary &&
    css`
      background-color: ${theme.colors.transparent};
      color: ${theme.colors.primary};
      border: 1px solid ${theme.colors.primary};

      :disabled {
        background-color: ${theme.colors.transparent};
        color: ${theme.colors.disabledPrimary};
        border: 1px solid ${theme.colors.buttonDisabled};
        cursor: not-allowed;
      }

      :active:enabled {
        color: ${theme.colors.light};
      }

      :hover:enabled {
        color: ${theme.colors.light};
      }
    `}

    ${fluid &&
    css`
      display: block;
      width: 100%;
    `}
  `}

  svg {
    margin: 0 0 0 8px;
  }
`
