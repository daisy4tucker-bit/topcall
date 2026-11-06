import React from 'react';
import { Lock, ShieldCheck, Database, CheckCircle2 } from 'lucide-react';

export const AdminRLSPoliciesView: React.FC = () => {
  const policies = [
    {
      table: 'public.profiles',
      policy: 'Public Read Access for Published Profiles',
      rule: "status = 'published' OR auth.role() = 'admin'",
      status: 'Active',
    },
    {
      table: 'public.profiles',
      policy: 'Admin Full Mutation Access',
      rule: "auth.role() = 'service_role' OR auth.uid() IN (SELECT id FROM admin_users)",
      status: 'Active',
    },
    {
      table: 'public.audit_logs',
      policy: 'Append Only by Server Role',
      rule: "auth.role() = 'service_role'",
      status: 'Enforced',
    },
    {
      table: 'public.safety_reports',
      policy: 'Public Anonymous Submission & Restricted Read',
      rule: "auth.role() = 'admin' FOR SELECT; true FOR INSERT",
      status: 'Active',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Row Level Security (RLS) Policies</h1>
        <p className="text-xs text-slate-400">PostgreSQL database role constraints and zero-trust permissions schema.</p>
      </div>

      <div className="space-y-4">
        {policies.map((p, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-amber-400 font-bold">{p.table}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {p.status}
              </span>
            </div>
            <h4 className="font-bold text-white text-sm">{p.policy}</h4>
            <pre className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-300 border border-slate-800 overflow-x-auto">
              {p.rule}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};
