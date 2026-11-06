import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStatesProps {
  type?: string;
  title?: string;
  description?: string;
  onReset?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyStates: React.FC<EmptyStatesProps> = ({
  title = 'No Listings Found',
  description = 'No companion listings match your current filters. Try expanding your search radius or changing criteria.',
  onReset,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 p-8 my-6">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">{description}</p>
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-semibold shadow-md shadow-rose-950/40"
        >
          {actionLabel}
        </button>
      )}
      {onReset && !onAction && (
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};
