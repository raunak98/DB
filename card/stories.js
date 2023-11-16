import React from 'react'
import Card from '.'

export default {
  title: 'Card',
  component: Card,
  parameters: { controls: { sort: 'alpha' } },
  args: {
    title: 'Some title',
    description: 'Some description'
  },
  argTypes: {
    iconName: {
      options: ['', 'interface', 'create', 'download', 'link', 'send', 'account', 'settings'],
      control: {
        type: 'radio',
        labels: {
          '': 'none'
        }
      }
    }
  }
}

const Template = (args) => <Card {...args} />

export const Default = Template.bind({})

export const WithIcon = Template.bind({})
WithIcon.args = {
  iconName: 'account'
}
