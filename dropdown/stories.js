import React from 'react'
import Dropdown from '.'

const options = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 }
]

export default {
  title: 'Dropdown',
  component: Dropdown,
  args: {
    disabled: false,
    errorMessage: '',
    info: '',
    label: 'Some label',
    options
  }
}

const Template = (args) => <Dropdown {...args} />

export const Default = Template.bind({})

export const WithError = Template.bind({})
WithError.args = {
  initialOption: options[0],
  errorMessage: 'Some error message'
}
