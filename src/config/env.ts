const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

const validateEnv = () => {
    const missing = requiredEnvVars.filter(v => !process.env[v]);
    if (missing.length > 0 && process.env.NODE_ENV === 'production') {
        throw new Error(`Missing env vars: ${missing.join(', ')}`);
    }
};

validateEnv();

export default {
    // Database
    DATABASE_URL: process.env.DATABASE_URL || 'mysql://user:password@localhost:3306/sg_io',

    // JWT
    JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production',

    // Server
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT) || 3000,
    PRIMARY_DOMAIN: process.env.PRIMARY_DOMAIN || 'localhost',

    // APIs
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    FLUTTERWAVE_SECRET_KEY: process.env.FLUTTERWAVE_SECRET_KEY || '',

    // CORS
    ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),

    // Pricing
    MONTHLY_FEE_USD: {
        lite: 30,
        rise: 75,
        elite: 100
    },

    LAUNCH_FEE_USD: {
        lite: 0,
        rise: 0,
        elite: 0
    },

    // Trial
    TRIAL_DAYS: 5
};
