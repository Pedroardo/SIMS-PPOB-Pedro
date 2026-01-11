import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createTransactionAPI, getTransactionHistoryAPI } from '../../services/api'

export const createTransaction = createAsyncThunk(
  'transaction/createTransaction',
  async (serviceCode, { rejectWithValue }) => {
    try {
      const response = await createTransactionAPI(serviceCode)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Transaction failed' })
    }
  }
)

export const getTransactionHistory = createAsyncThunk(
  'transaction/getTransactionHistory',
  async ({ offset = 0, limit = 5 }, { rejectWithValue }) => {
    try {
      const response = await getTransactionHistoryAPI(offset, limit)
      return { ...response.data, offset, limit }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch transaction history' })
    }
  }
)

const transactionSlice = createSlice({
  name: 'transaction',
  initialState: {
    history: [],
    loading: false,
    error: null,
    transactionSuccess: false,
    hasMore: true,
    offset: 0,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearTransactionSuccess: (state) => {
      state.transactionSuccess = false
    },
    resetHistory: (state) => {
      state.history = []
      state.offset = 0
      state.hasMore = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTransaction.pending, (state) => {
        state.loading = true
        state.error = null
        state.transactionSuccess = false
      })
      .addCase(createTransaction.fulfilled, (state) => {
        state.loading = false
        state.error = null
        state.transactionSuccess = true
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Transaction failed'
        state.transactionSuccess = false
      })
      .addCase(getTransactionHistory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getTransactionHistory.fulfilled, (state, action) => {
        state.loading = false
        const newRecords = action.payload.data.records
        
        if (action.payload.offset === 0) {
          state.history = newRecords
        } else {
          state.history = [...state.history, ...newRecords]
        }
        
        state.offset = action.payload.offset + action.payload.limit
        state.hasMore = newRecords.length === action.payload.limit
        state.error = null
      })
      .addCase(getTransactionHistory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch transaction history'
      })
  },
})

export const { clearError, clearTransactionSuccess, resetHistory } = transactionSlice.actions
export default transactionSlice.reducer
