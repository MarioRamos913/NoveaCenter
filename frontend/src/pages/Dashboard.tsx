import { useLicenses } from '../hooks/useLicenses';
import { useAuthStore } from '../store/authStore';
import CreateLicenseForm from '../components/CreateLicense/CreateLicenseForm';
import LicensesTable from '../components/LicensesTable/LicensesTable';

export default function Dashboard() {
    const { hasRole } = useAuthStore();

    const { licenses, loading, error, updateStatus, deleteLicense } = useLicenses();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'rgba(255,255,255,0.5)' }}>
                Cargando licencias...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#ef4444' }}>
                Error al cargar licencias: {error}
            </div>
        );
    }

    return (
        <div>
            {/* Formulario — Solo para Admins */}
            {hasRole('admin') && (
                <CreateLicenseForm />
            )}

            {/* Tabla de Licencias */}
            <LicensesTable
                licenses={licenses}
                updateStatus={updateStatus}
                deleteLicense={deleteLicense}
            />
        </div>
    );
}
