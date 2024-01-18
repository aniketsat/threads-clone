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
        likeComment: builder.mutation({
            query: (id) => ({
                url: `/like/comment/${id}`,
                method: "POST",
            }),
        }),
        unlikeComment: builder.mutation({
            query: (id) => ({
                url: `/like/comment/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});


export const {
    useLikePostMutation,
    useUnlikePostMutation,
    useLikeCommentMutation,
    useUnlikeCommentMutation,
} = likeApi;