import ReviewsActionTypes from './reviews.type'

const INITIAL_STATE = {
  reviewsItems: null,
  metadata: null,
  isFetching: false,
  errorMessages: [],
  pageNumber: 0,
  pageSize: 10,
  sortData: {
    sortBy: '',
    sortDesc: false,
    payload: {}
  }
}

const reviewsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // Reviews actions
    case ReviewsActionTypes.FETCH_REVIEWS_ITEMS_START:
      return {
        ...state,
        isFetching: true
      }
    case ReviewsActionTypes.FETCH_REVIEWS_ITEMS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        reviewsItems: action.payload
      }
    case ReviewsActionTypes.FETCH_REVIEWS_ITEMS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }

    // Reviews Search
    case ReviewsActionTypes.FETCH_REVIEWS_SEARCH_START:
      return {
        ...state,
        isFetching: true
      }
    case ReviewsActionTypes.FETCH_REVIEWS_SEARCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        reviewsItems: action.payload
      }
    case ReviewsActionTypes.FETCH_REVIEWS_SEARCH_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }
    case ReviewsActionTypes.FETCH_REVIEWS_SORT_START:
      return {
        ...state,
        isFetching: true
      }
    case ReviewsActionTypes.UPDATE_SORT_DATA:
      return {
        ...state,
        sortData: action.payload
      }

    // Reviews metadata
    case ReviewsActionTypes.FETCH_REVIEWS_METADATA_START:
      return {
        ...state,
        isFetching: true
      }
    case ReviewsActionTypes.FETCH_REVIEWS_METADATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        metadata: action.payload
      }
    case ReviewsActionTypes.FETCH_REVIEWS_METADATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessages: [...state.errorMessages, action.payload]
      }
    case ReviewsActionTypes.REVIEWS_PAGESIZE:
      return {
        ...state,
        pageSize: action.payload
      }
    case ReviewsActionTypes.REVIEWS_PAGE_NUMBER:
      return {
        ...state,
        pageNumber: action.payload
      }
    default:
      return state
  }
}

export default reviewsReducer
