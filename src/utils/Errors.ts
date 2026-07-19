export class ApiError extends Error {
    constructor(
        public code: string,
        message: string,
        public statusCode: number = 400,
        public details?: any
    ) {
        super(message);
        this.name = 'ApiError';
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

export const PREDEFINED_ERRORS = {
    INVALID_CREDENTIALS: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
        statusCode: 401
    },
    UNAUTHORIZED: {
        code: 'UNAUTHORIZED',
        message: 'Unauthorized access',
        statusCode: 401
    },
    TOKEN_EXPIRED: {
        code: 'TOKEN_EXPIRED',
        message: 'Token has expired',
        statusCode: 401
    },
    FORBIDDEN: {
        code: 'FORBIDDEN',
        message: 'Access forbidden',
        statusCode: 403
    },
    NOT_FOUND: {
        code: 'NOT_FOUND',
        message: 'Resource not found',
        statusCode: 404
    },
    DUPLICATE_ENTRY: {
        code: 'DUPLICATE_ENTRY',
        message: 'This entry already exists',
        statusCode: 409
    },
    VALIDATION_ERROR: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        statusCode: 400
    },
    PLAN_LIMIT_EXCEEDED: {
        code: 'PLAN_LIMIT_EXCEEDED',
        message: 'Plan limit exceeded',
        statusCode: 403
    },
    SUBSCRIPTION_EXPIRED: {
        code: 'SUBSCRIPTION_EXPIRED',
        message: 'Subscription has expired',
        statusCode: 402
    },
    SUBSCRIPTION_SUSPENDED: {
        code: 'SUBSCRIPTION_SUSPENDED',
        message: 'Subscription is suspended',
        statusCode: 402
    },
    ACCOUNT_LOCKED: {
        code: 'ACCOUNT_LOCKED',
        message: 'Account is locked',
        statusCode: 423
    },
    SECURITY_VIOLATION: {
        code: 'SECURITY_VIOLATION',
        message: 'Security policy violation',
        statusCode: 403
    },
    INTERNAL_ERROR: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        statusCode: 500
    },
    DATABASE_ERROR: {
        code: 'DATABASE_ERROR',
        message: 'Database error occurred',
        statusCode: 500
    }
};

export class ValidationError extends ApiError {
    constructor(message: string, details?: any) {
        super('VALIDATION_ERROR', message, 400, details);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message: string = 'Unauthorized access') {
        super('UNAUTHORIZED', message, 401);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string = 'Resource not found') {
        super('NOT_FOUND', message, 404);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export class DuplicateError extends ApiError {
    constructor(message: string = 'This entry already exists') {
        super('DUPLICATE_ENTRY', message, 409);
        Object.setPrototypeOf(this, DuplicateError.prototype);
    }
}

export class SubscriptionError extends ApiError {
    constructor(code: string = 'SUBSCRIPTION_EXPIRED', message: string = 'Subscription expired') {
        super(code, message, 402);
        Object.setPrototypeOf(this, SubscriptionError.prototype);
    }
}

export const createApiError = (error: string, message?: string, statusCode?: number) => {
    const predefined = PREDEFINED_ERRORS[error as keyof typeof PREDEFINED_ERRORS];
    if (predefined) {
        return new ApiError(
            predefined.code,
            message || predefined.message,
            statusCode || predefined.statusCode
        );
    }
    return new ApiError(error, message || error, statusCode || 400);
};
