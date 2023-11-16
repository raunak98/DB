const toLettersOnly = (s) =>
  typeof s === 'string' &&
  s
    .trim()
    .replace(/\s+/g, '-')
    .replace(/([-_][a-z])/gi, (subS) => subS.replace('-', '').replace('_', '').toUpperCase())

// Add Or Remove Groups : Do not use elsewhere
const toLettersOnlyTemp = (s) =>
  typeof s === 'string' &&
  s
    .trim()
    .replace(/\s+/g, '-')
    .replace(/([-_][a-z])/gi, (subS) => subS.replace('_', '').toUpperCase())

export const toCamelCase = (s) => {
  const convS = toLettersOnly(s)
  return typeof s === 'string' && convS[0].toLowerCase() + convS.slice(1)
}

export const capitalizeFirstLetter = (string) => {
  if ([null, '', undefined].includes(string)) {
    return ''
  }
  const convS = toLettersOnly(string)
  return convS.charAt(0).toUpperCase() + convS.slice(1)
}

// Add Or Remove Groups : Do not use elsewhere
export const capitalizeFirstLetterTemp = (string) => {
  if ([null, '', undefined].includes(string)) {
    return ''
  }
  const convS = toLettersOnlyTemp(string)
  return convS.charAt(0).toUpperCase() + convS.slice(1)
}

export const seperateWordsWithCapitalLetter = (string) => {
  const convS = toLettersOnly(string)
  return convS.replace(/([A-Z])/g, ' $1').toUpperCase()
}

export const seperateWordsBasedOnCapitalLetters = (string) => {
  const convS = toLettersOnly(string)
  return convS.replace(/([A-Z])/g, ' $1')
}

export const toPascalCase = (s) => {
  const convS = toLettersOnly(s)
  return convS[0].toUpperCase() + convS.slice(1)
}

export const toCapitalize = (s) =>
  s
    .trim()
    .toLowerCase()
    .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()))

// eslint-disable-next-line consistent-return
export const numberToWord = (num) => {
  const ones = [
    '',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen'
  ]
  const tens = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety'
  ]

  const numString = num.toString()

  if (num < 0) throw new Error('Negative numbers are not supported.')

  if (num === 0) return 'zero'

  // the case of 1 - 20
  if (num < 20) {
    return ones[num]
  }

  if (numString.length === 2) {
    return `${tens[numString[0]]} ${ones[numString[1]]}`
  }

  // 100 and more
  if (numString.length === 3) {
    if (numString[1] === '0' && numString[2] === '0') return `${ones[numString[0]]} hundred`
    return `${ones[numString[0]]} hundred and ${numberToWord(+(numString[1] + numString[2]))}`
  }

  if (numString.length === 4) {
    const end = +(numString[1] + numString[2] + numString[3])
    if (end === 0) return `${ones[numString[0]]} thousand`
    if (end < 100) return `${ones[numString[0]]} thousand and ${numberToWord(end)}`
    return `${ones[numString[0]]} thousand ${numberToWord(end)}`
  }
}

const padto2Digits = (num) => num.toString().padStart(2, '0')
export const getFormattedTime = (value) => {
  const date = new Date(value)
  return [
    padto2Digits(date.getDate()),
    padto2Digits(date.getMonth() + 1),
    date.getFullYear().toString().substr(-2)
  ].join('.')
}

export const randomNumber = () =>
  `${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random()
    .toString(36)
    .slice(2, 6)}`

export const formattedDate = (value) =>
  new Date(value)
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
    .replace(/ /g, '-')

export const getFormattedDateTime = (value) =>
  `${new Date(value)
    .toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
    .replace(/ /g, '-')} ${new Date(value).toLocaleTimeString('en-GB', { hour12: false })}`

export const convertMailtoName = (value) => {
  if (value && value.includes('@') && value.includes('.')) {
    if (value.includes('(')) {
      return value
        .split('(')[1]
        .split('@')[0]
        .split('.')
        .map((data) => capitalizeFirstLetter(data))
        .join(' ')
    }
    return value
      .split('@')[0]
      .split('.')
      .map((data) => capitalizeFirstLetter(data))
      .join(' ')
  }
  return value
}
// For Add Or Remove Groups Do not use else where
export const convertMailtoNameTemp = (value) => {
  if (value && value.includes('@') && value.includes('.')) {
    if (value.includes('(')) {
      return value
        .split('(')[1]
        .split('@')[0]
        .split('.')
        .map((data) => capitalizeFirstLetterTemp(data))
        .join(' ')
    }
    return value
      .split('@')[0]
      .split('.')
      .map((data) => capitalizeFirstLetterTemp(data))
      .join(' ')
  }
  return value
}

export const formatUTCDate = (value) => {
  if (![undefined, null, ''].includes(value)) {
    return value.toString().padStart(2, 0)
  }
  return ''
}

export const getDate = (dateValue) =>
  dateValue
    ? formattedDate(dateValue.split('-')[0].replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3'))
    : ''

export const findDomain = (value) => {
  if (value && value?.indexOf('DC=') > -1) {
    return value?.split('DC=')[1].replace(',', '')
  }
  return ''
}

export const getGroupDN = (groupDN) => {
  let updateGroupDN = ''
  if (groupDN && groupDN.startsWith('CN')) {
    // eslint-disable-next-line prefer-destructuring
    updateGroupDN = groupDN.split('=')[1].split(',')[0]
  }
  return updateGroupDN
}
