import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import Swal from 'sweetalert2';
import * as classService from '../services/class.service';
import type { Class } from '../types/school.types';

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const data = await classService.getAllClasses();
      setClasses(data);
    } catch {
      setError('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingClass) {
        await classService.updateClass(editingClass.id, formData);
      } else {
        await classService.createClass(formData);
      }
      setFormData({ name: '' });
      setShowForm(false);
      setEditingClass(null);
      loadClasses();
    } catch {
      setError('Failed to save class');
    }
  };

  const handleEdit = (classData: Class) => {
    setEditingClass(classData);
    setFormData({ name: classData.name });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this class?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await classService.deleteClass(id);
          Swal.fire('Deleted!', 'Class has been deleted.', 'success');
          loadClasses();
        } catch {
          Swal.fire('Error!', 'Failed to delete class', 'error');
        }
      }
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingClass(null);
    setFormData({ name: '' });
    setError('');
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 mt-16">
      {error && (
        <div className="bg-red-500/10 border-2 border-red-500 text-red-600 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border-4 border-black p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingClass ? 'Edit Class' : 'New Class'}
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
                  Class Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="w-full px-4 py-2 bg-white border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  placeholder="e.g: Class A, Class B"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all border-2 border-black"
                >
                  {editingClass ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Classes Table */}
      <div className="bg-white rounded-2xl shadow-lg border-4 border-black overflow-hidden">
        <div className="px-6 py-4 border-b-4 border-black flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Classes</h3>
            <p className="text-sm text-slate-600">Manage your classes</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all border-2 border-black font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>New Class</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-black">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Class</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Students</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Sessions</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {classes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No classes found. Click "New Class" to create one.
                  </td>
                </tr>
              ) : (
                classes.map((classData) => (
                  <tr key={classData.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-800">{classData.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{classData.students?.length || 0} students</td>
                    <td className="px-6 py-4 text-slate-600">{classData.sessions?.length || 0} sessions</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(classData)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(classData.id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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
