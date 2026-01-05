import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserCheck, UserX, Clock, CheckCircle, ArrowLeft, Save } from 'lucide-react';
import * as sessionService from '../services/session.service';
import * as attendanceService from '../services/attendance.service';
import type { Session, Student } from '../types/school.types';

export default function MarkAttendance() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Map<string, string>>(new Map<string, string>());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSessionData();
  }, [sessionId]);

  const loadSessionData = async () => {
    try {
      setLoading(true);
      const id = sessionId || '0';
      
      // Load session details
      const sessionData = await sessionService.getSessionById(id);
      setSession(sessionData);

      // Load students from the class
      if (sessionData.class?.students) {
        setStudents(sessionData.class.students);
      }

      // Load existing attendance
      const existingAttendance = await attendanceService.getAttendanceBySession(id);
      const attendanceMap = new Map<string, string>();
      existingAttendance.forEach((record: any) => {
        attendanceMap.set(String(record.studentId), record.status);
      });
      setAttendance(attendanceMap);
    } catch (err: any) {
      setError('Failed to load session data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: string, status: string) => {
    const newAttendance = new Map(attendance);
    newAttendance.set(studentId, status);
    setAttendance(newAttendance);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      const attendanceData = Array.from(attendance.entries()).map(([studentId, status]) => ({
        studentId,
        status: status as any
      }));

      await attendanceService.markBulkAttendance({
        sessionId: sessionId || '0',
        attendances: attendanceData
      });

      setSuccess('Attendance recorded successfully');
      setTimeout(() => navigate('/dashboard/sessions'), 1500);
    } catch (err: any) {
      setError('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'bg-green-100 text-green-700 border-black';
      case 'ABSENT': return 'bg-red-100 text-red-700 border-black';
      case 'LATE': return 'bg-orange-100 text-orange-700 border-black';
      case 'EXCUSED': return 'bg-blue-100 text-blue-700 border-black';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT': return <UserCheck className="w-4 h-4" />;
      case 'ABSENT': return <UserX className="w-4 h-4" />;
      case 'LATE': return <Clock className="w-4 h-4" />;
      case 'EXCUSED': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const stats = {
    total: students.length,
    present: Array.from(attendance.values()).filter(s => s === 'PRESENT').length,
    absent: Array.from(attendance.values()).filter(s => s === 'ABSENT').length,
    late: Array.from(attendance.values()).filter(s => s === 'LATE').length,
    excused: Array.from(attendance.values()).filter(s => s === 'EXCUSED').length,
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-pulse text-xl text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/sessions')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Mark Attendance</h1>
            <p className="text-slate-600">
              {session?.subject?.name} - {session?.class?.name} - {new Date(session?.date || '').toLocaleString('en-US')}
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || attendance.size === 0}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
          {success}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-slate-100 rounded-xl p-4 border-2 border-black">
          <p className="text-sm text-slate-700 font-medium">Total</p>
          <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border-2 border-black">
          <p className="text-sm text-green-700 font-medium">Present</p>
          <p className="text-3xl font-bold text-green-700">{stats.present}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border-2 border-black">
          <p className="text-sm text-red-700 font-medium">Absent</p>
          <p className="text-3xl font-bold text-red-700">{stats.absent}</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 border-2 border-black">
          <p className="text-sm text-orange-700 font-medium">Late</p>
          <p className="text-3xl font-bold text-orange-700">{stats.late}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border-2 border-black">
          <p className="text-sm text-blue-700 font-medium">Excused</p>
          <p className="text-3xl font-bold text-blue-700">{stats.excused}</p>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-2xl shadow-sm border-4 border-black overflow-hidden">
        <div className="grid grid-cols-1 gap-4 p-6">
          {students.map((student) => {
            const status = attendance.get(student.id);
            return (
              <div key={student.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border-2 border-black hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{student.firstName} {student.lastName}</p>
                    <p className="text-sm text-slate-500">{student.email}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].map((statusOption) => (
                    <button
                      key={statusOption}
                      onClick={() => handleStatusChange(student.id, statusOption)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        status === statusOption
                          ? getStatusColor(statusOption)
                          : 'bg-white border-black text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {getStatusIcon(statusOption)}
                      <span className="text-sm">
                        {statusOption === 'PRESENT' && 'Present'}
                        {statusOption === 'ABSENT' && 'Absent'}
                        {statusOption === 'LATE' && 'Late'}
                        {statusOption === 'EXCUSED' && 'Excused'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
