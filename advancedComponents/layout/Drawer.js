import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useTheme, styled } from '@mui/material/styles'
import { Box, CssBaseline, Paper as MuiPaper } from '@mui/material'
import { spacing } from '@mui/system'

import Styled from 'styled-components/macro'
import useMediaQuery from '@mui/material/useMediaQuery'

import Sidebar from '../../components/sidebar/index'
import GlobalStyle from '../../components/globalStyle/GlobalStyle'
import NavigationBar from '../../components/NavigationBar'

import { fetchProfileRole } from '../../redux/profile/profile.action'
import { selectProfileRole } from '../../redux/profile/profile.selector'
import { CheckAdmin } from '../../helpers/utils'

let drawerWidth = '50%'

const Paper = Styled(MuiPaper)(spacing)

const MainContent = styled(Paper)`
  flex: 1;
  padding: 0 20px 48px 48px;
  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
  }
  ${({ matchesProp }) =>
    matchesProp &&
    `background: transparent
    margin-top: -18px;
    margin-left: 0px;
`}
  ${({ matchesProp }) =>
    !matchesProp &&
    `background: transparent;
    margin-left: 0;
`}
`
// Will remove after checking the whole functionality in DB side
// const DrawerHeader = styled('div')(({ theme }) => ({
//   padding: theme.spacing(0, -10),
//   ':hover': 'background-color: #fff !important',
//   ...theme.mixins.toolbar
// }))

// const BottomIcon = Styled.div`

//   @media (max-width: 768px) {

//     margin-top: 113px;
//        &:hover {
//           background-color: #fff !important;
//         }
//   }

// `

// const openedMixin = (theme) => ({
//   width: drawerWidth,
//   borderRight: '0px',
//   justifyContent: 'space-between',
//   overflow: 'hidden',
//   backgroundImage: theme.name === 'dark' ? 'url(bg_dark.png)' : 'url(bg_light.png)',
//   backgroundSize: 'cover'
// })

// const closedMixin = (theme) => ({
//   overflow: 'hidden',
//   borderRight: '0px',
//   justifyContent: 'space-between',
//   background: theme.sidebar.background,
//   width: `calc(${theme.spacing(10)} + 12px)`,
//   [theme.breakpoints.up('sm')]: {
//     width: `calc(${theme.spacing(11)} + 12px)`,
//     borderRight: '0px'
//   }
// })
// const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
//   ({ theme, open }) => ({
//     width: drawerWidth,
//     flexShrink: 0,
//     whiteSpace: 'nowrap',

//     borderRight: '0px',

//     ...(open && {
//       ...openedMixin(theme),
//       '& .MuiDrawer-paper': openedMixin(theme)
//     }),
//     ...(!open && {
//       ...closedMixin(theme),
//       '& .MuiDrawer-paper': closedMixin(theme)
//     })
//   })
// )

const Drawer1 = Styled.div`
  ${(props) => props.theme.breakpoints.up('md')} {
    position: fixed;
    height: 100vh;
    flex-shrink: 0;
    background-color: ${(props) => props.theme.sidebar.background};
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }

  ${(props) => props.theme.breakpoints.down('md')} {
    background-color: ${(props) => props.theme.sidebar.background};
 
  }
`

function SimpleMediaQuery() {
  const matches = useMediaQuery('(max-width:1180px)')
  const matches2 = useMediaQuery('(max-width:1366px)')

  if (matches) {
    drawerWidth = '57%'
  } else if (matches2) {
    drawerWidth = '60%'
  } else {
    drawerWidth = '50%'
  }
  return drawerWidth
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: open ? '89%' : '99%',
    flexGrow: 1,
    overflow: 'hidden',
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

const Layout = ({ locale, setLocale, children, allRoutes, matches }) => {
  const roles = JSON.parse(localStorage.getItem('userInfo'))
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)
  const dispatch = useDispatch()
  if (roles !== null) {
    dispatch(fetchProfileRole(roles))
  }
  const role = useSelector(selectProfileRole)
  if (role !== '' && role !== undefined) {
    localStorage.removeItem('userInfo')
  }
  let updatedRoutes = []
  if (role && CheckAdmin(role)) {
    updatedRoutes = allRoutes
  } else {
    updatedRoutes = allRoutes.map((route) => {
      if (route.id === 'admin') {
        // eslint-disable-next-line no-param-reassign
        route.showInSideNav = false
      }

      return route
    })
  }
  SimpleMediaQuery()
  const handleDrawerClose = () => {
    setOpen(!open)
    setOpenDrawer(false)
  }
  const onOpenDrawer = () => {
    setOpen(false)
    setOpenDrawer(!openDrawer)
  }
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
  // if (matches) {
  return (
    <Box>
      <CssBaseline />
      <GlobalStyle />
      {/* Will remove after verifying the functionality in DB side
      {matches ? (
        <Drawer variant="permanent" open={open}>
          <List>
            <ListItem key={1} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: 'initial',
                  px: 2.5,
                  marginLeft: '9px',
                  background: 'transparent'
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 0,
                    justifyContent: 'center',
                    background: 'transparent'
                  }}
                >
                  <BrandLogo themes={theme.name} openDrawer={open} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </List>
          <List sx={{ borderRight: '0px', paddingBottom: '150px' }}>
            {updatedRoutes &&
              updatedRoutes.map(
                (item, index) =>
                  item.showInSideNav && (
                    <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                      <SidebarNav
                        component="div"
                        key={item.id}
                        pages={item}
                        title={item.id}
                        openDrawer={open}
                        style={{ height: '44px' }}
                      />
                    </ListItem>
                  )
              )}
          </List>
        </Drawer>
      ) : ( */}
      <Drawer1 variant="persistent">
        <Box sx={{ display: { xs: 'block', md: 'block' } }}>
          <Sidebar
            sx={{ width: drawerWidth }}
            items={updatedRoutes}
            openDrawer={matches ? open : openDrawer}
          />
        </Box>
      </Drawer1>

      <Main open={openDrawer}>
        <NavigationBar
          locale={locale}
          setLocale={setLocale}
          onClickCallback={matches ? handleDrawerClose : onOpenDrawer}
          open={matches && open}
        />
        <MainContent matchesProp={matches} p={isLgUp ? 12 : 5}>
          {children}
        </MainContent>
      </Main>
    </Box>
  )
}

export default Layout
