
import React, { useState } from 'react';
import { Truck, Mail, Lock, User as UserIcon, ShieldCheck, ArrowRight, AlertCircle, Sparkles, LogIn } from 'lucide-react';
import { mockApi } from '../services/mockApi';

interface AuthViewProps {
  onLoginSuccess: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'admin'>('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login' || mode === 'admin') {
        const identifier = mode === 'admin' ? formData.name : formData.email;
        await mockApi.login(identifier, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) throw new Error("Passwords don't match");
        await mockApi.register(formData.name, formData.email, formData.password);
      }
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (newMode: 'login' | 'register' | 'admin') => {
    setMode(newMode);
    setError(null);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-slate-800/50 blur-[100px] rounded-full"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="w-full max-w-[440px] relative z-10 animate-in-fade">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative">
          {/* Brand Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="orange-gradient p-4 rounded-3xl text-white shadow-xl shadow-orange-500/20 mb-6">
              <Truck size={32} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter">
              Pulse<span className="text-orange-500">Logix</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">Intelligent Logistics Engine</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-3 text-rose-400 text-xs font-bold animate-in-fade">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {/* Form Fields */}
            {(mode === 'register' || mode === 'admin') && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  {mode === 'admin' ? 'Admin ID' : 'Full Name'}
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    required
                    placeholder={mode === 'admin' ? "Enter Admin ID (e.g. mohit)" : "Alex Miller"}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/50 transition-all font-semibold"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
            )}

            {mode !== 'admin' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/50 transition-all font-semibold"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/50 transition-all font-semibold"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/50 transition-all font-semibold"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full orange-gradient py-4 rounded-2xl text-white font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {mode === 'register' ? 'Initialize Account' : mode === 'admin' ? 'Admin Override' : 'System Login'}
                  <ArrowRight size={18} strokeWidth={3} />
                </>
              )}
            </button>
          </form>

          {/* Mode Switchers */}
          <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
            <div className="flex justify-center gap-6">
              <button 
                onClick={() => toggleMode(mode === 'login' ? 'register' : 'login')}
                className="text-[10px] font-black text-slate-500 hover:text-orange-500 uppercase tracking-widest transition-colors"
              >
                {mode === 'login' ? 'New here? Create Account' : 'Already have access? Login'}
              </button>
            </div>
            
            <div className="flex justify-center">
              <button 
                onClick={() => toggleMode(mode === 'admin' ? 'login' : 'admin')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  mode === 'admin' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'text-slate-600 hover:text-white'
                }`}
              >
                <ShieldCheck size={14} />
                {mode === 'admin' ? 'Back to User Portal' : 'Admin Portal'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex items-center justify-center gap-3 text-slate-600">
          <Sparkles size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise Digital Twin Experience</span>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
