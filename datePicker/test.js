import React from 'react'
import { render, fireEvent, screen } from 'test-utils'
import DatePicker from '.'

const dayOfMonth = 15

function middleDate() {
  const date = new Date()
  const day = dayOfMonth
  const month = date.getMonth() + 1 <= 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

function monthYear() {
  const date = new Date()
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

describe('Components | Date Picker', () => {
  it.skip('render DatePicker component', () => {
    const props = {
      label: 'Some label'
    }
    const { container } = render(<DatePicker {...props} />)

    const $textInput = container.querySelector('input')
    expect($textInput).toBeTruthy()
    expect($textInput).toHaveAttribute('placeholder', props.label)
    expect($textInput).not.toBeDisabled()

    const $icon = container.querySelector('svg')
    expect($icon).not.toBeNull()
    expect($icon).toBeInTheDocument()

    fireEvent.focus($textInput)

    const $datePickerHeading = screen.queryByText(monthYear())
    expect($datePickerHeading).toBeVisible()

    const $middleDate = screen.queryByText(dayOfMonth, 'This will select the 15th day of the month')
    const $middleDateButton = $middleDate.parentElement

    fireEvent.click($middleDateButton)

    expect($textInput.value).toBe(middleDate())
  })
})
