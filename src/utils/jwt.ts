import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export interface JwtPayload {
    tenantId: string;
    email: string;
    iat?: number;
    exp?: number;
}

export class JwtService {
    /**
     * Generate access token (1 hour validity)
     */
    static generateAccessToken(payload: JwtPayload): string {
        return jwt.sign(payload, env.JWT_SECRET, {
            expiresIn: '1h',
            algorithm: 'HS256'
        });
    }

    /**
     * Generate refresh token (7 days validity)
     */
    static generateRefreshToken(payload: JwtPayload): string {
        return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
            expiresIn: '7d',
            algorithm: 'HS256'
        });
    }

    /**
     * Generate both access and refresh tokens
     */
    static generateTokenPair(payload: JwtPayload) {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
            expiresIn: 3600 // seconds
        };
    }

    /**
     * Verify access token and return payload
     */
    static verifyAccessToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token, env.JWT_SECRET, {
                algorithms: ['HS256']
            }) as JwtPayload;
        } catch (error) {
            return null;
        }
    }

    /**
     * Verify refresh token and return payload
     */
    static verifyRefreshToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token, env.JWT_REFRESH_SECRET, {
                algorithms: ['HS256']
            }) as JwtPayload;
        } catch (error) {
            return null;
        }
    }

    /**
     * Decode token without verification (use carefully)
     */
    static decodeToken(token: string): JwtPayload | null {
        try {
            return jwt.decode(token) as JwtPayload;
        } catch (error) {
            return null;
        }
    }

    /**
     * Check if token is expired
     */
    static isTokenExpired(token: string): boolean {
        const payload = this.decodeToken(token);
        if (!payload || !payload.exp) return true;
        return Date.now() >= payload.exp * 1000;
    }

    /**
     * Get time remaining until token expires (in seconds)
     */
    static getTokenTimeRemaining(token: string): number {
        const payload = this.decodeToken(token);
        if (!payload || !payload.exp) return 0;
        return Math.max(0, payload.exp - Math.floor(Date.now() / 1000));
    }
}
