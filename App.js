/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

// import { ThemeProvider } from 'styled-components'
import { ThemeProvider as AltThemeProvider } from 'styled-components/macro'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import GlobalStyle from 'styles/global'
import Routes from 'routing/routes'
import IntlProvider from 'translations/intlProvider'
import { DEFAULT_LOCALE } from 'translations/locales'
import { fetchUITemplate } from 'services/sitemap'
import Layout from 'advancedComponents/layout'
import Layout2 from 'advancedComponents/layout/Drawer'
import Loading from 'components/loading'
import getTheme from './helpers/themes'
import LoginPage from './pages/login'
import ErrorPage from './pages/error'
import NavigationBarTop from './advancedComponents/navTop'
import { getuserPrefrence } from 'api/dashboard'
import createTheme from './theme'
import useTheme from '../src/hooks/useTheme'
import { ThemeProvider } from 'styled-components/macro'
import useMediaQuery from '@mui/material/useMediaQuery'

// Adding FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faLanguage,
  faGlobe,
  faCircleHalfStroke,
  faUser,
  faSortDown,
  faChevronLeft,
  faChevronRight,
  faXmark,
  faExclamationTriangle,
  faBell,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
library.add(
  faLanguage,
  faGlobe,
  faCircleHalfStroke,
  faUser,
  faSortDown,
  faChevronLeft,
  faChevronRight,
  faXmark,
  faExclamationTriangle,
  faBell,
  faSpinner
)

// Redux
import { Provider } from 'react-redux'
import store from './redux/store'
import Cookies from 'js-cookie'
import { changeTheme } from 'api/dashboard'
import NavigationBar from './components/NavigationBar'
import * as profileAPI from 'api/profile'
import { THEMES } from '../src/constants'
const App = () => {
  const [locale, setLocale] = useState('')
  const [allRoutes, setAllRoutes] = useState([])
  const [userId, setUserId] = useState(null)
  const { theme, setTheme } = useTheme()
  const matches = useMediaQuery('(max-width:1366px)')

  // Checking if the cookie exists
  const isLogged = Cookies.get('session-jwt')

  const simpleMediaQuery = () => {
    // if (matches) {
    return (
      <Layout2 locale={locale} setLocale={setLocale} allRoutes={allRoutes} matches={matches}>
        <Routes allRoutes={allRoutes} />
      </Layout2>
    )
    //Keeping this changes for future use
    // } else {
    //   return (
    //     <Layout locale={locale} setLocale={setLocale} allRoutes={allRoutes}>
    //       <Routes allRoutes={allRoutes} />
    //     </Layout>
    //   )
    // }
  }

  useEffect(async () => {
    const routes = await fetchUITemplate()
    setAllRoutes(routes)
    localStorage.removeItem('language')
  }, [])

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]))
    } catch (e) {
      return null
    }
  }

  const decodedJwt = parseJwt(isLogged)

  useEffect(async () => {
    if (isLogged) {
      // Condition to check cookie Expiry (isLogged && decodedJwt.exp * 1000 > Date.now())
      profileAPI
        .getUserInfo()
        .then((res) => {
          setUserId(res?.id)
          //localstorage will removed after setting redux
          localStorage.setItem('userInfo', JSON.stringify(res.roles))
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }, [isLogged])

  useEffect(async () => {
    if (userId !== null && userId !== undefined) {
      profileAPI
        .getUserProfileInfo()
        .then((res) => {
          setTheme(res?.Theme ? res.Theme.toLowerCase() : THEMES.LIGHT)
          setLocale(res?.Language ? res.Language : DEFAULT_LOCALE)
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }, [userId])

  return (
    <Provider store={store}>
      <MuiThemeProvider theme={createTheme(theme === '' ? 'light' : theme)}>
        <ThemeProvider theme={createTheme(theme === '' ? 'light' : theme)}>
          <AltThemeProvider theme={getTheme(theme === '' ? 'light' : theme)}>
            <IntlProvider
              locale={locale === '' ? DEFAULT_LOCALE : locale}
              defaultLocale={DEFAULT_LOCALE}
            >
              {/* A modal will be place on this part of the DOM using React Portal */}
              <div id="global-modal" />
              {/*<GlobalStyle />*/}
              {!allRoutes.length ? (
                <Loading />
              ) : (
                <BrowserRouter>
                  <Switch>
                    <Route exact path="/error" component={ErrorPage} />
                    <Route exact path="/login" component={LoginPage} />
                    {isLogged ? (
                      theme === '' || locale === '' ? (
                        <Loading />
                      ) : (
                        simpleMediaQuery()
                      )
                    ) : (
                      <Redirect to="/login" />
                    )}
                  </Switch>
                </BrowserRouter>
              )}
            </IntlProvider>
          </AltThemeProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    </Provider>
  )
}

export default App
