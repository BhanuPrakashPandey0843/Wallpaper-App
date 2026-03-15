import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../services/apiClient';

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  role: 'guest' | 'free' | 'premium' | 'admin';
  premium?: boolean;
}

export interface UserCoins {
  userId: string;
  coins: number;
  multiplier?: number;
  updatedAt?: string;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
  }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, void>({
      query: () => `/user/profile`,
      keepUnusedDataFor: 300,
    }),
    getUserCoins: builder.query<UserCoins, void>({
      query: () => `/user/coins`,
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useGetUserProfileQuery, useGetUserCoinsQuery } = userApi;
