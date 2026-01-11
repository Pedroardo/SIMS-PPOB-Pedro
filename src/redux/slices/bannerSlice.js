import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getBannersAPI } from '../../services/api'

export const getBanners = createAsyncThunk(
  'banner/getBanners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBannersAPI()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch banners' })
    }
  }
)

const bannerSlice = createSlice({
  name: 'banner',
  initialState: {
    banners: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBanners.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getBanners.fulfilled, (state, action) => {
        state.loading = false
        state.banners = action.payload.data
        state.error = null
      })
      .addCase(getBanners.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch banners'
      })
  },
})

export const { clearError } = bannerSlice.actions
export default bannerSlice.reducer
