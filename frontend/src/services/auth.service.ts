import api from './api';
import { useAuthStore } from '../store/authStore';

export const AuthService = {
    login: async (username: string, password: string) => {
        const response = await api.post('/auth/login', { username, password });
        const { user, accessToken, refreshToken } = response.data;
        useAuthStore.getState().login(user, accessToken, refreshToken);
        return user;
    },

    logout: async () => {
        const refreshToken = useAuthStore.getState().refreshToken;
        try {
            if (refreshToken) {
                await api.post('/auth/logout', { refreshToken });
            }
        } finally {
            useAuthStore.getState().logout();
        }
    }
};
