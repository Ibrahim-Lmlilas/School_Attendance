import prisma from '../prisma/client';

// Get all subjects
export const getAllSubjects = async () => {
  return prisma.subject.findMany({
    orderBy: {
      name: 'asc',
    },
  });
};

// Get subject by ID
export const getSubjectById = async (id: string) => {
  return prisma.subject.findUnique({
    where: { id },
    include: {
      sessions: {
        include: {
          class: true,
          teacher: true,
        },
      },
    },
  });
};

// Create new subject
export const createSubject = async (name: string) => {
  return prisma.subject.create({
    data: {
      name,
    },
  });
};

// Update subject
export const updateSubject = async (id: string, name: string) => {
  return prisma.subject.update({
    where: { id },
    data: {
      name,
    },
  });
};

// Delete subject
export const deleteSubject = async (id: string) => {
  return prisma.subject.delete({
    where: { id },
  });
};
