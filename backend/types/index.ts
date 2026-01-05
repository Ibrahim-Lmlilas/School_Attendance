// Attendance status enum
export const AttendanceStatus = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  EXCUSED: 'EXCUSED',
} as const;

export type AttendanceStatusType = typeof AttendanceStatus[keyof typeof AttendanceStatus];

// Attendance interfaces
export interface CreateAttendanceDTO {
  sessionId: string;
  studentId: string;
  status: AttendanceStatusType;
  comment?: string;
}


