import React from 'react';
import { X, BookOpen, Layers, MapPin, Shield } from 'lucide-react';

interface ArchitectureGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureGuide: React.FC<ArchitectureGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-bold text-white">System Architecture & Directory Guide</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-400" /> Location Hierarchy
            </h4>
            <p className="text-slate-400">
              Clean slug routing: <code>/:countrySlug/:stateSlug/:citySlug/</code> matching standard SERP guidelines for metropolitan hubs.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-sky-400" /> Verification & Moderation
            </h4>
            <p className="text-slate-400">
              Multi-step profile onboarding with government ID checking, contact channel verification, and admin moderation portal.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" /> Schema & SERP Grounding
            </h4>
            <p className="text-slate-400">
              Dynamic JSON-LD Schema.org metadata generation for both location pages and individual profile entities for search discovery.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
        >
          Close Guide
        </button>
      </div>
    </div>
  );
};
