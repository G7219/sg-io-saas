/**
 * Error Types & Definitions
 * Comprehensive error handling for SG.IO
 */
export declare class AppError extends Error {
    message: string;
    code: string;
    statusCode: number;
    constructor(message: string, code: string, statusCode?: number);
}
export declare const Errors: {
    UNAUTHORIZED: {
        code: string;
        message: string;
        statusCode: number;
    };
    INVALID_CREDENTIALS: {
        code: string;
        message: string;
        statusCode: number;
    };
    TOKEN_EXPIRED: {
        code: string;
        message: string;
        statusCode: number;
    };
    INVALID_TOKEN: {
        code: string;
        message: string;
        statusCode: number;
    };
    VALIDATION_ERROR: {
        code: string;
        message: string;
        statusCode: number;
    };
    INVALID_INPUT: {
        code: string;
        message: string;
        statusCode: number;
    };
    MISSING_REQUIRED_FIELD: {
        code: string;
        message: string;
        statusCode: number;
    };
    NOT_FOUND: {
        code: string;
        message: string;
        statusCode: number;
    };
    RESOURCE_NOT_FOUND: {
        code: string;
        message: string;
        statusCode: number;
    };
    USER_NOT_FOUND: {
        code: string;
        message: string;
        statusCode: number;
    };
    TENANT_NOT_FOUND: {
        code: string;
        message: string;
        statusCode: number;
    };
    CONFLICT: {
        code: string;
        message: string;
        statusCode: number;
    };
    EMAIL_EXISTS: {
        code: string;
        message: string;
        statusCode: number;
    };
    PAYMENT_FAILED: {
        code: string;
        message: string;
        statusCode: number;
    };
    INVALID_PLAN: {
        code: string;
        message: string;
        statusCode: number;
    };
    PLAN_LIMIT_EXCEEDED: {
        code: string;
        message: string;
        statusCode: number;
    };
    SUBSCRIPTION_REQUIRED: {
        code: string;
        message: string;
        statusCode: number;
    };
    INSUFFICIENT_QUOTA: {
        code: string;
        message: string;
        statusCode: number;
    };
    FORBIDDEN: {
        code: string;
        message: string;
        statusCode: number;
    };
    PERMISSION_DENIED: {
        code: string;
        message: string;
        statusCode: number;
    };
    ADMIN_ONLY: {
        code: string;
        message: string;
        statusCode: number;
    };
    INVALID_STATE: {
        code: string;
        message: string;
        statusCode: number;
    };
    OPERATION_NOT_ALLOWED: {
        code: string;
        message: string;
        statusCode: number;
    };
    DUPLICATE_ENTRY: {
        code: string;
        message: string;
        statusCode: number;
    };
    DATABASE_ERROR: {
        code: string;
        message: string;
        statusCode: number;
    };
    QUERY_ERROR: {
        code: string;
        message: string;
        statusCode: number;
    };
    INTERNAL_ERROR: {
        code: string;
        message: string;
        statusCode: number;
    };
    SERVICE_UNAVAILABLE: {
        code: string;
        message: string;
        statusCode: number;
    };
    EXTERNAL_SERVICE_ERROR: {
        code: string;
        message: string;
        statusCode: number;
    };
    AI_PROVIDER_ERROR: {
        code: string;
        message: string;
        statusCode: number;
    };
    AI_RATE_LIMIT: {
        code: string;
        message: string;
        statusCode: number;
    };
    AI_QUOTA_EXCEEDED: {
        code: string;
        message: string;
        statusCode: number;
    };
};
export type ErrorCode = keyof typeof Errors;
export declare const throwError: (errorCode: ErrorCode, details?: string) => never;
export declare const getErrorResponse: (errorCode: ErrorCode, details?: string) => {
    success: boolean;
    error: {
        code: string;
        message: string;
        statusCode: number;
    };
};
//# sourceMappingURL=types.errors.d.ts.map