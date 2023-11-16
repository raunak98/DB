import styled, { css } from 'styled-components'

export const TopNavBar = styled.div`
  ${({ theme: { mixins } }) => css`
    justify-content: center;
    ${mixins.gridColumns(12)}
  `}
`
export const TopNavBarWrapper = styled.div`
  ${() => css`
    display: flex;
    flex-direction: row-reverse;
    margin-top: 15px;
  `}
`

export const Icons = styled.div`
  ${() => css`
    margin-left: 10px;
    display: flex;
    flex-direction: row-reverse;
  `}
`
export const Header = styled.h5`
  ${() => css`
    padding: 4px 10px 4px 10px;
    margin: 2px 0 2px 0;
  `}
`

export const UsernameWrapper = styled.div`
  ${() => css`
    cursor: pointer;
    display: flex;
    align-items: center;
    border: 2px solid #166aa7;
    border-radius: 13px;
    padding: 0 15px;
  `}
`
