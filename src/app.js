/**
 * SG.IO Main Express Application - FIXED VERSION
 * Global e-commerce SaaS platform
 *
 * CHANGES MADE:
 * - Added all static page routes for /pricing, /solutions, /privacy, /contact, etc
 * - Placed before 404 handler to prevent "Route not found" errors
 */
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import path from 'path';
// Load environment variables
config();
// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { securityHeaders } from './middleware/security.js';
//import { requestLogger } from './middleware/logging';
import { authMiddleware } from './middleware/auth.js';
// Import routes
import authRoutes from './routes/v1/auth.routes.js';
// import productsRoutes from './routes/v1/products.routes';
// import ordersRoutes from './routes/v1/orders.routes';
// import customersRoutes from './routes/v1/customers.routes';
// import paymentsRoutes from './routes/v1/payments.routes';
// import shippingRoutes from './routes/v1/shipping.routes';
// import locationsRoutes from './routes/v1/locations.routes';
// import inventoryRoutes from './routes/v1/inventory.routes';
// import analyticsRoutes from './routes/v1/analytics.routes';
// import reviewsRoutes from './routes/v1/reviews.routes';
// import ratingsRoutes from './routes/v1/ratings.routes';
// import aiRoutes from './routes/v1/ai.routes';
// import b2bRoutes from './routes/v1/b2b.routes';
import setupRoutes from './routes/v1/setup.routes.js';
import dashboardRoutes from './routes/v1/dashboard.routes.js';
import adminRoutes from './routes/v1/admin.js';
import { success } from 'zod/v4';
import router from './routes/locations.js';
const app = express();
// =========================
// SECURITY MIDDLEWARE
// =========================
app.use(helmet({ contentSecurityPolicy: false })); // Security headers
app.use(express.static(path.join(process.cwd(), 'public'))); // Custom security headers
// =========================
// CORS CONFIGURATION
// =========================
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}));
// =========================
// BODY PARSING
// =========================
// Server static frontend HTML/CSS files from the public directory
app.use(express.static(path.join(process.cwd(), '../public'), { extensions: ['html'] }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// =========================
// LOGGING
// =========================
//app.use(requestLogger);
// =========================
// STATIC FILES
// =========================
app.use(express.static('public', { extensions: ['html'] }));
// =========================
// HEALTH CHECK
// =========================
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
// =========================
// API ROUTES
// =========================
// Public routes (no auth required)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/setup', setupRoutes);
// Protected routes (auth required)
app.use('/api/v1/dashboard', authMiddleware, dashboardRoutes);
// app.use('/api/v1/products', authMiddleware, productsRoutes);
// app.use('/api/v1/orders', authMiddleware, ordersRoutes);
// app.use('/api/v1/customers', authMiddleware, customersRoutes);
// app.use('/api/v1/payments', authMiddleware, paymentsRoutes);
// app.use('/api/v1/shipping', authMiddleware, shippingRoutes);
// app.use('/api/v1/locations', authMiddleware, locationsRoutes);
// app.use('/api/v1/inventory', authMiddleware, inventoryRoutes);
// app.use('/api/v1/analytics', authMiddleware, analyticsRoutes);
// app.use('/api/v1/reviews', authMiddleware, reviewsRoutes);
// app.use('/api/v1/ratings', authMiddleware, ratingsRoutes);
// app.use('/api/v1/ai', authMiddleware, aiRoutes);
// app.use('/api/v1/b2b', authMiddleware, b2bRoutes);
// Admin routes (admin auth required)
app.use('/api/v1/admin', adminRoutes);
// ==================================================================================
// STATIC PAGE ROUTES - ALL FIXED! ✅
// These routes must come AFTER API routes but BEFORE the 404 catch-all handler
// ==================================================================================
// ────────────────────────────────────────────────────────────────────────────────
// MAIN PRODUCT PAGES
// ────────────────────────────────────────────────────────────────────────────────
// Pricing page
app.get('/pricing', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'pricing.html'));
});
// ────────────────────────────────────────────────────────────────────────────────
// SOLUTIONS PAGES (7 INDUSTRIES)
// ────────────────────────────────────────────────────────────────────────────────
// Solutions main page
app.get('/solutions', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'solutions.html'));
});
// Real Estate
app.get('/solutions/real-estate', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'solutions-real-estate.html'));
});
// Church & Ministries
app.get('/solutions/church', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'solutions-church.html'));
});
// Pharmacy & Dispensary
app.get('/solutions/pharmacy', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'solutions-pharmacy.html'));
});
// B2B Services
app.get('/solutions/b2b', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'solutions-b2b.html'));
});
// Boutique & Retail
app.get('/solutions/boutique', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'solutions-boutique.html'));
});
// Salon & Spa
app.get('/solutions/salon', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'solutions-salon.html'));
});
// Restaurant & Food Service
app.get('/solutions/restaurant', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'solutions-restaurant.html'));
});
// ────────────────────────────────────────────────────────────────────────────────
// LEGAL & COMPLIANCE PAGES
// ────────────────────────────────────────────────────────────────────────────────
app.get('/privacy', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'privacy.html'));
});
app.get('/terms', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'terms.html'));
});
app.get('/compliance', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'compliance.html'));
});
app.get('/security', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'security.html'));
});
// ────────────────────────────────────────────────────────────────────────────────
// COMPANY/INFO PAGES
// ────────────────────────────────────────────────────────────────────────────────
app.get('/contact', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'contact.html'));
});
app.get('/about', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'about.html'));
});
app.get('/press', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'press.html'));
});
app.get('/careers', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'careers.html'));
});
// ────────────────────────────────────────────────────────────────────────────────
// HELP & DOCUMENTATION PAGES
// ────────────────────────────────────────────────────────────────────────────────
app.get('/documentation', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'documentation.html'));
});
app.get('/help', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'help.html'));
});
app.get('/blog', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'blog.html'));
});
// ────────────────────────────────────────────────────────────────────────────────
// DEVELOPER & INTEGRATION PAGES
// ────────────────────────────────────────────────────────────────────────────────
app.get('/integrations', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'integrations.html'));
});
app.get('/api', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'api.html'));
});
// ==================================================================================
// 404 HANDLER (MUST BE AFTER ALL OTHER ROUTES!)
// ==================================================================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.path,
        method: req.method
    });
});
// =========================
// ERROR HANDLER (Last middleware)
// =========================
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map