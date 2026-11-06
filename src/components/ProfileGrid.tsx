import React from 'react';
import { LayoutGrid, List, ArrowUpDown, Sparkles } from 'lucide-react';
import { Profile } from '../types';
import { ProfileCard } from './ProfileCard';
import { Button } from './ui/Button';

interface ProfileGridProps {
  profiles: Profile[];
  onSelectProfile: (profile: Profile) => void;
  favorites: string[];
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  layoutView?: 'grid' | 'list';
  onLayoutChange?: (view: 'grid' | 'list') => void;
  sortBy?: string;
  onSortChange?: (sort: any) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const ProfileGrid: React.FC<ProfileGridProps> = ({
  profiles,
  onSelectProfile,
  favorites,
  onToggleFavorite,
  layoutView = 'grid',
  onLayoutChange = () => {},
  sortBy = 'recommended',
  onSortChange = () => {},
  onLoadMore,
  hasMore = false,
}) => {
  return (
    <section aria-label="Directory Profile Listings" className="space-y-6">
      {/* Top Header Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/70 border border-zinc-800 p-3 rounded-2xl">
        <div className="text-xs text-zinc-400">
          Showing <strong className="text-white font-bold">{profiles.length}</strong> active verified companions
        </div>

        <div className="flex items-center gap-3">
          {/* Grid vs List View Switcher */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => onLayoutChange('grid')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                layoutView === 'grid'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              aria-label="Grid layout view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onLayoutChange('list')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                layoutView === 'list'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              aria-label="List layout view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort listings"
              className="bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded-xl px-3 py-1.5 focus:border-rose-500 outline-none cursor-pointer"
            >
              <option value="recommended">Featured / Top Picks</option>
              <option value="distance">Nearest Distance</option>
              <option value="rating">Highest Rated (5.0 ★)</option>
              <option value="newest">Newest Members</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid or List Layout Container */}
      <div
        className={
          layoutView === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6'
            : 'flex flex-col gap-4'
        }
      >
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onSelect={onSelectProfile}
            isFavorite={favorites.includes(profile.id)}
            onToggleFavorite={onToggleFavorite}
            layoutView={layoutView}
          />
        ))}
      </div>

      {/* Load More Trigger */}
      {hasMore && onLoadMore && (
        <div className="pt-8 text-center">
          <Button
            variant="secondary"
            size="md"
            onClick={onLoadMore}
            leftIcon={<Sparkles className="w-4 h-4 text-amber-400" />}
          >
            Load More Companion Profiles
          </Button>
        </div>
      )}
    </section>
  );
};
