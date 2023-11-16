import React from 'react'
import Accordion from 'components/accordion'
import * as AccordionStories from 'components/accordion/stories'
import Accordions from '.'

export default {
  title: 'Accordions',
  component: Accordions
}

const Template = (args) => <Accordions {...args} />

export const Default = Template.bind({})
Default.args = {
  children: new Array(7)
    .fill(0)
    .map((value, index) => (
      <Accordion key={`accordions-${index}`} {...AccordionStories.Default.args} />
    )),
  hasPagination: true
}

export const WithTables = Template.bind({})
WithTables.args = {
  children: new Array(3)
    .fill(0)
    .map((value, index) => (
      <Accordion key={`accordions-with-tables-${index}`} {...AccordionStories.WithTable.args} />
    ))
}
