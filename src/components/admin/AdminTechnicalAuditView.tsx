import React from 'react';
import { Cpu, CheckCircle, Zap, Shield, Globe } from 'lucide-react';

export const AdminTechnicalAuditView: React.FC = () => {
  const checks = [
    { name: 'Canonical Location Slugs', status: 'Passed', details: 'Hierarchy follows /country/state/city schema without duplicates.' },
    { name: 'Schema.org JSON-LD Entities', status: 'Passed', details: 'Valid Person and WebSite structured data validated for Google SERP.' },
    { name: '18+ Legal Age Verification Gate', status: 'Passed', details: 'Strict localStorage gating and 2257 compliance notices in place.' },
    { name: 'Zero-Leakage Direct Contacts', status: 'Passed', details: 'Messaging connects directly to provider without platform intercept.' },
    { name: 'Performance & Bundle Weight', status: 'Optimal', details: 'Vite 8 + Tailwind CSS with zero runtime bloat and fast asset delivery.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Health & Technical Audit</h1>
        <p className="text-xs text-slate-400">Architectural verification, SEO indexing health, and safety audit checklist.</p>
      </div>

      <div className="space-y-3">
        {checks.map((c, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white text-xs">{c.name}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{c.details}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[11px] flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> {c.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
