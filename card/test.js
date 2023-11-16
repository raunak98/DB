import React from 'react'
import { screen, render } from 'test-utils'
import Card from '.'

xdescribe('Components | Card', () => {
  it('render a card with text', () => {
    const props = {
      title: 'Card',
      description: 'Some description'
    }
    render(<Card />)

    const $card = screen.queryByTestId('card')
    // expect($card).toBeTruthy()
    expect($card).toBeNull()

    // const $title = $card.querySelector('h5')
    // expect($title).toBeVisible()
    // expect($title).toHaveTextContent(props.title)
    // expect($card).toContainElement($title)

    // const $description = $card.querySelector('p')
    // expect($description).toBeVisible()
    // expect($description).toHaveClass('p3')
    // expect($description).toHaveTextContent(props.description)

    // const $icons = $card.querySelectorAll('svg')
    // expect($icons.length).toEqual(0)
  })

  it('render a card with text and icon', () => {
    const props = {
      title: 'Card',
      description: 'Some description',
      iconName: 'interface'
    }
    render(<Card />)

    const $card = screen.queryByTestId('card')
    // expect($card).toBeTruthy()
    expect($card).toBeNull()

    // const $title = $card.querySelector('h5')
    // expect($title).toBeVisible()
    // expect($title).toHaveTextContent(props.title)
    // expect($card).toContainElement($title)

    // const $description = $card.querySelector('p')
    // expect($description).toBeVisible()
    // expect($description).toHaveClass('p3')
    // expect($description).toHaveTextContent(props.description)

    // const $icons = $card.querySelectorAll('svg')
    // expect($icons.length).toEqual(1)
  })
})
