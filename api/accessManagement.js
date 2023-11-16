import axios from '../axios'

// Local MetaDta connection
// export const getAccessGroupMeta = async () => {
//   const response = await axios({
//     url: '/api/metadata/accessGroupMeta',
//     baseURL: 'http://localhost:8081'
//   })
//     .then((res) => res.data)
//     .catch(() => ({ status: 500, statusText: 'Error', message: 'API Error' }))

//   return response
// }
const iff = (condition, then, other) => (condition ? then : other)
export const getAccessGroupMeta = async () => {
  const response = await axios({
    url: `/v0/configuration/metaType=accessGroup`
  })
    .then((res) => res.data)
    .catch(() => ({ status: 500, statusText: 'Error', message: 'API Error' }))

  return response
}

export const getAccessGroupDetails = async (payload) => {
  const response = await axios({
    url: '/v0/governance/myGroupMembership',
    data: payload,
    method: 'post'
  })
    .then((res) => {
      const getGroupName = (memberOf) => {
        const groupName = []

        if (memberOf && memberOf.length !== 0) {
          memberOf.forEach((data) => {
            if (data !== '') {
              let element = data.split(',')
              // eslint-disable-next-line prefer-destructuring
              element = element.find((item) => item.startsWith('CN=')).split('=')[1]
              groupName.push(element)
            }
          })
          return groupName
        }
        return groupName
      }

      const result = {}
      result.total = res?.data?.hits?.total?.value
      const groupData = []
      res?.data?.hits?.hits?.forEach((item) => {
        /* eslint no-underscore-dangle: 0 */

        let mailId = ''
        if (item?._source?.igaContent?.employeeType && item?._source?.igaContent?.sAMAccountName) {
          if (
            ['perm', 'ext', 'secnd', 'dadmin', 'domspt'].includes(
              item?._source?.igaContent?.employeeType?.toLowerCase()
            )
          ) {
            mailId = item._source.igaContent?.mail
          } else if (
            item?._source?.igaContent?.employeeType?.toLowerCase() === 'admin' &&
            item._source.igaContent.sAMAccountName.endsWith('-a')
          ) {
            mailId = item._source.igaContent?.mail
          }
        }

        groupData.push({
          id: item ? item?._id : '',
          cn: item?._source?.igaContent?.displayName ? item?._source?.igaContent?.displayName : '',
          accountName: item?._source?.igaContent?.sAMAccountName
            ? item?._source?.igaContent?.sAMAccountName
            : '',
          memberOf: item?._source?.igaContent?.object?.memberOf
            ? getGroupName(item?._source?.igaContent?.object?.memberOf)
            : [],
          distinguishedName: item?._source?.igaContent?.distinguishedName
            ? item?._source?.igaContent?.distinguishedName
            : '',
          mail: mailId,
          details: item
        })
      })
      result.groupData = groupData
      return result
    })
    .catch(() => ({ status: 500, statusText: 'Error', message: 'API Error' }))

  return response
}

export const removeAccess = async (payload) => {
  const response = await axios({
    url: '/v0/governance/requests/entitlementGrant',
    data: payload,
    method: 'post'
  }).then((res) => res)
  return response
}

// eslint-disable-next-line consistent-return
export const getGroupDetails = async (payload) => {
  try {
    const response = await axios({
      url: '/v0/governance/groupDetails',
      data: payload,
      method: 'post'
    }).then((res) => {
      let groupData = {}
      res?.data?.hits?.hits?.forEach((item) => {
        /* eslint no-underscore-dangle: 0 */
        groupData = {
          id: item?._source?.id ? item?._source?.id : '',
          dbagIMSApprovers: item?._source?.igaContent?.object?.dbagIMSApprovers
            ? item?._source?.igaContent?.object?.dbagIMSApprovers
            : [],
          dbagProvisioningBy: item?._source?.igaContent?.dbagProvisioningBy
            ? item?._source?.igaContent?.dbagProvisioningBy
            : null,
          // Temporarily commenting current mapping
          // accessioAppRequest: item?._source?.glossary?.kv?.filter(
          //   (gattrb) => gattrb.key === 'accessioAppRequest'
          // )[0]?.value,
          accessioAppRequest:
            item?._source?.glossary?.idx &&
            item?._source?.glossary?.idx['/'] &&
            item?._source?.glossary?.idx['/'].accessioAppRequest,
          groupDn: item?._source?.igaContent?.distinguishedName
            ? item?._source?.igaContent?.distinguishedName
            : '',
          dbagIMSAuthContact: item?._source?.igaContent?.object?.dbagIMSAuthContact
            ? item?._source?.igaContent?.object?.dbagIMSAuthContact
            : iff(
                item?._source?.igaContent?.dbagIMSAuthContact,
                item?._source?.igaContent?.dbagIMSAuthContact,
                ''
              ),
          dbagIMSAuthContactDelegate: item?._source?.igaContent?.object?.dbagIMSAuthContactDelegate
            ? item?._source?.igaContent?.object?.dbagIMSAuthContactDelegate
            : iff(
                item?._source?.igaContent?.dbagIMSAuthContactDelegate,
                item?._source?.igaContent?.dbagIMSAuthContactDelegate,
                ''
              ),
          groupName: item?._source?.igaContent?.object?.cn
            ? item?._source?.igaContent?.object?.cn
            : ''
        }
      })
      return groupData
    })
    return response
  } catch (error) {
    console.error(error)
  }
}

export const setGroupRecord = (payload) => {
  const result = payload
  return result
    ? [
        {
          id: 'domain',
          value: !['', undefined, null].includes(result?._source?.igaContent?.object?.domain)
            ? result?._source?.igaContent?.object?.domain
            : ''
        },

        { id: 'id', value: result?._source?.id ? result?._source?.id : '' },
        {
          id: 'accessioRequestNo',
          value: result?._source?.Accessio_Request_No ? result?._source?.Accessio_Request_No : ''
        },
        {
          id: 'samAccount',
          value: result?._source?.igaContent?.displayName
            ? result?._source?.igaContent?.displayName
            : ''
        },
        {
          id: 'dn',
          value: result?._source?.igaContent?.object?.dn
            ? result?._source?.igaContent?.object?.dn
            : ''
        },
        {
          id: 'distinguishedName',
          value: result?._source?.igaContent?.distinguishedName
            ? result?._source?.igaContent?.distinguishedName
            : ''
        }
      ]
    : []
}

export const searchMyAccessGroups = async (payload) => {
  const response = await axios({
    url: '/v0/governance/myGroupMembership/search',
    data: payload,
    method: 'post'
  })
    .then((res) => {
      const getGroupName = (memberOf) => {
        const groupName = []

        if (memberOf && memberOf.length !== 0) {
          memberOf.forEach((data) => {
            if (data !== '') {
              let element = data.split(',')
              // eslint-disable-next-line prefer-destructuring
              element = element.find((item) => item.startsWith('CN=')).split('=')[1]
              groupName.push(element)
            }
          })
          return groupName
        }
        return groupName
      }

      const result = {}
      result.total = res?.data?.hits?.total?.value
      const groupData = []
      res?.data?.hits?.hits?.forEach((item) => {
        /* eslint no-underscore-dangle: 0 */

        let mailId = ''
        const { employeeType, sAMAccountName, mail } = item?._source?.igaContent
        if (employeeType && sAMAccountName) {
          if (['perm', 'ext', 'secnd', 'dadmin', 'domspt'].includes(employeeType?.toLowerCase())) {
            mailId = mail
          } else if (employeeType?.toLowerCase() === 'admin' && sAMAccountName.endsWith('-a')) {
            mailId = mail
          }
        }

        groupData.push({
          id: item ? item?._id : '',
          cn: item?._source?.igaContent?.displayName ? item?._source?.igaContent?.displayName : '',
          accountName: item?._source?.igaContent?.sAMAccountName
            ? item?._source?.igaContent?.sAMAccountName
            : '',
          memberOf: item?._source?.igaContent?.object?.memberOf
            ? getGroupName(item?._source?.igaContent?.object?.memberOf)
            : [],
          distinguishedName: item?._source?.igaContent?.distinguishedName
            ? item?._source?.igaContent?.distinguishedName
            : '',
          mail: mailId,
          details: item
        })
      })
      result.groupData = groupData
      return result
    })
    .catch(() => ({ status: 500, statusText: 'Error', message: 'API Error' }))

  return response
}

export const sortMyAccessGroups = async (payload) => {
  const response = await axios({
    url: '/v0/governance/myGroupMembership/sort',
    data: payload,
    method: 'post'
  })
    .then((res) => {
      const result = {}
      result.total = res?.data?.hits?.total?.value
      const groupData = []
      res?.data?.hits?.hits?.forEach((item) => {
        /* eslint no-underscore-dangle: 0 */
        groupData.push({
          id: item?._source?.id ? item?._source?.id : '',
          cn: item?._source?.igaContent?.displayName ? item?._source?.igaContent?.displayName : '',
          accountName: item?._source?.igaContent?.sAMAccountName
            ? item?._source?.igaContent?.sAMAccountName
            : '',
          sortKeyword: item?.sort ? item?.sort[0] : ''
        })
      })
      result.groupData = groupData
      return result
    })
    .catch(() => ({ status: 500, statusText: 'Error', message: 'API Error' }))

  return response
}
