import styled, { css } from 'styled-components'

export const CommentsWrapper = styled.div`
  ${() => css`
    padding-left: 15px;
  `}
`
export const CommentTitle = styled.div`
  ${() => css`
    display: flex;
    align-items: center;
    justify-content: space-between;

    > span {
      color: lightslategrey;
      padding-left: 10px;
    }
  `}
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
