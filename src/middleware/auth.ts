import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../utils/jwt.js';



export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'No token provided' }
            });
        }

        const token = authHeader.substring(7);
        const payload = JwtService.verifyAccessToken(token);

        if (!payload) {
            return res.status(401).json({
                success: false,
                error: { code: 'TOKEN_EXPIRED', message: 'Token expired' }
            });
        }

        req.user = payload as any;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Invalid token' }
        });
    }
};

export const checkSubscriptionStatus = (minimumPlan: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.tenant) {
                return res.status(403).json({
                    success: false,
                    error: { code: 'FORBIDDEN', message: 'No tenant context' }
                });
            }

            const planTiers: any = { lite: 1, rise: 2, elite: 3 };
            const requiredTier = planTiers[minimumPlan] || 0;
            const userTier = planTiers[req.tenant.tier] || 0;

            if (userTier < requiredTier) {
                return res.status(403).json({
                    success: false,
                    error: { code: 'PLAN_LIMIT_EXCEEDED', message: 'Upgrade required' }
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

export const verifyTenantOwnership = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user || !req.tenant) {
            return res.status(403).json({
                success: false,
                error: { code: 'FORBIDDEN', message: 'Not authorized' }
            });
        }

        if (req.tenant.owner_email !== req.user.email) {
            return res.status(403).json({
                success: false,
                error: { code: 'FORBIDDEN', message: 'Not tenant owner' }
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};
