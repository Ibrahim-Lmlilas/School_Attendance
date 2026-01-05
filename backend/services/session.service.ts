import prisma from '../prisma/client';

// Get all sessions
export const getAllSessions = async () => {
  return prisma.session.findMany({
    include: {
      class: true,
      subject: true,
      teacher: true,
    },
    orderBy: {
      date: 'desc',
    },
  });
};

// Get sessions by class
export const getSessionsByClass = async (classId: string) => {
  return prisma.session.findMany({
    where: { classId },
    include: {
      subject: true,
      teacher: true,
    },
    orderBy: {
      date: 'desc',
    },
  });
};

// Get session by ID
export const getSessionById = async (id: string) => {
  return prisma.session.findUnique({
    where: { id },
    include: {
      class: {
        include: {
          students: true
        }
      },
      subject: true,
      teacher: true,
      attendances: {
        include: {
          student: true,
        },
      },
    },
  });
};

// Create new session
export const createSession = async (
  date: Date,
  classId: string,
  subjectId: string,
  teacherId: string
) => {
  return prisma.session.create({
    data: {
      date,
      classId,
      subjectId,
      teacherId,
    },
  });
};

// Update session
export const updateSession = async (
  id: string,
  date: Date,
  classId: string,
  subjectId: string,
  teacherId: string
) => {
  return prisma.session.update({
    where: { id },
    data: {
      date,
      classId,
      subjectId,
      teacherId,
    },
  });
};

// Delete session
export const deleteSession = async (id: string) => {
  return prisma.session.delete({
    where: { id },
  });
};
