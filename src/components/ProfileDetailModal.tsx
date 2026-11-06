import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, Star, Calendar, MessageCircle, Phone, Lock, Heart, Check, Sparkles, Image as ImageIcon, Copy, Globe, ExternalLink } from 'lucide-react';
import { Profile } from '../types';
import { getPublicPublishedPhotos } from '../services/storageService';
import { GoldVerifiedBadge } from './ui/GoldVerifiedBadge';

interface ProfileDetailModalProps {
  profile: Profile | null;
  onClose: () => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({ profile, onClose }) => {
  if (!profile) return null;

  // Retrieve published photos from local storage database table if populated
  const dbPhotos = getPublicPublishedPhotos(profile.id);
  
  // Build clean, complete unified photo portfolio list
  const galleryList = dbPhotos.length > 0
    ? dbPhotos.sort((a, b) => a.displayOrder - b.displayOrder).map((p) => p.url)
    : (profile as any).galleryPhotos || [profile.avatarUrl];

  // Stateful image swapper for active profile preview
  const [activePreviewImg, setActivePreviewImg] = useState<string>(profile.avatarUrl);
  const [copiedDirectLink, setCopiedDirectLink] = useState(false);

  const displayCover = profile.coverUrl || (galleryList.length > 1 ? galleryList[1] : galleryList[0]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl text-zinc-100 relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition backdrop-blur-md cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover & Avatar Header */}
        <div className="relative h-48 sm:h-64 w-full bg-zinc-950">
          <img
            src={displayCover}
            alt={`${profile.displayName} cover`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />

          {/* Profile Badge Pill */}
          <div className="absolute top-4 left-4 flex gap-2">
            {profile.isVerified && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Govt ID & Photo Verified
              </span>
            )}
          </div>
        </div>

        {/* Profile Content Details */}
        <div className="p-6 sm:p-8 -mt-16 relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <img
                src={activePreviewImg}
                alt={profile.displayName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-zinc-900 shadow-xl bg-zinc-950 animate-in fade-in duration-300"
              />
              <div className="mb-2">
                <h5 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span>{profile.displayName}, {profile.age}</span>
                  {profile.isVerified && <GoldVerifiedBadge size="md" />}
                </h5>
                <div className="flex items-center gap-2 text-xs text-rose-300 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{profile.city}, {profile.state}</span>
                  {profile.distanceMiles && <span>• {profile.distanceMiles} miles away</span>}
                </div>
              </div>
            </div>

            <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 text-right">
              <span className="text-[10px] uppercase text-zinc-400 block font-semibold">Standard Rate</span>
              <span className="text-xl font-extrabold text-amber-400">{profile.startingRate || 'Inquire'}</span>
            </div>
          </div>

          {/* Direct Canonical URL Link */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 px-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
            <div className="flex items-center gap-2 truncate">
              <Globe className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="text-zinc-400 font-semibold text-[11px] shrink-0">Direct URL:</span>
              <a
                href={profile.directUrl || `https://www.topcallgirls.online/profiles/${profile.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-emerald-400 hover:text-emerald-300 hover:underline font-bold text-[11px] truncate"
              >
                {profile.directUrl || `https://www.topcallgirls.online/profiles/${profile.slug}`}
              </a>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(profile.directUrl || `https://www.topcallgirls.online/profiles/${profile.slug}`);
                  setCopiedDirectLink(true);
                  setTimeout(() => setCopiedDirectLink(false), 2000);
                }}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white transition cursor-pointer font-semibold text-[11px] flex items-center gap-1"
                title="Copy Direct URL"
              >
                {copiedDirectLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-rose-400" />}
                <span>{copiedDirectLink ? 'Copied URL!' : 'Copy Direct Link'}</span>
              </button>
              <a
                href={`/profiles/${profile.slug}`}
                className="p-1 px-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[11px] flex items-center gap-1 transition"
                title="Open Direct Profile Page"
              >
                <span>Open Page</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Ratings and Status row */}
          <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-zinc-950/50 border border-zinc-800 text-xs">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{profile.rating.toFixed(2)}</span>
              <span className="text-zinc-500 font-normal">({profile.reviewCount} client reviews)</span>
            </div>

            <div className="h-3 w-px bg-zinc-800" />

            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{profile.isOnline ? 'Currently Available / Fast Response' : 'Pre-booking Only'}</span>
            </div>
          </div>

          {/* About & Bio */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-zinc-400 mb-2">
              About & Introduction
            </h4>
            <p className="text-zinc-300 text-sm leading-relaxed bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/60">
              {profile.bioSnippet}
            </p>
          </div>

          {/* Portfolio Image Gallery (Dynamic Thumbnail Grid) */}
          {galleryList.length > 1 && (
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-zinc-400 mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Photo Portfolio & Gallery ({galleryList.length} Photos)</span>
              </h4>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                {galleryList.map((img: string, idx: number) => {
                  const isActive = img === activePreviewImg;
                  return (
                    <div
                      key={idx}
                      className={`aspect-[4/5] relative rounded-xl border overflow-hidden cursor-pointer shadow-md transition-all duration-300 ${
                        isActive ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-zinc-800 hover:border-zinc-500'
                      }`}
                      onClick={() => setActivePreviewImg(img)}
                    >
                      <img
                        src={img}
                        alt={`Portfolio Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
              <span className="text-[10px] text-zinc-500 mt-1.5 block">
                * Click any thumbnail card to preview the full size photo in the avatar box above.
              </span>
            </div>
          )}

          {/* Services & Offerings */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-zinc-400 mb-2">
              Listed Accompaniments & Services
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {profile.services.map((service) => (
                <div
                  key={service}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-300"
                >
                  <Check className="w-3.5 h-3.5 text-rose-400" />
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Actions */}
          <div className="pt-2 border-t border-zinc-800 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => alert(`Contact request initiated for ${profile.displayName}. Secure routing & encrypted email channels are prepared.`)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-sm shadow-lg shadow-rose-500/20 transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct Message (Secure Outcall Ready)</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
