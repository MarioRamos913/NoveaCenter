import { useRef, memo, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { License } from '../models/License';

interface LicensesTableProps {
    licenses: License[];
    updateStatus: (key: string, status: 'active' | 'revoked') => void;
    deleteLicense: (key: string) => void;
}

// Memoized row component for optimal performance
const LicenseRow = memo(({
    lic,
    updateStatus,
    deleteLicense,
    style
}: {
    lic: License;
    updateStatus: (key: string, status: 'active' | 'revoked') => void;
    deleteLicense: (key: string) => void;
    style: React.CSSProperties;
}) => {
    return (
        <div style={style} className="flex hover:bg-white/[0.02] transition-colors group border-b border-white/5 items-center">
            <div className="w-[20%] px-6 truncate font-semibold text-slate-200">
                {lic.firstName} {lic.lastName}
            </div>
            <div className="w-[20%] px-6">
                <div className="text-slate-400 font-mono text-xs truncate">{lic.idNumber}</div>
                {lic.businessName && <div className="text-xs text-neon-blue/80 mt-1 truncate">{lic.businessName}</div>}
            </div>
            <div className="w-[20%] px-6">
                <code className="font-mono text-[10px] text-neon-purple bg-neon-purple/10 px-2 py-1 rounded border border-neon-purple/20 select-all cursor-pointer hover:bg-neon-purple/20 transition-colors truncate block text-center">
                    {lic.key.substring(0, 14)}...
                </code>
            </div>
            <div className="w-[15%] px-6 text-center">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border shadow-sm
                    ${lic.status === 'active'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-emerald-500/20'
                        : 'bg-rose-500/15 text-rose-400 border-rose-500/30 shadow-rose-500/20'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${lic.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                    {lic.status === 'active' ? 'ACTIVA' : 'REVOCADA'}
                </span>
            </div>
            <div className="w-[15%] px-6 text-slate-400 text-xs font-mono truncate">
                {new Date(lic.expirationDate).toLocaleDateString()}
            </div>
            <div className="w-[10%] px-6 text-right flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                {lic.status === 'active' ? (
                    <button onClick={() => updateStatus(lic.key, 'revoked')}
                        className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
                        title="Revocar acceso">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                    </button>
                ) : (
                    <button onClick={() => updateStatus(lic.key, 'active')}
                        className="p-2 rounded-lg text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all"
                        title="Reactivar acceso">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </button>
                )}
                <button onClick={() => deleteLicense(lic.key)}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    title="Eliminar permanentemente">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        </div>
    );
}, (prev, next) => {
    // Only re-render if license data changed
    return prev.lic.key === next.lic.key && prev.lic.status === next.lic.status;
});

LicenseRow.displayName = 'LicenseRow';


export default function LicensesTable({ licenses, updateStatus, deleteLicense }: LicensesTableProps) {
    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: licenses.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 73,
        overscan: 10,
    });

    // Memoize callbacks to prevent unnecessary re-renders
    const handleUpdateStatus = useCallback(updateStatus, [updateStatus]);
    const handleDeleteLicense = useCallback(deleteLicense, [deleteLicense]);

    return (
        <section className="col-span-1 lg:col-span-8">
            <div className="premium-panel rounded-2xl p-8 min-h-[600px] flex flex-col h-[800px]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-display font-semibold text-white">Licencias Activas</h2>
                        <span className="flex items-center justify-center min-w-[32px] h-8 px-2 rounded-lg bg-white/5 border border-white/10 text-neon-purple font-mono font-bold text-sm">
                            {licenses.length}
                        </span>
                    </div>
                </div>

                <div className="flex-grow overflow-hidden rounded-xl border border-white/5 shadow-inner bg-void/20 flex flex-col">
                    <div className="border-b border-white/5 bg-white/5 pr-4">
                        <table className="w-full text-left text-sm whitespace-nowrap table-fixed">
                            <thead>
                                <tr>
                                    <th className="w-[20%] px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Cliente</th>
                                    <th className="w-[20%] px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">ID / Negocio</th>
                                    <th className="w-[20%] px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Key</th>
                                    <th className="w-[15%] px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Estado</th>
                                    <th className="w-[15%] px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Vencimiento</th>
                                    <th className="w-[10%] px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Acciones</th>
                                </tr>
                            </thead>
                        </table>
                    </div>

                    <div ref={parentRef} className="flex-grow overflow-auto custom-scrollbar">
                        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
                            {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                                <LicenseRow
                                    key={licenses[virtualRow.index].key}
                                    lic={licenses[virtualRow.index]}
                                    updateStatus={handleUpdateStatus}
                                    deleteLicense={handleDeleteLicense}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start}px)`,
                                    }}
                                />
                            ))}
                            {licenses.length === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="p-4 rounded-full bg-white/5 border border-white/10">
                                            <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                        </div>
                                        <p className="font-light">No hay licencias activas</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
