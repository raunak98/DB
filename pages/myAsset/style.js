import styled, { css } from 'styled-components'

export const TableWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
  `}
`

export const TrobleShort = styled.div`
  font-size: 15px;
  display: inline-flex;
  font-weight: 400;
  margin-top: 65px;
`

export const SubmitButtonWrapper = styled.span`
  float: right;
  padding-top: 48px;
`
export const ButtonWrapper = styled.div`
  ${() => css`
    padding-top: 50px;
    display: flex;
    flex-direction: row-reverse;
  `}
`
