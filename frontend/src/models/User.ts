export interface User {
    id: number;
    username: string;
    roles: { id: number; name: string }[];
    created_at: string;
}

export interface CreateUserRequest {
    username: string;
    password: string;
    role: 'admin' | 'user';
}

export interface UpdateUserRequest {
    username: string;
    role: 'admin' | 'user';
    password?: string;
}
