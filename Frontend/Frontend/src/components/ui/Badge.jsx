import React from 'react';

export const StatusBadge = ({ status }) => {
  const normalized = (status || 'pending').toLowerCase();

  if (normalized === 'pending') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Pending
      </span>
    );
  }

  if (normalized === 'in progress') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
        In Progress
      </span>
    );
  }

  if (normalized === 'resolved') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
        Resolved
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const normalized = (priority || 'low').toLowerCase();
  const styles = {
    low: 'bg-stone-100 text-stone-600 border-stone-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    high: 'bg-orange-50 text-orange-700 border-orange-200 font-semibold',
    critical: 'bg-rose-600 text-white border-rose-700 font-bold shadow-sm',
  };
  const badgeStyle = styles[normalized] || styles.low;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider border ${badgeStyle}`}>
      {normalized === 'critical' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
      {priority}
    </span>
  );
};
