import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import Swal from 'sweetalert2';
import * as sessionService from '../services/session.service';
import * as classService from '../services/class.service';
import * as subjectService from '../services/subject.service';
import type { Session, Class, Subject } from '../types/school.types';
import { useAuth } from '../hooks/useAuth';

export default function Sessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    classId: '',
    subjectId: '',
    teacherId: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Auto-fill teacher ID when form is opened
    if (showForm && user && !formData.teacherId) {
      setFormData(prev => ({ ...prev, teacherId: user.id }));
    }
  }, [showForm, user, formData.teacherId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessionsData, classesData, subjectsData] = await Promise.all([
        sessionService.getAllSessions(),
        classService.getAllClasses(),
        subjectService.getAllSubjects(),
      ]);
      setSessions(sessionsData);
      setClasses(classesData);
      setSubjects(subjectsData);
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = {
        date: formData.date,
        classId: formData.classId,
        subjectId: formData.subjectId,
        teacherId: formData.teacherId,
      };

      if (editingSession) {
        await sessionService.updateSession(editingSession.id, data);
      } else {
        await sessionService.createSession(data);
      }

      setFormData({ date: '', classId: '', subjectId: '', teacherId: '' });
      setShowForm(false);
      setEditingSession(null);
      loadData();
    } catch {
      setError('Failed to save session');
    }
  };

  const handleEdit = (session: Session) => {
    setEditingSession(session);
    setFormData({
      date: new Date(session.date).toISOString().slice(0, 16),
      classId: session.classId,
      subjectId: session.subjectId,
      teacherId: session.teacherId,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this session?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      await sessionService.deleteSession(id);
      loadData();
    } catch {
      setError('Failed to delete session');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSession(null);
    setFormData({ date: '', classId: '', subjectId: '', teacherId: '' });
    setError('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US');
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-screen">
        <div className="animate-pulse text-xl text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8 ">
      <div className="flex justify-between items-center my-8">
        <h1 className="text-4xl font-bold text-slate-800">
          Sessions
        </h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 border-2 border-black"
          >
            <Plus size={20} />
            New Session
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Popup Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border-4 border-black p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingSession ? 'Edit Session' : 'New Session'}
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X size={24} className="text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-semibold text-slate-700">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-slate-700">Class</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all bg-white"
                    required
                  >
                    <option value="">Select a class</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-semibold text-slate-700">Subject</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all bg-white"
                    required
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-slate-700">Teacher</label>
                  <input
                    type="text"
                    value={user ? `${user.firstName} ${user.lastName}` : ''}
                    className="w-full px-4 py-3 border-2 border-black rounded-xl bg-slate-100 text-slate-700"
                    disabled
                  />
                  <input
                    type="hidden"
                    value={formData.teacherId || user?.id || ''}
                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-xl hover:bg-gray-500 transition-all duration-200 border-2 border-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 border-2 border-black"
                >
                  {editingSession ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border-4 border-black overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b-2 border-black">
            <tr>
              <th className="text-left p-4 font-semibold text-slate-700">Date & Time</th>
              <th className="text-left p-4 font-semibold text-slate-700">Class</th>
              <th className="text-left p-4 font-semibold text-slate-700">Subject</th>
              <th className="text-left p-4 font-semibold text-slate-700">Teacher</th>
              <th className="text-right p-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-12 text-slate-500">
                  No sessions found. Click "New Session" to create one.
                </td>
              </tr>
            ) : (
              sessions.map((session) => (
                <tr key={session.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      
                      <span className="text-slate-700">{formatDate(session.date)}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-700 font-medium">{session.class?.name}</td>
                  <td className="p-4 text-slate-700">{session.subject?.name}</td>
                  <td className="p-4 text-slate-700">
                    {session.teacher?.firstName} {session.teacher?.lastName}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(session)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit size={18} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(session.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
