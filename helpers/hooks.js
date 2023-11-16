import { useState } from 'react'

let idCounter = 0

export const useUID = (prefix = '') => {
  idCounter += 1
  const [id] = useState(`${prefix}${idCounter}`)
  return id
}
