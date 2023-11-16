import styled, { css } from 'styled-components'

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
  ${({ theme }) => css`
    font-family: 'Open Sans', sans-serif;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: ${theme.colors.textPrimary};
    padding: 0px 0 20px 0px;
  `}
`
export const Label = styled.label.attrs({
  className: 'p4'
})`
  ${({ theme, error }) => css`
    color: ${theme.colors.primary};
    background-color: ${theme.colors.light};
    padding: 4px;
    position: absolute;
    left: 12px;
    top: -12px;
    z-index: 1;

    ${error &&
    css`
      color: ${theme.colors.error};
    `};
  `}
`
export const ListWrapper = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.colors.actionCardBackground};
    padding: 1px 0 1px 0;
    border-radius: 10px;
    list-style-type: none;
    margin-top: -20px;
    margin-bottom: -20px;
    height: 130px !important;
    overflow: auto !important;
    &::-webkit-scrollbar {
      width: 20px;
    }
    ::-webkit-scrollbar-track {
      background-color: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #d6dee1;
      border-radius: 20px;
      border: 6px solid transparent;
      background-clip: content-box;
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: #a8bbbf;
    }
  `}
`

export const UsersWrapper = styled.div`
  display: flex;
`
export const RadiobuttonsWrapper = styled.div`
  width: 100%;
  height: 70px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 20px;
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #d6dee1;
    border-radius: 20px;
    border: 6px solid transparent;
    background-clip: content-box;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #a8bbbf;
  }
`

export const ErrorWrapper = styled.p`
  color: red;
`
export const MainContainer = styled.div`
  ${({ theme }) => css`
    color: ${theme.colors.primary};
    background-color: ${theme.colors.modalBackground};
  `}
`
