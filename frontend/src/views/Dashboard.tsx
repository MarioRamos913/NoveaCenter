import { useLicenses } from '../hooks/useLicenses';
import CreateLicenseForm from '../components/CreateLicenseForm';
import LicensesTable from '../components/LicensesTable';
import './Dashboard.css';

export default function Dashboard() {
    // We only need the list and update/delete actions here. 
    // The creation logic is now isolated in CreateLicenseForm.
    const { licenses, loading, error, updateStatus, deleteLicense } = useLicenses();

    console.log('Dashboard licenses:', licenses);
    console.log('Dashboard loading:', loading);
    console.log('Dashboard error:', error);

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
                <p className="dashboard-subtitle">
                    Gestión Avanzada de Licencias & Suscripciones
                </p>
            </header>

            <main className="dashboard-main">
                {/* Formulario Aislado */}
                <CreateLicenseForm />

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
