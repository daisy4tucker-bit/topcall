import React, { useState } from 'react';
import { ShieldCheck, MapPin, Star, Heart, Sparkles, ChevronRight, Check, Camera, Languages, Copy, Globe } from 'lucide-react';
import { Profile } from '../types';
import { getPublicPublishedPhotos } from '../services/storageService';
import { Badge } from './ui/Badge';
import { GoldVerifiedBadge } from './ui/GoldVerifiedBadge';
import { handleImageError, FALLBACK_PROFILE_IMAGES } from '../utils/imageUtils';

interface ProfileCardProps {
  profile: Profile;
  onSelect: (profile: Profile) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent, id: string) => void;
  layoutView?: 'grid' | 'list';
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
  layoutView = 'grid',
}) => {
  const profileUrl = `/profiles/${profile.slug}`;
  const canonicalDirectUrl = profile.directUrl || `https://www.topcallgirls.online/profiles/${profile.slug}`;
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Allow default browser behavior for right clicks, cmd+click, ctrl+click, middle click
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    e.preventDefault();
    onSelect(profile);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(e, profile.id);
    }
  };

  const publishedPhotos = getPublicPublishedPhotos(profile.id);
  const primaryPhoto = publishedPhotos.find((p) => p.isPrimary);
  const activeAvatar = primaryPhoto?.url || profile.avatarUrl;
  const photoCount = publishedPhotos.length > 0 ? publishedPhotos.length : profile.galleryPhotos?.length || 1;
  const isAriaSterling = Boolean(
    profile.displayName?.toLowerCase().includes('aria sterling') ||
    profile.slug === 'aria-sterling' ||
    profile.id === '3'
  );

  if (layoutView === 'list') {
    return (
      <a
        href={profileUrl}
        onClick={handleCardClick}
        aria-label={`View profile for ${profile.displayName}`}
        className={`group relative bg-[#081528] ${
          isAriaSterling
            ? 'border-emerald-500/50 shadow-[0_0_24px_rgba(16,185,129,0.18)] hover:border-emerald-400/80 ring-1 ring-emerald-500/30'
            : 'border-slate-800/90 hover:border-red-500/50'
        } rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] hover:-translate-y-0.5 flex flex-col sm:flex-row cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 no-underline text-inherit block`}
      >
        {/* List Image */}
        <div className="relative w-full sm:w-52 aspect-[4/3] sm:aspect-auto overflow-hidden bg-slate-950 shrink-0">
          <img
            src={activeAvatar}
            alt={profile.displayName}
            referrerPolicy="no-referrer"
            onError={(e) => handleImageError(e, FALLBACK_PROFILE_IMAGES[profile.id] || FALLBACK_PROFILE_IMAGES.default)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Photo Count badge */}
          <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold">
            <Camera className="w-3 h-3 text-red-400" />
            <span>{photoCount}</span>
          </span>
          {/* Online Tag: ONLY for Aria Sterling div with visible beeping sonar effect */}
          {isAriaSterling && (
            <span
              className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/90 border border-emerald-400/80 shadow-[0_0_15px_rgba(16,185,129,0.65)] backdrop-blur-md text-emerald-300 text-[10px] font-bold tracking-wide select-none"
              title="Aria Sterling is Online Now (Active Beacon)"
            >
              {/* Radar Beeping Ping Dot */}
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-90" />
                <span className="sonar-beeping absolute inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500/40" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              </span>
              <span>Online</span>
              {/* Beeping Soundwave Radar Bars */}
              <span className="flex items-end gap-0.5 h-2.5 ml-0.5">
                <span className="w-0.5 h-1.5 bg-emerald-400 animate-pulse rounded-full" />
                <span className="w-0.5 h-2.5 bg-emerald-400 animate-pulse delay-100 rounded-full" />
                <span className="w-0.5 h-2 bg-emerald-400 animate-pulse delay-200 rounded-full" />
              </span>
            </span>
          )}
        </div>

        {/* List Body */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                    <span>{profile.displayName}, {profile.age}</span>
                    {profile.isVerified && (
                      <GoldVerifiedBadge size="sm" />
                    )}
                  </h5>
                  {profile.isVerified && (
                    <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3 h-3 text-emerald-400" />}>
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
                  {profile.distanceMiles && <span className="text-slate-500">{profile.distanceMiles} mi from center</span>}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Rate</span>
                <span className="text-sm font-bold text-amber-400">{profile.startingRate || 'Inquire'}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed pt-1">
              {profile.bioSnippet}
            </p>

            {/* Languages summary if available */}
            {profile.languages && profile.languages.length > 0 && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-0.5">
                <Languages className="w-3 h-3 text-slate-500" />
                <span>{profile.languages.slice(0, 2).join(', ')}</span>
              </div>
            )}

            {/* Direct Profile Canonical URL */}
            <div className="flex items-center justify-between text-[11px] p-1.5 px-2.5 rounded-lg bg-black/60 border border-slate-800/80 mt-1">
              <span className="font-mono text-emerald-400 text-[10px] truncate">
                topcallgirls.online/profiles/{profile.slug}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigator.clipboard?.writeText(canonicalDirectUrl);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="text-[10px] text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition cursor-pointer font-semibold flex items-center gap-1 shrink-0 ml-1.5"
                title={`Copy direct URL for ${profile.displayName}`}
              >
                {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-rose-400" />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between mt-3 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{profile.rating.toFixed(2)}</span>
              <span className="text-slate-400 font-normal">({profile.reviewCount})</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleFavoriteClick}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                aria-label="Save to favorites"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-red-500' : ''}`} />
              </button>
              <span className="text-red-400 text-xs font-semibold group-hover:translate-x-0.5 transition flex items-center gap-1">
                View Profile <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={profileUrl}
      onClick={handleCardClick}
      aria-label={`View profile for ${profile.displayName}`}
      className={`group relative bg-[#081528] ${
        isAriaSterling
          ? 'border-emerald-500/50 shadow-[0_0_24px_rgba(16,185,129,0.18)] hover:border-emerald-400/80 ring-1 ring-emerald-500/30'
          : 'border-slate-800/90 hover:border-red-500/50'
      } rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 flex flex-col cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 no-underline text-inherit block`}
    >
      {/* Photo Header */}
      <div className="relative aspect-[4/4] sm:aspect-[4/5] w-full overflow-hidden bg-slate-950">
        <img
          src={activeAvatar}
          alt={profile.displayName}
          referrerPolicy="no-referrer"
          onError={(e) => handleImageError(e, FALLBACK_PROFILE_IMAGES[profile.id] || FALLBACK_PROFILE_IMAGES.default)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#081528] via-[#081528]/30 to-transparent opacity-95" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {profile.isVerified && (
              <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3 h-3 text-emerald-400" />}>
                Verified
              </Badge>
            )}
            {profile.featured && (
              <Badge variant="warning" size="sm" icon={<Sparkles className="w-3 h-3 text-amber-400" />}>
                VIP
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Online Tag: ONLY for Aria Sterling div with visible beeping sonar effect */}
            {isAriaSterling && (
              <span
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/90 border border-emerald-400/80 shadow-[0_0_15px_rgba(16,185,129,0.65)] backdrop-blur-md text-emerald-300 text-[11px] font-bold tracking-wide select-none"
                title="Aria Sterling is Online Now (Active Beacon)"
              >
                {/* Radar Beeping Ping Dot */}
                <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-90" />
                  <span className="sonar-beeping absolute inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500/40" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                </span>
                <span>Online</span>
                {/* Beeping Soundwave Radar Bars */}
                <span className="flex items-end gap-0.5 h-2.5 ml-0.5">
                  <span className="w-0.5 h-1.5 bg-emerald-400 animate-pulse rounded-full" />
                  <span className="w-0.5 h-2.5 bg-emerald-400 animate-pulse delay-100 rounded-full" />
                  <span className="w-0.5 h-2 bg-emerald-400 animate-pulse delay-200 rounded-full" />
                </span>
              </span>
            )}
            <button
              type="button"
              onClick={handleFavoriteClick}
              className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-slate-300 hover:text-white backdrop-blur-md transition cursor-pointer"
              aria-label={isFavorite ? 'Remove from saved' : 'Save profile'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-red-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom Image Overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400 drop-shadow">
                {profile.distanceMiles && (
                  <span className="text-[11px] text-slate-400 font-normal">
                    {profile.distanceMiles} mi from center
                  </span>
                )}
              </div>
              <h5 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5 mt-0.5">
                <span>{profile.displayName}, {profile.age}</span>
                {profile.isVerified && (
                  <GoldVerifiedBadge size="sm" />
                )}
              </h5>
            </div>
            {profile.startingRate && (
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-400 block font-medium">From</span>
                <span className="text-xs font-bold text-amber-300 bg-black/70 px-2 py-0.5 rounded-md border border-amber-500/30">
                  {profile.startingRate}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body Info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <p className="text-xs text-slate-200 font-medium line-clamp-1 italic mb-1.5">
            "{profile.tagline}"
          </p>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {profile.bioSnippet}
          </p>
        </div>

        {/* Service tags */}
        <div className="flex flex-wrap gap-1.5">
          {profile.services.slice(0, 3).map((s) => (
            <span
              key={s}
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50"
            >
              {s}
            </span>
          ))}
          {profile.services.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800/50 text-slate-500">
              +{profile.services.length - 3}
            </span>
          )}
        </div>

        {/* Direct Profile Canonical URL */}
        <div className="flex items-center justify-between text-[10px] p-1.5 px-2 rounded-lg bg-black/50 border border-slate-800/80">
          <span className="font-mono text-emerald-400/90 truncate">
            topcallgirls.online/profiles/{profile.slug}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigator.clipboard?.writeText(canonicalDirectUrl);
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 2000);
            }}
            className="text-[10px] text-slate-300 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition cursor-pointer font-medium flex items-center gap-1 shrink-0 ml-1"
            title={`Copy direct URL for ${profile.displayName}`}
          >
            {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-rose-400" />}
            <span>{copiedLink ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-amber-400 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{profile.rating.toFixed(2)}</span>
            <span className="text-slate-400 font-normal">({profile.reviewCount})</span>
          </div>

          <span className="flex items-center gap-1 text-xs font-semibold text-red-400 group-hover:text-red-300 transition">
            <span>View Profile</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </a>
  );
};
