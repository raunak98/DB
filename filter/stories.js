import React from 'react'
import Filter from '.'

export default {
  title: 'Filter',
  component: Filter,
  args: {
    filters: [
      { id: 'all', text: 'All' },
      { id: 'filter-1', text: 'Filter 1 (9)' },
      { id: 'filter-2', text: 'Filter 2 (6)' },
      { id: 'filter-3', text: 'Filter 3 (10)' }
    ],
    initialFilterId: 'all'
  }
}

const Template = (args) => <Filter {...args} />

export const Default = Template.bind({})

export const WithLabel = Template.bind({})
WithLabel.args = {
  label: 'Some Label'
}
