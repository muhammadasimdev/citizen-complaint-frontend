import React, { useState, useEffect } from 'react';
import { complaintService } from '../services/complaintService';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import { Search, Filter, MapPin, Clock, FileText, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicFeedPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '', status: '', area: '' });

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

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleUpvote = async (id) => {
    try {
      setComplaints((prev) => prev.map((c) => (c._id === id ? { ...c, upvotes: (c.upvotes || 0) + 1, _justUpvoted: true } : c)));
      await complaintService.upvoteComplaint(id);
      setTimeout(() => {
        setComplaints((prev) => prev.map((c) => (c._id === id ? { ...c, _justUpvoted: false } : c)));
      }, 900);
    } catch (err) {
      console.error('Upvote failed', err);
      fetchComplaints();
    }
  };

  const calculateDaysAgo = (dateStr) => {
    const diff = new Date() - new Date(dateStr);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-stone-200 pb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#16211c] tracking-tight mb-2">Make your community better</h1>
          <p className="text-stone-500 font-medium">Report issues. Track progress. Create change.</p>
        </div>

        <div className="flex gap-3">
          <div className="bg-white p-3 rounded-xl border border-stone-200 text-center min-w-[92px]">
            <div className="text-2xl font-black text-[#16211c]">{complaints.length}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Active issues</div>
          </div>
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-center min-w-[92px]">
            <div className="text-2xl font-black text-emerald-700">{complaints.filter((c) => c.status === 'Resolved').length}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Resolved</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 mb-8 flex flex-col md:flex-row gap-3 items-center">
        <div className="relative w-full md:flex-1">
          <Search className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search issues, areas, or keywords..."
            className="w-full pl-11 pr-4 py-2.5 bg-stone-50 border border-transparent focus:border-emerald-600 focus:bg-white rounded-xl outline-none focus:ring-4 focus:ring-emerald-600/10 transition-all text-sm font-medium"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
          <div className="relative shrink-0">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <select
              className="pl-9 pr-8 py-2.5 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 appearance-none text-sm font-medium hover:border-stone-300 transition-colors"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All categories</option>
              <option value="Road">Road & transport</option>
              <option value="Garbage">Waste & sanitation</option>
              <option value="Water">Water supply</option>
              <option value="Electricity">Electricity & power</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="relative shrink-0">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <select
              className="pl-9 pr-8 py-2.5 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 appearance-none text-sm font-medium hover:border-stone-300 transition-colors"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feed grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-stone-200 animate-pulse h-64">
              <div className="h-6 bg-stone-100 rounded-full w-1/3 mb-4" />
              <div className="h-4 bg-stone-100 rounded w-3/4 mb-2" />
              <div className="h-4 bg-stone-100 rounded w-1/2 mb-6" />
              <div className="h-20 bg-stone-50 rounded-xl mb-4" />
              <div className="h-8 bg-stone-100 rounded-lg w-1/4" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {complaints.map((c) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                key={c._id}
                className="bg-white p-6 rounded-2xl border border-stone-200 hover:border-emerald-200 hover:shadow-sm transition-all flex flex-col h-full group"
              >
                <div className="flex justify-between items-start mb-4">
                  <StatusBadge status={c.status} />
                  <PriorityBadge priority={c.priority} />
                </div>

                <h3 className="text-lg font-bold text-[#16211c] mb-2 leading-snug group-hover:text-emerald-800 transition-colors line-clamp-2">{c.title}</h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-xs font-medium text-stone-500">
                  <span className="flex items-center gap-1 bg-stone-100 px-2 py-1 rounded-md">
                    <FileText className="w-3 h-3" /> {c.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {c.area}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {calculateDaysAgo(c.createdAt)}
                  </span>
                </div>

                <p className="text-sm text-stone-600 mb-6 flex-1 line-clamp-3 leading-relaxed">{c.description}</p>

                <div className="flex justify-between items-center pt-4 border-t border-stone-100 mt-auto">
                  <div className="text-xs font-medium text-stone-400">
                    By <span className="text-stone-700">{c.createdBy?.username || 'Citizen'}</span>
                  </div>
                  <button
                    onClick={() => handleUpvote(c._id)}
                    className={`flex items-center gap-1.5 text-sm font-bold transition-all px-4 py-2 rounded-xl border relative overflow-hidden ${
                      c._justUpvoted ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white hover:bg-stone-50 text-[#16211c] border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {c._justUpvoted && (
                      <motion.span initial={{ y: 16, opacity: 0 }} animate={{ y: -32, opacity: 1 }} className="absolute text-white pointer-events-none">
                        +1
                      </motion.span>
                    )}
                    <ChevronUp className={`w-4 h-4 ${c._justUpvoted ? 'text-white' : 'text-emerald-700'}`} strokeWidth={3} />
                    Upvote
                    <span className="ml-1 opacity-70 font-semibold text-xs py-0.5 px-1.5 bg-black/10 rounded-md">{c.upvotes || 0}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {complaints.length === 0 && (
            <div className="col-span-full text-center py-20 px-6 bg-stone-50 border border-stone-200 border-dashed rounded-3xl">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-200">
                <Search className="w-6 h-6 text-stone-400" />
              </div>
              <h3 className="text-lg font-bold text-[#16211c] mb-1">No issues found</h3>
              <p className="text-stone-500 text-sm max-w-sm mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
