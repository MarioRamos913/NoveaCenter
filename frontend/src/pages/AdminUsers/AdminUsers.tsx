import { useState, useEffect } from 'react';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import type { User, CreateUserRequest } from '../../models/User';
import type { Role } from '../../models/Role';
import '../Admin/Admin.css';

const AdminUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showRolesModal, setShowRolesModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

    // Form state
    const [formUsername, setFormUsername] = useState('');
    const [formPassword, setFormPassword] = useState('');
    const [formRole, setFormRole] = useState<'admin' | 'user'>('user');

    const loadData = async () => {
        try {
            setLoading(true);
            const [usersData, rolesData] = await Promise.all([
                UserService.getAll(),
                RoleService.getAll()
            ]);
            setUsers(usersData);
            setRoles(rolesData);
        } catch (err) {
            setError('Error al cargar datos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const openCreateModal = () => {
        setEditingUser(null);
        setFormUsername('');
        setFormPassword('');
        setFormRole('user');
        setShowModal(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setFormUsername(user.username);
        setFormPassword('');
        setFormRole(user.roles.some(r => r.name === 'admin') ? 'admin' : 'user');
        setShowModal(true);
    };

    const handleSubmit = async () => {
        try {
            setError('');
            if (editingUser) {
                await UserService.update(editingUser.id, {
                    username: formUsername,
                    role: formRole,
                    ...(formPassword ? { password: formPassword } : {}),
                });
            } else {
                const payload: CreateUserRequest = {
                    username: formUsername,
                    password: formPassword,
                    role: formRole,
                };
                await UserService.create(payload);
            }
            setShowModal(false);
            await loadData();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Error al guardar';
            setError(msg);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
        try {
            await UserService.delete(id);
            await loadData();
        } catch (err) {
            console.error(err);
            setError('Error al eliminar');
        }
    };

    const openRolesModal = (user: User) => {
        setSelectedUserId(user.id);
        setSelectedRoleIds(user.roles.map(r => r.id));
        setShowRolesModal(true);
    };

    const handleAssignRoles = async () => {
        if (!selectedUserId) return;
        try {
            await UserService.assignRoles(selectedUserId, selectedRoleIds);
            setShowRolesModal(false);
            await loadData();
        } catch (err) {
            console.error(err);
            setError('Error al asignar roles');
        }
    };

    const toggleRoleSelection = (roleId: number) => {
        setSelectedRoleIds(prev =>
            prev.includes(roleId)
                ? prev.filter(id => id !== roleId)
                : [...prev, roleId]
        );
    };

    if (loading) return <div className="admin-empty"><div className="admin-empty-icon">⏳</div></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h2>Gestión de Usuarios</h2>
                <button className="admin-btn admin-btn-primary" onClick={openCreateModal}>
                    + Nuevo Usuario
                </button>
            </div>

            {error && <div className="admin-error">{error}</div>}

            <div className="admin-table-wrapper">
                {users.length === 0 ? (
                    <div className="admin-empty">
                        <div className="admin-empty-icon">👥</div>
                        <div className="admin-empty-text">No hay usuarios registrados</div>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Usuario</th>
                                <th>Roles</th>
                                <th>Creado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td style={{ fontWeight: 600, color: 'var(--color-text)' }}>{u.username}</td>
                                    <td>
                                        {u.roles.map(r => (
                                            <span key={r.id} className="admin-badge admin-badge-purple">
                                                {r.name}
                                            </span>
                                        ))}
                                    </td>
                                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div className="admin-table-actions">
                                            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openEditModal(u)}>
                                                ✏️ Editar
                                            </button>
                                            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openRolesModal(u)}>
                                                🛡️ Roles
                                            </button>
                                            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(u.id)}>
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
                        <h3>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
                        <div className="admin-form-group">
                            <label>Nombre de Usuario</label>
                            <input
                                className="admin-input"
                                value={formUsername}
                                onChange={e => setFormUsername(e.target.value)}
                                placeholder="Ingresa nombre de usuario"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label>{editingUser ? 'Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}</label>
                            <input
                                className="admin-input"
                                type="password"
                                value={formPassword}
                                onChange={e => setFormPassword(e.target.value)}
                                placeholder={editingUser ? 'Opcional' : 'Ingresa contraseña'}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label>Rol Base</label>
                            <select className="admin-select" value={formRole} onChange={e => setFormRole(e.target.value as 'admin' | 'user')}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="admin-modal-actions">
                            <button className="admin-btn admin-btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                            <button className="admin-btn admin-btn-primary" onClick={handleSubmit}>
                                {editingUser ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Asignar Roles */}
            {showRolesModal && (
                <div className="admin-modal-backdrop" onClick={() => setShowRolesModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h3>Asignar Roles</h3>
                        <div className="admin-checkbox-list">
                            {roles.map(role => (
                                <label key={role.id} className="admin-checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoleIds.includes(role.id)}
                                        onChange={() => toggleRoleSelection(role.id)}
                                    />
                                    {role.name}
                                    {role.description && (
                                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>
                                            — {role.description}
                                        </span>
                                    )}
                                </label>
                            ))}
                        </div>
                        <div className="admin-modal-actions">
                            <button className="admin-btn admin-btn-ghost" onClick={() => setShowRolesModal(false)}>Cancelar</button>
                            <button className="admin-btn admin-btn-primary" onClick={handleAssignRoles}>Guardar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
