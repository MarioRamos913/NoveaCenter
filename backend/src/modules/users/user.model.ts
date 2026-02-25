import { pool } from '../../config/database';
import { QueryResult } from 'pg';

export interface IUser {
    id: number;
    username: string;
    password?: string;
    role: 'admin' | 'user'; // Mantenido por compatibilidad
    created_at: Date;
}

export interface IUserWithRoles extends Omit<IUser, 'password'> {
    roles: { id: number; name: string }[];
}

export type CreateUserDTO = Omit<IUser, 'id' | 'created_at'>;

export class UserModel {
    static async create(user: CreateUserDTO): Promise<IUser> {
        const { username, password, role } = user;
        const result: QueryResult<IUser> = await pool.query(
            'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role, created_at',
            [username, password, role]
        );
        return result.rows[0];
    }

    static async findByUsername(username: string): Promise<IUser | undefined> {
        const result: QueryResult<IUser> = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return result.rows[0];
    }

    static async findById(id: number): Promise<IUser | undefined> {
        const result: QueryResult<IUser> = await pool.query('SELECT id, username, role, created_at FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async getAll(): Promise<IUser[]> {
        const result: QueryResult<IUser> = await pool.query('SELECT id, username, role, created_at FROM users ORDER BY created_at DESC');
        return result.rows;
    }

    static async update(id: number, username: string, role: 'admin' | 'user', password?: string): Promise<IUser | undefined> {
        let query = 'UPDATE users SET username = $1, role = $2 WHERE id = $3 RETURNING id, username, role, created_at';
        let params: (string | number)[] = [username, role, id];

        if (password) {
            query = 'UPDATE users SET username = $1, role = $2, password = $3 WHERE id = $4 RETURNING id, username, role, created_at';
            params = [username, role, password, id];
        }

        const result: QueryResult<IUser> = await pool.query(query, params);
        return result.rows[0];
    }

    static async delete(id: number): Promise<boolean> {
        const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
    }

    // ---- RBAC: métodos para roles ----

    static async getRolesForUser(userId: number): Promise<{ id: number; name: string }[]> {
        const result = await pool.query(
            `SELECT r.id, r.name FROM roles r
             JOIN user_roles ur ON ur.role_id = r.id
             WHERE ur.user_id = $1
             ORDER BY r.name ASC`,
            [userId]
        );
        return result.rows;
    }

    static async getPermissionsForUser(userId: number): Promise<string[]> {
        const result = await pool.query(
            `SELECT DISTINCT res.code FROM resources res
             JOIN role_resources rr ON rr.resource_id = res.id
             JOIN user_roles ur ON ur.role_id = rr.role_id
             WHERE ur.user_id = $1`,
            [userId]
        );
        return result.rows.map((row: { code: string }) => row.code);
    }

    static async getUserWithRoles(userId: number): Promise<IUserWithRoles | undefined> {
        const user = await this.findById(userId);
        if (!user) return undefined;

        const roles = await this.getRolesForUser(userId);
        const { password: _, ...userWithoutPassword } = user;

        return {
            ...userWithoutPassword,
            roles,
        };
    }

    static async getAllWithRoles(): Promise<IUserWithRoles[]> {
        const users = await this.getAll();
        const result: IUserWithRoles[] = [];

        for (const user of users) {
            const roles = await this.getRolesForUser(user.id);
            result.push({ ...user, roles });
        }

        return result;
    }

    static async assignRoles(userId: number, roleIds: number[]): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query('DELETE FROM user_roles WHERE user_id = $1', [userId]);
            for (const roleId of roleIds) {
                await client.query(
                    'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
                    [userId, roleId]
                );
            }
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}
