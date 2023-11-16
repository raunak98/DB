import ProfileActionTypes from './profile.types'

export const fetchProfileStart = () => ({
  type: ProfileActionTypes.FETCH_PROFILE_START
})

export const fetchProfileSuccess = (payload) => ({
  type: ProfileActionTypes.FETCH_PROFILE_SUCCESS,
  payload
})

export const fetchProfileFailure = (payload) => ({
  type: ProfileActionTypes.FETCH_PROFILE_FAILURE,
  payload
})

export const fetchProfileDetailsSuccess = (payload) => ({
  type: ProfileActionTypes.FETCH_PROFILE_DETAILS_SUCCESS,
  payload
})

export const fetchProfileDetailsFailure = (payload) => ({
  type: ProfileActionTypes.FETCH_PROFILE_DETAILS_FAILURE,
  payload
})

export const fetchProvisioningRolesSuccess = (payload) => ({
  type: ProfileActionTypes.FETCH_PROVISIONING_ROLES_SUCCESS,
  payload
})

export const fetchProvisioningRolesFailure = (payload) => ({
  type: ProfileActionTypes.FETCH_PROVISIONING_ROLES_FAILURE,
  payload
})

export const fetchProfileRole = (payload) => ({
  type: ProfileActionTypes.FETCH_PROFILE_ROLE,
  payload
})
