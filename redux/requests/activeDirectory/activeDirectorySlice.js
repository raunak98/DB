import { createSlice } from '@reduxjs/toolkit'

export const activeDirectorySlice = createSlice({
  name: 'ActiveDirectory',
  initialState: {
    adAccount: [],
    adAccountSummary: [],
    accountCategory: [],
    adGroup: [],
    adGroupSummary: []
  },
  reducers: {
    saveAdAccount: (state, action) => {
      const updatedObj = state.adAccount.map((dataProp) => {
        if (dataProp.id === action.payload.id) {
          return { ...dataProp, value: action.payload.value }
        }
        return dataProp
      })
      const summaryObj = state.adAccountSummary.map((dataProp) => {
        if (dataProp.id === action.payload.id) {
          return { ...dataProp, value: action.payload.value }
        }
        return dataProp
      })

      return { ...state, adAccount: updatedObj, adAccountSummary: summaryObj }
    },
    setSummaryInitialState: (state, action) => ({
      // returning a copy of orignal state
      ...state, // copying the original state
      adAccountSummary: action.payload.data // new todos array
    }),
    setadAccountInitialState: (state, action) => ({
      // returning a copy of orignal state
      ...state, // copying the original state
      adAccount: action.payload.data // new todos array
    }),
    setAccountCategory: (state, action) => ({
      ...state,
      accountCategory: action.payload.data
    }),
    saveADGroup: (state, action) => {
      const updatedObj = state.adGroup.map((dataProp) => {
        if (dataProp.id === action.payload.id) {
          return { ...dataProp, value: action.payload.value }
        }
        return dataProp
      })
      const summaryObj = state.adGroupSummary.map((dataProp) => {
        if (dataProp.id === action.payload.id) {
          return { ...dataProp, value: action.payload.value }
        }
        return dataProp
      })

      return { ...state, adGroup: updatedObj, adGroupSummary: summaryObj }
    },
    setAdGroupSummaryInitialState: (state, action) => ({
      // returning a copy of orignal state
      ...state, // copying the original state
      adGroupSummary: action.payload.data // new todos array
    }),
    setadAdGroupInitialState: (state, action) => ({
      // returning a copy of orignal state
      ...state, // copying the original state
      adGroup: action.payload.data // new todos array
    })
  }
})

export const {
  saveAdAccount,
  setSummaryInitialState,
  setadAccountInitialState,
  saveADGroup,
  setAccountCategory,
  setAdGroupSummaryInitialState,
  setadAdGroupInitialState
} = activeDirectorySlice.actions
export default activeDirectorySlice.reducer
