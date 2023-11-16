import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  ${({ theme, isDisable }) => css`
    background-color: ${theme.colors.accordionBackground};
    border: 0px solid ${theme.colors.primaryBorder};
    border-radius: 2px;
    display: flex;
    // justify-content: center;
    justify-content: space-between;
    text-align: left;
    padding: 24px;
    flex-grow: 1;
    ${isDisable &&
    css`
      background-color: ${theme.colors.disabledTableBackground};
    `}
  `}
`
export const MainContainer = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.colors.light};
    border: 1px solid ${theme.colors.primaryBorder};
  `}
`

export const Header = styled.div.attrs({
  className: 'p3'
})`
  ${({ theme, expanded }) => css`
    width: 25%;
    cursor: pointer;
    color: ${theme.colors.textSecondary};
    font-size: 16px;
    font-weight: 600;
    overflow-wrap: anywhere;
    padding-right: 5%;

    ${expanded &&
    css`
      padding-bottom: 0;
    `}
  `}
`

export const Children = styled.div`
  ${({ expanded }) => css`
    display: none;

    ${expanded &&
    css`
      display: flex;
      flex-direction: column;
      padding: 16px 24px 24px 24px;
    `}
  `}
`

export const ExpandIcon = styled.span`
  ${({ theme }) => css`
    color: ${theme.colors.primary};
  `}
`
export const InfoWrapper = styled.div`
  ${() => css`
    width: 424px;
    top: 17px;
    left: 26px;
  `}
`

export const HeaderWrapper = styled.h1`
  ${() => css`
    font-size: 16px;
    font-weight: 600;
    text-align: left;
    font-style: normal;
    letterspacing: '0em';
  `}
`
export const ButtonWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
    padding: 10px;
    height: 50px;
    button {
      float: right;
    }
  `}
`
