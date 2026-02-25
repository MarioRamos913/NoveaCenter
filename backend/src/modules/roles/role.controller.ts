import { Request, Response } from 'express';
import { RoleService } from './role.service';
import { createRoleSchema, updateRoleSchema, assignResourcesSchema } from './role.schema';

export class RoleController {

    static async getAll(_req: Request, res: Response) {
        try {
            const roles = await RoleService.getAll();
            return res.json(roles);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching roles' });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const role = await RoleService.getWithResources(Number(id));
            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }
            return res.json(role);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching role' });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const validation = createRoleSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ message: 'Validation error', errors: validation.error.format() });
            }
            const role = await RoleService.create(validation.data);
            return res.status(201).json(role);
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error && error.message === 'Role name already exists') {
                return res.status(409).json({ message: 'Role name already exists' });
            }
            return res.status(500).json({ message: 'Error creating role' });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const validation = updateRoleSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ message: 'Validation error', errors: validation.error.format() });
            }
            const role = await RoleService.update(Number(id), validation.data);
            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }
            return res.json(role);
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error && error.message === 'Role name already exists') {
                return res.status(409).json({ message: 'Role name already exists' });
            }
            return res.status(500).json({ message: 'Error updating role' });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deleted = await RoleService.delete(Number(id));
            if (!deleted) {
                return res.status(404).json({ message: 'Role not found' });
            }
            return res.json({ message: 'Role deleted' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error deleting role' });
        }
    }

    static async assignResources(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const validation = assignResourcesSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ message: 'Validation error', errors: validation.error.format() });
            }
            const role = await RoleService.assignResources(Number(id), validation.data.resourceIds);
            return res.json(role);
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error && error.message === 'Role not found') {
                return res.status(404).json({ message: 'Role not found' });
            }
            return res.status(500).json({ message: 'Error assigning resources' });
        }
    }
}
