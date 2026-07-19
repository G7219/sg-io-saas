import { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
    constructor(
        public code: string,
        message: string,
        public statusCode: number = 400
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
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
                requestId: (req as any).id
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
            requestId: (req as any).id
        }
    });
};
