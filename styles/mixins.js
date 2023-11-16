import { css } from 'styled-components'

const mixins = (breakpoints) => ({
  // ====small====|mediumMin:768|---medium----|largeMin:1024|---large---|xlargeMin:1280|---xlarge---|xxlargeMin:1440|---xxlarge---
  // xxlarge is the default media
  // small is not supported at the moment
  media: {
    xlarge: (styles) => css`
      @media (max-width: ${breakpoints.xxlargeMin}) {
        ${styles}
      }
    `,
    large: (styles) => css`
      @media (max-width: ${breakpoints.xlargeMin}) {
        ${styles}
      }
    `,
    medium: (styles) => css`
      @media (max-width: ${breakpoints.largeMin}) {
        ${styles}
      }
    `,
    small: (styles) => css`
      @media (max-width: ${breakpoints.mediumMin}) {
        ${styles}
      }
    `
  },

  gridColumns: (span) => `grid-column-end: span ${span}`
})

export default mixins
