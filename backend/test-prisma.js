const { PrismaClient } = require('@prisma/client');
console.log('Attempting to create PrismaClient...');
try {
  // Try with empty options
  const client = new PrismaClient({});
  console.log('SUCCESS with {}');
  process.exit(0);
} catch(e1) {
  console.log('Failed with {}:', e1.message);
  try {
    // Prisma 7 may need adapter
    const client = new PrismaClient({ adapter: null });
    console.log('SUCCESS with adapter:null');
    process.exit(0);
  } catch(e2) {
    console.log('Failed with adapter:null:', e2.message);
  }
}
