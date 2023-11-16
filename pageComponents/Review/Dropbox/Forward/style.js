import styled, { css } from 'styled-components'

export const ForwardButtonWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
    padding: 10px;
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

export const SelectWrapper = styled.div`
  border: 1px solid #9ddefc;
`

export const SelectedItemsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const SelectedItemWrapper = styled.div`
  margin: 15px;
  padding: 5px 0 5px 10px;
  display: flex;
  border: 1px solid black;
`

export const SelectedItemName = styled.div`
  display: flex;
  flex-direction: column;

  > span:nth-child(2) {
    color: grey;
  }
`

export const SelectedItemCloseButton = styled.div`
  align-self: center;
  padding: 0 10px;
  cursor: pointer;
  color: #e1e1e1;
`

export const SearchInputWrapper = styled.div`
  padding: 0 15px;
`

export const ItemsWrapper = styled.div`
  border: 1px solid #e1e1e1;
  border-top: none;
  display: flex;
  flex-direction: column;
  > div > span:nth-child(2) {
    color: grey;
    padding-left: 10px;
  }
`

export const ItemWrapper = styled.div`
  padding: 10px 0 10px 15px;

  &:hover {
    background-color: #eff9fc;
    cursor: default;
  }
`
export const AccountNameParagraph = styled.p`
  margin: 20px 0;
`

export const ButtonGroup = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: row-reverse;
`
export const MainContainer = styled.div`
  ${({ theme }) => css`
    color: ${theme.colors.primary};
    background-color: ${theme.colors.modalBackground};
  `}
`
