import api from './api';
import { useAuthStore } from '../store/authStore';

interface LoginResponse {
    user: {
        id: number;
        username: string;
        roles: string[];
        permissions: string[];
    };
    accessToken: string;
    refreshToken: string;
}

export const AuthService = {
    login: async (username: string, password: string) => {
        const response = await api.post<LoginResponse>('/auth/login', { username, password });
        const { user, accessToken, refreshToken } = response.data;

        useAuthStore.getState().login(
            {
                id: user.id,
                username: user.username,
                roles: user.roles || [],
                permissions: user.permissions || [],
            },
            accessToken,
            refreshToken
        );

        return response.data;
    },

    logout: async () => {
        const refreshToken = useAuthStore.getState().refreshToken;
        try {
            await api.post('/auth/logout', { refreshToken });
        } finally {
            useAuthStore.getState().logout();
        }
    },
};
