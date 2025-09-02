import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clean up existing data
  console.log('Cleaning database...');
  await prisma.spaceElements.deleteMany();
  await prisma.mapElements.deleteMany();
  await prisma.space.deleteMany();
  await prisma.user.deleteMany();
  await prisma.avatar.deleteMany();
  await prisma.element.deleteMany();
  await prisma.map.deleteMany();

  // 2. Create Avatars
  console.log('Creating avatars...');
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

  // 3. Create Users (with simple text passwords)
  console.log('Creating users...');
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      password: 'admin123', // Simple text password
      role: Role.Admin,
      avatarId: avatar1.id,
    },
  });

  const normalUser = await prisma.user.create({
    data: {
      username: 'shubham',
      password: 'user123', // Simple text password
      role: Role.User,
      avatarId: avatar2.id,
    },
  });

  // 4. Create Elements
  console.log('Creating elements...');
  const tableElement = await prisma.element.create({
    data: {
      width: 2,
      height: 1,
      imageUrl: 'https://placehold.co/64x32/grey/white?text=Table',
    },
  });

  const chairElement = await prisma.element.create({
    data: {
      width: 1,
      height: 1,
      imageUrl: 'https://placehold.co/32x32/brown/white?text=Chair',
    },
  });

  // 5. Create a "Space" for a user
  console.log('Creating a space...');
  const myVerseSpace = await prisma.space.create({
  data: {
    id: "1", // <-- ADD THIS LINE
    name: "Shubham's First Space",
    width: 20,
    height: 15,
    thumbnail: 'https://placehold.co/400x300/green/white?text=My+Space',
    creatorId: normalUser.id,
  },
});

  // 6. Add elements to the created space
  console.log('Adding elements to the space...');
  await prisma.spaceElements.create({
    data: {
      spaceId: myVerseSpace.id,
      elementId: tableElement.id,
      x: 5,
      y: 5,
    },
  });

  await prisma.spaceElements.create({
    data: {
      spaceId: myVerseSpace.id,
      elementId: chairElement.id,
      x: 5,
      y: 4,
    },
  });
   await prisma.spaceElements.create({
    data: {
      spaceId: myVerseSpace.id,
      elementId: chairElement.id,
      x: 6,
      y: 5,
    },
  });

  console.log('✅ Seeding finished.');
}



main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });