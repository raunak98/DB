import { createGlobalStyle } from 'styled-components/macro'

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
    overflow-x: hidden;
    background-image: url(${(props) => props.theme.palette.background.image}) !important;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  body {
    background: ${(props) => props.theme.palette.background.default} ;
    margin: 0;
  }

  .MuiCardHeader-action .MuiIconButton-root {
    padding: 4px;
    width: 28px;
    height: 28px;
  }
`

export default GlobalStyle
