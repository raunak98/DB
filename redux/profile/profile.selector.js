import { createSelector } from '@reduxjs/toolkit'

const selectProfile = (state) => state.profile

export const selectProfileSelector = createSelector([selectProfile], (items) => items.profile)

export const selectprofileDetails = createSelector([selectProfile], (items) => items.profileDetails)

const selectProfileDetails = (state) => state.profile

export const selectProfileDetailsSelector = createSelector(
  [selectProfileDetails],
  (items) => items.profileDetails
)

export const selectProvisioningRoles = createSelector(
  [selectProfileDetails],
  (items) => items.provisioningRoles
)

export const selectProfileRole = createSelector([selectProfile], (items) => items.role)
