import ServiceDeskAdminActionTypes from './serviceDeskAdmin.type'

export const fetchServiceDeskAdminItemsStart = (payload) => ({
  type: ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_ITEMS_START,
  payload
})

export const fetchServiceDeskAdminItemsSuccess = (payload) => ({
  type: ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_ITEMS_SUCCESS,
  payload
})

export const fetchServiceDeskAdminItemsFailure = (payload) => ({
  type: ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_ITEMS_FAILURE,
  payload
})

export const fetchServiceDeskAdminSearchStart = (payload) => ({
  type: ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_SEARCH_START,
  payload
})

export const fetchServiceDeskAdminSearchSuccess = (payload) => ({
  type: ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_SEARCH_SUCCESS,
  payload
})

export const fetchServiceDeskAdminSearchFailure = (payload) => ({
  type: ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_SEARCH_FAILURE,
  payload
})
export const fetchServiceDeskAdminMetadataStart = () => ({
  type: ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_METADATA_START
})

export const fetchServiceDeskAdminMetadataSuccess = (payload) => ({
  type: ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_METADATA_SUCCESS,
  payload
})

export const fetchServiceDeskAdminMetadataFailure = (payload) => ({
  type: ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_METADATA_FAILURE,
  payload
})

export const updatePageSizeServiceDeskAdmin = (payload) => ({
  type: ServiceDeskAdminActionTypes.SERVICEDESKADMIN_PAGESIZE,
  payload
})

export const updatePageNumberServiceDeskAdmin = (payload) => ({
  type: ServiceDeskAdminActionTypes.SERVICEDESKADMIN_PAGE_NUMBER,
  payload
})

export const updateShowBigLoader = (payload) => ({
  type: ServiceDeskAdminActionTypes.SHOW_BIG_LOADER,
  payload
})

export const fetchPaginationKeys = (payload) => ({
  type: ServiceDeskAdminActionTypes.FETCH_PAGINARION_KEYS,
  payload
})

export const updateSDadminPaginationKeys = (payload) => ({
  type: ServiceDeskAdminActionTypes.UPDATE_PAGINATION_KEYS,
  payload
})

export const fetchIsGoingForwardFlag = (payload) => ({
  type: ServiceDeskAdminActionTypes.FETCH_IS_GOING_FORWARD_FLAG,
  payload
})

export const updateIsSDadminGoingForwardFlag = (payload) => ({
  type: ServiceDeskAdminActionTypes.UPDATE_IS_GOING_FORWARD_FLAG,
  payload
})

export const fetchServiceDeskAdminSortStart = (payload) => ({
  type: ServiceDeskAdminActionTypes.FETCH_SERVICE_DESK_ADMIN_SORT_START,
  payload
})

export const updateServiceDeskAdminSortInfoData = (payload) => ({
  type: ServiceDeskAdminActionTypes.UPDATE_SERVICE_DESK_ADMIN_SORT_INFO,
  payload
})

export const fetchServiceDeskAdminItemsByUserStart = (payload) => ({
  type: ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_ITEMS_BY_USER_START,
  payload
})

export const fetchServiceDeskAdminSortByUserStart = (payload) => ({
  type: ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_SORT_BY_USER_START,
  payload
})

export const fetchServiceDeskAdminSearchByUserStart = (payload) => ({
  type: ServiceDeskAdminActionTypes.FETCH_SERVICEDESKADMIN_SEARCH_BY_USER_START,
  payload
})
