import React from 'react'
import Button from '.'

export default {
  title: 'Button',
  component: Button,
  parameters: { controls: { sort: 'alpha' } },
  args: {
    disabled: false,
    size: 'medium'
  },
  argTypes: {
    size: {
      options: ['tiny', 'small', 'medium', 'large'],
      control: { type: 'radio' }
    },
    iconName: {
      options: ['', 'columns', 'tiles'],
      control: {
        type: 'radio',
        labels: {
          '': 'none',
          columns: 'columns',
          tiles: 'tiles'
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

const Template = (args) => <Button {...args} />

export const Primary = Template.bind({})
Primary.args = {
  text: 'Primary Button',
  primary: true
}

export const Secondary = Template.bind({})
Secondary.args = {
  text: 'Secondary Button',
  primary: false
}
