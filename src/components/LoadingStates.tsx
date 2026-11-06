import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Loading directory profiles...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-400">
      <Loader2 className="w-8 h-8 text-rose-500 animate-spin mb-3" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
};

export const SkeletonProfileGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="aspect-[4/3] bg-slate-800" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-slate-800 rounded w-2/3" />
            <div className="h-3 bg-slate-800 rounded w-1/2" />
            <div className="h-8 bg-slate-800 rounded w-full mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
};
