import React from 'react';
import { X, Sliders, RefreshCw, AlertCircle, Loader, FileQuestion, CheckCircle } from 'lucide-react';

interface DesignSystemTesterProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateLoading: () => void;
  onSimulateError: () => void;
  onSimulateEmpty: () => void;
  onResetNormal: () => void;
  currentSimMode: 'normal' | 'loading' | 'error' | 'empty';
}

export const DesignSystemTester: React.FC<DesignSystemTesterProps> = ({
  isOpen,
  onClose,
  onSimulateLoading,
  onSimulateError,
  onSimulateEmpty,
  onResetNormal,
  currentSimMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 w-80 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-4 text-xs animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-rose-400 font-bold">
          <Sliders className="w-4 h-4" />
          <span>UI State Tester</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="py-3 space-y-2">
        <p className="text-[11px] text-slate-400">
          Simulate layout, loading skeletons, and edge states:
        </p>

        <button
          onClick={onResetNormal}
          className={`w-full py-2 px-3 rounded-xl flex items-center justify-between transition-colors ${
            currentSimMode === 'normal' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5" /> Normal View
          </span>
        </button>

        <button
          onClick={onSimulateLoading}
          className={`w-full py-2 px-3 rounded-xl flex items-center justify-between transition-colors ${
            currentSimMode === 'loading' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <Loader className="w-3.5 h-3.5 animate-spin" /> Loading Skeleton
          </span>
        </button>

        <button
          onClick={onSimulateEmpty}
          className={`w-full py-2 px-3 rounded-xl flex items-center justify-between transition-colors ${
            currentSimMode === 'empty' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <FileQuestion className="w-3.5 h-3.5" /> Empty State
          </span>
        </button>

        <button
          onClick={onSimulateError}
          className={`w-full py-2 px-3 rounded-xl flex items-center justify-between transition-colors ${
            currentSimMode === 'error' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5" /> Error State
          </span>
        </button>
      </div>
    </div>
  );
};
