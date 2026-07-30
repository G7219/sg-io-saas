import { Router, Request, Response, raw } from 'express';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import config from '../../config/env';
const router = Router();
const prisma = new PrismaClient();
const stripe = new Stripe(config.STRIPE_SECRET_KEY);
/**
 * POST /v1/webhooks/stripe
 * Handle Stripe payment events
 */
router.post('/stripe', raw({ type: 'application/json' }), async (req, res) => {
    try {
        const sig = req.headers['stripe-signature'];
        const body = req.body;
        let event;
        try {
            event = stripe.webhooks.constructEvent(body, sig, config.STRIPE_WEBHOOK_SECRET);
        }
        catch (error) {
            console.error('Stripe verification failed:', error.message);
            return res.status(400).json({ error: 'Invalid signature' });
        }
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                if (paymentIntent.metadata?.tenantId) {
                    const tenantId = Number(paymentIntent.metadata.tenantId);
                    const planType = paymentIntent.metadata.planType;
                    const renewalDate = new Date();
                    renewalDate.setMonth(renewalDate.getMonth() + 1);
                    await prisma.tenant.update({
                        where: { id: tenantId },
                        data: {
                            tier: planType,
                            status: 'active',
                            subscription_expires_at: renewalDate
                        }
                    });
                    await prisma.paymentLog.updateMany({
                        where: { payment_reference: paymentIntent.id },
                        data: { status: 'completed' }
                    });
                    console.log(`✅ Stripe payment succeeded: ${paymentIntent.id}`);
                }
                break;
            case 'payment_intent.payment_failed':
                const failedIntent = event.data.object;
                await prisma.paymentLog.updateMany({
                    where: { payment_reference: failedIntent.id },
                    data: { status: 'failed' }
                });
                console.log(`❌ Stripe payment failed: ${failedIntent.id}`);
                break;
        }
        res.json({ received: true });
    }
    catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: error.message });
    }
});
/**
 * POST /v1/webhooks/flutterwave
 * Handle Flutterwave payment events
 */
router.post('/flutterwave', async (req, res) => {
    try {
        const flutterwaveSecret = process.env.FLUTTERWAVE_SECRET_KEY;
        const sig = req.headers['verifi-hash'];
        if (!sig) {
            return res.status(401).json({ error: 'No signature' });
        }
        const hash = crypto
            .createHmac('sha256', flutterwaveSecret || '')
            .update(JSON.stringify(req.body))
            .digest('hex');
        if (hash !== sig) {
            return res.status(401).json({ error: 'Invalid signature' });
        }
        const { event, data } = req.body;
        if (event === 'charge.completed' && data.status === 'successful') {
            const paymentLog = await prisma.paymentLog.findFirst({
                where: { payment_reference: data.tx_ref }
            });
            if (paymentLog) {
                await prisma.paymentLog.update({
                    where: { id: paymentLog.id },
                    data: { status: 'completed' }
                });
                await prisma.tenant.update({
                    where: { id: paymentLog.tenant_id },
                    data: {
                        tier: paymentLog.plan_type,
                        status: 'active',
                        subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    }
                });
                console.log(`✅ Flutterwave payment completed: ${data.tx_ref}`);
            }
        }
        res.json({ status: 'success' });
    }
    catch (error) {
        console.error('Flutterwave webhook error:', error);
        res.status(500).json({ error: error.message });
    }
});
/**
 * POST /v1/webhooks/mpesa
 * Handle M-Pesa payment notifications
 */
router.post('/mpesa', async (req, res) => {
    try {
        const { Body } = req.body;
        if (Body?.stkCallback?.ResultCode === 0) {
            const callbackMetadata = Body.stkCallback.CallbackMetadata?.Item || [];
            const reference = callbackMetadata[1]?.Value;
            if (reference) {
                const paymentLog = await prisma.paymentLog.findFirst({
                    where: { payment_reference: String(reference) }
                });
                if (paymentLog) {
                    await prisma.paymentLog.update({
                        where: { id: paymentLog.id },
                        data: { status: 'completed' }
                    });
                    await prisma.tenant.update({
                        where: { id: paymentLog.tenant_id },
                        data: {
                            tier: paymentLog.plan_type,
                            status: 'active',
                            subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        }
                    });
                    console.log(`✅ M-Pesa payment completed: ${reference}`);
                }
            }
        }
        res.json({ ResultCode: 0 });
    }
    catch (error) {
        console.error('M-Pesa webhook error:', error);
        res.status(500).json({ error: error.message });
    }
});
export default router;
//# sourceMappingURL=webhooks.routes.js.map