export declare const CONSTANTS: {
    TRIAL_DAYS: number;
    TRIAL_PRODUCTS_LIMIT: number;
    PLAN_TIERS: {
        LITE: {
            level: number;
            name: string;
            price: number;
            maxProducts: number;
        };
        RISE: {
            level: number;
            name: string;
            price: number;
            maxProducts: number;
        };
        ELITE: {
            level: number;
            name: string;
            price: number;
            maxProducts: number;
        };
    };
    SUBSCRIPTION_STATUS: {
        TRIAL: string;
        ACTIVE: string;
        SUSPENDED: string;
        EXPIRED: string;
        CANCELLED: string;
    };
    MAX_LOGIN_ATTEMPTS: number;
    LOCK_TIMEOUT_MS: number;
    PASSWORD_HASH_ROUNDS: number;
    ACCESS_TOKEN_EXPIRY: string;
    REFRESH_TOKEN_EXPIRY: string;
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX_REQUESTS: number;
    DEFAULT_PAGE_SIZE: number;
    MAX_PAGE_SIZE: number;
    TENANT_CACHE_TTL_MS: number;
    API_VERSION: string;
    API_TIMEOUT_MS: number;
    MESSAGES: {
        INVALID_CREDENTIALS: string;
        ACCOUNT_LOCKED: string;
        TRIAL_EXPIRED: string;
        SUBSCRIPTION_EXPIRED: string;
        UNAUTHORIZED: string;
        NOT_FOUND: string;
        VALIDATION_ERROR: string;
        INTERNAL_ERROR: string;
        PLAN_LIMIT_EXCEEDED: string;
        DUPLICATE_ENTRY: string;
        SECURITY_VIOLATION: string;
    };
    NICHES: string[];
    PAYMENT_GATEWAYS: {
        STRIPE: string;
        FLUTTERWAVE: string;
        MPESA: string;
        GOOGLE_PAY: string;
        APPLE_PAY: string;
    };
    ORDER_STATUS: {
        PENDING: string;
        COMPLETED: string;
        FAILED: string;
        REFUNDED: string;
    };
};
export declare const TRIAL_DAYS: number, PLAN_TIERS: {
    LITE: {
        level: number;
        name: string;
        price: number;
        maxProducts: number;
    };
    RISE: {
        level: number;
        name: string;
        price: number;
        maxProducts: number;
    };
    ELITE: {
        level: number;
        name: string;
        price: number;
        maxProducts: number;
    };
}, SUBSCRIPTION_STATUS: {
    TRIAL: string;
    ACTIVE: string;
    SUSPENDED: string;
    EXPIRED: string;
    CANCELLED: string;
}, MAX_LOGIN_ATTEMPTS: number, LOCK_TIMEOUT_MS: number, ACCESS_TOKEN_EXPIRY: string, REFRESH_TOKEN_EXPIRY: string, MESSAGES: {
    INVALID_CREDENTIALS: string;
    ACCOUNT_LOCKED: string;
    TRIAL_EXPIRED: string;
    SUBSCRIPTION_EXPIRED: string;
    UNAUTHORIZED: string;
    NOT_FOUND: string;
    VALIDATION_ERROR: string;
    INTERNAL_ERROR: string;
    PLAN_LIMIT_EXCEEDED: string;
    DUPLICATE_ENTRY: string;
    SECURITY_VIOLATION: string;
};
//# sourceMappingURL=constants.d.ts.map