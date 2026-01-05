import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Clock, TrendingUp, Search } from 'lucide-react';
import * as attendanceService from '../services/attendance.service';
import { useAuth } from '../hooks/useAuth';

interface StudentWithStats {
  id: number;
  firstName: string;
  lastName: string;
  email: string | null;
  className: string;
  stats: {
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    attendanceRate: number;
  };
}

export default function TeacherStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadStudents();
    }
  }, [user]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getStudentsWithAttendance(user!.id);
      setStudents(data);
    } catch {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (rate: number) => {
    if (rate >= 95) return { label: 'Excellent', color: 'bg-green-100 text-green-700 border-green-200' };
    if (rate >= 90) return { label: 'Good', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    if (rate >= 85) return { label: 'Attention', color: 'bg-orange-100 text-orange-700 border-orange-200' };
    return { label: 'Alert', color: 'bg-red-100 text-red-700 border-red-200' };
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  // Calculate overall stats
  const totalStudents = students.length;
  const avgAttendance = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.stats.attendanceRate, 0) / students.length)
    : 0;
  const alertCount = students.filter(s => s.stats.attendanceRate < 85).length;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-pulse text-xl text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 ">
      {/* Header with Search */}
      <div className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            My Students
          </h1>
          <p className="text-slate-600 mt-2">Track attendance and statistics</p>
        </div>
        <div className="w-180 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search student or class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-black rounded-xl focus:border-blue-600 focus:outline-none transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl p-6 shadow-lg border-4 border-black text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-white/90 text-sm font-medium">Total Students</h3>
          <p className="text-3xl font-bold mt-2">{totalStudents}</p>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-6 shadow-lg border-4 border-black text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-white/90 text-sm font-medium">Average Attendance</h3>
          <p className="text-3xl font-bold mt-2">{avgAttendance}%</p>
        </div>

        <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 shadow-lg border-4 border-black text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-white/90 text-sm font-medium">Alerts</h3>
          <p className="text-3xl font-bold mt-2">{alertCount}</p>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500">
            {searchTerm ? 'No students found' : 'No students in your classes'}
          </div>
        ) : (
          filteredStudents.map((student) => {
            const status = getStatusBadge(student.stats.attendanceRate);
            return (
              <div
                key={student.id}
                className="bg-white rounded-2xl shadow-sm border-4 border-black hover:shadow-lg transition-all overflow-hidden group"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 relative">
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    
                    <div className="text-white">
                      <h3 className="font-bold text-lg">{student.firstName} {student.lastName}</h3>
                      <span className="text-sm text-blue-100">{student.className}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Attendance Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-600">Attendance Rate</span>
                      <span className="text-lg font-bold text-slate-800">{student.stats.attendanceRate}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          student.stats.attendanceRate >= 95 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                          student.stats.attendanceRate >= 90 ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                          student.stats.attendanceRate >= 85 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                          'bg-gradient-to-r from-red-400 to-red-500'
                        }`}
                        style={{ width: `${student.stats.attendanceRate}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 rounded-xl p-3 border-2 border-black">
                      <div className="flex items-center gap-2 mb-1">
                        <UserCheck className="w-4 h-4 text-green-600" />
                        <p className="text-xs text-green-600 font-medium">Present</p>
                      </div>
                      <p className="text-2xl font-bold text-green-700">{student.stats.present}</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-3 border-2 border-black">
                      <div className="flex items-center gap-2 mb-1">
                        <UserX className="w-4 h-4 text-red-600" />
                        <p className="text-xs text-red-600 font-medium">Absent</p>
                      </div>
                      <p className="text-2xl font-bold text-red-700">{student.stats.absent}</p>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-3 border-2 border-black">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <p className="text-xs text-orange-600 font-medium">Late</p>
                      </div>
                      <p className="text-2xl font-bold text-orange-700">{student.stats.late}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3 border-2 border-black">
                      <div className="flex items-center gap-2 mb-1">
                        <UserCheck className="w-4 h-4 text-blue-600" />
                        <p className="text-xs text-blue-600 font-medium">Excused</p>
                      </div>
                      <p className="text-2xl font-bold text-blue-700">{student.stats.excused}</p>
                    </div>
                  </div>

                  {/* Total Sessions */}
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-xs text-slate-500">
                      Total: {student.stats.total} session(s)
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
