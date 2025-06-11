// store.ts (Updated with your existing store)
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import fetchReducer from './slices/fetchslice'; // Add this import

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    fetch: fetchReducer, // Add this line
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Firebase User object serialization warnings
        ignoredActions: ['auth/setUser'],
        ignoredPaths: ['auth.currentUser'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;