import MyAssetsActionTypes from './myAssets.type'

const INITIAL_STATE = {
  myAssetsItems: {},
  isFetching: false,
  errorMessage: undefined,
  metadata: null,
  groupMetadata: null,
  groupRequestHistorymetadata: null,
  grouprequestHistoryItems: null,
  indirectlyOwnedGroupMetadata: null,
  showSmallLoader: false,
  showBigLoader: false,
  paginationKeys: [],
  isGoingForward: true,
  pageNumber: 0,
  pageSize: 10,
  groupAssetsItems: {},
  ownedGroupAssetsItems: {},
  selectedAssetsGroupName: '',
  sortInfo: {
    sortKey: '',
    isAscending: 'asc',
    payload: {}
  },
  sortInfoGroup: {
    sortKey: '',
    isAscending: 'asc',
    payload: {}
  },
  sortInfoOwnedGroup: {
    sortKey: '',
    isAscending: 'asc',
    payload: {}
  },
  sortInfoAssetGrpReqHis: {
    sortKey: '',
    isAscending: 'asc',
    payload: {}
  },
  paginationKeysGroup: [],
  isGoingForwardGroup: true,
  pageNumberGroup: 0,
  pageSizeGroup: 10,
  narIdInfo: [],
  narId: '',
  pageNumberOwnedGroup: 0,
  pageSizeOwnedGroup: 10,
  assetGroupReqHispageNumber: 0,
  assetGroupReqHispageSize: 10
}

const myAssetsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MyAssetsActionTypes.FETCH_MY_ASSETS_ITEMS_START:
      return {
        ...state,
        isFetching: true
      }
    case MyAssetsActionTypes.FETCH_MY_ASSETS_ITEMS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        myAssetsItems: action.payload.myAssetsItems
      }
    case MyAssetsActionTypes.FETCH_ASSETS_SEARCH_START:
      return {
        ...state,
        isFetching: true
      }
    case MyAssetsActionTypes.FETCH_MY_ASSETS_ITEMS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload
      }
    case MyAssetsActionTypes.FETCH_PERSONAL_ASSETS_METADATA_START:
      return {
        ...state,
        isFetching: true
      }
    case MyAssetsActionTypes.FETCH_PERSONAL_ASSETS_METADATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        metadata: action.payload
      }
    case MyAssetsActionTypes.FETCH_PERSONAL_ASSETS_METADATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }
    case MyAssetsActionTypes.FETCH_NON_PERSONAL_ASSETS_METADATA_START:
      return {
        ...state,
        isFetching: true
      }
    case MyAssetsActionTypes.FETCH_NON_PERSONAL_ASSETS_METADATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        metadata: action.payload
      }
    case MyAssetsActionTypes.FETCH_NON_PERSONAL_ASSETS_METADATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }
    case MyAssetsActionTypes.SHOW_SMALL_LOADER:
      return {
        ...state,
        showSmallLoader: action.payload
      }
    case MyAssetsActionTypes.SHOW_BIG_LOADER:
      return {
        ...state,
        showBigLoader: action.payload,
        isFetching: action.payload
      }
    case MyAssetsActionTypes.UPDATE_ASSETS_IS_GOING_FORWARD_FLAG:
      return {
        ...state,
        isGoingForward: action.payload
      }
    case MyAssetsActionTypes.UPDATE_ASSETS_PAGINATION_KEYS:
      return {
        ...state,
        paginationKeys: action.payload
      }
    case MyAssetsActionTypes.ASSETS_PAGESIZE:
      return {
        ...state,
        pageSize: action.payload
      }
    case MyAssetsActionTypes.ASSETS_PAGE_NUMBER:
      return {
        ...state,
        pageNumber: action.payload
      }

    case MyAssetsActionTypes.UPDATE_ASSETS_GROUP_IS_GOING_FORWARD_FLAG:
      return {
        ...state,
        isGoingForwardGroup: action.payload
      }
    case MyAssetsActionTypes.UPDATE_ASSETS_GROUP_PAGINATION_KEYS:
      return {
        ...state,
        paginationKeysGroup: action.payload
      }
    case MyAssetsActionTypes.ASSETS_GROUP_PAGESIZE:
      return {
        ...state,
        pageSizeGroup: action.payload
      }
    case MyAssetsActionTypes.ASSETS_GROUP_PAGE_NUMBER:
      return {
        ...state,
        pageNumberGroup: action.payload
      }
    case MyAssetsActionTypes.FETCH_GROPUP_ASSETS_METADATA_START:
      return {
        ...state,
        isFetching: true
      }
    case MyAssetsActionTypes.FETCH_GROPUP_ASSETS_METADATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        groupMetadata: action.payload
      }
    case MyAssetsActionTypes.FETCH_GROPUP_ASSETS_METADATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }
    case MyAssetsActionTypes.FETCH_INDIRECTLY_OWNED_GROUP_ASSETS_METADATA_START:
      return {
        ...state,
        isFetching: true
      }
    case MyAssetsActionTypes.FETCH_INDIRECTLY_OWNED_GROUP_ASSETS_METADATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        indirectlyOwnedGroupMetadata: action.payload
      }
    case MyAssetsActionTypes.FETCH_INDIRECTLY_OWNED_GROUP_ASSETS_METADATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }
    case MyAssetsActionTypes.FETCH_GROUP_ASSETS_ITEMS_START:
      return {
        ...state,
        isFetching: true
      }
    case MyAssetsActionTypes.FETCH_GROUP_ASSETS_ITEMS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        groupAssetsItems: action.payload.groupAssetsItems
      }
    case MyAssetsActionTypes.FETCH_GROUP_ASSETS_ITEMS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload
      }
    case MyAssetsActionTypes.FETCH_ASSETS_SORT_START:
      return {
        ...state,
        isFetching: true
      }

    case MyAssetsActionTypes.FETCH_ACCOUNT_ADMIN_SORT_START:
      return {
        ...state,
        isFetching: true
      }

    case MyAssetsActionTypes.UPDATE_ASSETS_SORT_INFO:
      return {
        ...state,
        sortInfo: action.payload
      }
    case MyAssetsActionTypes.FETCH_GROUP_ASSETS_SORT_START:
      return {
        ...state,
        isFetching: true
      }
    case MyAssetsActionTypes.FETCH_GROUP_ADMIN_SORT_START:
      return {
        ...state,
        isFetching: true
      }
    case MyAssetsActionTypes.UPDATE_GROUP_ASSETS_SORT_INFO: {
      return {
        ...state,
        sortInfoGroup: action.payload
      }
    }
    case MyAssetsActionTypes.FETCH_GROUP_ASSETS_SEARCH_START:
      return {
        ...state,
        isFetching: true
      }
    case MyAssetsActionTypes.FETCH_NAR_ID_START_SUCCESS:
      return {
        ...state,
        narIdInfo: action.payload
      }
    case MyAssetsActionTypes.FETCH_NAR_ID_START_FAILURE: {
      return {
        ...state,
        narIdInfo: action.payload
      }
    }
    case MyAssetsActionTypes.UPDATE_ASSETS_NARID: {
      return {
        ...state,
        narId: action.payload
      }
    }

    case MyAssetsActionTypes.FETCH_SEARCH_GROUP_ASSETS_ITEMS_START:
      return {
        ...state,
        isFetching: true
      }

    case MyAssetsActionTypes.UPDATE_ASSETS_ITEMS:
      return {
        ...state,
        isFetching: false,
        myAssetsItems: action.payload.myAssetsItems
      }
    case MyAssetsActionTypes.ASSETS_OWNED_GROUP_PAGE_NUMBER:
      return {
        ...state,
        pageNumberOwnedGroup: action.payload
      }
    case MyAssetsActionTypes.ASSETS_OWNED_GROUP_PAGESIZE:
      return {
        ...state,
        pageSizeOwnedGroup: action.payload
      }
    case MyAssetsActionTypes.FETCH_OWNED_GROUP_ASSETS_ITEMS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ownedGroupAssetsItems: action.payload.ownedGroupAssetsItems
      }
    case MyAssetsActionTypes.FETCH_GROUP_ASSETS_REQUESTHISTORY_METADATA_START:
      return {
        ...state,
        isFetching: true
      }
    case MyAssetsActionTypes.FETCH_GROUP_ASSETS_REQUESTHISTORY_METADATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        groupRequestHistorymetadata: action.payload
      }
    case MyAssetsActionTypes.FETCH_GROUP_ASSETS_REQUESTHISTORY_METADATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }
    case MyAssetsActionTypes.FETCH_GROUP_ASSETS_REQUESTHISTORY_DATA_START:
      return {
        ...state,
        isFetching: true
      }
    case MyAssetsActionTypes.FETCH_GROUP_ASSETS_REQUESTHISTORY_ITEMS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        grouprequestHistoryItems: action.payload
      }
    case MyAssetsActionTypes.FETCH_GROUP_ASSETS_REQUESTHISTORY_ITEMS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }
    case MyAssetsActionTypes.ASSETS_GROUPS_REQUESTHISTORY_PAGESIZE:
      return {
        ...state,
        assetGroupReqHispageSize: action.payload
      }
    case MyAssetsActionTypes.ASSETS_GROUPS_REQUESTHISTORY_PAGE_NUMBER:
      return {
        ...state,
        assetGroupReqHispageNumber: action.payload
      }
    case MyAssetsActionTypes.UPDATE_GROUP_ASSETS_REQUEST_HISTORY_SORT_INFO:
      return {
        ...state,
        sortInfoAssetGrpReqHis: action.payload
      }
    case MyAssetsActionTypes.FETCH_GROUP_ASSETS_SELECTED_GROUPNAME:
      return {
        ...state,
        selectedAssetsGroupName: action.payload
      }
    default:
      return state
  }
}

export default myAssetsReducer
