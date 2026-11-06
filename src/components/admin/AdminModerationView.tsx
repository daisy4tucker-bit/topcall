import React from 'react';
import { ExtendedProfile } from '../../types/admin';
import { ShieldCheck, Check, X, AlertTriangle } from 'lucide-react';
import { updateProfileStatus } from '../../services/adminService';
import { GoldVerifiedBadge } from '../ui/GoldVerifiedBadge';

interface AdminModerationViewProps {
  profiles: ExtendedProfile[];
  onRefresh: () => void;
  onNavigatePublic: (path: string) => void;
}

export const AdminModerationView: React.FC<AdminModerationViewProps> = ({
  profiles,
  onRefresh,
}) => {
  const pendingProfiles = profiles.filter((p) => p.status === 'pending' || !p.isVerified);

  const handleApprove = (id: string) => {
    updateProfileStatus(id, 'published');
    onRefresh();
  };

  const handleReject = (id: string) => {
    updateProfileStatus(id, 'rejected');
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Profile Moderation Queue</h1>
        <p className="text-xs text-slate-400">Review pending companion applications and ID verification requests.</p>
      </div>

      {pendingProfiles.length === 0 ? (
        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
          <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
          <h3 className="font-bold text-white text-sm mb-1">Queue Clean</h3>
          <p className="text-xs text-slate-400">All submitted companion listings have been moderated.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingProfiles.map((p) => (
            <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={p.avatarUrl} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                <div>
                  <h5 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <span>{p.displayName} ({p.age})</span>
                    {p.isVerified && <GoldVerifiedBadge size="xs" />}
                  </h5>
                  <p className="text-xs text-rose-400">{p.city}, {p.state} • {p.startingRate}</p>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{p.bioSnippet}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleReject(p.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" /> Reject
                </button>
                <button
                  onClick={() => handleApprove(p.id)}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-900/30"
                >
                  <Check className="w-3.5 h-3.5" /> Approve & Publish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
