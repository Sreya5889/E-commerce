import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { PageTransition } from '../../components/layout/PageTransition';

export const AdminLogin = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated && isAdmin) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password, true); // isAdmin = true enforces admin check
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Access denied. Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => setFormData(p => ({ ...p, email: 'admin@eduacademy.com', password: 'password123' }));

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-950 py-12 px-4">
        <div className="w-full max-w-md space-y-8">

          {/* Brand */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-premium bg-gradient-to-tr from-secondary-600 to-primary-600 flex items-center justify-center mx-auto shadow-xl text-white">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Admin Control Panel</h2>
            <p className="text-xs text-slate-400">Restricted access — authorized administrators only</p>
          </div>

          {/* Demo Button */}
          <div className="text-center">
            <button
              onClick={fillDemo}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium rounded-premium transition-colors"
            >
              🔑 Use Demo Admin Credentials
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-950/30 text-red-400 border border-red-800 rounded-premium flex items-center space-x-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-premium p-8 shadow-2xl space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Admin Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@domain.com"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-premium text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3 pr-11 bg-slate-800 border border-slate-700 rounded-premium text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center space-x-2.5 text-xs text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-secondary-600 border-slate-600 focus:ring-secondary-500"
                />
                <span>Remember this device for 30 days</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-secondary-600 hover:bg-secondary-700 text-white font-bold text-sm rounded-premium shadow-md transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
                    <span>Authenticating...</span>
                  </span>
                ) : 'Access Admin Dashboard'}
              </button>
            </form>
          </div>

          <div className="text-center space-y-2">
            <p className="text-[10px] text-slate-600">🔒 All admin actions are logged and monitored for security compliance.</p>
            <a href="/login" className="text-xs text-slate-500 hover:text-slate-400 underline">Return to Student Login</a>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
