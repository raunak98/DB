import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  ${() => css`
    display: flex;
    justify-content: space-between;
    padding: 0px 0px 20px 0px;
    font-size: 16px;
  `}
`

export const Date = styled.div`
  ${() => css`
    width: 400px;
    text-align: right;
  `}
`

export const Message = styled.div`
  ${() => css``}
`

export const WrapperSpinner = styled.div`
  ${() => css`
    padding: 40px;
    display: flex;
    justify-content: center;
  `}
`
export const NoHistory = styled.div`
  ${() => css`
    display: block;
    align-items: center;
    text-align: center;
    padding: 0px 0px 20px 0px;
    font-size: 16px;
  `}
`
