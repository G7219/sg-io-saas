/**
 * Image Service with AI SEO Integration
 * When customer uploads product image, auto-generate description & SEO
 */
export declare class ImageWithAISEOService {
    /**
     * Upload product image WITH AI SEO generation
     */
    uploadProductImageWithAISEO(tenantId: string, productId: string, file: Express.Multer.File, productName: string, category: string, nicheType: string, price?: number): Promise<{
        success: boolean;
        message: string;
        data: {
            image: {
                imageId: string;
                imageUrl: string;
                thumbUrl: string;
            };
            seo: any;
            seoGenerated: any;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        message?: never;
        data?: never;
    }>;
    /**
     * Bulk upload with AI SEO for each product
     */
    bulkUploadWithAISEO(tenantId: string, productId: string, files: Express.Multer.File[], productName: string, category: string, nicheType: string, price?: number): Promise<{
        success: boolean;
        message: string;
        data: {
            successful: any[];
            failed: any[];
            seoGenerated: boolean;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        message?: never;
        data?: never;
    }>;
    /**
     * Get product info with SEO data
     */
    getProductWithSEO(productId: string): Promise<{
        success: boolean;
        data: {
            _count: {
                tenant: number;
                inventory: number;
                order_items: number;
                ProductSEO: number;
            };
            seo: never;
        } & {
            id: string;
            created_at: Date;
            updated_at: Date;
            name: string;
            tenant_id: string;
            is_active: boolean;
            description: string | null;
            category: string | null;
            price: number;
            niche: string | null;
            image_url: string | null;
            productImage: string | null;
            product_image: string | null;
            images: string | null;
            wholesale_price: number | null;
            b2b_min_quantity: number;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
}
declare const _default: ImageWithAISEOService;
export default _default;
//# sourceMappingURL=image%20with%20ai%20seo.d.ts.map