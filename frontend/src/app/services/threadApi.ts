import { apiSlice } from "./apiSlice.ts";


export const threadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createThread: builder.mutation({
        query: (formdata) => ({
            url: `/thread`,
            method: "POST",
            body: formdata,
        }),
    }),
    getAllThreads: builder.query({
        query: () => {
            return `/thread`;
        },
    }),
      getThread: builder.query({
            query: (id) => `/thread/${id}`,
        }),
      updateThread: builder.mutation({
            query: (thread) => ({
                url: `/thread/${thread.id}`,
                method: "PUT",
                body: thread.data
            }),
        }),
      deleteThread: builder.mutation({
            query: (id) => ({
                url: `/thread/${id}`,
                method: "DELETE",
            }),
        }),
      getThreadsByUser: builder.query({
            query: (username) => `/thread/user/${username}`,
        }),
  }),
});

export const { useCreateThreadMutation, useGetAllThreadsQuery, useGetThreadQuery, useUpdateThreadMutation, useDeleteThreadMutation, useGetThreadsByUserQuery } = threadApi;