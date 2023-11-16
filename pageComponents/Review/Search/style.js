import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  ${({ theme, active, large }) => css`
    box-sizing: border-box;
    border: 1px solid ${theme.colors.secondaryBorder};
    border-radius: 40px;
    height: 40px;
    display: flex;

    ${active &&
    css`
      border-color: ${theme.colors.primary};
    `}

    ${large &&
    css`
      border-radius: 48px;
      height: 48px;
    `}
  `}
`

export const SearchIcon = styled.span`
  ${({ theme }) => css`
    background-color: ${theme.colors.transparent};
    order: 0;
    flex: 0 1 auto;
    border: none;
    box-shadow: none;
    margin: 0 12px 0 16px;
    align-self: center;
  `}
`

export const SearchInput = styled.input.attrs({
  className: 'p3'
})`
  ${({ theme }) => css`
    background-color: ${theme.colors.transparent};
    color: ${theme.colors.textPrimary};
    border: none;
    box-shadow: none;
    order: 0;
    flex: 0 1 100%;
    align-self: auto;

    :focus-visible {
      outline: none;
    }
  `}
`

export const ClearIcon = styled.button`
  ${({ theme, large }) => css`
    flex: 0 0 28px;
    border: none;
    box-shadow: none;
    margin: 0 8px 0 16px;
    width: 28px;
    height: 28px;
    align-self: center;
    background-color: ${theme.colors.primary};
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${theme.colors.light};
    cursor: pointer;

    ${large &&
    css`
      flex: 0 0 32px;
      width: 32px;
      height: 32px;
    `}
  `}
`

export const Users = styled.div`
  display: flex;
`

export const User = styled.div`
  display: flex;
  background: #e7dcdc;
  width: max-content;
  border-radius: 10px;
  padding: 0 7px;
  margin: 0 2px;
  align-self: center;
`

export const Name = styled.span`
  padding: 0 4px;
`
