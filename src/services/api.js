import axios from 'axios'

const API_BASE_URL = 'https://take-home-test-api.nutech-integrasi.com'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const state = localStorage.getItem('persist:root')
    if (state) {
      const parsedState = JSON.parse(state)
      const auth = JSON.parse(parsedState.auth)
      if (auth.token) {
        config.headers.Authorization = `Bearer ${auth.token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Auth APIs
export const registerAPI = (userData) => {
  return api.post('/registration', userData)
}

export const loginAPI = (credentials) => {
  return api.post('/login', credentials)
}

// Profile APIs
export const getProfileAPI = () => {
  return api.get('/profile')
}

export const updateProfileAPI = (profileData) => {
  return api.put('/profile/update', profileData)
}

export const updateProfileImageAPI = (formData) => {
  return api.put('/profile/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// Balance APIs
export const getBalanceAPI = () => {
  return api.get('/balance')
}

export const topUpAPI = (amount) => {
  return api.post('/topup', { top_up_amount: amount })
}

// Service APIs
export const getServicesAPI = () => {
  return api.get('/services')
}

// Transaction APIs
export const createTransactionAPI = (serviceCode) => {
  return api.post('/transaction', { service_code: serviceCode })
}

export const getTransactionHistoryAPI = (offset = 0, limit = 5) => {
  return api.get('/transaction/history', {
    params: { offset, limit },
  })
}

// Banner APIs
export const getBannersAPI = () => {
  return api.get('/banner')
}

export default api
