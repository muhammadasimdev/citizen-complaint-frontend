import React from 'react';
import { useNavigate } from 'react-router-dom';
import { appConfig } from '../config/appConfig';
import { Button } from '../components/ui/Button';
import { Zap, Shield, BarChart3, Rocket, Layers, RefreshCw, ArrowRight, CheckCircle } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    { icon: Zap, title: 'Ultra Fast Architecture', desc: 'Vite powered dynamic frontend coupled with express middleware optimization.' },
    { icon: Shield, title: 'JWT Auth Built-in', desc: 'Secure token authentication with stateless HTTP authorization headers.' },
    { icon: BarChart3, title: 'Analytics Engine', desc: 'Real-time performance metrics and statistical visualization ready out of box.' },
    { icon: Rocket, title: 'Modular Design', desc: 'Separated controllers, UI components, context layers, and clean services.' },
    { icon: Layers, title: 'Universal Generic CRUD', desc: 'Easily adapt resource schema for e-commerce, CRM, or inventory management.' },
    { icon: RefreshCw, title: 'Seamless Sync', desc: 'Instant UI updates with responsive error recovery and toast indicators.' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/0 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 text-xs font-semibold mb-8">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
          Production-Ready Architecture Starter
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-none">
          Turn Your Express Backend Into An <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Extraordinary SaaS</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {appConfig.appName} is a hyper-modular React starter configured with dark mode, full JWT token handling, dynamic CRUD interfaces, and polished UI components.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button onClick={() => navigate('/register')} size="lg">
            Launch Platform <ArrowRight className="w-4 h-4" />
          </Button>
          <Button onClick={() => navigate('/login')} variant="outline" size="lg">
            View Live Demo
          </Button>
        </div>

        {/* Dashboard Live Mock Visual */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          <div className="glass-panel p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-800">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs text-slate-400 font-mono ml-2">https://{appConfig.appName.toLowerCase()}.app/dashboard</span>
            </div>
            <div className="bg-slate-950 rounded-xl p-6 text-left grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">Active Sessions</span>
                <p className="text-2xl font-bold text-white mt-1">12,480</p>
              </div>
              <div className="glass-card p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">API Throughput</span>
                <p className="text-2xl font-bold text-emerald-400 mt-1">99.98%</p>
              </div>
              <div className="glass-card p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">Response Time</span>
                <p className="text-2xl font-bold text-indigo-400 mt-1">18ms</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Engineered for Hackathons & Enterprise Projects</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="glass-card p-6 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}