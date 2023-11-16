import styled, { css } from 'styled-components'

export const Nav = styled.div`
  ${({ theme, open }) => css`
    width: ${theme.nav.closed};
    background-color: ${theme.colors.navigationBackground};
    color: ${theme.colors.navigationItem} !important;
    border-right: 1px solid ${theme.colors.stroke};
    position: fixed;
    height: 100%;
    z-index: 1;

    ${open &&
    css`
      width: ${theme.nav.open.xxlarge};

      ${theme.mixins.media.xlarge(css`
        width: ${theme.nav.open.xlarge};
      `)}

      ${theme.mixins.media.large(css`
        width: ${theme.nav.open.large};
      `)}

      ${theme.mixins.media.medium(css`
        width: ${theme.nav.open.medium};
      `)}
    `}

    a {
      text-decoration: none;
      color: ${theme.colors.navigationItem};
    }
  `}
`

export const LogoWrapper = styled.div`
  ${({ open }) => css`
    padding: 24px 0 92px 16px;

    ${open &&
    css`
      padding-left: 40px;
    `}
  `}
`

export const NavItem = styled.div`
  ${({ theme, open }) => css`
    display: flex;
    align-items: center;
    cursor: default;
    padding: 0 0 12px 16px;

    :hover {
      background-color: ${theme.colors.navigationHover};
      border-left: 2px solid ${theme.colors.navigationStroke};

      ${open &&
      css`
        padding-left: 38px;
      `}
    }

    ${open &&
    css`
      padding-left: 40px;
      cursor: pointer;
    `}
  `}
`

export const NavLabel = styled.h6`
  ${({ theme }) => css`
    color: ${theme.colors.navigationLabel};
    margin: 0;
    padding-left: 16px;
  `}
`

export const Shadow = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.colors.shadow};
    opacity: 0.2;
    width: 100%;
    height: 100%;
    position: fixed;
  `}
`
