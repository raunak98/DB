import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { IconButton, Avatar } from '@mui/material'
import translate from 'translations/translate'
import * as profileAPI from '../../api/profile'
import { selectProfileSelector } from '../../redux/profile/profile.selector'
import * as Styled from './style'

const Profile = () => {
  const [items, setItems] = useState([])
  const userInfo = useSelector(selectProfileSelector)
  const profileName = () => `${userInfo.firstName} ${userInfo.lastName}`.replaceAll('"', '')

  useEffect(async () => {
    profileAPI
      .getUserProfileInfo()
      .then((res) => {
        setItems(res)
      })

      .catch((err) => {
        console.error(err)
      })
  }, [])
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: '#808080'
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
    }
  }
  return (
    <>
      <Styled.ProfileWrapper>
        <Styled.HighlightWrapper>
          <Styled.PageTitle>{translate('profile.heading.title')}</Styled.PageTitle>
          <Styled.SubTitle>{translate('profile.heading.subtitle')}</Styled.SubTitle>
          <Styled.ProfileBody>
            <Styled.ProfileImage>
              <IconButton
                sx={{ width: '5px', height: '5px', position: 'absolute', paddingTop: '37px' }}
              >
                <Avatar {...stringAvatar(profileName() ? profileName() : '')} />
              </IconButton>

              <Styled.ProfileName>
                <Styled.ProfileFirstName>{items.givenName}</Styled.ProfileFirstName>
                <Styled.ProfileLastName>{items.sn}</Styled.ProfileLastName>
              </Styled.ProfileName>
              <Styled.ProfileMail>{items?.mail || '-'}</Styled.ProfileMail>
            </Styled.ProfileImage>
            {/* <Styled.VersionNumber>Last saved version 22.02.22</Styled.VersionNumber> */}
            <Styled.UserText>
              <Styled.User>{translate('profile.username')}</Styled.User>
              <Styled.UserName>{items?.userName || '-'}</Styled.UserName>
            </Styled.UserText>
            <Styled.FirstText>
              <Styled.UserFirst>{translate('profile.firstname')}</Styled.UserFirst>
              <Styled.FirstName>{items?.givenName || '-'}</Styled.FirstName>
            </Styled.FirstText>
            <Styled.SecondText>
              <Styled.UserSecond>{translate('profile.secondname')}</Styled.UserSecond>
              <Styled.SecondName>{items?.sn || '-'}</Styled.SecondName>
            </Styled.SecondText>
            <Styled.EmailText>
              <Styled.Email>{translate('profile.emailAddress')}</Styled.Email>
              <Styled.EmailName>{items?.mail || '-'}</Styled.EmailName>
            </Styled.EmailText>
            <Styled.LineName>
              <Styled.LineManager>{translate('profile.lineManager')}</Styled.LineManager>
              <Styled.LineText>{items?.manager?.sn || '-'}</Styled.LineText>
            </Styled.LineName>
          </Styled.ProfileBody>
        </Styled.HighlightWrapper>
      </Styled.ProfileWrapper>
    </>
  )
}

export default Profile
