import React from 'react'
import Header from '.'

export default {
  title: 'Header',
  component: Header,
  parameters: { controls: { sort: 'alpha' } },
  args: {
    title: 'Some title',
    description: 'Some description.'
  }
}

const Template = (args) => <Header {...args} />

export const Default = Template.bind({})
