// Metadata for a component - Table
export const reviewMetaData = {
  groupBy: ['All', 'User name', 'Account type', 'Cost center', 'UBR node', 'Supervisor', 'D-ISO-M'],
  initialGroupBy: 'All',
  filterBy: ['All', 'Open actions', 'Closed actions'],
  initialFilterBy: 'All',
  paginationSizes: [10, 25, 50, 100],
  hasSortableColumns: true,
  initialSortColumnId: 'applicationName',
  bulkActions: ['maintain', 'revoke', 'allowExceptions', 'reassign', 'forward', 'sendEmail'],
  columns: [
    {
      id: 'select',
      type: 'checkbox',
      header: {
        type: 'component',
        component: 'checkbox'
      },
      hasInfo: false,
      sortable: false,
      initialDisplay: true,
      order: 1
    },
    {
      id: 'maintain',
      type: 'icon',
      header: {
        type: 'text',
        text: 'Maintain'
      },
      hasInfo: false,
      sortable: false,
      initialDisplay: true,
      order: 2,
      properties: {
        iconInactive: 'success',
        iconActive: 'unchecked'
      }
    },
    {
      id: 'revoke',
      type: 'icon',
      header: {
        type: 'text',
        text: 'Revoke'
      },
      hasInfo: false,
      sortable: false,
      initialDisplay: true,
      order: 3,
      properties: {
        iconInactive: 'revoke',
        iconActive: 'revokeOutline'
      }
    },
    // {
    //   id: 'allowExceptions',
    //   type: 'icon',
    //   header: {
    //     type: 'text',
    //     text: 'Allow exceptions'
    //   },
    //   hasInfo: false,
    //   sortable: false,
    //   initialDisplay: true,
    //   order: 3,
    //   properties: {
    //     iconInactive: 'calendar',
    //     iconActive: 'info'
    //   }
    // },
    {
      id: 'moreActions',
      type: 'dropdownToPopup',
      header: {
        type: 'text',
        text: ''
      },
      hasInfo: false,
      sortable: false,
      initialDisplay: true,
      order: 4,
      properties: {
        placeholderId: 'More',
        options: [
          {
            id: 'reassign',
            popupId: 'reviewItemReassign'
          },
          {
            id: 'forward',
            popupId: 'reviewItemForward'
          },
          {
            id: 'email',
            popupId: 'reviewItemEmail'
          },
          {
            id: 'transferOwnership',
            popupId: 'reviewItemTransferOwnership'
          }
        ]
      }
    },
    {
      id: 'expirationDate',
      type: 'linkToPopup',
      header: {
        type: 'text',
        text: ''
      },
      hasInfo: false,
      sortable: false,
      initialDisplay: false,
      order: 5,
      properties: {
        popupId: 'reviewItemExpirationDate'
      }
    },
    {
      id: 'comment',
      type: 'linkToPopup',
      header: {
        type: 'text',
        text: ''
      },
      hasInfo: false,
      sortable: false,
      initialDisplay: true,
      order: 6,
      properties: {
        textId: 'comment',
        popupId: 'reviewItemComment'
      }
    },
    {
      id: 'applicationName',
      type: 'text',
      header: {
        type: 'text',
        text: 'Application Name'
      },
      hasInfo: false,
      sortable: true,
      initialDisplay: true,
      order: 7
    },
    {
      id: 'accountName',
      type: 'text',
      header: {
        type: 'text',
        text: 'Account Name'
      },
      hasInfo: true,
      sortable: true,
      initialDisplay: true,
      order: 8,
      properties: {
        popupId: 'reviewItemMoreInfo',
        infoFieldId: 'account'
      }
    },
    {
      id: 'username',
      type: 'text',
      header: {
        type: 'text',
        text: 'Username'
      },
      hasInfo: true,
      sortable: true,
      initialDisplay: true,
      order: 9,
      properties: {
        popupId: 'reviewItemMoreInfo',
        infoFieldId: 'user'
      }
    },
    {
      id: 'email',
      type: 'text',
      header: {
        type: 'text',
        text: 'Email'
      },
      hasInfo: false,
      sortable: true,
      initialDisplay: true,
      order: 10
    },
    {
      id: 'lastLogin',
      type: 'text',
      header: {
        type: 'text',
        text: 'Last login'
      },
      hasInfo: false,
      sortable: true,
      initialDisplay: true,
      order: 11
    },
    {
      id: 'accountType',
      type: 'text',
      header: {
        type: 'text',
        text: 'Account type'
      },
      hasInfo: false,
      sortable: true,
      initialDisplay: true,
      order: 12
    },
    {
      id: 'costCenter',
      type: 'text',
      header: {
        type: 'text',
        text: 'Cost center'
      },
      hasInfo: false,
      sortable: true,
      initialDisplay: true,
      order: 13
    },
    {
      id: 'UBRnode',
      type: 'text',
      header: {
        type: 'text',
        text: 'UBRnode'
      },
      hasInfo: false,
      sortable: true,
      initialDisplay: true,
      order: 14
    },
    {
      id: 'supervisor',
      type: 'text',
      header: {
        type: 'text',
        text: 'Supervisor'
      },
      hasInfo: false,
      sortable: true,
      initialDisplay: true,
      order: 15
    },
    {
      id: 'DISOM',
      type: 'text',
      header: {
        type: 'text',
        text: 'DISOM'
      },
      hasInfo: false,
      sortable: true,
      initialDisplay: true,
      order: 16
    },
    {
      id: 'history',
      type: 'linkToPopup',
      header: {
        type: 'text',
        text: ''
      },
      sortable: false,
      initialDisplay: true,
      order: 17,
      properties: {
        textId: 'View history',
        popupId: 'reviewItemHistory'
      }
    },
    {
      id: 'sticky',
      type: 'sticky',
      header: {
        type: 'component',
        component: 'sticky'
      },
      hasInfo: false,
      sortable: false,
      initialDisplay: true,
      order: 1,
      sticky: 'right'
    }
  ]
}

// Mock data for the tables - Review
export const reviewItems = [
  {
    id: 'review-item-1',
    status: 'reassigned',
    expirationDate: '01/01/2022', // value will potentially be in different date format
    comment: [
      {
        username: 'Alex',
        message: 'This should be revoked!',
        date: '21/03/2020'
      },
      {
        username: 'Daniel',
        message: 'Yes, I can confirm',
        date: '22/03/2020'
      }
    ],
    applicationName: 'Some name 1',
    accountName: 'Some account 1',
    username: 'Some username 1',
    email: 'some.email1@gmail.com',
    lastLogin: '10/10/2020',
    accountType: 'account type 1',
    costCenter: 'costCenter 1',
    UBRnode: 'UBRnode 1',
    supervisor: 'supervisor 1',
    DISOM: 'DISOM 1',
    history: [
      'History 1 last action',
      'History 1 before last action',
      'History 1 another previous action'
    ],
    user: {
      email: 'some.email1@gmail.com',
      costCenter: 'costCenter 1',
      UBRnode: 'UBRnode 1',
      supervisor: 'supervisor 1',
      DISOM: 'DISOM 1',
      someUserField: 'some user filed value 1',
      someOtherUserField: 'some other user field value 1'
    },
    account: {
      accountType: 'account type 1',
      lastLogin: '10/10/2020',
      someAccountField: 'some account filed value 1',
      someOtherAccountField: 'some other account field value 1'
    }
  },
  {
    id: 'review-item-2',
    status: 'maintained',
    expirationDate: '02/02/2022',
    comment: [],
    applicationName: 'Some name 2',
    accountName: 'Some account 2',
    username: 'Some username 2',
    email: 'some.email2@gmail.com',
    lastLogin: '10/02/2020',
    accountType: 'accountt type 2',
    costCenter: 'costCenter 2',
    UBRnode: 'UBRnode 2',
    supervisor: 'supervisor 2',
    DISOM: 'DISOM 2',
    history: [
      'History 2 last action',
      'History 2 before last action',
      'History 2 another previous action'
    ],
    user: {
      email: 'some.email2@gmail.com',
      costCenter: 'costCenter 2',
      UBRnode: 'UBRnode 2',
      supervisor: 'supervisor 2',
      DISOM: 'DISOM 2',
      someUserField: 'some user filed value 2',
      someOtherUserField: 'some other user field value 2'
    },
    account: {
      accountType: 'account type 2',
      lastLogin: '10/02/2020',
      someAccountField: 'some account filed value 2',
      someOtherAccountField: 'some other account field value 2'
    }
  },
  {
    id: 'review-item-3',
    status: 'revoked',
    expirationDate: '03/03/2022',
    comment: [],
    applicationName: 'Some name 3',
    accountName: 'Some account 3',
    username: 'Some username 3',
    email: 'some.email3@gmail.com',
    lastLogin: '30/03/2020',
    accountType: 'accountt type 3',
    costCenter: 'costCenter 3',
    UBRnode: 'UBRnode 3',
    supervisor: 'supervisor 3',
    DISOM: 'DISOM 3',
    history: [
      'History 3 last action',
      'History 3 before last action',
      'History 3 another previous action'
    ],
    user: {
      email: 'some.email3@gmail.com',
      costCenter: 'costCenter 3',
      UBRnode: 'UBRnode 3',
      supervisor: 'supervisor 3',
      DISOM: 'DISOM 3',
      someUserField: 'some user filed value 3',
      someOtherUserField: 'some other user field value 3'
    },
    account: {
      accountType: 'account type 3',
      lastLogin: '30/03/2020',
      someAccountField: 'some account filed value 3',
      someOtherAccountField: 'some other account field value 3'
    }
  },
  {
    id: 'review-item-4',
    status: 'reassigned',
    expirationDate: '04/04/2022',
    comment: [],
    applicationName: 'Some name 4',
    accountName: 'Some account 4',
    username: 'Some username 4',
    email: 'some.email4@gmail.com',
    lastLogin: '14/04/2020',
    accountType: 'accountt type 4',
    costCenter: 'costCenter 4',
    UBRnode: 'UBRnode 4',
    supervisor: 'supervisor 4',
    DISOM: 'DISOM 4',
    history: [
      'History 4 last action',
      'History 4 before last action',
      'History 4 another previous action'
    ],
    user: {
      email: 'some.email4@gmail.com',
      costCenter: 'costCenter 4',
      UBRnode: 'UBRnode 4',
      supervisor: 'supervisor 4',
      DISOM: 'DISOM 4',
      someUserField: 'some user filed value 4',
      someOtherUserField: 'some other user field value 4'
    },
    account: {
      accountType: 'account type 4',
      lastLogin: '14/04/2020',
      someAccountField: 'some account filed value 4',
      someOtherAccountField: 'some other account field value 4'
    }
  },
  {
    id: 'review-item-5',
    status: 'reassigned',
    expirationDate: '04/04/2022',
    comment: [],
    applicationName: 'Some name 1',
    accountName: 'Some account 1',
    username: 'Some username 1',
    email: 'some.email4@gmail.com',
    lastLogin: '14/04/2020',
    accountType: 'accountt type 4',
    costCenter: 'costCenter 4',
    UBRnode: 'UBRnode 4',
    supervisor: 'supervisor 4',
    DISOM: 'DISOM 4',
    history: [
      'History 4 last action',
      'History 4 before last action',
      'History 4 another previous action'
    ],
    user: {
      email: 'some.email4@gmail.com',
      costCenter: 'costCenter 4',
      UBRnode: 'UBRnode 4',
      supervisor: 'supervisor 4',
      DISOM: 'DISOM 4',
      someUserField: 'some user filed value 4',
      someOtherUserField: 'some other user field value 4'
    },
    account: {
      accountType: 'account type 4',
      lastLogin: '14/04/2020',
      someAccountField: 'some account filed value 4',
      someOtherAccountField: 'some other account field value 4'
    }
  }
]

export const reviewItemsFilters = {
  options: [
    { id: 'All' },
    { id: 'Virtual data' },
    { id: 'Active directory - exc. service accounts' },
    { id: 'Active directory - service accounts' }
  ],
  defaultOptionId: 'all'
}

export const reviewItemsGroups = {
  options: [{ id: 'All' }, { id: 'Group by user' }, { id: 'Group by group' }],
  defaultOptionId: 'All'
}
