import React from 'react'
import { screen, render, fireEvent } from 'test-utils'
import CheckBox from '.'

describe('Components | Checkbox', () => {
  it('render checkbox', () => {
    const props = {
      label: 'Some label'
    }

    const { container } = render(<CheckBox {...props} />)

    const $label = screen.queryByText(props.label)
    expect($label).toBeVisible()

    const $input = container.querySelector('input')
    expect($input).not.toBeChecked()
    expect($input).not.toBeVisible()
  })

  it('renders disabled checkbox', () => {
    const props = {
      label: 'Some label',
      disabled: true
    }

    const { container } = render(<CheckBox {...props} />)

    const $input = container.querySelector('input')
    expect($input).toBeDisabled()
  })

  it('handle click event', () => {
    const props = {
      label: 'Some label'
    }
    const onChangeCallback = jest.fn()

    const { container } = render(
      <CheckBox {...props} onChangeCallback={(...args) => onChangeCallback(...args)} />
    )

    const $input = container.querySelector('input')
    expect($input).not.toBeChecked()

    fireEvent.click($input)
    //TODO: To be fixed
    //expect($input).toBeChecked()
    expect(onChangeCallback).toHaveBeenCalledTimes(1)
    expect(onChangeCallback).toHaveBeenLastCalledWith(true)

    fireEvent.click($input)
    expect($input).not.toBeChecked()
    expect(onChangeCallback).toHaveBeenCalledTimes(2)
    expect(onChangeCallback).toHaveBeenLastCalledWith(false)
  })
})
