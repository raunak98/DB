import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'

export const HeaderWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
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

    > div {
    }
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
    padding: 20px 0;
    grid-column-end: span 12;
  `}
`

export const AccordionWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};

    > div {
      // margin: 20px 0;
    }
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
