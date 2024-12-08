// for seller
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from "../../../utils/baseURL";  // Assuming you have this utility for the base URL

// Define the seller API
export const sellerApi = createApi({
  reducerPath: 'sellerApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${getBaseUrl()}/api/seller` }), // Update with your base URL
  tagTypes: ['Sellers'],
  endpoints: (builder) => ({
    // Fetch all sellers
    getSellers: builder.query({
      query: () => '/sellers', // Endpoint to get all sellers
      providesTags: ['Sellers'],
    }),

    // Fetch a single seller by ID
    getSellerById: builder.query({
      query: (id) => `/sellers/${id}`, // Endpoint to get a single seller
      providesTags: (result, error, id) => [{ type: 'Sellers', id }],
    }),

    // Fetch seller stats (total orders, products, earnings, etc.)
    getSellerStats: builder.query({
      query: (id) => `/stats/${id}`, // Assuming the stats are under /stats/{id}
      providesTags: (result, error, id) => [{ type: 'Sellers', id }],
    }),

    // Other seller endpoints
    logoutSeller: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),

    // Update a seller's approval status (approved/pending)
    updateSellerStatus: builder.mutation({
      query: ({ sellerId, status }) => ({
        url: `/approve-seller/${sellerId}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { sellerId }) => [
        { type: 'Sellers', id: sellerId },
      ],
    }),

    // Create a new seller
    createSeller: builder.mutation({
      query: (newSeller) => ({
        url: '/sellers',
        method: 'POST',
        body: newSeller,
      }),
      invalidatesTags: ['Sellers'],
    }),

    // Delete a seller
    deleteSeller: builder.mutation({
      query: (sellerId) => ({
        url: `/delete-seller/${sellerId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { sellerId }) => [
        { type: 'Sellers', id: sellerId },
      ],
    }),
  }),
});

export const {
  useGetSellersQuery,
  useGetSellerByIdQuery,
  useGetSellerStatsQuery,  // This is the new hook for getting seller stats
  useUpdateSellerStatusMutation,
  useCreateSellerMutation,
  useDeleteSellerMutation,
  useLogoutSellerMutation
} = sellerApi;

export default sellerApi;
