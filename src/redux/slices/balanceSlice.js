import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getBalanceAPI, topUpAPI } from '../../services/api'

export const getBalance = createAsyncThunk(
  'balance/getBalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBalanceAPI()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch balance' })
    }
  }
)

export const topUp = createAsyncThunk(
  'balance/topUp',
  async (amount, { rejectWithValue }) => {
    try {
      const response = await topUpAPI(amount)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Top up failed' })
    }
  }
)

const balanceSlice = createSlice({
  name: 'balance',
  initialState: {
    balance: 0,
    loading: false,
    error: null,
    topUpSuccess: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearTopUpSuccess: (state) => {
      state.topUpSuccess = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBalance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getBalance.fulfilled, (state, action) => {
        state.loading = false
        state.balance = action.payload.data.balance
        state.error = null
      })
      .addCase(getBalance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch balance'
      })
      .addCase(topUp.pending, (state) => {
        state.loading = true
        state.error = null
        state.topUpSuccess = false
      })
      .addCase(topUp.fulfilled, (state, action) => {
        state.loading = false
        state.balance = action.payload.data.balance
        state.error = null
        state.topUpSuccess = true
      })
      .addCase(topUp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Top up failed'
        state.topUpSuccess = false
      })
  },
})

export const { clearError, clearTopUpSuccess } = balanceSlice.actions
export default balanceSlice.reducer
