import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

// Lazy singleton — only instantiated when first accessed at runtime, not at build time
export const prisma: PrismaClient =
  globalForPrisma.prisma ?? (process.env.DATABASE_URL ? createPrismaClient() : (null as unknown as PrismaClient));

if (process.env.NODE_ENV !== 'production' && process.env.DATABASE_URL) {
  globalForPrisma.prisma = prisma;
}
