import axios from '../axios'

// TODO: Currently Ig is sending all the data because is a temporary API
export const searchUsers = (name) =>
  axios
    .get(`/v0/dashboard/actions/getuser?queryString=${name}`)
    .then((response) => response.data.result)

export const searchOwnerContact = (name) =>
  axios
    .get(`/v0/governance/getEmailAddress?emailId=${name}&exactMatch=${false}`)
    .then((response) => response.data)
