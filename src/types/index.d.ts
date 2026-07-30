export interface JwtPayload {
    tenantId: string;
    email: string;
    iat?: number;
    exp?: number;
}
export interface TenantContext {
    id: string;
    business_name: string;
    subdomain: string;
    owner_email: string;
    tier: 'lite' | 'rise' | 'elite';
    status: 'trial' | 'active' | 'suspended' | 'expired';
    subscription_expires_at?: Date;
    selected_niche: string;
    is_launched: boolean;
    api_requests_this_month: number;
    primary_color?: string;
    secondary_color?: string;
    logo_url?: string;
}
export interface AuthUser {
    tenantId: string;
    email: string;
    iat: number;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
    meta?: {
        timestamp: string;
        requestId?: string;
    };
}
export interface PaginatedResponse<T = any> extends ApiResponse {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
export interface Product {
    id: string;
    tenant_id: string;
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    category?: string;
    niche?: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
export interface Order {
    id: string;
    tenant_id: string;
    customer_email: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    payment_link?: string;
    created_at: Date;
    updated_at: Date;
}
export interface PaymentLog {
    id: string;
    tenant_id: string;
    plan_type: 'lite' | 'rise' | 'elite';
    amount: number;
    currency: string;
    gateway: 'stripe' | 'flutterwave' | 'mpesa' | 'google_pay' | 'apple_pay';
    status: 'pending' | 'success' | 'failed';
    payment_reference?: string;
    checkout_url?: string;
    created_at: Date;
}
export interface AuditLog {
    id: string;
    tenant_id: string;
    action_type: string;
    details?: any;
    ip_address?: string;
    user_agent?: string;
    created_at: Date;
}
export interface SecurityIncident {
    id: string;
    tenant_id?: string;
    attacker_ip: string;
    malicious_payload?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    created_at: Date;
}
export interface TenantSettings {
    tenant_id: string;
    primary_color: string;
    secondary_color: string;
    logo_url?: string;
    custom_brand_name?: string;
    opening_hours?: string;
    closing_hours?: string;
    contact_email?: string;
    contact_phone?: string;
    currency: string;
    payment_methods?: string[];
    social_integrations?: any;
}
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
            tenant?: TenantContext;
            tenantId?: string;
            id?: string;
        }
    }
}
export type SubscriptionTier = 'lite' | 'rise' | 'elite';
export type SubscriptionStatus = 'trial' | 'active' | 'suspended' | 'expired';
export type PaymentGateway = 'stripe' | 'flutterwave' | 'mpesa' | 'google_pay' | 'apple_pay';
export type OrderStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type Niche = 'pharmacy' | 'restaurant' | 'real_estate' | 'salon' | 'church' | 'electronics' | 'boutique' | 'hardware';
//# sourceMappingURL=index.d.ts.map