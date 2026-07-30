/**
 * Extended Express Request Types
 * Adds custom properties to Express Request
 */

import { Request } from 'express';

export interface AuthenticatedRequest extends Omit<Request, 'tenant' | 'user'> {
    user: {
        id: string;
        email: string;
        tenantId: string;
        role: 'user' | 'admin' | 'superadmin';
        iat?: number;
        exp?: number;
    };
    tenant?: {
        id: string;
        business_name: string;
        email: string;
        subdomain: string;
        is_active: boolean;
    };
    admin?: {
        id: string;
        email: string;
        role: 'superadmin' | 'admin' | 'support' | 'accountant';
        is_active: boolean;
    };
}

export interface TenantRequest extends Omit<Request, 'tenant' | 'user'> {
    user: {
        id: string;
        email: string;
        tenantId: string;
        role: 'user' | 'admin' | 'superadmin';
    };
    tenant: {
        id: string;
        business_name: string;
        email: string;
        subdomain: string;
        is_active: boolean;
    };
}

export interface AdminRequest extends Request {
    admin: {
        id: string;
        email: string;
        role: 'superadmin' | 'admin' | 'support' | 'accountant';
        is_active: boolean;
    };
}


export interface NicheRequest extends Request {
    niche: {
        id: string;
        name: string;
        template: string;
        category: string;
    };
}
