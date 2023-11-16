import React from 'react'
import DatePicker from '.'

export default {
  title: 'Date Picker',
  component: DatePicker,
  args: {
    label: 'Some label'
  }
}

const Template = (args) => <DatePicker {...args} />

export const Default = Template.bind({})
