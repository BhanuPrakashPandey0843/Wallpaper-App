import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Story {
  id: string;
  title: string;
  image: string;
}

interface Reel {
  id: string;
  title: string;
  image: string;
}

export const storiesApi = createApi({
  reducerPath: 'storiesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }), // Base URL is not used for mock data
  endpoints: (builder) => ({
    getProphetStories: builder.query<Story[], void>({
      queryFn: () => {
        // Mock data for prophet stories
        const data: Story[] = [
          {
            id: 'p1',
            title: 'Prophet Yunus (AS) & The Whale',
            image: require('../../../assets/caroselfour.png'),
          },
          {
            id: 'p2',
            title: 'Prophet Yusuf (AS) in Egypt',
            image: require('../../../assets/caroselfive.png'),
          },
          {
            id: 'p3',
            title: 'Prophet Stories III',
            image: require('../../../assets/caroselsix.png'),
          },
          {
            id: 'p4',
            title: 'Prophet Stories IV',
            image: require('../../../assets/caroseltwo.png'),
          },
        ];
        return { data };
      },
    }),
    getProphetReels: builder.query<Reel[], void>({
      queryFn: () => {
        // Mock data for prophet reels
        const data: Reel[] = [
          {
            id: 'r1',
            title: 'Daily Verse',
            image: require('../../../assets/Post de Instagram Versículo de la Biblia  Minimalista Beige.png'),
          },
          {
            id: 'r2',
            title: 'Prophet Stories',
            image: require('../../../assets/reelo.png'),
          },
          {
            id: 'r3',
            title: 'Wisdom',
            image: require('../../../assets/tempa.png'),
          },
          {
            id: 'r4',
            title: 'Knowledge',
            image: require('../../../assets/ooks.png'),
          },
        ];
        return { data };
      },
    }),
  }),
});

export const { useGetProphetStoriesQuery, useGetProphetReelsQuery } = storiesApi;
