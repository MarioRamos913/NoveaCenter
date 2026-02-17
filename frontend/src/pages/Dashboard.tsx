import { useNavigate } from 'react-router-dom';
import { useLicenses } from '../hooks/useLicenses';
import { useAuthStore } from '../store/authStore';
import { AuthService } from '../services/auth.service';
import CreateLicenseForm from '../components/CreateLicenseForm';
import LicensesTable from '../components/LicensesTable';
import '../views/Dashboard.css';

export default function Dashboard() {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    // We only need the list and update/delete actions here. 
    // The creation logic is now isolated in CreateLicenseForm.
    const { licenses, loading, error, updateStatus, deleteLicense } = useLicenses();

    const handleLogout = async () => {
        await AuthService.logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
                    Loading licenses...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red' }}>
                    Error fetching licenses: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">

            {/* Ambient Background Effects */}
            <div className="ambient-background">
                <div className="ambient-orb orb-1" />
                <div className="ambient-orb orb-2" />
            </div>

            <header className="dashboard-header">
                <div className="header-wrapper">
                    <div className="header-glow"></div>
                    <h1 className="dashboard-title">
                        NovaCenter <span className="title-accent">Pro</span>
                    </h1>
                </div>

                <div className="header-actions">
                    <p className="header-user-info">
                        {user?.username} <span className="header-user-role">{user?.role}</span>
                    </p>
                    <button
                        onClick={handleLogout}
                        className="header-logout-btn"
                    >
                        Salir
                    </button>
                </div>
            </header>

            <main className="dashboard-main">
                {/* Formulario Aislado - Only for Admins */}
                {user?.role === 'admin' && (
                    <CreateLicenseForm />
                )}

                {/* Tabla Virtualizada */}
                <LicensesTable
                    licenses={licenses}
                    updateStatus={updateStatus}
                    deleteLicense={deleteLicense}
                />
            </main>
        </div>
    );
}
