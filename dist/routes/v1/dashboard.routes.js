import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, checkSubscriptionStatus } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import * as Errors from '../../utils/Errors.js';
const router = Router();
const prisma = new PrismaClient();
// Protect all routes
router.use(authMiddleware);
/**
 * GET /v1/dashboard
 * Complete dashboard metrics and overview
 */
router.get('/', asyncHandler(async (req, res) => {
    const tenantId = req.user.tenantId;
    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        include: {
            settings: true,
            products: { where: { is_active: true } }
        }
    });
    if (!tenant) {
        throw new Errors.NotFoundError('Tenant');
    }
    const totalRevenue = await prisma.order.aggregate({
        where: { tenant_id: tenantId, status: 'completed' },
        _sum: { amount: true }
    });
    const monthlyRevenue = await prisma.order.aggregate({
        where: {
            tenant_id: tenantId,
            status: 'completed',
            created_at: {
                gte: new Date(new Date().setDate(1))
            }
        },
        _sum: { amount: true }
    });
    const ordersThisMonth = await prisma.order.count({
        where: {
            tenant_id: tenantId,
            created_at: {
                gte: new Date(new Date().setDate(1))
            }
        }
    });
    const recentOrders = await prisma.order.findMany({
        where: { tenant_id: tenantId },
        orderBy: { created_at: 'desc' },
        take: 10
    });
    const now = new Date();
    const daysLeft = tenant.subscription_expires_at
        ? Math.ceil((tenant.subscription_expires_at.getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24))
        : 0;
    res.json({
        success: true,
        data: {
            tenant: {
                id: tenant.id,
                businessName: tenant.business_name,
                subdomain: tenant.subdomain,
                niche: tenant.selected_niche,
                launchUrl: tenant.is_launched
                    ? `https://${tenant.subdomain}.sg.io`
                    : null,
                isLaunched: tenant.is_launched
            },
            subscription: {
                plan: tenant.tier,
                status: tenant.status,
                daysLeft,
                renewalDate: tenant.subscription_expires_at
            },
            metrics: {
                totalRevenue: totalRevenue._sum.amount || 0,
                monthlyRevenue: monthlyRevenue._sum.amount || 0,
                ordersThisMonth,
                totalOrders: tenant._count?.orders || 0,
                totalProducts: tenant._count?.products || 0
            },
            recentOrders: recentOrders.map((o) => ({
                id: o.id,
                email: o.customer_email,
                amount: o.amount,
                status: o.status,
                date: o.created_at
            }))
        },
        meta: {
            timestamp: new Date().toISOString()
        }
    });
}));
/**
 * GET /v1/dashboard/products
 */
router.get('/products', asyncHandler(async (req, res) => {
    const tenantId = req.user.tenantId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where: { tenant_id: tenantId },
            orderBy: { created_at: 'desc' },
            skip: (page - 1) * limit,
            take: limit
        }),
        prisma.product.count({ where: { tenant_id: tenantId } })
    ]);
    res.json({
        success: true,
        data: {
            products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        }
    });
}));
/**
 * POST /v1/dashboard/products
 */
router.post('/products', checkSubscriptionStatus('lite'), asyncHandler(async (req, res) => {
    const tenantId = req.user.tenantId;
    const { name, price, description, category, imageUrl } = req.body;
    if (!name || !price) {
        throw new Errors.ValidationError('name and price are required');
    }
    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId }
    });
    if (!tenant) {
        throw new Errors.NotFoundError('Tenant');
    }
    const product = await prisma.product.create({
        data: {
            tenant_id: tenantId,
            name,
            price: Number(price),
            description,
            category,
            image_url: imageUrl,
            niche: tenant.selected_niche,
            is_active: true
        }
    });
    res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
    });
}));
/**
 * PUT /v1/dashboard/products/:id
 */
router.put('/products/:id', checkSubscriptionStatus('lite'), asyncHandler(async (req, res) => {
    const tenantId = req.user.tenantId;
    const productId = Number(req.params.id);
    const { name, price, description, category, imageUrl, isActive } = req.body;
    const product = await prisma.product.findUnique({
        where: { id: productId }
    });
    if (!product || product.tenant_id !== tenantId) {
        throw new Error('Access denied');
    }
    const updated = await prisma.product.update({
        where: { id: productId },
        data: {
            ...(name && { name }),
            ...(price && { price: Number(price) }),
            ...(description && { description }),
            ...(category && { category }),
            ...(imageUrl && { image_url: imageUrl }),
            ...(isActive !== undefined && { is_active: isActive })
        }
    });
    res.json({
        success: true,
        message: 'Product updated successfully',
        data: updated
    });
}));
/**
 * DELETE /v1/dashboard/products/:id
 */
router.delete('/products/:id', checkSubscriptionStatus('lite'), asyncHandler(async (req, res) => {
    const tenantId = req.user.tenantId;
    const productId = Number(req.params.id);
    const product = await prisma.product.findUnique({
        where: { id: productId }
    });
    if (!product || product.tenant_id !== tenantId) {
        throw new Error('Access denied');
    }
    await prisma.product.update({
        where: { id: productId },
        data: { is_active: false }
    });
    res.json({
        success: true,
        message: 'Product deleted successfully'
    });
}));
/**
 * GET /v1/dashboard/orders
 */
router.get('/orders', asyncHandler(async (req, res) => {
    const tenantId = req.user.tenantId;
    const page = Number(req.query.page) || 1;
    const status = req.query.status;
    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where: {
                tenant_id: tenantId,
                ...(status && { status })
            },
            orderBy: { created_at: 'desc' },
            skip: (page - 1) * 20,
            take: 20
        }),
        prisma.order.count({
            where: {
                tenant_id: tenantId,
                ...(status && { status })
            }
        })
    ]);
    res.json({
        success: true,
        data: {
            orders,
            pagination: {
                page,
                total,
                pages: Math.ceil(total / 20)
            }
        }
    });
}));
/**
 * GET /v1/dashboard/analytics
 */
router.get('/analytics', checkSubscriptionStatus('rise'), asyncHandler(async (req, res) => {
    const tenantId = req.user.tenantId;
    const days = Number(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const revenueStats = await prisma.order.groupBy({
        by: ['status'],
        where: {
            tenant_id: tenantId,
            created_at: { gte: startDate }
        },
        _sum: { amount: true },
        _count: true
    });
    const topProducts = await prisma.order.findMany({
        where: {
            tenant_id: tenantId,
            created_at: { gte: startDate }
        },
        orderBy: { amount: 'desc' },
        take: 10
    });
    res.json({
        success: true,
        data: {
            revenueStats,
            topOrders: topProducts,
            dateRange: {
                start: startDate,
                end: new Date(),
                days
            }
        }
    });
}));
/**
 * GET /v1/dashboard/settings
 */
router.get('/settings', asyncHandler(async (req, res) => {
    const tenantId = req.user.tenantId;
    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        include: { settings: true }
    });
    if (!tenant) {
        throw new Errors.NotFoundError('Tenant');
    }
    res.json({
        success: true,
        data: {
            business: {
                name: tenant.business_name,
                niche: tenant.selected_niche,
                location: tenant.business_location,
                phone: tenant.phone_number
            },
            branding: {
                customBrandName: tenant.settings?.custom_brand_name,
                logoUrl: tenant.settings?.logo_url,
                primaryColor: tenant.settings?.primary_color,
                secondaryColor: tenant.settings?.secondary_color
            },
            operations: {
                openingHours: tenant.settings?.opening_hours,
                closingHours: tenant.settings?.closing_hours,
                currency: tenant.settings?.currency
            }
        }
    });
}));
/**
 * PUT /v1/dashboard/settings
 */
router.put('/settings', asyncHandler(async (req, res) => {
    const tenantId = req.user.tenantId;
    const { businessName, location, phone, customBrandName, logoUrl, primaryColor, secondaryColor, openingHours, closingHours } = req.body;
    if (businessName || location || phone) {
        await prisma.tenant.update({
            where: { id: tenantId },
            data: {
                ...(businessName && { business_name: businessName }),
                ...(location && { business_location: location }),
                ...(phone && { phone_number: phone }),
                ...(primaryColor && { primary_color: primaryColor })
            }
        });
    }
    let settings = await prisma.tenantSettings.findUnique({
        where: { tenant_id: tenantId }
    });
    if (!settings) {
        settings = await prisma.tenantSettings.create({
            data: {
                tenant_id: tenantId,
                custom_brand_name: customBrandName,
                logo_url: logoUrl,
                primary_color: primaryColor,
                secondary_color: secondaryColor,
                opening_hours: openingHours,
                closing_hours: closingHours
            }
        });
    }
    else {
        settings = await prisma.tenantSettings.update({
            where: { tenant_id: tenantId },
            data: {
                ...(customBrandName && { custom_brand_name: customBrandName }),
                ...(logoUrl && { logo_url: logoUrl }),
                ...(primaryColor && { primary_color: primaryColor }),
                ...(secondaryColor && { secondary_color: secondaryColor }),
                ...(openingHours && { opening_hours: openingHours }),
                ...(closingHours && { closing_hours: closingHours })
            }
        });
    }
    res.json({
        success: true,
        message: 'Settings updated successfully',
        data: settings
    });
}));
export default router;
