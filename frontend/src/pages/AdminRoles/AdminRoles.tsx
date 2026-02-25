import { useState, useEffect } from 'react';
import { RoleService } from '../../services/role.service';
import { ResourceService } from '../../services/resource.service';
import type { Role, RoleWithResources, CreateRoleRequest } from '../../models/Role';
import type { Resource } from '../../models/Resource';
import '../Admin/Admin.css';

const AdminRoles = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showResourcesModal, setShowResourcesModal] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const [selectedResourceIds, setSelectedResourceIds] = useState<number[]>([]);

    // Form state
    const [formName, setFormName] = useState('');
    const [formDescription, setFormDescription] = useState('');

    const loadData = async () => {
        try {
            setLoading(true);
            const [rolesData, resourcesData] = await Promise.all([
                RoleService.getAll(),
                ResourceService.getAll()
            ]);
            setRoles(rolesData);
            setResources(resourcesData);
        } catch (err) {
            setError('Error al cargar datos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const openCreateModal = () => {
        setEditingRole(null);
        setFormName('');
        setFormDescription('');
        setShowModal(true);
    };

    const openEditModal = (role: Role) => {
        setEditingRole(role);
        setFormName(role.name);
        setFormDescription(role.description || '');
        setShowModal(true);
    };

    const handleSubmit = async () => {
        try {
            setError('');
            if (editingRole) {
                await RoleService.update(editingRole.id, { name: formName, description: formDescription });
            } else {
                const payload: CreateRoleRequest = { name: formName, description: formDescription };
                await RoleService.create(payload);
            }
            setShowModal(false);
            await loadData();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Error al guardar';
            setError(msg);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de eliminar este rol?')) return;
        try {
            await RoleService.delete(id);
            await loadData();
        } catch (err) {
            console.error(err);
            setError('Error al eliminar');
        }
    };

    const openResourcesModal = async (role: Role) => {
        try {
            const roleWithResources: RoleWithResources = await RoleService.getById(role.id);
            setSelectedRoleId(role.id);
            setSelectedResourceIds(roleWithResources.resources.map(r => r.id));
            setShowResourcesModal(true);
        } catch (err) {
            console.error(err);
            setError('Error al cargar recursos del rol');
        }
    };

    const handleAssignResources = async () => {
        if (!selectedRoleId) return;
        try {
            await RoleService.assignResources(selectedRoleId, selectedResourceIds);
            setShowResourcesModal(false);
            await loadData();
        } catch (err) {
            console.error(err);
            setError('Error al asignar recursos');
        }
    };

    const toggleResourceSelection = (resourceId: number) => {
        setSelectedResourceIds(prev =>
            prev.includes(resourceId)
                ? prev.filter(id => id !== resourceId)
                : [...prev, resourceId]
        );
    };

    if (loading) return <div className="admin-empty"><div className="admin-empty-icon">⏳</div></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h2>Gestión de Roles</h2>
                <button className="admin-btn admin-btn-primary" onClick={openCreateModal}>
                    + Nuevo Rol
                </button>
            </div>

            {error && <div className="admin-error">{error}</div>}

            <div className="admin-table-wrapper">
                {roles.length === 0 ? (
                    <div className="admin-empty">
                        <div className="admin-empty-icon">🛡️</div>
                        <div className="admin-empty-text">No hay roles registrados</div>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Creado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map(r => (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td style={{ fontWeight: 600, color: 'var(--color-text)' }}>{r.name}</td>
                                    <td>{r.description || '—'}</td>
                                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div className="admin-table-actions">
                                            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openEditModal(r)}>
                                                ✏️ Editar
                                            </button>
                                            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openResourcesModal(r)}>
                                                📦 Recursos
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
                        <h3>{editingRole ? 'Editar Rol' : 'Nuevo Rol'}</h3>
                        <div className="admin-form-group">
                            <label>Nombre</label>
                            <input
                                className="admin-input"
                                value={formName}
                                onChange={e => setFormName(e.target.value)}
                                placeholder="Nombre del rol"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label>Descripción</label>
                            <input
                                className="admin-input"
                                value={formDescription}
                                onChange={e => setFormDescription(e.target.value)}
                                placeholder="Descripción del rol"
                            />
                        </div>
                        <div className="admin-modal-actions">
                            <button className="admin-btn admin-btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                            <button className="admin-btn admin-btn-primary" onClick={handleSubmit}>
                                {editingRole ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Asignar Recursos */}
            {showResourcesModal && (
                <div className="admin-modal-backdrop" onClick={() => setShowResourcesModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h3>Asignar Recursos al Rol</h3>
                        <div className="admin-checkbox-list">
                            {resources.map(resource => (
                                <label key={resource.id} className="admin-checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedResourceIds.includes(resource.id)}
                                        onChange={() => toggleResourceSelection(resource.id)}
                                    />
                                    <span>{resource.name}</span>
                                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                                        ({resource.code})
                                    </span>
                                </label>
                            ))}
                        </div>
                        <div className="admin-modal-actions">
                            <button className="admin-btn admin-btn-ghost" onClick={() => setShowResourcesModal(false)}>Cancelar</button>
                            <button className="admin-btn admin-btn-primary" onClick={handleAssignResources}>Guardar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRoles;
