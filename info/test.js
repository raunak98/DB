import React from 'react'
import { render, screen, fireEvent } from 'test-utils'
import Info from '.'

describe('Components | Info', () => {
  it('render Info component', () => {
    const props = {
      text: 'Some information'
    }
    const { container } = render(<Info {...props} />)

    const $icon = container.querySelector('svg')
    expect($icon).toBeTruthy()

    let $text = screen.queryByText(props.text)
    expect($text).toBeFalsy()

    fireEvent.click($icon)
    $text = screen.queryByText(props.text)
    expect($text).toBeTruthy()

    fireEvent.click($icon)
    $text = screen.queryByText(props.text)
    expect($text).toBeFalsy()
  })
})
