import { useIntl } from 'react-intl'

const translate = (id, values = {}) =>
  useIntl().formatMessage({ id, defaultMessage: 'No translation' }, { ...values })

export default translate
