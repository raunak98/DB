import React from 'react'
import { screen, render, fireEvent } from 'test-utils'
import ActionCard from '.'

describe('Components | Action Card', () => {
  it('render the Action Card', () => {
    const props = {
      title: 'Some title',
      description: 'Some description',
      action: 'Some action',
      iconName: 'link'
    }
    const actionCallback = jest.fn()
    render(<ActionCard {...props} actionCallback={(...args) => actionCallback(...args)} />)

    const $actionCard = screen.queryByTestId('action-card')
    expect($actionCard).toBeTruthy()

    const $icon = $actionCard.querySelector('svg')
    expect($icon).toBeVisible()

    const $title = $actionCard.querySelector('h5')
    expect($title).toBeVisible()
    expect($title).toHaveTextContent(props.title)

    const $description = $actionCard.querySelector('p')
    expect($description).toBeVisible()
    expect($description).toHaveTextContent(props.description)
    expect($description).toHaveClass('p3')

    const $actionButton = $actionCard.querySelector('button')
    expect($actionButton).toBeVisible()
    expect($actionButton).toHaveTextContent(props.action)

    fireEvent.click($actionButton)
    expect(actionCallback).toHaveBeenCalled()
  })

  it('render the Action Card without an icon', () => {
    const props = {
      title: 'Some title',
      description: 'Some description',
      action: 'Some action'
    }
    const actionCallback = jest.fn()
    render(<ActionCard {...props} actionCallback={(...args) => actionCallback(...args)} />)

    const $actionCard = screen.queryByTestId('action-card')
    expect($actionCard).toBeTruthy()

    const $icon = $actionCard.querySelector('svg')
    expect($icon).toBeNull()
    expect($icon).not.toBeInTheDocument()
  })
})
