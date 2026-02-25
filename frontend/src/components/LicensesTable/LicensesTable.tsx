import { useRef, memo, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { License } from '../../models/License';
import './LicensesTable.css';

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
}: {
    lic: License;
    updateStatus: (key: string, status: 'active' | 'revoked') => void;
    deleteLicense: (key: string) => void;
}) => {
    return (
        <tr className="license-row">
            <td className="col-cliente">
                {lic.firstName} {lic.lastName}
            </td>
            <td className="col-id">
                <div className="col-id-number">{lic.idNumber}</div>
                {lic.businessName && <div className="col-business text-truncated">{lic.businessName}</div>}
            </td>
            <td className="col-key">
                <code className="license-key-code" title={lic.key}>
                    {lic.key.substring(0, 14)}...
                </code>
            </td>
            <td className="col-estado">
                <span className={`status-badge ${lic.status === 'active' ? 'status-active' : 'status-revoked'}`}>
                    <span className={`status-dot ${lic.status === 'active' ? 'dot-active' : 'dot-revoked'}`}></span>
                    {lic.status === 'active' ? 'ACTIVA' : 'REVOCADA'}
                </span>
            </td>
            <td className="col-vencimiento">
                {new Date(lic.expirationDate).toLocaleDateString()}
            </td>
            <td className="col-acciones">
                <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end', width: '100%' }}>
                    {lic.status === 'active' ? (
                        <button onClick={() => updateStatus(lic.key, 'revoked')}
                            className="action-button btn-revoke"
                            aria-label={`Revocar licencia de ${lic.firstName} ${lic.lastName}`}
                            title="Revocar acceso">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                        </button>
                    ) : (
                        <button onClick={() => updateStatus(lic.key, 'active')}
                            className="action-button btn-activate"
                            aria-label={`Reactivar licencia de ${lic.firstName} ${lic.lastName}`}
                            title="Reactivar acceso">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </button>
                    )}
                    <button onClick={() => deleteLicense(lic.key)}
                        className="action-button btn-delete"
                        aria-label={`Eliminar licencia de ${lic.firstName} ${lic.lastName}`}
                        title="Eliminar permanentemente">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            </td>
        </tr>
    );
}, (prev, next) => {
    // Only re-render if license data changed
    return prev.lic.key === next.lic.key && prev.lic.status === next.lic.status;
});

LicenseRow.displayName = 'LicenseRow';


export default function LicensesTable({ licenses, updateStatus, deleteLicense }: LicensesTableProps) {
    const parentRef = useRef<HTMLTableSectionElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: licenses.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 73,
        overscan: 10,
    });

    const items = rowVirtualizer.getVirtualItems();

    // Calculate spacers to maintain scroll height without absolute positioning
    const paddingTop = items.length > 0 ? items[0].start : 0;
    const paddingBottom = items.length > 0
        ? rowVirtualizer.getTotalSize() - items[items.length - 1].end
        : 0;

    // Memoize callbacks to prevent unnecessary re-renders
    const handleUpdateStatus = useCallback(updateStatus, [updateStatus]);
    const handleDeleteLicense = useCallback(deleteLicense, [deleteLicense]);

    return (
        <section className="licenses-section" aria-label="Lista de Licencias">
            <div className="licenses-panel">
                <header className="licenses-header">
                    <h2 className="licenses-title">
                        Licencias Activas
                        <span className="licenses-count">{licenses.length}</span>
                    </h2>
                </header>

                <table className="licenses-table">
                    {/* Table header */}
                    <thead className="licenses-table-header">
                        <tr>
                            <th className="col-cliente" scope="col">CLIENTE</th>
                            <th className="col-id" scope="col">ID / NEGOCIO</th>
                            <th className="col-key" scope="col">KEY</th>
                            <th className="col-estado" scope="col">ESTADO</th>
                            <th className="col-vencimiento" scope="col">VENCIMIENTO</th>
                            <th className="col-acciones" scope="col">ACCIONES</th>
                        </tr>
                    </thead>

                    {/* Scrollable body */}
                    <tbody
                        ref={parentRef}
                        className="licenses-body"
                    >
                        {paddingTop > 0 && (
                            <tr style={{ height: `${paddingTop}px` }}> {/* Top Spacer */} </tr>
                        )}

                        {items.map((virtualRow) => {
                            const lic = licenses[virtualRow.index];
                            return (
                                <LicenseRow
                                    key={lic.key}
                                    lic={lic}
                                    updateStatus={handleUpdateStatus}
                                    deleteLicense={handleDeleteLicense}
                                />
                            );
                        })}

                        {paddingBottom > 0 && (
                            <tr style={{ height: `${paddingBottom}px` }}> {/* Bottom Spacer */} </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
