import { useState, useEffect } from 'react';
import { ResourceService } from '../../services/resource.service';
import type { Resource, CreateResourceRequest } from '../../models/Resource';
import '../Admin/Admin.css';

const AdminResources = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);

    // Form state
    const [formName, setFormName] = useState('');
    const [formCode, setFormCode] = useState('');
    const [formRoute, setFormRoute] = useState('');
    const [formDescription, setFormDescription] = useState('');

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await ResourceService.getAll();
            setResources(data);
        } catch (err) {
            setError('Error al cargar recursos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const openCreateModal = () => {
        setEditingResource(null);
        setFormName('');
        setFormCode('');
        setFormRoute('');
        setFormDescription('');
        setShowModal(true);
    };

    const openEditModal = (resource: Resource) => {
        setEditingResource(resource);
        setFormName(resource.name);
        setFormCode(resource.code);
        setFormRoute(resource.route || '');
        setFormDescription(resource.description || '');
        setShowModal(true);
    };

    const handleSubmit = async () => {
        try {
            setError('');
            if (editingResource) {
                await ResourceService.update(editingResource.id, {
                    name: formName,
                    code: formCode,
                    route: formRoute,
                    description: formDescription,
                });
            } else {
                const payload: CreateResourceRequest = {
                    name: formName,
                    code: formCode,
                    route: formRoute,
                    description: formDescription,
                };
                await ResourceService.create(payload);
            }
            setShowModal(false);
            await loadData();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Error al guardar';
            setError(msg);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de eliminar este recurso?')) return;
        try {
            await ResourceService.delete(id);
            await loadData();
        } catch (err) {
            console.error(err);
            setError('Error al eliminar');
        }
    };

    if (loading) return <div className="admin-empty"><div className="admin-empty-icon">⏳</div></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h2>Gestión de Recursos</h2>
                <button className="admin-btn admin-btn-primary" onClick={openCreateModal}>
                    + Nuevo Recurso
                </button>
            </div>

            {error && <div className="admin-error">{error}</div>}

            <div className="admin-table-wrapper">
                {resources.length === 0 ? (
                    <div className="admin-empty">
                        <div className="admin-empty-icon">📦</div>
                        <div className="admin-empty-text">No hay recursos registrados</div>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Código</th>
                                <th>Ruta</th>
                                <th>Descripción</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resources.map(r => (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td style={{ fontWeight: 600, color: 'var(--color-text)' }}>{r.name}</td>
                                    <td><span className="admin-badge admin-badge-blue">{r.code}</span></td>
                                    <td>{r.route || '—'}</td>
                                    <td>{r.description || '—'}</td>
                                    <td>
                                        <div className="admin-table-actions">
                                            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openEditModal(r)}>
                                                ✏️ Editar
                                            </button>
                                            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(r.id)}>
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal Crear/Editar */}
            {showModal && (
                <div className="admin-modal-backdrop" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h3>{editingResource ? 'Editar Recurso' : 'Nuevo Recurso'}</h3>
                        <div className="admin-form-group">
                            <label>Nombre</label>
                            <input
                                className="admin-input"
                                value={formName}
                                onChange={e => setFormName(e.target.value)}
                                placeholder="Nombre del recurso"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label>Código</label>
                            <input
                                className="admin-input"
                                value={formCode}
                                onChange={e => setFormCode(e.target.value)}
                                placeholder="Código único (ej: dashboard)"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label>Ruta</label>
                            <input
                                className="admin-input"
                                value={formRoute}
                                onChange={e => setFormRoute(e.target.value)}
                                placeholder="Ruta del frontend (ej: /dashboard/reports)"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label>Descripción</label>
                            <input
                                className="admin-input"
                                value={formDescription}
                                onChange={e => setFormDescription(e.target.value)}
                                placeholder="Descripción del recurso"
                            />
                        </div>
                        <div className="admin-modal-actions">
                            <button className="admin-btn admin-btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                            <button className="admin-btn admin-btn-primary" onClick={handleSubmit}>
                                {editingResource ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminResources;
