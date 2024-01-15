import {apiSlice} from "./apiSlice.ts";


const bookmarkApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getBookmarks: builder.query({
            query: () => `/bookmark`,
        }),
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
    }),
    overrideExisting: false,
});


export const {
    useGetBookmarksQuery,
    useCreateBookmarkMutation,
    useDeleteBookmarkMutation,
} = bookmarkApi;