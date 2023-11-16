import React from 'react'
import { Provider } from 'react-redux'
import store from './redux/store'
import { BrowserRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components/macro'
import { ThemeProvider as AltThemeProvider } from 'styled-components'

import theme from 'styles/theme'
import IntlProvider from 'translations/intlProvider'
import { DEFAULT_LOCALE } from 'translations/locales'
import getTheme from './helpers/themes'
import createTheme from './theme'

const AllProviders = ({ children }) => (
  <ThemeProvider theme={createTheme('light')}>
    <AltThemeProvider theme={getTheme('light')}>
      <IntlProvider locale={DEFAULT_LOCALE} defaultLocale={DEFAULT_LOCALE}>
        <Provider store={store}>
          <BrowserRouter>{children}</BrowserRouter>
        </Provider>
      </IntlProvider>
    </AltThemeProvider>
  </ThemeProvider>
)

const customRender = (ui, options) => render(ui, { wrapper: AllProviders, ...options })
// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
