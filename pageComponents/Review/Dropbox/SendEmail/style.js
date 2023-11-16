import styled, { css } from 'styled-components'

export const SendEmailWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
    padding-top: 24px;
    display: flex;
    flex-direction: row-reverse;

    button {
      float: right;
    }
  `}
`
export const Header = styled.h4`
  margin: 10px 0;
`
export const ForwardButtonWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
    padding: 25px 0 1px 0;
    height: 50px;
    button {
      float: right;
    }
  `}
`
export const LabelWrapper = styled.div`
  font-family: 'Open Sans', sans-serif;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color: #333333;
  padding: 0px 0 20px 0px;
`
