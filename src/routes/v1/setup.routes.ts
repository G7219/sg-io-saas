import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { getNiche } from '../../config/niches.js';
import * as Errors from '../../utils/Errors.js';


const router = Router();
const prisma = new PrismaClient();

// Protect all routes
router.use(authMiddleware);

/**
 * POST /v1/setup/step-1
 * Save business info
 */
router.post(
    '/step-1',
    asyncHandler(async (req: Request, res: Response) => {
        const tenantId = req.user!.tenantId;
        const { businessName, businessLocation, phone, description } = req.body;

        if (!businessName || !businessLocation || !phone) {
            throw new Errors.ValidationError('Business name, location, and phone are required');

        }

        const tenant = await prisma.tenant.update({
            where: { id: tenantId },
            data: {
                business_name: businessName,
                business_location: businessLocation,
                phone_number: phone,
                description
            }
        });

        res.json({
            success: true,
            message: 'Step 1 saved',
            data: { step: 1, completed: true }
        });
    })
);

/**
 * POST /v1/setup/step-2
 * Save branding info
 */
router.post(
    '/step-2',
    asyncHandler(async (req: Request, res: Response) => {
        const tenantId = req.user!.tenantId;
        const { primaryColor, secondaryColor, logoUrl, customBrandName } = req.body;

        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId }
        });

        if (!tenant) {
            throw new Errors.NotFoundError('Tenant');
        }

        await prisma.tenant.update({
            where: { id: tenantId },
            data: {
                primary_color: primaryColor
            }
        });

        let settings = await prisma.tenantSettings.findUnique({
            where: { tenant_id: tenantId }
        });

        if (!settings) {
            settings = await prisma.tenantSettings.create({
                data: {
                    tenant_id: tenantId,
                    primary_color: primaryColor,
                    secondary_color: secondaryColor,
                    logo_url: logoUrl,
                    custom_brand_name: customBrandName
                }
            });
        } else {
            settings = await prisma.tenantSettings.update({
                where: { tenant_id: tenantId },
                data: {
                    primary_color: primaryColor,
                    secondary_color: secondaryColor,
                    logo_url: logoUrl,
                    custom_brand_name: customBrandName
                }
            });
        }

        res.json({
            success: true,
            message: 'Step 2 saved',
            data: { step: 2, completed: true }
        });
    })
);

/**
 * POST /v1/setup/step-3
 * Save operations info
 */
router.post(
    '/step-3',
    asyncHandler(async (req: Request, res: Response) => {
        const tenantId = req.user!.tenantId;
        const { contactEmail, contactPhone, openingHours, closingHours } = req.body;

        let settings = await prisma.tenantSettings.findUnique({
            where: { tenant_id: tenantId }
        });

        if (!settings) {
            settings = await prisma.tenantSettings.create({
                data: {
                    tenant_id: tenantId,
                    opening_hours: openingHours,
                    closing_hours: closingHours,
                    contact_email: contactEmail,
                    contact_phone: contactPhone
                }
            });
        } else {
            settings = await prisma.tenantSettings.update({
                where: { tenant_id: tenantId },
                data: {
                    opening_hours: openingHours,
                    closing_hours: closingHours,
                    contact_email: contactEmail,
                    contact_phone: contactPhone
                }
            });
        }

        res.json({
            success: true,
            message: 'Step 3 saved',
            data: { step: 3, completed: true }
        });
    })
);

/**
 * POST /v1/setup/launch
 * Launch business and seed products
 */
router.post(
    '/launch',
    asyncHandler(async (req: Request, res: Response) => {
        const tenantId = req.user!.tenantId;

        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId }
        });

        if (!tenant) {
            throw new Errors.NotFoundError('Tenant');
        }

        const nicheTemplate = getNiche(tenant.selected_niche as any);
        if (!nicheTemplate) {
            throw new Errors.ValidationError('Invalid niche');
        }

        // Seed default products
        const template: any = nicheTemplate;
        if (template.defaultProducts) {
            await prisma.product.createMany({
                data: template.defaultProducts.map((p: any) => ({
                    tenant_id: tenantId,
                    name: p.name,
                    price: p.price,
                    description: p.description,
                    niche: tenant.selected_niche,
                    is_active: true
                }))
            });
        }

        // Mark as launched
        const updated = await prisma.tenant.update({
            where: { id: tenantId },
            data: { is_launched: true }
        });

        res.json({
            success: true,
            message: 'Business launched successfully',
            data: {
                subdomain: updated.subdomain,
                launchUrl: `https://${updated.subdomain}.sg.io`,
                isLaunched: true
            }
        });


        /**
         * GET /v1/setup/status
         * Get setup completion status
         */
        router.get(
            '/status',
            asyncHandler(async (req: Request, res: Response) => {
                const tenantId = req.user!.tenantId;

                const tenant = await prisma.tenant.findUnique({
                    where: { id: tenantId },
                    include: { settings: true }
                });

                if (!tenant) {
                    throw new Errors.NotFoundError('Tenant');
                }

                const status = {
                    step1: !!(tenant.business_name && tenant.business_location),
                    step2: !!(tenant.settings?.primary_color),
                    step3: !!(tenant.settings?.opening_hours),
                    launched: tenant.is_launched
                };

                res.json({
                    success: true,
                    data: {
                        steps: status,
                        currentStep: !status.step1
                            ? 1
                            : !status.step2
                                ? 2
                                : !status.step3
                                    ? 3
                                    : 4,
                        isLaunched: tenant.is_launched
                    }
                });
            })
        );
    }));

export default router;
