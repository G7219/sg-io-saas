/**
 * Payment Service
 * Handle all payment processing, subscriptions, and billing
 */
import Stripe from 'stripe';
export declare class PaymentService {
    /**
     * Initialize payment for tenant
     */
    initializePayment(tenantId: string, plan: string, email: string): Promise<{
        success: boolean;
        message: string;
        data: {
            plan: string;
            price: number;
            payment_required: boolean;
            clientSecret?: never;
            amount?: never;
        };
        error?: never;
    } | {
        success: boolean;
        data: {
            clientSecret: string | null;
            amount: number;
            plan: string;
            price?: never;
            payment_required?: never;
        };
        message?: never;
        error?: never;
    } | {
        success: boolean;
        error: any;
        message?: never;
        data?: never;
    }>;
    /**
     * Process successful payment
     */
    processPayment(tenantId: string, paymentIntentId: string, plan: string, amount: number): Promise<{
        success: boolean;
        message: string;
        data: {
            paymentLog: {
                id: string;
                status: string;
                created_at: Date;
                updated_at: Date;
                tenant_id: string;
                currency: string;
                amount: number;
                provider: string;
                provider_transaction_id: string | null;
                checkout_url: string | null;
                is_location_payment: boolean;
                additional_locations: number;
                location_cost_per: number;
                refund_reason: string | null;
                refund_date: Date | null;
                refund_amount: number | null;
                metadata: string | null;
                order_id: string | null;
                payment_method_id: string;
            };
            paymentStatus: any;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        message?: never;
        data?: never;
    }>;
    /**
     * Get payment methods for tenant
     */
    getPaymentMethods(tenantId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            created_at: Date;
            type: never;
            last_four: never;
            is_default: never;
        }[];
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
    /**
     * Add payment method
     */
    addPaymentMethod(tenantId: string, type: string, token: string, lastFour: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            created_at: Date;
            updated_at: Date;
            tenant_id: string;
            is_active: boolean;
            method_type: string;
            provider_id: string | null;
            is_primary: boolean;
            api_key: string | null;
            api_secret: string | null;
            merchant_id: string | null;
            webhook_secret: string | null;
            public_key: string | null;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        message?: never;
        data?: never;
    }>;
    /**
     * Get payment history
     */
    getPaymentHistory(tenantId: string, limit?: number): Promise<{
        success: boolean;
        data: {
            id: string;
            status: string;
            created_at: Date;
            updated_at: Date;
            tenant_id: string;
            currency: string;
            amount: number;
            provider: string;
            provider_transaction_id: string | null;
            checkout_url: string | null;
            is_location_payment: boolean;
            additional_locations: number;
            location_cost_per: number;
            refund_reason: string | null;
            refund_date: Date | null;
            refund_amount: number | null;
            metadata: string | null;
            order_id: string | null;
            payment_method_id: string;
        }[];
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
    /**
     * Get payment status
     */
    getPaymentStatus(tenantId: string): Promise<{
        success: boolean;
        data: any;
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
    /**
     * Cancel subscription
     */
    cancelSubscription(tenantId: string, reason: string): Promise<{
        success: boolean;
        message: string;
        data: any;
        error?: never;
    } | {
        success: boolean;
        error: any;
        message?: never;
        data?: never;
    }>;
    /**
     * Upgrade subscription
     */
    upgradeSubscription(tenantId: string, newPlan: string): Promise<{
        success: boolean;
        message: string;
        data: any;
        error?: never;
    } | {
        success: boolean;
        error: any;
        message?: never;
        data?: never;
    }>;
    /**
     * Check if subscription is overdue
     */
    checkOverdueSubscriptions(): Promise<{
        success: boolean;
        message: string;
        data: {
            overdueCount: any;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        message?: never;
        data?: never;
    }>;
    /**
     * Refund payment
     */
    refundPayment(paymentId: string, reason: string): Promise<{
        success: boolean;
        message: string;
        data: Stripe.Response<Stripe.Refund>;
        error?: never;
    } | {
        success: boolean;
        error: any;
        message?: never;
        data?: never;
    }>;
    /**
     * Get invoice
     */
    getInvoice(paymentId: string): Promise<{
        success: boolean;
        data: {
            invoice_id: string;
            business_name: string;
            email: never;
            amount: number;
            date: Date;
            status: string;
            description: any;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
    /**
     * Calculate plan pricing with currency
     */
    calculatePricing(plan: string, currency?: string): Promise<{
        success: boolean;
        data: {
            plan: string;
            currency: string;
            base_price_usd: number;
            converted_price: number;
            conversion_rate: number;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
}
declare const _default: PaymentService;
export default _default;
//# sourceMappingURL=payment.d.ts.map