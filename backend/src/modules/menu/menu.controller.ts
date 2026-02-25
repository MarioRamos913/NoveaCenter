import { Response } from 'express';
import { pool } from '../../config/database';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class MenuController {
    static async getMenu(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'User not authenticated' });
            }

            // Consultar recursos accesibles para el usuario a través de sus roles
            const result = await pool.query(
                `SELECT DISTINCT r.name, r.code, r.route, r.description
                 FROM resources r
                 JOIN role_resources rr ON rr.resource_id = r.id
                 JOIN user_roles ur ON ur.role_id = rr.role_id
                 WHERE ur.user_id = $1
                 ORDER BY r.name ASC`,
                [userId]
            );

            return res.json(result.rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching menu' });
        }
    }
}
