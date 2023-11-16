import React from 'react'
import { render, screen } from 'test-utils'
import Error from '.'

describe('Components | Error', () => {
  it('render Error component', () => {
    const props = {
      message: 'Some error message'
    }
    const { container } = render(<Error {...props} />)

    const $icon = container.querySelector('svg')
    expect($icon).toBeTruthy()

    const $message = screen.queryByText(props.message)
    expect($message).toBeTruthy()
  })
})
