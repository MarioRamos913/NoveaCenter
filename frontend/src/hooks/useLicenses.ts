import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { License, LicenseCreateRequest } from '../models/License';
import api from '../services/api';
import { useToast } from '../components/Toast';

const fetchLicenses = async (): Promise<License[]> => {
    const response = await api.get('/licenses');
    return response.data;
};

const createLicenseApi = async (request: LicenseCreateRequest): Promise<void> => {
    await api.post('/licenses', request);
};

const updateStatusApi = async ({ key, status }: { key: string; status: 'active' | 'revoked' }): Promise<void> => {
    await api.patch(`/licenses/${key}/status`, { status });
};

const deleteLicenseApi = async (key: string): Promise<void> => {
    await api.delete(`/licenses/${key}`);
};

export const useLicenses = () => {
    const queryClient = useQueryClient();
    const toast = useToast();

    const { data: licenses = [], isLoading, error } = useQuery({
        queryKey: ['licenses'],
        queryFn: fetchLicenses,
    });

    const createLicenceMutation = useMutation({
        mutationFn: createLicenseApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['licenses'] });
            toast.success('Licencia creada', 'La licencia se ha generado exitosamente');
        },
        onError: () => {
            toast.error('Error al crear licencia', 'No se pudo generar la licencia. Intenta nuevamente.');
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: updateStatusApi,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['licenses'] });
            const statusText = variables.status === 'active' ? 'activada' : 'revocada';
            toast.success(
                `Licencia ${statusText}`,
                `El estado de la licencia ha sido actualizado a ${statusText.toUpperCase()}`
            );
        },
        onError: () => {
            toast.error('Error al actualizar', 'No se pudo cambiar el estado de la licencia');
        }
    });

    const deleteLicenseMutation = useMutation({
        mutationFn: deleteLicenseApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['licenses'] });
            toast.success('Licencia eliminada', 'La licencia ha sido eliminada permanentemente');
        },
        onError: () => {
            toast.error('Error al eliminar', 'No se pudo eliminar la licencia');
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
