import React, { useState, useEffect } from 'react';
import { complaintService } from '../services/complaintService';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronUp, MapPin, Tag, Type, AlignLeft, Send } from 'lucide-react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const MAX_DESCRIPTION = 500;

export default function SubmitComplaintPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', category: 'Road', area: '', description: '' });
  const [similarComplaints, setSimilarComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedCategory = useDebounce(formData.category, 500);
  const debouncedArea = useDebounce(formData.area, 500);

  useEffect(() => {
    if (debouncedArea.length > 2) {
      complaintService
        .getPublicComplaints({ category: debouncedCategory, area: debouncedArea, status: 'Pending' })
        .then((res) => {
          const docs = res.data || res;
          setSimilarComplaints(docs.slice(0, 3));
        })
        .catch(console.error);
    } else {
      setSimilarComplaints([]);
    }
  }, [debouncedCategory, debouncedArea]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await complaintService.createComplaint(formData);
      navigate('/my-complaints');
    } catch (err) {
      console.error(err);
      alert('Failed to submit complaint');
      setLoading(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await complaintService.upvoteComplaint(id);
      navigate('/browse');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-[#16211c] tracking-tight mb-2">Report a community issue</h1>
        <p className="text-stone-500 font-medium">Help your community identify and solve problems faster.</p>
      </div>

      <AnimatePresence>
        {similarComplaints.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0, y: -20 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0 }} className="mb-8">
            <div className="p-6 bg-[#0b2318] rounded-2xl relative overflow-hidden text-white">
              <div className="relative z-10">
                <div className="flex items-center gap-3 font-bold mb-2 text-base">
                  <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-300">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  Similar issue detected
                </div>
                <p className="text-emerald-100/70 text-sm font-medium mb-5">
                  We found reports matching this area and category. Upvoting an existing ticket raises its priority faster than filing a duplicate.
                </p>

                <div className="space-y-3">
                  {similarComplaints.map((c) => (
                    <div key={c._id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/[0.06] p-4 rounded-xl border border-white/10 gap-3">
                      <div>
                        <span className="font-bold block line-clamp-1">{c.title}</span>
                        <span className="text-xs font-medium text-emerald-100/50 uppercase tracking-wider">{c.status}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUpvote(c._id)}
                        className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-sm font-bold rounded-lg transition-colors shrink-0"
                      >
                        <ChevronUp className="w-4 h-4" /> View & upvote ({c.upvotes})
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 relative">
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#16211c] mb-2">
              <Type className="w-4 h-4 text-stone-400" /> Issue title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-600 focus:bg-white rounded-xl outline-none focus:ring-4 focus:ring-emerald-600/10 transition-all font-medium text-[#16211c]"
              placeholder="e.g. Broken street light at Main intersection"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#16211c] mb-2">
                <Tag className="w-4 h-4 text-stone-400" /> Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-600 focus:bg-white rounded-xl outline-none focus:ring-4 focus:ring-emerald-600/10 transition-all font-medium text-[#16211c] appearance-none"
              >
                <option value="Road">Road & transport</option>
                <option value="Garbage">Waste & sanitation</option>
                <option value="Water">Water supply</option>
                <option value="Electricity">Electricity & power</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#16211c] mb-2">
                <MapPin className="w-4 h-4 text-stone-400" /> Area / locality
              </label>
              <input
                type="text"
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-600 focus:bg-white rounded-xl outline-none focus:ring-4 focus:ring-emerald-600/10 transition-all font-medium text-[#16211c]"
                placeholder="e.g. Downtown Sector 4"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#16211c]">
                <AlignLeft className="w-4 h-4 text-stone-400" /> Detailed description
              </label>
              <span className="text-xs font-medium text-stone-400">
                {formData.description.length}/{MAX_DESCRIPTION}
              </span>
            </div>
            <textarea
              required
              rows={5}
              maxLength={MAX_DESCRIPTION}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-600 focus:bg-white rounded-xl outline-none focus:ring-4 focus:ring-emerald-600/10 transition-all font-medium text-[#16211c] resize-y"
              placeholder="Provide specific details about the issue and exact location..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center gap-2 group mt-4 shadow-sm"
          >
            {loading ? 'Submitting…' : 'Submit report'}
            {!loading && <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
          </button>
        </form>
      </div>
    </div>
  );
}
