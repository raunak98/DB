import React from 'react'
import { screen, render, fireEvent } from 'test-utils'
import Button from '.'

describe('Components | Button', () => {
  it('renders the button in the primary state', () => {
    const props = {
      text: 'Primary Button',
      size: 'medium',
      primary: true
    }

    const { container } = render(<Button {...props} />)

    const $button = container.querySelector('button')
    expect($button).toBeVisible()

    const $text = screen.queryByText(props.text)
    expect($text).toBeVisible()
    expect($button).toContainElement($text)

    const svg = container.querySelector('svg')
    expect(svg).toBeNull()
  })

  it('renders the button in the secondary state with icon', () => {
    const props = {
      text: 'Primary Button',
      size: 'medium',
      primary: false,
      iconName: 'columns'
    }

    const { container } = render(<Button {...props} />)

    const $button = container.querySelector('button')
    expect($button).toBeTruthy()

    const $text = screen.queryByText(props.text)
    expect($text).toBeVisible()
    expect($button).toContainElement($text)

    const svg = container.querySelector('svg')
    expect(svg).toBeVisible()
  })

  it('renders the button in the primary state and tests onClick', () => {
    const props = {
      text: 'Primary Button',
      size: 'medium',
      primary: true
    }
    const onClickCallback = jest.fn()

    const { container } = render(
      <Button {...props} onClickCallback={(...args) => onClickCallback(...args)}>
        Click me
      </Button>
    )

    const $button = container.querySelector('button')

    fireEvent.click($button)
    expect(onClickCallback).toHaveBeenCalledTimes(1)

    fireEvent.click($button)
    expect(onClickCallback, 'should be clickable more than once').toHaveBeenCalledTimes(2)
  })
})
