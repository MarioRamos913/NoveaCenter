import { z } from 'zod';

export const createUserSchema = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(6), // Password strength validation can be enhanced
    role: z.enum(['admin', 'user']),
});

export const updateUserSchema = z.object({
    username: z.string().min(3).max(50).optional(),
    password: z.string().min(6).optional(),
    role: z.enum(['admin', 'user']).optional(),
});
