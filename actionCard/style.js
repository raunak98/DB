import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  ${({ theme: { colors } }) => css`
    background-color: ${colors.actionCardBackground};
    padding: 48px 32px 28px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;

    svg {
      color: ${colors.primary};
    }
  `}
`

export const Title = styled.h5`
  ${({ theme: { colors } }) => css`
    color: ${colors.primary};
    margin: 8px 0 4px 0;
  `}
`

export const Description = styled.p.attrs({
  className: 'p3'
})`
  ${({ theme: { colors } }) => css`
    color: ${colors.textSecondary};
    margin: 0 0 16px 0;
  `}
`
