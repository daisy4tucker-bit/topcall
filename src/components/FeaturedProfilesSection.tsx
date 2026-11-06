import React from 'react';
import { Profile } from '../types';
import { Sparkles } from 'lucide-react';
import { ProfileGrid } from './ProfileGrid';

interface FeaturedProfilesSectionProps {
  profiles: Profile[];
  onSelectProfile: (p: Profile) => void;
  favorites: string[];
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
}

export const FeaturedProfilesSection: React.FC<FeaturedProfilesSectionProps> = ({
  profiles,
  onSelectProfile,
  favorites,
  onToggleFavorite,
}) => {
  const featured = profiles.filter((p) => p.featured);

  if (featured.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-amber-400" />
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Featured VIP Companions</h2>
      </div>
      <ProfileGrid
        profiles={featured}
        onSelectProfile={onSelectProfile}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
      />
    </section>
  );
};
