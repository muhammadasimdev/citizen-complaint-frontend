import React from 'react';
import { useAuth } from '../context/AuthContext';
import { appConfig } from '../config/appConfig';
import { StatCard } from '../components/ui/StatCard';
import { Database, Users, ShieldAlert, Cpu, ArrowUpRight } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-900/30 via-slate-900/40 to-slate-900/40 relative overflow-hidden">
        <h1 className="text-3xl font-extrabold text-white">
          Welcome Back, <span className="text-indigo-400">{user?.name || user?.email || 'User'}</span>! 👋
        </h1>
        <p className="mt-2 text-slate-400 text-sm max-w-xl">
          System telemetry is operational. You are connected to the Express backend via authenticated JWT session.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Records" value="1,280" change="+12%" isPositive={true} icon={Database} />
        <StatCard title="Active Users" value="452" change="+8%" isPositive={true} icon={Users} />
        <StatCard title="API Latency" value="24ms" change="-4ms" isPositive={true} icon={Cpu} />
        <StatCard title="Security Score" value="99.9%" change="Optimal" isPositive={true} icon={ShieldAlert} />
      </div>

      {/* Analytics Preview Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent System Activity</h3>
          <span className="text-xs font-semibold text-indigo-500 flex items-center gap-1 cursor-pointer hover:underline">
            View Logs <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
        <div className="space-y-3">
          {[
            { action: 'Database backup synchronized', time: '10 mins ago', status: 'Success' },
            { action: 'JWT Token refreshed for user session', time: '25 mins ago', status: 'Success' },
            { action: 'Zod Validation passed on POST request', time: '1 hour ago', status: 'Success' },
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{log.action}</span>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400">{log.time}</span>
                <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">{log.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}