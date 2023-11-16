import React from 'react'
import Checkbox from '.'

export default {
  title: 'Checkbox',
  component: Checkbox,
  args: {
    disabled: false,
    label: 'Checkbox'
  }
}

const Template = (args) => <Checkbox {...args} />

export const Default = Template.bind({})

export const InitiallyChecked = Template.bind({})
InitiallyChecked.args = {
  defaultChecked: true
}

export const WithError = Template.bind({})
WithError.args = {
  errorMessage: 'Some error message'
}
