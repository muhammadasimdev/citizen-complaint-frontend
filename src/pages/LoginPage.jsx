import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, CheckCircle, Clock, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { PulseMark } from '../components/ui/PulseMark';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login({ email, password });
    setLoading(false);
    if (res.success) {
      window.location.href = '/';
    } else {
      setError(res.error || 'Failed to sign in');
    }
  };

  return (
    <div className="min-h-[90vh] flex bg-white -mt-8 -mx-4 sm:-mx-6 lg:-mx-8">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0b2318] flex-col justify-between p-12 relative overflow-hidden text-white">
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" viewBox="0 0 400 400" fill="none">
          <circle cx="60" cy="340" r="140" stroke="white" strokeWidth="1" />
          <circle cx="340" cy="60" r="180" stroke="white" strokeWidth="1" />
        </svg>

        <div className="relative z-10 flex items-center gap-3">
          <PulseMark size={40} />
          <span className="font-bold text-2xl tracking-tight">Civic Pulse</span>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-6 leading-tight">
            Your voice can shape your city.
          </motion.h1>
          <p className="text-emerald-100/70 text-lg leading-relaxed mb-10">
            Report issues, track their resolution, and see exactly how your local government responds.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="p-2.5 bg-emerald-500/15 rounded-lg text-emerald-300">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-white leading-none">95%</div>
                <div className="text-xs text-emerald-100/60 mt-1">Resolution rate</div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="p-2.5 bg-emerald-500/15 rounded-lg text-emerald-300">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-white leading-none">&lt; 72 hrs</div>
                <div className="text-xs text-emerald-100/60 mt-1">Average response time</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-emerald-100/40 font-medium">© 2026 Civic Pulse</div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-sm w-full">
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <PulseMark size={32} />
            <span className="font-bold text-lg text-[#16211c]">Civic Pulse</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#16211c] tracking-tight">Welcome back</h2>
            <p className="text-stone-500 mt-1.5 text-sm">Sign in to continue reporting and tracking issues.</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-50 text-rose-700 p-3.5 rounded-xl mb-6 text-sm font-medium border border-rose-200 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 shrink-0" /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#16211c] mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-600/15 focus:border-emerald-600 focus:bg-white transition-all text-sm"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-[#16211c]">Password</label>
                <a href="#" className="text-sm font-medium text-emerald-700 hover:text-emerald-800">Forgot?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-11 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-600/15 focus:border-emerald-600 focus:bg-white transition-all text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#16211c]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-stone-600 pt-1">
              <input type="checkbox" className="rounded border-stone-300 text-emerald-700 focus:ring-emerald-600/30" />
              Remember me
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 px-4 rounded-xl transition-colors font-semibold shadow-sm flex items-center justify-center gap-2 group disabled:opacity-70 mt-2"
            >
              {loading ? 'Signing in…' : 'Sign in'}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-stone-500 font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-emerald-700 hover:text-emerald-800 font-semibold">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
