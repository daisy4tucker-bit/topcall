import React, { useState } from 'react';
import { MapPin, Globe, Sparkles, ShieldCheck, ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { Country, StateProvince, City, BreadcrumbItem } from '../../types/location';
import { Profile, FilterState } from '../../types';
import { LocationBreadcrumbs } from './LocationBreadcrumbs';
import { ProfileGrid } from '../ProfileGrid';
import { Pagination } from '../Pagination';
import { EmptyStates } from '../EmptyStates';
import { InternalLinkNetwork } from '../seo/InternalLinkNetwork';
import { Button } from '../ui/Button';

interface LocationPageViewProps {
  country: Country;
  state: StateProvince | null;
  city: City | null;
  breadcrumbs: BreadcrumbItem[];
  profiles: Profile[];
  onSelectProfile: (profile: Profile) => void;
  favorites: string[];
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  onNavigateToLocation: (path: string) => void;
  onBackToAll: () => void;
}

export const LocationPageView: React.FC<LocationPageViewProps> = ({
  country,
  state,
  city,
  breadcrumbs,
  profiles,
  onSelectProfile,
  favorites,
  onToggleFavorite,
  onNavigateToLocation,
  onBackToAll,
}) => {
  const [layoutView, setLayoutView] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('recommended');
  const pageSize = 6;

  // Title generation based on level
  const title = city
    ? `${city.name} Escorts & Verified Companions`
    : state
    ? `${state.name} Companion Directory`
    : `${country.name} Companion Directory`;

  const heroSubtitle = city
    ? city.description || `Browse verified independent companions and private escorts in ${city.name}, ${city.stateCode}.`
    : state
    ? `Explore active verified profiles across cities in ${state.name}, ${country.name}.`
    : `Browse verified companion listings across all states and provinces in ${country.name}.`;

  const totalListings = city
    ? city.activeListings
    : state
    ? state.activeListings
    : country.activeListings;

  // Paginated profiles
  const totalPages = Math.ceil(profiles.length / pageSize);
  const displayedProfiles = profiles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Breadcrumbs */}
      <LocationBreadcrumbs items={breadcrumbs} onNavigate={onNavigateToLocation} />

      {/* Hero Location Header */}
      <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
        {city?.heroImage && (
          <div className="absolute inset-0">
            <img
              src={city.heroImage}
              alt={city.name}
              className="w-full h-full object-cover opacity-20 filter blur-[1px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-900/60" />
          </div>
        )}

        <div className="relative z-10 p-6 sm:p-10 space-y-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-semibold text-zinc-300 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Directory</span>
            </button>
            <span className="text-sm">{country.flag}</span>
            <span className="text-xs text-zinc-400 font-medium">
              {country.name} {state ? `• ${state.name}` : ''}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {title}
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            {heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% ID Verified Listings</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{profiles.length} Profiles in this selection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sibling / Sub-location quick selector */}
      {state && (
        <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-2xl">
          <div className="text-xs font-semibold text-zinc-400 mb-2.5">
            Cities in {state.name}:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigateToLocation(`/${country.slug}/${state.slug}/`)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                !city
                  ? 'bg-rose-500 text-white font-bold'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-300 hover:border-zinc-700'
              }`}
            >
              All {state.name} ({state.activeListings})
            </button>
            {state.cities.map((c) => {
              const isSelected = city?.slug === c.slug;
              return (
                <button
                  key={c.slug}
                  onClick={() => onNavigateToLocation(`/${country.slug}/${state.slug}/${c.slug}/`)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isSelected
                      ? 'bg-rose-500 text-white font-bold'
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  {c.name} ({c.activeListings})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Profile Listings Container */}
      {profiles.length > 0 ? (
        <div className="space-y-6">
          <ProfileGrid
            profiles={displayedProfiles}
            onSelectProfile={onSelectProfile}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            layoutView={layoutView}
            onLayoutChange={setLayoutView}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={profiles.length}
            pageSize={pageSize}
          />
        </div>
      ) : (
        <EmptyStates
          type="location"
          title={`No Active Listings in ${city?.name || state?.name || country.name}`}
          description="We are currently onboarding verified independent creators in this region. Explore nearby metro hubs or post a profile listing."
          actionLabel="Explore All Cities"
          onAction={onBackToAll}
        />
      )}

      {/* Internal SEO Linking Silo Network */}
      <InternalLinkNetwork
        currentCitySlug={city?.slug}
        currentStateSlug={state?.slug}
        currentCountrySlug={country.slug}
        onNavigate={onNavigateToLocation}
      />
    </div>
  );
};
