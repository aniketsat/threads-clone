import { apiSlice } from "./apiSlice.ts";


const userApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCurrentUser: builder.query({
            query: () => ({
                url: '/user',
                method: 'GET'
            }),
        }),
        updateCurrentUser: builder.mutation({
            query: (formDat) => ({
                url: '/user',
                method: 'PUT',
                body: formDat,
                formData: true
            }),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            invalidatesTags: ['User', "Profile", "Follow"]
        }),
        deleteCurrentUser: builder.mutation({
            query: () => ({
                url: '/user/me',
                method: 'DELETE'
            }),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            invalidatesTags: ['User', "Profile", "Follow"]
        }),
        getUserByUsername: builder.query({
            query: (username) => ({
                url: `/user/${username}`,
                method: 'GET'
            }),
        }),
        updatePassword: builder.mutation({
            query: ({ oldPassword, newPassword }) => ({
                url: '/user/password',
                method: 'PUT',
                body: { oldPassword, newPassword },
                formData: true
            }),
        }),
        changeProfileType: builder.mutation({
            query: () => ({
                url: '/user/type',
                method: 'PUT'
            }),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            invalidatesTags: ['User', "Profile", "Follow"]
        }),
    })
});

export const { useGetCurrentUserQuery, useUpdateCurrentUserMutation, useDeleteCurrentUserMutation, useGetUserByUsernameQuery, useUpdatePasswordMutation, useChangeProfileTypeMutation } = userApi;