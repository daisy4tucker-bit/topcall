import React from 'react';
import { ShieldCheck, Lock, AlertCircle } from 'lucide-react';

export const SafetyBanner: React.FC = () => {
  return (
    <div className="bg-slate-900 border-b border-slate-800 py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Strict identity verification enforced on all advertised companions.</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-slate-500">
          <Lock className="w-3.5 h-3.5" />
          <span>Confidential & End-to-End Direct Contact</span>
        </div>
      </div>
    </div>
  );
};
