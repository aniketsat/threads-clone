import {apiSlice} from "./apiSlice.ts";


const commentApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createComment: builder.mutation({
            query: ({threadId, content}) => ({
                url: `comment/${threadId}`,
                method: 'POST',
                body: {
                    content
                }
            }),
        }),
        getAllComments: builder.query({
            query: threadId => `comment/${threadId}`
        }),
        createReply: builder.mutation({
            query: ({commentId, content}) => ({
                url: `comment/child/${commentId}`,
                method: 'POST',
                body: {
                    content
                }
            }),
        }),
        getAllReplies: builder.query({
            query: commentId => `comment/child/${commentId}`
        }),
        updateComment: builder.mutation({
            query: ({commentId, content}) => ({
                url: `comment/${commentId}`,
                method: 'PUT',
                body: {
                    content
                }
            }),
        }),
        deleteComment: builder.mutation({
            query: commentId => ({
                url: `comment/${commentId}`,
                method: 'DELETE'
            }),
        }),
    })
});


export const {
    useCreateCommentMutation,
    useGetAllCommentsQuery,
    useCreateReplyMutation,
    useGetAllRepliesQuery,
    useUpdateCommentMutation,
    useDeleteCommentMutation
} = commentApi;