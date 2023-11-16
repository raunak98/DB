import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  ${({ theme }) => css`
    padding-top: 100px;
    display: flex;
    justify-content: center;
    background-color: ${theme.colors.pageBackground};
    height: 100vh;
  `}
`
export const LoginItems = styled.div`
  ${() => css`
    display: flex;
    flex-flow: column;
    align-items: center;
  `}
`

export const MessageBox = styled.div`
  ${({ theme }) => css`
    margin-top: 20px;
    border: 3px solid ${theme.colors.logo};
    background-color: white;
    padding: 40px 80px;
    border-radius: 20px;
    width: 25vw;
    max-width: 400px;
  `}
`

export const LoginHeader = styled.h3`
  ${() => css`
    text-align: center;
  `}
`

export const Link = styled.a`
  ${({ theme }) => css`
    text-decoration: none;

    > button {
      background: ${theme.colors.logo};
    }
  `}
`
