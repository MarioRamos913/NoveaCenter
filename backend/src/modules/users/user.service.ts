import { UserModel, CreateUserDTO, IUser, IUserWithRoles } from './user.model';
import bcrypt from 'bcrypt';

export class UserService {
    static async getAll(): Promise<IUserWithRoles[]> {
        return await UserModel.getAllWithRoles();
    }

    static async create(userData: CreateUserDTO): Promise<IUser> {
        const { username, password, role } = userData;

        const existing = await UserModel.findByUsername(username);
        if (existing) {
            throw new Error('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password!, 10);
        
        const user = await UserModel.create({
            username,
            password: hashedPassword,
            role
        });

        // Asignar rol correspondiente en la tabla user_roles
        const { pool } = await import('../../config/database');
        const roleResult = await pool.query('SELECT id FROM roles WHERE name = $1', [role]);
        if (roleResult.rows.length > 0) {
            await UserModel.assignRoles(user.id, [roleResult.rows[0].id]);
        }

        return user;
    }

    static async update(id: number, username: string, role: 'admin' | 'user', password?: string): Promise<IUser | undefined> {
        let hashedPassword = undefined;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        const user = await UserModel.update(id, username, role, hashedPassword);
        
        // Sincronizar rol en user_roles
        if (user) {
            const { pool } = await import('../../config/database');
            const roleResult = await pool.query('SELECT id FROM roles WHERE name = $1', [role]);
            if (roleResult.rows.length > 0) {
                await UserModel.assignRoles(user.id, [roleResult.rows[0].id]);
            }
        }

        return user;
    }

    static async delete(id: number): Promise<boolean> {
        return await UserModel.delete(id);
    }
    
    static async findById(id: number): Promise<IUser | undefined> {
        return await UserModel.findById(id);
    }

    static async findByUsername(username: string): Promise<IUser | undefined> {
        return await UserModel.findByUsername(username);
    }

    static async getUserWithRoles(id: number): Promise<IUserWithRoles | undefined> {
        return await UserModel.getUserWithRoles(id);
    }

    static async assignRoles(userId: number, roleIds: number[]): Promise<IUserWithRoles | undefined> {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        await UserModel.assignRoles(userId, roleIds);
        return await UserModel.getUserWithRoles(userId);
    }
}
