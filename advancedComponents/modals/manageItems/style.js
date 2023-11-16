import styled, { css } from 'styled-components'

export const Title = styled.h2`
  margin: 0px;
`

export const Description = styled.div.attrs({
  className: 'p2'
})`
  padding: 24px 0;
`

export const MainWrapper = styled.div`
  ${({ theme }) => css`
    display: flex;
    justify-content: space-between;
    background-color: ${theme.colors.infoBackground};
  `}
`
export const SubWrapper = styled.div`
  ${({ theme }) => css`
    margin: 0 10px;
    width: 50%;
    background-color: ${theme.colors.infoBackground};
  `}
`

export const Header = styled.div`
  ${({ theme }) => css`
    padding: 12px 16px;
    font-size: 14px;
    font-weight: bold;
    background-color: ${theme.colors.tableHeaderBackground};
    border: 1px solid ${theme.colors.primaryBorder};
    box-sizing: border-box;

    :first-child {
      border-radius: 4px 4px 0 0;
    }
  `}
`

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  & + div {
    border-top: none;
  }
`

export const Item = styled.li`
  ${({ theme }) => css`
    padding: 12px 16px;
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid ${theme.colors.primaryBorder};
    box-sizing: border-box;
    border-radius: 2px;
    opacity: ${(props) => (props.isDragDisabled ? '0.3' : '')};
    margin: 5px 0;
    cursor: ${(props) => (props.isDragDisabled ? 'pointer' : '')};

    :last-child {
      border-bottom: 1px solid ${theme.colors.primaryBorder};
    }
  `}
`

export const ItemOrder = styled.span.attrs({
  className: 'p3'
})`
  ${({ theme }) => css`
    padding-right: 16px;
    color: ${theme.colors.textSecondary};
  `}
`

export const ItemName = styled.h6`
  margin: 0;
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: left;
`

export const SortIcons = styled.span`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 16px;
    color: ${theme.colors.sortIconActive};
  `}
`

export const SubmitButtonWrapper = styled.span`
  float: right;
  padding-top: 48px;
`
