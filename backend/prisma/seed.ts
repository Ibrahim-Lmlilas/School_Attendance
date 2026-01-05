import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../services/auth.service';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  log: ['error'],
});

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Check if users already exist
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@edtech.com' }
    });

    const existingTeacher = await prisma.user.findUnique({
      where: { email: 'teacher@edtech.com' }
    });

    if (existingAdmin && existingTeacher) {
      console.log('⚠️  Users already exist. Skipping...');
      return;
    }

    // Create admin user
    if (!existingAdmin) {
      const hashedAdminPassword = await hashPassword('Admin123!');
      await prisma.user.create({
        data: {
          email: 'admin@edtech.com',
          password: hashedAdminPassword,
          firstName: 'Admin',
          lastName: 'EdTech',
          role: 'ADMIN'
        }
      });
      console.log('✅ Admin user created!');
      console.log('   📧 Email: admin@edtech.com');
      console.log('   🔑 Password: Admin123!');
    }

    
    // Create teacher user
    if (!existingTeacher) {
      const hashedTeacherPassword = await hashPassword('Teacher123!');
      await prisma.user.create({
        data: {
          email: 'teacher@edtech.com',
          password: hashedTeacherPassword,
          firstName: 'Mohamed',
          lastName: 'Benali',
          role: 'TEACHER'
        }
      });
      console.log('✅ Teacher user created!');
      console.log('   📧 Email: teacher@edtech.com');
      console.log('   🔑 Password: Teacher123!');
    }

    console.log('\n⚠️  IMPORTANT: Change passwords after first login!');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

