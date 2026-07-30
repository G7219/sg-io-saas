/**
 * SG.IO Server Startup
 * Database connection and server initialization
 */

import app from './app.js';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import path from 'path';


// Load environment variables
config();

const PORT = Number(process.env.PORT) || 3000;
const prisma = new PrismaClient();

// =========================
// SERVER STARTUP
// =========================
async function startServer() {
    try {
        // Test database connection
        console.log('🔗 Connecting to database...');
        await prisma.$connect();
        console.log('✅ Database connected successfully');

        // Start server
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`
╔═══════════════════════════════════════╗
║         🌐 SG.IO GLOBAL 🌐            ║
║     Global E-Commerce SaaS Platform    ║
╚═══════════════════════════════════════╝

📍 Server running on: http://localhost:${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📊 API Base: http://localhost:${PORT}/api/v1

Features:
  ✅ 150+ countries support
  ✅ 50+ currencies
  ✅ Multi-language (EN + SW)
  ✅ Admin dashboard
  ✅ 150+ API endpoints
  ✅ Real-time analytics
  ✅ Payment processing
  ✅ AI integration
  ✅ Multi-tenant architecture

Ready to serve! 🚀
      `);
        });

        // =========================
        // GRACEFUL SHUTDOWN
        // =========================
        const shutdown = async (signal: string) => {
            console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);

            server.close(async () => {
                console.log('✅ HTTP server closed');

                // Close database connection
                await prisma.$disconnect();
                console.log('✅ Database connection closed');

                process.exit(0);
            });

            // Force shutdown after 30 seconds
            setTimeout(() => {
                console.error('❌ Forced shutdown after 30 seconds');
                process.exit(1);
            }, 30000);
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

// Start the server
startServer();

export { prisma };
