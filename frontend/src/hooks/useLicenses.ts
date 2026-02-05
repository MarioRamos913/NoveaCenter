import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { License, LicenseCreateRequest } from '../models/License';
import { API_CONFIG } from '../config/api';

const fetchLicenses = async (): Promise<License[]> => {
    const response = await fetch(`${API_CONFIG.BASE_URL}/licenses`);
    if (!response.ok) throw new Error('Failed to fetch licenses');
    return response.json();
};

const createLicenseApi = async (request: LicenseCreateRequest): Promise<void> => {
    const response = await fetch(`${API_CONFIG.BASE_URL}/licenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
    });
    if (!response.ok) throw new Error('Failed to create license');
};

const updateStatusApi = async ({ key, status }: { key: string; status: 'active' | 'revoked' }): Promise<void> => {
    const response = await fetch(`${API_CONFIG.BASE_URL}/licenses/${key}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update status');
};

const deleteLicenseApi = async (key: string): Promise<void> => {
    const response = await fetch(`${API_CONFIG.BASE_URL}/licenses/${key}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete license');
};

export const useLicenses = () => {
    const queryClient = useQueryClient();

    const { data: licenses = [], isLoading, error } = useQuery({
        queryKey: ['licenses'],
        queryFn: fetchLicenses,
    });

    const createLicenceMutation = useMutation({
        mutationFn: createLicenseApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['licenses'] });
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: updateStatusApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['licenses'] });
        }
    });

    const deleteLicenseMutation = useMutation({
        mutationFn: deleteLicenseApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['licenses'] });
        }
    });

    return {
        licenses,
        loading: isLoading,
        error: error ? (error instanceof Error ? error.message : 'Unknown error') : null,
        createLicense: createLicenceMutation.mutateAsync,
        updateStatus: (key: string, status: 'active' | 'revoked') => updateStatusMutation.mutateAsync({ key, status }),
        deleteLicense: deleteLicenseMutation.mutateAsync,
        isCreating: createLicenceMutation.isPending
    };
};
