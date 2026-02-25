export interface Role {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
}

export interface RoleWithResources extends Role {
    resources: { id: number; name: string; code: string; route: string; description: string | null }[];
}

export interface CreateRoleRequest {
    name: string;
    description?: string;
}

export interface UpdateRoleRequest {
    name?: string;
    description?: string;
}
