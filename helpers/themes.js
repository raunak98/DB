import theme from '../styles/theme'
import lightTheme from '../styles/themes/light'
import darkTheme from '../styles/themes/dark'

const getTheme = (currentTheme) =>
  // eslint-disable-next-line no-unused-expressions
  ({ ...theme, colors: currentTheme === 'light' ? lightTheme : darkTheme })

export default getTheme
