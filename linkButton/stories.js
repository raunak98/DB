import React from 'react'
import LinkButton from '.'

export default {
  title: 'LinkButton',
  component: LinkButton,
  args: {
    text: 'Some text'
  },
  argTypes: {
    iconName: {
      options: ['', 'edit', 'send'],
      control: {
        type: 'radio',
        labels: {
          '': 'none'
        }
      }
    }
  }
}

const Template = (args) => <LinkButton {...args} />

export const Default = Template.bind()
