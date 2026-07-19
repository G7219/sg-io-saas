/**
 * Error Types & Definitions
 * Comprehensive error handling for SG.IO
 */

export class AppError extends Error {
    constructor(
        public message: string,
        public code: string,
        public statusCode: number = 500
    ) {
        super(message);
        this.name = 'AppError';
    }
}

// Authentication Errors
export const Errors = {
    // Auth Errors (4000-4099)
    UNAUTHORIZED: {
        code: 'UNAUTHORIZED',
        message: 'Unauthorized access',
        statusCode: 401
    },
    INVALID_CREDENTIALS: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
        statusCode: 401
    },
    TOKEN_EXPIRED: {
        code: 'TOKEN_EXPIRED',
        message: 'Token has expired',
        statusCode: 401
    },
    INVALID_TOKEN: {
        code: 'INVALID_TOKEN',
        message: 'Invalid token',
        statusCode: 401
    },

    // Validation Errors (4100-4199)
    VALIDATION_ERROR: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        statusCode: 400
    },
    INVALID_INPUT: {
        code: 'INVALID_INPUT',
        message: 'Invalid input provided',
        statusCode: 400
    },
    MISSING_REQUIRED_FIELD: {
        code: 'MISSING_REQUIRED_FIELD',
        message: 'Required field is missing',
        statusCode: 400
    },

    // Resource Errors (4400-4499)
    NOT_FOUND: {
        code: 'NOT_FOUND',
        message: 'Resource not found',
        statusCode: 404
    },
    RESOURCE_NOT_FOUND: {
        code: 'RESOURCE_NOT_FOUND',
        message: 'The requested resource could not be found',
        statusCode: 404
    },
    USER_NOT_FOUND: {
        code: 'USER_NOT_FOUND',
        message: 'User not found',
        statusCode: 404
    },
    TENANT_NOT_FOUND: {
        code: 'TENANT_NOT_FOUND',
        message: 'Tenant not found',
        statusCode: 404
    },

    // Conflict Errors (4090-4099)
    CONFLICT: {
        code: 'CONFLICT',
        message: 'Resource already exists',
        statusCode: 409
    },
    EMAIL_EXISTS: {
        code: 'EMAIL_EXISTS',
        message: 'Email already exists',
        statusCode: 409
    },

    // Payment/Subscription Errors (4200-4299)
    PAYMENT_FAILED: {
        code: 'PAYMENT_FAILED',
        message: 'Payment processing failed',
        statusCode: 400
    },
    INVALID_PLAN: {
        code: 'INVALID_PLAN',
        message: 'Invalid subscription plan',
        statusCode: 400
    },
    PLAN_LIMIT_EXCEEDED: {
        code: 'PLAN_LIMIT_EXCEEDED',
        message: 'Plan limit has been exceeded',
        statusCode: 403
    },
    SUBSCRIPTION_REQUIRED: {
        code: 'SUBSCRIPTION_REQUIRED',
        message: 'Active subscription required for this feature',
        statusCode: 403
    },
    INSUFFICIENT_QUOTA: {
        code: 'INSUFFICIENT_QUOTA',
        message: 'Insufficient quota for this operation',
        statusCode: 403
    },

    // Permission Errors (4030-4039)
    FORBIDDEN: {
        code: 'FORBIDDEN',
        message: 'Access forbidden',
        statusCode: 403
    },
    PERMISSION_DENIED: {
        code: 'PERMISSION_DENIED',
        message: 'You do not have permission to perform this action',
        statusCode: 403
    },
    ADMIN_ONLY: {
        code: 'ADMIN_ONLY',
        message: 'This action requires admin privileges',
        statusCode: 403
    },

    // Business Logic Errors (4300-4399)
    INVALID_STATE: {
        code: 'INVALID_STATE',
        message: 'Invalid state for this operation',
        statusCode: 400
    },
    OPERATION_NOT_ALLOWED: {
        code: 'OPERATION_NOT_ALLOWED',
        message: 'This operation is not allowed',
        statusCode: 400
    },
    DUPLICATE_ENTRY: {
        code: 'DUPLICATE_ENTRY',
        message: 'Duplicate entry detected',
        statusCode: 400
    },

    // Database Errors (5000-5099)
    DATABASE_ERROR: {
        code: 'DATABASE_ERROR',
        message: 'Database error occurred',
        statusCode: 500
    },
    QUERY_ERROR: {
        code: 'QUERY_ERROR',
        message: 'Database query failed',
        statusCode: 500
    },

    // Server Errors (5100-5199)
    INTERNAL_ERROR: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        statusCode: 500
    },
    SERVICE_UNAVAILABLE: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Service temporarily unavailable',
        statusCode: 503
    },
    EXTERNAL_SERVICE_ERROR: {
        code: 'EXTERNAL_SERVICE_ERROR',
        message: 'External service error',
        statusCode: 502
    },

    // AI Errors (4500-4599)
    AI_PROVIDER_ERROR: {
        code: 'AI_PROVIDER_ERROR',
        message: 'AI provider error',
        statusCode: 500
    },
    AI_RATE_LIMIT: {
        code: 'AI_RATE_LIMIT',
        message: 'AI provider rate limit exceeded',
        statusCode: 429
    },
    AI_QUOTA_EXCEEDED: {
        code: 'AI_QUOTA_EXCEEDED',
        message: 'AI usage quota exceeded',
        statusCode: 403
    }
};

export type ErrorCode = keyof typeof Errors;

export const throwError = (errorCode: ErrorCode, details?: string): never => {
    const error = Errors[errorCode];
    const message = details ? `${error.message}: ${details}` : error.message;
    throw new AppError(message, error.code, error.statusCode);
};

export const getErrorResponse = (errorCode: ErrorCode, details?: string) => {
    const error = Errors[errorCode];
    return {
        success: false,
        error: {
            code: error.code,
            message: details ? `${error.message}: ${details}` : error.message,
            statusCode: error.statusCode
        }
    };
};
