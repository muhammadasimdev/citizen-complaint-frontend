import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, ShieldCheck, Calendar } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Profile</h1>

      <div className="glass-panel rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl">
            {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name || 'Account Holder'}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
            <span className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Authenticated via JWT
            </span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold">User Unique ID</span>
            <p className="text-sm font-mono font-medium text-slate-800 dark:text-slate-200 mt-1">{user?._id || 'N/A'}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold">Role Level</span>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1">System Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}