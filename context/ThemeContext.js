/* eslint-disable */
import React from 'react'

import { THEMES } from '../constants'

const ThemeContext = React.createContext()

function ThemeProvider({ children }) {
  const [theme, _setTheme] = React.useState('')

  const setTheme = (theme) => {
    // comment => commenting this as we have moved preferances on API
    // localStorage.setItem('theme', JSON.stringify(theme))
    _setTheme(theme)
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export { ThemeProvider, ThemeContext }
