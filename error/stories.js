import React from 'react'
import Error from '.'

export default {
  title: 'Error',
  component: Error,
  args: {
    message: 'Some error message'
  }
}

const Template = (args) => <Error {...args} />

export const Default = Template.bind({})
