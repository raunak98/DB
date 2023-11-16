import React from 'react'
import { render, fireEvent } from 'test-utils'
import Filter from '.'

describe('Components | Filter', () => {
  const filters = [
    { id: 'all', text: 'All' },
    { id: 'filter-1', text: 'Filter 1 (9)' },
    { id: 'filter-2', text: 'Filter 2 (6)' },
    { id: 'filter-3', text: 'Filter 3 (10)' }
  ]

  const props = {
    filters,
    initialFilterId: filters[0].id
  }

  it('render the filter component', () => {
    const { container } = render(<Filter {...props} />)

    const $filterButtons = container.querySelectorAll('button')
    expect($filterButtons).toBeTruthy()
    expect($filterButtons).toHaveLength(props.filters.length)

    $filterButtons.forEach(($filterButton, index) => {
      expect($filterButton).toBeVisible()
      expect($filterButton).toHaveTextContent(props.filters[index].text)
      if ($filterButton.id === props.initialFilterId) {
        expect($filterButton).toHaveProperty('selected', true)
      } else {
        expect($filterButton).toHaveProperty('selected', false)
      }
    })
  })

  it('handle the click event on the filter component', () => {
    const onFilterCallback = jest.fn()
    const { container } = render(
      <Filter {...props} onFilterCallback={(...args) => onFilterCallback(...args)} />
    )

    const $filterButtons = container.querySelectorAll('button')
    $filterButtons.forEach(($filterButton, index) => {
      fireEvent.click($filterButton)
      expect(onFilterCallback).toHaveBeenCalledTimes(index + 1)
      expect(onFilterCallback).toHaveBeenLastCalledWith($filterButton.id)

      $filterButtons.forEach(($button) => {
        if ($button.id === $filterButton.id) {
          expect($button).toHaveProperty('selected', true)
        } else {
          expect($button).toHaveProperty('selected', false)
        }
      })
    })
  })
})
