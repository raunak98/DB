import MyTeamActionTypes from './myTeam.type'

export const fetchMyTeamItemsStart = (payload) => ({
  type: MyTeamActionTypes.FETCH_MYTEAM_ITEMS_START,
  payload
})

export const fetchMyTeamItemsSuccess = (payload) => ({
  type: MyTeamActionTypes.FETCH_MYTEAM_ITEMS_SUCCESS,
  payload
})

export const fetchMyTeamItemsFailure = (payload) => ({
  type: MyTeamActionTypes.FETCH_MYTEAM_ITEMS_FAILURE,
  payload
})

export const fetchMyTeamSearchStart = (payload) => ({
  type: MyTeamActionTypes.FETCH_MYTEAM_SEARCH_START,
  payload
})

export const fetchMyTeamSearchSuccess = (payload) => ({
  type: MyTeamActionTypes.FETCH_MYTEAM_SEARCH_SUCCESS,
  payload
})

export const fetchMyTeamSearchFailure = (payload) => ({
  type: MyTeamActionTypes.FETCH_MYTEAM_SEARCH_FAILURE,
  payload
})
export const fetchMyTeamMetadataStart = () => ({
  type: MyTeamActionTypes.FETCH_MYTEAM_METADATA_START
})

export const fetchMyTeamMetadataSuccess = (payload) => ({
  type: MyTeamActionTypes.FETCH_MYTEAM_METADATA_SUCCESS,
  payload
})

export const fetchMyTeamMetadataFailure = (payload) => ({
  type: MyTeamActionTypes.FETCH_MYTEAM_METADATA_FAILURE,
  payload
})

export const updateMyTeamPageSize = (payload) => ({
  type: MyTeamActionTypes.MYTEAM_PAGESIZE,
  payload
})

export const updateMyTeamPageNumber = (payload) => ({
  type: MyTeamActionTypes.MYTEAM_PAGE_NUMBER,
  payload
})

export const updateShowBigLoader = (payload) => ({
  type: MyTeamActionTypes.SHOW_BIG_LOADER,
  payload
})

export const fetchMyTeamPaginationKeys = (payload) => ({
  type: MyTeamActionTypes.FETCH_PAGINARION_KEYS,
  payload
})

export const updateMyTeamPaginationKeys = (payload) => ({
  type: MyTeamActionTypes.UPDATE_PAGINATION_KEYS,
  payload
})

export const fetchMyTeamIsGoingForwardFlag = (payload) => ({
  type: MyTeamActionTypes.FETCH_IS_GOING_FORWARD_FLAG,
  payload
})

export const updateIsMyTeamGoingForwardFlag = (payload) => ({
  type: MyTeamActionTypes.UPDATE_IS_GOING_FORWARD_FLAG,
  payload
})

export const fetchMyTeamSortStart = (payload) => ({
  type: MyTeamActionTypes.FETCH_MYTEAM_SORT_START,
  payload
})

export const updateMyTeamSortInfoData = (payload) => ({
  type: MyTeamActionTypes.UPDATE_MYTEAM_SORT_INFO,
  payload
})
