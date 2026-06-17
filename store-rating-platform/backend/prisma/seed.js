const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

 
  const defaultAdminEmail = 'admin@storerating.com';
  const rawPassword = 'SecureAdmin2026!'; 
  
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: defaultAdminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    
    const admin = await prisma.user.create({
      data: {
        name: 'System Administrator',
        email: defaultAdminEmail,
        password: hashedPassword,
        address: 'Main Management Head Office, Sector 4, Suite 101',
        role: 'ADMIN',
      },
    });

    console.log(`Default Admin account created: ${admin.email}`);
    console.log(`Seeded Password: ${rawPassword} (Please change this after first login!)`);
  } else {
    console.log('Admin user already exists. Skipping seed.');
  }
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });