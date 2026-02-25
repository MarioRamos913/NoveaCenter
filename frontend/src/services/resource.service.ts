import api from './api';
import type { Resource, CreateResourceRequest, UpdateResourceRequest } from '../models/Resource';

export const ResourceService = {
    getAll: async (): Promise<Resource[]> => {
        const response = await api.get<Resource[]>('/resources');
        return response.data;
    },

    getById: async (id: number): Promise<Resource> => {
        const response = await api.get<Resource>(`/resources/${id}`);
        return response.data;
    },

    create: async (data: CreateResourceRequest): Promise<Resource> => {
        const response = await api.post<Resource>('/resources', data);
        return response.data;
    },

    update: async (id: number, data: UpdateResourceRequest): Promise<Resource> => {
        const response = await api.put<Resource>(`/resources/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/resources/${id}`);
    },
};
