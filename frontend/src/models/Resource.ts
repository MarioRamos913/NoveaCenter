export interface Resource {
    id: number;
    name: string;
    code: string;
    route: string | null;
    description: string | null;
    created_at: string;
}

export interface CreateResourceRequest {
    name: string;
    code: string;
    route?: string;
    description?: string;
}

export interface UpdateResourceRequest {
    name?: string;
    code?: string;
    route?: string;
    description?: string;
}
