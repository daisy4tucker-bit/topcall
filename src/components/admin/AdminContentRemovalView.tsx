import React, { useState } from 'react';
import { getRemovalRequests } from '../../services/adminService';
import { RemovalRequest } from '../../types/admin';
import { Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AdminContentRemovalView: React.FC = () => {
  const [requests, setRequests] = useState<RemovalRequest[]>(getRemovalRequests());

  const handleProcess = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'removed' as const } : r))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Content Removal & Takedown Requests</h1>
        <p className="text-xs text-slate-400">Right-to-be-forgotten, profile deactivation, and DMCA takedown requests.</p>
      </div>

      <div className="space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span className="font-bold text-white text-sm">{req.targetProfileSlug}</span>
                <span className="text-xs text-slate-500">• {req.requesterEmail}</span>
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                req.status === 'removed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {req.status}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              <strong className="text-rose-400">Request:</strong> {req.reason}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-500">Requested at {req.createdAt}</span>
              {req.status !== 'removed' && (
                <button
                  onClick={() => handleProcess(req.id)}
                  className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                >
                  Confirm Takedown & Archive
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
