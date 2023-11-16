import MyAssetsActionTypes from './myAssets.type'

export const fetchMyAssetsItemsStart = (payload) => ({
  type: MyAssetsActionTypes.FETCH_MY_ASSETS_ITEMS_START,
  payload
})

export const fetchMyAssetsItemsSuccess = (payload) => ({
  type: MyAssetsActionTypes.FETCH_MY_ASSETS_ITEMS_SUCCESS,
  payload
})

export const updateMyAssetsItemsStart = (payload) => ({
  type: MyAssetsActionTypes.UPDATE_ASSETS_ITEMS,
  payload
})

export const fetchMyAssetsItemsFailure = (payload) => ({
  type: MyAssetsActionTypes.FETCH_MY_ASSETS_ITEMS_FAILURE,
  payload
})

export const fetchPersonalAssetsMetadataStart = (payload) => ({
  type: MyAssetsActionTypes.FETCH_PERSONAL_ASSETS_METADATA_START,
  payload
})

export const fetchPersonalAssetsMetadataSuccess = (payload) => ({
  type: MyAssetsActionTypes.FETCH_PERSONAL_ASSETS_METADATA_SUCCESS,
  payload
})

export const fetchPersonalAssetsMetadataFailure = (payload) => ({
  type: MyAssetsActionTypes.FETCH_PERSONAL_ASSETS_METADATA_FAILURE,
  payload
})

export const fetchNonPersonalAssetsMetadataStart = (payload) => ({
  type: MyAssetsActionTypes.FETCH_NON_PERSONAL_ASSETS_METADATA_START,
  payload
})

export const fetchNonPersonalAssetsMetadataSuccess = (payload) => ({
  type: MyAssetsActionTypes.FETCH_NON_PERSONAL_ASSETS_METADATA_SUCCESS,
  payload
})

export const fetchzNonPersonalAssetsMetadataFailure = (payload) => ({
  type: MyAssetsActionTypes.FETCH_NON_PERSONAL_ASSETS_METADATA_FAILURE,
  payload
})

export const updateShowSmallLoader = (payload) => ({
  type: MyAssetsActionTypes.SHOW_SMALL_LOADER,
  payload
})

export const updateShowBigLoader = (payload) => ({
  type: MyAssetsActionTypes.SHOW_BIG_LOADER,
  payload
})

export const updateAssetsPaginationKeys = (payload) => ({
  type: MyAssetsActionTypes.UPDATE_ASSETS_PAGINATION_KEYS,
  payload
})

export const updateAssetsIsGoingForwardFlag = (payload) => ({
  type: MyAssetsActionTypes.UPDATE_ASSETS_IS_GOING_FORWARD_FLAG,
  payload
})

export const updateAssetsPageSize = (payload) => ({
  type: MyAssetsActionTypes.ASSETS_PAGESIZE,
  payload
})

export const updateAssetsPageNumber = (payload) => ({
  type: MyAssetsActionTypes.ASSETS_PAGE_NUMBER,
  payload
})

export const updateAssetsGroupPaginationKeys = (payload) => ({
  type: MyAssetsActionTypes.UPDATE_ASSETS_GROUP_PAGINATION_KEYS,
  payload
})

export const updateAssetsGroupIsGoingForwardFlag = (payload) => ({
  type: MyAssetsActionTypes.UPDATE_ASSETS_GROUP_IS_GOING_FORWARD_FLAG,
  payload
})
export const updateAssetGroupsPageSize = (payload) => ({
  type: MyAssetsActionTypes.ASSETS_GROUP_PAGESIZE,
  payload
})
export const updateAssetsGroupPageNumber = (payload) => ({
  type: MyAssetsActionTypes.ASSETS_GROUP_PAGE_NUMBER,
  payload
})
export const fetchGroupAssetsMetadataStart = (payload) => ({
  type: MyAssetsActionTypes.FETCH_GROPUP_ASSETS_METADATA_START,
  payload
})

export const fetchGroupAssetsMetadataSuccess = (payload) => ({
  type: MyAssetsActionTypes.FETCH_GROPUP_ASSETS_METADATA_SUCCESS,
  payload
})

export const fetchzGroupAssetsMetadataFailure = (payload) => ({
  type: MyAssetsActionTypes.FETCH_GROPUP_ASSETS_METADATA_FAILURE,
  payload
})

export const fetchIndirectlyOwnedGroupAssetsMetadataStart = (payload) => ({
  type: MyAssetsActionTypes.FETCH_INDIRECTLY_OWNED_GROUP_ASSETS_METADATA_START,
  payload
})

export const fetchIndirectlyOwnedGroupAssetsMetadataSuccess = (payload) => ({
  type: MyAssetsActionTypes.FETCH_INDIRECTLY_OWNED_GROUP_ASSETS_METADATA_SUCCESS,
  payload
})

export const fetchIndirectlyOwnedGroupAssetsMetadataFailure = (payload) => ({
  type: MyAssetsActionTypes.FETCH_INDIRECTLY_OWNED_GROUP_ASSETS_METADATA_FAILURE,
  payload
})

export const fetchGroupAssetsItemsStart = (payload) => ({
  type: MyAssetsActionTypes.FETCH_GROUP_ASSETS_ITEMS_START,
  payload
})

export const fetchGroupAssetsItemsSuccess = (payload) => ({
  type: MyAssetsActionTypes.FETCH_GROUP_ASSETS_ITEMS_SUCCESS,
  payload
})

export const fetchGroupAssetsItemsFailure = (payload) => ({
  type: MyAssetsActionTypes.FETCH_GROUP_ASSETS_ITEMS_FAILURE,
  payload
})

export const fetchMyAssetsSortStart = (payload) => ({
  type: MyAssetsActionTypes.FETCH_ASSETS_SORT_START,
  payload
})

export const updateMyAssetsSortInfoData = (payload) => ({
  type: MyAssetsActionTypes.UPDATE_ASSETS_SORT_INFO,
  payload
})

export const fetchMyAssetsSearchStart = (payload) => ({
  type: MyAssetsActionTypes.FETCH_ASSETS_SEARCH_START,
  payload
})

export const fetchMyGroupAssetsSearchStart = (payload) => ({
  type: MyAssetsActionTypes.FETCH_GROUP_ASSETS_SEARCH_START,
  payload
})
export const fetchMyGroupAssetsSortStart = (payload) => ({
  type: MyAssetsActionTypes.FETCH_GROUP_ASSETS_SORT_START,
  payload
})

export const updateMyGroupAssetsSortInfoData = (payload) => ({
  type: MyAssetsActionTypes.UPDATE_GROUP_ASSETS_SORT_INFO,
  payload
})

export const fetchNarIdInfoStart = (payload) => ({
  type: MyAssetsActionTypes.FETCH_NAR_ID_START,
  payload
})

export const fetchNarIdInfoSuccess = (payload) => ({
  type: MyAssetsActionTypes.FETCH_NAR_ID_START_SUCCESS,
  payload
})

export const fetchNarIdInfoFailure = (payload) => ({
  type: MyAssetsActionTypes.FETCH_NAR_ID_START_FAILURE,
  payload
})

export const updateAssetsNarId = (payload) => ({
  type: MyAssetsActionTypes.UPDATE_ASSETS_NARID,
  payload
})

export const fetchSearchGroupAssetsItemsStart = (payload) => ({
  type: MyAssetsActionTypes.FETCH_SEARCH_GROUP_ASSETS_ITEMS_START,
  payload
})

export const fetchOwnedGroupAssetsItemsStart = (payload) => ({
  type: MyAssetsActionTypes.FETCH_OWNED_GROUP_ASSETS_ITEMS_START,
  payload
})

export const fetchOwnedGroupAssetsItemsSuccess = (payload) => ({
  type: MyAssetsActionTypes.FETCH_OWNED_GROUP_ASSETS_ITEMS_SUCCESS,
  payload
})

export const fetchOwnedGroupAssetsItemsFailure = (payload) => ({
  type: MyAssetsActionTypes.FETCH_OWNED_GROUP_ASSETS_ITEMS_FAILURE,
  payload
})

export const fetchOwnedGroupAssetsSearchStart = (payload) => ({
  type: MyAssetsActionTypes.FETCH_OWNED_GROUP_ASSETS_SEARCH_START,
  payload
})

export const fetchOwnedGroupAssetsSortStart = (payload) => ({
  type: MyAssetsActionTypes.FETCH_OWNED_GROUP_ASSETS_SORT_START,
  payload
})

export const updateOwnedGroupAssetsSortInfoData = (payload) => ({
  type: MyAssetsActionTypes.UPDATE_OWNED_GROUP_ASSETS_SORT_INFO,
  payload
})

export const updateOwnedGroupPageSize = (payload) => ({
  type: MyAssetsActionTypes.ASSETS_OWNED_GROUP_PAGESIZE,
  payload
})

export const updateOwnedGroupPageNumber = (payload) => ({
  type: MyAssetsActionTypes.ASSETS_OWNED_GROUP_PAGE_NUMBER,
  payload
})

export const fetchGroupAssetsRequestHistoryMetadataStart = (payload) => ({
  type: MyAssetsActionTypes.FETCH_GROUP_ASSETS_REQUESTHISTORY_METADATA_START,
  payload
})

export const fetchGroupAssetsRequestHistoryMetadataSuccess = (payload) => ({
  type: MyAssetsActionTypes.FETCH_GROUP_ASSETS_REQUESTHISTORY_METADATA_SUCCESS,
  payload
})

export const fetchGroupAssetsRequestHistoryMetadataFailure = (payload) => ({
  type: MyAssetsActionTypes.FETCH_GROUP_ASSETS_REQUESTHISTORY_METADATA_FAILURE,
  payload
})

export const fetchGropAssetsRequestHistoryItemsStart = (payload) => ({
  type: MyAssetsActionTypes.FETCH_GROUP_ASSETS_REQUESTHISTORY_ITEMS_START,
  payload
})

export const fetchGropAssetsRequestHistoryItemsSuccess = (payload) => ({
  type: MyAssetsActionTypes.FETCH_GROUP_ASSETS_REQUESTHISTORY_ITEMS_SUCCESS,
  payload
})

export const fetchGropAssetsRequestHistoryItemsFailure = (payload) => ({
  type: MyAssetsActionTypes.FETCH_GROUP_ASSETS_REQUESTHISTORY_ITEMS_FAILURE,
  payload
})

export const updatePageSizeAssetGroupRequestHistory = (payload) => ({
  type: MyAssetsActionTypes.ASSETS_GROUPS_REQUESTHISTORY_PAGESIZE,
  payload
})

export const updatePageNumberAssetGroupRequestHistory = (payload) => ({
  type: MyAssetsActionTypes.ASSETS_GROUPS_REQUESTHISTORY_PAGE_NUMBER,
  payload
})

export const updateAssetGrpRequestHistorySortInfoData = (payload) => ({
  type: MyAssetsActionTypes.UPDATE_GROUP_ASSETS_REQUEST_HISTORY_SORT_INFO,
  payload
})

export const fetchAssetGroupRequestHistorySortStart = (payload) => ({
  type: MyAssetsActionTypes.FETCH_GROUP_ASSETS_REQUEST_HISTORY_SORT_START,
  payload
})

export const fetchGroupAssetsRequestHistorySearchStart = (payload) => ({
  type: MyAssetsActionTypes.FETCH_GROUP_ASSETS_REQUEST_HISTORY_SEARCH_START,
  payload
})

export const fetchAccountAdminSortStart = (payload) => ({
  type: MyAssetsActionTypes.FETCH_ACCOUNT_ADMIN_SORT_START,
  payload
})

export const fetchGroupAdminSortStart = (payload) => ({
  type: MyAssetsActionTypes.FETCH_GROUP_ADMIN_SORT_START,
  payload
})

export const updateAssetsSelectedGroupName = (payload) => ({
  type: MyAssetsActionTypes.FETCH_GROUP_ASSETS_SELECTED_GROUPNAME,
  payload
})
