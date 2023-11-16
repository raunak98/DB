import axios from '../axios'

export const get = (status, pageSize, pageNumber) =>
  axios
    .get(
      `/v0/dashboard/mytasks/allreviews?status=${status}&pageSize=${pageSize}&pageNumber=${pageNumber}`
    )
    .then((response) => response.data)

export const getMetadata = () =>
  axios.get('/v0/configuration/uireviewstable').then((response) => response.data)

export const search = (word, pageSize, pageNumber, status) =>
  axios
    .get(
      `/v0/dashboard/mytasks/searchquery?status=${status}&pageSize=${pageSize}&pageNumber=${pageNumber}&campaignName=${word}`
    )
    .then((response) => response.data)

export const sortReviews = (status, pageSize, pageNumber, sortBy, sortDesc) =>
  axios
    .get(
      `/v0/dashboard/mytasks/allreviews?status=${status}&pageSize=${pageSize}&pageNumber=${pageNumber}&sortBy=${sortBy}&sortDesc=${sortDesc}`
    )
    .then((response) => response.data)
