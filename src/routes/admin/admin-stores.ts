/**
 * Admin Stores Management Routes
 * Manage all stores, view details, contacts
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/v1/admin/stores
 * Get all stores with details
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const { search, status, plan } = req.query;

        const where: any = {};
        if (search) {
            where.OR = [
                { business_name: { contains: String(search) } },
                { email: { contains: String(search) } },
                { subdomain: { contains: String(search) } }
            ];
        }
        if (status) {
            where.is_active = status === 'active';
        }
        if (plan) {
            where.payment_status = { current_plan: String(plan) };
        }

        const stores = await prisma.tenant.findMany({
            where,
            include: {
                payment_status: true,
                security_level: true,
                website_status: true
            },
            orderBy: { created_at: 'desc' }
        });

        res.json({
            success: true,
            data: stores,
            count: stores.length
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/v1/admin/stores/:storeId/details
 * Get detailed store information
 */
router.get('/:storeId/details', async (req: Request, res: Response) => {
    try {
        const store = await prisma.tenant.findUnique({
            where: { id: req.params.storeId },
            include: {
                payment_status: true,
                security_level: true,
                website_status: true,
                contacts: true,
                locations: true,
                settings: true
            }
        });

        if (!store) {
            return res.status(404).json({
                success: false,
                error: 'Store not found'
            });
        }

        res.json({
            success: true,
            data: store
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/v1/admin/stores/:storeId/contacts
 * Get store contacts
 */
router.get('/:storeId/contacts', async (req: Request, res: Response) => {
    try {
        const contacts = await prisma.tenantContact.findMany({
            where: { tenant_id: req.params.storeId }
        });

        res.json({
            success: true,
            data: contacts
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * PUT /api/v1/admin/stores/:storeId/contacts
 * Update store contacts
 */
router.put('/:storeId/contacts', async (req: Request, res: Response) => {
    try {
        const { contact_type, name, email, phone } = req.body;

        const contact = await prisma.tenantContact.upsert({
            where: {
                tenant_id_contact_type: {
                    tenant_id: req.params.storeId,
                    contact_type
                }
            },
            update: { name, email, phone },
            create: {
                tenant_id: req.params.storeId,
                contact_type,
                name,
                email,
                phone
            }
        });

        res.json({
            success: true,
            message: 'Contact updated',
            data: contact
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/v1/admin/stores/:storeId/security
 * Get store security level
 */
router.get('/:storeId/security', async (req: Request, res: Response) => {
    try {
        const security = await prisma.tenantSecurityLevel.findUnique({
            where: { tenant_id: req.params.storeId }
        });

        res.json({
            success: true,
            data: security
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/v1/admin/stores/:storeId/payment-status
 * Get store payment status
 */
router.get('/:storeId/payment-status', async (req: Request, res: Response) => {
    try {
        const status = await prisma.tenantPaymentStatus.findUnique({
            where: { tenant_id: req.params.storeId }
        });

        res.json({
            success: true,
            data: status
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * PUT /api/v1/admin/stores/:storeId/plan
 * Upgrade/downgrade store plan
 */
router.put('/:storeId/plan', async (req: Request, res: Response) => {
    try {
        const { new_plan } = req.body;
        const validPlans = ['FREE', 'LITE', 'RISE', 'ELITE'];

        if (!validPlans.includes(new_plan)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid plan'
            });
        }

        const updated = await prisma.tenantPaymentStatus.update({
            where: { tenant_id: req.params.storeId },
            data: { current_plan: new_plan }
        });

        res.json({
            success: true,
            message: 'Plan updated',
            data: updated
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/v1/admin/stores/:storeId/activity-log
 * Get store activity log
 */
router.get('/:storeId/activity-log', async (req: Request, res: Response) => {
    try {
        const logs = await prisma.auditLog.findMany({
            where: { tenant_id: req.params.storeId },
            orderBy: { created_at: 'desc' },
            take: 50
        });

        res.json({
            success: true,
            data: logs
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * DELETE /api/v1/admin/stores/:storeId
 * Delete/suspend a store
 */
router.delete('/:storeId', async (req: Request, res: Response) => {
    try {
        const { reason } = req.body;

        const updated = await prisma.tenant.update({
            where: { id: req.params.storeId },
            data: { is_active: false }
        });

        // Log activity
        await prisma.adminActivity.create({
            data: {
                admin_id: (req as any).user.id,
                action: 'SUSPEND_STORE',
                description: `Suspended store ${req.params.storeId}. Reason: ${reason}`,
                tenant_id: req.params.storeId
            }
        });

        res.json({
            success: true,
            message: 'Store suspended',
            data: updated
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;
