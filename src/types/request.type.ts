/**
 * Extended Express Request Types
 * Adds custom properties to Express Request
 */

import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
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
                role: 'superadmin' | 'admin' | 'support' | 'accountant' | 'security';
                is_active: boolean;
            };
            niche?: {
                id: string;
                name: string;
                template: string;
                category: string;
            };
        }
    }
}

export interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        email: string;
        tenantId: string;
        role: 'user' | 'admin' | 'superadmin';
    };
}

export interface TenantRequest extends Request {
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
        role: 'superadmin' | 'admin' | 'support' | 'accountant' | 'security';
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
