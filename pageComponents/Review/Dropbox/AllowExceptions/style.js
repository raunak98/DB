import styled, { css } from 'styled-components'

export const AllowExceptionsButtonWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
    padding-top: 24px;

    button {
      float: right;
    }
  `}
`
export const ListWrapper = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.colors.actionCardBackground};
    padding: 1px 0 1px 0;
    border-radius: 10px;
    list-style-type: none;
  `}
`

export const headerWrapper = styled.div`
  letter-spacing: 0em;
  text-align: left;
  width: 604px;
  left: 0px;
  top: 0px;
  display: flex;
  align-items: flex-end;
`

export const CloseButton = styled.button`
  ${({ theme }) => css`
    width: 13.88px;
    height: 13.7px;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: ${theme.colors.light};
    cursor: pointer;
    border: 0px solid ${theme.colors.textPrimary};
    color: ${theme.colors.textLight};
    position: absolute;
    top: 13px;
    right: 30px;
  `}
`
export const subHeader = styled.div`
  height: 27px;
  width: 552px;
  left: 64px;
  top: 103px;
  display: flex;
  align-items: center;
`

export const CommentButtonWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
    padding: 10px;
    height: 50px;
    button {
      float: right;
    }
  `}
`
