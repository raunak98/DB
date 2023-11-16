import React from 'react'
import { render } from 'test-utils'
import Accordion from 'components/accordion'
import Accordions from '.'

describe('Components | Accordions', () => {
  jest.mock('components/accordion')

  it('render the Accordions component', () => {
    const { container } = render(
      <Accordions>
        <Accordion />
        <Accordion />
        <Accordion />
      </Accordions>
    )

    const $table = container.querySelector('table')
    expect($table).toBeTruthy()

    const $header = $table.querySelector('theader tr')
    expect($header).toBeFalsy()

    const $rows = $table.querySelectorAll('tbody tr')
    expect($rows).toHaveLength(3)

    $rows.forEach(($row) => {
      const $cells = $row.querySelectorAll('td')
      expect($cells).toHaveLength(1)
    })
  })
})
