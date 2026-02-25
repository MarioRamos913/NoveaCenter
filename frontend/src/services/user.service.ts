import api from './api';
import type { User, CreateUserRequest, UpdateUserRequest } from '../models/User';

export const UserService = {
    getAll: async (): Promise<User[]> => {
        const response = await api.get<User[]>('/users');
        return response.data;
    },

    create: async (data: CreateUserRequest): Promise<User> => {
        const response = await api.post<User>('/users', data);
        return response.data;
    },

    update: async (id: number, data: UpdateUserRequest): Promise<User> => {
        const response = await api.put<User>(`/users/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/users/${id}`);
    },

    assignRoles: async (id: number, roleIds: number[]): Promise<User> => {
        const response = await api.put<User>(`/users/${id}/roles`, { roleIds });
        return response.data;
    },
};
