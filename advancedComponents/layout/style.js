import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
`

export const Content = styled.div`
  ${({ theme }) => css`
    width: 100%;
    padding-left: ${theme.nav.closed};
    padding: 0 20px 48px 48px;
  `}
`
