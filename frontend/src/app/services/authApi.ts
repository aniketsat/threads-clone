import { apiSlice } from "./apiSlice.ts";

const authApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        register: builder.mutation({
            query: ({ name, email, password }) => ({
                url: '/auth/register',
                method: 'POST',
                body: {
                    name,
                    email,
                    password
                }
            }),
            // @ts-ignore
            invalidatesTags: ['User', "Profile", "Follow"]
        }),
        login: builder.mutation({
            query: ({ email, password }) => ({
                url: '/auth/login',
                method: 'POST',
                body: {
                    email,
                    password
                }
            }),
            // @ts-ignore
            invalidatesTags: ['User', "Profile", "Follow"]
        }),
        refreshToken: builder.mutation({
            query: ({ refreshToken }) => ({
                url: '/auth/refresh-token',
                method: 'POST',
                body: {
                    refreshToken
                }
            }),
            // @ts-ignore
            invalidatesTags: ['User', "Profile", "Follow"]
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST'
            }),
            // @ts-ignore
            invalidatesTags: ['User', "Profile", "Follow"]
        })
    })
});

export const { useRegisterMutation, useLoginMutation, useRefreshTokenMutation, useLogoutMutation } = authApi;
