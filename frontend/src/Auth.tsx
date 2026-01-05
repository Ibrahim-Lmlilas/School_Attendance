import React, { useState } from 'react';
import { Lock, Mail, GraduationCap, Users } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [userType, setUserType] = useState('teacher');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('teacher@edtech.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const userTypes = [
    { id: 'teacher', label: 'Enseignant', icon: GraduationCap, color: 'from-blue-500 to-cyan-500', email: 'teacher@edtech.com' },
    { id: 'admin', label: 'Administration', icon: Users, color: 'from-purple-500 to-pink-500', email: 'admin@edtech.com' }
  ];

  const selectedType = userTypes.find(t => t.id === userType);

  // Update email when user type changes
  const handleUserTypeChange = (type: string) => {
    setUserType(type);
    const selected = userTypes.find(t => t.id === type);
    if (selected) {
      setEmail(selected.email);
    }
    setError('');
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(email, password);
      
      // Validate that the user's role matches the selected user type
      const expectedRole = userType === 'teacher' ? 'TEACHER' : 'ADMIN';
      
      if (userData.role !== expectedRole) {
        const correctTab = userData.role === 'TEACHER' ? 'Enseignant' : 'Administration';
        setError(`Cet email correspond à un compte ${correctTab}. Veuillez sélectionner l'onglet approprié.`);
        setLoading(false);
        return;
      }
      
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: '#F6FAFF'}}>
      {/* Main content - Two columns */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center justify-between">
        {/* Left side - Illustration */}
        <div className="flex-1 hidden lg:flex justify-center items-center">
          <img 
            src="./public/image.png" 
            alt="Illustration"
            className="w-full h-full max-w-2xl max-h-96 object-contain"
          />
        </div>

        {/* Right side - Form */}
        <div className="flex-1 w-full max-w-md">
        <div className="bg-gradient-to-br from-sky-400 to-blue-500 rounded-3xl shadow-2xl overflow-hidden p-8 border-4 border-black">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome to EdTech 
            </h1>
            <p className="text-blue-100 text-sm">
              Get access to your classes and assignments!
            </p>
          </div>

          {/* User type selector */}
          <div className="flex gap-3 mb-8 bg-blue-400/30 p-3 rounded-2xl backdrop-blur-sm">
            {userTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => handleUserTypeChange(type.id)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-xl transition-all duration-300 cursor-pointer ${
                    userType === type.id
                      ? 'bg-white text-blue-600 shadow-lg scale-105'
                      : 'text-blue-100 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-semibold">{type.label}</span>
                </button>
              );
            })}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-300/50 rounded-xl p-3 mb-6 backdrop-blur-sm">
              <p className="text-red-100 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label className="block text-sm font-semibold text-white mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 group-focus-within:text-white transition-colors" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-black rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 group-focus-within:text-white transition-colors" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-black rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

           
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black cursor-pointer"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

         
        </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;