import React from 'react'
import Info from '.'

export default {
  title: 'Info',
  component: Info,
  args: {
    text: 'Some information should appear here, and some more information. Some information should appear here, and some more information. Some information should appear here. and some more information.'
  }
}

const Template = (args) => <Info {...args} />

export const Default = Template.bind({})
