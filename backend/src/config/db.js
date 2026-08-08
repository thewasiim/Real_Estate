import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  console.error('❌ FATAL: DATABASE_URL environment variable is not defined.');
  process.exit(1);
}

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✓ Prisma Connected');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✓ Database Connected');
  } catch (error) {
    console.error('❌ Database connection error:', error.message || error);
    process.exit(1);
  }
}

export default prisma;
