import prisma from '../prisma/client';

// Get all classes
export const getAllClasses = async () => {
  return prisma.class.findMany({
    include: {
      students: true,
      sessions: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
};

// Get class by ID
export const getClassById = async (id: string) => {
  return prisma.class.findUnique({
    where: { id },
    include: {
      students: true,
      sessions: {
        include: {
          subject: true,
          teacher: true,
        },
      },
    },
  });
};

// Create new class
export const createClass = async (name: string) => {
  return prisma.class.create({
    data: {
      name,
    },
  });
};

// Update class
export const updateClass = async (id: string, name: string) => {
  return prisma.class.update({
    where: { id },
    data: {
      name,
    },
  });
};

// Delete class
export const deleteClass = async (id: string) => {
  return prisma.class.delete({
    where: { id },
  });
};
