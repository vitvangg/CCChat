import type { User } from "./user";

export interface AuthState {
    accessToken: string | null,
    user: User | null,
    loading: boolean,

    setAccessToken: (accessToken: string) => void,
    clearState: () => void,

    signUp: (email: string, password: string, displayName: string) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    fetchMe: () => Promise<void>
    refresh: () => Promise<void>
}