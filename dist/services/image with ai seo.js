/**
 * Image Service with AI SEO Integration
 * When customer uploads product image, auto-generate description & SEO
 */
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import AISEOService from './ai-seo.service.js';
const prisma = new PrismaClient();
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'public/uploads';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export class ImageWithAISEOService {
    /**
     * Upload product image WITH AI SEO generation
     */
    async uploadProductImageWithAISEO(tenantId, productId, file, productName, category, nicheType, price) {
        try {
            // Validate file
            if (!file) {
                return { success: false, error: 'No file provided' };
            }
            if (file.size > MAX_FILE_SIZE) {
                return { success: false, error: 'File size exceeds 5MB limit' };
            }
            if (!ALLOWED_TYPES.includes(file.mimetype)) {
                return { success: false, error: 'Invalid file type' };
            }
            // Create product upload directory
            const productDir = path.join(UPLOAD_DIR, 'products', tenantId, productId);
            if (!fs.existsSync(productDir)) {
                fs.mkdirSync(productDir, { recursive: true });
            }
            // Generate filename
            const timestamp = Date.now();
            const filename = `product-${timestamp}.webp`;
            const filepath = path.join(productDir, filename);
            // Optimize image
            await sharp(file.buffer)
                .resize(800, 800, {
                fit: 'cover',
                position: 'center'
            })
                .webp({ quality: 85 })
                .toFile(filepath);
            // Create thumbnail
            const thumbFilename = `thumb-${timestamp}.webp`;
            const thumbPath = path.join(productDir, thumbFilename);
            await sharp(file.buffer)
                .resize(300, 300, {
                fit: 'cover',
                position: 'center'
            })
                .webp({ quality: 80 })
                .toFile(thumbPath);
            // Save to database
            const imageUrl = `products/${tenantId}/${productId}/${filename}`;
            const thumbUrl = `products/${tenantId}/${productId}/${thumbFilename}`;
            const productImage = await prisma.productImage.create({
                data: {
                    productId: productId,
                    url: imageUrl,
                    thumb_url: thumbUrl,
                    isPrimary: false,
                    altText: ''
                }
            });
            // AUTO-GENERATE SEO METADATA
            const seoResult = await AISEOService.autoGenerateProductSEO(productId, productName, category, nicheType, `/${imageUrl}`, price);
            return {
                success: true,
                message: 'Product image uploaded with AI SEO optimization',
                data: {
                    image: {
                        imageId: productImage.id,
                        imageUrl: `/${imageUrl}`,
                        thumbUrl: `/${thumbUrl}`
                    },
                    seo: seoResult.success ? seoResult.data : null,
                    seoGenerated: seoResult.success
                }
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Image upload failed'
            };
        }
    }
    /**
     * Bulk upload with AI SEO for each product
     */
    async bulkUploadWithAISEO(tenantId, productId, files, productName, category, nicheType, price) {
        try {
            const results = [];
            for (const file of files) {
                const result = await this.uploadProductImageWithAISEO(tenantId, productId, file, productName, category, nicheType, price);
                results.push(result);
            }
            const successful = results.filter(r => r.success);
            const failed = results.filter(r => !r.success);
            return {
                success: failed.length === 0,
                message: `${successful.length} images uploaded with SEO, ${failed.length} failed`,
                data: {
                    successful: successful.map(r => r.data),
                    failed: failed.map(r => r.error),
                    seoGenerated: successful.some(r => r.data?.seoGenerated)
                }
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    /**
     * Get product info with SEO data
     */
    async getProductWithSEO(productId) {
        try {
            const product = await prisma.product.findUnique({
                where: { id: productId },
                include: {
                    _count: true,
                    seo: true
                }
            });
            if (!product) {
                return {
                    success: false,
                    error: 'Product not found'
                };
            }
            return {
                success: true,
                data: product
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}
export default new ImageWithAISEOService();
