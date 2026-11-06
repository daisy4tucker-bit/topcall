import React, { useState } from 'react';
import { getAuditLogs } from '../../services/adminService';
import { AuditLog } from '../../types/admin';
import { FileText, Shield, Clock } from 'lucide-react';

export const AdminAuditLogsView: React.FC = () => {
  const [logs] = useState<AuditLog[]>(getAuditLogs());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Audit & Compliance Trail</h1>
        <p className="text-xs text-slate-400">Immutable ledger of administrative actions, status transitions, and ID reviews.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Action</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Target</th>
                <th className="p-4">Details</th>
                <th className="p-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-bold text-white">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-rose-300 border border-slate-700/60">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{log.actor}</td>
                  <td className="p-4 text-slate-400">{log.entityType} ({log.entityId || 'n/a'})</td>
                  <td className="p-4 text-slate-300">{log.details}</td>
                  <td className="p-4 text-right text-slate-500 font-mono text-[11px]">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
