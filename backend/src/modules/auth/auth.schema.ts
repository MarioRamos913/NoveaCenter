import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(6),
});
