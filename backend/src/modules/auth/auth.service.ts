import bcrypt from 'bcrypt';
import { pool } from '../../config/database';
import { UserService } from '../users/user.service';
import { CreateUserDTO, IUser } from '../users/user.model';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from './auth.utils';
import { QueryResult } from 'pg';

export class AuthService {
    
    static async register(userData: CreateUserDTO) {
        return await UserService.create(userData);
    }

    static async login(username: string, password: string): Promise<{ user: IUser, accessToken: string, refreshToken: string } | null> {
        const user = await UserService.findByUsername(username);
        if (!user || user.password === undefined) {
             return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Store refresh token
        // Calculate expiration date (7 days from now)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await pool.query(
            'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
            [user.id, refreshToken, expiresAt]
        );

        // Remove password from user object before returning
        const { password: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword as IUser, // Cast back to IUser but it's safe
            accessToken,
            refreshToken
        };
    }

    static async refresh(token: string): Promise<{ accessToken: string, refreshToken: string } | null> {
        try {
            const decoded = verifyRefreshToken(token) as any;
            
            // Check if token exists in DB
            const result: QueryResult = await pool.query(
                'SELECT * FROM refresh_tokens WHERE token = $1 AND user_id = $2',
                [token, decoded.id]
            );

            if (result.rows.length === 0) {
                return null;
            }

            const storedToken = result.rows[0];
            // Check if expired in DB (though verify checks signature expiration)
            if (new Date() > new Date(storedToken.expires_at)) {
                await this.logout(token); // Cleanup
                return null;
            }

            const user = await UserService.findById(decoded.id);
            if (!user) return null;

            // Rotate tokens (optional but recommended: delete old, create new)
            await this.logout(token);

            const newAccessToken = generateAccessToken(user);
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
