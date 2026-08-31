import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ShieldAlert, UserCircle, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { PulseMark } from '../components/ui/PulseMark';

export default function SignupPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'citizen' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await register(formData);
    setLoading(false);
    if (res.success) {
      navigate('/login');
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[90vh] flex bg-white -mt-8 -mx-4 sm:-mx-6 lg:-mx-8">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0b2318] flex-col justify-between p-12 relative overflow-hidden text-white">
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" viewBox="0 0 400 400" fill="none">
          <circle cx="340" cy="340" r="160" stroke="white" strokeWidth="1" />
          <circle cx="40" cy="40" r="120" stroke="white" strokeWidth="1" />
        </svg>

        <div className="relative z-10 flex items-center gap-3">
          <PulseMark size={40} />
          <span className="font-bold text-2xl tracking-tight">Civic Pulse</span>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-6 leading-tight">
            Join the movement for better cities.
          </motion.h1>
          <p className="text-emerald-100/70 text-lg leading-relaxed">
            Create an account to report issues, track resolutions in real time, and collaborate with your local government.
          </p>
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
            <h2 className="text-2xl font-bold text-[#16211c] tracking-tight">Create your account</h2>
            <p className="text-stone-500 mt-1.5 text-sm">Takes less than a minute to get started.</p>
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
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`relative border rounded-xl p-4 cursor-pointer transition-all ${
                  formData.role === 'citizen' ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600/20' : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="citizen"
                  checked={formData.role === 'citizen'}
                  onChange={() => setFormData({ ...formData, role: 'citizen' })}
                  className="sr-only"
                />
                <div className="flex flex-col gap-2">
                  <UserCircle className={`w-5 h-5 ${formData.role === 'citizen' ? 'text-emerald-700' : 'text-stone-400'}`} />
                  <span className={`text-sm font-bold ${formData.role === 'citizen' ? 'text-emerald-900' : 'text-[#16211c]'}`}>Citizen</span>
                  <span className="text-xs text-stone-500 leading-snug">Report and track community issues.</span>
                </div>
              </label>

              <label
                className={`relative border rounded-xl p-4 cursor-pointer transition-all ${
                  formData.role === 'officer' ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600/20' : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="officer"
                  checked={formData.role === 'officer'}
                  onChange={() => setFormData({ ...formData, role: 'officer' })}
                  className="sr-only"
                />
                <div className="flex flex-col gap-2">
                  <Landmark className={`w-5 h-5 ${formData.role === 'officer' ? 'text-emerald-700' : 'text-stone-400'}`} />
                  <span className={`text-sm font-bold ${formData.role === 'officer' ? 'text-emerald-900' : 'text-[#16211c]'}`}>Officer</span>
                  <span className="text-xs text-stone-500 leading-snug">Manage and resolve civic complaints.</span>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#16211c] mb-1.5">Full name</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-600/15 focus:border-emerald-600 focus:bg-white transition-all text-sm"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#16211c] mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-600/15 focus:border-emerald-600 focus:bg-white transition-all text-sm"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#16211c] mb-1.5">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-600/15 focus:border-emerald-600 focus:bg-white transition-all text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 px-4 rounded-xl transition-colors font-semibold shadow-sm flex items-center justify-center gap-2 group disabled:opacity-70 mt-2"
            >
              {loading ? 'Creating account…' : 'Create account'}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-stone-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-700 hover:text-emerald-800 font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
