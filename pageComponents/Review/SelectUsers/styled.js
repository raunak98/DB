import styled, { css } from 'styled-components'

export const Options = styled.div`
  ${({ theme, hidden }) => css`
    margin-top: 7px;
    border: 1px solid ${theme.colors.primaryBorder};
    position: absolute;
    background-color: ${theme.colors.navigationBackground};
    width: 46.5vw;
    z-index: 10;
    ${hidden &&
    css`
      display: none;
    `}
  `}
`

export const Option = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 10px;
`

export const OptionText = styled.p`
  margin: 0;
`

export const Message = styled.p`
  padding-left: 30px;
`
