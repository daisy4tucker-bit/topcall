import React from 'react';
import { ExtendedProfile } from '../../types/admin';
import { Image, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { handleImageError, FALLBACK_PROFILE_IMAGES } from '../../utils/imageUtils';

interface AdminPhotosViewProps {
  profiles: ExtendedProfile[];
  onNavigatePublic: (path: string) => void;
  onRefreshProfiles: () => void;
}

export const AdminPhotosView: React.FC<AdminPhotosViewProps> = ({
  profiles,
  onNavigatePublic,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Photo & Media Verification Audit</h1>
        <p className="text-xs text-slate-400">Review all uploaded profile photography and avatar assets for 18+ policy compliance.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {profiles.map((p) => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-3 space-y-2">
            <div className="aspect-square rounded-xl overflow-hidden bg-slate-950 relative">
              <img
                src={p.avatarUrl}
                alt={p.displayName}
                referrerPolicy="no-referrer"
                onError={(e) => handleImageError(e, FALLBACK_PROFILE_IMAGES[p.id] || FALLBACK_PROFILE_IMAGES.default)}
                className="w-full h-full object-cover"
              />
              {p.isVerified && (
                <span className="absolute top-2 right-2 p-1 rounded-full bg-emerald-500 text-white">
                  <CheckCircle className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white truncate">{p.displayName}</span>
              <button
                onClick={() => onNavigatePublic(`/profiles/${p.slug}`)}
                className="text-slate-400 hover:text-white"
                title="View Profile"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400">{p.city}, {p.state}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
