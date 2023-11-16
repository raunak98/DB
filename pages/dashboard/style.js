import styled, { css } from 'styled-components'

export const HeaderWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
    padding-top: 60px;
    ${(props) => props.theme.breakpoints.up('md')} {
      margin-left: 86px;
    }
  `}
`

export const NotificationWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)};
    margin: 32px 0;
  `}
`

export const YourActionsWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(12)}
  `}
`

export const ManageTilesButtonWrapper = styled.div`
  ${({ theme: { mixins } }) => css`
    ${mixins.gridColumns(6)};
    display: flex;
    align-items: center;
    justify-content: end;
  `}
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
    ${mixins.gridColumns(3)};

    ${mixins.media.medium(css`
      ${mixins.gridColumns(6)};
    `)}

    a {
      text-decoration: none;
    }
  `}
`
export const TrobleShort = styled.div`
  font-size: 15px;
  display: inline-flex;
  font-weight: 400;
  margin-top: 300px;
  margin-left: 86px;
`
export const NotificationMainWrapper = styled.div`
  width: 100%;
  min-height: 300px;
  margin-left: 60px;
  margin-top: 30px;
`
export const NotificationHeading = styled.div`
  padding-left: 33px;
  font-size: 20px;
`
export const OlNotification = styled.ol`
  font-size: 18px;
`
export const NotificationLi = styled.div`
  margin-top: 20px;
  margin-left: 33px;
  border-bottom: 1px solid #aaa;
  padding-bottom: 20px;
`
export const NotificationTitle = styled.div`
  font-size: 20px;
`
export const NotificationTDate = styled.div`
  font-size: 14px;
`
export const NotificationDescription = styled.div`
  font-size: 16px;
`
export const NotificationReadMore = styled.li`
  font-size: 16px;
`
