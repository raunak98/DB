import React from 'react'
import * as Icons from './svg'

export default {
  title: 'Icon',
  component: Icons,
  parameters: { controls: { sort: 'alpha' } },
  args: {
    size: 'large'
  },
  argTypes: {
    size: {
      options: ['xxtiny', 'xtiny', 'tiny', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
      control: { type: 'radio' }
    }
  }
}

const Template = (args) => (
  <>
    {Object.entries(Icons).map(([key, Icon]) => (
      <Icon key={key} {...args} />
    ))}
  </>
)

export const Default = Template.bind({})
