import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

class User {
    id: string | null = null
    name: string | null = null
    email: string | null = null
    username: string | null = null
    createdAt: string | null = null
    updatedAt: string | null = null
    avatar: string | null = null
}

export interface UserState {
    user: User | null
    accessToken: string | null
    refreshToken: string | null
    isLoggedin: boolean
}

const initialState: UserState = {
    user: JSON.parse(localStorage.getItem('user') || '{}'),
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isLoggedin: JSON.parse(localStorage.getItem('isLoggedin') || 'false'),
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            localStorage.setItem('user', JSON.stringify(action.payload))
            state.user = action.payload
        },
        setAccessToken(state, action: PayloadAction<string>) {
            localStorage.setItem('accessToken', action.payload)
            state.accessToken = action.payload
        },
        setRefreshToken(state, action: PayloadAction<string>) {
            localStorage.setItem('refreshToken', action.payload)
            state.refreshToken = action.payload
        },
        setLoggedin(state, action: PayloadAction<boolean>) {
            localStorage.setItem('isLoggedin', JSON.stringify(action.payload))
            state.isLoggedin = action.payload || false
        },
        logout(state) {
            state.user = null
            state.accessToken = null
            state.refreshToken = null
            state.isLoggedin = false
            localStorage.removeItem('user')
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('isLoggedin')
        },
    },
})

export const { setUser, setAccessToken, setRefreshToken, setLoggedin, logout } = userSlice.actions

export default userSlice.reducer