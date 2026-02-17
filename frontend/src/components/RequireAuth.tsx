import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface RequireAuthProps {
    allowedRoles?: string[];
}

export const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to dashboard if role not allowed, or a specific unauthorized page
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
