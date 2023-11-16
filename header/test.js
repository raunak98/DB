import React from 'react'
import { screen, render } from 'test-utils'
import Header from '.'

describe('Components | Header', () => {
  it('renders the header in the primary state', () => {
    const props = {
      title: 'Some title',
      description: 'Some description'
    }
    render(<Header {...props} />)

    const $header = screen.queryByTestId('header')
    expect($header).toBeTruthy()

    const $title = $header.querySelector('h1')
    expect($title).toBeVisible()
    expect($title).toHaveTextContent(props.title)
    expect($header).toContainElement($title)

    const $description = screen.queryByText(props.description)
    expect($description).toBeVisible()
    // expect($description).toHaveClass('p')
    expect($header).toContainElement($description)
  })
})
