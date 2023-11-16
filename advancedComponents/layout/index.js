import React, { useState } from 'react'
import Styled from 'styled-components/macro'
import { Box, CssBaseline, Paper as MuiPaper } from '@mui/material'
import Button from '@mui/material/Button'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { spacing } from '@mui/system'
import translate from 'translations/translate'
import Icon from '../../components/icon'
import GlobalStyle from '../../components/globalStyle/GlobalStyle'
import Sidebar from '../../components/sidebar/index'
import NavigationBar from '../../components/NavigationBar'

const drawerWidth = 50
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: open ? '91%' : '99.4%',
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen - 1000
    }),
    marginLeft: `40px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen - 1000
      }),
      marginLeft: '200px'
    })
  })
)

const Root = Styled.div`
  display: flex;
  min-height: 100vh;
`

const Drawer = Styled.div`
  ${(props) => props.theme.breakpoints.up('md')} {
    position: fixed;
    height: 100vh;
    flex-shrink: 0;
    background-color: ${(props) => props.theme.sidebar.background};
    z-index: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
   
  }

  ${(props) => props.theme.breakpoints.down('md')} {
    background-color: ${(props) => props.theme.sidebar.background};
 
  }
`

const Paper = Styled(MuiPaper)(spacing)

const MainContent = Styled(Paper)`
  flex: 1;
  background: ${(props) => props.theme.palette.background.default};
  padding: 0 20px 48px 48px;

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
  }
`
const BottomIcon = Styled.div`
  padding-bottom : 43px;
  @media (max-width: 768px) {
   
    margin-top: 113px;
  }
`
const MuiButton = Styled(Button)`
  :hover {
    background-color: ${(props) => props.theme.sidebar.background} !important;
  }
`
const Layout = ({ locale, setLocale, children, allRoutes }) => {
  const theme = useTheme()
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))

  const [openDrawer, setOpenDrawer] = useState(false)

  const onOpenDrawer = () => {
    setOpenDrawer(!openDrawer)
  }

  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      <Drawer variant="persistent">
        <Box sx={{ display: { xs: 'block', md: 'block' } }}>
          <Sidebar sx={{ width: drawerWidth }} items={allRoutes} openDrawer={openDrawer} />
        </Box>
        <Box>
          <MuiButton>
            <BottomIcon>
              <Icon
                name={openDrawer ? 'menuClose' : 'menuOpen'}
                size="small"
                sx={{
                  marginTop: '187px'
                }}
                onClickCallback={onOpenDrawer}
              />

              <span
                style={{
                  fontSize: '13px',
                  color: theme.name === 'dark' ? '#fff' : '#000'
                }}
              >
                {openDrawer ? translate('drawer.button.close') : translate('drawer.button.open')}
              </span>
            </BottomIcon>
          </MuiButton>
        </Box>
      </Drawer>
      <Main open={openDrawer}>
        {/* TODO: Add top nav bar here */}
        <NavigationBar locale={locale} setLocale={setLocale} />
        <MainContent p={isLgUp ? 12 : 5}>{children}</MainContent>
      </Main>
    </Root>
  )
}

export default Layout
