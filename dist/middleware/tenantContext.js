import prisma from '../config/database.js';
/**
 * Middleware to extract and load tenant context from subdomain
 * Usage: localhost:3000 (no subdomain) vs tenant.localhost:3000
 */
export const tenantContextMiddleware = async (req, res, next) => {
    try {
        // Extract subdomain from host
        const host = req.get('host') || '';
        const parts = host.split('.');
        let subdomain = null;
        // If more than 1 part and first part is not localhost
        if (parts.length > 1 && parts[0] !== 'localhost') {
            subdomain = parts[0];
        }
        // If no subdomain, tenant is public/marketing site
        if (!subdomain) {
            req.tenant = {
                id: 'public',
                business_name: 'SG.IO',
                subdomain: 'public',
                tier: 'lite',
                status: 'active',
                selected_niche: '',
                is_launched: false,
            };
            return next();
        }
        // Query database for tenant by subdomain
        const tenant = await prisma.tenant.findUnique({
            where: { subdomain },
            include: {
                settings: true,
                merchant_account: true,
            },
        });
        if (!tenant) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'TENANT_NOT_FOUND',
                    message: `Tenant "${subdomain}" not found`,
                },
            });
        }
        // Check if subscription is active
        if (tenant.status === 'suspended') {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'SUBSCRIPTION_SUSPENDED',
                    message: 'This store has been suspended',
                },
            });
        }
        if (tenant.status === 'expired') {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'SUBSCRIPTION_EXPIRED',
                    message: 'This store subscription has expired',
                },
            });
        }
        // Attach tenant context to request
        req.tenant = {
            id: tenant.id,
            business_name: tenant.business_name,
            subdomain: tenant.subdomain,
            tier: tenant.tier,
            status: tenant.status,
            selected_niche: tenant.selected_niche,
            is_launched: tenant.is_launched,
            subscription_expires_at: tenant.subscription_expires_at,
            settings: tenant.settings ? {
                primary_color: tenant.settings.primary_color,
                secondary_color: tenant.settings.secondary_color,
                logo_url: tenant.settings.logo_url,
                custom_brand_name: tenant.settings.custom_brand_name,
                contact_email: tenant.settings.contact_email,
                contact_phone: tenant.settings.contact_phone,
            } : undefined
        };
        req.tenantId = tenant.id;
        next();
    }
    catch (error) {
        console.error('Tenant Context Error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'TENANT_CONTEXT_ERROR',
                message: 'Error loading tenant context',
            },
        });
    }
};
/**
 * Middleware to require valid tenant (not marketing site)
 */
export const requireTenant = (req, res, next) => {
    if (!req.tenant || req.tenant.id === 'public') {
        res.status(401).json({
            success: false,
            error: {
                code: 'UNAUTHORIZED',
                message: 'This endpoint requires a valid tenant',
            },
        });
        return;
    }
    next();
};
/**
 * Middleware to require active/trial subscription
 */
export const requireActiveSubscription = (req, res, next) => {
    if (!req.tenant) {
        res.status(401).json({
            success: false,
            error: {
                code: 'UNAUTHORIZED',
                message: 'Tenant context required',
            },
        });
        return;
    }
    if (req.tenant.status !== 'active' && req.tenant.status !== 'trial') {
        res.status(403).json({
            success: false,
            error: {
                code: 'SUBSCRIPTION_INACTIVE',
                message: `Subscription status: ${req.tenant.status}`,
            },
        });
        return;
    }
    next();
};
/**
 * Get tenant context safely
 */
export const getTenantContext = (req) => {
    return req.tenant || null;
};
/**
 * Get tenant ID safely
 */
export const getTenantId = (req) => {
    return req.tenantId || null;
};
