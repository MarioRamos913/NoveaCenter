import { UserModel, CreateUserDTO, IUser } from './user.model';
import bcrypt from 'bcrypt';

export class UserService {
    static async getAll(): Promise<IUser[]> {
        return await UserModel.getAll();
    }

    static async create(userData: CreateUserDTO): Promise<IUser> {
        const { username, password, role } = userData;

        const existing = await UserModel.findByUsername(username);
        if (existing) {
            throw new Error('Username already exists');
        }

        // Only hash if passing to model directly, but model expects hashed?
        // Wait, Controller was hashing. Service should responsible for business logic.
        // UserModel is raw data access.
        // Service should hash password.
        
        const hashedPassword = await bcrypt.hash(password!, 10);
        
        return await UserModel.create({
            username,
            password: hashedPassword,
            role
        });
    }

    static async update(id: number, username: string, role: 'admin' | 'user', password?: string): Promise<IUser | undefined> {
        let hashedPassword = undefined;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        return await UserModel.update(id, username, role, hashedPassword);
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
}
