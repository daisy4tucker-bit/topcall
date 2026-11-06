import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStatesProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorStates: React.FC<ErrorStatesProps> = ({
  message = 'An unexpected error occurred while fetching listings.',
  onRetry,
}) => {
  return (
    <div className="text-center py-16 bg-rose-950/20 rounded-3xl border border-rose-900/30 p-8 my-6">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Unable to Load Listings</h3>
      <p className="text-xs text-rose-200/80 max-w-md mx-auto mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold inline-flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      )}
    </div>
  );
};
