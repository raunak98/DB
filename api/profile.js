import axios from '../axios'

export const get = () => axios.get('/v0/home/profile').then((response) => response.data)

export const getUserInfo = () => axios.get('/v0/home/userinfo').then((response) => response.data)

export const getUserProfileInfo = () =>
  axios.get(`/v0/home/preferences`).then((response) => response.data)

export const updateUserPreferances = (payload) => axios.patch(`/v0/home/addpreference`, payload)

export const getProvisioningRoles = () =>
  axios.get('/v0/user/getProvisioningRoles').then((response) => response.data)
