//for admin
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const discountPromotionApi = createApi({
  reducerPath: "discountPromotionApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/promotions" }),
  tagTypes: ["Promotions"],
  endpoints: (builder) => ({
    // Fetch all promotions
    getPromotions: builder.query({
      query: () => "/details",
      providesTags: ["Promotions"],
    }),

    // Create a new promotion
    createDiscountPromotion: builder.mutation({
      query: (promotion) => ({
        url: "/",
        method: "POST",
        body: promotion,
      }),
      invalidatesTags: ["Promotions"],
    }),

    // Update an existing promotion
    updateDiscountPromotion: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Promotions", id }],
    }),

    // Delete a promotion
    deleteDiscountPromotion: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Promotions", id }],
    }),
  }),
});

export const {
  useGetPromotionsQuery,
  useCreateDiscountPromotionMutation,
  useUpdateDiscountPromotionMutation,
  useDeleteDiscountPromotionMutation,
} = discountPromotionApi;

export default discountPromotionApi;