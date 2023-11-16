import React from 'react'
// import { Button } from '@mui/material'
// import * as Styled from './style'
// import Button from '../../components/button'
// import Logo from '../../styles/logo/logo'

const LoginPage = () => {
  React.useEffect(() => {
    // window.location.replace('/authorize/')
    window.location.replace(`https://session-dev1.projectroots-acn.com/initiate`)
  }, [])
  return null

  // return (
  // <Styled.Wrapper>
  //   <Styled.LoginItems>
  //     <Logo />
  //     <Styled.MessageBox>
  //       <Styled.LoginHeader>Log in to the DB Dashboard</Styled.LoginHeader>
  //       <br />
  //       <Styled.Link href="/authorize/">
  //         <Button variant="contained" fluid style={{ display: 'block', width: '100%' }}>
  //           Login
  //         </Button>
  //       </Styled.Link>
  //     </Styled.MessageBox>
  //   </Styled.LoginItems>
  // </Styled.Wrapper>)
}

export default LoginPage
