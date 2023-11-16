import React from 'react'
import { render, fireEvent } from 'test-utils'
import LinkButton from '.'

describe('Components | Link Button', () => {
  it('render a Link Button', () => {
    const props = {
      text: 'Some text'
    }
    const { container } = render(<LinkButton {...props} />)

    const $button = container.querySelector('button')
    expect($button).toBeTruthy()
    expect($button).toHaveTextContent(props.text)

    const $icon = container.querySelector('svg')
    expect($icon).toBeFalsy()
  })

  it('render a Link Button with an icon', () => {
    const props = {
      text: 'Some text',
      iconName: 'edit'
    }
    const { container } = render(<LinkButton {...props} />)

    const $icon = container.querySelector('svg')
    expect($icon).toBeTruthy()
  })

  it('handle click event', () => {
    const props = {
      text: 'Some text'
    }
    const onClickCallback = jest.fn()
    const { container } = render(<LinkButton {...props} onClickCallback={onClickCallback} />)

    const $button = container.querySelector('button')
    fireEvent.click($button)
    expect(onClickCallback).toHaveBeenCalled()
  })
})
