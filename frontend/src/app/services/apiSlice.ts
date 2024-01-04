import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { setAccessToken, setRefreshToken, logout } from "../features/userSlice.ts";
import {toast} from "react-toastify";

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api',
    prepareHeaders: (headers, {getState}) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const token = getState().user.accessToken;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const baseQueryWithRefresh = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    console.log(result);
    if(result?.error?.status === "FETCH_ERROR") {
        toast.error("Network Error");
    }
    if (result?.error?.status === 403) {
        console.log(result);
        // send a post request to /users/refresh-token using the refresh token as the body
        const refreshResult = await baseQuery(
            {
                url: '/auth/refresh-token',
                method: 'POST',
                body: {
                    refreshToken: api.getState().user.refreshToken,
                },
            },
            api,
            extraOptions
        );
        console.log(refreshResult);
        if (refreshResult?.data) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const { accessToken, refreshToken } = refreshResult.data;
            api.dispatch(setAccessToken(accessToken));
            api.dispatch(setRefreshToken(refreshToken));
            result = await baseQuery(args, api, extraOptions);
            console.log(result);
        }
    } else if (result?.error?.status === 401) {
        console.log(result);
        api.dispatch(logout());
    }
    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithRefresh,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    endpoints: _build => ({})
});