import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
  max-width: 360px;
  position: relative;

  .react-calendar {
    ${({ theme }) => css`
      width: 100%;
      background: ${theme.colors.light};
      border: 1px solid ${theme.colors.primary};
      border-top: none;
      box-sizing: border-box;
    `}
  }

  .react-calendar.hide {
    display: none;
  }

  .react-calendar button {
    ${({ theme }) => css`
      margin: 0;
      padding: 0;
      border: 0;
      outline: none;
      font-size: ${theme.fontSizes.tiny};
      line-height: ${theme.lineHeights.tiny};
      background: ${theme.colors.transparent};
    `}
  }

  span.react-calendar__navigation__label__labelText.react-calendar__navigation__label__labelText--from {
    ${({ theme }) => css`
      font-family: ${theme.fonts.displayFont.name};
      font-weight: ${theme.fonts.displayFont.fontWeight};
      font-size: ${theme.fontSizes.small};
      line-height: ${theme.lineHeights.medium};
      color: ${theme.colors.headingPrimary};
    `}
  }

  .react-calendar__tile {
    display: flex;
    justify-content: center;
  }

  .react-calendar__tile abbr {
    height: 28px;
    width: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 7px 0;
  }

  .react-calendar button:enabled:hover {
    cursor: pointer;
  }

  .react-calendar__viewContainer {
    padding: 32px 29px 25px;
  }

  .react-calendar__navigation {
    ${({ theme }) => css`
      background-color: ${theme.colors.datePickerHeader};
      height: 48px;
    `}
  }

  .react-calendar__navigation__label {
    ${({ theme }) => css`
      font-family: ${theme.fonts.displayFont.name};
      font-weight: ${theme.fonts.displayFont.fontWeight};
      font-size: ${theme.fontSizes.small};
      line-height: ${theme.lineHeights.medium};
      color: ${theme.colors.headingPrimary};
    `}
  }

  .react-calendar__navigation button {
    min-width: 44px;
    background: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .react-calendar__tile {
    ${({ theme }) => css`
      abbr {
        color: ${theme.colors.primary};
      }
    `}
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    ${({ theme }) => css`
      abbr {
        color: ${theme.colors.datePickerNeighboringMonth};
      }
    `}
  }

  .react-calendar button.react-calendar__tile--now {
    ${({ theme }) => css`
      abbr {
        background-color: ${theme.colors.datePickerHeader};
        border-radius: 100%;
      }
    `}
  }

  .react-calendar button.react-calendar__tile--active {
    ${({ theme }) => css`
      abbr {
        background-color: ${theme.colors.primary};
        color: ${theme.colors.light};
        border-radius: 100%;
      }
    `}
  }

  .react-calendar__navigation__prev-button,
  .react-calendar__navigation__next-button {
    ${({ theme }) => css`
      color: ${theme.colors.primary};
    `}
  }

  button.react-calendar__tile.react-calendar__decade-view__years__year,
  button.react-calendar__tile.react-calendar__tile--now.react-calendar__decade-view__years__year {
    ${({ theme }) => css`
      font-family: ${theme.fonts.displayFont.name};
      font-size: ${theme.fontSizes.xtiny};
      line-height: ${theme.lineHeights.xtiny};
      color: ${theme.colors.primary};
      width: 100%;
      height: 28px;
      border-radius: 28px;
      margin: 10px 0;
      text-align: center;
    `}
  }

  .react-calendar button.react-calendar__year-view__months__month {
    abbr {
      width: 100%;
      height: 28px;
      border-radius: 28px;
    }
  }

  .react-calendar__month-view__weekdays__weekday {
    ${({ theme }) => css`
      font-family: ${theme.fonts.displayFont.name};
      font-size: ${theme.fontSizes.xtiny};
      line-height: ${theme.lineHeights.xtiny};
      margin: 0 0 10px 0;
      text-align: center;
    `}

    abbr {
      text-decoration: none;
    }
  }
`

export const Icon = styled.div`
  ${({ theme }) => css`
    position: absolute;
    z-index: 1;
    top: 12px;
    right: 16px;
    color: ${theme.colors.primary};
  `}
`
