import { useLicenses } from '../hooks/useLicenses';
import CreateLicenseForm from '../components/CreateLicenseForm';
import LicensesTable from '../components/LicensesTable';

export default function Dashboard() {
    // We only need the list and update/delete actions here. 
    // The creation logic is now isolated in CreateLicenseForm.
    const { licenses, updateStatus, deleteLicense } = useLicenses();

    return (
        <div className="min-h-screen text-slate-200 p-6 md:p-12 font-sans selection:bg-neon-purple/30 selection:text-neon-pink">

            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div className="ambient-orb absolute top-[-10%] left-[-10%] w-[40%] h-[40%]" />
                <div className="ambient-orb absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%]" style={{ animationDelay: '-5s' }} />
            </div>

            <header className="max-w-7xl mx-auto mb-16 text-center relative z-10">
                <div className="inline-block relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-neon-indigo via-neon-purple to-neon-pink rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <h1 className="relative text-6xl md:text-7xl font-display font-bold bg-gradient-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4 tracking-tight drop-shadow-sm">
                        NovaCenter <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-indigo to-neon-pink font-light italic">Pro</span>
                    </h1>
                </div>
                <p className="text-slate-400 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
                    Gestión Avanzada de Licencias & Suscripciones
                </p>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
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
