import styled, { css } from 'styled-components'

export const ProfileWrapper = styled.div`
  ${() => css`
    width: 100%;
  `}
`
export const PageTitle = styled.p`
  ${() => css`
    font-size: 24px;
    font-weight: 400;
  `}
`
export const PageDashboardLink = styled.p`
  ${() => css`
    font-size: 14px;
  `}
`

export const BackDashboardButton = styled.p`
  ${() => css`
    font-size: 14px;
  `}
`

export const SubTitle = styled.p`
  ${() => css`
    margin-top: -18px;
    font-size: 14px;
  `}
`

export const ProfileBody = styled.div`
  ${({ theme: { colors } }) => css`
    background: ${colors.ProfileBackground};
    padding: 10px 20px;
    margin-top: 30px;
  `}
`
export const HighlightWrapper = styled.div`
  ${() => css`
    margin-left: 7px;
  `}
`
export const ProfileName = styled.div`
  ${() => css`
    font-size: 14px;
    display: flex;
    margin-top: -1px;
    margin-left: 42px;
    position: relative;
  `}
`
export const ProfileFirstName = styled.p`
  ${() => css`
    font-size: 14px;
  `}
`
export const ProfileLastName = styled.p`
  ${() => css`
    font-size: 14px;
    margin-left: 5px;
  `}
`
export const ProfileImage = styled.div`
  ${() => css`
    margin-left: 26px;
    width: 23%;
  `}
`

export const ProfileMail = styled.p`
  ${() => css`
    color: #949494;
    font-size: 14px;
    width: 30%;
    display: flex;
    margin-top: -11px;
    margin-left: 42px;
  `}
`
export const VersionNumber = styled.p`
  ${() => css`
    float: right;
    margin-top: -34px;
  `}
`
export const UserText = styled.p`
  ${() => css`
    padding: 7px 0px 15px 0px;
    box-shadow: inset 0px -1px 0px #e7e7e7;
  `}
`
export const User = styled.span`
  ${() => css`
    font-weight: 600;
    margin-left: 70px;
  `}
`
export const UserName = styled.p`
  ${() => css`
    float: right;
    width: 65%;
    margin-top: 0px;
  `}
`
export const FirstText = styled.p`
  ${() => css`
    padding: 7px 0px 15px 0px;
    box-shadow: inset 0px -1px 0px #e7e7e7;
  `}
`
export const FirstName = styled.p`
  ${() => css`
    float: right;
    width: 65%;
    margin-top: 0px;
  `}
`
export const UserFirst = styled.span`
  ${() => css`
    font-weight: 600;
    margin-left: 70px;
  `}
`
export const SecondText = styled.p`
  ${() => css`
    padding: 7px 0px 15px 0px;
    box-shadow: inset 0px -1px 0px #e7e7e7;
  `}
`
export const SecondName = styled.p`
  ${() => css`
    float: right;
    width: 65%;
    margin-top: 0px;
  `}
`
export const UserSecond = styled.span`
  ${() => css`
    font-weight: 600;
    margin-left: 70px;
  `}
`
export const EmailText = styled.p`
  ${() => css`
    padding: 7px 0px 15px 0px;
    box-shadow: inset 0px -1px 0px #e7e7e7;
  `}
`
export const EmailName = styled.p`
  ${() => css`
    float: right;
    width: 65%;
    margin-top: 0px;
  `}
`
export const Email = styled.span`
  ${() => css`
    font-weight: 600;
    margin-left: 70px;
  `}
`
export const PhoneText = styled.p`
  ${() => css`
    padding: 7px 0px 15px 0px;
    box-shadow: inset 0px -1px 0px #e7e7e7;
  `}
`
export const PhoneName = styled.p`
  ${() => css`
    float: right;
    width: 65%;
    margin-top: 0px;
  `}
`
export const Phone = styled.span`
  ${() => css`
    font-weight: 600;
    margin-left: 70px;
  `}
`
export const StatusText = styled.p`
  ${() => css`
    padding: 7px 0px 15px 0px;
    box-shadow: inset 0px -1px 0px #e7e7e7;
  `}
`
export const StatusName = styled.p`
  ${() => css`
    float: right;
    width: 65%;
    margin-top: 0px;
  `}
`
export const Status = styled.span`
  ${() => css`
    font-weight: 600;
    margin-left: 70px;
  `}
`

export const AddressText = styled.p`
  ${() => css`
    padding: 7px 0px 15px 0px;
    box-shadow: inset 0px -1px 0px #e7e7e7;
  `}
`
export const AddressName = styled.p`
  ${() => css`
    float: right;
    width: 65%;
    margin-top: 0px;
  `}
`
export const Address = styled.span`
  ${() => css`
    font-weight: 600;
    margin-left: 70px;
  `}
`
export const PostalCode = styled.p`
  ${() => css`
    padding: 7px 0px 15px 0px;
    box-shadow: inset 0px -1px 0px #e7e7e7;
  `}
`
export const PostalNumber = styled.p`
  ${() => css`
    float: right;
    width: 65%;
    margin-top: 0px;
  `}
`
export const Code = styled.span`
  ${() => css`
    font-weight: 600;
    margin-left: 70px;
  `}
`
export const Country = styled.p`
  ${() => css`
    padding: 7px 0px 15px 0px;
    box-shadow: inset 0px -1px 0px #e7e7e7;
  `}
`
export const CountryName = styled.p`
  ${() => css`
    float: right;
    width: 65%;
    margin-top: 0px;
  `}
`
export const CountryTxt = styled.span`
  ${() => css`
    font-weight: 600;
    margin-left: 70px;
  `}
`
export const LineName = styled.p`
  ${() => css`
    padding: 7px 0px 15px 0px;
  `}
`
export const LineText = styled.p`
  ${() => css`
    float: right;
    width: 65%;
    margin-top: 0px;
  `}
`
export const LineManager = styled.span`
  ${() => css`
    font-weight: 600;
    margin-left: 70px;
  `}
`
export const BackToDashBoard = styled.div`
  ${() => css`
    display: flex;
  `}
`
