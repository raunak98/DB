import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const InnerWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const SelectWrapper = styled.div.attrs({
  className: 'p3'
})`
  ${({ theme, disabled, error }) => css`
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;

    > span {
      position: absolute;
      right: 16px;
      color: ${theme.colors.primary};
      cursor: pointer;

      ${disabled &&
      css`
        color: ${theme.colors.disabledPrimary};
        cursor: default;
      `}
    }

    > div {
      width: 100%;
    }

    .select__control {
      background-color: ${theme.colors.light};
      border-radius: 2px;
      height: 36px;
      cursor: pointer;
      border: 1px solid ${theme.colors.secondaryBorder};
      box-sizing: border-box;

      &:hover {
        border: 1px solid ${theme.colors.secondaryBorder};
      }

      ${disabled &&
      css`
        border-color: ${theme.colors.disabledPrimary};
        background-color: ${theme.colors.disabledSecondary};
        cursor: default;
      `}

      ${error &&
      css`
        border-color: ${theme.colors.error};
      `};
    }

    .select__control--is-focused {
      border: 1px solid ${theme.colors.primary} !important;
      box-shadow: none;
    }

    .select__indicators {
      display: none;
    }

    .select__control--menu-is-open {
      border-radius: 2px 2px 0 0;
    }

    .select__menu {
      margin: 0;
      border-radius: 0 0 2px 2px;
    }

    .select__menu-list {
      padding: 0;
    }
  `}
`

export const Label = styled.label.attrs({
  className: 'p4'
})`
  ${({ theme, error }) => css`
    color: ${theme.colors.primary};
    background-color: ${theme.colors.light};
    padding: 4px;
    position: absolute;
    left: 12px;
    top: -12px;
    z-index: 1;

    ${error &&
    css`
      color: ${theme.colors.error};
    `};
  `}
`
