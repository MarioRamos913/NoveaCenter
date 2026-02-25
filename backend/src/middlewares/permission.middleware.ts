import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

/**
 * Middleware factory que verifica si el usuario tiene permiso a un recurso específico
 * basándose en los permissions (resource codes) almacenados en el JWT.
 */
export const requirePermission = (resourceCode: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const permissions: string[] = req.user.permissions || [];

        if (!permissions.includes(resourceCode)) {
            return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
        }

        next();
    };
};
