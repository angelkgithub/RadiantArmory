import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = 'https://valorant-api.com/v1';

export const valorantApi = createApi({
  reducerPath: 'valorantApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),

  endpoints: (builder) => ({
    // Agents
    getAllAgents: builder.query({
      query: () => '/agents?isPlayable=true',
      transformResponse: (response) => response.data || [],
    }),
    getAgentById: builder.query({
      query: (uuid) => `/agents/${uuid}`,
      transformResponse: (response) => response.data,
    }),

    // Weapons
    getAllWeapons: builder.query({
      query: () => '/weapons',
      transformResponse: (response) => response.data || [],
    }),
    getWeaponById: builder.query({
      query: (uuid) => `/weapons/${uuid}`,
      transformResponse: (response) => response.data,
    }),

    // Maps
    getAllMaps: builder.query({
      query: () => '/maps',
      transformResponse: (response) => response.data || [],
    }),
    getMapById: builder.query({
      query: (uuid) => `/maps/${uuid}`,
      transformResponse: (response) => response.data,
    }),

    // Cosmetics/Skins
    getWeaponSkins: builder.query({
      query: () => `/weapons/skins`,
      transformResponse: (response) => {
        return (response.data || []).filter(skin => skin.displayName);
      },
    }),

    // Bundles
    getBundles: builder.query({
      query: () => '/bundles',
      transformResponse: (response) => response.data || [],
    }),

    // Sprays
    getSprays: builder.query({
      query: () => '/sprays',
      transformResponse: (response) => response.data || [],
    }),

    // Player Cards
    getPlayerCards: builder.query({
      query: () => '/playercards',
      transformResponse: (response) => response.data || [],
    }),
  }),
});

export const {
  useGetAllAgentsQuery,
  useGetAgentByIdQuery,
  useGetAllWeaponsQuery,
  useGetWeaponByIdQuery,
  useGetAllMapsQuery,
  useGetMapByIdQuery,
  useGetWeaponSkinsQuery,
  useGetBundlesQuery,
  useGetSpraysQuery,
  useGetPlayerCardsQuery,
} = valorantApi;
