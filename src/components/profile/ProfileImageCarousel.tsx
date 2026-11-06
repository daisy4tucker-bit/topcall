import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, ShieldAlert, Sparkles, Camera } from 'lucide-react';

interface ProfileImageCarouselProps {
  photos: string[];
  displayName: string;
  onOpenLightbox: (index: number) => void;
  onReportPhoto: (photoUrl: string) => void;
  onOpenRemovalModal: () => void;
}

export const ProfileImageCarousel: React.FC<ProfileImageCarouselProps> = ({
  photos,
  displayName,
  onOpenLightbox,
  onReportPhoto,
  onOpenRemovalModal,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  if (!photos || photos.length === 0) return null;

  const totalPhotos = photos.length;

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? totalPhotos - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === totalPhotos - 1 ? 0 : prev + 1));
  };

  // Touch swipe support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      // Swiped left -> next
      handleNext();
    } else if (diff < -50) {
      // Swiped right -> prev
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section aria-labelledby="carousel-title" className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-300 text-xs font-semibold mb-1">
            <Camera className="w-3.5 h-3.5" /> Photo Carousel
          </div>
          <h2 id="carousel-title" className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Authorized Photo Portfolio
          </h2>
          <p className="text-xs text-zinc-400">
            Swipe or use arrows to view verified photographs for {displayName}.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenLightbox(currentIndex)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">Fullscreen</span> ({currentIndex + 1}/{totalPhotos})
        </button>
      </div>

      {/* Main Carousel Viewport */}
      <div
        className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 select-none group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={photos[currentIndex]}
          alt={`${displayName} photo ${currentIndex + 1}`}
          className="w-full h-full object-cover object-center cursor-pointer transition-transform duration-300 group-hover:scale-[1.01]"
          onClick={() => onOpenLightbox(currentIndex)}
          loading="eager"
        />

        {/* Gradient shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Counter Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold border border-zinc-700/60 flex items-center gap-1.5 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Photo {currentIndex + 1} of {totalPhotos}</span>
        </div>

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {/* Lightbox Trigger */}
          <button
            type="button"
            onClick={() => onOpenLightbox(currentIndex)}
            className="p-2 rounded-xl bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-zinc-700/60 transition cursor-pointer shadow-md"
            title="Expand to Fullscreen Lightbox"
            aria-label="Expand image"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Report Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReportPhoto(photos[currentIndex]);
            }}
            className="p-2 rounded-xl bg-black/70 hover:bg-rose-950/80 text-zinc-300 hover:text-rose-300 backdrop-blur-md border border-zinc-700/60 transition cursor-pointer shadow-md"
            title="Report this photograph for compliance review"
            aria-label="Report photograph"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* Left Arrow Button */}
        {totalPhotos > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-zinc-700/80 flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-105 active:scale-95"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6 text-zinc-100" />
          </button>
        )}

        {/* Right Arrow Button */}
        {totalPhotos > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-zinc-700/80 flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-105 active:scale-95"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6 text-zinc-100" />
          </button>
        )}

        {/* Tap to expand hint on mobile */}
        <div className="absolute bottom-3 left-3 text-[11px] text-zinc-300 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-md border border-zinc-800/80 hidden sm:block">
          Click image to view high-res full portfolio
        </div>
      </div>

      {/* Thumbnails Row */}
      {totalPhotos > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
          {photos.map((photo, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-rose-500 ring-2 ring-rose-500/40 scale-105 shadow-lg'
                    : 'border-zinc-800 opacity-60 hover:opacity-100 hover:border-zinc-600'
                }`}
                aria-label={`Go to photo ${idx + 1}`}
              >
                <img
                  src={photo}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {isActive && (
                  <span className="absolute inset-0 bg-rose-500/10 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Compliance footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-800/80 gap-2">
        <span>All photographs subject to 18 U.S.C. § 2257 record-keeping compliance.</span>
        <button
          type="button"
          onClick={onOpenRemovalModal}
          className="text-rose-400 hover:underline cursor-pointer font-medium"
        >
          DMCA / Content Takedown Notice &rarr;
        </button>
      </div>
    </section>
  );
};
