/**
 * Admin Website Control Routes
 * Enable/disable store websites manually
 */
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();
/**
 * GET /api/v1/admin/website-control/:storeId/status
 * Get website status
 */
router.get('/:storeId/status', async (req, res) => {
    try {
        const status = await prisma.websiteStatus.findUnique({
            where: { tenant_id: req.params.storeId }
        });
        if (!status) {
            return res.status(404).json({
                success: false,
                error: 'Website status not found'
            });
        }
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
 * POST /api/v1/admin/website-control/:storeId/enable
 * Enable website (manual control)
 */
router.post('/:storeId/enable', async (req, res) => {
    try {
        const { reason } = req.body;
        const updated = await prisma.websiteStatus.update({
            where: { tenant_id: req.params.storeId },
            data: {
                is_online: true,
                manual_status: 'enabled'
            }
        });
        // Log control action
        await prisma.websiteControlLog.create({
            data: {
                tenant_id: req.params.storeId,
                action: 'ENABLE',
                reason: reason || 'Manual enable by admin',
                performed_by: req.user.id
            }
        });
        // Log admin activity
        await prisma.adminActivity.create({
            data: {
                admin_id: req.user.id,
                action: 'ENABLE_WEBSITE',
                description: `Enabled website for store ${req.params.storeId}. Reason: ${reason}`,
                tenant_id: req.params.storeId
            }
        });
        res.json({
            success: true,
            message: 'Website enabled',
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
 * POST /api/v1/admin/website-control/:storeId/disable
 * Disable website (manual control)
 */
router.post('/:storeId/disable', async (req, res) => {
    try {
        const { reason } = req.body;
        const updated = await prisma.websiteStatus.update({
            where: { tenant_id: req.params.storeId },
            data: {
                is_online: false,
                manual_status: 'disabled'
            }
        });
        // Log control action
        await prisma.websiteControlLog.create({
            data: {
                tenant_id: req.params.storeId,
                action: 'DISABLE',
                reason: reason || 'Manual disable by admin',
                performed_by: req.user.id
            }
        });
        // Log admin activity
        await prisma.adminActivity.create({
            data: {
                admin_id: req.user.id,
                action: 'DISABLE_WEBSITE',
                description: `Disabled website for store ${req.params.storeId}. Reason: ${reason}`,
                tenant_id: req.params.storeId
            }
        });
        res.json({
            success: true,
            message: 'Website disabled',
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
 * POST /api/v1/admin/website-control/:storeId/maintenance
 * Set website to maintenance mode
 */
router.post('/:storeId/maintenance', async (req, res) => {
    try {
        const { message } = req.body;
        const updated = await prisma.websiteStatus.update({
            where: { tenant_id: req.params.storeId },
            data: {
                is_online: false,
                manual_status: 'maintenance',
                maintenance_message: message || 'Site under maintenance'
            }
        });
        res.json({
            success: true,
            message: 'Maintenance mode activated',
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
 * GET /api/v1/admin/website-control/:storeId/logs
 * Get website control logs
 */
router.get('/:storeId/logs', async (req, res) => {
    try {
        const logs = await prisma.websiteControlLog.findMany({
            where: { tenant_id: req.params.storeId },
            orderBy: { created_at: 'desc' },
            take: 50,
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
 * POST /api/v1/admin/website-control/:storeId/logs/revert
 * Revert to previous website control state
 */
router.post('/:storeId/logs/revert', async (req, res) => {
    try {
        const { logId } = req.body;
        // Get the log entry
        const log = await prisma.websiteControlLog.findUnique({
            where: { id: logId }
        });
        if (!log) {
            return res.status(404).json({
                success: false,
                error: 'Log entry not found'
            });
        }
        // Get previous log to determine state to revert to
        const previousLog = await prisma.websiteControlLog.findFirst({
            where: {
                tenant_id: req.params.storeId,
                created_at: { lt: log.created_at }
            },
            orderBy: { created_at: 'desc' }
        });
        let newStatus = true;
        let newManualStatus = 'enabled';
        if (previousLog) {
            newStatus = previousLog.action === 'ENABLE';
            newManualStatus = previousLog.action === 'ENABLE' ? 'enabled' : 'disabled';
        }
        const updated = await prisma.websiteStatus.update({
            where: { tenant_id: req.params.storeId },
            data: {
                is_online: newStatus,
                manual_status: newManualStatus
            }
        });
        res.json({
            success: true,
            message: 'Reverted to previous state',
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
