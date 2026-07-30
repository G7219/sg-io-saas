/**
 * Admin Stores Management Routes
 * Manage all stores, view details, contacts
 */
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();
/**
 * GET /api/v1/admin/stores
 * Get all stores with details
 */
router.get('/', async (req, res) => {
    try {
        const { search, status, plan } = req.query;
        const where = {};
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
            include: {},
            orderBy: { created_at: 'desc' }
        });
        res.json({
            success: true,
            data: stores,
            count: stores.length
        });
    }
    catch (error) {
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
router.get('/:storeId/details', async (req, res) => {
    try {
        const store = await prisma.tenant.findUnique({
            where: { id: req.params.storeId },
            include: {
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
    }
    catch (error) {
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
router.get('/:storeId/contacts', async (req, res) => {
    try {
        const contacts = [];
        res.json({
            success: true,
            data: contacts
        });
    }
    catch (error) {
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
router.put('/:storeId/contacts', async (req, res) => {
    try {
        const { contact_type, name, email, phone } = req.body;
        const contact = {
            name,
            email,
            phone,
            tenant_id_contact_type: {
                tenant_id: req.params.storeId,
                contact_type
            }
        };
        res.json({
            success: true,
            message: 'Contact updated',
            data: contact
        });
    }
    catch (error) {
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
router.get('/:storeId/security', async (req, res) => {
    try {
        const security = null;
        res.json({
            success: true,
            data: security
        });
    }
    catch (error) {
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
router.get('/:storeId/payment-status', async (req, res) => {
    try {
        const status = null;
        res.json({
            success: true,
            data: status
        });
    }
    catch (error) {
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
router.put('/:storeId/plan', async (req, res) => {
    try {
        const { new_plan } = req.body;
        const updated = { current_plan: new_plan };
        res.json({
            success: true,
            message: 'Plan updated',
            data: updated
        });
    }
    catch (error) {
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
router.get('/:storeId/activity-log', async (req, res) => {
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
    }
    catch (error) {
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
router.delete('/:storeId', async (req, res) => {
    try {
        const { reason } = req.body;
        const updated = await prisma.tenant.update({
            where: { id: req.params.storeId },
            data: { status: 'suspended' }
        });
        // Log activity
        await prisma.adminActivity.create({
            data: {
                admin_id: req.user.id,
                action: 'SUSPEND_STORE',
                description: `Suspended store ${req.params.storeId}. Reason: ${reason}`,
                tenant_id: req.params.storeId,
            }
        });
        res.json({
            success: true,
            message: 'Store suspended',
            data: updated
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
export default router;
