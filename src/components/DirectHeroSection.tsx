import React, { useState, useEffect } from 'react';
import { MapPin, Search, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { POPULAR_CITIES } from '../data/mockProfiles';

export const HERO_CAROUSEL_IMAGES = [
  {
    url: 'https://photos.ladys.one/prague-escorts-naomi-1168719.webp',
    alt: 'Verified Companions - Prague Naomi',
  },
  {
    url: 'https://pbs.twimg.com/media/HTGPj-ZWQAA4hZx.jpg:large',
    alt: 'Verified Companion Portfolio 1',
  },
  {
    url: 'https://pbs.twimg.com/media/HTVpa4FXsAAb1C7.jpg:large',
    alt: 'Verified Companion Portfolio 2',
  },
  {
    url: 'https://pbs.twimg.com/media/F-wlCP1bIAAPoAE.jpg:large',
    alt: 'Verified Companion Portfolio 3',
  },
  {
    url: 'https://pbs.twimg.com/media/ExpNPqAWUAAel4d.jpg:large',
    alt: 'Verified Companion Portfolio 4',
  },
  {
    url: 'https://pbs.twimg.com/media/F_I8xY_bAAArrI3.jpg:large',
    alt: 'Verified Companion Portfolio 5',
  },
];

interface DirectHeroSectionProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onSelectCity?: (city: string) => void;
  onUseCurrentLocation?: () => void;
  onBrowseProfiles?: () => void;
}

export const DirectHeroSection: React.FC<DirectHeroSectionProps> = ({
  searchQuery = '',
  onSearchChange,
  onSelectCity,
  onUseCurrentLocation,
  onBrowseProfiles,
}) => {
  const [showCityFilter, setShowCityFilter] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance every 1.5 seconds (1500ms) continuously without interruption
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_CAROUSEL_IMAGES.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Preload images into browser cache for instantaneous 1.5s switching
  useEffect(() => {
    HERO_CAROUSEL_IMAGES.forEach((item) => {
      const img = new Image();
      img.referrerPolicy = 'no-referrer';
      img.src = item.url;
    });
  }, []);

  const handleBrowseClick = () => {
    if (onBrowseProfiles) {
      onBrowseProfiles();
      return;
    }
    const target = document.getElementById('available-now-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#081528] text-white border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[660px] items-center">
          {/* Carousel Column (Comes First) */}
          <div className="lg:col-span-5 relative h-full flex items-end justify-center lg:justify-start order-1 lg:order-1">
            <div
              className="relative w-full h-[380px] sm:h-[480px] lg:h-[640px] max-w-lg lg:max-w-none overflow-hidden group select-none rounded-xl lg:rounded-none"
            >
              {/* Carousel Slides */}
              {HERO_CAROUSEL_IMAGES.map((imgItem, idx) => (
                <div
                  key={imgItem.url}
                  className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                    idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={imgItem.url}
                    alt={imgItem.alt}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallbackApplied) {
                        target.dataset.fallbackApplied = 'true';
                        target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80';
                      }
                    }}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ))}

              {/* Gradient mask on right/left to blend seamlessly into #081528 */}
              <div className="absolute inset-y-0 right-0 w-1/3 sm:w-1/4 bg-gradient-to-l from-[#081528] via-[#081528]/80 to-transparent pointer-events-none z-20" />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#081528] via-[#081528]/60 to-transparent pointer-events-none z-20" />
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#081528] to-transparent pointer-events-none z-20" />

              {/* Manual Nav Overlay Arrows on Hover */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide((prev) => (prev - 1 + HERO_CAROUSEL_IMAGES.length) % HERO_CAROUSEL_IMAGES.length);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-slate-950/70 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-slate-700 shadow-xl cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide((prev) => (prev + 1) % HERO_CAROUSEL_IMAGES.length);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-slate-950/70 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-slate-700 shadow-xl cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Bottom-left dark container aesthetic */}
              <div className="hidden lg:block absolute bottom-0 left-0 w-52 h-24 bg-[#050e1b] rounded-tr-2xl border-t border-r border-slate-800/60 shadow-2xl p-4 pointer-events-none z-30">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />
                  <span>100% Direct Contact</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Verified independent profiles in 63k+ cities.
                </p>
              </div>
            </div>
          </div>

          {/* Typography & Action Column (Comes After Carousel) */}
          <div className="lg:col-span-7 pt-12 pb-14 sm:pt-16 sm:pb-20 lg:py-24 z-10 space-y-7 order-2 lg:order-2 pl-0 lg:pl-8">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest">
              <div className="relative flex items-center justify-center p-1 rounded bg-red-600/20 border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                <MapPin className="w-3.5 h-3.5 text-red-500 fill-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.9)]" />
              </div>
              <span>USA & CANADA</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-black tracking-tight leading-[1.05] text-white">
              Independent<br />
              escorts across the<br />
              <span className="text-red-500">USA & Canada</span><span className="text-white">.</span>
            </h1>

            {/* Paragraph Description */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
              Companions in 63,086 cities and towns across all 64 US states, Canadian provinces and territories — from New York and Los Angeles to Toronto and Vancouver. Real profiles. Direct contact. No agencies.
            </p>

            {/* Action Row */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleBrowseClick}
                className="inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-lg shadow-red-950/50 hover:shadow-red-600/20 transition-all duration-200 cursor-pointer"
              >
                <span>Browse profiles</span>
                <MapPin className="w-4 h-4 text-white fill-white" />
              </button>

              <button
                type="button"
                onClick={() => setShowCityFilter(!showCityFilter)}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-4 py-3 rounded-full bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/60 transition cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-red-400" />
                <span>{showCityFilter ? 'Hide quick cities' : 'Filter by city'}</span>
              </button>
            </div>

            {/* Expandable City Quick Select */}
            {showCityFilter && (
              <div className="pt-2 max-w-xl animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>Popular Metropolitan Areas</span>
                    {onUseCurrentLocation && (
                      <button
                        type="button"
                        onClick={onUseCurrentLocation}
                        className="text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>Near Me (Auto)</span>
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_CITIES.map((c) => (
                      <button
                        key={`${c.name}-${c.state}`}
                        type="button"
                        onClick={() => {
                          if (onSelectCity) onSelectCity(c.name);
                          setShowCityFilter(false);
                          handleBrowseClick();
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-red-500/20 hover:text-red-300 text-slate-300 border border-slate-700/70 transition cursor-pointer"
                      >
                        {c.name}{c.state ? `, ${c.state}` : ''}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
