import { pool } from '../../config/database';
import { QueryResult } from 'pg';

export interface IRole {
    id: number;
    name: string;
    description: string | null;
    created_at: Date;
}

export type CreateRoleDTO = Pick<IRole, 'name' | 'description'>;
export type UpdateRoleDTO = Partial<Pick<IRole, 'name' | 'description'>>;

export interface IRoleWithResources extends IRole {
    resources: { id: number; name: string; code: string; route: string; description: string | null }[];
}

export class RoleModel {
    static async create(role: CreateRoleDTO): Promise<IRole> {
        const result: QueryResult<IRole> = await pool.query(
            'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *',
            [role.name, role.description || null]
        );
        return result.rows[0];
    }

    static async findById(id: number): Promise<IRole | undefined> {
        const result: QueryResult<IRole> = await pool.query(
            'SELECT * FROM roles WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    static async findByName(name: string): Promise<IRole | undefined> {
        const result: QueryResult<IRole> = await pool.query(
            'SELECT * FROM roles WHERE name = $1',
            [name]
        );
        return result.rows[0];
    }

    static async getAll(): Promise<IRole[]> {
        const result: QueryResult<IRole> = await pool.query(
            'SELECT * FROM roles ORDER BY created_at ASC'
        );
        return result.rows;
    }

    static async update(id: number, data: UpdateRoleDTO): Promise<IRole | undefined> {
        const fields: string[] = [];
        const values: (string | null)[] = [];
        let paramIndex = 1;

        if (data.name !== undefined) {
            fields.push(`name = $${paramIndex++}`);
            values.push(data.name);
        }
        if (data.description !== undefined) {
            fields.push(`description = $${paramIndex++}`);
            values.push(data.description);
        }

        if (fields.length === 0) return this.findById(id);

        values.push(String(id));
        const result: QueryResult<IRole> = await pool.query(
            `UPDATE roles SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            values
        );
        return result.rows[0];
    }

    static async delete(id: number): Promise<boolean> {
        const result = await pool.query('DELETE FROM roles WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
    }

    static async getWithResources(id: number): Promise<IRoleWithResources | undefined> {
        const roleResult = await this.findById(id);
        if (!roleResult) return undefined;

        const resourcesResult = await pool.query(
            `SELECT r.id, r.name, r.code, r.route, r.description
             FROM resources r
             JOIN role_resources rr ON rr.resource_id = r.id
             WHERE rr.role_id = $1
             ORDER BY r.name ASC`,
            [id]
        );

        return {
            ...roleResult,
            resources: resourcesResult.rows,
        };
    }

    static async assignResources(roleId: number, resourceIds: number[]): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query('DELETE FROM role_resources WHERE role_id = $1', [roleId]);
            for (const resourceId of resourceIds) {
                await client.query(
                    'INSERT INTO role_resources (role_id, resource_id) VALUES ($1, $2)',
                    [roleId, resourceId]
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

    static async getResourcesForRole(roleId: number): Promise<{ id: number; name: string; code: string; route: string; description: string | null }[]> {
        const result = await pool.query(
            `SELECT r.id, r.name, r.code, r.route, r.description
             FROM resources r
             JOIN role_resources rr ON rr.resource_id = r.id
             WHERE rr.role_id = $1
             ORDER BY r.name ASC`,
            [roleId]
        );
        return result.rows;
    }
}
