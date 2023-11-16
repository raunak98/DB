import MyAccessActionTypes from './myAccess.type'

export const fetchMyAccessGroupItemsStart = (payload) => ({
  type: MyAccessActionTypes.FETCH_GROUP_ACCESS_ITEMS_START,
  payload
})

export const fetchMyAccessGroupItemsSuccess = (payload) => ({
  type: MyAccessActionTypes.FETCH_GROUP_ACCESS_ITEMS_SUCCESS,
  payload
})

export const fetchMyAccessGroupItemsFailure = (payload) => ({
  type: MyAccessActionTypes.FETCH_GROUP_ACCESS_ITEMS_FAILURE,
  payload
})

export const fetchMyAccessGroupMetadataStart = (payload) => ({
  type: MyAccessActionTypes.FETCH_GROUP_ACCESS_METADATA_START,
  payload
})

export const fetchMyAccessGroupMetadataSuccess = (payload) => ({
  type: MyAccessActionTypes.FETCH_GROUP_ACCESS_METADATA_SUCCESS,
  payload
})

export const fetchMyAccessGroupMetadataFailure = (payload) => ({
  type: MyAccessActionTypes.FETCH_GROUP_ACCESS_METADATA_FAILURE,
  payload
})

export const updateShowSmallAccessLoader = (payload) => ({
  type: MyAccessActionTypes.SHOW_SMALL_ACCESS_LOADER,
  payload
})

export const updateShowBigAccessLoader = (payload) => ({
  type: MyAccessActionTypes.SHOW_BIG_ACCESS_LOADER,
  payload
})

export const updateGroupAccessPaginationKeys = (payload) => ({
  type: MyAccessActionTypes.UPDATE_ACCESS_PAGINATION_KEYS,
  payload
})

export const updateGroupAccessIsGoingForwardFlag = (payload) => ({
  type: MyAccessActionTypes.UPDATE_ACCESS_IS_GOING_FORWARD_FLAG,
  payload
})

export const updateAccessPageSize = (payload) => ({
  type: MyAccessActionTypes.ACCESS_PAGE_SIZE,
  payload
})

export const updateAccessPageNumber = (payload) => ({
  type: MyAccessActionTypes.ACCESS_PAGE_NUMBER,
  payload
})

export const fetchMyAccessGroupSortStart = (payload) => ({
  type: MyAccessActionTypes.FETCH_GROUP_ACCESS_SORT_START,
  payload
})

export const updateMyAccessGroupSortInfoData = (payload) => ({
  type: MyAccessActionTypes.UPDATE_GROUP_ACCESS_SORT_INFO,
  payload
})

export const fetchMyAccessGroupSearchStart = (payload) => ({
  type: MyAccessActionTypes.FETCH_GROUP_ACCESS_SEARCH_START,
  payload
})
