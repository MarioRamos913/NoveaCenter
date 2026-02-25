import { z } from 'zod';

export const createRoleSchema = z.object({
    name: z.string().min(2).max(50),
    description: z.string().max(255).optional().default(''),
});

export const updateRoleSchema = z.object({
    name: z.string().min(2).max(50).optional(),
    description: z.string().max(255).optional(),
});

export const assignResourcesSchema = z.object({
    resourceIds: z.array(z.number().int().positive()),
});
