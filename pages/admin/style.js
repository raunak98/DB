import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'

export const BackButton = styled.span`
  ${({ theme }) => css`
    font-size: 20px;
    color: ${theme.colors.textPrimary};
  `}
`
export const BackButtonLink = styled(Link)`
  ${({ theme }) => css`
    text-decoration: none;
    ${theme.mixins.gridColumns(12)};
  `}
`
export const HeaderWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
  `}
`

export const List = styled.ul`
  margin: 0;
  padding: 0;

  & + div {
    border-top: none;
  }
`

export const Item = styled.li`
  padding: 12px 10px 12px 25px;
  align-items: center;
  border-bottom: none;
  box-sizing: border-box;
  cursor: pointer;
  justify-content: space-between;
  list-style-position: inside;
  list-style-type: none;
  :first-child {
    border-top: 1px solid #e0e0e0;
  }
`

export const TableOptionsWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
    padding: 9px 11px 6px 9px;

    display: flex;

    > div {
      width: 65%;
    }

    > button {
      position: absolute;
      right: 0;
      border: 3px solid;
    }
  `}

  ${({ theme }) => css`
    background: ${theme.colors.searchBarColor};
  `}
`
export const AccordianHeaderWrapper = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.palette.mode === 'dark' ? '#3C485A' : '#b0dff6'};
    height: 60px;
    width: 100%;
  `}
`

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
