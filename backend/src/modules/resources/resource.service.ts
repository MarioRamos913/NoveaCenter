import { ResourceModel, CreateResourceDTO, UpdateResourceDTO, IResource } from './resource.model';

export class ResourceService {
    static async getAll(): Promise<IResource[]> {
        return await ResourceModel.getAll();
    }

    static async getById(id: number): Promise<IResource | undefined> {
        return await ResourceModel.findById(id);
    }

    static async create(data: CreateResourceDTO): Promise<IResource> {
        const existing = await ResourceModel.findByCode(data.code);
        if (existing) {
            throw new Error('Resource code already exists');
        }
        return await ResourceModel.create(data);
    }

    static async update(id: number, data: UpdateResourceDTO): Promise<IResource | undefined> {
        if (data.code) {
            const existing = await ResourceModel.findByCode(data.code);
            if (existing && existing.id !== id) {
                throw new Error('Resource code already exists');
            }
        }
        return await ResourceModel.update(id, data);
    }

    static async delete(id: number): Promise<boolean> {
        return await ResourceModel.delete(id);
    }
}
