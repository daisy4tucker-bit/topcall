import React, { useState } from 'react';
import { getSafetyReports } from '../../services/adminService';
import { SafetyReport } from '../../types/admin';
import { AlertOctagon, CheckCircle, XCircle } from 'lucide-react';

interface AdminReportsViewProps {
  onNavigatePublic: (path: string) => void;
}

export const AdminReportsView: React.FC<AdminReportsViewProps> = ({ onNavigatePublic }) => {
  const [reports, setReports] = useState<SafetyReport[]>(getSafetyReports());

  const handleAction = (id: string, newStatus: SafetyReport['status']) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Safety & Community Reports</h1>
        <p className="text-xs text-slate-400">User-submitted inquiries, suspicious listing flags, and safety escalations.</p>
      </div>

      <div className="space-y-4">
        {reports.map((rep) => (
          <div key={rep.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-500" />
                <span className="font-bold text-white text-sm">{rep.profileName}</span>
                <span className="text-xs text-slate-500">• Reported by {rep.reporterEmail}</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                {rep.status}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              <strong className="text-rose-400">Reason:</strong> {rep.reason} — {rep.details}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-500">{rep.createdAt}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAction(rep.id, 'dismissed')}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => handleAction(rep.id, 'action_taken')}
                  className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                >
                  Mark Action Taken
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
