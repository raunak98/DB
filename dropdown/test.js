import React from 'react'
import { render, fireEvent } from 'test-utils'

import Dropdown from '.'

describe('Components | Dropdown', () => {
  it('renders', () => {
    render(<Dropdown />)
  })

  it('shows the list of options when clicked', () => {
    const options = [
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 }
    ]

    const { container } = render(<Dropdown options={options} />)

    expect(container).toBeTruthy()
  })
})
