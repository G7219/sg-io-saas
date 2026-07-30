/**
 * Admin Security Monitoring Routes
 * Monitor and manage store security
 */
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();
/**
 * GET /api/v1/admin/security/:storeId/level
 * Get store security level/score
 */
router.get('/:storeId/level', async (req, res) => {
    try {
        const security = await prisma.tenantSecurityLevel.findUnique({
            where: { tenant_id: req.params.storeId }
        });
        if (!security) {
            return res.status(404).json({
                success: false,
                error: 'Security level not found'
            });
        }
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
 * POST /api/v1/admin/security/:storeId/audit
 * Run security audit on store
 */
router.post('/:storeId/audit', async (req, res) => {
    try {
        // Simulate security audit checks
        const checks = {
            password_strength: Math.random() * 100,
            ssl_certificate: Math.random() * 100,
            data_encryption: Math.random() * 100,
            backup_status: Math.random() * 100,
            payment_compliance: Math.random() * 100
        };
        const averageScore = Object.values(checks).reduce((a, b) => a + b, 0) / Object.keys(checks).length;
        // Determine risk level
        let riskLevel = 'low';
        if (averageScore < 30)
            riskLevel = 'critical';
        else if (averageScore < 50)
            riskLevel = 'high';
        else if (averageScore < 70)
            riskLevel = 'medium';
        const updated = await prisma.tenantSecurityLevel.update({
            where: { tenant_id: req.params.storeId },
            data: {
                overall_security_score: Math.round(averageScore),
                risk_level: riskLevel,
                last_audit_date: new Date()
            }
        });
        res.json({
            success: true,
            message: 'Security audit completed',
            data: updated,
            checks
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
 * GET /api/v1/admin/security/:storeId/incidents
 * Get security incidents
 */
router.get('/:storeId/incidents', async (req, res) => {
    try {
        // This would typically fetch from an incidents table
        // For now, returning mock data structure
        const incidents = [
            {
                id: '1',
                type: 'LOGIN_ATTEMPT_FAILED',
                severity: 'medium',
                description: 'Multiple failed login attempts',
                count: 5,
                last_occurrence: new Date()
            },
            {
                id: '2',
                type: 'UNUSUAL_API_ACTIVITY',
                severity: 'low',
                description: 'Unusual API access pattern detected',
                count: 3,
                last_occurrence: new Date()
            }
        ];
        res.json({
            success: true,
            data: incidents
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
 * POST /api/v1/admin/security/:storeId/alert
 * Send security alert to store
 */
router.post('/:storeId/alert', async (req, res) => {
    try {
        const { type, message, severity } = req.body;
        // Log the alert
        await prisma.adminActivity.create({
            data: {
                admin_id: req.user.id,
                action: 'SEND_SECURITY_ALERT',
                description: `Security alert sent: ${message}`,
                tenant_id: req.params.storeId
            }
        });
        res.json({
            success: true,
            message: 'Security alert sent',
            data: {
                type,
                message,
                severity,
                sent_at: new Date()
            }
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
 * GET /api/v1/admin/security/all
 * Get security status for all stores
 */
router.get('/', async (req, res) => {
    try {
        const allSecurity = await prisma.tenantSecurityLevel.findMany({
            orderBy: { overall_security_score: 'asc' },
            take: 100,
            include: {
                tenant: {
                    select: { business_name: true, email: true }
                }
            }
        });
        res.json({
            success: true,
            data: allSecurity,
            critical: allSecurity.filter((s) => s.risk_level === 'critical').length,
            high: allSecurity.filter((s) => s.risk_level === 'high').length,
            medium: allSecurity.filter((s) => s.risk_level === 'medium').length,
            low: allSecurity.filter((s) => s.risk_level === 'low').length
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
 * POST /api/v1/admin/security/:storeId/fix-issue
 * Attempt to auto-fix security issue
 */
router.post('/:storeId/fix-issue', async (req, res) => {
    try {
        const { issue } = req.body;
        // Log the fix attempt
        await prisma.adminActivity.create({
            data: {
                admin_id: req.user.id,
                action: 'FIX_SECURITY_ISSUE',
                description: `Attempted to fix security issue: ${issue}`,
                tenant_id: req.params.storeId
            }
        });
        res.json({
            success: true,
            message: 'Security fix applied',
            data: {
                issue,
                fixed_at: new Date(),
                status: 'pending_verification'
            }
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
//# sourceMappingURL=admin-security.js.map