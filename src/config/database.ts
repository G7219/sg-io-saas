/**
 * Database Configuration
 * Prisma Client Setup
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
});

/**
 * Handle Prisma client connection events
 */
prisma.$on('error', (e: any) => {
    console.error('❌ Prisma Error:', e);
});

prisma.$on('warn', (e: any) => {
    console.warn('⚠️  Prisma Warning:', e);
});

/**
 * Connect to database
 */
export async function connectDatabase() {
    try {
        await prisma.$connect();
        console.log('✅ Database connection established');
        return prisma;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

/**
 * Disconnect from database
 */
export async function disconnectDatabase() {
    try {
        await prisma.$disconnect();
        console.log('✅ Database connection closed');
    } catch (error) {
        console.error('❌ Error disconnecting from database:', error);
    }
}

/**
 * Database health check
 */
export async function checkDatabaseHealth() {
    try {
        await prisma.$executeRawUnsafe('SELECT 1');
        return { status: 'healthy', timestamp: new Date() };
    } catch (error) {
        return { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export default prisma;
