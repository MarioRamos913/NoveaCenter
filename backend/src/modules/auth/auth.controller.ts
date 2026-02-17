import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { loginSchema, registerSchema } from './auth.schema';

export class AuthController {

    static async register(req: Request, res: Response) {
        try {
            const validation = registerSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ message: 'Validation error', errors: validation.error.format() });
            }

            const { username, password } = validation.data;
            
            // Register as 'user' by default
            const user = await AuthService.register({ username, password, role: 'user' });
            
            return res.status(201).json(user);
        } catch (error: any) {
             console.error(error);
             if (error.message === 'Username already exists') {
                 return res.status(409).json({ message: 'Username already exists' });
             }
             return res.status(500).json({ message: 'Error registering user' });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const validation = loginSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ message: 'Validation error', errors: validation.error.format() });
            }

            const { username, password } = validation.data;
            const result = await AuthService.login(username, password);

            if (!result) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            return res.json(result);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error logging in' });
        }
    }

    static async refreshToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({ message: 'Refresh Token required' });
            }

            const result = await AuthService.refresh(refreshToken);
            if (!result) {
                return res.status(403).json({ message: 'Invalid or expired refresh token' });
            }

            return res.json(result);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error refreshing token' });
        }
    }

    static async logout(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            if (refreshToken) {
                await AuthService.logout(refreshToken);
            }
            return res.json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error logging out' });
        }
    }
}
