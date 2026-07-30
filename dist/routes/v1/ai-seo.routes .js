/**
 * AI SEO Optimization Routes
 * Auto-generate product descriptions, keywords, and SEO metadata
 */
import { Router } from 'express';
// Kama mstari huu utaleta error, soma maelezo chini ya hii code
import AISEOService from '../../services/ai-seo.service.js';
const router = Router();
/**
 * POST /api/v1/ai-seo/generate/:productId
 * Auto-generate complete SEO metadata for a product
 */
router.post('/generate/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const { productName, category, nicheType, imageUrl, price } = req.body;
        if (!productName || !category || !nicheType) {
            return res.status(400).json({
                success: false,
                error: 'Product name, category, and niche type required'
            });
        }
        const result = await AISEOService.autoGenerateProductSEO(productId, productName, category, nicheType, imageUrl, price);
        if (!result.success) {
            return res.status(400).json(result);
        }
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
/**
 * POST /api/v1/ai-seo/description
 * Generate product description only
 */
router.post('/description', async (req, res) => {
    try {
        const { productName, category, nicheType, imageUrl } = req.body;
        if (!productName || !category || !nicheType) {
            return res.status(400).json({
                success: false,
                error: 'Product name, category, and niche type required'
            });
        }
        const result = await AISEOService.generateProductDescription(productName, category, nicheType, imageUrl);
        if (!result.success) {
            return res.status(400).json(result);
        }
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
/**
 * POST /api/v1/ai-seo/keywords
 * Generate SEO keywords and meta tags
 */
router.post('/keywords', async (req, res) => {
    try {
        const { productName, description, category, nicheType } = req.body;
        if (!productName || !description || !category || !nicheType) {
            return res.status(400).json({
                success: false,
                error: 'All fields required'
            });
        }
        const result = await AISEOService.generateSEOKeywords(productName, description, category, nicheType);
        if (!result.success) {
            return res.status(400).json(result);
        }
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
/**
 * POST /api/v1/ai-seo/alt-text
 * Generate alt text for product images
 */
router.post('/alt-text', async (req, res) => {
    try {
        const { productName, category, imageAnalysis } = req.body;
        if (!productName || !category) {
            return res.status(400).json({
                success: false,
                error: 'Product name and category required'
            });
        }
        const result = await AISEOService.generateAltText(productName, category, imageAnalysis);
        if (!result.success) {
            return res.status(400).json(result);
        }
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
/**
 * POST /api/v1/ai-seo/optimize-title
 * Optimize product title for SEO
 */
router.post('/optimize-title', async (req, res) => {
    try {
        const { currentTitle, category, nicheType } = req.body;
        if (!currentTitle || !category || !nicheType) {
            return res.status(400).json({
                success: false,
                error: 'Title, category, and niche type required'
            });
        }
        const result = await AISEOService.optimizeProductTitle(currentTitle, category, nicheType);
        if (!result.success) {
            return res.status(400).json(result);
        }
        res.json({
            success: true,
            data: {
                optimizedTitles: result.data
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
 * POST /api/v1/ai-seo/structured-data
 * Generate JSON-LD structured data
 */
router.post('/structured-data', async (req, res) => {
    try {
        const { productName, description, price, category, rating, imageUrl } = req.body;
        if (!productName || !description || !price || !category) {
            return res.status(400).json({
                success: false,
                error: 'Required fields missing'
            });
        }
        const result = await AISEOService.generateStructuredData(productName, description, price, category, rating, imageUrl);
        if (!result.success) {
            return res.status(400).json(result);
        }
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
/**
 * GET /api/v1/ai-seo/:productId
 * Get product SEO data
 */
router.get('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const result = await AISEOService.getProductSEO(productId);
        if (!result.success) {
            return res.status(404).json(result);
        }
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
/**
 * PUT /api/v1/ai-seo/:productId
 * Update product SEO (manual edits)
 */
router.put('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const updates = req.body;
        const result = await AISEOService.updateProductSEO(productId, updates);
        if (!result.success) {
            return res.status(400).json(result);
        }
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
/**
 * GET /api/v1/ai-seo/:productId/score
 * Calculate SEO score
 */
router.get('/:productId/score', async (req, res) => {
    try {
        const productId = req.params.productId;
        const result = await AISEOService.calculateSEOScore(productId);
        if (!result.success) {
            return res.status(404).json(result);
        }
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
/**
 * POST /api/v1/ai-seo/batch-generate
 * Generate SEO for multiple products
 */
router.post('/batch-generate', async (req, res) => {
    try {
        const products = req.body.products;
        if (!Array.isArray(products)) {
            return res.status(400).json({
                success: false,
                error: 'Products array required'
            });
        }
        const result = await AISEOService.batchGenerateSEO(products);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
export default router;
