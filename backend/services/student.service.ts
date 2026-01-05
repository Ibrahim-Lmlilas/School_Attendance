import prisma from '../prisma/client';

// Get all students
export const getAllStudents = async () => {
  return prisma.student.findMany({
    include: {
      class: true,
    },
    orderBy: {
      firstName: 'asc',
    },
  });
};

// Get students by class
export const getStudentsByClass = async (classId: string) => {
  return prisma.student.findMany({
    where: { classId },
    orderBy: {
      firstName: 'asc',
    },
  });
};

// Get student by ID
export const getStudentById = async (id: string) => {
  return prisma.student.findUnique({
    where: { id },
    include: {
      class: true,
      attendances: {
        include: {
          session: {
            include: {
              subject: true,
            },
          },
        },
      },
    },
  });
};

// Create new student
export const createStudent = async (firstName: string,lastName: string,classId: string ) => {
  return prisma.student.create({
    data: {
      firstName,
      lastName,
      classId,
    },
  });
};

// Update student
export const updateStudent = async (id: string,firstName: string,lastName: string,classId: string ) => {
  return prisma.student.update({
    where: { id },
    data: {
      firstName,
      lastName,
      classId,
    },
  });
};

// Delete student
export const deleteStudent = async (id:string) => {
  return prisma.student.delete({
    where: { id },
  });
};
