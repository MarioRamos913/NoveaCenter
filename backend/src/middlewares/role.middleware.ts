import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

/**
 * Middleware factory que verifica si el usuario tiene al menos uno de los roles permitidos.
 * Ahora lee desde req.user.roles (array) en vez de req.user.role (string).
 */
export const authorize = (allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
             return res.status(401).json({ message: 'User not authenticated' });
        }

        const userRoles: string[] = req.user.roles || [];
        const hasRole = userRoles.some(role => allowedRoles.includes(role));

        if (!hasRole) {
            return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
        }

        next();
    };
};
