import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import postsReducer from './postsSlice';
import categoriesReducer from './categoriesSlice';
import carsReducer from './carsSlice';

// Konfiguracja głównego store Redux
export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    categories: categoriesReducer,
    cars: carsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorowanie akcji które nie są serializowalne
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
