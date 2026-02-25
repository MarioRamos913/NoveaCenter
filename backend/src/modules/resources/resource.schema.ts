import { z } from 'zod';

export const createResourceSchema = z.object({
    name: z.string().min(2).max(100),
    code: z.string().min(2).max(100),
    route: z.string().max(255).optional().default(''),
    description: z.string().max(255).optional().default(''),
});

export const updateResourceSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    code: z.string().min(2).max(100).optional(),
    route: z.string().max(255).optional(),
    description: z.string().max(255).optional(),
});
