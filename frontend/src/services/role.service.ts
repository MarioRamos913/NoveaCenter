import api from './api';
import type { Role, RoleWithResources, CreateRoleRequest, UpdateRoleRequest } from '../models/Role';

export const RoleService = {
    getAll: async (): Promise<Role[]> => {
        const response = await api.get<Role[]>('/roles');
        return response.data;
    },

    getById: async (id: number): Promise<RoleWithResources> => {
        const response = await api.get<RoleWithResources>(`/roles/${id}`);
        return response.data;
    },

    create: async (data: CreateRoleRequest): Promise<Role> => {
        const response = await api.post<Role>('/roles', data);
        return response.data;
    },

    update: async (id: number, data: UpdateRoleRequest): Promise<Role> => {
        const response = await api.put<Role>(`/roles/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/roles/${id}`);
    },

    assignResources: async (id: number, resourceIds: number[]): Promise<RoleWithResources> => {
        const response = await api.put<RoleWithResources>(`/roles/${id}/resources`, { resourceIds });
        return response.data;
    },
};
