import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  MapPin,
  Star,
  Clock,
  Globe,
  CheckCircle2,
  Calendar,
  Languages,
  Sparkles,
  Heart,
  Share2,
  Eye,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Navigation,
  FileCheck,
  Mail,
  MessageSquare,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { Profile } from '../../types';
import { LocationBreadcrumbs } from '../location/LocationBreadcrumbs';
import { PhotoGalleryModal } from './PhotoGalleryModal';
import { ProfileContactCard } from './ProfileContactCard';
import { ProfileCard } from '../ProfileCard';
import { SocialShareBar } from './SocialShareBar';
import { getPublicPublishedPhotos } from '../../services/storageService';
import { ReportContentModal } from '../moderation/ReportContentModal';
import { ContentRemovalModal } from '../moderation/ContentRemovalModal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { GoldVerifiedBadge } from '../ui/GoldVerifiedBadge';
import { handleImageError, FALLBACK_PROFILE_IMAGES, FALLBACK_COVER_IMAGE } from '../../utils/imageUtils';

interface ProfilePageProps {
  profile: Profile;
  relatedProfiles: Profile[];
  onSelectRelatedProfile: (profile: Profile) => void;
  favorites: string[];
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  onNavigateToLocation: (path: string) => void;
  onBackToDirectory: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  relatedProfiles,
  onSelectRelatedProfile,
  favorites,
  onToggleFavorite,
  onNavigateToLocation,
  onBackToDirectory,
}) => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryInitialIdx, setGalleryInitialIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [removalModalOpen, setRemovalModalOpen] = useState(false);
  const [reportingPhotoUrl, setReportingPhotoUrl] = useState<string | undefined>(undefined);
  const [reportingType, setReportingType] = useState<'profile' | 'photograph'>('profile');
  const [carouselIdx, setCarouselIdx] = useState(0);

  // Retrieve live published authorized photographs from Supabase storage service
  const publishedPhotos = getPublicPublishedPhotos(profile.id);
  const primaryFromStorage = publishedPhotos.find((p) => p.isPrimary);
  const coverFromStorage = publishedPhotos.find((p) => p.isCover);

  const displayAvatar = primaryFromStorage?.url || profile.avatarUrl;
  const displayCover = coverFromStorage?.url || profile.coverUrl;
  const activePhotos = publishedPhotos.length > 0
    ? publishedPhotos.map((p) => p.url)
    : profile.galleryPhotos || [profile.avatarUrl];

  const isFav = favorites.includes(profile.id);

  // Live carousel 2-second interval auto-advance
  useEffect(() => {
    if (activePhotos.length <= 1) return;
    const timer = setInterval(() => {
      setCarouselIdx((prev) => (prev + 1) % activePhotos.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [activePhotos.length]);

  // Construct breadcrumbs
  const breadcrumbItems = [
    { label: 'Directory Home', path: '/' },
    { label: profile.displayName, path: `/profiles/${profile.slug}`, isActive: true },
  ];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const openGalleryAt = (idx: number) => {
    setGalleryInitialIdx(idx);
    setGalleryOpen(true);
  };

  return (
    <article aria-labelledby="profile-title" className="space-y-8 animate-in fade-in duration-300">
      {/* Breadcrumbs */}
      <LocationBreadcrumbs items={breadcrumbItems} onNavigate={onNavigateToLocation} />

      {/* 1. Authorized Photography Gallery (Image Carousel First) */}
      <section aria-labelledby="gallery-title" className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="gallery-title" className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Authorized Photo Portfolio
            </h2>
            <p className="text-xs text-zinc-400">
              Biometrically matched and verified photographs for {profile.displayName}.
            </p>
          </div>
          <button
            onClick={() => openGalleryAt(0)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Full Portfolio ({activePhotos.length})</span>
          </button>
        </div>

        {/* Live Auto-Advancing Photo Carousel (2s interval, no buttons or indicators) */}
        <div className="relative aspect-[4/5] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-xl">
          <img
            src={activePhotos[carouselIdx] || displayAvatar}
            alt={`${profile.displayName} portfolio photo ${carouselIdx + 1}`}
            referrerPolicy="no-referrer"
            onError={(e) => handleImageError(e, FALLBACK_PROFILE_IMAGES[profile.id] || FALLBACK_PROFILE_IMAGES.default)}
            className="w-full h-full object-cover cursor-pointer transition-all duration-700 ease-in-out"
            onClick={() => openGalleryAt(carouselIdx)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-850">
          <span>All photographs subject to 18 U.S.C. § 2257 record-keeping compliance.</span>
          <button
            onClick={() => setRemovalModalOpen(true)}
            className="text-rose-400 hover:underline cursor-pointer font-medium"
          >
            DMCA / Content Takedown Notice &rarr;
          </button>
        </div>
      </section>

      {/* Profile Header Hero */}
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Cover Image */}
        <div className="relative h-56 sm:h-72 md:h-80 w-full bg-zinc-950">
          <img
            src={displayCover}
            alt={`${profile.displayName} cover banner`}
            referrerPolicy="no-referrer"
            onError={(e) => handleImageError(e, FALLBACK_COVER_IMAGE)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />

          {/* Top Floating Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <button
              onClick={onBackToDirectory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs font-semibold backdrop-blur-md transition cursor-pointer border border-zinc-700/60"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => onToggleFavorite(e, profile.id)}
                className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition cursor-pointer border border-zinc-700/60"
                aria-label={isFav ? 'Remove from favorites' : 'Save profile'}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs font-semibold backdrop-blur-md transition cursor-pointer border border-zinc-700/60"
                aria-label="Share profile link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>
              <button
                onClick={() => {
                  setReportingType('profile');
                  setReportingPhotoUrl(undefined);
                  setReportModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-rose-950/60 text-zinc-300 hover:text-rose-300 text-xs font-semibold backdrop-blur-md transition cursor-pointer border border-zinc-700/60"
                aria-label="Report profile"
                title="Report profile for compliance review"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Identity Bar */}
        <div className="p-6 sm:p-8 -mt-20 sm:-mt-24 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            {/* Avatar & Main Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative">
                <img
                  src={displayAvatar}
                  alt={profile.displayName}
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, FALLBACK_PROFILE_IMAGES[profile.id] || FALLBACK_PROFILE_IMAGES.default)}
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-zinc-900 shadow-2xl bg-zinc-950"
                />
                {(profile.isOnline && (profile.displayName.toLowerCase().includes('aria sterling') || profile.slug === 'aria-sterling' || profile.id === '3')) && (
                  <span className="absolute bottom-2 right-2 flex items-center justify-center" title="Online Now">
                    <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-80" />
                    <span className="sonar-beeping absolute inline-flex h-5 w-5 rounded-full bg-emerald-500/40" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-zinc-900 shadow-[0_0_8px_#34d399]" />
                  </span>
                )}
              </div>

              <div className="space-y-1.5 flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 id="profile-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                      <span>{profile.displayName}, {profile.age}</span>
                      {profile.isVerified && <GoldVerifiedBadge size="md" />}
                    </h1>
                    {profile.isVerified && (
                      <Badge
                        variant="success"
                        size="sm"
                        icon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                      >
                        Govt ID Verified
                      </Badge>
                    )}
                    {profile.featured && (
                      <Badge
                        variant="warning"
                        size="sm"
                        icon={<Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                      >
                        VIP Member
                      </Badge>
                    )}
                  </div>

                  {/* Top Action Buttons (Email & Book) matching the sample image */}
                  <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                    <a
                      href={profile.slug === 'aria-sterling' ? "mailto:Wellness4alls@gmail.com?subject=Massage%20Therapy%20Inquiry" : `mailto:${profile.contactInfo?.inquiryEmail || 'inquiry@aura-directory.com'}?subject=Inquiry%20for%20${profile.displayName}`}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs shadow-md transition border border-zinc-700/80 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-rose-400" />
                      <span>Email</span>
                    </a>
                    <a
                      href={profile.slug === 'aria-sterling' ? "sms:+16233406916?body=Hey,%20i%20found%20your%20ad.%20Are%20you%20available%20now." : `sms:?body=Inquiry%20for%20${profile.displayName}`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Text</span>
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300 font-medium">
                  <span className="text-zinc-400 font-mono">{profile.handle}</span>
                </div>

                {(profile.slug === 'aria-sterling' || profile.displayName.toLowerCase().includes('aria')) && (
                  <div className="pt-1.5">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-500/25 text-emerald-200 font-black text-sm sm:text-base border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.6)] tracking-wide">
                      <Sparkles className="w-4 h-4 text-emerald-300" />
                      Wellness4all
                    </span>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-zinc-300 italic font-medium pt-1">
                  "{profile.tagline}"
                </p>
              </div>
            </div>

            {/* Status & Rates Box */}
            <div className="flex sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800 shrink-0">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
                  Honorarium / Rate
                </span>
                <span className="text-xl sm:text-2xl font-black text-amber-400">
                  {profile.startingRate || 'Inquire'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-500 block">
                  Last Updated: {profile.lastUpdated}
                </span>
                <div className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{profile.availability.statusText}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Gallery, Bio, Services, Languages */}
        <div className="lg:col-span-2 space-y-8">
          {/* 2. Public Biography & Introduction */}
          <section aria-labelledby="about-title" className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 id="about-title" className="text-lg sm:text-xl font-bold text-white tracking-tight">
              About & Accompaniment Profile
            </h2>
            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
              {profile.fullDescription}
            </p>

            {/* Voluntary Languages Spoken */}
            {profile.languages && profile.languages.length > 0 && (
              <div className="pt-4 border-t border-zinc-800/80">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-rose-400" />
                  <span>Languages Spoken (Voluntary Disclosure):</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang) => (
                    <span
                      key={lang}
                      className="text-xs px-3 py-1 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* 3. Listed Services & Offerings */}
          <section aria-labelledby="services-title" className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 id="services-title" className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Accompaniments & Specializations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.services.map((service) => (
                <div
                  key={service}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-200 font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Client Reviews & Testimonials */}
          <section aria-labelledby="reviews-title" className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 id="reviews-title" className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Client Reviews & Testimonials ({profile.reviews?.length || profile.reviewCount})
                </h2>
                <p className="text-xs text-zinc-400">
                  Verified client feedback and ratings for {profile.displayName}.
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl text-amber-400 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{profile.rating.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-4">
              {profile.reviews && profile.reviews.length > 0 ? (
                profile.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{rev.authorName}</span>
                        {rev.verifiedClient && (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Verified Client
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-zinc-500">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-zinc-400 text-xs">
                  No public reviews recorded yet. All engagements are strictly confidential.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right 1 Column: Availability, Contact Form, Trust Badge */}
        <div className="space-y-6">
          {/* Public Availability Schedule Card */}
          <section aria-labelledby="availability-title" className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4" /> Availability Schedule
            </div>
            <h3 id="availability-title" className="text-lg font-bold text-white tracking-tight">
              Hours & Booking Logistics
            </h3>
            <div className="space-y-3 text-xs">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex justify-between items-center">
                <span className="text-zinc-400">Current Status:</span>
                <span className="font-bold text-emerald-400">{profile.availability.statusText}</span>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex justify-between items-center">
                <span className="text-zinc-400">Active Hours:</span>
                <span className="font-bold text-zinc-200">{profile.availability.hours}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className={`p-2.5 rounded-xl border text-center font-semibold text-xs ${
                  profile.availability.incallAvailable
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                }`}>
                  {profile.availability.incallAvailable ? '✓ Incall Available' : '✕ No Incall'}
                </div>
                <div className={`p-2.5 rounded-xl border text-center font-semibold text-xs ${
                  profile.availability.outcallAvailable
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                }`}>
                  {profile.availability.outcallAvailable ? '✓ Outcall Available' : '✕ No Outcall'}
                </div>
              </div>
              {profile.availability.travelCities && (
                <div className="pt-2 text-[11px] text-zinc-400">
                  {profile.availability.travelCities.map(city => (
                    <span key={city} className="font-semibold text-zinc-300">{city}</span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Public Contact Form Card */}
          <ProfileContactCard profile={profile} />

          {/* Social Share & Direct HTML <a href> Backlink Generator */}
          <SocialShareBar
            displayName={profile.displayName}
            tagline={profile.tagline}
            slug={profile.slug}
          />

          {/* Compliance & Trust Seal */}
          <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800/80 text-xs text-zinc-400 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Creator Guarantee</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Official age (18+) and government photo ID verified under 18 U.S.C. 2257 compliance guidelines. Strict zero-tolerance against exploitation or commercial non-consensual solicitation.
            </p>
          </div>

          {/* 18+ Disclaimer Box */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-zinc-400 text-[11px] leading-relaxed flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="px-2 py-0.5 rounded-lg bg-red-600 text-white font-extrabold text-[11px] shrink-0">
              18+
            </span>
            <p className="text-zinc-400">
              This website contains adult content and is intended for adults aged 18 or over (19 where that is the age of majority). By using this site you confirm you are of legal age in your province or territory. CallGirls City is an advertising platform only — we are not an escort agency, we do not arrange meetings, and we take no part in any arrangement made between users and advertisers.
            </p>
          </div>
        </div>
      </div>

      {/* Photo Lightbox Modal */}
      <PhotoGalleryModal
        photos={activePhotos}
        initialIndex={galleryInitialIdx}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        creatorName={profile.displayName}
      />

      {/* Safety & Incident Reporting Modal */}
      <ReportContentModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        targetType={reportingType}
        profileId={profile.id}
        profileSlug={profile.slug}
        profileName={profile.displayName}
        photoUrl={reportingPhotoUrl}
      />

      {/* Content Removal / DMCA Takedown Modal */}
      <ContentRemovalModal
        isOpen={removalModalOpen}
        onClose={() => setRemovalModalOpen(false)}
        targetProfileSlug={profile.slug}
      />

      {/* Mobile Sticky Quick Action Bar for Instant Visibility */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 p-3 sm:hidden flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex items-center gap-2">
          <img src={displayAvatar} alt={profile.displayName} className="w-9 h-9 rounded-xl object-cover border border-zinc-700" />
          <div>
            <div className="text-white font-bold text-xs truncate max-w-[120px]">{profile.displayName}</div>
            <div className="text-emerald-400 font-semibold text-[10px]">{profile.startingRate || 'Inquire'}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={profile.slug === 'aria-sterling' ? "mailto:Wellness4alls@gmail.com?subject=Massage%20Therapy%20Inquiry" : `mailto:${profile.contactInfo?.inquiryEmail || 'inquiry@aura-directory.com'}?subject=Inquiry%20for%20${profile.displayName}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 text-white font-bold text-xs border border-zinc-700 shadow"
          >
            <Mail className="w-3.5 h-3.5 text-rose-400" />
            <span>Email</span>
          </a>
          <a
            href={profile.slug === 'aria-sterling' ? "sms:+16233406916?body=Hey,%20i%20found%20your%20ad.%20Are%20you%20available%20now." : `sms:?body=Inquiry%20for%20${profile.displayName}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Text</span>
          </a>
        </div>
      </div>
    </article>
  );
};
