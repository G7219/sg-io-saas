import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { JwtService } from '../../utils/jwt.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import * as Errors from '../../utils/Errors.js';
import { authMiddleware } from '../../middleware/auth.js';
const router = Router();
const prisma = new PrismaClient();
/**
 * POST /v1/auth/signup
 * Create new account
 */
router.post('/signup', asyncHandler(async (req, res) => {
    const { email, password, niche } = req.body;
    // Validate
    if (!email || !password) {
        throw new Error('email and password are required');
    }
    // Check if email exists
    const existing = await prisma.tenant.findUnique({
        where: { owner_email: email }
    });
    if (existing) {
        throw new Errors.DuplicateError('Email');
    }
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    // Generate subdomain from email
    const subdomain = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    // Create tenant
    const tenant = await prisma.tenant.create({
        data: {
            owner_email: email,
            business_name: email.split('@')[0],
            subdomain: `${subdomain}-${Date.now()}`.slice(0, 30),
            selected_niche: niche,
            tier: 'lite',
            status: 'trial',
            subscription_expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days trial
        }
    });
    // Create merchant account
    await prisma.merchantAccount.create({
        data: {
            tenant_id: tenant.id,
            dashboard_user: email,
            dashboard_pass_hash: passwordHash
        }
    });
    // Generate tokens
    const { accessToken, refreshToken } = JwtService.generateTokenPair({
        tenantId: tenant.id,
        email
    });
    res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
            tenant: {
                id: tenant.id,
                subdomain: tenant.subdomain,
                tier: tenant.tier
            },
            accessToken,
            refreshToken,
            expiresIn: 3600
        }
    });
}));
/**
 * POST /v1/auth/login
 * Login to account
 */
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new Errors.ValidationError('Email and password are required');
    }
    // Find tenant
    const tenant = await prisma.tenant.findUnique({
        where: { owner_email: email },
        include: { merchant_account: true }
    });
    if (!tenant || !tenant.merchant_account) {
        throw new Error('Invalid credentials');
    }
    // Check if locked
    if (tenant.merchant_account.login_attempts >= 5) {
        throw new Error('Accaunt locked');
    }
    // Verify password
    const isValid = await bcrypt.compare(password, tenant.merchant_account.dashboard_pass_hash);
    if (!isValid) {
        // Increment failed attempts
        await prisma.merchantAccount.update({
            where: { tenant_id: tenant.id },
            data: { login_attempts: { increment: 1 } }
        });
        throw new Error('Invalid credentials');
    }
    // Reset attempts
    await prisma.merchantAccount.update({
        where: { tenant_id: tenant.id },
        data: {
            login_attempts: 0,
            last_login: new Date()
        }
    });
    // Check subscription status
    if (tenant.status === 'suspended') {
        throw new Error('Subscription suspended');
    }
    if (tenant.status === 'trial' &&
        tenant.subscription_expires_at &&
        tenant.subscription_expires_at < new Date()) {
        throw new Error('Subscription expired');
    }
    // Generate tokens
    const { accessToken, refreshToken } = JwtService.generateTokenPair({
        tenantId: tenant.id,
        email
    });
    res.json({
        success: true,
        message: 'Login successful',
        data: {
            tenant: {
                id: tenant.id,
                subdomain: tenant.subdomain,
                tier: tenant.tier,
                businessName: tenant.business_name
            },
            accessToken,
            refreshToken,
            expiresIn: 3600
        }
    });
}));
/**
 * POST /v1/auth/refresh
 * Refresh access token
 */
router.post('/refresh', asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new Errors.ValidationError('refreshToken is required');
    }
    const payload = JwtService.verifyRefreshToken(refreshToken);
    if (!payload) {
        throw new Error('Token expired');
    }
    const { accessToken, refreshToken: newRefreshToken } = JwtService.generateTokenPair({
        tenantId: payload.tenantId,
        email: payload.email
    });
    res.json({
        success: true,
        message: 'Token refreshed',
        data: {
            accessToken,
            refreshToken: newRefreshToken,
            expiresIn: 3600
        }
    });
}));
/**
 * GET /v1/auth/verify-email
 * Check email availability
 */
router.get('/verify-email', asyncHandler(async (req, res) => {
    const { email } = req.query;
    if (!email) {
        throw new Error('Email is required');
    }
    const existing = await prisma.tenant.findUnique({
        where: { owner_email: String(email) }
    });
    res.json({
        success: true,
        data: {
            available: !existing,
            email
        }
    });
}));
/**
 * GET /v1/auth/verify-subdomain
 * Check subdomain availability
 */
router.get('/verify-subdomain', asyncHandler(async (req, res) => {
    const { subdomain } = req.query;
    if (!subdomain) {
        throw new Error('subdomain is required');
    }
    const existing = await prisma.tenant.findUnique({
        where: { subdomain: String(subdomain) }
    });
    res.json({
        success: true,
        data: {
            available: !existing,
            subdomain,
            suggestion: `${subdomain}-${Date.now()}`.slice(0, 30)
        }
    });
}));
/**
 * POST /v1/auth/logout
 */
router.post('/logout', authMiddleware, asyncHandler(async (req, res) => {
    // Client-side token deletion only
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
}));
export default router;
