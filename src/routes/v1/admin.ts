import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
// src/routes/v1/admin/index.ts
// Admin routes aggregator

// sable_date: new Date(),
//     is_online: false,
//         overall_status: 'maintenance'
//             }
//         });

// // Log the action
// await prisma.websiteControlLog.create({
//     data: {
//         tenant_id: tenantId,
//         action_type: 'maintenance_mode',
//         action_reason: message,
//         taken_by: adminEmail,
//         new_status: 'maintenance',
//         ip_address: req.ip
//     }
// });

// res.json({
//     success: true,
//     message: 'Maintenance mode enabled',
//     data: updated
// });
//     } catch (error: any) {
//     res.status(500).json({ success: false, error: error.message });
// }
// });

// GET /api/v1/admin/website-control/:tenantId/logs
// Get website control logs
router.get('/:tenantId/logs', async (req: Request, res: Response) => {
    try {
        const { tenantId } = req.params;

        const logs = await prisma.websiteControlLog.findMany({
            where: { tenant_id: tenantId as string }, // <-- Tumeongeza 'as string' hapa
            orderBy: { created_at: 'desc' },
            take: 100
        });

        res.json({ success: true, data: logs });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});


// POST /api/v1/admin/website-control/:tenantId/logs/revert
// Revert to previous state
//router.post('/:tenantId/logs/revert', async (req: Request, res: Response) => {
//try {
//const { tenantId } = req.params;
//import express, { Router } from 'express';
//         import dashboardRoutes from './dashboard.routes';
//         import storesRoutes from './stores.routes';
//         import websiteControlRoutes from './website-control.routes';
//         import securityRoutes from './security.routes';
//         import paymentsRoutes from './payments.routes';
//         import usersRoutes from './users.routes';
//         import reportsRoutes from './reports.routes';

//         import { authMiddleware } from '../../../middleware/auth';
//         import { validateAdminAccess } from '../../../middleware/admin';

//         const router = Router();

//         // Apply admin authentication to all admin routes
//         router.use(authMiddleware, validateAdminAccess);

//         router.use('/dashboard', dashboardRoutes);
//         router.use('/stores', storesRoutes);
//         router.use('/website-control', websiteControlRoutes);
//         router.use('/security', securityRoutes);
//         router.use('/payments', paymentsRoutes);
//         router.use('/users', usersRoutes);
//         router.use('/reports', reportsRoutes);

//         export default router;

//         // ============================================================
//         // src/routes/v1/admin/dashboard.routes.ts
//         // Admin Dashboard Routes
//         // ============================================================

//         import { Router, Request, Response } from 'express';
//         import { PrismaClient } from '@prisma/client';

//         const router = Router();
//         const prisma = new PrismaClient();

//         // GET /api/v1/admin/dashboard/overview
//         // Get overview of all stores
//         router.get('/overview', async (req: Request, res: Response) => {
//             try {
//                 const totalTenants = await prisma.tenant.count();
//                 const activeTenants = await prisma.tenant.count({
//                     where: { is_active: true }
//                 });
//                 const suspendedTenants = await prisma.tenant.count({
//                     where: { is_active: false }
//                 });

//                 const totalRevenue = await prisma.paymentLog.aggregate({
//                     _sum: { amount: true },
//                     where: { status: 'completed' }
//                 });

//                 const securityIssues = await prisma.tenantSecurityLevel.count({
//                     where: { risk_level: { in: ['high', 'critical'] } }
//                 });

//                 const overduePayments = await prisma.tenantPaymentStatus.count({
//                     where: { is_overdue: true }
//                 });

//                 res.json({
//                     success: true,
//                     data: {
//                         totalTenants,
//                         activeTenants,
//                         suspendedTenants,
//                         totalRevenue: totalRevenue._sum.amount || 0,
//                         securityIssues,
//                         overduePayments,
//                         timestamp: new Date()
//                     }
//                 });
//             } catch (error: any) {
//                 res.status(500).json({ success: false, error: error.message });
//             }
//         });

//         // GET /api/v1/admin/dashboard/tenants
//         // List all tenants with pagination
//         router.get('/tenants', async (req: Request, res: Response) => {
//             try {
//                 const { page = 1, limit = 20, search, status } = req.query;
//                 const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

//                 const where: any = {};
//                 if (search) {
//                     where.OR = [
//                         { business_name: { contains: search as string } },
//                         { email: { contains: search as string } }
//                     ];
//                 }
//                 if (status) {
//                     where.is_active = status === 'active';
//                 }

//                 const tenants = await prisma.tenant.findMany({
//                     where,
//                     skip,
//                     take: parseInt(limit as string),
//                     select: {
//                         id: true,
//                         business_name: true,
//                         email: true,
//                         is_active: true,
//                         created_at: true,
//                         payment_status: {
//                             select: {
//                                 subscription_status: true,
//                                 current_plan: true,
//                                 is_overdue: true
//                             }
//                         },
//                         security_level: {
//                             select: {
//                                 overall_security_score: true,
//                                 risk_level: true
//                             }
//                         },
//                         website_status: {
//                             select: {
//                                 is_online: true,
//                                 manual_status: true
//                             }
//                         }
//                     },
//                     orderBy: { created_at: 'desc' }
//                 });

//                 const total = await prisma.tenant.count({ where });

//                 res.json({
//                     success: true,
//                     data: tenants,
//                     pagination: {
//                         page: parseInt(page as string),
//                         limit: parseInt(limit as string),
//                         total,
//                         pages: Math.ceil(total / parseInt(limit as string))
//                     }
//                 });
//             } catch (error: any) {
//                 res.status(500).json({ success: false, error: error.message });
//             }
//         });

//         // GET /api/v1/admin/dashboard/tenants/:id
//         // Get detailed view of single tenant
//         router.get('/tenants/:tenantId', async (req: Request, res: Response) => {
//             try {
//                 const { tenantId } = req.params;

//                 const tenant = await prisma.tenant.findUnique({
//                     where: { id: tenantId },
//                     include: {
//                         payment_status: true,
//                         security_level: true,
//                         website_status: true,
//                         contacts: true,
//                         locations: { select: { id: true, name: true, is_main_branch: true } }
//                     }
//                 });

//                 if (!tenant) {
//                     return res.status(404).json({ success: false, error: 'Tenant not found' });
//                 }

//                 res.json({ success: true, data: tenant });
//             } catch (error: any) {
//                 res.status(500).json({ success: false, error: error.message });
//             }
//         });

//         // GET /api/v1/admin/dashboard/analytics
//         // Global analytics across all stores
//         router.get('/analytics', async (req: Request, res: Response) => {
//             try {
//                 const { days = 30 } = req.query;
//                 const daysInt = parseInt(days as string);
//                 const fromDate = new Date(Date.now() - daysInt * 24 * 60 * 60 * 1000);

//                 const revenue = await prisma.paymentLog.aggregate({
//                     _sum: { amount: true },
//                     where: {
//                         created_at: { gte: fromDate },
//                         status: 'completed'
//                     }
//                 });

//                 const newTenants = await prisma.tenant.count({
//                     where: { created_at: { gte: fromDate } }
//                 });

//                 const activeOrders = await prisma.order.count({
//                     where: { status: { in: ['pending', 'processing'] } }
//                 });

//                 const totalCustomers = await prisma.customer.count();

//                 res.json({
//                     success: true,
//                     data: {
//                         period: { days: daysInt, from: fromDate, to: new Date() },
//                         revenue: revenue._sum.amount || 0,
//                         newTenants,
//                         activeOrders,
//                         totalCustomers
//                     }
//                 });
//             } catch (error: any) {
//                 res.status(500).json({ success: false, error: error.message });
//             }
//         });

//         export default router;

//         // ============================================================
//         // src/routes/v1/admin/stores.routes.ts
//         // Store Management Routes
//         // ============================================================

//         import { Router, Request, Response } from 'express';
//         import { PrismaClient } from '@prisma/client';

//         const router = Router();
//         const prisma = new PrismaClient();

//         // GET /api/v1/admin/stores
//         router.get('/', async (req: Request, res: Response) => {
//             try {
//                 const stores = await prisma.tenant.findMany({
//                     select: {
//                         id: true,
//                         business_name: true,
//                         email: true,
//                         is_active: true,
//                         payment_status: true,
//                         security_level: true,
//                         website_status: true
//                     }
//                 });
//                 res.json({ success: true, data: stores });
//             } catch (error: any) {
//                 res.status(500).json({ success: false, error: error.message });
//             }
//         });

//         // GET /api/v1/admin/stores/:tenantId/details
//         // Get all details about a store
//         router.get('/:tenantId/details', async (req: Request, res: Response) => {
//             try {
//                 const { tenantId } = req.params;

//                 const tenant = await prisma.tenant.findUnique({
//                     where: { id: tenantId },
//                     include: {
//                         payment_status: true,
//                         security_level: true,
//                         website_status: true,
//                         contacts: true,
//                         locations: true,
//                         ai_providers: true,
//                         tenant_settings: true
//                     }
//                 });

//                 if (!tenant) {
//                     return res.status(404).json({ success: false, error: 'Store not found' });
//                 }

//                 // Get recent activity
//                 const activity = await prisma.adminActivity.findMany({
//                     where: { tenant_id: tenantId },
//                     take: 20,
//                     orderBy: { created_at: 'desc' }
//                 });

//                 res.json({
//                     success: true,
//                     data: {
//                         tenant,
//                         recentActivity: activity
//                     }
//                 });
//             } catch (error: any) {
//                 res.status(500).json({ success: false, error: error.message });
//             }
//         });

//         // GET /api/v1/admin/stores/:tenantId/contacts
//         // Get store contacts
//         router.get('/:tenantId/contacts', async (req: Request, res: Response) => {
//             try {
//                 const { tenantId } = req.params;

//                 const contacts = await prisma.tenantContact.findMany({
//                     where: { tenant_id: tenantId }
//                 });

//                 res.json({ success: true, data: contacts });
//             } catch (error: any) {
//                 res.status(500).json({ success: false, error: error.message });
//             }
//         });

//         // PUT /api/v1/admin/stores/:tenantId/contacts
//         // Update store contacts
//         router.put('/:tenantId/contacts', async (req: Request, res: Response) => {
//             try {
//                 const { tenantId } = req.params;
//                 const { contacts } = req.body;

//                 // Delete existing contacts
//                 await prisma.tenantContact.deleteMany({
//                     where: { tenant_id: tenantId }
//                 });

//                 // Create new contacts
//                 const newContacts = await Promise.all(
//                     contacts.map((contact: any) =>
//                         prisma.tenantContact.create({
//                             data: {
//                                 tenant_id: tenantId,
//                                 ...contact
//                             }
//                         })
//                     )
//                 );

//                 res.json({
//                     success: true,
//                     message: 'Contacts updated',
//                     data: newContacts
//                 });
//             } catch (error: any) {
//                 res.status(500).json({ success: false, error: error.message });
//             }
//         });

//         // GET /api/v1/admin/stores/:tenantId/security
//         // Get security level details
//         router.get('/:tenantId/security', async (req: Request, res: Response) => {
//             try {
//                 const { tenantId } = req.params;

//                 const security = await prisma.tenantSecurityLevel.findUnique({
//                     where: { tenant_id: tenantId }
//                 });

//                 if (!security) {
//                     return res.status(404).json({ success: false, error: 'Security data not found' });
//                 }

//                 res.json({ success: true, data: security });
//             } catch (error: any) {
//                 res.status(500).json({ success: false, error: error.message });
//             }
//         });

//         // GET /api/v1/admin/stores/:tenantId/payment-status
//         // Get payment status details
//         router.get('/:tenantId/payment-status', async (req: Request, res: Response) => {
//             try {
//                 const { tenantId } = req.params;

//                 const status = await prisma.tenantPaymentStatus.findUnique({
//                     where: { tenant_id: tenantId }
//                 });

//                 if (!status) {
//                     return res.status(404).json({ success: false, error: 'Payment status not found' });
//                 }

//                 res.json({ success: true, data: status });
//             } catch (error: any) {
//                 res.status(500).json({ success: false, error: error.message });
//             }
//         });

//         // PUT /api/v1/admin/stores/:tenantId/plan
//         // Change subscription plan
//         router.put('/:tenantId/plan', async (req: Request, res: Response) => {
//             try {
//                 const { tenantId } = req.params;
//                 const { newPlan } = req.body;

//                 const updated = await prisma.tenantPaymentStatus.update({
//                     where: { tenant_id: tenantId },
//                     data: {
//                         current_plan: newPlan,
//                         subscription_status: 'active'
//                     }
//                 });

//                 res.json({
//                     success: true,
//                     message: 'Plan updated',
//                     data: updated
//                 });
//             } catch (error: any) {
//                 res.status(500).json({ success: false, error: error.message });
//             }
//         });

//         // GET /api/v1/admin/stores/:tenantId/activity-log
//         // Get activity log for store
//         router.get('/:tenantId/activity-log', async (req: Request, res: Response) => {
//             try {
//                 const { tenantId } = req.params;
//                 const { limit = 50 } = req.query;

//                 const activities = await prisma.adminActivity.findMany({
//                     where: { tenant_id: tenantId },
//                     take: parseInt(limit as string),
//                     orderBy: { created_at: 'desc' }
//                 });

//                 res.json({ success: true, data: activities });
//             } catch (error: any) {
//                 res.status(500).json({ success: false, error: error.message });
//             }
//         });

//         export default router;

//         // ============================================================
//         // src/routes/v1/admin/website-control.routes.ts
//         // Website ON/OFF Control Routes
//         // ============================================================

//         import { Router, Request, Response } from 'express';
//         import { PrismaClient } from '@prisma/client';

//         const router = Router();
//         const prisma = new PrismaClient();

//         // GET /api/v1/admin/website-control/:tenantId/status
//         // Get website status
//         router.get('/:tenantId/status', async (req: Request, res: Response) => {
//             try {
//                 const { tenantId } = req.params;

//                 const status = await prisma.websiteStatus.findUnique({
//                     where: { tenant_id: tenantId }
//                 });

//                 if (!status) {
//                     return res.status(404).json({ success: false, error: 'Website status not found' });
//                 }

//                 res.json({ success: true, data: status });
//             } catch (error: any) {
//                 res.status(500).json({ success: false, error: error.message });
//             }
//         });

//         // POST /api/v1/admin/website-control/:tenantId/disable
//         // Manually disable website
//         router.post('/:tenantId/disable', async (req: Request, res: Response) => {
//             try {
//                 const { tenantId } = req.params;
//                 const { reason } = req.body;
//                 const adminEmail = (req as any).user?.email || 'unknown';

//                 const updated = await prisma.websiteStatus.update({
//                     where: { tenant_id: tenantId },
//                     data: {
//                         manual_status: 'disabled',
//                         manually_disabled_by: adminEmail,
//                         manual_disable_reason: reason,
//                         manual_disable_date: new Date(),
//                         is_online: false,
//                         overall_status: 'disabled'
//                     }
//                 });

//                 // Log the action
//                 await prisma.websiteControlLog.create({
//                     data: {
//                         tenant_id: tenantId,
//                         action_type: 'disable',
//                         action_reason: reason,
//                         taken_by: adminEmail,
//                         previous_status: 'active',
//                         new_status: 'disabled',
//                         ip_address: req.ip
//                     }
//                 });

//                 res.json({
//                     success: true,
//                     message: 'Website disabled',
//                     data: updated
//                 });
//             } catch (error: any) {
//                 res.status(500).json({ success: false, error: error.message });
//             }
//         });

//         // POST /api/v1/admin/website-control/:tenantId/enable
//         // Manually enable website
//         router.post('/:tenantId/enable', async (req: Request, res: Response) => {
//             try {
//                 const { tenantId } = req.params;
//                 const adminEmail = (req as any).user?.email || 'unknown';

//                 const updated = await prisma.websiteStatus.update({
//                     where: { tenant_id: tenantId },
//                     data: {
//                         manual_status: 'active',
//                         manually_disabled_by: null,
//                         manual_disable_reason: null,
//                         manual_disable_date: null,
//                         is_online: true,
//                         overall_status: 'active'
//                     }
//                 });

//                 // Log the action
//                 await prisma.websiteControlLog.create({
//                     data: {
//                         tenant_id: tenantId,
//                         action_type: 'enable',
//                         taken_by: adminEmail,
//                         previous_status: 'disabled',
//                         new_status: 'active',
//                         ip_address: req.ip
//                     }
//                 });

//                 res.json({
//                     success: true,
//                     message: 'Website enabled',
//                     data: updated
//                 });
//             } catch (error: any) {
//                 res.status(500).json({ success: false, error: error.message });
//             }
//         });

//         // POST /api/v1/admin/website-control/:tenantId/maintenance
//         // Put website in maintenance mode
//         router.post('/:tenantId/maintenance', async (req: Request, res: Response) => {
//             try {
//                 const { tenantId } = req.params;
//                 const { message } = req.body;
//                 const adminEmail = (req as any).user?.email || 'unknown';

//                 const updated = await prisma.websiteStatus.update({
//                     where: { tenant_id: tenantId },
//                     data: {
//                         manual_status: 'maintenance',
//                         status_message: message || 'Under maintenance. Please check back soon.',
//                         manually_disabled_by: adminEmail,
//                         manual_di = req.params;
//                         const adminEmail = (req as any).user?.email || 'unknown';

//                         // Get last 2 logs
//                         const logs = await prisma.websiteControlLog.findMany({
//                             where: { tenant_id: tenantId },
//                             orderBy: { created_at: 'desc' },
//                             take: 2
//                         });

//                         if(logs.length < 1) {
//                             return res.status(400).json({ success: false, error: 'No logs to revert' });
//             }

//         const lastLog = logs[0];
//             const previousState = lastLog.previous_status || 'active';

//             // Update website status
//             const updated = await prisma.websiteStatus.update({
//                 where: { tenant_id: tenantId },
//                 data: {
//                     manual_status: previousState as any,
//                     is_online: previousState === 'active',
//                     overall_status: previousState
//                 }
//             });

//             // Mark as reversed
//             await prisma.websiteControlLog.update({
//                 where: { id: lastLog.id },
//                 data: {
//                     was_reversed: true,
//                     reversed_at: new Date(),
//                     reversed_by: adminEmail
//                 }
//             });

//             res.json({
//                 success: true,
//                 message: 'Reverted to previous state',
//                 data: updated
//             });
//         } catch (error: any) {
//             res.status(500).json({ success: false, error: error.message });
//         }
//     });

// export default router;

// // ============================================================
// // src/routes/v1/admin/security.routes.ts
// // Security Monitoring Routes
// // ============================================================

// import { Router, Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';

// const router = Router();
// const prisma = new PrismaClient();

// // GET /api/v1/admin/security/:tenantId/level
// // Get security level and score
// router.get('/:tenantId/level', async (req: Request, res: Response) => {
//     try {
//         const { tenantId } = req.params;

//         const security = await prisma.tenantSecurityLevel.findUnique({
//             where: { tenant_id: tenantId }
//         });

//         if (!security) {
//             return res.status(404).json({ success: false, error: 'Security data not found' });
//         }

//         res.json({ success: true, data: security });
//     } catch (error: any) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// // POST /api/v1/admin/security/:tenantId/audit
// // Run security audit
// router.post('/:tenantId/audit', async (req: Request, res: Response) => {
//     try {
//         const { tenantId } = req.params;

//         // Calculate security scores
//         const tenant = await prisma.tenant.findUnique({
//             where: { id: tenantId }
//         });

//         if (!tenant) {
//             return res.status(404).json({ success: false, error: 'Tenant not found' });
//         }

//         // Run checks (simplified)
//         const passwordStrength = 75;
//         const encryptionStatus = 90;
//         const dataBackupStatus = 85;

//         const overallScore = (passwordStrength + encryptionStatus + dataBackupStatus) / 3;
//         const riskLevel = overallScore > 80 ? 'low' : overallScore > 60 ? 'medium' : 'high';

//         const updated = await prisma.tenantSecurityLevel.update({
//             where: { tenant_id: tenantId },
//             data: {
//                 password_strength: passwordStrength,
//                 encryption_status: encryptionStatus,
//                 data_backup_status: dataBackupStatus,
//                 overall_security_score: Math.round(overallScore),
//                 risk_level: riskLevel,
//                 last_security_audit: new Date()
//             }
//         });

//         res.json({
//             success: true,
//             message: 'Security audit completed',
//             data: updated
//         });
//     } catch (error: any) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// // GET /api/v1/admin/security/:tenantId/incidents
// // Get security incidents
// router.get('/:tenantId/incidents', async (req: Request, res: Response) => {
//     try {
//         const { tenantId } = req.params;

//         const incidents = await prisma.securityIncident.findMany({
//             where: { tenant_id: tenantId },
//             orderBy: { created_at: 'desc' },
//             take: 50
//         });

//         res.json({ success: true, data: incidents });
//     } catch (error: any) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// // POST /api/v1/admin/security/:tenantId/alert
// // Send security alert to store
// router.post('/:tenantId/alert', async (req: Request, res: Response) => {
//     try {
//         const { tenantId } = req.params;
//         const { message, severity } = req.body;

//         // Get primary contact
//         const contact = await prisma.tenantContact.findFirst({
//             where: { tenant_id: tenantId, is_primary: true }
//         });

//         if (!contact) {
//             return res.status(400).json({ success: false, error: 'No primary contact found' });
//         }

//         // Send alert (email, SMS, etc.)
//         // This is simplified - implement actual email/SMS service

//         res.json({
//             success: true,
//             message: `Alert sent to ${contact.contact_email}`,
//             data: {
//                 tenantId,
//                 alertMessage: message,
//                 severity,
//                 sentAt: new Date()
//             }
//         });
//     } catch (error: any) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

export default router;

// ============================================================
// src/routes/v1/admin/payments.routes.ts
// Payment Tracking & Management Routes
// ============================================================

// import { Router, Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';

// const router = Router();
// const prisma = new PrismaClient();

// GET /api/v1/admin/payments
// List all payments
// router.get('/', async (req: Request, res: Response) => {
//     try {
//         const { status, page = 1, limit = 20 } = req.query;
//         const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

//         const where: any = {};
//         if (status) {
//             where.subscription_status = status;
//         }

//         const payments = await prisma.tenantPaymentStatus.findMany({
//             where,
//             skip,
//             take: parseInt(limit as string),
//             include: { tenant: { select: { business_name: true, email: true } } },
//             orderBy: { updated_at: 'desc' }
//         });

//         const total = await prisma.tenantPaymentStatus.count({ where });

//         res.json({
//             success: true,
//             data: payments,
//             pagination: {
//                 page: parseInt(page as string),
//                 limit: parseInt(limit as string),
//                 total,
//                 pages: Math.ceil(total / parseInt(limit as string))
//             }
//         });
//     } catch (error: any) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// GET /api/v1/admin/payments/overdue
// Get overdue payments
// router.get('/overdue', async (req: Request, res: Response) => {
//     try {
//         const overdue = await prisma.tenantPaymentStatus.findMany({
//             where: { is_overdue: true },
//             include: { tenant: { select: { business_name: true, email: true } } },
//             orderBy: { days_overdue: 'desc' }
//         });

//         res.json({ success: true, data: overdue });
//     } catch (error: any) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// GET /api/v1/admin/payments/:tenantId/status
// Get payment status for specific tenant
// router.get('/:tenantId/status', async (req: Request, res: Response) => {
//     try {
//         const { tenantId } = req.params;

//         const status = await prisma.tenantPaymentStatus.findUnique({
//             where: { tenant_id: tenantId },
//             include: {
//                 tenant: true
//             }
//         });

//         if (!status) {
//             return res.status(404).json({ success: false, error: 'Payment status not found' });
//         }

//         res.json({ success: true, data: status });
//     } catch (error: any) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// PUT /api/v1/admin/payments/:tenantId/upgrade
// Force upgrade plan
// router.put('/:tenantId/upgrade', async (req: Request, res: Response) => {
//     try {
//         const { tenantId } = req.params;
//         const { newPlan, reason } = req.body;

//         const updated = await prisma.tenantPaymentStatus.update({
//             where: { tenant_id: tenantId },
//             data: {
//                 current_plan: newPlan,
//                 subscription_status: 'active',
//                 payment_notes: `Forced upgrade to ${newPlan}. Reason: ${reason}`
//             }
//         });

//         res.json({
//             success: true,
//             message: 'Plan upgraded',
//             data: updated
//         });
//     } catch (error: any) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// // POST /api/v1/admin/payments/:tenantId/manual-charge
// // Manually charge account
// router.post('/:tenantId/manual-charge', async (req: Request, res: Response) => {
//     try {
//         const { tenantId } = req.params;
//         const { amount, reason, method } = req.body;

//         // Create payment log
//         const payment = await prisma.paymentLog.create({
//             data: {
//                 tenant_id: tenantId,
//                 amount,
//                 status: 'completed',
//                 payment_method: method || 'manual',
//                 description: `Manual charge: ${reason}`,
//                 transaction_id: `manual_${Date.now()}`
//             }
//         });

//         res.json({
//             success: true,
//             message: 'Manual charge processed',
//             data: payment
//         });
//     } catch (error: any) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

//export default router;
