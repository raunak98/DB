import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  ${({ theme, textOnly }) => css`
    background-color: ${theme.colors.light};
    border: 1px solid ${theme.colors.primaryBorder};
    border-radius: 2px;
    padding: 16px;
    ${textOnly &&
    css`
      padding: 82px 16px 16px 16px;
    `}

    svg {
      color: ${theme.colors.primary};
      margin: 0 0 8px 0;
    }
  `}
`

export const TitleWrapper = styled.div`
  ${({ theme }) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${theme.colors.primary};
  `}
`

export const Title = styled.h5`
  ${({ theme }) => css`
    color: ${theme.colors.primary};
    margin: 0 0 4px 0;
  `}
`

export const Image = styled.img`
  ${({ theme }) => css`
    color: ${theme.colors.primary};
    margin: 0 0 4px 0;
  `}
`

// export const Description = styled.p.attrs({
//   className: 'p3'
// })`
//   ${({ theme }) => css`
//     color: ${theme.colors.textSecondary};
//     margin: 0;
//   `}
// `
