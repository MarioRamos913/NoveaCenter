import jwt from 'jsonwebtoken';
import { pool } from '../../config/database';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret';

interface TokenUser {
    id: number;
    username: string;
}

/**
 * Consulta los roles y permisos (resource codes) de un usuario desde la base de datos.
 */
export const getUserRolesAndPermissions = async (userId: number): Promise<{ roles: string[]; permissions: string[] }> => {
    // Obtener nombres de roles del usuario
    const rolesResult = await pool.query(
        `SELECT r.name FROM roles r
         JOIN user_roles ur ON ur.role_id = r.id
         WHERE ur.user_id = $1`,
        [userId]
    );
    const roles = rolesResult.rows.map((row: { name: string }) => row.name);

    // Obtener códigos de recursos accesibles a través de los roles
    const permissionsResult = await pool.query(
        `SELECT DISTINCT res.code FROM resources res
         JOIN role_resources rr ON rr.resource_id = res.id
         JOIN user_roles ur ON ur.role_id = rr.role_id
         WHERE ur.user_id = $1`,
        [userId]
    );
    const permissions = permissionsResult.rows.map((row: { code: string }) => row.code);

    return { roles, permissions };
};

export const generateAccessToken = async (user: TokenUser): Promise<string> => {
    const { roles, permissions } = await getUserRolesAndPermissions(user.id);
    return jwt.sign(
        { id: user.id, username: user.username, roles, permissions },
        JWT_SECRET,
        { expiresIn: '15m' }
    );
};

export const generateRefreshToken = (user: TokenUser): string => {
    return jwt.sign(
        { id: user.id, username: user.username },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
