export const reviewsMetaData = {
  paginationSizes: [10, 25, 50, 100],
  initialSortColumnId: 'applicationName',
  columns: [
    {
      id: 'name',
      type: 'text',
      header: {
        type: 'text',
        text: 'name Review'
      },
      initialDisplay: true,
      order: 1
    },
    {
      id: 'startDate',
      type: 'text',
      header: {
        type: 'text',
        text: 'Start Date'
      },
      initialDisplay: true,
      order: 2
    },
    {
      id: 'dueDate',
      type: 'text',
      header: {
        type: 'text',
        text: 'Due Date'
      },
      initialDisplay: true,
      order: 3
    },
    {
      id: 'completion',
      type: 'text',
      header: {
        type: 'text',
        text: 'completion'
      },
      initialDisplay: true,
      order: 4
    },
    {
      id: 'redirect',
      type: 'redirectButton',
      header: {
        type: 'text',
        text: ''
      },
      initialDisplay: true,
      order: 100,
      properties: {
        text: 'open',
        fieldForPath: 'id',
        redirectProps: ['id', 'name']
      }
    }
  ]
}

export const reviews = [
  {
    id: 'review-1',
    name: 'Review 1',
    dueDate: '01/01/2022', // value will potentially be in different date format,
    startDate: '01/01/2021',
    completion: '1/2'
  },
  {
    id: 'review-2',
    name: 'Review 2',
    dueDate: '01/01/2021', // value will potentially be in different date format,
    startDate: '01/01/2020',
    completion: '1/16'
  }
]
