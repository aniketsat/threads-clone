import {apiSlice} from "./apiSlice.ts";


const likeApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        likePost: builder.mutation({
            query: (id) => ({
                url: `/like/${id}`,
                method: "POST",
            }),
        }),
        unlikePost: builder.mutation({
            query: (id) => ({
                url: `/like/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});


export const {useLikePostMutation, useUnlikePostMutation} = likeApi;