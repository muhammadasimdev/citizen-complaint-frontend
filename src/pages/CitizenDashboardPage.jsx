import React, { useState, useEffect } from 'react';
import { complaintService } from '../services/complaintService';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Star, Send, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CitizenDashboardPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });

  const fetchMyComplaints = async () => {
    try {
      const data = await complaintService.getMyComplaints();
      const docs = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
      setComplaints(docs);

      setStats({
        total: docs.length,
        pending: docs.filter((d) => d.status === 'Pending').length,
        inProgress: docs.filter((d) => d.status === 'In Progress').length,
        resolved: docs.filter((d) => d.status === 'Resolved').length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const handleFeedback = async (id, rating, comment) => {
    try {
      await complaintService.submitFeedback(id, { rating, comment });
      fetchMyComplaints();
    } catch (err) {
      console.error('Feedback failed', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#16211c] tracking-tight mb-2">Welcome back, {user?.username || 'citizen'}</h1>
        <p className="text-stone-500 font-medium">Track your submitted issues and provide feedback on resolutions.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <MetricTile value={stats.total} label="Total reports" tone="ink" />
        <MetricTile value={stats.pending} label="Pending" tone="amber" />
        <MetricTile value={stats.inProgress} label="In progress" tone="sky" />
        <MetricTile value={stats.resolved} label="Resolved" tone="emerald" />
      </div>

      <h2 className="text-lg font-bold text-[#16211c] mb-4">My complaints</h2>

      {loading ? (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-stone-200 animate-pulse h-48" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {complaints.map((c) => (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              key={c._id}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 flex flex-col lg:flex-row gap-8 overflow-hidden relative group"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-stone-200 group-hover:bg-emerald-600 transition-colors" />

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <StatusBadge status={c.status} />
                  <PriorityBadge priority={c.priority} />
                  <span className="text-xs font-semibold text-stone-400 bg-stone-100 px-2 py-1 rounded-md">ID: {c._id.slice(-6).toUpperCase()}</span>
                </div>

                <h3 className="text-2xl font-bold text-[#16211c] mb-2 leading-tight">{c.title}</h3>

                <div className="flex items-center gap-2 text-sm text-stone-500 font-medium mb-4">
                  <span className="text-stone-700">{c.category}</span>
                  <span className="w-1 h-1 rounded-full bg-stone-300" />
                  <span>{c.area}</span>
                  <span className="w-1 h-1 rounded-full bg-stone-300" />
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-100">{c.description}</p>

                {c.officerRemark && (
                  <div className="mt-4 p-5 bg-emerald-50/60 border border-emerald-100 rounded-xl relative">
                    <ShieldCheck className="absolute top-5 right-5 w-6 h-6 text-emerald-200" />
                    <h4 className="text-sm font-bold text-emerald-900 mb-1">Official response</h4>
                    <p className="text-emerald-800 text-sm">{c.officerRemark}</p>
                  </div>
                )}
              </div>

              {/* Feedback / status column */}
              <div className="w-full lg:w-72 shrink-0 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-stone-100 pt-6 lg:pt-0 lg:pl-8">
                {c.status === 'Resolved' && !c.feedbackGiven && (
                  <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-50/70 border border-emerald-100 p-5 rounded-2xl">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold mb-3">
                      <Star className="w-4.5 h-4.5 fill-emerald-600 text-emerald-600" /> How was this resolved?
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.target);
                        handleFeedback(c._id, Number(fd.get('rating')), fd.get('comment'));
                      }}
                    >
                      <div className="flex justify-between mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <label key={star} className="cursor-pointer relative">
                            <input type="radio" name="rating" value={star} className="peer sr-only" required />
                            <Star className="w-7 h-7 text-stone-300 peer-checked:text-amber-500 peer-checked:fill-amber-500 hover:text-amber-400 hover:scale-110 transition-all peer-checked:scale-110" />
                          </label>
                        ))}
                      </div>
                      <textarea
                        name="comment"
                        placeholder="Optional comment..."
                        rows={2}
                        className="w-full text-sm p-3 bg-white border border-emerald-200 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-emerald-600 resize-none font-medium"
                      />
                      <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                        Submit feedback <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </motion.div>
                )}

                {c.status === 'Resolved' && c.feedbackGiven && (
                  <div className="text-center p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col items-center justify-center h-full">
                    <CheckCircle2 className="w-11 h-11 text-emerald-600 mb-2" />
                    <h4 className="font-bold text-emerald-900 mb-1">Feedback received</h4>
                    <p className="text-xs font-medium text-emerald-700">Thank you for helping us improve.</p>
                  </div>
                )}

                {c.status !== 'Resolved' && (
                  <div className="text-center p-6 bg-stone-50 rounded-2xl border border-stone-200 border-dashed flex flex-col items-center justify-center h-full text-stone-400">
                    <Clock className="w-7 h-7 mb-2 opacity-60" />
                    <p className="text-sm font-medium">Feedback unlocks once this issue is resolved.</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {complaints.length === 0 && (
            <div className="text-center py-20 px-6 bg-stone-50 border border-stone-200 border-dashed rounded-3xl">
              <MessageSquare className="w-11 h-11 text-stone-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#16211c] mb-1">No reports filed yet</h3>
              <p className="text-stone-500 text-sm">When you report an issue, it will appear here for you to track.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MetricTile({ value, label, tone }) {
  const tones = {
    ink: 'bg-white border-stone-200 text-[#16211c]',
    amber: 'bg-amber-50 border-amber-100 text-amber-700',
    sky: 'bg-sky-50 border-sky-100 text-sky-700',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
  };
  return (
    <div className={`p-4 rounded-2xl border text-center ${tones[tone]}`}>
      <div className="text-2xl sm:text-3xl font-black mb-1">{value}</div>
      <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-80">{label}</div>
    </div>
  );
}
