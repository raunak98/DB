import { createGlobalStyle, css } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  ${({ theme, theme: { mixins } }) => css`
    // Font Faces
    @font-face {
      font-family: ${theme.fonts.textFont.name};
      src: url(${theme.fonts.textFont.url});
    }
    @font-face {
      font-family: ${theme.fonts.displayFont.name};
      src: url(${theme.fonts.displayFont.url});
    }

    // Body
    body {
      margin: 0;
      padding: 0;
      font-family: ${theme.fonts.textFont.name}, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
        'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-weight: ${theme.fonts.textFont.fontWeight};
      font-size: ${theme.fontSizes.xsmall};
      line-height: ${theme.lineHeights.small};
      color: ${theme.colors.textPrimary};
      background-color: ${theme.colors.pageBackground};
    }

    .p0 {
      font-size: ${theme.fontSizes.large};
      line-height: ${theme.lineHeights.large};

      /*${mixins.media.medium(css`
        font-size: ${theme.fontSizes.medium};
        line-height: ${theme.lineHeights.medium};
      `)}*/
    }

    .p1 {
      font-size: ${theme.fontSizes.small};
      line-height: ${theme.lineHeights.medium};

      /*${mixins.media.medium(css`
        font-size: ${theme.fontSizes.xsmall};
        line-height: ${theme.lineHeights.small};
      `)}*/
    }

    .p2 {
      font-size: ${theme.fontSizes.xsmall};
      line-height: ${theme.lineHeights.small};

      /*${mixins.media.medium(css`
        font-size: ${theme.fontSizes.tiny};
        line-height: ${theme.lineHeights.tiny};
      `)}*/
    }

    .p3 {
      font-size: ${theme.fontSizes.tiny};
      line-height: ${theme.lineHeights.tiny};

      /*${mixins.media.medium(css`
        font-size: ${theme.fontSizes.xtiny};
        line-height: ${theme.lineHeights.xtiny};
      `)}*/
    }

    .p4 {
      font-size: ${theme.fontSizes.xtiny};
      line-height: ${theme.lineHeights.xtiny};
    }

    // Headers
    h1 {
      font-family: ${theme.fonts.displayFont.name};
      font-weight: ${theme.fonts.displayFont.fontWeight};
      font-size: ${theme.fontSizes.huge};
      line-height: ${theme.lineHeights.huge};
      color: ${theme.colors.headingPrimary};

      /*${mixins.media.medium(css`
        font-size: ${theme.fontSizes.large};
        line-height: ${theme.lineHeights.large};
      `)}*/
    }

    h2 {
      font-family: ${theme.fonts.displayFont.name};
      font-weight: ${theme.fonts.displayFont.fontWeight};
      font-size: ${theme.fontSizes.xlarge};
      line-height: ${theme.lineHeights.xlarge};
      color: ${theme.colors.headingPrimary};

      /*${mixins.media.medium(css`
        font-size: ${theme.fontSizes.large};
        line-height: ${theme.lineHeights.large};
      `)}*/
    }

    h3 {
      font-family: ${theme.fonts.displayFont.name};
      font-weight: ${theme.fonts.displayFont.fontWeight};
      font-size: ${theme.fontSizes.large};
      line-height: ${theme.lineHeights.large};
      color: ${theme.colors.headingPrimary};

      /*${mixins.media.medium(css`
        font-size: ${theme.fontSizes.medium};
        line-height: ${theme.lineHeights.medium};
      `)}*/
    }

    h4 {
      font-family: ${theme.fonts.displayFont.name};
      font-weight: ${theme.fonts.displayFont.fontWeight};
      font-size: ${theme.fontSizes.medium};
      line-height: ${theme.lineHeights.medium};
      color: ${theme.colors.headingPrimary};

      /*${mixins.media.medium(css`
        font-size: ${theme.fontSizes.small};
        line-height: ${theme.lineHeights.small};
      `)}*/
    }

    h5 {
      font-family: ${theme.fonts.displayFont.name};
      font-weight: ${theme.fonts.displayFont.fontWeight};
      font-size: ${theme.fontSizes.small};
      line-height: ${theme.lineHeights.medium};
      color: ${theme.colors.headingPrimary};

      /*${mixins.media.medium(css`
        font-size: ${theme.fontSizes.xsmall};
        line-height: ${theme.lineHeights.small};
      `)}*/
    }

    h6 {
      font-family: ${theme.fonts.displayFont.name};
      font-weight: ${theme.fonts.displayFont.fontWeight};
      font-size: ${theme.fontSizes.xsmall};
      line-height: ${theme.lineHeights.small};
      color: ${theme.colors.headingPrimary};

      /*${mixins.media.medium(css`
        font-size: ${theme.fontSizes.tiny};
        line-height: ${theme.lineHeights.tiny};
      `)}*/
    }
  `}
`
export default GlobalStyle
