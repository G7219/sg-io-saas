export declare class ApiError extends Error {
    code: string;
    statusCode: number;
    details?: any | undefined;
    constructor(code: string, message: string, statusCode?: number, details?: any | undefined);
}
export declare const PREDEFINED_ERRORS: {
    INVALID_CREDENTIALS: {
        code: string;
        message: string;
        statusCode: number;
    };
    UNAUTHORIZED: {
        code: string;
        message: string;
        statusCode: number;
    };
    TOKEN_EXPIRED: {
        code: string;
        message: string;
        statusCode: number;
    };
    FORBIDDEN: {
        code: string;
        message: string;
        statusCode: number;
    };
    NOT_FOUND: {
        code: string;
        message: string;
        statusCode: number;
    };
    DUPLICATE_ENTRY: {
        code: string;
        message: string;
        statusCode: number;
    };
    VALIDATION_ERROR: {
        code: string;
        message: string;
        statusCode: number;
    };
    PLAN_LIMIT_EXCEEDED: {
        code: string;
        message: string;
        statusCode: number;
    };
    SUBSCRIPTION_EXPIRED: {
        code: string;
        message: string;
        statusCode: number;
    };
    SUBSCRIPTION_SUSPENDED: {
        code: string;
        message: string;
        statusCode: number;
    };
    ACCOUNT_LOCKED: {
        code: string;
        message: string;
        statusCode: number;
    };
    SECURITY_VIOLATION: {
        code: string;
        message: string;
        statusCode: number;
    };
    INTERNAL_ERROR: {
        code: string;
        message: string;
        statusCode: number;
    };
    DATABASE_ERROR: {
        code: string;
        message: string;
        statusCode: number;
    };
};
export declare class ValidationError extends ApiError {
    constructor(message: string, details?: any);
}
export declare class UnauthorizedError extends ApiError {
    constructor(message?: string);
}
export declare class NotFoundError extends ApiError {
    constructor(message?: string);
}
export declare class DuplicateError extends ApiError {
    constructor(message?: string);
}
export declare class SubscriptionError extends ApiError {
    constructor(code?: string, message?: string);
}
export declare const createApiError: (error: string, message?: string, statusCode?: number) => ApiError;
//# sourceMappingURL=Errors.d.ts.map