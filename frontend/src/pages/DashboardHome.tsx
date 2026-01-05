import { useState, useEffect } from 'react';
import { Users, UserCheck, Calendar, TrendingUp } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as classService from '../services/class.service';
import * as studentService from '../services/student.service';
import * as subjectService from '../services/subject.service';
import * as sessionService from '../services/session.service';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    classes: 0,
    students: 0,
    subjects: 0,
    sessions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [classes, students, subjects, sessions] = await Promise.all([
        classService.getAllClasses(),
        studentService.getAllStudents(),
        subjectService.getAllSubjects(),
        sessionService.getAllSessions(),
      ]);
      
      setStats({
        classes: classes.length,
        students: students.length,
        subjects: subjects.length,
        sessions: sessions.length,
      });
    } catch {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { 
      label: 'Total Classes', 
      value: stats.classes, 
      icon: Users, 
      bgColor: 'from-sky-400 to-blue-500',
      borderColor: 'border-black'
    },
    { 
      label: 'Total Students', 
      value: stats.students, 
      icon: UserCheck, 
      bgColor: 'from-green-400 to-emerald-500',
      borderColor: 'border-black'
    },
    { 
      label: 'Subjects', 
      value: stats.subjects, 
      icon: TrendingUp, 
      bgColor: 'from-purple-400 to-pink-500',
      borderColor: 'border-black'
    },
    { 
      label: 'Sessions', 
      value: stats.sessions, 
      icon: Calendar, 
      bgColor: 'from-orange-400 to-red-500',
      borderColor: 'border-black'
    },
  ];

  // Chart data
  const barChartData = [
    { name: 'Classes', value: stats.classes },
    { name: 'Students', value: stats.students },
    { name: 'Subjects', value: stats.subjects },
    { name: 'Sessions', value: stats.sessions },
  ];

  const pieChartData = [
    { name: 'Classes', value: stats.classes },
    { name: 'Students', value: stats.students },
    { name: 'Subjects', value: stats.subjects },
    { name: 'Sessions', value: stats.sessions },
  ];

  const COLORS = ['#38BDF8', '#10B981', '#A855F7', '#F97316'];

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8 mt-16">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx} 
              className={`bg-gradient-to-br ${card.bgColor} rounded-2xl p-6 shadow-lg border-4 ${card.borderColor} text-white`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-white/80 text-sm font-medium">{card.label}</p>
              <p className="text-4xl font-bold mt-3">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-black">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Statistics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#38BDF8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-black">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
