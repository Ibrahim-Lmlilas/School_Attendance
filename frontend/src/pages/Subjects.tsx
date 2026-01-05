import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import Swal from 'sweetalert2';
import * as subjectService from '../services/subject.service';
import type { Subject } from '../types/school.types';

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const data = await subjectService.getAllSubjects();
      setSubjects(data);
    } catch {
      setError('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingSubject) {
        await subjectService.updateSubject(editingSubject.id, formData);
      } else {
        await subjectService.createSubject(formData);
      }
      setFormData({ name: '' });
      setShowForm(false);
      setEditingSubject(null);
      loadSubjects();
    } catch {
      setError('Failed to save subject');
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({ name: subject.name });
    setShowForm(true);
  };

  const handleDelete = async (id: string | string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this subject?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      await subjectService.deleteSubject(String(id));
      loadSubjects();
    } catch {
      setError('Failed to delete subject');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSubject(null);
    setFormData({ name: '' });
    setError('');
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 mt-16">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Popup Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border-4 border-black p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingSubject ? 'Edit Subject' : 'New Subject'}
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X size={24} className="text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="w-full px-4 py-2 bg-white border-2 border-black rounded-xl focus:border-blue-600 focus:bg-white transition-all outline-none"
                  placeholder="e.g: Mathematics, English"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-400 text-white font-semibold rounded-xl hover:bg-gray-500 transition-all border-2 border-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all border-2 border-black"
                >
                  {editingSubject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subjects Table */}
      <div className="bg-white rounded-2xl shadow-sm border-4 border-black overflow-hidden">
        <div className="px-6 py-4 border-b-2 border-black flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Subjects</h3>
            <p className="text-sm text-slate-500">Manage subjects and courses</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all border-2 border-black font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">New Subject</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-black">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Sessions</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {subjects.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                    No subjects found. Click "New Subject" to create one.
                  </td>
                </tr>
              ) : (
                subjects.map((subject) => (
                  <tr key={subject.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                       
                        <span className="font-semibold text-slate-800">{subject.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{subject.sessions?.length || 0} sessions</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(subject)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(subject.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
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
    </div>
  );
}
