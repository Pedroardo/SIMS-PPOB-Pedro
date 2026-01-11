import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getProfileAPI, updateProfileAPI, updateProfileImageAPI } from '../../services/api'

export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfileAPI()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch profile' })
    }
  }
)

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await updateProfileAPI(profileData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update profile' })
    }
  }
)

export const updateProfileImage = createAsyncThunk(
  'profile/updateProfileImage',
  async (imageFile, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('file', imageFile)
      const response = await updateProfileImageAPI(formData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update profile image' })
    }
  }
)

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    loading: false,
    error: null,
    updateSuccess: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload.data
        state.error = null
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch profile'
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
        state.updateSuccess = false
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload.data
        state.error = null
        state.updateSuccess = true
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to update profile'
        state.updateSuccess = false
      })
      .addCase(updateProfileImage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.loading = false
        if (state.data) {
          state.data.profile_image = action.payload.data.profile_image
        }
        state.error = null
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to update profile image'
      })
  },
})

export const { clearError, clearUpdateSuccess } = profileSlice.actions
export default profileSlice.reducer
