export const CONSTANTS = {
    // Trial & Subscription
    TRIAL_DAYS: 5,
    TRIAL_PRODUCTS_LIMIT: 10,
    // Pricing Tiers
    PLAN_TIERS: {
        LITE: { level: 1, name: 'lite', price: 30, maxProducts: 100 },
        RISE: { level: 2, name: 'rise', price: 75, maxProducts: -1 },
        ELITE: { level: 3, name: 'elite', price: 100, maxProducts: -1 }
    },
    // Subscription Status
    SUBSCRIPTION_STATUS: {
        TRIAL: 'trial',
        ACTIVE: 'active',
        SUSPENDED: 'suspended',
        EXPIRED: 'expired',
        CANCELLED: 'cancelled'
    },
    // Security
    MAX_LOGIN_ATTEMPTS: 5,
    LOCK_TIMEOUT_MS: 15 * 60 * 1000, // 15 minutes
    PASSWORD_HASH_ROUNDS: 12,
    // Tokens
    ACCESS_TOKEN_EXPIRY: '1h',
    REFRESH_TOKEN_EXPIRY: '7d',
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000,
    RATE_LIMIT_MAX_REQUESTS: 100,
    // Pagination
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    // Cache
    TENANT_CACHE_TTL_MS: 5 * 60 * 1000, // 5 minutes
    // API
    API_VERSION: 'v1',
    API_TIMEOUT_MS: 30000,
    // Error Messages
    MESSAGES: {
        INVALID_CREDENTIALS: 'Invalid email or password',
        ACCOUNT_LOCKED: 'Account locked. Try again later.',
        TRIAL_EXPIRED: 'Trial period has expired',
        SUBSCRIPTION_EXPIRED: 'Subscription expired',
        UNAUTHORIZED: 'Unauthorized access',
        NOT_FOUND: 'Resource not found',
        VALIDATION_ERROR: 'Validation error',
        INTERNAL_ERROR: 'Internal server error',
        PLAN_LIMIT_EXCEEDED: 'Plan limit exceeded. Please upgrade.',
        DUPLICATE_ENTRY: 'This entry already exists',
        SECURITY_VIOLATION: 'Security policy violation'
    },
    // Niche Names
    NICHES: [
        'pharmacy',
        'restaurant',
        'real_estate',
        'church',
        'electronics',
        'salon',
        'boutique',
        'hardware'
    ],
    // Payment Gateways
    PAYMENT_GATEWAYS: {
        STRIPE: 'stripe',
        FLUTTERWAVE: 'flutterwave',
        MPESA: 'mpesa',
        GOOGLE_PAY: 'google_pay',
        APPLE_PAY: 'apple_pay'
    },
    // Order Status
    ORDER_STATUS: {
        PENDING: 'pending',
        COMPLETED: 'completed',
        FAILED: 'failed',
        REFUNDED: 'refunded'
    }
};
// Export individual constants for convenience
export const { TRIAL_DAYS, PLAN_TIERS, SUBSCRIPTION_STATUS, MAX_LOGIN_ATTEMPTS, LOCK_TIMEOUT_MS, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY, MESSAGES } = CONSTANTS;
//# sourceMappingURL=constants.js.map