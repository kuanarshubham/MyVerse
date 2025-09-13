import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // 1. Clean up existing data
  console.log('Cleaning database...');
  await prisma.spaceElements.deleteMany();
  await prisma.mapElements.deleteMany();
  await prisma.space.deleteMany();
  await prisma.user.deleteMany();
  await prisma.avatar.deleteMany();
  await prisma.element.deleteMany();
  await prisma.map.deleteMany();

  // 2. Create a default Admin User (needed to create global assets)
  console.log('Creating admin user...');
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      password: 'adminpassword', // In a real app, this should be hashed!
      role: Role.Admin,
    },
  });

  // 3. Create some default Avatars
  console.log('Creating default avatars...');
  const avatar1 = await prisma.avatar.create({
    data: {
      name: 'Default Avatar 1',
      imageUrl: 'https://placehold.co/100x100/orange/white?text=A1',
    },
  });
  const avatar2 = await prisma.avatar.create({
    data: {
      name: 'Default Avatar 2',
      imageUrl: 'https://placehold.co/100x100/blue/white?text=A2',
    },
  });

  // 4. Create some default Elements
  console.log('Creating default elements...');
  const tableElement = await prisma.element.create({
    data: {
      width: 2,
      height: 1,
      imageUrl: 'https://placehold.co/64x32/grey/white?text=Table',
      static: true,
    },
  });
  const chairElement = await prisma.element.create({
    data: {
      width: 1,
      height: 1,
      imageUrl: 'https://placehold.co/32x32/brown/white?text=Chair',
      static: true,
    },
  });

  // 5. Create a default Map Template
  console.log('Creating default map template...');
  const defaultMap = await prisma.map.create({
    data: {
      name: 'Default Office Room',
      width: 20,
      height: 15,
      thumbnail: 'https://placehold.co/400x300/grey/white?text=Office',
      mapElements: {
        create: [
          { elementId: tableElement.id, x: 5, y: 5 },
          { elementId: chairElement.id, x: 5, y: 4 },
        ],
      },
    },
  });

  // 6. Create a regular Test User
  console.log('Creating test user...');
  const testUser = await prisma.user.create({
    data: {
      username: 'testuser',
      password: 'password123',
      role: Role.User,
      avatarId: avatar2.id, // Assign a default avatar
    },
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });