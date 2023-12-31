const MyAssetsActionTypes = {
  // Fetching Items
  FETCH_MY_ASSETS_ITEMS_START: 'FETCH_MY_ASSETS_ITEMS_START',
  FETCH_MY_ASSETS_ITEMS_SUCCESS: 'FETCH_MY_ASSETS_ITEMS_SUCCESS',
  FETCH_MY_ASSETS_ITEMS_FAILURE: 'FETCH_MY_ASSETS_ITEMS_FAILURE',

  // Fetching personal asset metadata
  FETCH_PERSONAL_ASSETS_METADATA_START: 'FETCH_PERSONAL_ASSETS_METADATA_START',
  FETCH_PERSONAL_ASSETS_METADATA_SUCCESS: 'FETCH_PERSONAL_ASSETS_METADATA_SUCCESS',
  FETCH_PERSONAL_ASSETS_METADATA_FAILURE: 'FETCH_PERSONAL_ASSETS_METADATA_FAILURE',

  // Fetching -non personal asset metadata
  FETCH_NON_PERSONAL_ASSETS_METADATA_START: 'FETCH_NON_PERSONAL_ASSETS_METADATA_START',
  FETCH_NON_PERSONAL_ASSETS_METADATA_SUCCESS: 'FETCH_NON_PERSONAL_ASSETS_METADATA_SUCCESS',
  FETCH_NON_PERSONAL_ASSETS_METADATA_FAILURE: 'FETCH_NON_PERSONAL_ASSETS_METADATA_FAILURE',

  SHOW_SMALL_LOADER: 'SHOW_SMALL_LOADER',
  SHOW_BIG_LOADER: 'SHOW_BIG_LOADER',

  UPDATE_ASSETS_IS_GOING_FORWARD_FLAG: 'UPDATE_ASSETS_IS_GOING_FORWARD_FLAG',
  UPDATE_ASSETS_PAGINATION_KEYS: 'UPDATE_ASSETS_PAGINATION_KEYS',

  ASSETS_PAGESIZE: 'ASSETS_PAGESIZE',
  ASSETS_PAGE_NUMBER: 'ASSETS_PAGE_NUMBER',

  UPDATE_ASSETS_GROUP_IS_GOING_FORWARD_FLAG: 'UPDATE_ASSETS_GROUP_IS_GOING_FORWARD_FLAG',
  UPDATE_ASSETS_GROUP_PAGINATION_KEYS: 'UPDATE_ASSETS_GROUP_PAGINATION_KEYS',
  ASSETS_GROUP_PAGESIZE: 'ASSETS_GROUP_PAGESIZE',
  ASSETS_GROUP_PAGE_NUMBER: 'ASSETS_GROUP_PAGE_NUMBER',

  // Fetching -group asset metadata
  FETCH_GROPUP_ASSETS_METADATA_START: 'FETCH_GROPUP_ASSETS_METADATA_START',
  FETCH_GROPUP_ASSETS_METADATA_SUCCESS: 'FETCH_GROPUP_ASSETS_METADATA_SUCCESS',
  FETCH_GROPUP_ASSETS_METADATA_FAILURE: 'FETCH_GROPUP_ASSETS_METADATA_FAILURE',

  // Fetching Myasset group Request History meta
  FETCH_GROUP_ASSETS_REQUESTHISTORY_METADATA_START:
    'FETCH_GROUP_ASSETS_REQUESTHISTORY_ASSETS_METADATA_START',
  FETCH_GROUP_ASSETS_REQUESTHISTORY_METADATA_SUCCESS:
    'FETCH_GROUP_ASSETS_REQUESTHISTORY_ASSETS_METADATA_SUCCESS',
  FETCH_GROUP_ASSETS_REQUESTHISTORY_METADATA_FAILURE:
    'FETCH_GROUP_ASSETS_REQUESTHISTORY_ASSETS_METADATA_FAILURE',

  // fetching my asset group request history items
  FETCH_GROUP_ASSETS_REQUESTHISTORY_ITEMS_START: 'FETCH_GROUP_ASSETS_REQUESTHISTORY_DATA_START',
  FETCH_GROUP_ASSETS_REQUESTHISTORY_ITEMS_SUCCESS:
    'FETCH_GROUP_ASSETS_REQUESTHISTORY_ITEMS_SUCCESS',
  FETCH_GROUP_ASSETS_REQUESTHISTORY_ITEMS_FAILURE:
    'FETCH_GROUP_ASSETS_REQUESTHISTORY_ITEMS_FAILURE',

  ASSETS_GROUPS_REQUESTHISTORY_PAGESIZE: 'ASSETS_GROUPS_REQUESTHISTORY_PAGESIZE',
  ASSETS_GROUPS_REQUESTHISTORY_PAGE_NUMBER: 'ASSETS_GROUPS_REQUESTHISTORY_PAGE_NUMBER',

  FETCH_GROUP_ASSETS_REQUEST_HISTORY_SORT_START: 'FETCH_GROUP_ASSETS_REQUEST_HISTORY_SORT_START',
  FETCH_GROUP_ASSETS_REQUEST_HISTORY_SORT_SUCCESS:
    'FETCH_GROUP_ASSETS_REQUEST_HISTORY_SORT_SUCCESS',
  FETCH_GROUP_ASSETS_REQUEST_HISTORY_SORT_FAILURE:
    'FETCH_GROUP_ASSETS_REQUEST_HISTORY_SORT_FAILURE',
  UPDATE_GROUP_ASSETS_REQUEST_HISTORY_SORT_INFO: 'UPDATE_GROUP_ASSETS_REQUEST_HISTORY_SORT_INFO',

  FETCH_GROUP_ASSETS_REQUEST_HISTORY_SEARCH_START:
    'FETCH_GROUP_ASSETS_REQUEST_HISTORY_SEARCH_START',
  FETCH_GROUP_ASSETS_SELECTED_GROUPNAME: 'FETCH_GROUP_ASSETS_SELECTED_GROUPNAME',

  // Fetching Items
  FETCH_GROUP_ASSETS_ITEMS_START: 'FETCH_GROUP_ASSETS_ITEMS_START',
  FETCH_GROUP_ASSETS_ITEMS_SUCCESS: 'FETCH_GROUP_ASSETS_ITEMS_SUCCESS',
  FETCH_GROUP_ASSETS_ITEMS_FAILURE: 'FETCH_GROUP_ASSETS_ITEMS_FAILURE',

  FETCH_ASSETS_SORT_START: 'FETCH_ASSETS_SORT_START',
  FETCH_ASSETS_SORT_SUCCESS: 'FETCH_ASSETS_SORT_SUCCESS',
  FETCH_ASSETS_SORT_FAILURE: 'FETCH_ASSETS_SORT_FAILURE',
  UPDATE_ASSETS_SORT_INFO: 'UPDATE_ASSETS_SORT_INFO',

  FETCH_GROUP_ASSETS_SORT_START: 'FETCH_GROUP_ASSETS_SORT_START',
  UPDATE_GROUP_ASSETS_SORT_INFO: 'UPDATE_GROUP_ASSETS_SORT_INFO',
  FETCH_ASSETS_SEARCH_START: 'FETCH_ASSETS_SEARCH_START',
  FETCH_GROUP_ASSETS_SEARCH_START: 'FETCH_GROUP_ASSETS_SEARCH_START',

  FETCH_NAR_ID_START: 'FETCH_NAR_ID_START',
  FETCH_NAR_ID_START_SUCCESS: 'FETCH_NAR_ID_START_SUCCESS',
  FETCH_NAR_ID_START_FAILURE: 'FETCH_NAR_ID_START_FAILURE',

  UPDATE_ASSETS_NARID: 'UPDATE_ASSETS_NARID',

  // Fetching search group assets data
  FETCH_SEARCH_GROUP_ASSETS_ITEMS_START: 'FETCH_SEARCH_GROUP_ASSETS_ITEMS_START',
  UPDATE_ASSETS_ITEMS: 'UPDATE_ASSETS_ITEMS',

  // Individualy Owned group
  FETCH_INDIRECTLY_OWNED_GROUP_ASSETS_METADATA_START:
    'FETCH_INDIRECTLY_OWNED_GROUP_ASSETS_METADATA_START',
  FETCH_INDIRECTLY_OWNED_GROUP_ASSETS_METADATA_SUCCESS:
    'FETCH_INDIRECTLY_OWNED_GROUP_ASSETS_METADATA_SUCCESS',
  FETCH_INDIRECTLY_OWNED_GROUP_ASSETS_METADATA_FAILURE:
    'FETCH_INDIRECTLY_OWNED_GROUP_ASSETS_METADATA_FAILURE',
  ASSETS_OWNED_GROUP_PAGESIZE: 'ASSETS_OWNED_GROUP_PAGESIZE',
  ASSETS_OWNED_GROUP_PAGE_NUMBER: 'ASSETS_OWNED_GROUP_PAGE_NUMBER',

  FETCH_OWNED_GROUP_ASSETS_ITEMS_START: 'FETCH_OWNED_GROUP_ASSETS_ITEMS_START',
  FETCH_OWNED_GROUP_ASSETS_ITEMS_SUCCESS: 'FETCH_OWNED_GROUP_ASSETS_ITEMS_SUCCESS',
  FETCH_OWNED_GROUP_ASSETS_ITEMS_FAILURE: 'FETCH_OWNED_GROUP_ASSETS_ITEMS_FAILURE',

  FETCH_OWNED_GROUP_ASSETS_SORT_START: 'FETCH_OWNED_GROUP_ASSETS_SORT_START',
  UPDATE_OWNED_GROUP_ASSETS_SORT_INFO: 'UPDATE_OWNED_GROUP_ASSETS_SORT_INFO',
  FETCH_OWNED_GROUP_ASSETS_SEARCH_START: 'FETCH_OWNED_GROUP_ASSETS_SEARCH_START',

  FETCH_ACCOUNT_ADMIN_SORT_START: 'FETCH_ACCOUNT_ADMIN_SORT_START',
  FETCH_GROUP_ADMIN_SORT_START: 'FETCH_GROUP_ADMIN_SORT_START'
}
export default MyAssetsActionTypes
