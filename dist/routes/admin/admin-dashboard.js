/**
 * Admin Dashboard Routes
 * Overview, analytics, and global statistics
 */
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();
/**
 * GET /api/v1/admin/dashboard/overview
 * Get dashboard overview with key metrics
 */
router.get('/overview', async (req, res) => {
    try {
        const totalTenants = await prisma.tenant.count();
        const activeTenants = await prisma.tenant.count({
            where: { status: 'active' }
        });
        const suspendedTenants = totalTenants - activeTenants;
        const overduePayments = await prisma.tenant.count({
            where: { status: 'active' }
        });
        const recentAnalytics = { _sum: { total_revenue: 0 } };
        const securityIssues = 0;
        res.json({
            success: true,
            data: {
                totalTenants,
                activeTenants,
                suspendedTenants,
                totalRevenue: recentAnalytics._sum?.total_revenue || 0,
                overduePayments,
                securityIssues
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
 * GET /api/v1/admin/dashboard/tenants
 * Get all tenants with basic info
 */
router.get('/tenants', async (req, res) => {
    try {
        const tenants = await prisma.tenant.findMany({
            include: {},
            take: 100
        });
        res.json({
            success: true,
            data: tenants,
            count: tenants.length
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
 * GET /api/v1/admin/dashboard/tenants/:tenantId
 * Get single tenant details
 */
router.get('/tenants/:tenantId', async (req, res) => {
    try {
        const tenant = await prisma.tenant.findUnique({
            where: { id: req.params.tenantId },
            include: {
                payment_status: true,
                security_level: true,
                website_status: true,
                contacts: true,
                locations: true
            }
        });
        if (!tenant) {
            return res.status(404).json({
                success: false,
                error: 'Tenant not found'
            });
        }
        res.json({
            success: true,
            data: tenant
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
 * GET /api/v1/admin/dashboard/analytics
 * Get global analytics
 */
router.get('/analytics', async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const fromDate = new Date(Date.now() - (Number(days) * 24 * 60 * 60 * 1000));
        const analytics = await prisma.weeklyAnalytics.findMany({
            where: {
                week_start: { gte: fromDate }
            },
            orderBy: { week_start: 'desc' }
        });
        const totalRevenue = analytics.reduce((sum, a) => sum + a.revenue, 0);
        const totalOrders = analytics.reduce((sum, a) => sum + a.total_orders, 0);
        const totalCustomers = analytics.reduce((sum, a) => sum + a.total_customers, 0);
        res.json({
            success: true,
            data: {
                period_days: days,
                total_revenue: totalRevenue,
                total_orders: totalOrders,
                total_customers: totalCustomers,
                average_order_value: totalOrders > 0 ? totalRevenue / totalOrders : 0,
                analytics
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
 * GET /api/v1/admin/dashboard/activity-log
 * Get recent admin activities
 */
router.get('/activity-log', async (req, res) => {
    try {
        const logs = await prisma.adminActivity.findMany({
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
 * GET /api/v1/admin/dashboard/revenue-trend
 * Get revenue trend for charts
 */
router.get('/revenue-trend', async (req, res) => {
    try {
        const analytics = await prisma.weeklyAnalytics.findMany({
            orderBy: { week_start: 'asc' },
            take: 12
        });
        const trend = analytics.map((a) => ({
            week: a.week_start.toISOString().split('T')[0],
            revenue: a.revenue
        }));
        res.json({
            success: true,
            data: trend
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
