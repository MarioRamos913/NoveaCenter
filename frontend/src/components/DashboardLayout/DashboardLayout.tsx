import { useEffect, useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { AuthService } from '../../services/auth.service';
import { MenuService } from '../../services/menu.service';
import type { MenuItem } from '../../models/MenuItem';
import './DashboardLayout.css';

const ICON_MAP: Record<string, string> = {
    dashboard: '🏠',
    licenses: '🔑',
    users: '👥',
    roles: '🛡️',
    resources: '📦',
};

const DashboardLayout = () => {
    const { user } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMenu = async () => {
            try {
                const items = await MenuService.getMenu();
                setMenuItems(items);
            } catch (error) {
                console.error('Error loading menu:', error);
            } finally {
                setLoading(false);
            }
        };
        loadMenu();
    }, []);

    const handleLogout = async () => {
        try {
            await AuthService.logout();
        } finally {
            navigate('/login');
        }
    };

    const getPageTitle = (): string => {
        const currentItem = menuItems.find(item => location.pathname === item.route);
        return currentItem?.name || 'Dashboard';
    };

    const userInitial = user?.username?.charAt(0).toUpperCase() || 'U';
    const userRoles = user?.roles?.join(', ') || '';

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <div className="sidebar-logo-icon">N</div>
                        <span className="sidebar-logo-text">NovaCenter</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <p className="sidebar-nav-label">Navegación</p>

                    {loading ? (
                        <div style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                            Cargando...
                        </div>
                    ) : (
                        menuItems.map((item) => (
                            <NavLink
                                key={item.code}
                                to={item.route}
                                className={({ isActive }) =>
                                    `sidebar-link${isActive ? ' active' : ''}`
                                }
                                end={item.route === '/dashboard'}
                            >
                                <span className="sidebar-link-icon">
                                    {ICON_MAP[item.code] || '📄'}
                                </span>
                                {item.name}
                            </NavLink>
                        ))
                    )}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-avatar">{userInitial}</div>
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name">{user?.username}</div>
                            <div className="sidebar-user-role">{userRoles}</div>
                        </div>
                        <button
                            className="sidebar-logout-btn"
                            onClick={handleLogout}
                            title="Cerrar sesión"
                        >
                            ⏻
                        </button>
                    </div>
                </div>
            </aside>

            <main className="main-content">
                <div className="main-topbar">
                    <h1 className="main-topbar-title">{getPageTitle()}</h1>
                </div>
                <div className="main-page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
