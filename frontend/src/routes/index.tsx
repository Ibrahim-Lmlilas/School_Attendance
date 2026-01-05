import type { ReactNode } from 'react';
import Auth from '../Auth';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardHome from '../pages/DashboardHome';
import Classes from '../pages/Classes';
import Students from '../pages/Students';
import Subjects from '../pages/Subjects';
import Sessions from '../pages/Sessions';
import AttendanceList from '../pages/AttendanceList';
import MarkAttendance from '../pages/MarkAttendance';
import TeacherStudents from '../pages/TeacherStudents';

interface RouteConfig {
  path: string;
  element: ReactNode;
  children?: RouteConfig[];
}

export const appRoutes: RouteConfig[] = [
  {
    path: '/',
    element: <Auth />
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { path: '', element: <DashboardHome /> },
      { path: 'classes', element: <Classes /> },
      { path: 'students', element: <Students /> },
      { path: 'subjects', element: <Subjects /> },
      { path: 'sessions', element: <Sessions /> },
      { path: 'attendance', element: <AttendanceList /> },
      { path: 'attendance/mark/:sessionId', element: <MarkAttendance /> },
      { path: 'attendance/session/:sessionId', element: <MarkAttendance /> },
      { path: 'teacher/students', element: <TeacherStudents /> }
    ]
  }
];
