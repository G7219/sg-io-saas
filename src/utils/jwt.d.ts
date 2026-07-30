export interface JwtPayload {
    tenantId: string;
    email: string;
    iat?: number;
    exp?: number;
}
export declare class JwtService {
    /**
     * Generate access token (1 hour validity)
     */
    static generateAccessToken(payload: JwtPayload): string;
    /**
     * Generate refresh token (7 days validity)
     */
    static generateRefreshToken(payload: JwtPayload): string;
    /**
     * Generate both access and refresh tokens
     */
    static generateTokenPair(payload: JwtPayload): {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    };
    /**
     * Verify access token and return payload
     */
    static verifyAccessToken(token: string): JwtPayload | null;
    /**
     * Verify refresh token and return payload
     */
    static verifyRefreshToken(token: string): JwtPayload | null;
    /**
     * Decode token without verification (use carefully)
     */
    static decodeToken(token: string): JwtPayload | null;
    /**
     * Check if token is expired
     */
    static isTokenExpired(token: string): boolean;
    /**
     * Get time remaining until token expires (in seconds)
     */
    static getTokenTimeRemaining(token: string): number;
}
//# sourceMappingURL=jwt.d.ts.map