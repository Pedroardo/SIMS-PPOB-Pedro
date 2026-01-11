import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'
import authReducer from './slices/authSlice'
import profileReducer from './slices/profileSlice'
import balanceReducer from './slices/balanceSlice'
import serviceReducer from './slices/serviceSlice'
import transactionReducer from './slices/transactionSlice'
import bannerReducer from './slices/bannerSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth']
}

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  balance: balanceReducer,
  service: serviceReducer,
  transaction: transactionReducer,
  banner: bannerReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)
