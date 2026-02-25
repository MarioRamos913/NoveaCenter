import api from './api';
import type { MenuItem } from '../models/MenuItem';

export const MenuService = {
    getMenu: async (): Promise<MenuItem[]> => {
        const response = await api.get<MenuItem[]>('/menu');
        return response.data;
    },
};
