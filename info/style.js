import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  ${({ theme: { colors } }) => css`
    display: flex;
    align-items: baseline;
    position: relative;
    margin-left: 12px;

    svg {
      color: ${colors.infoPopup};
      cursor: pointer;
    }
  `}
`

export const Text = styled.span.attrs({
  className: 'p3'
})`
  ${({ theme: { colors, mixins } }) => css`
    background-color: ${colors.infoPopup};
    color: ${colors.light};
    padding: 16px;
    border-radius: 2px;
    width: 320px;
    position: absolute;
    left: 36px;

    ${mixins.media.medium(css`
      width: 173px;
    `)}
  `}
`
