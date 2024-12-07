import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseURL";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/auth`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (newUser) => ({
        url: "/register",
        method: "POST",
        body: newUser,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    sellerLogin: builder.mutation({
      query: (credentials) => ({
        url: "/seller-login", // Endpoint for seller login
        method: "POST",
        body: credentials,
      }),
    }),
    getUser: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      refetchOnMount: true,
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: { role },
      }),
      refetchOnMount: true,
      invalidatesTags: ["User"],
    }),
    editProfile: builder.mutation({
      query: (profileData) => ({
        url: '/edit-profile',
        method: 'PATCH',
        body: profileData,
      }),
    }),
    addFavoriteProduct: builder.mutation({
      query: ({ userId, productId }) => ({
        url: `/favorites`,
        method: "POST",
        body: { userId, productId }, // Ensure data is sent in the request body
      }),
    }),

    removeFavoriteProduct: builder.mutation({
      query: ({ userId, productId }) => ({
        url: '/favorites/remove',
        method: 'DELETE',
        body: { userId, productId },
      }),
    }),
    
    getFavoriteProducts: builder.query({
      query: (userId) => ({
        url: `/favorites`,
        method: "GET",
        params: { userId },
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetUserQuery,
  useDeleteUserMutation,
  useRemoveFavoriteProductMutation, // Hook for removing favorite product
  useUpdateUserRoleMutation,
  useEditProfileMutation,
  useSellerLoginMutation,
  useAddFavoriteProductMutation, // Hook for adding favorite product
  useGetFavoriteProductsQuery,  // Hook for getting favorite products
} = authApi;

export default authApi;
