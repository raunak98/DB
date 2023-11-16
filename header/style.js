import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  ${() => css`
    padding: 85px 0 12px 0;
    grid-column-end: 12 span;
  `}
`

export const Title = styled.h1`
  margin: 0 0 4px 0;
`

export const Description = styled.p.attrs({
  className: 'p1'
})`
  margin: 4px 0 0 0;
  width: 100%;
  max-width: 888px;
`
