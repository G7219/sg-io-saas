/**
 * Image Service - FIXED VERSION
 * Handle logo uploads, product images, and store branding
 */
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import 'multer';
const prisma = new PrismaClient();
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'public/uploads';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export class ImageService {
    /**
     * Upload and save logo
     */
    async uploadLogo(tenantId, file) {
        try {
            // Validate file
            if (!file) {
                return {
                    success: false,
                    error: 'No file provided'
                };
            }
            if (file.size > MAX_FILE_SIZE) {
                return {
                    success: false,
                    error: 'File size exceeds 5MB limit'
                };
            }
            if (!ALLOWED_TYPES.includes(file.mimetype)) {
                return {
                    success: false,
                    error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF allowed'
                };
            }
            // Create tenant upload directory
            const tenantDir = path.join(UPLOAD_DIR, 'logos', tenantId);
            if (!fs.existsSync(tenantDir)) {
                fs.mkdirSync(tenantDir, { recursive: true });
            }
            // Generate filename with timestamp
            const timestamp = Date.now();
            const filename = `logo-${timestamp}.png`;
            const filepath = path.join(tenantDir, filename);
            // Optimize image using sharp
            await sharp(file.buffer)
                .resize(400, 400, {
                fit: 'contain',
                background: { r: 245, g: 241, b: 232, alpha: 1 } // Cream color
            })
                .png({ quality: 90 })
                .toFile(filepath);
            // Get old logo to delete
            const tenant = await prisma.tenant.findUnique({
                where: { id: tenantId }
            });
            if (tenant?.logo_url) {
                const oldPath = path.join(UPLOAD_DIR, tenant.logo_url);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            // Save to database
            const logoUrl = `logos/${tenantId}/${filename}`;
            const updated = await prisma.tenant.update({
                where: { id: tenantId },
                data: { logo_url: logoUrl }
            });
            return {
                success: true,
                message: 'Logo uploaded successfully',
                data: {
                    logoUrl: `/${logoUrl}`,
                    filename
                }
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Logo upload failed'
            };
        }
    }
    /**
     * Upload product image - FIXED
     */
    async uploadProductImage(tenantId, productId, file) {
        try {
            if (!file) {
                return {
                    success: false,
                    error: 'No file provided'
                };
            }
            if (file.size > MAX_FILE_SIZE) {
                return {
                    success: false,
                    error: 'File size exceeds 5MB limit'
                };
            }
            if (!ALLOWED_TYPES.includes(file.mimetype)) {
                return {
                    success: false,
                    error: 'Invalid file type'
                };
            }
            // Verify product exists
            const product = await prisma.product.findUnique({
                where: { id: productId }
            });
            if (!product) {
                return {
                    success: false,
                    error: 'Product not found'
                };
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
            // Optimize main image
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
            // Save to database with correct field names
            const imageUrl = `products/${tenantId}/${productId}/${filename}`;
            const thumbUrl = `products/${tenantId}/${productId}/${thumbFilename}`;
            const productImage = await prisma.productImage.create({
                data: {
                    productId: productId,
                    url: imageUrl,
                    thumbUrl: thumbUrl,
                    isPrimary: false,
                    altText: '',
                    displayOrder: 0
                }
            });
            return {
                success: true,
                message: 'Product image uploaded',
                data: {
                    imageId: productImage.id,
                    imageUrl: `/${imageUrl}`,
                    thumbUrl: `/${thumbUrl}`
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
     * Set primary product image - FIXED
     */
    async setPrimaryImage(productId, imageId) {
        try {
            // Remove current primary
            await prisma.productImage.updateMany({
                where: { productId: productId },
                data: { isPrimary: false }
            });
            // Set new primary
            const updated = await prisma.productImage.update({
                where: { id: imageId },
                data: { is_primary: true }
            });
            return {
                success: true,
                message: 'Primary image set',
                data: updated
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
     * Delete product image - FIXED
     */
    async deleteProductImage(imageId) {
        try {
            const image = await prisma.productImage.findUnique({
                where: { id: imageId }
            });
            if (!image) {
                return {
                    success: false,
                    error: 'Image not found'
                };
            }
            // Delete from filesystem
            const imagePath = path.join(UPLOAD_DIR, image.url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
            // Delete from database
            await prisma.productImage.delete({
                where: { id: imageId }
            });
            return {
                success: true,
                message: 'Image deleted'
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
     * Update product image metadata - FIXED
     */
    async updateImageMetadata(imageId, altText, caption) {
        try {
            const updated = await prisma.productImage.update({
                where: { id: imageId },
                data: {
                    alt_text: altText,
                    caption: caption || null
                }
            });
            return {
                success: true,
                data: updated
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
     * Get all product images - FIXED
     */
    async getProductImages(productId) {
        try {
            const images = await prisma.productImage.findMany({
                where: { productId: productId },
                orderBy: [{ isPrimary: 'desc' }] //hapa nilifuta display_orders
            });
            return {
                success: true,
                data: images.map((img) => ({
                    id: img.id,
                    productId: img.productId,
                    imageUrl: `/${img.url}`,
                    thumbUrl: null,
                    altText: img.altText,
                    caption: null,
                    isPrimary: img.isPrimary,
                    displayOrder: 0,
                    createdAt: img.created_at,
                    updatedAt: img.created_at,
                }))
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
     * Update store branding/customization
     */
    async updateStoreBranding(tenantId, branding) {
        try {
            const { primary_color, secondary_color, accent_color, font_family, border_style, button_style, navbar_style } = branding;
            // Save to database
            const updated = await prisma.tenantSettings.upsert({
                where: { tenant_id: tenantId },
                update: {
                    branding_config: JSON.stringify({
                        primary_color: primary_color || '#2D3E3F',
                        secondary_color: secondary_color || '#1A2F3F',
                        accent_color: accent_color || '#D4AF37',
                        font_family: font_family || 'Georgia, serif',
                        border_style: border_style || 'elegant',
                        button_style: button_style || 'rounded',
                        navbar_style: navbar_style || 'classic'
                    })
                },
                create: {
                    tenant_id: tenantId,
                    branding_config: JSON.stringify({
                        primary_color: primary_color || '#2D3E3F',
                        secondary_color: secondary_color || '#1A2F3F',
                        accent_color: accent_color || '#D4AF37',
                        font_family: font_family || 'Georgia, serif',
                        border_style: border_style || 'elegant',
                        button_style: button_style || 'rounded',
                        navbar_style: navbar_style || 'classic'
                    })
                }
            });
            return {
                success: true,
                message: 'Store branding updated',
                data: updated
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
     * Get store branding
     */
    async getStoreBranding(tenantId) {
        try {
            const settings = await prisma.tenantSettings.findUnique({
                where: { tenant_id: tenantId }
            });
            const defaultBranding = {
                primary_color: '#2D3E3F',
                secondary_color: '#1A2F3F',
                accent_color: '#D4AF37',
                font_family: 'Georgia, serif',
                border_style: 'elegant',
                button_style: 'rounded',
                navbar_style: 'classic'
            };
            let branding = defaultBranding;
            if (settings?.branding_config) {
                try {
                    branding = JSON.parse(settings.branding_config);
                }
                catch {
                    branding = defaultBranding;
                }
            }
            return {
                success: true,
                data: branding
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
     * Generate CSS for custom branding
     */
    async generateBrandingCSS(tenantId) {
        try {
            const branding = await this.getStoreBranding(tenantId);
            if (!branding.success) {
                return {
                    success: false,
                    error: 'Failed to get branding'
                };
            }
            const config = branding.data;
            const css = `
/* Store Branding CSS - ${tenantId} */
:root {
  --primary-color: ${config.primary_color};
  --secondary-color: ${config.secondary_color};
  --accent-color: ${config.accent_color};
  --font-family: ${config.font_family};
}

body {
  font-family: ${config.font_family};
  color: var(--primary-color);
}

.navbar {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
}

.btn-primary {
  background: var(--accent-color);
  color: white;
}

.btn-secondary {
  border: 2px solid var(--accent-color);
  color: var(--accent-color);
}

.card {
  border: 1px solid var(--accent-color);
}

.heading {
  color: var(--primary-color);
  font-weight: 600;
}

.accent-text {
  color: var(--accent-color);
}
      `.trim();
            return {
                success: true,
                data: css
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
     * Bulk upload product images - FIXED
     */
    async bulkUploadImages(tenantId, productId, files) {
        try {
            const results = [];
            for (const file of files) {
                const result = await this.uploadProductImage(tenantId, productId, file);
                results.push(result);
            }
            const successful = results.filter(r => r.success);
            const failed = results.filter(r => !r.success);
            return {
                success: failed.length === 0,
                message: `${successful.length} images uploaded, ${failed.length} failed`,
                data: {
                    successful: successful.map(r => r.data),
                    failed: failed.map(r => r.error)
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
     * Reorder product images - FIXED
     */
    async reorderImages(productId, imageIds) {
        try {
            for (let i = 0; i < imageIds.length; i++) {
                await prisma.productImage.update({
                    where: { id: imageIds[i] },
                    data: { display_order: i }
                });
            }
            return {
                success: true,
                message: 'Images reordered'
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
export default new ImageService();
//# sourceMappingURL=image.service.js.map