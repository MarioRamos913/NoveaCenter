export interface License {
    key: string;
    clientId?: string; // Legacy support or could be derived
    firstName: string;
    lastName: string;
    idNumber: string;
    businessName?: string;
    sector?: string;
    status: 'active' | 'expired' | 'revoked';
    expirationDate: string;
    software: 'rutadata' | 'other';
}

export interface LicenseCreateRequest {
    firstName: string;
    lastName: string;
    idNumber: string;
    businessName?: string;
    sector?: string;
    software: 'rutadata' | 'other';
    expirationDate: string;
}
