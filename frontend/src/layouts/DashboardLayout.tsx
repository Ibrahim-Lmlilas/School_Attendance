import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Calendar, GraduationCap, LogOut, UserCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'TEACHER'] },
        { path: '/dashboard/teacher/students', label: 'My Students', icon: GraduationCap, roles: ['TEACHER'] },
        { path: '/dashboard/attendance', label: 'Attendance', icon: UserCheck, roles: ['TEACHER'] },
        { path: '/dashboard/sessions', label: 'My Sessions', icon: Calendar, roles: ['TEACHER'] },
        { path: '/dashboard/classes', label: 'Classes', icon: Users, roles: ['ADMIN'] },
        { path: '/dashboard/students', label: 'Students', icon: GraduationCap, roles: ['ADMIN'] },
        { path: '/dashboard/subjects', label: 'Subjects', icon: BookOpen, roles: ['ADMIN'] },
        { path: '/dashboard/sessions', label: 'Sessions', icon: Calendar, roles: ['ADMIN'] },
    ];

    const filteredNavItems = navItems.filter(item =>
        item.roles.includes(user?.role || 'TEACHER')
    );

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: '#F6FAFF' }}>
            {/* Sidebar */}
            <aside className="bg-gradient-to-br from-sky-400 to-blue-500 text-white w-64 flex flex-col border-r-4 border-black">
                {/* Logo */}
                <div className="p-6 flex items-center gap-3 border-b-4 border-black">
                    <div className="w-10 h-10  rounded-xl flex items-center justify-center text-blue-600">
                        <img
                            src="/public/edtech-logo.png"
                            alt="EdTech logo"
                            className="w-24 h-auto object-contain border-black"
                        />          </div>
                    <div>
                        <p className="text-xs text-blue-100">
                            {user?.role === 'TEACHER' ? 'Teacher' : 'Administrator'}
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {filteredNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/20 text-white"
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t-4 border-black">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/20 transition-all cursor-pointer"
                    >
                       
                        <div className="flex-1 text-left">
                            <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-blue-100">{user?.email}</p>
                        </div>
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
