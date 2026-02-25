import bcrypt from 'bcrypt';
import { pool } from '../../config/database';
import { UserService } from '../users/user.service';
import { CreateUserDTO, IUser } from '../users/user.model';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, getUserRolesAndPermissions } from './auth.utils';
import { QueryResult } from 'pg';

export class AuthService {
    
    static async register(userData: CreateUserDTO) {
        return await UserService.create(userData);
    }

    static async login(username: string, password: string): Promise<{ user: IUser & { roles: string[]; permissions: string[] }; accessToken: string; refreshToken: string } | null> {
        const user = await UserService.findByUsername(username);
        if (!user || user.password === undefined) {
             return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }

        // Generar tokens (accessToken ahora es async porque consulta roles/permisos)
        const accessToken = await generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Almacenar refresh token
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await pool.query(
            'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
            [user.id, refreshToken, expiresAt]
        );

        // Obtener roles y permisos para la respuesta
        const { roles, permissions } = await getUserRolesAndPermissions(user.id);

        // Remover password del usuario antes de retornar
        const { password: _, ...userWithoutPassword } = user;

        return {
            user: { ...userWithoutPassword, roles, permissions } as IUser & { roles: string[]; permissions: string[] },
            accessToken,
            refreshToken
        };
    }

    static async refresh(token: string): Promise<{ accessToken: string; refreshToken: string } | null> {
        try {
            const decoded = verifyRefreshToken(token) as { id: number; username: string };
            
            // Verificar que el token existe en la BD
            const result: QueryResult = await pool.query(
                'SELECT * FROM refresh_tokens WHERE token = $1 AND user_id = $2',
                [token, decoded.id]
            );

            if (result.rows.length === 0) {
                return null;
            }

            const storedToken = result.rows[0];
            if (new Date() > new Date(storedToken.expires_at)) {
                await this.logout(token);
                return null;
            }

            const user = await UserService.findById(decoded.id);
            if (!user) return null;

            // Rotar tokens
            await this.logout(token);

            const newAccessToken = await generateAccessToken(user);
            const newRefreshToken = generateRefreshToken(user);
            
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);

            await pool.query(
                'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
                [user.id, newRefreshToken, expiresAt]
            );

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            };

        } catch (error) {
            return null;
        }
    }

    static async logout(token: string): Promise<void> {
        await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
    }
}
