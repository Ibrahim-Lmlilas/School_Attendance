import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, UserCheck, Filter, Eye } from 'lucide-react';
import * as sessionService from '../services/session.service';
import * as attendanceService from '../services/attendance.service';
import type { Session } from '../types/school.types';
import { useAuth } from '../hooks/useAuth';

export default function AttendanceList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsWithAttendance, setSessionsWithAttendance] = useState<Map<string, boolean>>(new Map<string, boolean>());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionService.getAllSessions();
      
      // Filter teacher's sessions
      const teacherSessions = user?.role === 'ADMIN' 
        ? data 
        : data.filter(s => s.teacherId === user?.id);
      
      setSessions(teacherSessions);

      // Check which sessions have attendance marked
      const attendanceMap = new Map<string, boolean>();
      for (const session of teacherSessions) {
        try {
          const attendance = await attendanceService.getAttendanceBySession(session.id);
          attendanceMap.set(session.id, attendance.length > 0);
        } catch {
          attendanceMap.set(session.id, false);
        }
      }
      setSessionsWithAttendance(attendanceMap);
    } catch {
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = filterDate
    ? sessions.filter(s => s.date.startsWith(filterDate))
    : sessions;

  const sortedSessions = [...filteredSessions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Attendance Management
          </h1>
          <p className="text-slate-600 mt-2">Mark and view attendance records</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-2xl shadow-sm border-4 border-black p-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-slate-600" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 border-2 border-black rounded-xl focus:border-blue-600 focus:outline-none transition-all"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="px-4 py-2 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition-all border-2 border-black"
            >
              Reset
            </button>
          )}
          <p className="text-sm text-slate-600 ml-auto">
            {filteredSessions.length} session(s) found
          </p>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-white rounded-2xl shadow-sm border-4 border-black overflow-hidden">
        <div className="grid grid-cols-1 gap-4 p-6">
          {sortedSessions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No sessions found
            </div>
          ) : (
            sortedSessions.map((session) => {
              const hasAttendance = sessionsWithAttendance.get(session.id);
              return (
                <div
                  key={session.id}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    hasAttendance
                      ? 'bg-green-50 border-black'
                      : 'bg-slate-50 border-black hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold ${
                        hasAttendance
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                          : 'bg-gradient-to-br from-blue-400 to-purple-600'
                      }`}>
                        <Calendar className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">
                          {session.subject?.name}
                        </h3>
                        <p className="text-slate-600">
                          {session.class?.name} • {new Date(session.date).toLocaleString('en-US')}
                        </p>
                        <p className="text-sm text-slate-500">
                          Teacher: {session.teacher?.firstName} {session.teacher?.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {hasAttendance ? (
                        <>
                          <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg border-2 border-black font-medium">
                            <UserCheck className="w-4 h-4" />
                            Attendance Marked
                          </span>
                          <button
                            onClick={() => navigate(`/dashboard/attendance/session/${session.id}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg border-2 border-black hover:bg-blue-700 transition-all font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => navigate(`/dashboard/attendance/mark/${session.id}`)}
                          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all border-2 border-black"
                        >
                          <UserCheck className="w-5 h-5" />
                          Mark Attendance
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
