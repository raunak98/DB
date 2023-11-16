import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'

export const HeaderWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
    padding-top: 60px;
  `}
  ${(props) => props.theme.breakpoints.up('md')} {
    margin-left: 86px;
  }
`

export const GridWrapper = styled.div`
  > div {
    grid-row-gap: 24px;
    background-color: transparent;
    margin-left: 86px;
    @media (max-width: 768px) {
      margin-left: 0px;
    }
  }
`

export const CardWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(2)};

    ${mixins.media.medium(css`
      ${mixins.gridColumns(6)};
    `)}

    a {
      text-decoration: none;
    }
  `}
`

export const BackButton = styled.span`
  ${({ theme }) => css`
    color: ${theme.colors.primary};
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
  margin-top: 300px;
  margin-left: 86px;
`
