import { pool } from '../../config/database';
import { QueryResult } from 'pg';

export interface IResource {
    id: number;
    name: string;
    code: string;
    route: string | null;
    description: string | null;
    created_at: Date;
}

export type CreateResourceDTO = Pick<IResource, 'name' | 'code' | 'route' | 'description'>;
export type UpdateResourceDTO = Partial<CreateResourceDTO>;

export class ResourceModel {
    static async create(resource: CreateResourceDTO): Promise<IResource> {
        const result: QueryResult<IResource> = await pool.query(
            'INSERT INTO resources (name, code, route, description) VALUES ($1, $2, $3, $4) RETURNING *',
            [resource.name, resource.code, resource.route || null, resource.description || null]
        );
        return result.rows[0];
    }

    static async findById(id: number): Promise<IResource | undefined> {
        const result: QueryResult<IResource> = await pool.query(
            'SELECT * FROM resources WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    static async findByCode(code: string): Promise<IResource | undefined> {
        const result: QueryResult<IResource> = await pool.query(
            'SELECT * FROM resources WHERE code = $1',
            [code]
        );
        return result.rows[0];
    }

    static async getAll(): Promise<IResource[]> {
        const result: QueryResult<IResource> = await pool.query(
            'SELECT * FROM resources ORDER BY name ASC'
        );
        return result.rows;
    }

    static async update(id: number, data: UpdateResourceDTO): Promise<IResource | undefined> {
        const fields: string[] = [];
        const values: (string | null)[] = [];
        let paramIndex = 1;

        if (data.name !== undefined) {
            fields.push(`name = $${paramIndex++}`);
            values.push(data.name);
        }
        if (data.code !== undefined) {
            fields.push(`code = $${paramIndex++}`);
            values.push(data.code);
        }
        if (data.route !== undefined) {
            fields.push(`route = $${paramIndex++}`);
            values.push(data.route);
        }
        if (data.description !== undefined) {
            fields.push(`description = $${paramIndex++}`);
            values.push(data.description);
        }

        if (fields.length === 0) return this.findById(id);

        values.push(String(id));
        const result: QueryResult<IResource> = await pool.query(
            `UPDATE resources SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            values
        );
        return result.rows[0];
    }

    static async delete(id: number): Promise<boolean> {
        const result = await pool.query('DELETE FROM resources WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
    }
}
