import React from 'react'
import ActionCard from '.'

export default {
  title: 'Action Card',
  component: ActionCard,
  args: {
    title: 'Some title',
    description: 'Some description',
    action: 'Some action',
    iconName: 'link',
    iconSize: 'large'
  },
  argTypes: {
    iconName: {
      options: ['', 'link', 'download', 'create'],
      control: {
        type: 'radio',
        labels: {
          '': 'none'
        }
      }
    },
    iconSize: {
      options: ['xxtiny', 'xtiny', 'tiny', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
      control: {
        type: 'radio'
      }
    }
  }
}

const Template = (args) => <ActionCard {...args} />

export const Default = Template.bind({})
