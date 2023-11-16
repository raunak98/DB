import React from 'react'
import { LOCALES } from 'translations/locales'
import * as Styled from './style'

const LocalesSelecter = ({ onChange }) => (
  <Styled.Select
    onChange={(e) => {
      onChange(e.currentTarget.value)
    }}
  >
    {Object.values(LOCALES).map((locale) => (
      <option key={locale.key} value={locale.key}>
        {locale.value}
      </option>
    ))}
  </Styled.Select>
)

export default LocalesSelecter
