import 'multer';
export declare class ImageService {
    /**
     * Upload and save logo
     */
    uploadLogo(tenantId: string, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            logoUrl: string;
            filename: string;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        message?: never;
        data?: never;
    }>;
    /**
     * Upload product image - FIXED
     */
    uploadProductImage(tenantId: string, productId: string, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            imageId: string;
            imageUrl: string;
            thumbUrl: string;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        message?: never;
        data?: never;
    }>;
    /**
     * Set primary product image - FIXED
     */
    setPrimaryImage(productId: string, imageId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            url: string;
            id: string;
            created_at: Date;
            updated_at: Date;
            productId: string;
            altText: string | null;
            caption: string | null;
            isPrimary: boolean;
            thumbUrl: string | null;
            displayOrder: number;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        message?: never;
        data?: never;
    }>;
    /**
     * Delete product image - FIXED
     */
    deleteProductImage(imageId: string): Promise<{
        success: boolean;
        message: string;
        error?: never;
    } | {
        success: boolean;
        error: any;
        message?: never;
    }>;
    /**
     * Update product image metadata - FIXED
     */
    updateImageMetadata(imageId: string, altText: string, caption?: string): Promise<{
        success: boolean;
        data: {
            url: string;
            id: string;
            created_at: Date;
            updated_at: Date;
            productId: string;
            altText: string | null;
            caption: string | null;
            isPrimary: boolean;
            thumbUrl: string | null;
            displayOrder: number;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
    /**
     * Get all product images - FIXED
     */
    getProductImages(productId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            productId: string;
            imageUrl: string;
            thumbUrl: null;
            altText: string | null;
            caption: null;
            isPrimary: boolean;
            displayOrder: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
    /**
     * Update store branding/customization
     */
    updateStoreBranding(tenantId: string, branding: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            primary_color: string;
            logo_url: string | null;
            branding_config: string | null;
            created_at: Date;
            updated_at: Date;
            payment_methods: string | null;
            tenant_id: string;
            secondary_color: string;
            custom_brand_name: string | null;
            opening_hours: string | null;
            closing_hours: string | null;
            contact_email: string | null;
            contact_phone: string | null;
            currency: string;
            shipping_providers: string | null;
            maps_enabled: boolean;
            reviews_enabled: boolean;
            api_enabled: boolean;
            white_label: boolean;
            theme: string | null;
            language: string | null;
            timezone: string | null;
            mobile_money_network: string | null;
            mobile_money_number: string | null;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        message?: never;
        data?: never;
    }>;
    /**
     * Get store branding
     */
    getStoreBranding(tenantId: string): Promise<{
        success: boolean;
        data: {
            primary_color: string;
            secondary_color: string;
            accent_color: string;
            font_family: string;
            border_style: string;
            button_style: string;
            navbar_style: string;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
    /**
     * Generate CSS for custom branding
     */
    generateBrandingCSS(tenantId: string): Promise<{
        success: boolean;
        data: string;
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
    /**
     * Bulk upload product images - FIXED
     */
    bulkUploadImages(tenantId: string, productId: string, files: Express.Multer.File[]): Promise<{
        success: boolean;
        message: string;
        data: {
            successful: any[];
            failed: any[];
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        message?: never;
        data?: never;
    }>;
    /**
     * Reorder product images - FIXED
     */
    reorderImages(productId: string, imageIds: string[]): Promise<{
        success: boolean;
        message: string;
        error?: never;
    } | {
        success: boolean;
        error: any;
        message?: never;
    }>;
}
declare const _default: ImageService;
export default _default;
//# sourceMappingURL=image.service.d.ts.map