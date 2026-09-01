import React from 'react';

export const Input = ({ label, error, icon: Icon, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-sm font-semibold text-[#16211c]">{label}</label>}
      <div className="relative rounded-xl">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          className={`w-full rounded-xl bg-stone-50 border ${
            error ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' : 'border-stone-200 focus:border-emerald-600 focus:ring-emerald-600/15'
          } ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 text-sm text-[#16211c] placeholder-stone-400 focus:outline-none focus:ring-4 focus:bg-white transition-all duration-150 ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
};
