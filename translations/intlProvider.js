import React from 'react'
import { IntlProvider as ReactIntlProvider } from 'react-intl'
import strings from './strings'

const IntlProvider = ({ children, locale, defaultLocale }) => {
  // fallback to strings from default locale if missing translation for the selected locale
  const messages =
    locale === defaultLocale ? strings[locale] : { ...strings[defaultLocale], ...strings[locale] }

  return (
    <ReactIntlProvider locale={locale} defaultLocale={defaultLocale} messages={messages}>
      {children}
    </ReactIntlProvider>
  )
}

export default IntlProvider
