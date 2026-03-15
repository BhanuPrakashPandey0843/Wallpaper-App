import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../services/apiClient';
import type { Wallpaper } from '../../features/wallpapers/types';

export const wallpapersApi = createApi({
  reducerPath: 'wallpapersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
  }),
  tagTypes: ['Wallpapers'],
  refetchOnFocus: true,
  endpoints: (builder) => ({
    getWallpapers: builder.query<Wallpaper[], { page: number }>({
      query: ({ page }) => `/wallpapers?page=${page}`,
      keepUnusedDataFor: 300,
      providesTags: (result) =>
        result
          ? [
              ...result.map((w) => ({ type: 'Wallpapers' as const, id: w.id })),
              { type: 'Wallpapers', id: 'LIST' },
            ]
          : [{ type: 'Wallpapers', id: 'LIST' }],
    }),
  }),
});

export const { useGetWallpapersQuery } = wallpapersApi;
