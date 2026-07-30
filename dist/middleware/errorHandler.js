export class ApiError extends Error {
    constructor(code, message, statusCode = 400) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = 'ApiError';
    }
}
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
export const errorHandler = (err, req, res, next) => {
    console.error('[ERROR]', err);
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message
            },
            meta: {
                timestamp: new Date().toISOString(),
                requestId: req.id
            }
        });
    }
    res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: err.message || 'Internal server error'
        },
        meta: {
            timestamp: new Date().toISOString(),
            requestId: req.id
        }
    });
};
