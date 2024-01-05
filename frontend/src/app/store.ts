import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from "./services/apiSlice.ts";
import userReducer from './features/userSlice.ts'

export const store = configureStore({
    reducer: {
        user: userReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})