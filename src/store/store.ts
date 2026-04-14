import { configureStore } from '@reduxjs/toolkit';
import { wallpapersApi } from './api/wallpapersApi';
import { userApi } from '../features/user/userApi';
import { storiesApi } from './api/storiesApi';
import { userReducer } from '../features/user/userSlice';
import { authReducer } from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    [wallpapersApi.reducerPath]: wallpapersApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [storiesApi.reducerPath]: storiesApi.reducer,
    user: userReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(wallpapersApi.middleware, userApi.middleware, storiesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
