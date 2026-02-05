import { useState } from 'react';
import { useLicenses } from '../hooks/useLicenses';
import type { LicenseCreateRequest } from '../models/License';

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createLicense(formData);
        // Reset form partially
        setFormData({ ...formData, firstName: '', lastName: '', idNumber: '', businessName: '', sector: '', customDate: '' });
    };

    return (
        <section className="col-span-1 lg:col-span-4 h-fit sticky top-8">
            <div className="glass-panel rounded-2xl p-1 shadow-2xl overflow-hidden">
                <div className="bg-void/40 p-8 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                        <h2 className="text-2xl font-display font-semibold text-white">Nueva Suscripción</h2>
                        <div className="w-2 h-2 rounded-full bg-neon-indigo shadow-[0_0_10px_#6366f1] animate-pulse"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nombres</label>
                                <input name="firstName" value={formData.firstName} onChange={handleChange} required
                                    className="w-full bg-surface/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none input-glow transition-all"
                                    placeholder="Juan" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Apellidos</label>
                                <input name="lastName" value={formData.lastName} onChange={handleChange} required
                                    className="w-full bg-surface/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none input-glow transition-all"
                                    placeholder="Pérez" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cédula / ID</label>
                            <input name="idNumber" value={formData.idNumber} onChange={handleChange} required
                                className="w-full bg-surface/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none input-glow transition-all font-mono"
                                placeholder="000-000000-0" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Organización</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                </div>
                                <input name="businessName" value={formData.businessName} onChange={handleChange}
                                    className="w-full bg-surface/50 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none input-glow transition-all"
                                    placeholder="Nombre del Negocio" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Sector</label>
                            <input name="sector" value={formData.sector} onChange={handleChange}
                                className="w-full bg-surface/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none input-glow transition-all"
                                placeholder="Ej. Gastronomía" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Duración</label>
                            <div className="relative">
                                <select name="duration" value={formData.duration} onChange={handleChange}
                                    className="w-full bg-surface/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none input-glow transition-all appearance-none cursor-pointer">
                                    <option value="1_month">1 Mes (Trial)</option>
                                    <option value="3_months">3 Meses</option>
                                    <option value="1_year">1 Año (Premium)</option>
                                    <option value="custom">Personalizada</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
                                </div>
                            </div>
                        </div>

                        {formData.duration === 'custom' && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Vence en</label>
                                <input type="date" name="customDate" value={formData.customDate} onChange={handleChange} required
                                    className="w-full bg-surface/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none input-glow transition-all [color-scheme:dark]" />
                            </div>
                        )}

                        <button type="submit" disabled={isCreating}
                            className="mt-4 w-full relative group overflow-hidden rounded-xl p-[1px]">
                            <div className="absolute inset-0 bg-gradient-to-r from-neon-indigo via-neon-purple to-neon-pink opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative bg-void h-full w-full rounded-[11px] hover:bg-opacity-0 transition-all duration-300">
                                <div className="relative flex items-center justify-center py-3.5 px-4 h-full w-full">
                                    {isCreating ? (
                                        <span className="flex items-center justify-center gap-2 text-white font-medium">
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Generando...
                                        </span>
                                    ) : (
                                        <span className="text-white font-bold tracking-wide group-hover:text-white transition-colors">Generar Licencia</span>
                                    )}
                                </div>
                            </div>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
