import React from 'react';

/**
 * Civic Pulse brand mark: a landmark silhouette threaded by a single
 * heartbeat line — the "pulse" of a community's civic infrastructure.
 */
export const PulseMark = ({ size = 36, tone = 'solid' }) => {
  const isSolid = tone === 'solid';
  return (
    <div
      className={`relative flex items-center justify-center rounded-xl shrink-0 ${
        isSolid ? 'bg-emerald-700' : 'bg-white/10 border border-white/15'
      }`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 36 36" width={size * 0.62} height={size * 0.62} fill="none">
        <path
          d="M2 20h5l3-9 4 16 3-11 2 4h15"
          stroke={isSolid ? '#ffffff' : '#34d399'}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="60"
          className="animate-pulse-line"
        />
      </svg>
    </div>
  );
};

export default PulseMark;
