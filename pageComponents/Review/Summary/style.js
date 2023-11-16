import styled, { css } from 'styled-components'

export const ListWrapper = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.colors.actionCardBackground};
    padding: 1px 0 1px 0;
    border-radius: 10px;
  `}
`

export const ButtonWrapper = styled.div`
  ${() => css`
    padding-top: 50px;
    display: flex;
    flex-direction: row-reverse;
  `}
`
