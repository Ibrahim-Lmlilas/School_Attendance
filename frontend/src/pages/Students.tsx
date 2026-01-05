import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import Swal from 'sweetalert2';
import * as studentService from '../services/student.service';
import * as classService from '../services/class.service';
import type { Student, Class } from '../types/school.types';

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    classId: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsData, classesData] = await Promise.all([
        studentService.getAllStudents(),
        classService.getAllClasses(),
      ]);
      setStudents(studentsData);
      setClasses(classesData);
    } catch {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        classId: formData.classId,
      };

      if (editingStudent) {
        await studentService.updateStudent(editingStudent.id, data);
      } else {
        await studentService.createStudent(data);
      }

      setFormData({ firstName: '', lastName: '', classId: '' });
      setShowForm(false);
      setEditingStudent(null);
      loadData();
    } catch {
      setError('Failed to save student');
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      classId: student.classId,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this student?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await studentService.deleteStudent(id);
          Swal.fire('Deleted!', 'Student has been deleted.', 'success');
          loadData();
        } catch {
          Swal.fire('Error!', 'Failed to delete student', 'error');
        }
      }
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
    setFormData({ firstName: '', lastName: '', classId: '' });
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
          <div className="bg-white rounded-2xl shadow-2xl border-4 border-black p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingStudent ? 'Edit Student' : 'New Student'}
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X size={24} className="text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2 bg-white border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2 bg-white border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Class
                </label>
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  className="w-full px-4 py-2 bg-white border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
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
                  {editingStudent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white rounded-2xl shadow-lg border-4 border-black overflow-hidden">
        <div className="px-6 py-4 border-b-4 border-black flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Students</h3>
            <p className="text-sm text-slate-600">Manage your students</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all border-2 border-black font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>New Student</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-black">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Class</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                    No students found. Click "New Student" to create one.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-800">
                          {student.firstName} {student.lastName}
                        </span>
                        <p className="text-sm text-slate-500">{student.firstName}.{student.lastName}@school.com</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-300">
                        {student.class?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
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
