import styled, { css } from 'styled-components'

export const Wrapper = styled.span`
  ${({ theme: { colors }, disabled }) => css`
    display: flex;
    align-items: center;
    color: ${colors.primary};
    cursor: pointer;

    ${disabled &&
    css`
      filter: grayscale(100%);
    `}

    :hover {
      color: ${colors.linkHover};
    }

    :active {
      color: ${colors.linkActive};
    }
  `}
`

export const Button = styled.button`
  ${({ theme: { colors }, disabled }) => css`
    color: inherit;
    background-color: ${colors.transparent};
    border: none;
    font-size: inherit;
    cursor: pointer;

    ${disabled &&
    css`
      cursor: not-allowed;
    `}

    :hover {
      text-decoration: underline;
    }
  `}
`
