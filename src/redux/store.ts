// src/redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from './slices/authSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import categoryReducer from './slices/categorySlice';
import themeReducer from './slices/themeSlice';

//  Persist Configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'theme'], //  Only these will be persisted
  blacklist: ['subscription', 'category'], //  Don't persist these
};

//  Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  subscription: subscriptionReducer,
  category: categoryReducer,
  theme: themeReducer,
});

//  Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

//  Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register'],
      },
    }),
  devTools: __DEV__,
});

//  Persistor for redux-persist
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;