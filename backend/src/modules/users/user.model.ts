import { pool } from '../../config/database';
import { QueryResult } from 'pg';

export interface IUser {
    id: number;
    username: string;
    password?: string;
    role: 'admin' | 'user';
    created_at: Date;
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
        let params: any[] = [username, role, id];

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
}
