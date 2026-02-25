import { Request, Response } from 'express';
import { UserService } from './user.service';
import { createUserSchema, updateUserSchema } from './user.schema';
import { z } from 'zod';

const assignRolesSchema = z.object({
    roleIds: z.array(z.number().int().positive()),
});

export class UserController {
    
    // Admin only: Get all users (con roles)
    static async getAll(_req: Request, res: Response) {
        try {
            const users = await UserService.getAll();
            return res.json(users);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching users' });
        }
    }

    // Admin only: Create user
    static async create(req: Request, res: Response) {
        try {
            const validation = createUserSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ message: 'Validation error', errors: validation.error.format() });
            }

            const newUser = await UserService.create(validation.data);
            return res.status(201).json(newUser);
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error && error.message === 'Username already exists') {
                return res.status(409).json({ message: 'Username already exists' });
            }
            return res.status(500).json({ message: 'Error creating user' });
        }
    }

    // Admin only: Update user
    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const validation = updateUserSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ message: 'Validation error', errors: validation.error.format() });
            }

            const { username, role, password } = validation.data;
            if (!username || !role) {
                return res.status(400).json({ message: 'Missing required fields: username and role' });
            }

            const updatedUser = await UserService.update(Number(id), username, role, password);
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Retornar usuario con roles
            const userWithRoles = await UserService.getUserWithRoles(Number(id));
            return res.json(userWithRoles);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error updating user' });
        }
    }

    // Admin only: Delete user
    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deleted = await UserService.delete(Number(id));
            if (!deleted) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.json({ message: 'User deleted' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error deleting user' });
        }
    }

    // Admin only: Assign roles to user
    static async assignRoles(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const validation = assignRolesSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ message: 'Validation error', errors: validation.error.format() });
            }

            const userWithRoles = await UserService.assignRoles(Number(id), validation.data.roleIds);
            if (!userWithRoles) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.json(userWithRoles);
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error && error.message === 'User not found') {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(500).json({ message: 'Error assigning roles' });
        }
    }
}
