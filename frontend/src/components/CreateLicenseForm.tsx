import { useState } from 'react';
import { useLicenses } from '../hooks/useLicenses';
import type { LicenseCreateRequest } from '../models/License';
import DatePicker from './DatePicker';
import './CreateLicenseForm.css';

export default function CreateLicenseForm() {
    const { createLicense, isCreating } = useLicenses();

    const [formData, setFormData] = useState<LicenseCreateRequest>({
        firstName: '',
        lastName: '',
        idNumber: '',
        businessName: '',
        sector: '',
        software: 'rutadata',
        duration: '1_month',
        customDate: ''
    });

    const [expirationDate, setExpirationDate] = useState<Date | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!expirationDate) return;

        const formattedDate = expirationDate.toISOString().split('T')[0];
        await createLicense({ ...formData, duration: 'custom', customDate: formattedDate });

        // Reset form
        setFormData({ ...formData, firstName: '', lastName: '', idNumber: '', businessName: '', sector: '' });
        setExpirationDate(null);
    };

    return (
        <section className="form-section" aria-labelledby="form-title">
            <div className="form-panel">
                <header className="form-header">
                    <h2 id="form-title" className="form-title">Nueva Suscripción</h2>
                    <div className="form-pulse-dot" aria-hidden="true"></div>
                </header>

                <form onSubmit={handleSubmit} className="license-form">

                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="firstName" className="form-label">Nombres</label>
                            <input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="Juan"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName" className="form-label">Apellidos</label>
                            <input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="Pérez"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="idNumber" className="form-label">Cédula / ID</label>
                        <input
                            id="idNumber"
                            name="idNumber"
                            value={formData.idNumber}
                            onChange={handleChange}
                            required
                            className="form-input input-mono"
                            placeholder="000-000000-0"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="businessName" className="form-label">Organización</label>
                        <div className="input-with-icon">
                            <div className="input-icon" aria-hidden="true">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>
                            <input
                                id="businessName"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Nombre del Negocio"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="sector" className="form-label">Sector</label>
                        <input
                            id="sector"
                            name="sector"
                            value={formData.sector}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Ej. Gastronomía"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Fecha de Vencimiento</label>
                        <DatePicker
                            selectedDate={expirationDate}
                            onChange={setExpirationDate}
                            minDate={new Date()}
                        />
                    </div>

                    <div className="submit-button-wrapper">
                        <div className="submit-button-gradient"></div>
                        <div className="submit-button-bg">
                            <button type="submit" disabled={isCreating || !expirationDate} className="submit-button">
                                {isCreating ? (
                                    <span className="loading-spinner">
                                        <svg className="spinner-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Generando...
                                    </span>
                                ) : (
                                    <span>Generar Licencia</span>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </section >
    );
}
