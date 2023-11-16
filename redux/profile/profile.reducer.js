import ProfileActionTypes from './profile.types'

const INITIAL_STATE = {
  profile: {
    firstName: '',
    lastName: '',
    userId: null
  },
  isFetching: false,
  errorMessage: undefined,
  profileDetails: null,
  role: '',
  provisioningRoles: []
}

const profileReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ProfileActionTypes.FETCH_PROFILE_START:
      return {
        ...state,
        isFetching: true
      }
    case ProfileActionTypes.FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        profile: {
          firstName: action.payload.FirstName,
          lastName: action.payload.LastName,
          userId: action.payload.userId
        }
      }
    case ProfileActionTypes.FETCH_PROFILE_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload
      }

    case ProfileActionTypes.FETCH_PROFILE_DETAILS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        profileDetails: action.payload
      }
    case ProfileActionTypes.FETCH_PROFILE_DETAILS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload
      }
    case ProfileActionTypes.FETCH_PROVISIONING_ROLES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        provisioningRoles: action.payload
      }
    case ProfileActionTypes.FETCH_PROFILE_ROLE:
      return {
        ...state,
        isFetching: false,
        role: action.payload
      }
    default:
      return state
  }
}

export default profileReducer
