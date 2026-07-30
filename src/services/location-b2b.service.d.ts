/**
 * Locations B2B Service
 * Multi-branch and B2B operations management
 */
import { PrismaClient } from '@prisma/client';
export declare class LocationsB2BService {
    private prisma;
    constructor(prisma: PrismaClient);
    /**
     * Create a new location/branch
     */
    createLocation(tenantId: string, locationData: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            phone_number: string | null;
            created_at: Date;
            updated_at: Date;
            name: string;
            tenant_id: string;
            opening_hours: string | null;
            closing_hours: string | null;
            is_active: boolean;
            instagram_handle: string | null;
            tiktok_handle: string | null;
            twitter_handle: string | null;
            email: string | null;
            slug: string | null;
            address: string;
            city: string;
            country: string;
            latitude: number | null;
            longitude: number | null;
            is_main_branch: boolean;
            facebook_page: string | null;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        message?: never;
        data?: never;
    }>;
    /**
     * Get all locations for a tenant
     */
    getLocations(tenantId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            phone_number: string | null;
            created_at: Date;
            updated_at: Date;
            name: string;
            tenant_id: string;
            opening_hours: string | null;
            closing_hours: string | null;
            is_active: boolean;
            instagram_handle: string | null;
            tiktok_handle: string | null;
            twitter_handle: string | null;
            email: string | null;
            slug: string | null;
            address: string;
            city: string;
            country: string;
            latitude: number | null;
            longitude: number | null;
            is_main_branch: boolean;
            facebook_page: string | null;
        }[];
        count: number;
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
        count?: never;
    }>;
    /**
     * Get single location
     */
    getLocation(locationId: string): Promise<{
        success: boolean;
        data: {
            orders: {
                id: string;
                status: string;
                created_at: Date;
                updated_at: Date;
                tenant_id: string;
                currency: string;
                location_id: string;
                amount: number;
                order_number: string;
                customer_email: string;
                customer_phone: string | null;
                customer_name: string | null;
                shipping_address: string | null;
                shipping_method: string | null;
                tracking_number: string | null;
                estimated_delivery: Date | null;
                is_b2b: boolean;
                b2b_discount_applied: number;
            }[];
            inventory: {
                id: string;
                created_at: Date;
                updated_at: Date;
                location_id: string;
                product_id: string;
                quantity: number;
                reorder_level: number;
            }[];
        } & {
            id: string;
            phone_number: string | null;
            created_at: Date;
            updated_at: Date;
            name: string;
            tenant_id: string;
            opening_hours: string | null;
            closing_hours: string | null;
            is_active: boolean;
            instagram_handle: string | null;
            tiktok_handle: string | null;
            twitter_handle: string | null;
            email: string | null;
            slug: string | null;
            address: string;
            city: string;
            country: string;
            latitude: number | null;
            longitude: number | null;
            is_main_branch: boolean;
            facebook_page: string | null;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
    /**
     * Update location
     */
    updateLocation(locationId: string, updateData: any): Promise<{
        success: boolean;
        data: {
            id: string;
            phone_number: string | null;
            created_at: Date;
            updated_at: Date;
            name: string;
            tenant_id: string;
            opening_hours: string | null;
            closing_hours: string | null;
            is_active: boolean;
            instagram_handle: string | null;
            tiktok_handle: string | null;
            twitter_handle: string | null;
            email: string | null;
            slug: string | null;
            address: string;
            city: string;
            country: string;
            latitude: number | null;
            longitude: number | null;
            is_main_branch: boolean;
            facebook_page: string | null;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
    /**
     * Set main branch
     */
    setMainBranch(tenantId: string, locationId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            phone_number: string | null;
            created_at: Date;
            updated_at: Date;
            name: string;
            tenant_id: string;
            opening_hours: string | null;
            closing_hours: string | null;
            is_active: boolean;
            instagram_handle: string | null;
            tiktok_handle: string | null;
            twitter_handle: string | null;
            email: string | null;
            slug: string | null;
            address: string;
            city: string;
            country: string;
            latitude: number | null;
            longitude: number | null;
            is_main_branch: boolean;
            facebook_page: string | null;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        message?: never;
        data?: never;
    }>;
    /**
     * Get inventory for location
     */
    getLocationInventory(locationId: string): Promise<{
        success: boolean;
        data: ({
            product: {
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
        } & {
            id: string;
            created_at: Date;
            updated_at: Date;
            location_id: string;
            product_id: string;
            quantity: number;
            reorder_level: number;
        })[];
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
    /**
     * Transfer inventory between locations
     */
    transferInventory(fromLocationId: string, toLocationId: string, productId: string, quantity: number): Promise<{
        success: boolean;
        message: string;
        error?: never;
    } | {
        success: boolean;
        error: any;
        message?: never;
    }>;
    /**
     * Get B2B discounts for location
     */
    getB2BDiscounts(locationId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            status: string;
            created_at: Date;
            updated_at: Date;
            tenant_id: string | null;
            is_active: boolean;
            location_id: string;
            customer_email: string | null;
            customer_name: string | null;
            product_id: string;
            customer_company: string | null;
            requested_discount: number;
            approved_discount: number | null;
            min_order_value: number;
            admin_notes: string | null;
            customer_message: string | null;
            is_volume_based: boolean;
            min_quantity: number | null;
            discount_percentage: number;
            discount_amount: number | null;
            valid_from: Date | null;
            valid_until: Date | null;
        }[];
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
    /**
     * Create B2B discount
     */
    createB2BDiscount(locationId: string, discountData: any): Promise<{
        success: boolean;
        data: {
            id: string;
            status: string;
            created_at: Date;
            updated_at: Date;
            tenant_id: string | null;
            is_active: boolean;
            location_id: string;
            customer_email: string | null;
            customer_name: string | null;
            product_id: string;
            customer_company: string | null;
            requested_discount: number;
            approved_discount: number | null;
            min_order_value: number;
            admin_notes: string | null;
            customer_message: string | null;
            is_volume_based: boolean;
            min_quantity: number | null;
            discount_percentage: number;
            discount_amount: number | null;
            valid_from: Date | null;
            valid_until: Date | null;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
    /**
     * Get location analytics
     */
    getLocationAnalytics(locationId: string, days?: number): Promise<{
        success: boolean;
        data: {
            total_orders: number;
            total_revenue: any;
            average_order_value: number;
            period_days: number;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
    /**
     * Delete location
     */
    deleteLocation(locationId: string): Promise<{
        success: boolean;
        message: string;
        error?: never;
    } | {
        success: boolean;
        error: any;
        message?: never;
    }>;
}
export default LocationsB2BService;
//# sourceMappingURL=location-b2b.service.d.ts.map