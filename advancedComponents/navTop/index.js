import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Styled from '../../style'
import RadioDropdown from '../../components/radioDropdown'
import { dropdownLanguageOptions, dropdownThemeOptions } from '../../helpers/language'
import colors from '../../styles/colors'
import { selectProfileSelector } from '../../redux/profile/profile.selector'
import { fetchProfileStart } from '../../redux/profile/profile.action'

const NavigationBarTop = ({ locale, currentTheme, setLocale, setCurrentTheme }) => {
  const profile = useSelector(selectProfileSelector)

  const profileName = () => `${profile.firstName} ${profile.lastName}`.replaceAll('"', '')

  const dispatch = useDispatch()
  useEffect(async () => {
    dispatch(fetchProfileStart())
  }, [])
  return (
    <Styled.TopNavBar>
      <Styled.TopNavBarWrapper>
        <Styled.Icons>
          <RadioDropdown
            id="translation"
            options={dropdownLanguageOptions}
            icon="globe"
            callback={setLocale}
            defaultChecked={locale}
          />
          <RadioDropdown
            id="theme"
            options={dropdownThemeOptions}
            icon="circle-half-stroke"
            callback={setCurrentTheme}
            defaultChecked={currentTheme}
          />
        </Styled.Icons>
        <Styled.UsernameWrapper>
          <FontAwesomeIcon icon="user" color={colors.primary} />
          <Styled.Header>{profileName()}</Styled.Header>
          <FontAwesomeIcon icon="sort-down" size="xs" color={colors.primary} />
        </Styled.UsernameWrapper>
      </Styled.TopNavBarWrapper>
    </Styled.TopNavBar>
  )
}

export default NavigationBarTop
