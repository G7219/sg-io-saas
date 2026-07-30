/**
 * Payment Service
 * Handle all payment processing, subscriptions, and billing
 */
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-04-10'
});
export class PaymentService {
    /**
     * Initialize payment for tenant
     */
    async initializePayment(tenantId, plan, email) {
        try {
            const planPrices = {
                'FREE': 0,
                'LITE': 30,
                'RISE': 75,
                'ELITE': 100
            };
            const price = planPrices[plan] || 0;
            if (price === 0) {
                return {
                    success: true,
                    message: 'Free plan activated',
                    data: {
                        plan,
                        price: 0,
                        payment_required: false
                    }
                };
            }
            // Create Stripe payment intent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(price * 100), // Convert to cents
                currency: 'usd',
                metadata: {
                    tenantId,
                    plan,
                    email
                }
            });
            return {
                success: true,
                data: {
                    clientSecret: paymentIntent.client_secret,
                    amount: price,
                    plan
                }
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Payment initialization failed'
            };
        }
    }
    /**
     * Process successful payment
     */
    async processPayment(tenantId, paymentIntentId, plan, amount) {
        try {
            // Get payment intent from Stripe
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            if (paymentIntent.status !== 'succeeded') {
                return {
                    success: false,
                    error: 'Payment not completed'
                };
            }
            // Create payment log
            const paymentLog = await prisma.paymentLog.create({
                data: {
                    tenant_id: tenantId,
                    amount,
                    status: 'success',
                    payment_method: 'stripe',
                    stripe_payment_id: paymentIntentId,
                    description: `Payment for ${plan} plan`
                }
            });
            // Update tenant payment status
            const nextPaymentDate = new Date();
            nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
            const paymentStatus = await prisma.tenantPaymentStatus.upsert({
                where: { tenant_id: tenantId },
                update: {
                    current_plan: plan,
                    subscription_status: 'active',
                    next_payment_date: nextPaymentDate,
                    is_overdue: false,
                    last_payment_date: new Date()
                },
                create: {
                    tenant_id: tenantId,
                    current_plan: plan,
                    subscription_status: 'active',
                    next_payment_date: nextPaymentDate,
                    is_overdue: false,
                    last_payment_date: new Date()
                }
            });
            return {
                success: true,
                message: 'Payment processed successfully',
                data: {
                    paymentLog,
                    paymentStatus
                }
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Payment processing failed'
            };
        }
    }
    /**
     * Get payment methods for tenant
     */
    async getPaymentMethods(tenantId) {
        try {
            const methods = await prisma.paymentMethod.findMany({
                where: { tenant_id: tenantId },
                select: {
                    id: true,
                    type: true,
                    last_four: true,
                    is_default: true,
                    created_at: true
                }
            });
            return {
                success: true,
                data: methods
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
     * Add payment method
     */
    async addPaymentMethod(tenantId, type, token, lastFour) {
        try {
            const method = await prisma.paymentMethod.create({
                data: {
                    tenant_id: tenantId,
                    type,
                    token,
                    last_four: lastFour,
                    is_default: true
                }
            });
            return {
                success: true,
                message: 'Payment method added',
                data: method
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
     * Get payment history
     */
    async getPaymentHistory(tenantId, limit = 50) {
        try {
            const history = await prisma.paymentLog.findMany({
                where: { tenant_id: tenantId },
                orderBy: { created_at: 'desc' },
                take: limit
            });
            return {
                success: true,
                data: history
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
     * Get payment status
     */
    async getPaymentStatus(tenantId) {
        try {
            const status = await prisma.tenantPaymentStatus.findUnique({
                where: { tenant_id: tenantId }
            });
            if (!status) {
                return {
                    success: false,
                    error: 'Payment status not found'
                };
            }
            return {
                success: true,
                data: status
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
     * Cancel subscription
     */
    async cancelSubscription(tenantId, reason) {
        try {
            const updated = await prisma.tenantPaymentStatus.update({
                where: { tenant_id: tenantId },
                data: {
                    subscription_status: 'cancelled',
                    current_plan: 'FREE',
                    cancellation_reason: reason,
                    cancelled_at: new Date()
                }
            });
            return {
                success: true,
                message: 'Subscription cancelled',
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
     * Upgrade subscription
     */
    async upgradeSubscription(tenantId, newPlan) {
        try {
            const validPlans = ['LITE', 'RISE', 'ELITE'];
            if (!validPlans.includes(newPlan)) {
                return {
                    success: false,
                    error: 'Invalid plan'
                };
            }
            const updated = await prisma.tenantPaymentStatus.update({
                where: { tenant_id: tenantId },
                data: {
                    current_plan: newPlan,
                    plan_changed_at: new Date()
                }
            });
            return {
                success: true,
                message: 'Subscription upgraded',
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
     * Check if subscription is overdue
     */
    async checkOverdueSubscriptions() {
        try {
            const now = new Date();
            const overdue = await prisma.tenantPaymentStatus.findMany({
                where: {
                    next_payment_date: { lt: now },
                    subscription_status: 'active'
                }
            });
            // Update overdue status
            for (const payment of overdue) {
                const daysOverdue = Math.floor((now.getTime() - payment.next_payment_date.getTime()) / (1000 * 60 * 60 * 24));
                await prisma.tenantPaymentStatus.update({
                    where: { tenant_id: payment.tenant_id },
                    data: {
                        is_overdue: true,
                        days_overdue: daysOverdue
                    }
                });
            }
            return {
                success: true,
                message: 'Overdue check completed',
                data: {
                    overdueCount: overdue.length
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
     * Refund payment
     */
    async refundPayment(paymentId, reason) {
        try {
            // Find payment log
            const payment = await prisma.paymentLog.findUnique({
                where: { id: paymentId }
            });
            if (!payment) {
                return {
                    success: false,
                    error: 'Payment not found'
                };
            }
            // Refund from Stripe
            if (payment.stripe_payment_id) {
                const refund = await stripe.refunds.create({
                    payment_intent: payment.stripe_payment_id,
                    reason: reason
                });
                // Update payment log
                await prisma.paymentLog.update({
                    where: { id: paymentId },
                    data: {
                        status: 'refunded',
                        refund_id: refund.id,
                        refund_reason: reason
                    }
                });
                return {
                    success: true,
                    message: 'Refund processed',
                    data: refund
                };
            }
            return {
                success: false,
                error: 'Cannot refund non-Stripe payment'
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
     * Get invoice
     */
    async getInvoice(paymentId) {
        try {
            const payment = await prisma.paymentLog.findUnique({
                where: { id: paymentId },
                include: {
                    tenant: {
                        select: {
                            business_name: true,
                            email: true
                        }
                    }
                }
            });
            if (!payment) {
                return {
                    success: false,
                    error: 'Payment not found'
                };
            }
            return {
                success: true,
                data: {
                    invoice_id: payment.id,
                    business_name: payment.tenant.business_name,
                    email: payment.tenant.email,
                    amount: payment.amount,
                    date: payment.created_at,
                    status: payment.status,
                    description: payment.description
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
     * Calculate plan pricing with currency
     */
    async calculatePricing(plan, currency = 'USD') {
        try {
            const basePrices = {
                'FREE': 0,
                'LITE': 30,
                'RISE': 75,
                'ELITE': 100
            };
            const basePrice = basePrices[plan] || 0;
            // Simple currency conversion (in production, use real rates)
            const conversionRates = {
                'USD': 1,
                'EUR': 0.92,
                'GBP': 0.79,
                'KES': 129.5,
                'TZS': 2650,
                'UGX': 3900
            };
            const rate = conversionRates[currency] || 1;
            const convertedPrice = basePrice * rate;
            return {
                success: true,
                data: {
                    plan,
                    currency,
                    base_price_usd: basePrice,
                    converted_price: Math.round(convertedPrice * 100) / 100,
                    conversion_rate: rate
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
}
export default new PaymentService();
//# sourceMappingURL=payment.js.map