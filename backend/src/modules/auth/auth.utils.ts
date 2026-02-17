import jwt from 'jsonwebtoken';
import { IUser } from '../users/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'; // Fallback for dev only
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret';

export const generateAccessToken = (user: IUser) => {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '15m' }
    );
};

export const generateRefreshToken = (user: IUser) => {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
