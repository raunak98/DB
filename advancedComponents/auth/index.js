import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import fetchUserData from 'services/userData'
import { setLocalStorageData, getLocalStorageData } from 'services/localStorage'
import Button from 'components/button'

import * as Styled from './style'

const Auth = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [dataStored, setDataStored] = useState(false)
  /**
   * email address to be updated to current users email address in
   * the future
   */
  const userEmail = 'c.badinescu@accenture.com'

  useEffect(async () => {
    const jwtcookie = Cookies.get('jwt-cookie')
    if (jwtcookie) {
      setLoggedIn(true)

      if (getLocalStorageData('userData')) {
        setDataStored(true)
      } else {
        const userData = await fetchUserData({ jwtcookie }, userEmail)
        setLocalStorageData('userData', JSON.stringify(userData))
        setDataStored(true)
      }
    }
  }, [])

  /**
   * Login button added temporarily until we
   * work out the real login process.
   */
  return (
    <Styled.Wrapper>
      <Styled.Link href="https://api1.portaldev.projectroots-acn.com:8443/home/authorize">
        <Button size="large" text={loggedIn ? 'logged in' : 'login'} disabled={loggedIn} />
      </Styled.Link>
      {dataStored ? 'User data stored' : 'NO user data stored'}
    </Styled.Wrapper>
  )
}

export default Auth
