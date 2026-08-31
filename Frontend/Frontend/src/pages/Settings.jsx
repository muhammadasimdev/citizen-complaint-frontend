import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Shield, Bell } from 'lucide-react';

export default function Settings() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Settings</h1>

      <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Appearance Mode</h3>
            <p className="text-sm text-slate-500">Switch between dark and light themes.</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold flex items-center gap-2 border border-slate-200 dark:border-slate-700"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </div>
    </div>
  );
}