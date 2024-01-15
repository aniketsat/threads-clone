import {apiSlice} from "./apiSlice.ts";


const bookmarkApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createBookmark: builder.mutation({
            query: (id) => ({
                url: `/bookmark/${id}`,
                method: 'POST'
            }),
        }),
        deleteBookmark: builder.mutation({
            query: (id) => ({
                url: `/bookmark/${id}`,
                method: 'DELETE'
            }),
        }),
        getBookmarkByUser: builder.query({
            query: (username) => `/bookmark/user/${username}`,
        }),
    }),
    overrideExisting: false,
});


export const {
    useCreateBookmarkMutation,
    useDeleteBookmarkMutation,
    useGetBookmarkByUserQuery
} = bookmarkApi;