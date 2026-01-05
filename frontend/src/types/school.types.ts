// Class types
export interface Class {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  students?: Student[];
  sessions?: Session[];
}

export interface CreateClassData {
  name: string;
}

export interface UpdateClassData {
  name: string;
}

// Student types
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  classId: string;
  class?: Class;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentData {
  firstName: string;
  lastName: string;
  classId: string;
}

export interface UpdateStudentData {
  firstName: string;
  lastName: string;
  classId: string;
}

// Subject types
export interface Subject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  sessions?: Session[];
}

export interface CreateSubjectData {
  name: string;
}

export interface UpdateSubjectData {
  name: string;
}

// User type (for teacher)
export interface Teacher {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Session types
export interface Session {
  id: string;
  date: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  class?: Class;
  subject?: Subject;
  teacher?: Teacher;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionData {
  date: string;
  classId: string;
  subjectId: string;
  teacherId: string;
}

export interface UpdateSessionData {
  date: string;
  classId: string;
  subjectId: string;
  teacherId: string;
}

// Attendance types
export const AttendanceStatus = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  EXCUSED: 'EXCUSED'
} as const;

export type AttendanceStatusType = typeof AttendanceStatus[keyof typeof AttendanceStatus];

export interface Attendance {
  id: string;
  sessionId: string;
  studentId: string;
  status: AttendanceStatusType;
  comment?: string;
  session?: Session;
  student?: Student;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAttendanceData {
  sessionId: string;
  studentId: string;
  status: AttendanceStatusType;
  comment?: string;
}

export interface UpdateAttendanceData {
  status: AttendanceStatusType;
  comment?: string;
}

export interface BulkAttendanceData {
  sessionId: string;
  attendances: Array<{
    studentId: string;
    status: AttendanceStatusType;
    comment?: string;
  }>;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
