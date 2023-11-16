import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'

export const HeaderWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
    width: -webkit-fill-available;
  `}
`

export const Divider = styled.hr`
  ${({ theme }) => css`
    border-top: 1px solid ${theme.colors.primaryBorder};
    width: inherit;
    margin-top: 30px;
  `}
`

export const FilterWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
  `}
`

export const TableOptionsWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
    display: flex;
    align-items: center;
    padding: 3px 0px 8px 13px;
  `}
  ${({ theme }) => css`
    background: ${theme.colors.searchBarColor};
  `}
`

export const TableWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
  `}
`
export const BulkActionsWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
    margin-top: 24px;
    display: flex;

    button {
      margin-right: 12px;

      :last-child {
        margin-right: 0;
      }
    }
  `}
`

export const SignOffButtonWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
    margin-top: 24px;

    button {
      float: right;
    }
  `}
`

export const NotificationWrapper = styled.div`
  ${() => css`
    grid-column-end: span 12;
  `}
`

export const AccordionWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
  `}
`

export const BackButton = styled.span`
  ${({ theme }) => css`
    font-size: 14px;
    color: ${theme.colors.textPrimary};
  `}
`

export const BackButtonLink = styled(Link)`
  ${({ theme }) => css`
    text-decoration: none;
    ${theme.mixins.gridColumns(12)};
  `}
`

export const TrobleShort = styled.div`
  font-size: 15px;
  display: inline-flex;
  font-weight: 400;
`

export const InfoWrapper = styled.div`
  ${() => css`
    width: 424px;
    top: 17px;
    left: 26px;
  `}
`

export const SelectionLimitHeaderWrapper = styled.h1`
  ${() => css`
    font-size: 16px;
    font-weight: 600;
    text-align: left;
    font-style: normal;
    letterspacing: '0em';
  `}
`

export const ButtonWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
    padding: 10px;
    height: 50px;
    button {
      float: right;
    }
  `}
`
