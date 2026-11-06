import React from 'react';
import { Sparkles, PlusCircle } from 'lucide-react';
import { Profile } from '../types';
import { ProfileGrid } from './ProfileGrid';
import { Pagination } from './Pagination';
import { Button } from './ui/Button';

interface AvailableNowSectionProps {
  profiles: Profile[];
  displayedProfiles: Profile[];
  onSelectProfile: (profile: Profile) => void;
  favorites: string[];
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  layoutView: 'grid' | 'list';
  onLayoutChange: (view: 'grid' | 'list') => void;
  sortBy: string;
  onSortChange: (val: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onOpenCreateProfile?: () => void;
}

export const AvailableNowSection: React.FC<AvailableNowSectionProps> = ({
  profiles,
  displayedProfiles,
  onSelectProfile,
  favorites,
  onToggleFavorite,
  layoutView,
  onLayoutChange,
  sortBy,
  onSortChange,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onOpenCreateProfile,
}) => {
  return (
    <section id="available-now-section" className="bg-[#071322] py-14 sm:py-20 border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Available Nearby
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              4 active verified companions near you.
            </p>
          </div>
        </div>

        {/* Profile Grid or Empty State */}
        {profiles.length > 0 ? (
          <div className="space-y-8">
            <ProfileGrid
              profiles={displayedProfiles}
              onSelectProfile={onSelectProfile}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              layoutView={layoutView}
              onLayoutChange={onLayoutChange}
              sortBy={sortBy}
              onSortChange={onSortChange}
            />

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                totalItems={profiles.length}
                pageSize={pageSize}
              />
            )}
          </div>
        ) : (
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-10 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center mx-auto border border-pink-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">No Profiles Found</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Verified independent profiles will appear directly here with verified badges and photo portfolios.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
