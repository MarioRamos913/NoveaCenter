import { Request, Response } from 'express';
import { ResourceService } from './resource.service';
import { createResourceSchema, updateResourceSchema } from './resource.schema';

export class ResourceController {

    static async getAll(_req: Request, res: Response) {
        try {
            const resources = await ResourceService.getAll();
            return res.json(resources);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching resources' });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const resource = await ResourceService.getById(Number(id));
            if (!resource) {
                return res.status(404).json({ message: 'Resource not found' });
            }
            return res.json(resource);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching resource' });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const validation = createResourceSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ message: 'Validation error', errors: validation.error.format() });
            }
            const resource = await ResourceService.create(validation.data);
            return res.status(201).json(resource);
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error && error.message === 'Resource code already exists') {
                return res.status(409).json({ message: 'Resource code already exists' });
            }
            return res.status(500).json({ message: 'Error creating resource' });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const validation = updateResourceSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ message: 'Validation error', errors: validation.error.format() });
            }
            const resource = await ResourceService.update(Number(id), validation.data);
            if (!resource) {
                return res.status(404).json({ message: 'Resource not found' });
            }
            return res.json(resource);
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error && error.message === 'Resource code already exists') {
                return res.status(409).json({ message: 'Resource code already exists' });
            }
            return res.status(500).json({ message: 'Error updating resource' });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deleted = await ResourceService.delete(Number(id));
            if (!deleted) {
                return res.status(404).json({ message: 'Resource not found' });
            }
            return res.json({ message: 'Resource deleted' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error deleting resource' });
        }
    }
}
