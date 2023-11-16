export const scrollToRight = (container) => {
  document.getElementById(container).scrollLeft += 40
}

export const scrollToLeft = (container) => {
  document.getElementById(container).scrollLeft -= 40
}

export const generateOptions = (listOfOptions, defaultOptions) => {
  const generated = { options: [], defaultOptionId: defaultOptions }
  listOfOptions?.forEach((option) => {
    generated?.options?.push({ id: option })
  })
  return generated
}

const mapActionsFromApi = {
  certify: 'maintain',
  revoke: 'revoke',
  exception: 'allowExceptions',
  comment: 'comment',
  delegate: 'delegate',
  forward: 'forward',
  reset: 'reset',
  save: 'save',
  signoff: 'signoff',
  reassign: 'reassign',
  claim: 'claim',
  transferOwnership: 'Transfer Ownership'
}

export const getAction = (action) => mapActionsFromApi[action]

export const getApiAction = (action) => {
  for (let i = 0; i < Object.entries(mapActionsFromApi).length; i += 1) {
    const [key, value] = Object.entries(mapActionsFromApi)[i]
    if (value === action) {
      return key
    }
  }
  return true
}
