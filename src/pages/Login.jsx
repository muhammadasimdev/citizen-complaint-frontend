import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appConfig } from '../config/appConfig';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login({ email, password });
    setLoading(false);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-3xl glass-panel overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Left Visual Branding Panel */}
        <div className="p-8 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="relative z-10">
            <h2 className="text-2xl font-black">{appConfig.appName}.</h2>
            <p className="mt-4 text-indigo-100 font-medium">Welcome back! Sign in to access your administrative suite and APIs.</p>
          </div>
          <div className="relative z-10 flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <ShieldCheck className="w-8 h-8 text-emerald-300 shrink-0" />
            <span className="text-xs text-indigo-100">JWT Token Security with Auto HTTP Bearer Interceptors enabled.</span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Sign In</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-8">Enter your credentials to manage your account.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button type="submit" isLoading={loading} className="w-full">
              Authenticate Account
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-500 hover:underline">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}