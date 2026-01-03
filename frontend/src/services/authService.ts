import api from './axios';

export const authService = {
    signUp: async (email: string, password: string, displayName: string) => {
        const res = await api.post("/auth/signup", 
            { email, password, displayName }, 
            { withCredentials: true })
        return res.data
    },
    signIn: async (email: string, password: string) => {
        const res = await api.post("/auth/signin", 
            { email, password }, 
            { withCredentials: true })
        return res.data
    },

    signOut: async () => {
        const res = await api.post("/auth/signout",
            {},
            { withCredentials: true })
        return res.data
    },

    fetchMe: async () => {
        const res = await api.get("/user/profile",
            { withCredentials: true })
        return res.data.user
    },

    refresh: async () => {
        const res = await api.post("/auth/refresh",
            {},
            { withCredentials: true })
        return res.data.access_token
    }
}