import axios from '../axios'
import * as justificationAPI from './justifications'
import * as approvalsAPI from './approvals'

const getCount = async (list) => {
  const data = []
  await Promise.all(
    list.map(async (obj, i) => {
      if (obj?.id[0] === 'justifications') {
        await justificationAPI
          .getPendingJustification(10, 0)
          .then((res) => {
            const index = obj.id.indexOf(obj.id[0])
            data[i] = {
              id: obj.id[0],
              count: res?.total ? res?.total : 0,
              redirectTo: obj.redirectTo[index],
              displayInMenu: obj?.displayInMenu
            }
          })
          .catch((err) => {
            console.error(err)
            data[i] = { ...obj, count: 0 }
          })
      } else if (obj?.id[0] === 'approvals') {
        const approvalPayload = {
          approvalStatus: 'in-progress',
          pageSize: 10,
          pageNumber: 0
        }
        await approvalsAPI
          .getApprvals(approvalPayload)
          .then((res) => {
            const index = obj.id.indexOf(obj.id[0])
            data[i] = {
              id: obj.id[0],
              count: res?.total ? res?.total : 0,
              redirectTo: obj.redirectTo[index],
              displayInMenu: obj?.displayInMenu
            }
          })
          .catch((err) => {
            console.error(err)
            data[i] = { ...obj, count: 0 }
          })
      } else {
        await axios
          .get(obj?.data)
          .then((res) => {
            Object.entries(res?.data).forEach((e) => {
              const index = obj?.id?.indexOf(e[0])
              data[i] = {
                id: e[0],
                count: e[1],
                redirectTo: obj?.redirectTo[index],
                displayInMenu: obj?.displayInMenu
              }
            })
          })
          .catch((err) => {
            data[i] = { ...obj, count: 0 }
            console.error(err)
          })
      }
      return obj
    })
  )
  return data
}

export const get = async () => {
  // This API call required for future development and debugging
  // const response = await axios({
  //   url: '/api/metadata/dashboard',
  //   baseURL: 'http://localhost:8081'
  // }).then((res) => res.data)
  // const response = await axios('/v0/configuration/uidashboard').then((res) => res.data)
  const response = await axios(`/v0/configuration/metaType=dashboard`).then((res) => res.data) // Passing  dashboard for MetaType as this is the stored in config files
  return getCount(response)
}

export const getCountByStatus = async (status) => {
  const response = await axios(`/v0/dashboard/reviews?status=${status}`).then((res) => res.data)

  return response
}
export const getuserPrefrence = async () => {
  const response = await axios({
    url: '/api/metadata/userPreferances',
    baseURL: 'http://localhost:8081'
  })
  return response
}
export const getNotification = async () => {
  const response = await axios(`/v0/config/getMetadata?metaType=notification`).then(
    (res) => res.data
  )
  // This API call required for future development and debugging
  // const response = await axios({
  //   url: '/api/metadata/notification',
  //   baseURL: 'http://localhost:8081'
  // }).then((res) => res.data)
  return response
}
export const changeTheme = (action, payload) =>
  axios({
    url: `/metadata/userPreferances/${action}`,
    baseURL: 'http://localhost:8081/api',
    data: payload,
    method: 'post'
  })

export const getHistoryMeta = async () => {
  const response = await axios({
    url: '/v0/configuration/metaType=historyDashboard'
  }).then((res) => res.data)
  return response
}

export const getLastLoginTime = async (userEmail) => {
  const response = await axios({
    url: `/v0/home/lastLogon?userMail=${userEmail}&pageSize=100`
  }).then((res) => res.data)
  return response.result[0].timestamp
}
