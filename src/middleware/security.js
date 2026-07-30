import { Request, Response, NextFunction } from 'express';
const SQL_INJECTION_PATTERN = /(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)|(-{2}|\/\*|\*\/|;)/gi;
const XSS_PATTERN = /<[^>]*>/g;
export const sqlInjectionDetection = (req, res, next) => {
    try {
        const checkValue = (value) => {
            if (typeof value === 'string') {
                return SQL_INJECTION_PATTERN.test(value);
            }
            if (typeof value === 'object' && value !== null) {
                return Object.values(value).some(v => checkValue(v));
            }
            return false;
        };
        const { body, query, params } = req;
        if (checkValue(body) || checkValue(query) || checkValue(params)) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'SECURITY_VIOLATION',
                    message: 'Potential SQL injection detected'
                }
            });
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
export const xssProtection = (req, res, next) => {
    try {
        const sanitizeValue = (value) => {
            if (typeof value === 'string') {
                return value.replace(XSS_PATTERN, '');
            }
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                return Object.keys(value).reduce((acc, key) => {
                    acc[key] = sanitizeValue(value[key]);
                    return acc;
                }, {});
            }
            if (Array.isArray(value)) {
                return value.map(v => sanitizeValue(v));
            }
            return value;
        };
        req.body = sanitizeValue(req.body);
        req.query = sanitizeValue(req.query);
        next();
    }
    catch (error) {
        next(error);
    }
};
export const securityHeaders = (req, res, next) => {
    // HSTS
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    // X-Frame-Options
    res.setHeader('X-Frame-Options', 'DENY');
    // X-Content-Type-Options
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // X-XSS-Protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    // Content-Security-Policy
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    // Referrer-Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
};
export const rateLimiter = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
    const requests = new Map();
    return (req, res, next) => {
        const ip = req.ip || '';
        const now = Date.now();
        const record = requests.get(ip);
        if (record && now < record.resetTime) {
            if (record.count >= maxRequests) {
                return res.status(429).json({
                    success: false,
                    error: {
                        code: 'RATE_LIMIT_EXCEEDED',
                        message: 'Too many requests'
                    }
                });
            }
            record.count++;
        }
        else {
            requests.set(ip, { count: 1, resetTime: now + windowMs });
        }
        res.setHeader('X-RateLimit-Limit', maxRequests.toString());
        res.setHeader('X-RateLimit-Remaining', (maxRequests - (record?.count || 1)).toString());
        next();
    };
};
//# sourceMappingURL=security.js.map