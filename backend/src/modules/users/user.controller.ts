import { Request, Response } from 'express';
import { UserService } from './user.service';
import { createUserSchema, updateUserSchema } from './user.schema';

export class UserController {
    
    // Admin only: Get all users
    static async getAll(req: Request, res: Response) {
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
        } catch (error: any) {
            console.error(error);
            if (error.message === 'Username already exists') {
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
                 // Although optional in schema for partial updates, existing logic required them. 
                 // Updating logic to align with schema: if provided, update.
                 // Actually, schema made them optional, but let's check if we strictly require them for PUT or allow PATCH? 
                 // Assuming PUT-like behavior or strict update based on previous code.
                 // Previous code: if (!username || !role) return 400.
                 // Let's enforce them if we want to follow previous strictness, or allow partial if we want PATCH.
                 // Let's assume strict update for now as per previous code, but ensure types match.
                 if (!username || !role) {
                     return res.status(400).json({ message: 'Missing required fields' });
                 }
                 
                 const updatedUser = await UserService.update(Number(id), username, role, password);
                 if (!updatedUser) {
                    return res.status(404).json({ message: 'User not found' });
                 }
    
                 return res.json(updatedUser);
            }
            // This unreachable code block handles the case where username/role might be missing if we used partial schema
            return res.status(400).json({ message: 'Invalid update data' });

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
}
