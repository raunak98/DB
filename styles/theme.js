import mixins from './mixins'
import textFont from './fonts/TextFont.ttf'
import displayFont from './fonts/DisplayFont.ttf'

const breakpoints = {
  xxlargeMin: '1440px',
  xlargeMin: '1280px',
  largeMin: '1024px',
  mediumMin: '768px'
}

const theme = {
  mixins: mixins(breakpoints),
  grid: {
    xxlarge: {
      width: '1216px',
      columnWidth: '72px',
      columnGap: '32px'
    },
    xlarge: {
      width: '1072px',
      columnWidth: '60px',
      columnGap: '32px'
    },
    large: {
      width: '880px',
      columnWidth: '44px',
      columnGap: '32px'
    },
    medium: {
      width: '648px',
      columnWidth: '32px',
      columnGap: '24px'
    }
  },
  nav: {
    closed: '64px',
    open: {
      xxlarge: '480px',
      xlarge: '427px',
      large: '384px',
      medium: '342px'
    }
  },
  fonts: {
    textFont: {
      name: 'Text Font',
      url: textFont,
      fontWeight: 'normal'
    },
    displayFont: {
      name: 'Display Font',
      url: displayFont,
      fontWeight: 'normal'
    }
  },
  fontSizes: {
    xtiny: '12px',
    tiny: '14px',
    xsmall: '16px',
    small: '18px',
    medium: '20px',
    large: '24px',
    xlarge: '30px',
    huge: '36px'
  },
  lineHeights: {
    xtiny: '16px',
    tiny: '20px',
    xsmall: '22px',
    small: '24px',
    medium: '28px',
    large: '32px',
    xlarge: '40px',
    huge: '48px'
  },
  icons: {
    xxtiny: '8px',
    xtiny: '12px',
    tiny: '16px',
    xsmall: '20px',
    small: '24px',
    medium: '32px',
    large: '40px',
    xlarge: '80px'
  }
}

export default theme
