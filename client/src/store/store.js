import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import logger from 'redux-logger'

import { authSlice } from './slice/auth/authSlice'

const rootReducer = combineReducers({
  authStore: authSlice.reducer,
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['authStore'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const isDev = import.meta.env.DEV

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: false,
    })

    if (isDev) {
      middleware.push(logger)
    }

    return middleware
  },

  devTools: isDev,
})

export const persistor = persistStore(store)
