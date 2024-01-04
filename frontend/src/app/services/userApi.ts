import { apiSlice } from "./apiSlice.ts";


const userApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCurrentUser: builder.query({
            query: () => ({
                url: '/user',
                method: 'GET'
            })
        }),
        updateCurrentUser: builder.mutation({
            query: (formDat) => ({
                url: '/user',
                method: 'PUT',
                body: formDat,
                formData: true
            })
        }),
        deleteCurrentUser: builder.mutation({
            query: () => ({
                url: '/user/me',
                method: 'DELETE'
            })
        }),
        getUserByUsername: builder.query({
            query: (username) => ({
                url: `/user/${username}`,
                method: 'GET'
            })
        })
    })
});

export const { useGetCurrentUserQuery, useUpdateCurrentUserMutation, useDeleteCurrentUserMutation, useGetUserByUsernameQuery } = userApi;