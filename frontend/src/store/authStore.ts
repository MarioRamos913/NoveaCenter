import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthUser {
    id: number;
    username: string;
    roles: string[];
    permissions: string[];
}

interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    login: (user: AuthUser, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    hasRole: (role: string) => boolean;
    hasPermission: (code: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            login: (user, accessToken, refreshToken) => {
                set({ user, accessToken, refreshToken, isAuthenticated: true });
            },

            logout: () => {
                set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
            },

            setTokens: (accessToken, refreshToken) => {
                set({ accessToken, refreshToken });
            },

            hasRole: (role: string) => {
                const state = get();
                return state.user?.roles.includes(role) ?? false;
            },

            hasPermission: (code: string) => {
                const state = get();
                return state.user?.permissions.includes(code) ?? false;
            },
        }),
        { name: 'auth-storage' }
    )
);
