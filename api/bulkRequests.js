import axios from '../axios'

export const getMeta = async () => {
  const response = await axios(`/v0/configuration/metaType=bulkRequest`).then((res) => res.data)

  return response
}

// export const getMeta = async () => {
//   const response = await axios({
//     url: '/api/metadata/bulkRequest',
//     baseURL: 'http://localhost:8081'
//   }).then((res) => res.data)

//   return response
// }
