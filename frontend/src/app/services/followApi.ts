import { apiSlice } from "./apiSlice.ts";


export const followApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    followUser: builder.mutation({
      query: (id) => ({
        url: `/follow/${id}`,
        method: "POST",
      }),
      // @ts-ignore
      invalidatesTags: ["User", "Follow", "Profile"],
    }),
    unfollowUser: builder.mutation({
      query: (id) => ({
        url: `/follow/${id}`,
        method: "DELETE",
      }),
        // @ts-ignore
        invalidatesTags: ["User", "Follow", "Profile"],
    }),
    getFollowersByUsername: builder.query({
      query: (username) => `/follow/followers/${username}`,
    }),
    getFollowingByUsername: builder.query({
      query: (username) => `/follow/following/${username}`,
    }),
  }),
  overrideExisting: false,
});

export const {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetFollowersByUsernameQuery,
  useGetFollowingByUsernameQuery,
} = followApi;