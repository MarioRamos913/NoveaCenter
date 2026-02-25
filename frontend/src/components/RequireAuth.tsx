import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface RequireAuthProps {
    allowedRoles?: string[];
    requiredPermissions?: string[];
}

const RequireAuth = ({ allowedRoles, requiredPermissions }: RequireAuthProps) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // Verificar roles si se especifican
    if (allowedRoles && allowedRoles.length > 0) {
        const hasRole = user.roles.some(role => allowedRoles.includes(role));
        if (!hasRole) {
            return <Navigate to="/dashboard" replace />;
        }
    }

    // Verificar permisos si se especifican
    if (requiredPermissions && requiredPermissions.length > 0) {
        const hasPermission = requiredPermissions.every(p => user.permissions.includes(p));
        if (!hasPermission) {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <Outlet />;
};

export default RequireAuth;
