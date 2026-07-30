/**
 * Image Upload Routes
 * Handle logo, product images, and branding
 */

import { Router, Request, Response } from 'express';
import multer from 'multer';
import ImageService from '../../services/image.service.js';

const router = Router();

// Configure multer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

/**
 * POST /api/v1/images/logo
 * Upload store logo
 */
router.post('/logo', upload.single('logo'), async (req: Request, res: Response) => {
    try {
        const tenantId = (req as any).user?.tenantId;

        if (!tenantId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        const result = await ImageService.uploadLogo(tenantId, req.file!);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/v1/images/product/:productId
 * Upload product image
 */
router.post('/product/:productId', upload.single('image'), async (req: Request, res: Response) => {
    try {
        const tenantId = (req as any).user?.tenantId;
        const productId = req.params.productId;

        if (!tenantId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        const result = await ImageService.uploadProductImage(tenantId, productId as string, req.file!);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/v1/images/product/:productId/bulk
 * Bulk upload product images
 */
router.post('/product/:productId/bulk', upload.array('images', 10), async (req: Request, res: Response) => {
    try {
        const tenantId = (req as any).user?.tenantId;
        const productId = req.params.productId;

        if (!tenantId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        const result = await ImageService.bulkUploadImages(tenantId, productId as string, req.files as Express.Multer.File[]);

        res.json(result);
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/v1/images/product/:productId
 * Get all product images
 */
router.get('/product/:productId', async (req: Request, res: Response) => {
    try {
        const productId = req.params.productId;

        const result = await ImageService.getProductImages(productId as string);

        if (!result.success) {
            return res.status(404).json(result);
        }

        res.json(result);
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * PUT /api/v1/images/:imageId/primary
 * Set as primary image
 */
router.put('/:imageId/primary', async (req: Request, res: Response) => {
    try {
        const imageId = req.params.imageId;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                error: 'Product ID required'
            });
        }

        const result = await ImageService.setPrimaryImage(productId, imageId as string);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * PUT /api/v1/images/:imageId
 * Update image metadata
 */
router.put('/:imageId', async (req: Request, res: Response) => {
    try {
        const imageId = req.params.imageId;
        const { altText, caption } = req.body;

        const result = await ImageService.updateImageMetadata(imageId as string, altText, caption);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * DELETE /api/v1/images/:imageId
 * Delete product image
 */
router.delete('/:imageId', async (req: Request, res: Response) => {
    try {
        const imageId = req.params.imageId;

        const result = await ImageService.deleteProductImage(imageId as string);

        if (!result.success) {
            return res.status(404).json(result);
        }

        res.json(result);
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * PUT /api/v1/images/branding/update
 * Update store branding
 */
router.put('/branding/update', async (req: Request, res: Response) => {
    try {
        const tenantId = (req as any).user?.tenantId;

        if (!tenantId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        const branding = req.body;

        const result = await ImageService.updateStoreBranding(tenantId, branding);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/v1/images/branding
 * Get store branding
 */
router.get('/branding', async (req: Request, res: Response) => {
    try {
        const tenantId = (req as any).user?.tenantId;

        if (!tenantId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        const result = await ImageService.getStoreBranding(tenantId);

        res.json(result);
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/v1/images/branding/css
 * Get generated branding CSS
 */
router.get('/branding/css', async (req: Request, res: Response) => {
    try {
        const tenantId = (req as any).user?.tenantId;

        if (!tenantId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        const result = await ImageService.generateBrandingCSS(tenantId);

        if (!result.success) {
            return res.status(500).json(result);
        }

        res.setHeader('Content-Type', 'text/css');
        res.send(result.data);
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * PUT /api/v1/images/product/:productId/reorder
 * Reorder product images
 */
router.put('/product/:productId/reorder', async (req: Request, res: Response) => {
    try {
        const productId = req.params.productId;
        const { imageIds } = req.body;

        if (!Array.isArray(imageIds)) {
            return res.status(400).json({
                success: false,
                error: 'imageIds must be an array'
            });
        }

        const result = await ImageService.reorderImages(productId as string, imageIds);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;
