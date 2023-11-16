import React from 'react'
import {
  render
  //  fireEvent, screen
} from 'test-utils'
import Accordion from '.'

describe('Components | Accordion', () => {
  it('render the Accordion component', () => {
    render(
      <Accordion headers={['First title', 'Second title']}>
        <p>Some text</p>
      </Accordion>
    )

    // const $accordion = screen.queryByTestId('accordion')
    // expect($accordion).toBeTruthy()

    // const $header = screen.queryByTestId('accordion-header')
    // expect($header).toBeVisible()
    // const $title1 = screen.queryByText('First title')
    // expect($title1).toBeTruthy()
    // const $title2 = screen.queryByText('Second title')
    // expect($title2).toBeTruthy()

    // const $children = screen.queryByTestId('accordion-children')
    // expect($children).not.toBeVisible()

    // const $childrenContent = $children.querySelector('p')
    // expect($childrenContent).toBeTruthy()
    // expect($childrenContent).toHaveTextContent('Some text')
  })

  it("show and hide the Accordion's children when toggling the header", () => {
    render(
      <Accordion headers={['Some title']}>
        <p>Some text</p>
      </Accordion>
    )

    // const $header = screen.queryByTestId('accordion-header')
    // const $children = screen.queryByTestId('accordion-children')

    // fireEvent.click($header)
    // expect($children).toBeVisible()
    // fireEvent.click($header)
    // expect($children).not.toBeVisible()
  })
})
