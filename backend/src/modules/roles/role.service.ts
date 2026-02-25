import { RoleModel, CreateRoleDTO, UpdateRoleDTO, IRole, IRoleWithResources } from './role.model';

export class RoleService {
    static async getAll(): Promise<IRole[]> {
        return await RoleModel.getAll();
    }

    static async getById(id: number): Promise<IRole | undefined> {
        return await RoleModel.findById(id);
    }

    static async getWithResources(id: number): Promise<IRoleWithResources | undefined> {
        return await RoleModel.getWithResources(id);
    }

    static async create(data: CreateRoleDTO): Promise<IRole> {
        const existing = await RoleModel.findByName(data.name);
        if (existing) {
            throw new Error('Role name already exists');
        }
        return await RoleModel.create(data);
    }

    static async update(id: number, data: UpdateRoleDTO): Promise<IRole | undefined> {
        if (data.name) {
            const existing = await RoleModel.findByName(data.name);
            if (existing && existing.id !== id) {
                throw new Error('Role name already exists');
            }
        }
        return await RoleModel.update(id, data);
    }

    static async delete(id: number): Promise<boolean> {
        return await RoleModel.delete(id);
    }

    static async assignResources(roleId: number, resourceIds: number[]): Promise<IRoleWithResources | undefined> {
        const role = await RoleModel.findById(roleId);
        if (!role) {
            throw new Error('Role not found');
        }
        await RoleModel.assignResources(roleId, resourceIds);
        return await RoleModel.getWithResources(roleId);
    }
}
