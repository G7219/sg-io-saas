/**
 * AI SEO Service
 * Auto-generate product descriptions, keywords, and SEO optimization
 * Using Gemini AI and Claude
 */
export declare class AISEOService {
    /**
     * Generate product description from image + product info
     */
    generateProductDescription(productName: string, category: string, nicheType: string, imageUrl?: string): Promise<{
        success: boolean;
        data: {
            description: string;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
    /**
     * Generate SEO keywords and meta tags
     */
    generateSEOKeywords(productName: string, description: string, category: string, nicheType: string): Promise<{
        success: boolean;
        data: any
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
    /**
     * Generate alt text for product images (accessibility + SEO)
     */
    generateAltText(productName: string, category: string, imageAnalysis?: string): Promise<{
        success: boolean;
        data: {
            altText: string;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
    /**
     * Optimize product title for SEO
     */
    optimizeProductTitle(currentTitle: string, category: string, nicheType: string): Promise<{
        success: boolean;
        data: any;
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
    /**
     * Generate structured data (JSON-LD) for SEO
     */
    generateStructuredData(productName: string, description: string, price: number, category: string, rating?: number, imageUrl?: string): Promise<{
        success: boolean;
        data: {
            '@context': string;
            '@type': string;
            name: string;
            description: string;
            category: string;
            price: string;
            priceCurrency: string;
            image: string;
            aggregateRating: {
                '@type': string;
                ratingValue: string;
                ratingCount: string;
            } | undefined;
            availability: string;
            seller: {
                '@type': string;
                name: string;
            };
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
    /**
     * Auto-generate complete SEO metadata from product image
     */
    autoGenerateProductSEO(productId: string, productName: string, category: string, nicheType: string, imageUrl?: string, price?: number): Promise<{
        success: boolean;
        data: {
            description: string;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    } | {
        success: boolean;
        message: string;
        data: {
            description: string;
            keywords: any;
            metaTitle: any;
            metaDescription: any;
            altText: string | undefined;
            longTailKeywords: any;
            optimizedTitles: any;
            structuredData: {
                '@context': string;
                '@type': string;
                name: string;
                description: string;
                category: string;
                price: string;
                priceCurrency: string;
                image: string;
                aggregateRating: {
                    '@type': string;
                    ratingValue: string;
                    ratingCount: string;
                } | undefined;
                availability: string;
                seller: {
                    '@type': string;
                    name: string;
                };
            } | undefined;
        };
    }>;
    /**
     * Get product SEO data
     */
    getProductSEO(productId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            description: string | null;
            productId: string;
            meta_title: string | null;
            meta_description: string | null;
            keywords: string | null;
            long_tail_keywords: import("@prisma/client/runtime/library").JsonValue | null;
            alt_text: string | null;
            structured_data: import("@prisma/client/runtime/library").JsonValue | null;
            optimized_titles: import("@prisma/client/runtime/library").JsonValue | null;
            ai_generated: boolean;
            generated_at: Date;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
    /**
     * Update product SEO (manual edits)
     */
    updateProductSEO(productId: string, updates: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            description: string | null;
            productId: string;
            meta_title: string | null;
            meta_description: string | null;
            keywords: string | null;
            long_tail_keywords: import("@prisma/client/runtime/library").JsonValue | null;
            alt_text: string | null;
            structured_data: import("@prisma/client/runtime/library").JsonValue | null;
            optimized_titles: import("@prisma/client/runtime/library").JsonValue | null;
            ai_generated: boolean;
            generated_at: Date;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        message?: never;
        data?: never;
    }>;
    /**
     * Generate SEO score for product
     */
    calculateSEOScore(productId: string): Promise<{
        success: boolean;
        data: {
            score: number;
            rating: string;
            details: any;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
    /**
     * Batch generate SEO for multiple products
     */
    batchGenerateSEO(products: any[]): Promise<{
        success: boolean;
        message: string;
        data: {
            total: number;
            successful: number;
            failed: number;
            results: any[];
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        message?: never;
        data?: never;
    }>;
}
declare const _default: AISEOService;
export default _default;
//# sourceMappingURL=ai-seo.service.d.ts.map