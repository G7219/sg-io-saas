/**
 * Database Configuration
 * Prisma Client Setup
 */
import { PrismaClient } from '@prisma/client';
declare const prisma: PrismaClient<{
    log: ("error" | "query" | "warn")[];
}, never, import("@prisma/client/runtime/library").DefaultArgs>;
/**
 * Connect to database
 */
export declare function connectDatabase(): Promise<PrismaClient<{
    log: ("error" | "query" | "warn")[];
}, never, import("@prisma/client/runtime/library").DefaultArgs>>;
/**
 * Disconnect from database
 */
export declare function disconnectDatabase(): Promise<void>;
/**
 * Database health check
 */
export declare function checkDatabaseHealth(): Promise<{
    status: string;
    timestamp: Date;
    error?: never;
} | {
    status: string;
    error: string;
    timestamp?: never;
}>;
export default prisma;
//# sourceMappingURL=database.d.ts.map