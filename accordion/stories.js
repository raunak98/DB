import React from 'react'
import Table from 'components/table'
import { Default as TableStory } from 'components/table/stories'
import Accordion from '.'

export default {
  title: 'Accordion',
  component: Accordion
}

const Template = (args) => <Accordion {...args} />

export const Default = Template.bind({})
Default.args = {
  children: <p>Some text</p>,
  headers: [
    <>
      <div>Some title</div>
      <span>Some description</span>
    </>,
    'Some other title'
  ]
}

export const WithTable = Template.bind({})
WithTable.args = {
  children: <Table {...TableStory.args} hasBorder={false} />,
  headers: [<div>Some title</div>, <span>Some other title</span>, 'One more title']
}
