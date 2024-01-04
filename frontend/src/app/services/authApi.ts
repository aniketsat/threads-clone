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
            })
        }),
        login: builder.mutation({
            query: ({ email, password }) => ({
                url: '/auth/login',
                method: 'POST',
                body: {
                    email,
                    password
                }
            })
        }),
        refreshToken: builder.mutation({
            query: ({ refreshToken }) => ({
                url: '/auth/refresh-token',
                method: 'POST',
                body: {
                    refreshToken
                }
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST'
            })
        })
    })
});

export const { useRegisterMutation, useLoginMutation, useRefreshTokenMutation, useLogoutMutation } = authApi;
