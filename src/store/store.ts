import { configureStore } from '@reduxjs/toolkit';
import { wallpapersApi } from './api/wallpapersApi';
import { userApi } from '../features/user/userApi';
import { userReducer } from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    [wallpapersApi.reducerPath]: wallpapersApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(wallpapersApi.middleware, userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
