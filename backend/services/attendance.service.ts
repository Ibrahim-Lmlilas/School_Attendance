import prisma from '../prisma/client';
import { CreateAttendanceDTO } from '../types';

// Create or update attendance for a student in a session
export const markAttendance = async (data: CreateAttendanceDTO) => {
  const { sessionId, studentId, status, comment } = data;

  // Check if session exists
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { class: { include: { students: true } } }
  });

  if (!session) {
    throw new Error('Session not found');
  }

  // Validate student belongs to the session's class
  const studentInClass = session.class.students.find((s: any) => s.id === studentId);
  if (!studentInClass) {
    throw new Error('Student does not belong to this session\'s class');
  }

  // Upsert attendance (create or update if exists)
  return await prisma.attendance.upsert({
    where: {
      studentId_sessionId: { studentId, sessionId }
    },
    update: { status, comment },
    create: { studentId, sessionId, status, comment }
  });
};

// Bulk mark attendance for multiple students in a session
export const markBulkAttendance = async (sessionId: string, attendances: CreateAttendanceDTO[]) => {
  // Validate session exists
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { class: { include: { students: true } } }
  });

  if (!session) {
    throw new Error('Session not found');
  }

  const classStudentIds = session.class.students.map((s: any) => s.id);

  // Create attendance records in transaction
  return await prisma.$transaction(
    attendances.map(attendance => {
      // Validate student belongs to class
      if (!classStudentIds.includes(attendance.studentId)) {
        throw new Error(`Student ${attendance.studentId} not in class`);
      }

      return prisma.attendance.upsert({
        where: {
          studentId_sessionId: { 
            studentId: attendance.studentId, 
            sessionId: sessionId
          }
        },
        update: { status: attendance.status, comment: attendance.comment },
        create: { 
          studentId: attendance.studentId, 
          sessionId: sessionId,
          status: attendance.status, 
          comment: attendance.comment 
        }
      });
    })
  );
};

// Get attendance for a specific session
export const getAttendanceBySession = async (sessionId: string) => {
  return await prisma.attendance.findMany({
    where: { sessionId },
    include: {
      student: { select: { id: true, firstName: true, lastName: true, email: true } }
    },
    orderBy: { student: { lastName: 'asc' } }
  });
};

// Get attendance history for a student
export const getAttendanceByStudent = async (studentId: string, startDate?: Date, endDate?: Date) => {
  return await prisma.attendance.findMany({
    where: {
      studentId,
      ...(startDate || endDate ? {
        session: {
          date: {
            ...(startDate && { gte: startDate }),
            ...(endDate && { lte: endDate })
          }
        }
      } : {})
    },
    include: {
      session: {
        include: {
          class: true,
          subject: true,
          teacher: { select: { firstName: true, lastName: true } }
        }
      }
    },
    orderBy: { session: { date: 'desc' } }
  });
};

// Get attendance statistics for a student
export const getStudentAttendanceStats = async (studentId: string) => {
  const attendances = await prisma.attendance.findMany({
    where: { studentId }
  });

  const total = attendances.length;
  const present = attendances.filter((a: any) => a.status === 'PRESENT').length;
  const absent = attendances.filter((a: any) => a.status === 'ABSENT').length;
  const late = attendances.filter((a: any) => a.status === 'LATE').length;
  const excused = attendances.filter((a: any) => a.status === 'EXCUSED').length;

  return {
    total,
    present,
    absent,
    late,
    excused,
    attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0
  };
};

// Get attendance for a class with optional date filter
export const getAttendanceByClass = async (classId: string, startDate?: Date, endDate?: Date) => {
  return await prisma.attendance.findMany({
    where: {
      session: {
        classId,
        date: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lte: endDate })
        }
      }
    },
    include: {
      student: { select: { id: true, firstName: true, lastName: true } },
      session: {
        select: {
          id: true,
          date: true,
          subject: { select: { name: true } }
        }
      }
    },
    orderBy: [
      { session: { date: 'desc' } },
      { student: { lastName: 'asc' } }
    ]
  });
};

// Get students with attendance status for teacher dashboard
export const getStudentsWithAttendance = async (teacherId: string) => {
  // Get all sessions taught by teacher
  const sessions = await prisma.session.findMany({
    where: { teacherId },
    include: {
      class: {
        include: {
          students: {
            include: {
              attendances: {
                where: {
                  session: { teacherId }
                }
              }
            }
          }
        }
      }
    }
  });

  // Aggregate student data with attendance stats
  const studentsMap = new Map();

  sessions.forEach((session: any) => {
    session.class.students.forEach((student: any) => {
      if (!studentsMap.has(student.id)) {
        studentsMap.set(student.id, {
          ...student,
          className: session.class.name,
          attendances: student.attendances
        });
      } else {
        // Merge attendance records
        const existing = studentsMap.get(student.id);
        existing.attendances.push(...student.attendances);
      }
    });
  });

  // Calculate stats for each student
  return Array.from(studentsMap.values()).map(student => {
    const total = student.attendances.length;
    const present = student.attendances.filter((a: any) => a.status === 'PRESENT').length;
    const absent = student.attendances.filter((a: any) => a.status === 'ABSENT').length;
    const late = student.attendances.filter((a: any) => a.status === 'LATE').length;
    const excused = student.attendances.filter((a: any) => a.status === 'EXCUSED').length;

    return {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      className: student.className,
      stats: {
        total,
        present,
        absent,
        late,
        excused,
        attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0
      }
    };
  });
};

// Delete attendance record
export const deleteAttendance = async (id: string) => {
  return await prisma.attendance.delete({ where: { id } });
};
