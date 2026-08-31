import React, { useState, useEffect, useMemo } from 'react';
import { complaintService } from '../services/complaintService';
import { aiService } from '../services/aiService';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { Download, Sparkles, X, ChevronRight, Activity, Filter, AlertTriangle, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function OfficerDashboardPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', status: '', area: '' });

  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status: 'Pending', remark: '' });

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getPublicComplaints(filters);
      setComplaints(data.data || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      setSummaryLoading(true);
      const data = await aiService.getAiOfficerSummary();
      setSummary(data.summary || data);
    } catch (err) {
      console.error(err);
      setSummary('AI briefing temporarily unavailable.');
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const metrics = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === 'Pending').length;
    const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
    const resolved = complaints.filter((c) => c.status === 'Resolved').length;
    const critical = complaints.filter((c) => (c.priority || '').toLowerCase() === 'critical').length;
    return { total, pending, inProgress, resolved, critical };
  }, [complaints]);

  const handleExport = async () => {
    try {
      const res = await complaintService.exportCsv(filters);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'complaints_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed', err);
      alert('Failed to export CSV');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    try {
      await complaintService.updateComplaintStatus(selectedComplaint._id, updateForm.status, updateForm.remark);
      setSelectedComplaint(null);
      fetchComplaints();
    } catch (err) {
      console.error(err);
      alert('Failed to update complaint status');
    }
  };

  const clearFilters = () => setFilters({ category: '', status: '', area: '' });

  return (
    <div className="max-w-7xl mx-auto pb-12 relative">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#16211c] tracking-tight">
          {getGreeting()}, {user?.username ? user.username.split(' ')[0] : 'Officer'}
        </h1>
        <p className="text-stone-500 font-medium">Here's what needs your attention today.</p>
      </div>

      {/* AI Briefing */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 bg-[#0b2318] rounded-3xl p-8 text-white relative overflow-hidden"
      >
        <svg className="absolute -top-6 -right-6 w-64 h-64 opacity-[0.08]" viewBox="0 0 200 200" fill="none">
          <path d="M0 100h30l15-45 20 80 15-55 10 20h110" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-4 text-emerald-300">
            <Sparkles className="w-4.5 h-4.5" />
            <span className="text-xs font-bold uppercase tracking-wider">AI Civic Intelligence</span>
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight mb-3">Today's situation</h2>

          <div className="text-emerald-50/90 leading-relaxed max-w-3xl text-base font-medium mb-6">
            {summaryLoading ? (
              <div className="animate-pulse space-y-3 py-1">
                <div className="h-4 bg-white/10 rounded-full w-full" />
                <div className="h-4 bg-white/10 rounded-full w-5/6" />
                <div className="h-4 bg-white/10 rounded-full w-4/6" />
              </div>
            ) : (
              <p>{typeof summary === 'string' ? summary : JSON.stringify(summary)}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-6 pt-5 border-t border-white/10">
            <BriefingStat label="Critical" value={metrics.critical} />
            <BriefingStat label="Pending" value={metrics.pending} />
            <BriefingStat label="In progress" value={metrics.inProgress} />
          </div>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <MetricCard label="Total complaints" value={metrics.total} />
        <MetricCard label="Pending" value={metrics.pending} tone="amber" />
        <MetricCard label="In progress" value={metrics.inProgress} tone="sky" />
        <MetricCard label="Resolved" value={metrics.resolved} tone="emerald" />
        <MetricCard label="Critical" value={metrics.critical} tone="rose" />
      </div>

      {/* Action bar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl border border-stone-200 mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <select
              className="pl-9 pr-8 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 appearance-none text-sm font-semibold text-[#16211c] w-full"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <select
              className="pl-9 pr-8 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 appearance-none text-sm font-semibold text-[#16211c] w-full"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All categories</option>
              <option value="Road">Road & transport</option>
              <option value="Garbage">Waste & sanitation</option>
              <option value="Water">Water supply</option>
              <option value="Electricity">Electricity & power</option>
            </select>
          </div>
          {(filters.status || filters.category || filters.area) && (
            <button onClick={clearFilters} className="text-sm font-semibold text-stone-500 hover:text-[#16211c] px-2">
              Clear filters
            </button>
          )}
        </div>

        <button onClick={handleExport} className="flex items-center gap-2 bg-[#16211c] hover:bg-[#0f1811] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors w-full md:w-auto justify-center">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Table (desktop) */}
      <div className="hidden md:block bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50 sticky top-16 z-10">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-stone-600 tracking-wider text-xs uppercase">Priority</th>
                <th className="px-6 py-4 text-left font-bold text-stone-600 tracking-wider text-xs uppercase">Issue</th>
                <th className="px-6 py-4 text-left font-bold text-stone-600 tracking-wider text-xs uppercase">Area & category</th>
                <th className="px-6 py-4 text-left font-bold text-stone-600 tracking-wider text-xs uppercase">Status</th>
                <th className="px-6 py-4 text-left font-bold text-stone-600 tracking-wider text-xs uppercase">Upvotes</th>
                <th className="px-6 py-4 text-right font-bold text-stone-600 tracking-wider text-xs uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-stone-500 font-medium">
                    Loading operational data…
                  </td>
                </tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c._id} className="hover:bg-stone-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#16211c] mb-0.5 line-clamp-1">{c.title}</div>
                      <div className="text-xs text-stone-400 font-mono">{c._id.slice(-8).toUpperCase()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-stone-700 mb-0.5">{c.area}</div>
                      <div className="text-xs text-stone-500">{c.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-bold text-stone-700">
                        <span className="text-emerald-700">▲</span> {c.upvotes || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => {
                          setSelectedComplaint(c);
                          setUpdateForm({ status: c.status, remark: c.officerRemark || '' });
                        }}
                        className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Manage <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {complaints.length === 0 && !loading && <div className="text-center py-12 text-stone-500 font-medium bg-stone-50">No tickets matching filters.</div>}
      </div>

      {/* Cards (mobile) */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="text-center py-12 text-stone-500 font-medium bg-white rounded-2xl border border-stone-200">Loading operational data…</div>
        ) : (
          complaints.map((c) => (
            <div key={c._id} className="bg-white p-5 rounded-2xl border border-stone-200">
              <div className="flex justify-between items-start mb-3">
                <StatusBadge status={c.status} />
                <PriorityBadge priority={c.priority} />
              </div>
              <h3 className="font-bold text-[#16211c] mb-1">{c.title}</h3>
              <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mb-3">
                <MapPin className="w-3 h-3" /> {c.area} · {c.category}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <div className="flex items-center gap-1 font-bold text-stone-700 text-sm">
                  <span className="text-emerald-700">▲</span> {c.upvotes || 0}
                </div>
                <button
                  onClick={() => {
                    setSelectedComplaint(c);
                    setUpdateForm({ status: c.status, remark: c.officerRemark || '' });
                  }}
                  className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg text-sm"
                >
                  Manage <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
        {complaints.length === 0 && !loading && (
          <div className="text-center py-12 text-stone-500 font-medium bg-white rounded-2xl border border-stone-200">No tickets matching filters.</div>
        )}
      </div>

      {/* Slide-over: update status */}
      <AnimatePresence>
        {selectedComplaint && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedComplaint(null)}
              className="fixed inset-0 bg-[#0b2318]/50 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-stone-200"
            >
              <div className="flex justify-between items-center p-6 border-b border-stone-100 bg-stone-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-xl text-[#16211c] tracking-tight">Update ticket</h3>
                </div>
                <button onClick={() => setSelectedComplaint(null)} className="p-2 text-stone-400 hover:text-[#16211c] hover:bg-stone-200 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                <div className="mb-6 p-5 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="flex gap-2 mb-3">
                    <StatusBadge status={selectedComplaint.status} />
                    <PriorityBadge priority={selectedComplaint.priority} />
                  </div>
                  <h4 className="font-bold text-lg text-[#16211c] mb-2">{selectedComplaint.title}</h4>
                  <p className="text-sm text-stone-600 leading-relaxed mb-4">{selectedComplaint.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm bg-white p-3 rounded-xl border border-stone-100">
                    <div>
                      <div className="text-stone-400 text-xs font-bold uppercase mb-1">Area</div>
                      <div className="font-medium text-stone-700">{selectedComplaint.area}</div>
                    </div>
                    <div>
                      <div className="text-stone-400 text-xs font-bold uppercase mb-1">Citizen</div>
                      <div className="font-medium text-stone-700">{selectedComplaint.createdBy?.username || 'Unknown'}</div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleUpdate} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-[#16211c] mb-2">New status</label>
                    <div className="space-y-2">
                      {['Pending', 'In Progress', 'Resolved'].map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                            updateForm.status === opt ? 'border-emerald-600 bg-emerald-50/60' : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="status"
                            value={opt}
                            checked={updateForm.status === opt}
                            onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                            className="text-emerald-700 focus:ring-emerald-600/30"
                          />
                          <span className="font-medium text-[#16211c] text-sm">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#16211c] mb-2">Official remarks</label>
                    <textarea
                      rows={4}
                      required
                      value={updateForm.remark}
                      onChange={(e) => setUpdateForm({ ...updateForm, remark: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 font-medium resize-none"
                      placeholder="e.g. Maintenance unit deployed to site. Expected repair by 14:00."
                    />
                  </div>

                  <div className="pt-4 border-t border-stone-100 mt-8">
                    <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl transition-colors flex justify-center items-center gap-2">
                      Update status <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function BriefingStat({ label, value }) {
  return (
    <div>
      <div className="text-2xl font-black text-white leading-none">{value}</div>
      <div className="text-xs font-medium text-emerald-100/50 mt-1">{label}</div>
    </div>
  );
}

function MetricCard({ label, value, tone = 'ink' }) {
  const tones = {
    ink: 'bg-white border-stone-200 text-[#16211c]',
    amber: 'bg-amber-50 border-amber-100 text-amber-700',
    sky: 'bg-sky-50 border-sky-100 text-sky-700',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    rose: 'bg-rose-50 border-rose-100 text-rose-700',
  };
  return (
    <div className={`p-4 rounded-2xl border ${tones[tone]}`}>
      <div className="text-2xl font-black mb-1">{value}</div>
      <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">{label}</div>
    </div>
  );
}
