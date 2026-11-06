import React, { useState, useMemo } from 'react';
import {
  Search,
  PlusCircle,
  ShieldCheck,
  MapPin,
  Star,
  ExternalLink,
  Edit3,
  Trash2,
  Ban,
  CheckCircle2,
  FileEdit,
  Eye,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import { ExtendedProfile, ProfileStatus } from '../../types/admin';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { POPULAR_CITIES } from '../../data/mockProfiles';
import { handleImageError, FALLBACK_PROFILE_IMAGES } from '../../utils/imageUtils';

interface AdminProfilesViewProps {
  profiles: ExtendedProfile[];
  onEditProfile: (profile: ExtendedProfile) => void;
  onNewProfile: () => void;
  onUpdateStatus: (id: string, status: ProfileStatus) => void;
  onDeleteProfile: (id: string) => void;
  onNavigatePublic: (path: string) => void;
}

export const AdminProfilesView: React.FC<AdminProfilesViewProps> = ({
  profiles,
  onEditProfile,
  onNewProfile,
  onUpdateStatus,
  onDeleteProfile,
  onNavigatePublic,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProfileStatus>('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'status' | 'age'>('name');

  const filteredProfiles = useMemo(() => {
    return profiles
      .filter((p) => {
        if (statusFilter !== 'all' && p.status !== statusFilter) return false;
        if (cityFilter !== 'all' && p.city !== cityFilter) return false;
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchName = p.displayName.toLowerCase().includes(q);
          const matchSlug = p.slug.toLowerCase().includes(q);
          const matchCity = p.city.toLowerCase().includes(q);
          const matchBio = p.bioSnippet.toLowerCase().includes(q);
          if (!matchName && !matchSlug && !matchCity && !matchBio) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'status') return a.status.localeCompare(b.status);
        if (sortBy === 'age') return a.age - b.age;
        return a.displayName.localeCompare(b.displayName);
      });
  }, [profiles, searchQuery, statusFilter, cityFilter, sortBy]);

  const getStatusBadge = (status: ProfileStatus) => {
    switch (status) {
      case 'published':
        return <Badge variant="success" size="sm">Published</Badge>;
      case 'draft':
        return <Badge variant="default" size="sm">Draft</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm">Pending Review</Badge>;
      case 'suspended':
        return <Badge variant="danger" size="sm">Suspended</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Profile Management
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Create, moderate, publish, suspend, and configure directory profile records.
          </p>
        </div>
        <Button
          variant="gradient"
          size="md"
          onClick={onNewProfile}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Create New Profile
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-xl space-y-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {(['all', 'published', 'draft', 'pending', 'suspended'] as const).map((st) => {
            const isSelected = statusFilter === st;
            const count = st === 'all' ? profiles.length : profiles.filter((p) => p.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, slug, or keywords..."
              className="w-full bg-zinc-950 border border-zinc-800 text-xs rounded-xl pl-9 pr-3 py-2.5 text-zinc-100 placeholder-zinc-500 focus:border-rose-500 outline-none"
            />
          </div>

          {/* City Filter */}
          <div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-xs rounded-xl px-3 py-2.5 text-zinc-200 focus:border-rose-500 outline-none cursor-pointer"
            >
              <option value="all">📍 All Metro Hubs</option>
              {POPULAR_CITIES.slice(1).map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.state})
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-zinc-950 border border-zinc-800 text-xs rounded-xl px-3 py-2.5 text-zinc-200 focus:border-rose-500 outline-none cursor-pointer"
            >
              <option value="name">Sort: Display Name (A-Z)</option>
              <option value="rating">Sort: Client Rating (High to Low)</option>
              <option value="status">Sort: Status</option>
              <option value="age">Sort: Age</option>
            </select>
          </div>
        </div>
      </div>

      {/* Profiles Data Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 border-b border-zinc-800 text-[11px] uppercase font-bold text-zinc-400">
              <tr>
                <th className="py-3.5 px-4">Profile & Slug</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Rate & Rating</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredProfiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-zinc-850/50 transition">
                  {/* Name & Avatar */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={profile.avatarUrl}
                        alt={profile.displayName}
                        referrerPolicy="no-referrer"
                        onError={(e) => handleImageError(e, FALLBACK_PROFILE_IMAGES[profile.id] || FALLBACK_PROFILE_IMAGES.default)}
                        className="w-10 h-10 rounded-xl object-cover border border-zinc-800 bg-zinc-950 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{profile.displayName}, {profile.age}</span>
                          {profile.featured && (
                            <span className="text-[9px] text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded font-bold">
                              VIP
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono">
                          /profiles/{profile.slug}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-zinc-200">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{profile.city}, {profile.state}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">{profile.country}</span>
                  </td>

                  {/* Rates & Rating */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-amber-400">{profile.startingRate || 'Inquire'}</div>
                    <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{profile.rating.toFixed(2)} ({profile.reviewCount})</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {getStatusBadge(profile.status)}
                  </td>

                  {/* Verification */}
                  <td className="py-3.5 px-4">
                    {profile.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" /> ID Verified
                      </span>
                    ) : (
                      <span className="text-zinc-500 text-[11px]">Unverified</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Preview */}
                      <button
                        onClick={() => onNavigatePublic(`/profiles/${profile.slug}`)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
                        title="Preview Public Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => onEditProfile(profile)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
                        title="Edit Profile"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Quick Status Toggles */}
                      {profile.status !== 'published' ? (
                        <button
                          onClick={() => onUpdateStatus(profile.id, 'published')}
                          className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 transition cursor-pointer"
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateStatus(profile.id, 'draft')}
                          className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-medium transition cursor-pointer"
                        >
                          Unpublish
                        </button>
                      )}

                      {profile.status !== 'suspended' && (
                        <button
                          onClick={() => onUpdateStatus(profile.id, 'suspended')}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                          title="Suspend Profile"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to permanently delete profile for ${profile.displayName}?`)) {
                            onDeleteProfile(profile.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-600 text-zinc-400 hover:text-white transition cursor-pointer"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
