import { Request, Response, NextFunction } from 'express';
import { TenantContext } from '../types/index';
/**
 * Middleware to extract and load tenant context from subdomain
 * Usage: localhost:3000 (no subdomain) vs tenant.localhost:3000
 */
export declare const tenantContextMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Middleware to require valid tenant (not marketing site)
 */
export declare const requireTenant: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware to require active/trial subscription
 */
export declare const requireActiveSubscription: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Get tenant context safely
 */
export declare const getTenantContext: (req: Request) => TenantContext | null;
/**
 * Get tenant ID safely
 */
export declare const getTenantId: (req: Request) => string | null;
//# sourceMappingURL=tenantContext.d.ts.map